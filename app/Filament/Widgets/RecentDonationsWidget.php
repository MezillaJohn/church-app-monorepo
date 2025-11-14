<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\DonationResource;
use App\Models\Donation;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentDonationsWidget extends BaseWidget
{
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Donation::query()
                    ->with(['user', 'donationType'])
                    ->latest()
                    ->limit(10)
            )
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Donor')
                    ->searchable()
                    ->default('Anonymous'),
                Tables\Columns\TextColumn::make('amount')
                    ->label('Amount')
                    ->money('NGN')
                    ->sortable(),
                Tables\Columns\TextColumn::make('donationType.name')
                    ->label('Type')
                    ->badge()
                    ->default('N/A')
                    ->placeholder('N/A'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('M d, Y g:i A')
                    ->sortable(),
            ])
            ->actions([
                Actions\Action::make('view')
                    ->label('View')
                    ->icon('heroicon-o-eye')
                    ->url(fn (Donation $record): string => DonationResource::getUrl('index') . '?tableSearch=' . urlencode($record->id)),
            ])
            ->defaultSort('created_at', 'desc')
            ->heading('Recent Donations')
            ->description('Last 10 donations');
    }
}

