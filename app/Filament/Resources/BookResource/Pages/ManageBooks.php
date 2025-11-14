<?php

namespace App\Filament\Resources\BookResource\Pages;

use App\Filament\Resources\BookResource;
use App\Models\Book;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ManageBooks extends ManageRecords
{
    protected static string $resource = BookResource::class;

    protected function getTableQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getTableQuery()->with(['category']);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Widgets\BookStatsWidget::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All')
                ->icon('heroicon-o-book-open')
                ->badge(Book::count()),
            'published' => Tab::make('Published')
                ->icon('heroicon-o-eye')
                ->badge(Book::where('is_published', true)->count())
                ->modifyQueryUsing(fn(Builder $query) => $query->where('is_published', true)),
            'featured' => Tab::make('Featured')
                ->icon('heroicon-o-star')
                ->badge(Book::where('is_featured', true)->count())
                ->modifyQueryUsing(fn(Builder $query) => $query->where('is_featured', true)),
            'unpublished' => Tab::make('Unpublished')
                ->icon('heroicon-o-eye-slash')
                ->badge(Book::where('is_published', false)->count())
                ->modifyQueryUsing(fn(Builder $query) => $query->where('is_published', false)),
        ];
    }
}

