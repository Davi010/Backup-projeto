<?php

namespace App\Http\Requests\EquipmentRequest;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'min:3',
                'regex:/^[A-Za-z0-9À-ú\s\-_]+$/',
                'not_regex:/^\s*$/',
            ],
            'model_id' => [
                'required',
                'integer',
                'exists:models,id',
            ],
            'quantity' => [
                'required',
                'integer',
                'min:1',
                'max:9999',
            ],
            'btus' => [
                'nullable',
                'integer',
                'min:7000',
                'max:120000',
            ],
            'status' => [
                'required',
                'string',
                'in:funcionando,manutencao,defeito,desativado',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do equipamento é obrigatório.',
            'name.string' => 'O nome do equipamento deve ser uma string.',
            'name.min' => 'O nome do equipamento deve ter no mínimo 3 caracteres.',
            'name.max' => 'O nome do equipamento não pode ter mais de 255 caracteres.',
            'name.regex' => 'O nome do equipamento só pode conter letras, números, espaços, hífens e underscores.',
            'name.not_regex' => 'O nome do equipamento não pode estar vazio ou conter apenas espaços.',
            'model_id.required' => 'O modelo é obrigatório.',
            'model_id.integer' => 'O campo model_id deve ser um número inteiro.',
            'model_id.exists' => 'O modelo selecionado não existe no sistema.',
            'quantity.required' => 'A quantidade é obrigatória.',
            'quantity.integer' => 'A quantidade deve ser um número inteiro.',
            'quantity.min' => 'A quantidade mínima é 1.',
            'quantity.max' => 'A quantidade máxima é 9999.',
            'btus.integer' => 'Os BTUs devem ser um número inteiro.',
            'btus.min' => 'Os BTUs mínimos são 7000.',
            'btus.max' => 'Os BTUs máximos são 120000.',
            'status.required' => 'O status é obrigatório.',
            'status.in' => 'O status deve ser: funcionando, manutencao, defeito ou desativado.',
            'notes.string' => 'As notas devem ser uma string.',
            'notes.max' => 'As notas não podem ter mais de 1000 caracteres.',
        ];
    }
}

