<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Models extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    protected $dates = ['created_at', 'updated_at'];

    public function brands(): HasMany
    {
        return $this->hasMany(Brand::class, 'brand_id');
    }
}
