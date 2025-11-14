<?php

namespace App\Filament\Resources\SermonResource\Pages;

use App\Filament\Resources\SermonResource;
use App\Models\Sermon;
use Filament\Actions;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\TextSize;
use Filament\Resources\Pages\ViewRecord;

class ViewSermon extends ViewRecord
{
    protected static string $resource = SermonResource::class;

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Sermon Overview')
                    ->schema([
                        TextEntry::make('title')
                            ->size(TextSize::Large)
                            ->weight('bold')
                            ->columnSpanFull(),
                        TextEntry::make('description')
                            ->columnSpanFull()
                            ->placeholder('No description provided'),
                        TextEntry::make('type')
                            ->label('Sermon Type')
                            ->badge()
                            ->formatStateUsing(fn($state) => $state ? ucfirst($state->value) : 'N/A')
                            ->color(fn($state) => match ($state?->value) {
                                'audio' => 'success',
                                'video' => 'info',
                                default => 'gray',
                            })
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

                Section::make('Media Details')
                    ->schema([
                        ImageEntry::make('thumbnail_url')
                            ->label('Thumbnail')
                            ->defaultImageUrl(fn() => null)
                            ->height(300)
                            ->columnSpanFull(),
                        TextEntry::make('audio_file_url')
                            ->label('Audio File')
                            ->url(fn($state) => $state ? asset('storage/' . $state) : null, true)
                            ->placeholder('No audio file')
                            ->icon('heroicon-o-speaker-wave')
                            ->visible(fn(Sermon $record) => $record->type->value === 'audio')
                            ->columnSpanFull(),
                        TextEntry::make('youtube_video_id')
                            ->label('YouTube Video ID')
                            ->url(fn($state) => $state ? "https://www.youtube.com/watch?v={$state}" : null, true)
                            ->placeholder('No YouTube video ID')
                            ->icon('heroicon-o-video-camera')
                            ->visible(fn(Sermon $record) => $record->type->value === 'video' && $record->youtube_video_id)
                            ->columnSpanFull(),
                        TextEntry::make('youtube_video_url')
                            ->label('YouTube Video URL')
                            ->url(fn($state) => $state, true)
                            ->placeholder('No YouTube video URL')
                            ->icon('heroicon-o-link')
                            ->visible(fn(Sermon $record) => $record->type->value === 'video' && $record->youtube_video_url)
                            ->columnSpanFull(),
                        TextEntry::make('duration')
                            ->label('Duration')
                            ->suffix('minutes')
                            ->placeholder('Not specified')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull()
                    ->visible(fn(Sermon $record) => $record->thumbnail_url || $record->audio_file_url || $record->youtube_video_id || $record->youtube_video_url),

                Section::make('Sermon Information')
                    ->schema([
                        TextEntry::make('speaker')
                            ->label('Speaker')
                            ->icon('heroicon-o-user')
                            ->placeholder('Not specified')
                            ->columnSpanFull(),
                        TextEntry::make('date')
                            ->label('Sermon Date')
                            ->date('F d, Y')
                            ->icon('heroicon-o-calendar'),
                        TextEntry::make('category.name')
                            ->label('Category')
                            ->badge()
                            ->placeholder('No category')
                            ->icon('heroicon-o-tag'),
                        TextEntry::make('series.name')
                            ->label('Series')
                            ->badge()
                            ->placeholder('Not part of a series')
                            ->icon('heroicon-o-book-open')
                            ->columnSpanFull(),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),

                Section::make('Statistics')
                    ->schema([
                        TextEntry::make('views')
                            ->label('Total Views')
                            ->numeric()
                            ->suffix('views')
                            ->icon('heroicon-o-eye'),
                        TextEntry::make('favorites_count')
                            ->label('Favorites')
                            ->numeric()
                            ->suffix('favorites')
                            ->icon('heroicon-o-heart'),
                    ])
                    ->columns(2)
                    ->columnSpanFull()
                    ->collapsible(),

                Section::make('Publishing')
                    ->schema([
                        IconEntry::make('is_featured')
                            ->label('Featured')
                            ->boolean()
                            ->trueColor('warning')
                            ->falseColor('gray'),
                        IconEntry::make('is_published')
                            ->label('Published')
                            ->boolean()
                            ->trueColor('success')
                            ->falseColor('gray'),
                    ])
                    ->columns(2)
                    ->columnSpanFull()
                    ->collapsible(),
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('edit')
                ->label('Edit Sermon')
                ->icon('heroicon-o-pencil')
                ->color('primary')
                ->url(fn() => SermonResource::getUrl('edit', ['record' => $this->record])),
            Actions\DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Sermon')
                ->modalDescription('Are you sure you want to delete this sermon? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Sermon deleted successfully'),
        ];
    }
}

