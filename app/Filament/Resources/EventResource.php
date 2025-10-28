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

