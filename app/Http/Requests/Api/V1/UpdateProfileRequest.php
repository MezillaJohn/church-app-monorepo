<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
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
            'church_centre' => 'sometimes|integer|exists:church_centres,id',
            'country' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'gender' => 'sometimes|in:male,female,other',
            'church_member' => 'sometimes|boolean',
        ];
    }
}
