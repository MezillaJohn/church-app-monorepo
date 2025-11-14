<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalUsers = User::count();
        $verifiedUsers = User::whereNotNull('email_verified_at')->count();
        $churchMembers = User::where('church_member', true)->count();
        $recentUsers = User::where('created_at', '>=', now()->subDays(30))->count();

        return [
            Stat::make('Total Users', $totalUsers)
                ->description('All registered users')
                ->descriptionIcon('heroicon-o-users')
                ->color('primary'),
            Stat::make('Verified Users', $verifiedUsers)
                ->description('Email verified')
                ->descriptionIcon('heroicon-o-check-badge')
                ->color('success'),
            Stat::make('Church Members', $churchMembers)
                ->description('Active members')
                ->descriptionIcon('heroicon-o-user-group')
                ->color('info'),
            Stat::make('New Users (30 days)', $recentUsers)
                ->description('Recent signups')
                ->descriptionIcon('heroicon-o-user-plus')
                ->color('warning'),
        ];
    }
}
