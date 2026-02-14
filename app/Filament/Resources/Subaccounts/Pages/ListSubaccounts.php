<?php

namespace App\Filament\Resources\Subaccounts\Pages;

use App\Filament\Resources\Subaccounts\SubaccountResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSubaccounts extends ListRecords
{
    protected static string $resource = SubaccountResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
