<?php

namespace App\Http\Requests\MaintenanceRequest;

use Illuminate\Foundation\Http\FormRequest;

class MaintenanceIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'per_page' => 'sometimes|integer|min:1|max:100',
            'equipment_id' => 'sometimes|integer|exists:equipment,id',
            'location_id' => 'sometimes|integer|exists:locations,id',
            'user_id' => 'sometimes|integer|exists:users,id',
            'sort' => 'sometimes|string|in:service_date,-service_date,created_at,-created_at',
        ];
    }

    public function messages(): array
    {
        return [
            'per_page.integer' => 'O parâmetro per_page deve ser um número inteiro.',
            'per_page.min' => 'O valor mínimo de per_page é 1.',
            'per_page.max' => 'O valor máximo de per_page é 100.',
            'equipment_id.integer' => 'O parâmetro equipment_id deve ser um número inteiro.',
            'equipment_id.exists' => 'O equipamento selecionado não existe no sistema.',
            'location_id.integer' => 'O parâmetro location_id deve ser um número inteiro.',
            'location_id.exists' => 'A localização selecionada não existe no sistema.',
            'user_id.integer' => 'O parâmetro user_id deve ser um número inteiro.',
            'user_id.exists' => 'O usuário selecionado não existe no sistema.',
            'sort.in' => 'O parâmetro sort deve ser um dos valores permitidos.',
        ];
    }
}

