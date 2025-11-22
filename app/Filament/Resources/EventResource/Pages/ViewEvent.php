<?php

namespace App\Filament\Resources\EventResource\Pages;

use App\Filament\Resources\EventResource;
use App\Models\Event;
use Filament\Actions;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\TextSize;
use Filament\Resources\Pages\ViewRecord;

class ViewEvent extends ViewRecord
{
    protected static string $resource = EventResource::class;

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Event Overview')
                    ->schema([
                        TextEntry::make('title')
                            ->size(TextSize::Large)
                            ->weight('bold')
                            ->columnSpanFull(),
                        TextEntry::make('description')
                            ->columnSpanFull()
                            ->placeholder('No description provided'),
                    ])
                    ->columns(1)->columnSpanFull(),

                Section::make('Event Details')
                    ->schema([
                        TextEntry::make('event_type')
                            ->label('Event Type')
                            ->badge()
                            ->formatStateUsing(fn($state) => $state ? ucfirst($state->value) : 'N/A')
                            ->color(fn($state) => match ($state?->value) {
                                'service' => 'primary',
                                'conference' => 'success',
                                'prayer' => 'info',
                                'youth' => 'warning',
                                'children' => 'danger',
                                default => 'gray',
                            })
                            ->columnSpanFull(),
                        TextEntry::make('event_date')
                            ->label('Event Date')
                            ->date('F d, Y')
                            ->icon('heroicon-o-calendar'),
                        TextEntry::make('event_time')
                            ->label('Event Time')
                            ->time('g:i A')
                            ->icon('heroicon-o-clock'),
                        TextEntry::make('location')
                            ->label('Location')
                            ->icon('heroicon-o-map-pin')
                            ->placeholder('No location specified')
                            ->columnSpanFull(),
                    ])
                    ->columns(2)->columnSpanFull(),



                Section::make('Media & Broadcasting')
                    ->schema([
                        ImageEntry::make('image_url')
                            ->label('Event Image')
                            ->disk('public')
                            ->defaultImageUrl(fn() => null)
                            ->height(300)
                            ->columnSpanFull(),
                        TextEntry::make('broadcast_url')
                            ->label('Broadcast URL')
                            ->url(fn($state) => $state, true)
                            ->placeholder('No broadcast URL set')
                            ->icon('heroicon-o-video-camera')
                            ->columnSpanFull(),
                    ])
                    ->visible(fn(Event $record) => $record->image_url || $record->broadcast_url),

                Section::make('Attendance & RSVP')
                    ->schema([
                        TextEntry::make('max_attendees')
                            ->label('Maximum Attendees')
                            ->placeholder('Unlimited')
                            ->suffix(fn(Event $record) => $record->max_attendees ? 'people' : null)
                            ->columnSpanFull(),
                        IconEntry::make('requires_rsvp')
                            ->label('RSVP Required')
                            ->boolean()
                            ->trueColor('success')
                            ->falseColor('gray'),
                        TextEntry::make('rsvps_count')
                            ->label('Total RSVPs')
                            ->getStateUsing(fn(Event $record) => $record->rsvps()->count())
                            ->suffix('people'),
                    ])
                    ->columns(2),

                Section::make('Recurrence Settings')
                    ->schema([
                        IconEntry::make('is_recurring')
                            ->label('Recurring Event')
                            ->boolean()
                            ->trueColor('info')
                            ->falseColor('gray')
                            ->columnSpanFull(),
                        TextEntry::make('recurrence_pattern')
                            ->label('Pattern')
                            ->badge()
                            ->formatStateUsing(fn($state) => $state ? ucfirst($state->value) : 'N/A')
                            ->visible(fn(Event $record) => $record->is_recurring),
                        TextEntry::make('recurrence_interval')
                            ->label('Repeat Every')
                            ->suffix(fn(Event $record) => $record->recurrence_pattern ? match ($record->recurrence_pattern->value) {
                                'daily' => 'day(s)',
                                'weekly' => 'week(s)',
                                'monthly' => 'month(s)',
                                'yearly' => 'year(s)',
                                default => '',
                            } : null)
                            ->visible(fn(Event $record) => $record->is_recurring),
                        TextEntry::make('recurrence_end_date')
                            ->label('End Date')
                            ->date('F d, Y')
                            ->placeholder('No end date')
                            ->visible(fn(Event $record) => $record->is_recurring && $record->recurrence_end_date)
                            ->columnSpanFull(),
                        TextEntry::make('recurrence_count')
                            ->label('Number of Occurrences')
                            ->suffix('times')
                            ->placeholder('Unlimited')
                            ->visible(fn(Event $record) => $record->is_recurring && $record->recurrence_count)
                            ->columnSpanFull(),
                    ])
                    ->columns(2)
                    ->collapsible()
                    ->visible(fn(Event $record) => $record->is_recurring),
                Section::make('Status & Visibility')
                    ->schema([
                        IconEntry::make('is_live')
                            ->label('Live Status')
                            ->getStateUsing(fn(Event $record) => $record->isLive())
                            ->boolean()
                            ->trueIcon('heroicon-o-signal')
                            ->trueColor('success')
                            ->falseColor('gray'),
                        IconEntry::make('is_published')
                            ->label('Published')
                            ->boolean()
                            ->trueColor('success')
                            ->falseColor('gray'),
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
                ->label('Edit Event')
                ->icon('heroicon-o-pencil')
                ->color('primary')
                ->url(fn() => EventResource::getUrl('edit', ['record' => $this->record])),
            Actions\DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Event')
                ->modalDescription(fn(Event $record) => $record->rsvps()->count() > 0
                    ? "Warning: This event has {$record->rsvps()->count()} RSVP(s). Deleting it will also delete all associated RSVPs. Are you sure you want to continue?"
                    : 'Are you sure you want to delete this event? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Event deleted successfully'),
        ];
    }
}

