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
            'sppg_unit_id' => 'required|exists:sppg_units,id',
            'raw_material_catalog_id' => 'required|exists:raw_material_catalogs,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'quantity' => 'required|numeric|min:0.1',
            'unit_price' => 'required|numeric|min:0',
            'is_taxed' => 'boolean',
            'notes' => 'nullable|string',
        ];
    }
}
