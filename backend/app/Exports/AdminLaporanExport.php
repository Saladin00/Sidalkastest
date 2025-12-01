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

class AdminLaporanExport implements FromArray, WithHeadings, WithStyles, WithTitle
{
    protected $rows, $periode, $range;

    public function __construct(array $data)
    {
        $this->rows = $data['data'] ?? $data;
        $this->periode = $data['periode'] ?? 'Bulan';
        $this->range = $data['range'] ?? ['start' => '-', 'end' => '-'];
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
            ['LAPORAN ADMINISTRASI KABUPATEN'],
            ["Periode: " . ucfirst($this->periode) . " | Rentang: " . $this->range['start'] . " - " . $this->range['end']],
            [],
            ['No', 'Kecamatan', 'LKS Valid', 'LKS Tidak Valid', 'LKS Proses', 'Klien Aktif', 'Klien Tidak Aktif'],
        ];
    }

    public function array(): array
    {
        $result = [];
        foreach ($this->rows as $i => $row) {
            $result[] = [
                $i + 1,
                $row['kecamatan'],
                $row['lks_valid'],
                $row['lks_tidak_valid'],
                $row['lks_proses'],
                $row['klien_aktif'],
                $row['klien_tidak_aktif'],
            ];
        }

        // Tambahkan footer seperti PDF
        $result[] = ['', '', '', '', '', '', ''];
        $result[] = ['', '', '', '', '', '', 'Dicetak otomatis oleh Sistem SIDALKAS'];
        $result[] = ['', '', '', '', '', '', now()->format('d F Y H:i')];
        $result[] = ['', '', '', '', '', '', ''];
        $result[] = ['', '', '', '', '', '', 'Kepala Dinas Sosial Kabupaten Indramayu'];
        $result[] = ['', '', '', '', '', '', ''];
        $result[] = ['', '', '', '', '', '', 'Drs. H. Nama Kepala Dinas'];
        $result[] = ['', '', '', '', '', '', 'NIP. 19650501 199001 1 001'];

        return $result;
    }

    public function styles(Worksheet $sheet)
    {
        // === Merge header
        foreach ([1, 2, 3, 4, 5, 7, 8] as $r) {
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

        // === Header laporan
        $sheet->getStyle('A7:A8')->getFont()->setBold(true)->setSize(12);
        $sheet->getStyle('A7:A8')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // === Header tabel
        $sheet->getStyle('A10:G10')->applyFromArray([
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
        $dataEndRow = $highestRow - 8; // sebelum footer

        $sheet->getStyle("A11:G{$dataEndRow}")->applyFromArray([
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

        // === Warna baris bergantian
        for ($i = 11; $i <= $dataEndRow; $i++) {
            if ($i % 2 == 0) {
                $sheet->getStyle("A$i:G$i")->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('FFF8FAFD');
            }
        }

        // === Border tebal untuk penutup tabel
        $sheet->getStyle("A{$dataEndRow}:G{$dataEndRow}")
    ->getBorders()->getBottom()
    ->setBorderStyle(Border::BORDER_MEDIUM)
    ->setColor(new Color('FF000000'));

        // === Kolom & ukuran
        $sheet->getColumnDimension('A')->setWidth(5);
        $sheet->getColumnDimension('B')->setWidth(25);
        foreach (range('C', 'G') as $col) {
            $sheet->getColumnDimension($col)->setWidth(17);
        }

        for ($r = 1; $r <= $highestRow; $r++) {
            $sheet->getRowDimension($r)->setRowHeight(22);
        }

        // === Style footer
        $footerStart = $highestRow - 7;
        $sheet->getStyle("A{$footerStart}:G$highestRow")
            ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle("A{$footerStart}:G$highestRow")
            ->getFont()->setItalic(true)->setSize(11);
        $sheet->getStyle("A" . ($footerStart + 4) . ":G" . ($footerStart + 7))
            ->getFont()->setBold(true);
    }

    public function title(): string
    {
        return 'Laporan Administrasi';
    }
}
