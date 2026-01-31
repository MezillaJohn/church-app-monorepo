<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListUsers extends ManageRecords
{
    protected static string $resource = UserResource::class;

    protected function getTableQuery(): Builder
    {
        return parent::getTableQuery()->with(['churchCentre']);
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
            \App\Filament\Widgets\UserStatsWidget::class,
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Users')
                ->icon('heroicon-o-users')
                ->badge(User::count()),
            'verified' => Tab::make('Verified')
                ->icon('heroicon-o-check-badge')
                ->badge(User::whereNotNull('email_verified_at')->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->whereNotNull('email_verified_at')),
            'members' => Tab::make('Members')
                ->icon('heroicon-o-user-group')
                ->badge(User::where('church_member', true)->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('church_member', true)),
            'unverified' => Tab::make('Unverified')
                ->icon('heroicon-o-exclamation-triangle')
                ->badge(User::whereNull('email_verified_at')->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->whereNull('email_verified_at')),
            'recent' => Tab::make('Recent')
                ->icon('heroicon-o-user-plus')
                ->badge(User::where('created_at', '>=', now()->subDays(30))->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('created_at', '>=', now()->subDays(30))),
        ];
    }
}
