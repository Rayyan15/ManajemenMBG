<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMenuScheduleRequest extends FormRequest
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
            'sppg_unit_id' => 'required|exists:sppg_units,id',
            'date' => 'required|date',
            'menu_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_portions' => 'required|integer|min:1',
            'status' => 'required|in:planned,producing,completed',
            'batch_number' => 'nullable|string',
            'cooking_status' => 'required|in:preparation,cooking,packaging,ready',
        ];
    }
}
