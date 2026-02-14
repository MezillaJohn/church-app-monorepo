<?php

namespace App\Filament\Resources\Subaccounts\Pages;

use App\Filament\Resources\Subaccounts\SubaccountResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSubaccount extends CreateRecord
{
    protected static string $resource = SubaccountResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['created_by'] = auth()->id();

        if ($data['creation_method'] === 'automatic') {
            try {
                $paystackService = app(\App\Services\PaystackService::class);
                $response = $paystackService->createSubaccount($data); // data has business_name, bank, etc.

                $data['paystack_subaccount_code'] = $response['subaccount_code'];

                // Store other details from response if needed, but we already have them from form
            } catch (\Exception $e) {
                \Filament\Notifications\Notification::make()
                    ->title('Paystack Error')
                    ->body($e->getMessage())
                    ->danger()
                    ->send();

                $this->halt();
            }
        }

        return $data;
    }
}
