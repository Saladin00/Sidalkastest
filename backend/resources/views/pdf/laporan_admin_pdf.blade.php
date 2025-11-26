<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <title>Laporan Administrasi Kabupaten Indramayu</title>
    <style>
        @page {
            margin: 40px 50px;
        }

        body {
            font-family: 'Times New Roman', serif;
            font-size: 12px;
            color: #000;
        }

        h1,
        h2,
        h3,
        h4,
        p {
            margin: 0;
            padding: 0;
        }

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
            width: 90px;
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
            margin-bottom: 18px;
            text-align: left;
            line-height: 1.6;
        }

        .header-info h3 {
            text-align: center;
            text-decoration: underline;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .info {
            margin-left: 15px;
            margin-top: 5px;
        }

        .info p {
            margin: 2px 0;
            font-size: 12.5px;
        }

        .info p strong {
            display: inline-block;
            width: 80px;
        }

        /* === TABEL === */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
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
            text-align: center;
            font-size: 11.5px;
        }

        tr:nth-child(even) {
            background-color: #f9fafb;
        }

        /* === FOOTER DAN TTD === */
        .footer {
            margin-top: 35px;
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
        <h3>LAPORAN ADMINISTRASI KABUPATEN</h3>

        <div class="info">
            <p><strong>Kecamatan</strong>: Seluruh Kecamatan</p>
            <p><strong>Periode</strong>: {{ ucfirst($periode) }}</p>
            <p><strong>Rentang</strong>: {{ $range['start'] }} — {{ $range['end'] }}</p>
        </div>
    </div>

    {{-- === TABEL DATA === --}}
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kecamatan</th>
                <th>LKS Valid</th>
                <th>LKS Tidak Valid</th>
                <th>LKS Proses</th>
                <th>Klien Aktif</th>
                <th>Klien Tidak Aktif</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $i => $row)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td style="text-align:left;">{{ $row['kecamatan'] }}</td>
                    <td>{{ $row['lks_valid'] }}</td>
                    <td>{{ $row['lks_tidak_valid'] }}</td>
                    <td>{{ $row['lks_proses'] }}</td>
                    <td>{{ $row['klien_aktif'] }}</td>
                    <td>{{ $row['klien_tidak_aktif'] }}</td>
                </tr>
            @endforeach
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
            <div class="jabatan">Kepala Dinas Sosial Kabupaten Indramayu</div>
            <div class="nama">Drs. H. Nama Kepala Dinas</div>
            <div class="nip">NIP. 19650501 199001 1 001</div>
        </div>
    </div>
</body>

</html>