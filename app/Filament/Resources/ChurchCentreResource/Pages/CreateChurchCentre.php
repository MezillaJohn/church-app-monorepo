<?php

namespace App\Filament\Resources\ChurchCentreResource\Pages;

use App\Filament\Resources\ChurchCentreResource;
use Filament\Resources\Pages\CreateRecord;

class CreateChurchCentre extends CreateRecord
{
    protected static string $resource = ChurchCentreResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'Church centre created successfully';
    }
}

