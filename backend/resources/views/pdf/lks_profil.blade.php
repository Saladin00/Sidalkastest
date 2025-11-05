<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Profil Lembaga Kesejahteraan Sosial</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #222;
            margin: 40px;
            line-height: 1.5;
        }
        .kop-surat {
            display: flex;
            align-items: center;
            border-bottom: 2px solid #004AAD;
            padding-bottom: 10px;
            margin-bottom: 25px;
        }
        .kop-surat img {
            width: 70px;
            height: auto;
            margin-right: 15px;
        }
        .kop-text {
            text-align: center;
            flex: 1;
        }
        .kop-text h1 {
            font-size: 16px;
            font-weight: bold;
            margin: 0;
            color: #000;
        }
        .kop-text h2 {
            font-size: 14px;
            margin: 2px 0;
            font-weight: normal;
            color: #000;
        }
        .kop-text p {
            font-size: 11px;
            margin: 2px 0;
            color: #333;
        }
        .header-title {
            text-align: center;
            margin-top: 10px;
            margin-bottom: 25px;
        }
        .header-title h3 {
            font-size: 15px;
            color: #004AAD;
            margin: 0;
            font-weight: bold;
        }
        .subtext {
            font-size: 11px;
            color: #666;
        }
        .section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #004AAD;
            border-left: 4px solid #004AAD;
            padding-left: 8px;
            margin-bottom: 10px;
        }
        .field {
            display: flex;
            margin-bottom: 5px;
        }
        .label {
            width: 180px;
            font-weight: bold;
        }
        .value {
            flex: 1;
        }
        hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 20px 0;
        }
        .footer {
            margin-top: 40px;
            font-size: 11px;
            text-align: right;
            color: #777;
        }
    </style>
</head>
<body>

    {{-- KOP SURAT --}}
    <div class="kop-surat">
        <img src="{{ public_path('logo.png') }}" alt="Logo Indramayu">
        <div class="kop-text">
            <h1>PEMERINTAH KABUPATEN INDRAMAYU</h1>
            <h2>DINAS SOSIAL</h2>
            <p>Jl. Gatot Subroto No. 1, Indramayu 45212</p>
            <p>Telp. (0234) 123456 — Email: dinsos@indramayukab.go.id</p>
        </div>
    </div>

    {{-- JUDUL HALAMAN --}}
    <div class="header-title">
        <h3>Profil Lembaga Kesejahteraan Sosial</h3>
        <p class="subtext">Data hasil inputan Sistem Informasi SIDALEKAS</p>
    </div>

    {{-- PROFIL UMUM --}}
    <div class="section">
        <div class="section-title">Profil Umum</div>
        <div class="field"><div class="label">Nama LKS</div><div class="value">{{ $lks->nama ?? '-' }}</div></div>
        <div class="field"><div class="label">Jenis Layanan</div><div class="value">{{ $lks->jenis_layanan ?? '-' }}</div></div>
        <div class="field"><div class="label">Status</div><div class="value">{{ $lks->status ?? '-' }}</div></div>
        <div class="field"><div class="label">Alamat</div><div class="value">{{ $lks->alamat ?? '-' }}</div></div>
        <div class="field"><div class="label">Kecamatan</div><div class="value">{{ $lks->kecamatan ?? '-' }}</div></div>
        <div class="field"><div class="label">Kelurahan / Desa</div><div class="value">{{ $lks->kelurahan ?? '-' }}</div></div>
        <div class="field"><div class="label">Koordinat</div><div class="value">{{ $lks->koordinat ?? '-' }}</div></div>
        <div class="field"><div class="label">NPWP</div><div class="value">{{ $lks->npwp ?? '-' }}</div></div>
        <div class="field"><div class="label">Kontak Pengurus</div><div class="value">{{ $lks->kontak_pengurus ?? '-' }}</div></div>
        <div class="field"><div class="label">Jumlah Pengurus</div><div class="value">{{ $lks->jumlah_pengurus ?? '-' }}</div></div>
    </div>

    <hr>

    {{-- LEGALITAS & AKREDITASI --}}
    <div class="section">
        <div class="section-title">Legalitas & Akreditasi</div>
        <div class="field"><div class="label">Akta Pendirian</div><div class="value">{{ $lks->akta_pendirian ?? '-' }}</div></div>
        <div class="field"><div class="label">No Akta</div><div class="value">{{ $lks->no_akta ?? '-' }}</div></div>
        <div class="field"><div class="label">Izin Operasional</div><div class="value">{{ $lks->izin_operasional ?? '-' }}</div></div>
        <div class="field"><div class="label">Legalitas</div><div class="value">{{ $lks->legalitas ?? '-' }}</div></div>
        <div class="field"><div class="label">Akreditasi</div><div class="value">{{ $lks->status_akreditasi ?? '-' }}</div></div>
        <div class="field"><div class="label">No Sertifikat</div><div class="value">{{ $lks->no_sertifikat ?? '-' }}</div></div>
        <div class="field"><div class="label">Tanggal Akreditasi</div><div class="value">{{ $lks->tanggal_akreditasi ?? '-' }}</div></div>
    </div>

    <hr>

    {{-- SARANA & MONITORING --}}
    <div class="section">
        <div class="section-title">Sarana & Monitoring</div>
        <div class="field"><div class="label">Sarana & Fasilitas</div><div class="value">{!! nl2br(e($lks->sarana ?? '-')) !!}</div></div>
        <div class="field"><div class="label">Hasil Observasi</div><div class="value">{!! nl2br(e($lks->hasil_observasi ?? '-')) !!}</div></div>
        <div class="field"><div class="label">Tindak Lanjut</div><div class="value">{!! nl2br(e($lks->tindak_lanjut ?? '-')) !!}</div></div>
    </div>

    <hr>

    {{-- PENGURUS --}}
    <div class="section">
        <div class="section-title">Data Pengurus</div>
        @if(!empty($lks->pengurus))
            <div class="value">{!! nl2br(e($lks->pengurus)) !!}</div>
        @else
            <i>Belum diisi</i>
        @endif
    </div>

    <hr>

    {{-- FOOTER --}}
    <div class="footer">
        Dicetak pada: {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}
    </div>
</body>
</html>
