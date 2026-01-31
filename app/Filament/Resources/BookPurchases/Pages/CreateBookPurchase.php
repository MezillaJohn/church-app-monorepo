<?php

namespace App\Filament\Resources\BookPurchases\Pages;

use App\Filament\Resources\BookPurchases\BookPurchaseResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBookPurchase extends CreateRecord
{
    protected static string $resource = BookPurchaseResource::class;
}
