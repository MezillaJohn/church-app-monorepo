<?php

namespace App\Filament\Resources\BookPurchases;

use App\Filament\Resources\BookPurchases\Pages\CreateBookPurchase;
use App\Filament\Resources\BookPurchases\Pages\EditBookPurchase;
use App\Filament\Resources\BookPurchases\Pages\ListBookPurchases;
use App\Filament\Resources\BookPurchases\Schemas\BookPurchaseForm;
use App\Filament\Resources\BookPurchases\Tables\BookPurchasesTable;
use App\Models\BookPurchase;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BookPurchaseResource extends Resource
{
    protected static ?string $model = BookPurchase::class;

    protected static \UnitEnum|string|null $navigationGroup = 'Bookstore';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingBag;

    public static function form(Schema $schema): Schema
    {
        return BookPurchaseForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BookPurchasesTable::configure($table);
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
            'index' => ListBookPurchases::route('/'),
            'create' => CreateBookPurchase::route('/create'),
            'edit' => EditBookPurchase::route('/{record}/edit'),
        ];
    }
}
