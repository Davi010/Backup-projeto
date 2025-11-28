<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $table = 'employees';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'department',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class, 'employee_id');
    }
}

