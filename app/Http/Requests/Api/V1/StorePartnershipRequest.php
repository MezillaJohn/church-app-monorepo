<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\PartnershipInterval;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePartnershipRequest extends FormRequest
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
            'fullname' => 'required|string|max:255',
            'phone_no' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'partnership_type_id' => 'required|exists:partnership_types,id',
            'interval' => ['required', Rule::enum(PartnershipInterval::class)],
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'sometimes|string|size:3',
            'user_id' => 'sometimes|nullable|exists:users,id',
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
            'fullname.required' => 'Please provide your full name.',
            'phone_no.required' => 'Please provide your phone number.',
            'email.required' => 'Please provide your email address.',
            'email.email' => 'Please provide a valid email address.',
            'partnership_type_id.required' => 'Please select a partnership type.',
            'partnership_type_id.exists' => 'The selected partnership type is invalid.',
            'interval.required' => 'Please select a partnership interval.',
            'interval.enum' => 'The selected interval is invalid.',
            'amount.required' => 'Please provide the partnership amount.',
            'amount.numeric' => 'The amount must be a valid number.',
            'amount.min' => 'The amount must be at least 0.01.',
            'currency.size' => 'The currency code must be exactly 3 characters.',
            'user_id.exists' => 'The selected user is invalid.',
        ];
    }
}
