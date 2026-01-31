<?php

namespace App\Filament\Resources\PartnershipResource\Pages;

use App\Enums\PartnershipInterval;
use App\Filament\Resources\PartnershipResource;
use Filament\Actions;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Pages\ViewRecord;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\TextSize;

class ViewPartnership extends ViewRecord
{
    protected static string $resource = PartnershipResource::class;

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Partner Information')
                    ->schema([
                        TextEntry::make('fullname')
                            ->label('Full Name')
                            ->size(TextSize::Large)
                            ->weight('bold')
                            ->columnSpanFull(),
                        TextEntry::make('email')
                            ->label('Email')
                            ->icon('heroicon-o-envelope')
                            ->copyable()
                            ->columnSpanFull(),
                        TextEntry::make('phone_no')
                            ->label('Phone Number')
                            ->icon('heroicon-o-phone')
                            ->copyable()
                            ->columnSpanFull(),
                        TextEntry::make('user.name')
                            ->label('User Account')
                            ->placeholder('Not linked to any user account')
                            ->icon('heroicon-o-user')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

                Section::make('Partnership Details')
                    ->schema([
                        TextEntry::make('partnershipType.name')
                            ->label('Partnership Type')
                            ->badge()
                            ->icon('heroicon-o-tag')
                            ->columnSpanFull(),
                        TextEntry::make('interval')
                            ->label('Interval')
                            ->badge()
                            ->formatStateUsing(fn ($state) => ucfirst($state->value ?? $state))
                            ->color(fn ($state) => match ($state?->value ?? $state) {
                                PartnershipInterval::Daily->value => 'info',
                                PartnershipInterval::Weekly->value => 'success',
                                PartnershipInterval::Monthly->value => 'warning',
                                PartnershipInterval::Yearly->value => 'danger',
                                default => 'gray',
                            })
                            ->icon('heroicon-o-clock')
                            ->columnSpanFull(),
                        TextEntry::make('amount')
                            ->label('Amount')
                            ->money('NGN')
                            ->icon('heroicon-o-currency-dollar')
                            ->size(TextSize::Large)
                            ->weight('bold')
                            ->columnSpanFull(),
                        TextEntry::make('currency')
                            ->label('Currency')
                            ->badge()
                            ->icon('heroicon-o-banknotes')
                            ->columnSpanFull(),
                    ])
                    ->columns(1)
                    ->columnSpanFull(),

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
                ->label('Edit Partnership')
                ->icon('heroicon-o-pencil')
                ->color('primary')
                ->url(fn () => PartnershipResource::getUrl('edit', ['record' => $this->record])),
            Actions\DeleteAction::make()
                ->requiresConfirmation()
                ->modalHeading('Delete Partnership')
                ->modalDescription('Are you sure you want to delete this partnership? This action cannot be undone.')
                ->modalSubmitActionLabel('Yes, delete')
                ->successNotificationTitle('Partnership deleted successfully'),
        ];
    }
}
