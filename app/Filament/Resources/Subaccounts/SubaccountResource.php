<?php

namespace App\Filament\Resources\Subaccounts;

use App\Filament\Resources\Subaccounts\Pages\CreateSubaccount;
use App\Filament\Resources\Subaccounts\Pages\EditSubaccount;
use App\Filament\Resources\Subaccounts\Pages\ListSubaccounts;
use App\Filament\Resources\Subaccounts\Pages\ViewSubaccount;
use App\Filament\Resources\Subaccounts\Schemas\SubaccountForm;
use App\Filament\Resources\Subaccounts\Schemas\SubaccountInfolist;
use App\Filament\Resources\Subaccounts\Tables\SubaccountsTable;
use App\Models\Subaccount;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SubaccountResource extends Resource
{
    protected static ?string $model = Subaccount::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCreditCard;

    protected static \UnitEnum|string|null $navigationGroup = 'Finance';

    public static function form(Schema $schema): Schema
    {
        return SubaccountForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return SubaccountInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SubaccountsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSubaccounts::route('/'),
            'create' => CreateSubaccount::route('/create'),
            'view' => ViewSubaccount::route('/{record}'),
            'edit' => EditSubaccount::route('/{record}/edit'),
        ];
    }
}
