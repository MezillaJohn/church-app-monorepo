<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use App\Models\User;
use Filament\Actions;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\TextSize;
use Filament\Resources\Pages\ViewRecord;

class ViewUser extends ViewRecord
{
    protected static string $resource = UserResource::class;

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Account Information')
                    ->schema([
                        TextEntry::make('name')
                            ->size(TextSize::Large)
                            ->weight('bold')
                            ->columnSpanFull(),
                        TextEntry::make('email')
                            ->icon('heroicon-o-envelope')
                            ->copyable()
                            ->copyMessage('Email copied!')
                            ->columnSpanFull(),
                        TextEntry::make('created_at')
                            ->label('Joined')
                            ->dateTime('F d, Y g:i A')
                            ->icon('heroicon-o-calendar')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

                Section::make('Profile Information')
                    ->schema([
                        TextEntry::make('churchCentre.name')
                            ->label('Church Centre')
                            ->badge()
                            ->placeholder('Not set')
                            ->icon('heroicon-o-building-office'),
                        TextEntry::make('country')
                            ->icon('heroicon-o-globe-alt')
                            ->placeholder('Not set'),
                        TextEntry::make('phone')
                            ->icon('heroicon-o-phone')
                            ->placeholder('Not set'),
                        TextEntry::make('gender')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'male' => 'info',
                                'female' => 'success',
                                default => 'gray',
                            })
                            ->placeholder('Not set'),
                    ])
                    ->columns(2)
                    ->collapsible(),

                Section::make('Status & Verification')
                    ->schema([
                        IconEntry::make('church_member')
                            ->label('Church Member')
                            ->boolean()
                            ->trueColor('success')
                            ->falseColor('gray'),
                        IconEntry::make('email_verified_at')
                            ->label('Email Verified')
                            ->boolean()
                            ->trueColor('success')
                            ->falseColor('gray'),
                        TextEntry::make('email_verified_at')
                            ->label('Verified At')
                            ->dateTime('F d, Y g:i A')
                            ->placeholder('Not verified')
                            ->icon('heroicon-o-check-badge')
                            ->visible(fn (User $record) => $record->email_verified_at !== null),
                    ])
                    ->columns(2)
                    ->collapsible(),

                Section::make('System Information')
                    ->schema([
                        TextEntry::make('created_at')
                            ->label('Created')
                            ->dateTime('F d, Y g:i A')
                            ->icon('heroicon-o-calendar'),
                        TextEntry::make('updated_at')
                            ->label('Last Updated')
                            ->dateTime('F d, Y g:i A')
                            ->icon('heroicon-o-clock'),
                    ])
                    ->columns(2)
                    ->collapsible(),
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('edit')
                ->label('Edit User')
                ->icon('heroicon-o-pencil')
                ->color('primary')
                ->url(fn() => UserResource::getUrl('edit', ['record' => $this->record])),
            Actions\DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete User')
                ->modalDescription('Are you sure you want to delete this user? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('User deleted successfully'),
        ];
    }
}

