<?php

namespace App\Filament\Resources\PartnershipTypeResource\Pages;

use App\Filament\Resources\PartnershipTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManagePartnershipTypes extends ManageRecords
{
    protected static string $resource = PartnershipTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
