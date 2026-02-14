<?php

namespace App\Filament\Resources\Subaccounts\Pages;

use App\Filament\Resources\Subaccounts\SubaccountResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditSubaccount extends EditRecord
{
    protected static string $resource = SubaccountResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Only attempt to update Paystack if it was created automatically or has a code
        if (!empty($data['paystack_subaccount_code'])) {
            try {
                // Prepare data for Paystack update
                // Note: Paystack update endpoint uses specific fields.
                // We map our form data to Paystack's expected payload.
                $paystackData = [
                    'business_name' => $data['business_name'],
                    'settlement_bank' => $data['settlement_bank'],
                    'account_number' => $data['account_number'],
                    'percentage_charge' => $data['percentage_charge'],
                    // Add other fields if available in the form
                ];

                app(\App\Services\PaystackService::class)->updateSubaccount(
                    $data['paystack_subaccount_code'],
                    $paystackData
                );

                \Filament\Notifications\Notification::make()
                    ->success()
                    ->title('Paystack Subaccount Updated')
                    ->body('The subaccount details have been synced with Paystack.')
                    ->send();

            } catch (\Exception $e) {
                // Log the error but maybe allow local update to proceed, or halt?
                // Plan says: If API fail, throw notification and halt.
                \Filament\Notifications\Notification::make()
                    ->danger()
                    ->title('Paystack Sync Failed')
                    ->body('Could not update subaccount on Paystack: ' . $e->getMessage())
                    ->send();

                $this->halt();
            }
        }

        return $data;
    }
}
