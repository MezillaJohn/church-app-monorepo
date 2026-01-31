<?php

namespace App\Filament\Resources\BookPurchases\Pages;

use App\Filament\Resources\BookPurchases\BookPurchaseResource;
use Filament\Actions\CreateAction;
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
}
