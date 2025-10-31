<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Resources\Api\V1\PushTokenResource;
use App\Models\PushToken;
use Illuminate\Http\Request;

class PushTokenController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $tokens = $request->user()->pushTokens()->get();
            return $this->ok('Push tokens retrieved successfully', PushTokenResource::collection($tokens));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve push tokens', ['exception' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required|string',
                'platform' => 'required|in:ios,android',
                'device_info' => 'sometimes|array',
            ]);

            $token = PushToken::updateOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'token' => $request->token,
                ],
                [
                    'platform' => $request->platform,
                    'device_info' => $request->device_info ?? null,
                    'is_active' => true,
                ]
            );

            return $this->ok('Push token registered successfully', new PushTokenResource($token), 201);
        } catch (\Exception $e) {
            return $this->error('Failed to register push token', ['exception' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, int $id)
    {
        try {
            $token = PushToken::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$token) {
                return $this->error('Push token not found', [], 404);
            }

            $token->delete();

            return $this->ok('Push token removed successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to remove push token', ['exception' => $e->getMessage()], 500);
        }
    }
}
