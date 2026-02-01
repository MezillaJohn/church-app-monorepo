<?php

namespace App\Filament\Resources\BookPurchases\Pages;

use App\Filament\Resources\BookPurchases\BookPurchaseResource;
use App\Filament\Resources\BookPurchases\Widgets\BookPurchasesStatsOverview;
use Filament\Actions\CreateAction;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Resources\Pages\ListRecords;

class ListBookPurchases extends ListRecords
{
    protected static string $resource = BookPurchaseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            BookPurchasesStatsOverview::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Purchases'),
            'completed' => Tab::make('Completed')
                ->modifyQueryUsing(fn($query) => $query->where('status', 'completed')),
            'pending' => Tab::make('Pending')
                ->modifyQueryUsing(fn($query) => $query->where('status', 'pending')),
            'failed' => Tab::make('Failed')
                ->modifyQueryUsing(fn($query) => $query->where('status', 'failed')),
        ];
    }
}
