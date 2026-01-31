<?php

namespace App\Filament\Resources\BookResource\Pages;

use App\Filament\Resources\BookResource;
use App\Models\Book;
use Filament\Actions;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Pages\ViewRecord;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\TextSize;

class ViewBook extends ViewRecord
{
    protected static string $resource = BookResource::class;

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Book Overview')
                    ->schema([
                        ImageEntry::make('cover_image')
                            ->label('Cover Image')
                            ->defaultImageUrl(fn () => null)
                            ->height(400)
                            ->columnSpanFull(),
                        TextEntry::make('title')
                            ->size(TextSize::Large)
                            ->weight('bold')
                            ->columnSpanFull(),
                        TextEntry::make('author')
                            ->label('Author')
                            ->icon('heroicon-o-user')
                            ->size(TextSize::Medium)
                            ->columnSpanFull(),
                        TextEntry::make('description')
                            ->columnSpanFull()
                            ->placeholder('No description provided'),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

                Section::make('Book Details')
                    ->schema([
                        TextEntry::make('price')
                            ->label('Price')
                            ->money('NGN')
                            ->icon('heroicon-o-currency-dollar'),
                        TextEntry::make('category.name')
                            ->label('Category')
                            ->badge()
                            ->placeholder('No category')
                            ->icon('heroicon-o-tag'),
                        TextEntry::make('average_rating')
                            ->label('Average Rating')
                            ->numeric(
                                decimalPlaces: 2,
                            )
                            ->suffix('/ 5.0')
                            ->icon('heroicon-o-star')
                            ->placeholder('No ratings yet'),
                        TextEntry::make('ratings_count')
                            ->label('Total Ratings')
                            ->numeric()
                            ->icon('heroicon-o-star'),
                        TextEntry::make('purchases_count')
                            ->label('Total Purchases')
                            ->numeric()
                            ->icon('heroicon-o-shopping-cart'),
                    ])
                    ->columns(2)
                    ->columnSpanFull()
                    ->collapsible(),

                Section::make('Media & Files')
                    ->schema([
                        TextEntry::make('file_url')
                            ->label('Book File')
                            ->url(fn ($state) => $state ? asset('storage/'.$state) : null, true)
                            ->placeholder('No file uploaded')
                            ->icon('heroicon-o-document')
                            ->columnSpanFull(),
                        TextEntry::make('preview_pages')
                            ->label('Preview Pages')
                            ->numeric()
                            ->placeholder('Not specified')
                            ->icon('heroicon-o-document-text')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull()
                    ->visible(fn (Book $record) => $record->file_url || $record->preview_pages)
                    ->collapsible(),

                Section::make('Status & Visibility')
                    ->schema([
                        IconEntry::make('is_featured')
                            ->label('Featured')
                            ->boolean()
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
                ->label('Edit Book')
                ->icon('heroicon-o-pencil')
                ->color('primary')
                ->url(fn () => BookResource::getUrl('edit', ['record' => $this->record])),
            Actions\DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Book')
                ->modalDescription('Are you sure you want to delete this book? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Book deleted successfully'),
        ];
    }
}
