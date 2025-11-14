<?php

namespace App\Filament\Resources;

use App\Enums\PartnershipInterval;
use App\Filament\Resources\PartnershipResource\Pages;
use App\Models\Partnership;
use Filament\Actions;
use Filament\Forms;
use Filament\Schemas\Components\Section as SchemaSection;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Support\Icons\Heroicon;
use BackedEnum;

class PartnershipResource extends Resource
{
    protected static ?string $model = Partnership::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                SchemaSection::make('Partner Information')
                    ->schema([
                        Forms\Components\TextInput::make('fullname')
                            ->label('Full Name')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('phone_no')
                            ->label('Phone Number')
                            ->tel()
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\Select::make('user_id')
                            ->label('User Account')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->helperText('Optional: Link to an existing user account')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

                SchemaSection::make('Partnership Details')
                    ->schema([
                        Forms\Components\Select::make('partnership_type_id')
                            ->label('Partnership Type')
                            ->relationship('partnershipType', 'name')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->columnSpanFull(),
                        Forms\Components\Select::make('interval')
                            ->label('Interval')
                            ->options([
                                PartnershipInterval::Daily->value => 'Daily',
                                PartnershipInterval::Weekly->value => 'Weekly',
                                PartnershipInterval::Monthly->value => 'Monthly',
                                PartnershipInterval::Yearly->value => 'Yearly',
                            ])
                            ->required()
                            ->native(false)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('amount')
                            ->label('Amount')
                            ->required()
                            ->numeric()
                            ->prefix('₦')
                            ->step(0.01)
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
                Tables\Columns\TextColumn::make('fullname')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone_no')
                    ->label('Phone')
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable()
                    ->default('N/A'),
                Tables\Columns\TextColumn::make('partnershipType.name')
                    ->label('Type')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('interval')
                    ->badge()
                    ->formatStateUsing(fn($state) => ucfirst($state->value ?? $state))
                    ->color(fn($state) => match($state?->value ?? $state) {
                        PartnershipInterval::Daily->value => 'info',
                        PartnershipInterval::Weekly->value => 'success',
                        PartnershipInterval::Monthly->value => 'warning',
                        PartnershipInterval::Yearly->value => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('amount')
                    ->money('NGN')
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
            ->filters([
                Tables\Filters\SelectFilter::make('partnership_type_id')
                    ->label('Partnership Type')
                    ->relationship('partnershipType', 'name')
                    ->preload(),
                Tables\Filters\SelectFilter::make('interval')
                    ->label('Interval')
                    ->options([
                        PartnershipInterval::Daily->value => 'Daily',
                        PartnershipInterval::Weekly->value => 'Weekly',
                        PartnershipInterval::Monthly->value => 'Monthly',
                        PartnershipInterval::Yearly->value => 'Yearly',
                    ]),
                Tables\Filters\SelectFilter::make('user_id')
                    ->label('User')
                    ->relationship('user', 'name')
                    ->preload(),
            ])
            ->actions([
                Actions\ViewAction::make(),
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManagePartnerships::route('/'),
            'create' => Pages\CreatePartnership::route('/create'),
            'edit' => Pages\EditPartnership::route('/{record}/edit'),
            'view' => Pages\ViewPartnership::route('/{record}'),
        ];
    }
}

