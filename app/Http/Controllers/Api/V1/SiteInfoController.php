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
            
            $siteInfo = [
                'social_links' => [
                    'facebook' => $socialLinks['social.facebook'] ?? '',
                    'twitter' => $socialLinks['social.twitter'] ?? '',
                    'instagram' => $socialLinks['social.instagram'] ?? '',
                    'linkedin' => $socialLinks['social.linkedin'] ?? '',
                    'youtube' => $socialLinks['social.youtube'] ?? '',
                ],
            ];

            return $this->ok('Site information retrieved successfully', new SiteInfoResource($siteInfo));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve site information', ['exception' => $e->getMessage()], 500);
        }
    }
}

