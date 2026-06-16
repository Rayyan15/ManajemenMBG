<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseOrderRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'raw_material_catalog_id' => 'required|exists:raw_material_catalogs,id',
            'quantity' => 'required|numeric|min:0.1',
            'vendor_name' => 'required|string|max:255',
            'is_taxed' => 'boolean',
            'notes' => 'nullable|string',
        ];
    }
}
