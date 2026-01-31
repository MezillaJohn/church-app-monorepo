<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ChurchCentreResource\Pages;
use App\Models\ChurchCentre;
use BackedEnum;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section as SchemaSection;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;

class ChurchCentreResource extends Resource
{
    protected static ?string $model = ChurchCentre::class;

    protected static \UnitEnum|string|null $navigationGroup = 'Administration';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingOffice2;

    protected static ?string $navigationLabel = 'Church Centres';

    protected static ?string $modelLabel = 'Church Centre';

    protected static ?string $pluralModelLabel = 'Church Centres';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                SchemaSection::make('Centre Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('address')
                            ->rows(3)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('city')
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('state')
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('country')
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

                SchemaSection::make('Contact Information')
                    ->schema([
                        Forms\Components\TextInput::make('contact_phone')
                            ->label('Phone')
                            ->tel()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('contact_email')
                            ->label('Email')
                            ->email()
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull()
                    ->collapsible(),

                SchemaSection::make('Status')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->label('Active')
                            ->helperText('Enable to make this centre available for use')
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
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('city')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('state')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('country')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('contact_phone')
                    ->label('Phone')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('contact_email')
                    ->label('Email')
                    ->searchable()
                    ->copyable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('users_count')
                    ->label('Members')
                    ->counts('users')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active')
                    ->placeholder('All centres')
                    ->trueLabel('Active only')
                    ->falseLabel('Inactive only'),
            ])
            ->actions([
                Actions\ViewAction::make()
                    ->url(fn(ChurchCentre $record) => ChurchCentreResource::getUrl('view', ['record' => $record])),
                Actions\EditAction::make()
                    ->url(fn(ChurchCentre $record) => ChurchCentreResource::getUrl('edit', ['record' => $record])),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('name', 'asc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageChurchCentres::route('/'),
            'create' => Pages\CreateChurchCentre::route('/create'),
            'view' => Pages\ViewChurchCentre::route('/{record}'),
            'edit' => Pages\EditChurchCentre::route('/{record}/edit'),
        ];
    }
}
