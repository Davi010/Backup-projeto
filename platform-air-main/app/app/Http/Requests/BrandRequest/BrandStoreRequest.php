<?php

namespace App\Http\Requests\BrandRequest;

use Illuminate\Foundation\Http\FormRequest;

class BrandStoreRequest extends FormRequest
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
                'unique:brands,name',
                'regex:/^[A-Za-z0-9À-ú\s]+$/',
                'not_regex:/^\s*$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome da marca é obrigatório.',
            'name.string' => 'O nome da marca deve ser uma string.',
            'name.max' => 'O nome da marca não pode ter mais de 255 caracteres.',
            'name.unique' => 'Essa marca já existe no sistema.',
            'name.regex' => 'O nome da marca só pode conter letras, números e espaços.',
            'name.not_regex' => 'O nome da marca não pode estar vazio ou conter apenas espaços.',
        ];
    }
}
