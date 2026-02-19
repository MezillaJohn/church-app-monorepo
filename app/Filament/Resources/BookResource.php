<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookResource\Pages;
use App\Models\Book;
use BackedEnum;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section as SchemaSection;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Tables\Table;

class BookResource extends Resource
{
    protected static ?string $model = Book::class;

    protected static \UnitEnum|string|null $navigationGroup = 'Bookstore';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBookOpen;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                SchemaSection::make('Book Information')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('author')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('description')
                            ->rows(5)
                            ->columnSpanFull(),
                        Forms\Components\Select::make('category_id')
                            ->label('Category')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->native(false)
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

                SchemaSection::make('Pricing & Media')
                    ->schema([
                        Forms\Components\TextInput::make('price')
                            ->label('Price')
                            ->required()
                            ->numeric()
                            ->prefix('₦')
                            ->helperText('Enter the price in Naira')
                            ->columnSpanFull(),
                        Forms\Components\Select::make('subaccount_id')
                            ->label('Subaccount')
                            ->relationship('subaccount', 'business_name')
                            ->searchable()
                            ->preload()
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('cover_image')
                            ->label('Cover Image')
                            ->image()
                            ->disk('public')
                            ->directory('books/covers')
                            ->visibility('public')
                            ->imageEditor()
                            ->helperText('Upload the book cover image')
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('file_url')
                            ->label('Book File')
                            ->disk('public')
                            ->directory('books/files')
                            ->visibility('public')
                            ->acceptedFileTypes(['application/pdf'])
                            ->helperText('Upload the book PDF file')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull()
                    ->collapsible(),

                SchemaSection::make('Status & Visibility')
                    ->schema([
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured Book')
                            ->helperText('Mark this book as featured to display it prominently')
                            ->default(false)
                            ->columnSpanFull(),
                        Forms\Components\Toggle::make('is_published')
                            ->label('Published')
                            ->helperText('Make this book visible to users')
                            ->default(false)
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
                    ->searchable(),
                Tables\Columns\TextColumn::make('author')
                    ->searchable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->money('NGN')
                    ->sortable(),
                Tables\Columns\TextColumn::make('purchases_count')
                    ->label('Purchases')
                    ->sortable(),
                Tables\Columns\TextColumn::make('average_rating'),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_published')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Actions\ActionGroup::make([
                    Actions\ViewAction::make()
                        ->url(fn(Book $record) => BookResource::getUrl('view', ['record' => $record])),
                    Actions\EditAction::make()
                        ->url(fn(Book $record) => BookResource::getUrl('edit', ['record' => $record])),
                    Actions\Action::make('toggleFeatured')
                        ->label(fn(Book $record) => $record->is_featured ? 'Unmark as Featured' : 'Mark as Featured')
                        ->icon(fn(Book $record) => $record->is_featured ? 'heroicon-o-x-mark' : 'heroicon-o-star')
                        ->color(fn(Book $record) => $record->is_featured ? 'warning' : 'success')
                        ->requiresConfirmation()
                        ->modalHeading(fn(Book $record) => $record->is_featured ? 'Unmark as Featured' : 'Mark as Featured')
                        ->modalDescription(fn(Book $record) => $record->is_featured
                            ? 'Are you sure you want to unmark this book as featured?'
                            : 'Are you sure you want to mark this book as featured?')
                        ->action(function (Book $record) {
                            $record->update(['is_featured' => !$record->is_featured]);
                            \Filament\Notifications\Notification::make()
                                ->title($record->is_featured ? 'Book marked as featured' : 'Book unmarked as featured')
                                ->success()
                                ->send();
                        }),
                    Actions\DeleteAction::make()
                        ->requiresConfirmation()
                        ->modalHeading('Delete Book')
                        ->modalDescription('Are you sure you want to delete this book? This action cannot be undone.')
                        ->modalSubmitActionLabel('Yes, delete')
                        ->successNotificationTitle('Book deleted successfully'),
                ])
                    ->icon('heroicon-m-ellipsis-vertical')
                    ->button()
                    ->label('Actions'),
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
            'index' => Pages\ManageBooks::route('/'),
            'create' => Pages\CreateBook::route('/create'),
            'edit' => Pages\EditBook::route('/{record}/edit'),
            'view' => Pages\ViewBook::route('/{record}'),
        ];
    }
}
