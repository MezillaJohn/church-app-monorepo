<?php

namespace App\Filament\Pages;

use App\Models\User;
use App\Services\PushNotificationService;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Notifications\Notification;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Schemas\Schema;
use Filament\Pages\Page;

class SendPushNotification extends Page implements HasForms
{
    use InteractsWithForms;

    protected static \UnitEnum|string|null $navigationGroup = 'Communication';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-paper-airplane';

    protected string $view = 'filament.pages.send-push-notification';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('recipient_type')
                    ->label('Recipient')
                    ->options([
                        'single_user' => 'Single User',
                        'all_users' => 'All Users',
                    ])
                    ->default('single_user')
                    ->live()
                    ->required(),

                Select::make('user_id')
                    ->label('User')
                    ->options(User::query()->pluck('name', 'id')) // Initial load might stay small or use search
                    ->searchable() // Makes it searchable (client-side if options loaded, or ajax if separate)
                    ->getSearchResultsUsing(fn(string $search) => User::where('name', 'like', "%{$search}%")->limit(50)->pluck('name', 'id'))
                    ->visible(fn(Get $get) => $get('recipient_type') === 'single_user')
                    ->required(fn(Get $get) => $get('recipient_type') === 'single_user'),

                TextInput::make('title')
                    ->required()
                    ->maxLength(255),

                Textarea::make('body')
                    ->required()
                    ->rows(5),
            ])
            ->statePath('data');
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('send')
                ->label('Send Notification')
                ->submit('send'),
        ];
    }

    public function send(PushNotificationService $service): void
    {
        $data = $this->form->getState();

        $title = $data['title'];
        $body = $data['body'];

        if ($data['recipient_type'] === 'single_user') {
            $user = User::find($data['user_id']);

            if (!$user) {
                Notification::make()
                    ->title('User not found')
                    ->danger()
                    ->send();

                return;
            }

            $service->sendToUser($user, $title, $body);

            Notification::make()
                ->title("Notification sent to {$user->name}")
                ->success()
                ->send();
        } elseif ($data['recipient_type'] === 'all_users') {
            $users = User::has('pushTokens')->get();

            if ($users->isEmpty()) {
                Notification::make()
                    ->title('No users with active push tokens found')
                    ->warning()
                    ->send();

                return;
            }

            $service->sendToUsers($users, $title, $body);

            Notification::make()
                ->title("Notification sent to {$users->count()} users")
                ->success()
                ->send();
        }

        $this->form->fill(['recipient_type' => 'single_user']);
    }
}
