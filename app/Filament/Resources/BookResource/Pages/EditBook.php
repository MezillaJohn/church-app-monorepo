<?php

namespace App\Filament\Resources\BookResource\Pages;

use App\Filament\Resources\BookResource;
use Filament\Actions;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBook extends EditRecord
{
    protected static string $resource = BookResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('view')
                ->label('View Book')
                ->icon('heroicon-o-eye')
                ->color('gray')
                ->url(fn() => BookResource::getUrl('view', ['record' => $this->record])),
            DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Book')
                ->modalDescription('Are you sure you want to delete this book? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Book deleted successfully'),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Book updated successfully';
    }
}

