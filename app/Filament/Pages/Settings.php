<?php

namespace App\Filament\Pages;

use App\Services\SettingsService;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use BackedEnum;

class Settings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected string $view = 'filament.pages.settings';

    protected static ?string $navigationLabel = 'Settings';

    protected static ?int $navigationSort = 100;

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'youtube_api_key' => \App\Models\Setting::get('youtube.api_key', env('YOUTUBE_API_KEY')),
            'youtube_channel_id' => \App\Models\Setting::get('youtube.channel_id', env('YOUTUBE_CHANNEL_ID')),
            'youtube_max_results' => \App\Models\Setting::get('youtube.max_results', env('YOUTUBE_MAX_RESULTS', 50)),
        ]);
    }

    protected function getFormStatePath(): ?string
    {
        return 'data';
    }

    public function getFormSchema(): array
    {
        return [
            Forms\Components\TextInput::make('youtube_api_key')
                ->label('API Key')
                ->helperText('Your YouTube Data API v3 key')
                ->columnSpanFull(),
            Forms\Components\TextInput::make('youtube_channel_id')
                ->label('Channel ID')
                ->helperText('Your YouTube channel ID')
                ->columnSpanFull(),
            Forms\Components\TextInput::make('youtube_max_results')
                ->label('Max Results')
                ->helperText('Maximum number of videos to fetch per sync')
                ->numeric()
                ->default(50)
                ->columnSpanFull(),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $settingsService = app(SettingsService::class);

        $settingsService->set(
            'youtube.api_key',
            $data['youtube_api_key'] ?? '',
            'string',
            'youtube',
            'YouTube Data API v3 key'
        );

        $settingsService->set(
            'youtube.channel_id',
            $data['youtube_channel_id'] ?? '',
            'string',
            'youtube',
            'YouTube channel ID'
        );

        $settingsService->set(
            'youtube.max_results',
            $data['youtube_max_results'] ?? 50,
            'integer',
            'youtube',
            'Maximum number of videos to fetch per sync'
        );

        $settingsService->clearCache();

        // Clear config cache so new settings are picked up
        if (app()->configurationIsCached()) {
            \Artisan::call('config:clear');
        }

        Notification::make()
            ->title('Settings saved successfully')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save Settings')
                ->submit('save'),
        ];
    }
}

