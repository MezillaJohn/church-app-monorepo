<?php

namespace App\Filament\Resources\Subaccounts\Pages;

use App\Filament\Resources\Subaccounts\SubaccountResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditSubaccount extends EditRecord
{
    protected static string $resource = SubaccountResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
