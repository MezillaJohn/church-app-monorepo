<?php

namespace App\Filament\Resources\Subaccounts\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SubaccountsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('creation_method')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'automatic' => 'success',
                        'manual' => 'warning',
                    }),
                TextColumn::make('business_name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('paystack_subaccount_code')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('settlement_bank')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('account_number')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('percentage_charge')
                    ->numeric(2)
                    ->suffix('%')
                    ->sortable(),
                TextColumn::make('creator.name')
                    ->label('Created By')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                \Filament\Actions\DeleteAction::make()
                    ->before(function ($record) {
                        if (!empty($record->paystack_subaccount_code)) {
                            try {
                                app(\App\Services\PaystackService::class)->deleteSubaccount($record->paystack_subaccount_code);

                                \Filament\Notifications\Notification::make()
                                    ->success()
                                    ->title('Paystack Subaccount Deleted')
                                    ->body('The subaccount has been deleted from Paystack.')
                                    ->send();
                            } catch (\Exception $e) {
                                \Filament\Notifications\Notification::make()
                                    ->danger()
                                    ->title('Paystack Deletion Failed')
                                    ->body('Could not delete subaccount from Paystack: ' . $e->getMessage())
                                    ->send();

                                // Halt deletion if Paystack fails? 
                                // Or allow local deletion?
                                // Let's halt to ensure consistency, but user can always manually delete via database if desperate.
                                $action = \Filament\Actions\DeleteAction::make(); // Dummy for IDE
                                // In a closure, we can't easily access $action->halt(). 
                                // Throwing an exception works to stop the action.
                                throw $e;
                            }
                        }
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
