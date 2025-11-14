<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\EventResource;
use App\Models\Event;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;

class UpcomingEventsWidget extends BaseWidget
{
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Event::query()
                    ->whereNull('parent_event_id')
                    ->where('event_date', '>=', now()->toDateString())
                    ->where('is_published', true)
                    ->withCount('rsvps')
                    ->orderBy('event_date', 'asc')
                    ->orderBy('event_time', 'asc')
                    ->limit(7)
            )
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Event')
                    ->searchable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('event_date')
                    ->label('Date')
                    ->date('M d, Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('event_time')
                    ->label('Time')
                    ->time('g:i A')
                    ->sortable(),
                Tables\Columns\TextColumn::make('location')
                    ->label('Location')
                    ->limit(25)
                    ->toggleable(),
                Tables\Columns\TextColumn::make('rsvps_count')
                    ->label('RSVPs')
                    ->badge()
                    ->color('info'),
            ])
            ->actions([
                Actions\Action::make('view')
                    ->label('View')
                    ->icon('heroicon-o-eye')
                    ->url(fn (Event $record): string => EventResource::getUrl('view', ['record' => $record])),
            ])
            ->defaultSort('event_date', 'asc')
            ->heading('Upcoming Events')
            ->description('Next 7 upcoming published events');
    }
}

