<?php

namespace App\Filament\Resources\BookPurchases\Pages;

use App\Filament\Resources\BookPurchases\BookPurchaseResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBookPurchase extends EditRecord
{
    protected static string $resource = BookPurchaseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
