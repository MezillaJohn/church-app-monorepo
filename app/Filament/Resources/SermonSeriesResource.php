<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SermonSeriesResource\Pages;
use App\Filament\Resources\SermonSeriesResource\RelationManagers;
use App\Models\SermonSeries;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components\Section as SchemaSection;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Support\Icons\Heroicon;
use BackedEnum;
use Illuminate\Support\Str;

class SermonSeriesResource extends Resource
{
    protected static ?string $model = SermonSeries::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBookOpen;

    protected static ?string $navigationLabel = 'Sermon Series';

    protected static ?string $modelLabel = 'Sermon Series';

    protected static ?string $pluralModelLabel = 'Sermon Series';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                SchemaSection::make('Series Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (string $operation, $state, \Filament\Schemas\Components\Utilities\Set $set) {
                                if ($operation !== 'create') {
                                    return;
                                }
                                $set('slug', Str::slug($state));
                            })
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('description')
                            ->rows(4)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('preacher')
                            ->label('Preacher')
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('image')
                            ->label('Series Image')
                            ->image()
                            ->directory('sermon-series')
                            ->visibility('public')
                            ->imageEditor()
                            ->columnSpanFull(),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Active')
                            ->helperText('Active series are visible in the series list')
                            ->default(true)
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('preacher')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('sermons_count')
                    ->label('Sermons')
                    ->counts('sermons')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('name', 'asc')
            ->actions([
                Actions\ViewAction::make()
                    ->url(fn(SermonSeries $record) => SermonSeriesResource::getUrl('view', ['record' => $record])),
                Actions\EditAction::make()
                    ->url(fn(SermonSeries $record) => SermonSeriesResource::getUrl('edit', ['record' => $record])),
                Actions\DeleteAction::make()
                    ->requiresConfirmation()
                    ->modalHeading('Delete Series')
                    ->modalDescription('Are you sure you want to delete this series? This action cannot be undone.')
                    ->modalSubmitActionLabel('Yes, delete')
                    ->successNotificationTitle('Series deleted successfully'),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\SermonsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageSermonSeries::route('/'),
            'create' => Pages\CreateSermonSeries::route('/create'),
            'edit' => Pages\EditSermonSeries::route('/{record}/edit'),
            'view' => Pages\ViewSermonSeries::route('/{record}'),
        ];
    }
}

