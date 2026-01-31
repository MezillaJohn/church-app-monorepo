<?php

namespace App\Filament\Resources\ChurchCentreResource\Pages;

use App\Filament\Resources\ChurchCentreResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageChurchCentres extends ManageRecords
{
    protected static string $resource = ChurchCentreResource::class;

    protected function getTableQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getTableQuery()->withCount('users');
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
