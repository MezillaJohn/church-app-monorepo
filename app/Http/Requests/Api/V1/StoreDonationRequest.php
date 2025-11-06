<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amount' => 'required|numeric|min:1',
            'donation_type_id' => 'required|exists:donation_types,id',
            'currency' => 'required|in:NGN,USD,EUR,GBP,CAD,AUD',
            'payment_method' => 'required|in:paystack,manual',
            'note' => 'sometimes|string|max:500',
            'is_anonymous' => 'sometimes|boolean',
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'donation_type_id.required' => 'Please select a donation type.',
            'donation_type_id.exists' => 'The selected donation type is invalid.',
            'currency.required' => 'Please select a currency.',
            'currency.in' => 'The selected currency is not supported.',
        ];
    }
}
