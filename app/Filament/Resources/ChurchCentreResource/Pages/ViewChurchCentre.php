<?php

namespace App\Filament\Resources\ChurchCentreResource\Pages;

use App\Filament\Resources\ChurchCentreResource;
use App\Models\ChurchCentre;
use Filament\Actions;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\TextSize;
use Filament\Resources\Pages\ViewRecord;

class ViewChurchCentre extends ViewRecord
{
    protected static string $resource = ChurchCentreResource::class;

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Centre Information')
                    ->schema([
                        TextEntry::make('name')
                            ->size(TextSize::Large)
                            ->weight('bold')
                            ->columnSpanFull(),
                        TextEntry::make('address')
                            ->columnSpanFull()
                            ->placeholder('No address provided'),
                        TextEntry::make('city')
                            ->icon('heroicon-o-map-pin')
                            ->placeholder('Not specified'),
                        TextEntry::make('state')
                            ->icon('heroicon-o-map-pin')
                            ->placeholder('Not specified'),
                        TextEntry::make('country')
                            ->icon('heroicon-o-globe-alt')
                            ->placeholder('Not specified'),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),

                Section::make('Contact Information')
                    ->schema([
                        TextEntry::make('contact_phone')
                            ->label('Phone')
                            ->icon('heroicon-o-phone')
                            ->placeholder('Not provided'),
                        TextEntry::make('contact_email')
                            ->label('Email')
                            ->icon('heroicon-o-envelope')
                            ->copyable()
                            ->copyMessage('Email copied!')
                            ->placeholder('Not provided'),
                    ])
                    ->columns(2)
                    ->collapsible(),

                Section::make('Status & Statistics')
                    ->schema([
                        IconEntry::make('is_active')
                            ->label('Active')
                            ->boolean()
                            ->trueColor('success')
                            ->falseColor('gray'),
                        TextEntry::make('users_count')
                            ->label('Total Members')
                            ->numeric()
                            ->default(fn(ChurchCentre $record) => $record->users()->count())
                            ->icon('heroicon-o-users'),
                    ])
                    ->columns(2)
                    ->collapsible(),

                Section::make('System Information')
                    ->schema([
                        TextEntry::make('created_at')
                            ->label('Created')
                            ->dateTime('F d, Y g:i A')
                            ->icon('heroicon-o-calendar'),
                        TextEntry::make('updated_at')
                            ->label('Last Updated')
                            ->dateTime('F d, Y g:i A')
                            ->icon('heroicon-o-clock'),
                    ])
                    ->columns(2)
                    ->collapsible(),
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('edit')
                ->label('Edit Centre')
                ->icon('heroicon-o-pencil')
                ->color('primary')
                ->url(fn() => ChurchCentreResource::getUrl('edit', ['record' => $this->record])),
            Actions\DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Church Centre')
                ->modalDescription('Are you sure you want to delete this church centre? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Church centre deleted successfully'),
        ];
    }
}

