<?php

namespace App\Filament\Resources\SermonSeriesResource\Pages;

use App\Filament\Resources\SermonSeriesResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageSermonSeries extends ManageRecords
{
    protected static string $resource = SermonSeriesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
