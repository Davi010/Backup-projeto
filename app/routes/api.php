<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\MaintenancesController;
use App\Http\Controllers\ModelsController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\MaintenanceRequestController;

Route::apiResource('brand', BrandController::class);
Route::apiResource('model', ModelsController::class);
Route::apiResource('equipment', EquipmentController::class)->except(['destroy']);
Route::delete('equipment/{id}', [EquipmentController::class, 'destroy'])->name('equipment.destroy');

Route::get('maintenances', [MaintenancesController::class, 'index'])->name('maintenances.index');
Route::get('maintenances/{maintenance}', [MaintenancesController::class, 'show'])->name('maintenances.show');
Route::post('maintenances', [MaintenancesController::class, 'store'])->name('maintenances.store');
Route::patch('maintenances/{maintenance}', [MaintenancesController::class, 'update'])->name('maintenances.update');
Route::delete('maintenances/{maintenance}', [MaintenancesController::class, 'destroy'])->name('maintenances.destroy');

Route::apiResource('employee', EmployeeController::class);
Route::apiResource('maintenance-request', MaintenanceRequestController::class);
