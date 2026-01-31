<?php

namespace App\Filament\Resources\BookPurchases\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class BookPurchaseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('book_id')
                    ->relationship('book', 'title')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('price_paid')
                    ->required()
                    ->numeric()
                    ->prefix('₦'),
                TextInput::make('transaction_reference'),
                TextInput::make('payment_method')
                    ->required()
                    ->default('paystack'),
                Select::make('status')
                    ->options([
                        'completed' => 'Completed',
                        'pending' => 'Pending',
                        'failed' => 'Failed',
                    ])
                    ->required()
                    ->default('completed'),
            ]);
    }
}
