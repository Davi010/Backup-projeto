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
            'name' => 'sometimes|string|max:255',
            'brand_id' => 'sometimes|integer|exists:brands,id',];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'O campo name deve ser uma string.',
            'name.max' => 'O campo name não pode exceder 255 caracteres.',
            'brand_id.integer' => 'O campo brand_id deve ser um número inteiro.',
            'brand_id.exists' => 'O brand_id fornecido não existe na tabela brands.',
        ];
    }
}
