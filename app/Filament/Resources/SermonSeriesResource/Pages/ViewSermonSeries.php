<?php

namespace App\Filament\Resources\SermonSeriesResource\Pages;

use App\Filament\Resources\SermonSeriesResource;
use App\Models\SermonSeries;
use Filament\Actions;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\TextSize;
use Filament\Resources\Pages\ViewRecord;

class ViewSermonSeries extends ViewRecord
{
    protected static string $resource = SermonSeriesResource::class;

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Series Overview')
                    ->schema([
                        ImageEntry::make('image')
                            ->label('Series Image')
                            ->defaultImageUrl(fn() => null)
                            ->height(300)
                            ->columnSpanFull(),
                        TextEntry::make('name')
                            ->size(TextSize::Large)
                            ->weight('bold')
                            ->columnSpanFull(),
                        TextEntry::make('slug')
                            ->label('Slug')
                            ->icon('heroicon-o-link')
                            ->columnSpanFull(),
                        TextEntry::make('description')
                            ->columnSpanFull()
                            ->placeholder('No description provided'),
                        TextEntry::make('preacher')
                            ->label('Preacher')
                            ->icon('heroicon-o-user')
                            ->placeholder('Not specified')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

                Section::make('Status & Statistics')
                    ->schema([
                        IconEntry::make('is_active')
                            ->label('Active')
                            ->boolean()
                            ->trueColor('success')
                            ->falseColor('gray'),
                        TextEntry::make('sermons_count')
                            ->label('Total Sermons')
                            ->numeric()
                            ->default(fn(SermonSeries $record) => $record->sermons()->count())
                            ->icon('heroicon-o-microphone'),
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
                ->label('Edit Series')
                ->icon('heroicon-o-pencil')
                ->color('primary')
                ->url(fn() => SermonSeriesResource::getUrl('edit', ['record' => $this->record])),
            Actions\DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Series')
                ->modalDescription('Are you sure you want to delete this series? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Series deleted successfully'),
        ];
    }
}

