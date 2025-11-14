<?php

namespace App\Filament\Widgets;

use App\Models\Category;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CategoryStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalCategories = Category::count();
        $activeCategories = Category::where('is_active', true)->count();
        $sermonCategories = Category::where('type', 'sermon')->count();
        $bookCategories = Category::where('type', 'book')->count();

        return [
            Stat::make('Total Categories', $totalCategories)
                ->description('All categories')
                ->descriptionIcon('heroicon-o-tag')
                ->color('primary'),
            Stat::make('Active Categories', $activeCategories)
                ->description('Currently active')
                ->descriptionIcon('heroicon-o-check-circle')
                ->color('success'),
            Stat::make('Sermon Categories', $sermonCategories)
                ->description('For sermons')
                ->descriptionIcon('heroicon-o-microphone')
                ->color('info'),
            Stat::make('Book Categories', $bookCategories)
                ->description('For books')
                ->descriptionIcon('heroicon-o-book-open')
                ->color('warning'),
        ];
    }
}

