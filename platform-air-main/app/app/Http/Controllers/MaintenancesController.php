<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use Illuminate\Http\Request;

class MaintenancesController extends Controller
{
    public function index()
    {
        return Maintenance::all();
    }

    public function show(Maintenance $maintenance)
    {
        return $maintenance;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|integer',
            'user_id' => 'required|integer',
            'user_name' => 'sometimes|string',
            'location_id' => 'required|integer',
            'location_name' => 'sometimes|string',            
            'description' => 'sometimes|string',
            'service_date' => 'required|date'
        ]);

        $maintenance = Maintenance::create($validated);

        return $maintenance;
    }

    public function update(Request $request, Maintenance $maintenance)
    {
        $validated = $request->validate([
            'equipment_id'   => 'sometimes|required|integer',
            'user_id'        => 'sometimes|required|integer',
            'user_name'      => 'sometimes|string',
            'location_id'    => 'sometimes|required|integer',
            'location_name'  => 'sometimes|string',
            'description'    => 'sometimes|string',
            'service_date'   => 'sometimes|required|date'
        ]);

        $maintenance->update($validated);

        return response()->json($maintenance);
    }

    public function destroy(Maintenance $maintenance)
    {
        $maintenance->delete();

        return response()->json([
            'message' => 'Maintenance deleted successfully.'
        ], 200);
    }
}
