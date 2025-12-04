<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Resources\Api\V1\SiteInfoResource;
use App\Services\SettingsService;

class SiteInfoController extends BaseController
{
    public function __construct(private SettingsService $settingsService)
    {
    }

    public function index()
    {
        try {
            $socialLinks = $this->settingsService->getGroup('social');
            $appSettings = $this->settingsService->getGroup('app');
            
            $siteInfo = [
                'social_links' => [
                    'facebook' => $socialLinks['social.facebook'] ?? '',
                    'twitter' => $socialLinks['social.twitter'] ?? '',
                    'instagram' => $socialLinks['social.instagram'] ?? '',
                    'linkedin' => $socialLinks['social.linkedin'] ?? '',
                    'youtube' => $socialLinks['social.youtube'] ?? '',
                ],
                'app_info' => [
                    'android' => [
                        'version' => $appSettings['app.android_version'] ?? '1.0.0',
                        'download_url' => $appSettings['app.android_download_url'] ?? '',
                    ],
                    'ios' => [
                        'version' => $appSettings['app.ios_version'] ?? '1.0.0',
                        'download_url' => $appSettings['app.ios_download_url'] ?? '',
                    ],
                ],
            ];

            return $this->ok('Site information retrieved successfully', new SiteInfoResource($siteInfo));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve site information', ['exception' => $e->getMessage()], 500);
        }
    }
}

