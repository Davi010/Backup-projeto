<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $fillable = [
        'name',
        'building',
        'floor',
        'sector',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class, 'location_id');
    }
}
