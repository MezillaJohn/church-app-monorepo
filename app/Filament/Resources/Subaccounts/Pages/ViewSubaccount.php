<?php

namespace App\Filament\Resources\Subaccounts\Pages;

use App\Filament\Resources\Subaccounts\SubaccountResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewSubaccount extends ViewRecord
{
    protected static string $resource = SubaccountResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
