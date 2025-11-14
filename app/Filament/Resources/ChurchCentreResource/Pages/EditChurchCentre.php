<?php

namespace App\Filament\Resources\ChurchCentreResource\Pages;

use App\Filament\Resources\ChurchCentreResource;
use Filament\Actions;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditChurchCentre extends EditRecord
{
    protected static string $resource = ChurchCentreResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('view')
                ->label('View Centre')
                ->icon('heroicon-o-eye')
                ->color('gray')
                ->url(fn() => ChurchCentreResource::getUrl('view', ['record' => $this->record])),
            DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Church Centre')
                ->modalDescription('Are you sure you want to delete this church centre? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Church centre deleted successfully'),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Church centre updated successfully';
    }
}

