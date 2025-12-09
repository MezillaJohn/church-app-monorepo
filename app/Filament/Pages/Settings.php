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
use Filament\Schemas\Components\Section as SchemaSection;
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
            'paystack_public_key' => \App\Models\Setting::get('paystack.public_key', env('PAYSTACK_PUBLIC_KEY')),
            'paystack_secret_key' => \App\Models\Setting::get('paystack.secret_key', env('PAYSTACK_SECRET_KEY')),
            'paystack_merchant_email' => \App\Models\Setting::get('paystack.merchant_email', env('PAYSTACK_MERCHANT_EMAIL')),
            'paystack_callback_url' => \App\Models\Setting::get('paystack.callback_url', env('PAYSTACK_CALLBACK_URL', env('APP_URL') . '/api/v1/verify-payment')),
            'social_facebook' => \App\Models\Setting::get('social.facebook', ''),
            'social_twitter' => \App\Models\Setting::get('social.twitter', ''),
            'social_instagram' => \App\Models\Setting::get('social.instagram', ''),
            'social_linkedin' => \App\Models\Setting::get('social.linkedin', ''),
            'social_youtube' => \App\Models\Setting::get('social.youtube', ''),
            'temporary_paid_access_mode' => \App\Models\Setting::get('books.temporary_paid_access_mode', false),
        ]);
    }

    protected function getFormStatePath(): ?string
    {
        return 'data';
    }

    public function getFormSchema(): array
    {
        return [
            SchemaSection::make('YouTube Settings')
                ->schema([
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
                ])
                ->columnSpanFull(),
            SchemaSection::make('Paystack Settings')
                ->schema([
                    Forms\Components\TextInput::make('paystack_public_key')
                        ->label('Public Key')
                        ->helperText('Your Paystack public key')
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('paystack_secret_key')
                        ->label('Secret Key')
                        ->helperText('Your Paystack secret key')
                        ->password()
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('paystack_merchant_email')
                        ->label('Merchant Email')
                        ->helperText('Your Paystack merchant email')
                        ->email()
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('paystack_callback_url')
                        ->label('Callback URL')
                        ->helperText('Payment verification callback URL')
                        ->url()
                        ->columnSpanFull(),
                ])
                ->columnSpanFull(),
            SchemaSection::make('Social Media Links')
                ->schema([
                    Forms\Components\TextInput::make('social_facebook')
                        ->label('Facebook URL')
                        ->url()
                        ->helperText('Your Facebook page/profile URL')
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('social_twitter')
                        ->label('Twitter/X URL')
                        ->url()
                        ->helperText('Your Twitter/X profile URL')
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('social_instagram')
                        ->label('Instagram URL')
                        ->url()
                        ->helperText('Your Instagram profile URL')
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('social_linkedin')
                        ->label('LinkedIn URL')
                        ->url()
                        ->helperText('Your LinkedIn page/profile URL')
                        ->columnSpanFull(),
                    Forms\Components\TextInput::make('social_youtube')
                        ->label('YouTube Channel URL')
                        ->url()
                        ->helperText('Your YouTube channel URL')
                        ->columnSpanFull(),
                ])
                ->columnSpanFull(),
            SchemaSection::make('Books & Library')
                ->schema([
                    Forms\Components\Toggle::make('temporary_paid_access_mode')
                        ->label('Temporary Paid Access Mode')
                        ->helperText('⚠️ When enabled, ALL books become accessible to ALL users without purchase verification. Use for promotions, testing, or emergency access.')
                        ->inline(false)
                        ->columnSpanFull(),
                ])
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

        $settingsService->set(
            'paystack.public_key',
            $data['paystack_public_key'] ?? '',
            'string',
            'paystack',
            'Paystack public key'
        );

        $settingsService->set(
            'paystack.secret_key',
            $data['paystack_secret_key'] ?? '',
            'string',
            'paystack',
            'Paystack secret key'
        );

        $settingsService->set(
            'paystack.merchant_email',
            $data['paystack_merchant_email'] ?? '',
            'string',
            'paystack',
            'Paystack merchant email'
        );

        $settingsService->set(
            'paystack.callback_url',
            $data['paystack_callback_url'] ?? '',
            'string',
            'paystack',
            'Payment verification callback URL'
        );

        $settingsService->set(
            'social.facebook',
            $data['social_facebook'] ?? '',
            'string',
            'social',
            'Facebook page/profile URL'
        );

        $settingsService->set(
            'social.twitter',
            $data['social_twitter'] ?? '',
            'string',
            'social',
            'Twitter/X profile URL'
        );

        $settingsService->set(
            'social.instagram',
            $data['social_instagram'] ?? '',
            'string',
            'social',
            'Instagram profile URL'
        );

        $settingsService->set(
            'social.linkedin',
            $data['social_linkedin'] ?? '',
            'string',
            'social',
            'LinkedIn page/profile URL'
        );

        $settingsService->set(
            'social.youtube',
            $data['social_youtube'] ?? '',
            'string',
            'social',
            'YouTube channel URL'
        );

        $settingsService->set(
            'books.temporary_paid_access_mode',
            $data['temporary_paid_access_mode'] ?? false,
            'boolean',
            'books',
            'Temporary mode to make all books accessible without purchase verification'
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

