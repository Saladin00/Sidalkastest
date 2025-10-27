<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lks;



class LksController extends Controller
{
    public function index()
    {
        return response()->json(Lks::paginate(10));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'address' => 'required|string'
        ]);
        $lks = Lks::create($data);
        return response()->json($lks, 201);
    }

    public function show(Lks $lk)
    {
        return response()->json($lk);
    }

    public function update(Request $request, Lks $lk)
    {
        $lk->update($request->all());
        return response()->json($lk);
    }

    public function destroy(Lks $lk)
    {
        $lk->delete();
        return response()->json(['message' => 'LKS dihapus']);
    }
}
