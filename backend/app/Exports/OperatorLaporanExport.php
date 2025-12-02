<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Color;

class OperatorLaporanExport implements FromArray, WithHeadings, WithStyles, WithTitle
{
    protected $laporan;

    public function __construct(array $laporan)
    {
        $this->laporan = $laporan;
    }

    public function headings(): array
    {
        return [
            ['PEMERINTAH KABUPATEN INDRAMAYU'],
            ['DINAS SOSIAL'],
            ['Jl. Raya Pabean Udik No.268 Indramayu 45214 | Telp. (0234) 275214'],
            ['Email: dinsos@indramayukab.go.id'],
            ['INDRAMAYU'],
            [],
            ['LAPORAN OPERATOR KECAMATAN'],
            [
                'Kecamatan: ' . ($this->laporan['kecamatan'] ?? '-'),
                'Periode: ' . ucfirst($this->laporan['periode'] ?? '-'),
                'Rentang: ' . ($this->laporan['range']['start'] ?? '-') . ' - ' . ($this->laporan['range']['end'] ?? '-')
            ],
            [],
            ['No', 'Kategori', 'Jumlah'],
        ];
    }

    public function array(): array
    {
        $d = $this->laporan['data'] ?? [];

        $rows = [
            [1, 'LKS Valid', $d['lks_valid'] ?? 0],
            [2, 'LKS Tidak Valid', $d['lks_tidak_valid'] ?? 0],
            [3, 'LKS Proses', $d['lks_proses'] ?? 0],
            [4, 'Klien Aktif', $d['klien_aktif'] ?? 0],
            [5, 'Klien Tidak Aktif', $d['klien_tidak_aktif'] ?? 0],
        ];

        // Tambahkan footer seperti PDF
        $rows[] = ['', '', ''];
        $rows[] = ['', '', 'Dicetak otomatis oleh Sistem SIDALKAS'];
        $rows[] = ['', '', now()->format('d F Y H:i')];
        $rows[] = ['', '', ''];
        $rows[] = ['', '', 'Operator Kecamatan ' . ($this->laporan['kecamatan'] ?? '-')];
        $rows[] = ['', '', $this->laporan['operator'] ?? 'Nama Operator'];
        $rows[] = ['', '', 'NIP. ' . ($this->laporan['user']->nip ?? '-')];

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        // === Merge header lebar (A–G agar tidak kepotong)
        foreach ([1, 2, 3, 4, 5, 7] as $r) {
            $sheet->mergeCells("A{$r}:G{$r}");
        }

        // === Kop surat
        $sheet->getStyle('A1:A5')->getFont()->setBold(true)->setName('Times New Roman');
        $sheet->getStyle('A1')->getFont()->setSize(16);
        $sheet->getStyle('A2')->getFont()->setSize(14);
        $sheet->getStyle('A5')->getFont()->setSize(13);
        $sheet->getStyle('A1:A5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('A3:A4')->getFont()->setItalic(true)->setSize(11);
        $sheet->getStyle('A3:A4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('A5')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM);

        // === Judul laporan
        $sheet->mergeCells('A7:G7');
        $sheet->getStyle('A7')->getFont()->setBold(true)->setSize(12);
        $sheet->getStyle('A7')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // === Info periode
        $sheet->mergeCells('A8:G8');
        $sheet->getStyle('A8')->getFont()->setItalic(true)->setSize(11);
        $sheet->getStyle('A8')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // === Header tabel (A10–C10)
        $sheet->getStyle('A10:C10')->applyFromArray([
            'font' => ['bold' => true, 'size' => 11],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFE2EBF8'],
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['argb' => 'FF666666'],
                ],
            ],
        ]);

        // === Data rows
        $highestRow = $sheet->getHighestRow();
        $dataEndRow = $highestRow - 7;

        $sheet->getStyle("A11:C{$dataEndRow}")->applyFromArray([
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF999999'],
                ],
            ],
        ]);

        // Rata kiri untuk kolom kategori
        $sheet->getStyle("B11:B{$dataEndRow}")
            ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

        // Warna baris bergantian
        for ($i = 11; $i <= $dataEndRow; $i++) {
            if ($i % 2 == 0) {
                $sheet->getStyle("A$i:C$i")->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('FFF8FAFD');
            }
        }

        // Border bawah tabel
        $sheet->getStyle("A{$dataEndRow}:C{$dataEndRow}")
            ->getBorders()->getBottom()
            ->setBorderStyle(Border::BORDER_MEDIUM)
            ->setColor(new Color('FF000000'));

        // === Ukuran kolom rapi
        $sheet->getColumnDimension('A')->setWidth(6);
        $sheet->getColumnDimension('B')->setWidth(35);
        $sheet->getColumnDimension('C')->setWidth(20);

        // === Tinggi baris
        for ($r = 1; $r <= $highestRow; $r++) {
            $sheet->getRowDimension($r)->setRowHeight(22);
        }

        // === Footer
        $footerStart = $highestRow - 6;
        $sheet->getStyle("A{$footerStart}:C{$highestRow}")
            ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("A{$footerStart}:C{$highestRow}")
            ->getFont()->setItalic(true)->setSize(11);
        $sheet->getStyle("A" . ($footerStart + 4) . ":C" . ($footerStart + 6))
            ->getFont()->setBold(true);
    }

    public function title(): string
    {
        return 'Laporan Operator';
    }
}
