<?php

namespace App\Filament\Resources\EventResource\Pages;

use App\Filament\Resources\EventResource;
use App\Models\Event;
use Filament\Actions;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditEvent extends EditRecord
{
    protected static string $resource = EventResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('view')
                ->label('View Event')
                ->icon('heroicon-o-eye')
                ->color('gray')
                ->url(fn () => EventResource::getUrl('view', ['record' => $this->record])),
            DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Event')
                ->modalDescription(fn (Event $record) => $record->rsvps()->count() > 0
                    ? "Warning: This event has {$record->rsvps()->count()} RSVP(s). Deleting it will also delete all associated RSVPs. Are you sure you want to continue?"
                    : 'Are you sure you want to delete this event? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Event deleted successfully'),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Event updated successfully';
    }
}
