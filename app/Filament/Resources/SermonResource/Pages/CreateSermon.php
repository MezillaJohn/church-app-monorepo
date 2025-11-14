<?php

namespace App\Filament\Resources\SermonResource\Pages;

use App\Filament\Resources\SermonResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSermon extends CreateRecord
{
    protected static string $resource = SermonResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'Sermon created successfully';
    }
}

