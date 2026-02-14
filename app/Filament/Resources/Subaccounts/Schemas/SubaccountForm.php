<?php

namespace App\Filament\Resources\Subaccounts\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SubaccountForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Schemas\Components\Grid::make(2)
                    ->schema([
                        Select::make('creation_method')
                            ->options([
                                'automatic' => 'Automatic',
                                'manual' => 'Manual',
                            ])
                            ->default('manual')
                            ->live()
                            ->required(),

                        TextInput::make('business_name')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('paystack_subaccount_code')
                            ->label('Paystack Subaccount Code')
                            ->placeholder('SUB_...')
                            ->required(fn(\Filament\Schemas\Components\Utilities\Get $get) => $get('creation_method') === 'manual')
                            ->visible(fn(\Filament\Schemas\Components\Utilities\Get $get) => $get('creation_method') === 'manual')
                            ->maxLength(255),

                        Select::make('settlement_bank')
                            ->label('Settlement Bank')
                            ->options(fn() => collect(app(\App\Services\PaystackService::class)->listBanks())
                                ->pluck('name', 'code'))
                            ->searchable()
                            ->required(fn(\Filament\Schemas\Components\Utilities\Get $get) => $get('creation_method') === 'automatic')
                            ->visible(fn(\Filament\Schemas\Components\Utilities\Get $get) => $get('creation_method') === 'automatic'),

                        TextInput::make('account_number')
                            ->label('Account Number')
                            ->required(fn(\Filament\Schemas\Components\Utilities\Get $get) => $get('creation_method') === 'automatic')
                            ->visible(fn(\Filament\Schemas\Components\Utilities\Get $get) => $get('creation_method') === 'automatic')
                            ->maxLength(10),

                        TextInput::make('percentage_charge')
                            ->label('Percentage Charge')
                            ->numeric()
                            ->suffix('%')
                            ->maxValue(100)
                            ->required(fn(\Filament\Schemas\Components\Utilities\Get $get) => $get('creation_method') === 'automatic'),

                        TextInput::make('created_by')
                            ->hidden()
                            ->dehydrated()
                            ->default(fn() => auth()->id()),
                    ]),
            ]);
    }
}
