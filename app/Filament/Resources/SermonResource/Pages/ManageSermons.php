<?php

namespace App\Filament\Resources\SermonResource\Pages;

use App\Filament\Resources\SermonResource;
use App\Models\Sermon;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ManageSermons extends ManageRecords
{
    protected static string $resource = SermonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Widgets\SermonStatsWidget::class,
        ];
    }

    protected function getTableQuery(): Builder
    {
        return parent::getTableQuery()->with(['series', 'category']);
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All')
                ->icon('heroicon-o-microphone')
                ->badge(Sermon::count()),
            'audio' => Tab::make('Audio')
                ->icon('heroicon-o-speaker-wave')
                ->badge(Sermon::where('type', 'audio')->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'audio')),
            'video' => Tab::make('Video')
                ->icon('heroicon-o-video-camera')
                ->badge(Sermon::where('type', 'video')->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'video')),
        ];
    }
}
