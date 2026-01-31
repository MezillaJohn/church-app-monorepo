<?php

namespace App\Filament\Resources\AppSettings;

use App\Filament\Resources\AppSettings\Pages\ManageAppSettings;
use App\Models\Setting;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class AppSettingsResource extends Resource
{
    protected static ?string $model = Setting::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDevicePhoneMobile;

    protected static UnitEnum|string|null $navigationGroup = 'Administration';

    protected static ?string $modelLabel = 'App Settings';

    protected static ?string $pluralModelLabel = 'App Settings';

    public static function getPages(): array
    {
        return [
            'index' => ManageAppSettings::route('/'),
        ];
    }
}
