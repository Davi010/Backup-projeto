<?php

namespace App\Http\Requests\ModelsRequest;

use Illuminate\Foundation\Http\FormRequest;

class ModelsStoreRequest extends FormRequest
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
                'regex:/^[A-Za-z0-9À-ú\s]+$/',
                'not_regex:/^\s*$/',
            ],
            'brand_id' => [
                'required',
                'integer',
                'exists:brands,id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do modelo é obrigatório.',
            'name.string' => 'O nome do modelo deve ser uma string.',
            'name.max' => 'O nome do modelo não pode ter mais de 255 caracteres.',
            'name.regex' => 'O nome do modelo só pode conter letras, números e espaços.',
            'name.not_regex' => 'O nome do modelo não pode estar vazio ou conter apenas espaços.',
            'brand_id.required' => 'A marca é obrigatória.',
            'brand_id.integer' => 'O campo brand_id deve ser um número inteiro.',
            'brand_id.exists' => 'A marca selecionada não existe no sistema.',
        ];
    }
}
