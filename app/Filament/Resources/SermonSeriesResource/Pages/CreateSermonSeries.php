<?php

namespace App\Filament\Resources\SermonSeriesResource\Pages;

use App\Filament\Resources\SermonSeriesResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSermonSeries extends CreateRecord
{
    protected static string $resource = SermonSeriesResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'Series created successfully';
    }
}

