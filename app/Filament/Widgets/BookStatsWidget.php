<?php

namespace App\Filament\Widgets;

use App\Models\Book;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class BookStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalBooks = Book::count();
        $publishedBooks = Book::where('is_published', true)->count();
        $featuredBooks = Book::where('is_featured', true)->count();
        $totalPurchases = Book::sum('purchases_count');

        return [
            Stat::make('Total Books', $totalBooks)
                ->description('All books')
                ->descriptionIcon('heroicon-o-book-open')
                ->color('primary'),
            Stat::make('Published Books', $publishedBooks)
                ->description('Publicly visible')
                ->descriptionIcon('heroicon-o-eye')
                ->color('success'),
            Stat::make('Featured Books', $featuredBooks)
                ->description('Featured content')
                ->descriptionIcon('heroicon-o-star')
                ->color('warning'),
            Stat::make('Total Purchases', $totalPurchases)
                ->description('All time purchases')
                ->descriptionIcon('heroicon-o-shopping-cart')
                ->color('info'),
        ];
    }
}
