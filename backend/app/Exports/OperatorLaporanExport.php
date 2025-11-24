<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class OperatorLaporanExport implements FromArray, WithHeadings
{
    protected $laporan;

    public function __construct(array $laporan)
    {
        $this->laporan = $laporan;
    }

    public function array(): array
    {
        return [[
            $this->laporan['kecamatan'],
            $this->laporan['data']['lks_valid'],
            $this->laporan['data']['lks_tidak_valid'],
            $this->laporan['data']['lks_proses'],
            $this->laporan['data']['klien_aktif'],
            $this->laporan['data']['klien_tidak_aktif'],
        ]];
    }

    public function headings(): array
    {
        return [
            'Kecamatan',
            'LKS Valid',
            'LKS Tidak Valid',
            'LKS Proses',
            'Klien Aktif',
            'Klien Tidak Aktif'
        ];
    }
}
