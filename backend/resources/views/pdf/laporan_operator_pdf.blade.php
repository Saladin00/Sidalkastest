<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Laporan Operator Kecamatan {{ $kecamatan }}</title>
    <style>
        @page { margin: 40px 50px; }
        body { font-family: 'Times New Roman', serif; font-size: 12px; color: #000; line-height: 1.6; }
        h1, h2, h3, h4, p { margin: 0; padding: 0; }

        /* === KOP SURAT === */
        .kop-container {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border-bottom: 2.5px solid #000;
            padding-bottom: 10px;
            margin-bottom: 25px;
        }

        .kop-logo {
            position: absolute;
            left: 45px;
            top: 5px;
            width: 85px;
            height: auto;
        }

        .kop-text {
            text-align: center;
            line-height: 1.35;
        }

        .kop-text h1 {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .kop-text h2 {
            font-size: 15px;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 2px;
        }

        .kop-text p {
            font-size: 12px;
            margin-top: 3px;
        }

        .kop-text .alamat {
            font-size: 11.5px;
            margin-top: 4px;
        }

        .kop-text .email {
            font-style: italic;
            font-size: 11.5px;
        }

        .kop-text .indramayu {
            margin-top: 6px;
            font-weight: bold;
            letter-spacing: 3px;
            font-size: 13px;
        }

        /* === HEADER INFO === */
        .header-info {
            text-align: center;
            margin-bottom: 10px;
            line-height: 1.4;
        }
        .header-info h3 {
            text-decoration: underline;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .header-detail {
            margin: 0 auto;
            width: fit-content;
            text-align: left;
        }
        .header-detail p {
            margin: 1px 0;
            font-size: 12px;
        }
        .header-detail strong {
            display: inline-block;
            width: 70px;
        }

        /* === TABEL === */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            border: 1px solid #555;
            padding: 6px 8px;
        }
        th {
            background: #e5e7eb;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11.5px;
        }
        td {
            font-size: 11.5px;
        }
        td:first-child {
            text-align: center;
            width: 40px;
        }
        td:nth-child(2) {
            text-align: left;
            padding-left: 10px;
        }
        td:last-child {
            text-align: center;
            width: 80px;
        }
        tr:nth-child(even) { background-color: #f9fafb; }

        /* === FOOTER DAN TTD === */
        .footer {
            margin-top: 40px;
            font-size: 11px;
            color: #000;
            display: flex;
            justify-content: space-between;
        }
        .ttd {
            width: 280px;
            text-align: center;
            float: right;
        }
        .ttd .jabatan {
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 60px;
        }
        .ttd .nama {
            font-weight: bold;
            text-decoration: underline;
        }
        .ttd .nip {
            font-size: 11px;
        }
    </style>
</head>

<body>
    {{-- === KOP SURAT === --}}
    <div class="kop-container">
        <img src="{{ public_path('images/logo-indramayu.png') }}" alt="Logo" class="kop-logo">
        <div class="kop-text">
            <h1>PEMERINTAH KABUPATEN INDRAMAYU</h1>
            <h2>DINAS SOSIAL</h2>
            <p class="alamat">Jl. Raya Pabean Udik No.268 Indramayu 45214 | Telp. (0234) 275214</p>
            <p class="email">Email: dinsos@indramayukab.go.id</p>
            <p class="indramayu">INDRAMAYU</p>
        </div>
    </div>

    {{-- === HEADER INFO LAPORAN === --}}
    <div class="header-info">
        <h3>LAPORAN OPERATOR KECAMATAN</h3>
        <div class="header-detail">
            <p><strong>Kecamatan</strong>: {{ $kecamatan }}</p>
            <p><strong>Periode</strong>: {{ ucfirst($periode) }}</p>
            @if(isset($range))
                <p><strong>Rentang</strong>: {{ $range['start'] }} — {{ $range['end'] }}</p>
            @endif
        </div>
    </div>

    {{-- === TABEL DATA === --}}
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kategori</th>
                <th>Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>1</td><td>LKS Valid</td><td>{{ $data['lks_valid'] ?? 0 }}</td></tr>
            <tr><td>2</td><td>LKS Tidak Valid</td><td>{{ $data['lks_tidak_valid'] ?? 0 }}</td></tr>
            <tr><td>3</td><td>LKS Proses</td><td>{{ $data['lks_proses'] ?? 0 }}</td></tr>
            <tr><td>4</td><td>Klien Aktif</td><td>{{ $data['klien_aktif'] ?? 0 }}</td></tr>
            <tr><td>5</td><td>Klien Tidak Aktif</td><td>{{ $data['klien_tidak_aktif'] ?? 0 }}</td></tr>
        </tbody>
    </table>

    {{-- === FOOTER DAN TANDA TANGAN === --}}
    <div class="footer">
        <div>
            Dicetak otomatis oleh Sistem SIDALKAS
            <br>
            <small>{{ now()->format('d F Y H:i') }}</small>
        </div>

        <div class="ttd">
            <div class="jabatan">Operator Kecamatan {{ $kecamatan }}</div>
            <div class="nama">{{ $user->nama ?? 'Nama Operator' }}</div>
            <div class="nip">NIP. {{ $user->nip ?? '-' }}</div>
        </div>
    </div>
</body>
</html>
