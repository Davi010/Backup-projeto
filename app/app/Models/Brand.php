<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Brand extends Model
{
    protected $table = 'brands';

    protected $fillable = [
        'name',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function models(): HasMany
    {
        return $this->hasMany(Models::class, 'brand_id');
    }
}
