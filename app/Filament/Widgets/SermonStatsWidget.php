<?php

namespace App\Filament\Widgets;

use App\Models\Sermon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SermonStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalSermons = Sermon::count();
        $audioSermons = Sermon::where('type', 'audio')->count();
        $videoSermons = Sermon::where('type', 'video')->count();
        $publishedSermons = Sermon::where('is_published', true)->count();

        return [
            Stat::make('Total Sermons', $totalSermons)
                ->description('All sermons')
                ->descriptionIcon('heroicon-o-microphone')
                ->color('primary'),
            Stat::make('Audio Sermons', $audioSermons)
                ->description('Audio content')
                ->descriptionIcon('heroicon-o-speaker-wave')
                ->color('success'),
            Stat::make('Video Sermons', $videoSermons)
                ->description('Video content')
                ->descriptionIcon('heroicon-o-video-camera')
                ->color('info'),
            Stat::make('Published Sermons', $publishedSermons)
                ->description('Publicly visible')
                ->descriptionIcon('heroicon-o-eye')
                ->color('warning'),
        ];
    }
}

