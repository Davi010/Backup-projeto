<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Maintenance extends Model
{
    protected $fillable = [
        'equipment_id',
        'user_id',
        'user_name',
        'location_id',
        'location_name',
        'description',
        'service_date'
    ];

    public function equipment(): HasOne
    {
        return $this->hasOne(Equipment::class);
    }

    public function location(): HasOne
    {
        return $this->hasOne(Location::class);
    }
}
