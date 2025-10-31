<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EventResource\Pages;
use App\Models\Event;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class EventResource extends Resource
{
    protected static ?string $model = Event::class;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description'),
                Forms\Components\DatePicker::make('event_date')
                    ->required(),
                Forms\Components\TimePicker::make('event_time')
                    ->required(),
                Forms\Components\TextInput::make('location'),
                Forms\Components\Select::make('event_type')
                    ->options([
                        'service' => 'Service',
                        'conference' => 'Conference',
                        'prayer' => 'Prayer',
                        'youth' => 'Youth',
                        'children' => 'Children',
                    ])
                    ->required(),
                Forms\Components\FileUpload::make('image_url'),
                Forms\Components\TextInput::make('max_attendees')
                    ->numeric(),
                Forms\Components\Toggle::make('requires_rsvp'),
                Forms\Components\Toggle::make('is_published'),
                Forms\Components\Toggle::make('is_recurring')
                    ->label('Is Recurring Event')
                    ->live()
                    ->default(false),
                Forms\Components\Select::make('recurrence_pattern')
                    ->label('Recurrence Pattern')
                    ->options([
                        'daily' => 'Daily',
                        'weekly' => 'Weekly',
                        'monthly' => 'Monthly',
                        'yearly' => 'Yearly',
                    ])
                    ->visible(fn($get) => $get('is_recurring'))
                    ->required(fn($get) => $get('is_recurring')),
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
                    ->required(fn($get) => $get('is_recurring')),
                Forms\Components\DatePicker::make('recurrence_end_date')
                    ->label('Recurrence End Date')
                    ->visible(fn($get) => $get('is_recurring'))
                    ->helperText('Optional: Leave empty for no end date'),
                Forms\Components\TextInput::make('recurrence_count')
                    ->label('Number of Occurrences')
                    ->numeric()
                    ->minValue(1)
                    ->visible(fn($get) => $get('is_recurring'))
                    ->helperText('Optional: Alternative to end date'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('event_type'),
                Tables\Columns\TextColumn::make('event_date')
                    ->date(),
                Tables\Columns\TextColumn::make('location')
                    ->searchable(),
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
                    ->formatStateUsing(fn($state) => $state ? ucfirst($state) : ''),
            ])
            ->filters([
                //
            ])
            ->actions([
                Actions\EditAction::make(),
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
        ];
    }
}

