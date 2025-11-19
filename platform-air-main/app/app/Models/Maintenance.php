<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    protected $dates = [
        'service_date',
        'created_at',
        'updated_at',
    ];

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class, 'equipment_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'location_id');
    }
}
