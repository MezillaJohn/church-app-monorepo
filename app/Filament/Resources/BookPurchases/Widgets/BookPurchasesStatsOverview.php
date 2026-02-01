<?php

namespace App\Filament\Resources\BookPurchases\Widgets;

use App\Models\BookPurchase;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Number;

class BookPurchasesStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Revenue', '₦' . Number::format(BookPurchase::where('status', 'completed')->sum('price_paid'), 2))
                ->description('Total earnings from book sales')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success')
                ->chart([7, 2, 10, 3, 15, 4, 17]),

            Stat::make('Purchases Today', BookPurchase::whereDate('created_at', today())->count())
                ->description('Number of books sold today')
                ->descriptionIcon('heroicon-m-calendar-days')
                ->color('info'),

            Stat::make('Pending Orders', BookPurchase::where('status', 'pending')->count())
                ->description('Orders awaiting payment')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
        ];
    }
}
