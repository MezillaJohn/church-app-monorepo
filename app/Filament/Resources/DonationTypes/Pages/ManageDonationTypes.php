<?php

namespace App\Filament\Resources\DonationTypes\Pages;

use App\Filament\Resources\DonationTypes\DonationTypeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageDonationTypes extends ManageRecords
{
    protected static string $resource = DonationTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
