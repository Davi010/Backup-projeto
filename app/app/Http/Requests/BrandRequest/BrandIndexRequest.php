<?php

namespace App\Http\Requests\BrandRequest;

use Illuminate\Foundation\Http\FormRequest;

class BrandIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'per_page' => 'sometimes|integer|min:1|max:100',
            'name' => 'sometimes|string|max:255',
            'sort' => 'sometimes|string|in:name,-name,created_at,-created_at',
        ];
    }

    public function messages(): array
    {
        return [
            'per_page.integer' => 'O parâmetro per_page deve ser um número inteiro.',
            'per_page.min' => 'O valor mínimo de per_page é 1.',
            'per_page.max' => 'O valor máximo de per_page é 100.',
            'name.string' => 'O parâmetro name deve ser uma string.',
            'sort.in' => 'O parâmetro sort deve ser um dos valores permitidos: name, -name, created_at, -created_at.',
        ];
    }
}
