<?php

namespace App\Filament\Resources\AppSettings\Pages;

use App\Filament\Resources\AppSettings\AppSettingsResource;
use App\Services\SettingsService;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\Page;
use Filament\Schemas\Components\Section as SchemaSection;

class ManageAppSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string $resource = AppSettingsResource::class;

    protected string $view = 'filament.resources.app-settings.pages.manage-app-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $appSettings = app(SettingsService::class)->getGroup('app');

        $formData = [];

        if (isset($appSettings['app.android_version'])) {
            $formData['android_version'] = $appSettings['app.android_version'];
        } else {
            $formData['android_version'] = '1.0.0';
        }

        if (isset($appSettings['app.android_download_url']) && ! empty($appSettings['app.android_download_url'])) {
            $formData['android_download_url'] = $appSettings['app.android_download_url'];
        }

        if (isset($appSettings['app.ios_version'])) {
            $formData['ios_version'] = $appSettings['app.ios_version'];
        } else {
            $formData['ios_version'] = '1.0.0';
        }

        if (isset($appSettings['app.ios_download_url']) && ! empty($appSettings['app.ios_download_url'])) {
            $formData['ios_download_url'] = $appSettings['app.ios_download_url'];
        }

        $this->form->fill($formData);
    }

    protected function getFormStatePath(): ?string
    {
        return 'data';
    }

    public function getFormSchema(): array
    {
        return [
            SchemaSection::make('Android Settings')
                ->schema([
                    Forms\Components\TextInput::make('android_version')
                        ->label('Android Version')
                        ->required()
                        ->maxLength(50)
                        ->placeholder('e.g., 1.0.0')
                        ->helperText('Current version of the Android app')
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('android_download_url')
                        ->label('Google Play Store URL')
                        ->url()
                        ->maxLength(500)
                        ->placeholder('https://play.google.com/store/apps/details?id=...')
                        ->helperText('Full URL to the app on Google Play Store')
                        ->rules(['required', 'url'])
                        ->columnSpanFull(),
                ])
                ->columnSpanFull(),

            SchemaSection::make('iOS Settings')
                ->schema([
                    Forms\Components\TextInput::make('ios_version')
                        ->label('iOS Version')
                        ->required()
                        ->maxLength(50)
                        ->placeholder('e.g., 1.0.0')
                        ->helperText('Current version of the iOS app')
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('ios_download_url')
                        ->label('App Store URL')
                        ->url()
                        ->maxLength(500)
                        ->placeholder('https://apps.apple.com/app/...')
                        ->helperText('Full URL to the app on Apple App Store')
                        ->rules(['required', 'url'])
                        ->columnSpanFull(),
                ])
                ->columnSpanFull(),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $settingsService = app(SettingsService::class);

        $settingsService->set('app.android_version', $data['android_version'], 'string', 'app', 'Android app version number');
        $settingsService->set('app.ios_version', $data['ios_version'], 'string', 'app', 'iOS app version number');
        $settingsService->set('app.android_download_url', $data['android_download_url'], 'string', 'app', 'Google Play Store download URL for Android app');
        $settingsService->set('app.ios_download_url', $data['ios_download_url'], 'string', 'app', 'Apple App Store download URL for iOS app');

        $settingsService->clearCache();

        Notification::make()
            ->title('App settings saved successfully')
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
