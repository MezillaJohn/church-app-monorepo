<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EventResource\Pages;
use App\Models\Event;
use Carbon\Carbon;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components\Section as SchemaSection;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Support\Icons\Heroicon;
use BackedEnum;

class EventResource extends Resource
{
    protected static ?string $model = Event::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                SchemaSection::make('Event Details')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('description')
                            ->rows(5)
                            ->columnSpanFull(),
                        Forms\Components\Select::make('event_type')
                            ->label('Event Type')
                            ->options([
                                'service' => 'Service',
                                'conference' => 'Conference',
                                'prayer' => 'Prayer',
                                'youth' => 'Youth',
                                'children' => 'Children',
                            ])
                            ->required()
                            ->native(false)
                            ->columnSpanFull(),
                    ])
                    ->columns(1)->columnSpanFull(),

                SchemaSection::make('Schedule')
                    ->schema([
                        Forms\Components\DatePicker::make('event_date')
                            ->label('Event Date')
                            ->required()
                            ->native(false)
                            ->displayFormat('d/m/Y')
                            ->default(now())
                            ->columnSpanFull(),
                        Forms\Components\TimePicker::make('event_time')
                            ->label('Event Time')
                            ->required()
                            ->native(true)
                            ->seconds(false)
                            ->default('09:00')
                            ->columnSpanFull(),
                    ])
                    ->columns(1),

                SchemaSection::make('Location')
                    ->schema([
                        Forms\Components\TextInput::make('location')
                            ->label('Event Location')
                            ->placeholder('Enter event location or venue')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->collapsible(),

                SchemaSection::make('Media & Broadcasting')
                    ->schema([
                        Forms\Components\FileUpload::make('image_url')
                            ->label('Event Image')
                            ->image()
                            ->directory('events')
                            ->disk('public')
                            ->visibility('public')
                            ->imageEditor()
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('broadcast_url')
                            ->label('Broadcast/Stream URL')
                            ->url()
                            ->placeholder('https://example.com/stream')
                            ->helperText('Live stream URL for event broadcasting')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->collapsible(),

                SchemaSection::make('Attendance & RSVP')
                    ->schema([
                        Forms\Components\TextInput::make('max_attendees')
                            ->label('Maximum Attendees')
                            ->numeric()
                            ->minValue(1)
                            ->helperText('Leave empty for unlimited attendees')
                            ->columnSpanFull(),
                        Forms\Components\Toggle::make('requires_rsvp')
                            ->label('Requires RSVP')
                            ->helperText('Enable if attendees need to RSVP')
                            ->default(false)
                            ->columnSpanFull(),
                    ])
                    ->columns(1),

                SchemaSection::make('Recurrence Settings')
                    ->schema([
                        Forms\Components\Toggle::make('is_recurring')
                            ->label('This is a recurring event')
                            ->live()
                            ->default(false)
                            ->columnSpanFull(),
                        Forms\Components\Select::make('recurrence_pattern')
                            ->label('Recurrence Pattern')
                            ->options([
                                'daily' => 'Daily',
                                'weekly' => 'Weekly',
                                'monthly' => 'Monthly',
                                'yearly' => 'Yearly',
                            ])
                            ->visible(fn($get) => $get('is_recurring'))
                            ->required(fn($get) => $get('is_recurring'))
                            ->native(false)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('recurrence_interval')
                            ->label('Repeat Every')
                            ->numeric()
                            ->default(1)
                            ->minValue(1)
                            ->suffix(fn($get) => match ($get('recurrence_pattern')) {
                                'daily' => 'day(s)',
                                'weekly' => 'week(s)',
                                'monthly' => 'month(s)',
                                'yearly' => 'year(s)',
                                default => '',
                            })
                            ->visible(fn($get) => $get('is_recurring'))
                            ->required(fn($get) => $get('is_recurring'))
                            ->columnSpanFull(),
                        Forms\Components\DatePicker::make('recurrence_end_date')
                            ->label('Recurrence End Date')
                            ->visible(fn($get) => $get('is_recurring'))
                            ->helperText('Optional: Leave empty for no end date')
                            ->native(false)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('recurrence_count')
                            ->label('Number of Occurrences')
                            ->numeric()
                            ->minValue(1)
                            ->visible(fn($get) => $get('is_recurring'))
                            ->helperText('Optional: Alternative to end date')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->collapsible(),

                SchemaSection::make('Publishing')
                    ->schema([
                        Forms\Components\Toggle::make('is_published')
                            ->label('Publish Event')
                            ->helperText('Published events are visible to users')
                            ->default(true)
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('event_type')
                    ->formatStateUsing(fn($state) => $state ? ucfirst($state->value) : '')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('event_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('event_time')
                    ->time()
                    ->sortable(),
                Tables\Columns\TextColumn::make('location')
                    ->searchable()
                    ->limit(30),
                Tables\Columns\IconColumn::make('is_live')
                    ->label('Live')
                    ->getStateUsing(fn(Event $record) => $record->isLive())
                    ->boolean()
                    ->trueIcon('heroicon-o-signal')
                    ->trueColor('success')
                    ->falseColor('gray'),
                Tables\Columns\IconColumn::make('requires_rsvp')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_published')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_recurring')
                    ->label('Recurring')
                    ->boolean(),
                Tables\Columns\TextColumn::make('recurrence_pattern')
                    ->label('Recurrence')
                    ->badge()
                    ->formatStateUsing(fn($state) => $state ? ucfirst($state->value) : '')
                    ->visible(fn($record) => $record && $record->is_recurring),
            ])
            ->defaultSort('event_date', 'desc')
            ->filters([
                Tables\Filters\Filter::make('all')
                    ->label('All')
                    ->default(),
                Tables\Filters\Filter::make('upcoming')
                    ->label('Upcoming')
                    ->query(fn($query) => $query->where('event_date', '>=', now()->toDateString())->whereNull('parent_event_id'))
                    ->toggle(),
                Tables\Filters\Filter::make('live')
                    ->label('Live')
                    ->query(function ($query) {
                        $now = \Carbon\Carbon::now();
                        $liveStart = $now->copy()->subMinutes(5);
                        $liveEnd = $now->copy()->addMinutes(30);

                        return $query->whereNull('parent_event_id')
                            ->whereRaw(
                                "CONCAT(event_date, ' ', TIME_FORMAT(event_time, '%H:%i:%s')) >= ?",
                                [$liveStart->format('Y-m-d H:i:s')]
                            )
                            ->whereRaw(
                                "CONCAT(event_date, ' ', TIME_FORMAT(event_time, '%H:%i:%s')) <= ?",
                                [$liveEnd->format('Y-m-d H:i:s')]
                            );
                    })
                    ->toggle(),
                Tables\Filters\Filter::make('past')
                    ->label('Past')
                    ->query(fn($query) => $query->where('event_date', '<', now()->toDateString())->whereNull('parent_event_id'))
                    ->toggle(),
                Tables\Filters\Filter::make('published')
                    ->label('Published')
                    ->query(fn($query) => $query->where('is_published', true)->whereNull('parent_event_id'))
                    ->toggle(),
                Tables\Filters\Filter::make('draft')
                    ->label('Draft')
                    ->query(fn($query) => $query->where('is_published', false)->whereNull('parent_event_id'))
                    ->toggle(),
            ])
            ->persistFiltersInSession()
            ->actions([
                Actions\ViewAction::make()
                    ->url(fn(Event $record) => EventResource::getUrl('view', ['record' => $record])),
                Actions\EditAction::make()
                    ->url(fn(Event $record) => EventResource::getUrl('edit', ['record' => $record])),
                Actions\DeleteAction::make()
                    ->requiresConfirmation()
                    ->modalHeading('Delete Event')
                    ->modalDescription(fn(Event $record) => $record->rsvps()->count() > 0
                        ? "Warning: This event has {$record->rsvps()->count()} RSVP(s). Deleting it will also delete all associated RSVPs. Are you sure you want to continue?"
                        : 'Are you sure you want to delete this event? This action cannot be undone.')
                    ->modalSubmitActionLabel('Yes, delete')
                    ->successNotificationTitle('Event deleted successfully'),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageEvents::route('/'),
            'create' => Pages\CreateEvent::route('/create'),
            'edit' => Pages\EditEvent::route('/{record}/edit'),
            'view' => Pages\ViewEvent::route('/{record}'),
        ];
    }
}

