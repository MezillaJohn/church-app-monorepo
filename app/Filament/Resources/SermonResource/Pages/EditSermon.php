<?php

namespace App\Filament\Resources\SermonResource\Pages;

use App\Filament\Resources\SermonResource;
use Filament\Actions;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSermon extends EditRecord
{
    protected static string $resource = SermonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('view')
                ->label('View Sermon')
                ->icon('heroicon-o-eye')
                ->color('gray')
                ->url(fn() => SermonResource::getUrl('view', ['record' => $this->record])),
            DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Sermon')
                ->modalDescription('Are you sure you want to delete this sermon? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Sermon deleted successfully'),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Sermon updated successfully';
    }
}

