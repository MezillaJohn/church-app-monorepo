<?php

namespace App\Filament\Resources\Subaccounts\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class SubaccountInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('creation_method')
                    ->badge(),
                TextEntry::make('business_name'),
                TextEntry::make('paystack_subaccount_code'),
                TextEntry::make('settlement_bank')
                    ->placeholder('-'),
                TextEntry::make('account_number')
                    ->placeholder('-'),
                TextEntry::make('percentage_charge')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('created_by')
                    ->numeric(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
