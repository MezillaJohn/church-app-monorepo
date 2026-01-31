<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HeroSliderResource\Pages;
use App\Models\HeroSlider;
use BackedEnum;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;

class HeroSliderResource extends Resource
{
    protected static ?string $model = HeroSlider::class;

    protected static \UnitEnum|string|null $navigationGroup = 'Content';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static ?string $navigationLabel = 'Hero Sliders';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->maxLength(255)
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('image_path')
                    ->label('Image')
                    ->image()
                    ->required()
                    ->directory('hero-sliders')
                    ->disk('public')
                    ->imagePreviewHeight('250')
                    ->helperText('Upload image in 16:9 ratio (recommended: 1920x1080 or 1280x720)')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('link_url')
                    ->label('Link URL')
                    ->url()
                    ->maxLength(255)
                    ->helperText('Optional: URL to navigate when slide is clicked'),
                Forms\Components\TextInput::make('order')
                    ->label('Order')
                    ->numeric()
                    ->default(0)
                    ->required()
                    ->helperText('Lower numbers appear first'),
                Forms\Components\Toggle::make('is_active')
                    ->label('Is Active')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Image')
                    ->disk('public')
                    ->circular(false)
                    ->width(150)
                    ->height(84), // 16:9 ratio
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('order')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('order', 'asc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active')
                    ->placeholder('All')
                    ->trueLabel('Active only')
                    ->falseLabel('Inactive only'),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
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
            'index' => Pages\ManageHeroSliders::route('/'),
        ];
    }
}
