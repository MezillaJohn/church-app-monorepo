<?php

namespace App\Filament\Resources\CategoryResource\Pages;

use App\Filament\Resources\CategoryResource;
use App\Models\Category;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ManageCategories extends ManageRecords
{
    protected static string $resource = CategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Widgets\CategoryStatsWidget::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All')
                ->icon('heroicon-o-tag')
                ->badge(Category::count()),
            'active' => Tab::make('Active')
                ->icon('heroicon-o-check-circle')
                ->badge(Category::where('is_active', true)->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_active', true)),
            'sermon' => Tab::make('Sermon')
                ->icon('heroicon-o-microphone')
                ->badge(Category::where('type', 'sermon')->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'sermon')),
            'book' => Tab::make('Book')
                ->icon('heroicon-o-book-open')
                ->badge(Category::where('type', 'book')->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'book')),
            'general' => Tab::make('General')
                ->icon('heroicon-o-squares-2x2')
                ->badge(Category::where('type', 'general')->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'general')),
            'inactive' => Tab::make('Inactive')
                ->icon('heroicon-o-x-circle')
                ->badge(Category::where('is_active', false)->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('is_active', false)),
        ];
    }
}
