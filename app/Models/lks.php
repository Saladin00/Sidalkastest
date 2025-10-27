<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lks extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'type', 'address', 'district', 'contact_person', 'contact_phone', 'status'
    ];
}
