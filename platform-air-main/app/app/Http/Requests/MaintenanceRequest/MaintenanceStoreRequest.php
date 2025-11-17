<?php

namespace App\Http\Requests\MaintenanceRequest;

use Illuminate\Foundation\Http\FormRequest;

class MaintenanceStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'equipment_id' => [
                'required',
                'integer',
                'exists:equipment,id',
            ],
            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
            ],
            'user_name' => [
                'nullable',
                'string',
                'max:255',
            ],
            'location_id' => [
                'required',
                'integer',
                'exists:locations,id',
            ],
            'location_name' => [
                'nullable',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'service_date' => [
                'required',
                'date',
                'date_format:Y-m-d',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'equipment_id.required' => 'O equipamento é obrigatório.',
            'equipment_id.integer' => 'O campo equipment_id deve ser um número inteiro.',
            'equipment_id.exists' => 'O equipamento selecionado não existe no sistema.',
            'user_id.required' => 'O usuário é obrigatório.',
            'user_id.integer' => 'O campo user_id deve ser um número inteiro.',
            'user_id.exists' => 'O usuário selecionado não existe no sistema.',
            'user_name.string' => 'O nome do usuário deve ser uma string.',
            'user_name.max' => 'O nome do usuário não pode ter mais de 255 caracteres.',
            'location_id.required' => 'A localização é obrigatória.',
            'location_id.integer' => 'O campo location_id deve ser um número inteiro.',
            'location_id.exists' => 'A localização selecionada não existe no sistema.',
            'location_name.string' => 'O nome da localização deve ser uma string.',
            'location_name.max' => 'O nome da localização não pode ter mais de 255 caracteres.',
            'description.string' => 'A descrição deve ser uma string.',
            'description.max' => 'A descrição não pode ter mais de 1000 caracteres.',
            'service_date.required' => 'A data do serviço é obrigatória.',
            'service_date.date' => 'A data do serviço deve ser uma data válida.',
            'service_date.date_format' => 'A data do serviço deve estar no formato Y-m-d.',
        ];
    }
}

