<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SermonResource\Pages;
use App\Models\Sermon;
use BackedEnum;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section as SchemaSection;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;

class SermonResource extends Resource
{
    protected static ?string $model = Sermon::class;

    protected static \UnitEnum|string|null $navigationGroup = 'Content';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMicrophone;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                SchemaSection::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('description')
                            ->rows(5)
                            ->columnSpanFull(),
                        Forms\Components\Select::make('type')
                            ->label('Sermon Type')
                            ->options([
                                'audio' => 'Audio',
                                'video' => 'Video',
                            ])
                            ->required()
                            ->live()
                            ->native(false)
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

                SchemaSection::make('Media Details')
                    ->schema([
                        Forms\Components\FileUpload::make('audio_file_url')
                            ->label('Audio File')
                            ->disk('public')
                            ->acceptedFileTypes(['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'])
                            ->maxSize(204800)
                            ->rules(['file', 'max:204800'])
                            ->directory('sermons/audio')
                            ->visibility('public')
                            ->visible(fn($get) => $get('type') === 'audio')
                            ->helperText('Maximum file size: 200MB')
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('youtube_video_id')
                            ->label('YouTube Video ID')
                            ->placeholder('Enter YouTube video ID')
                            ->helperText('Example: dQw4w9WgXcQ')
                            ->visible(fn($get) => $get('type') === 'video')
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('youtube_video_url')
                            ->label('YouTube Video URL')
                            ->url()
                            ->placeholder('https://www.youtube.com/watch?v=...')
                            ->helperText('Full YouTube video URL (alternative to Video ID)')
                            ->visible(fn($get) => $get('type') === 'video')
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('thumbnail_url')
                            ->label('Thumbnail Image')
                            ->image()
                            ->disk('public')
                            ->directory('sermons/thumbnails')
                            ->visibility('public')
                            ->imageEditor()
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('duration')
                            ->label('Duration (minutes)')
                            ->numeric()
                            ->minValue(0)
                            ->helperText('Duration in minutes')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull()
                    ->collapsible(),

                SchemaSection::make('Metadata')
                    ->schema([
                        Forms\Components\TextInput::make('speaker')
                            ->label('Speaker Name')
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\DatePicker::make('date')
                            ->label('Sermon Date')
                            ->required()
                            ->native(false)
                            ->displayFormat('d/m/Y')
                            ->default(now())
                            ->columnSpanFull(),
                        Forms\Components\Select::make('category_id')
                            ->label('Category')
                            ->relationship('category', 'name')
                            ->native(false)
                            ->columnSpanFull(),
                        Forms\Components\Select::make('series_id')
                            ->label('Series')
                            ->relationship('series', 'name')
                            ->searchable()
                            ->preload()
                            ->native(false)
                            ->createOptionForm([
                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(function ($state, \Filament\Schemas\Components\Utilities\Set $set) {
                                        $set('slug', \Illuminate\Support\Str::slug($state));
                                    }),
                                Forms\Components\TextInput::make('slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(\App\Models\SermonSeries::class, 'slug'),
                                Forms\Components\Textarea::make('description')
                                    ->rows(3),
                                Forms\Components\Toggle::make('is_active')
                                    ->label('Active')
                                    ->default(true),
                            ])
                            ->createOptionUsing(function (array $data): int {
                                return \App\Models\SermonSeries::create($data)->id;
                            })
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull()
                    ->collapsible(),

                SchemaSection::make('Publishing')
                    ->schema([
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured Sermon')
                            ->helperText('Feature this sermon prominently')
                            ->default(false)
                            ->columnSpanFull(),
                        Forms\Components\Toggle::make('is_published')
                            ->label('Publish Sermon')
                            ->helperText('Published sermons are visible to users')
                            ->default(true)
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull()
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(fn($state) => $state ? ucfirst($state->value) : '')
                    ->color(fn($state) => match ($state?->value) {
                        'audio' => 'success',
                        'video' => 'info',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('speaker')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('date')
                    ->date('F d, Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable(),
                Tables\Columns\TextColumn::make('series.name')
                    ->label('Series')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('views')
                    ->label('Views')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_published')
                    ->label('Published')
                    ->boolean()
                    ->sortable(),
            ])
            ->defaultSort('date', 'desc')
            ->actions([
                Actions\ViewAction::make()
                    ->url(fn(Sermon $record) => SermonResource::getUrl('view', ['record' => $record])),
                Actions\EditAction::make()
                    ->url(fn(Sermon $record) => SermonResource::getUrl('edit', ['record' => $record])),
                Actions\DeleteAction::make()
                    ->requiresConfirmation()
                    ->modalHeading('Delete Sermon')
                    ->modalDescription('Are you sure you want to delete this sermon? This action cannot be undone.')
                    ->modalSubmitActionLabel('Yes, delete')
                    ->successNotificationTitle('Sermon deleted successfully'),
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
            'index' => Pages\ManageSermons::route('/'),
            'create' => Pages\CreateSermon::route('/create'),
            'edit' => Pages\EditSermon::route('/{record}/edit'),
            'view' => Pages\ViewSermon::route('/{record}'),
        ];
    }
}
