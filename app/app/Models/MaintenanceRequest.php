<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceRequest extends Model
{
    protected $table = 'maintenance_requests';

    protected $fillable = [
        'equipment_id',
        'employee_id',
        'room',
        'description',
        'status',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class, 'equipment_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}

