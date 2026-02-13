<?php

namespace App\Filament\Actions;

use Filament\Actions\Action;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Closure;

class ExportWithTotalsAction extends Action
{
    protected array $totalsColumns = [];

    public static function getDefaultName(): ?string
    {
        return 'export_csv';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->label('Export CSV')
            ->icon('heroicon-o-arrow-down-tray')
            ->action(function (Table $table): StreamedResponse {

                // Get the filtered query from the table
                $query = $table->getQuery();

                // Clone the query to avoid modifying the table's state
                $query = $query->clone();

                // Get visible columns. Note: Filament's getVisibleColumns() might vary by version.
                // Assuming standard Filament table setup.
                $columns = $table->getColumns();
                $visibleColumns = array_filter($columns, fn($column) => !$column->isHidden());

                // Prepare Headers
                $headers = array_map(fn($column) => $column->getLabel(), $visibleColumns);

                $filename = 'export_' . now()->format('Y-m-d_H-i-s') . '.csv';

                return response()->streamDownload(function () use ($query, $visibleColumns, $headers) {
                    $handle = fopen('php://output', 'w');

                    // Add BOM for Excel compatibility
                    fputs($handle, "\xEF\xBB\xBF");

                    fputcsv($handle, $headers);

                    $totalCount = 0;
                    $columnTotals = array_fill_keys($this->totalsColumns, 0);

                    // Process in chunks to handle large datasets
                    $query->chunk(100, function ($records) use ($handle, $visibleColumns, &$totalCount, &$columnTotals) {
                        foreach ($records as $record) {
                            $totalCount++;
                            $row = [];

                            foreach ($visibleColumns as $columnName => $column) {
                                // Extract the value from the record based on the column name / relationship
                                $key = $column->getName();

                                // Handling relationships (e.g., user.name)
                                if (str_contains($key, '.')) {
                                    $value = data_get($record, $key);
                                } else {
                                    // Direct attribute access
                                    $value = $record->getAttribute($key);
                                }

                                // Handle Enums
                                if ($value instanceof \BackedEnum) {
                                    $value = $value->value;
                                } elseif ($value instanceof \UnitEnum) {
                                    $value = $value->name;
                                }

                                // Format if necessary (e.g. dates, enums) - keeping it simple for now as raw export often preferred
                                // If needed, we could call formatStateUsing() but that requires the column to be bound to a record in the loop.
    
                                $row[] = $value;

                                // Sum totals if applicable
                                if (in_array($key, $this->totalsColumns) && is_numeric($value)) {
                                    $columnTotals[$key] += $value;
                                }
                            }
                            fputcsv($handle, $row);
                        }
                    });

                    // Add Summary Row
                    $summaryRow = [];
                    $firstColumn = true;

                    foreach ($visibleColumns as $columnName => $column) {
                        $key = $column->getName();

                        if ($firstColumn) {
                            $summaryRow[] = "Total Records: " . $totalCount;
                            $firstColumn = false;
                        } elseif (in_array($key, $this->totalsColumns)) {
                            $summaryRow[] = $columnTotals[$key];
                        } else {
                            $summaryRow[] = '';
                        }
                    }

                    fputcsv($handle, $summaryRow);
                    fclose($handle);

                }, $filename);
            });
    }

    public function withTotals(array $columns): static
    {
        $this->totalsColumns = $columns;
        return $this;
    }
}
