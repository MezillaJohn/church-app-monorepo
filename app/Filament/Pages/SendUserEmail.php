<?php

namespace App\Filament\Pages;

use App\Mail\AdminUserMail;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Schemas\Components\Section as SchemaSection;
use Filament\Schemas\Components\Utilities\Get;
use Illuminate\Support\Facades\Mail;
use BackedEnum;

class SendUserEmail extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedEnvelope;

    protected string $view = 'filament.pages.send-user-email';

    protected static ?string $navigationLabel = 'Send Email';

    protected static ?int $navigationSort = 99;

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'recipient_type' => 'single',
            'user_ids' => [],
            'send_to_all' => false,
        ]);
    }

    protected function getFormStatePath(): ?string
    {
        return 'data';
    }

    public function getFormSchema(): array
    {
        return [
            SchemaSection::make('Recipient Selection')
                ->schema([
                    Forms\Components\Radio::make('recipient_type')
                        ->label('Send To')
                        ->options([
                            'single' => 'Single User',
                            'selected' => 'Selected Users',
                            'all' => 'All Users',
                        ])
                        ->default('single')
                        ->live()
                        ->required()
                        ->columnSpanFull(),
                    Forms\Components\Select::make('user_id')
                        ->label('Select User')
                        ->options(User::query()->pluck('name', 'id'))
                        ->searchable()
                        ->preload()
                        ->visible(fn (Get $get) => $get('recipient_type') === 'single')
                        ->required(fn (Get $get) => $get('recipient_type') === 'single')
                        ->columnSpanFull(),
                    Forms\Components\Select::make('user_ids')
                        ->label('Select Users')
                        ->multiple()
                        ->options(User::query()->pluck('name', 'id'))
                        ->searchable()
                        ->preload()
                        ->visible(fn (Get $get) => $get('recipient_type') === 'selected')
                        ->required(fn (Get $get) => $get('recipient_type') === 'selected')
                        ->columnSpanFull(),
                    Forms\Components\Placeholder::make('all_users_info')
                        ->label('')
                        ->content('This will send the email to all users in the system.')
                        ->visible(fn (Get $get) => $get('recipient_type') === 'all')
                        ->columnSpanFull(),
                ])
                ->columnSpanFull(),
            SchemaSection::make('Email Content')
                ->schema([
                    Forms\Components\TextInput::make('subject')
                        ->label('Subject')
                        ->required()
                        ->maxLength(255)
                        ->columnSpanFull(),
                    Forms\Components\RichEditor::make('body')
                        ->label('Message Body')
                        ->required()
                        ->toolbarButtons([
                            'bold',
                            'italic',
                            'underline',
                            'link',
                            'bulletList',
                            'orderedList',
                        ])
                        ->extraAttributes(['style' => 'height: 300px;'])
                        ->columnSpanFull(),
                ])
                ->columnSpanFull(),
        ];
    }

    public function send(): void
    {
        $data = $this->form->getState();
        $subject = $data['subject'];
        $body = $data['body'];
        $recipientType = $data['recipient_type'];

        $users = collect();

        try {
            switch ($recipientType) {
                case 'single':
                    $user = User::find($data['user_id']);
                    if ($user) {
                        $users->push($user);
                    }
                    break;

                case 'selected':
                    $users = User::whereIn('id', $data['user_ids'] ?? [])->get();
                    break;

                case 'all':
                    $users = User::all();
                    break;
            }

            if ($users->isEmpty()) {
                Notification::make()
                    ->title('No recipients selected')
                    ->danger()
                    ->send();
                return;
            }

            $sentCount = 0;
            foreach ($users as $user) {
                Mail::to($user->email)->send(new AdminUserMail($user, $subject, $body));
                $sentCount++;
            }

            Notification::make()
                ->title("Email sent successfully to {$sentCount} user(s)")
                ->success()
                ->send();

            $this->form->fill([
                'recipient_type' => 'single',
                'user_ids' => [],
                'send_to_all' => false,
                'subject' => '',
                'body' => '',
            ]);

        } catch (\Exception $e) {
            Notification::make()
                ->title('Failed to send email')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('send')
                ->label('Send Email')
                ->submit('send'),
        ];
    }
}

