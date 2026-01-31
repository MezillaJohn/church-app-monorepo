<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    /**
     * Get a setting value by key
     */
    public function get(string $key, $default = null)
    {
        return Setting::get($key, $default);
    }

    /**
     * Get all settings in a group
     */
    public function getGroup(string $group): array
    {
        $cacheKey = "settings.group.{$group}";

        return Cache::remember($cacheKey, 3600, function () use ($group) {
            $settings = Setting::byGroup($group)->get();
            $result = [];

            foreach ($settings as $setting) {
                $result[$setting->key] = Setting::castValue($setting->value, $setting->type);
            }

            return $result;
        });
    }

    /**
     * Set a setting value
     */
    public function set(string $key, $value, string $type = 'string', string $group = 'general', ?string $description = null): Setting
    {
        return Setting::set($key, $value, $type, $group, $description);
    }

    /**
     * Clear all settings cache
     */
    public function clearCache(): void
    {
        $settings = Setting::all();

        foreach ($settings as $setting) {
            Cache::forget("setting.{$setting->key}");
        }

        $groups = Setting::distinct('group')->pluck('group');
        foreach ($groups as $group) {
            Cache::forget("settings.group.{$group}");
        }
    }
}
