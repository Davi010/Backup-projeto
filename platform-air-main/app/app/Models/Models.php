<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Models extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand_id',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function equipments(): HasMany
    {
        return $this->hasMany(Equipment::class, 'model_id');
    }
}
