<?php

namespace App\Filament\Pages;

use App\Filament\Resources\BookResource;
use App\Filament\Resources\EventResource;
use App\Filament\Resources\SermonResource;
use App\Filament\Widgets\DashboardStatsWidget;
use App\Filament\Widgets\RecentDonationsWidget;
use App\Filament\Widgets\UpcomingEventsWidget;
use Filament\Actions\Action;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Widgets\AccountWidget;

class Dashboard extends BaseDashboard
{
    public function getWidgets(): array
    {
        return [
            AccountWidget::class,
            DashboardStatsWidget::class,
            UpcomingEventsWidget::class,
            RecentDonationsWidget::class,
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('createEvent')
                ->label('Create Event')
                ->icon('heroicon-o-plus-circle')
                ->color('success')
                ->url(EventResource::getUrl('create')),
            Action::make('uploadSermon')
                ->label('Upload Sermon')
                ->icon('heroicon-o-microphone')
                ->color('info')
                ->url(SermonResource::getUrl('create')),
            Action::make('addBook')
                ->label('Add Book')
                ->icon('heroicon-o-book-open')
                ->color('warning')
                ->url(BookResource::getUrl('create')),
        ];
    }
}
