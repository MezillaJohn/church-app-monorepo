<?php

namespace App\Filament\Resources\SermonSeriesResource\Pages;

use App\Filament\Resources\SermonSeriesResource;
use Filament\Actions;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSermonSeries extends EditRecord
{
    protected static string $resource = SermonSeriesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('view')
                ->label('View Series')
                ->icon('heroicon-o-eye')
                ->color('gray')
                ->url(fn () => SermonSeriesResource::getUrl('view', ['record' => $this->record])),
            DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Series')
                ->modalDescription('Are you sure you want to delete this series? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Series deleted successfully'),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Series updated successfully';
    }
}
