<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AdminLaporanExport implements FromArray, WithHeadings
{
    protected $rows;

    public function __construct(array $rows)
    {
        $this->rows = $rows;
    }

    public function headings(): array
    {
        return [
            "Kecamatan",
            "LKS Valid",
            "LKS Tidak Valid",
            "LKS Proses",
            "Klien Aktif",
            "Klien Tidak Aktif"
        ];
    }

    public function array(): array
    {
        return array_map(function($row) {
            return [
                $row['kecamatan'],
                $row['lks_valid'],
                $row['lks_tidak_valid'],
                $row['lks_proses'],
                $row['klien_aktif'],
                $row['klien_tidak_aktif'],
            ];
        }, $this->rows);
    }
}
