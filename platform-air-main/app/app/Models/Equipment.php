<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    protected $table = 'equipment';

    protected $fillable = [
        'name',
        'model_id',
        'quantity',
        'notes',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function model(): BelongsTo
    {
        return $this->belongsTo(Models::class, 'model_id');
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class, 'equipment_id');
    }
}
