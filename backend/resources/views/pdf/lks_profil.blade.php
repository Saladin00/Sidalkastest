<!-- resources/views/lks_pdf.blade.php -->

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Profil LKS</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; line-height: 1.4; }
        .title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; }
        .section { margin-bottom: 10px; }
        .label { font-weight: bold; width: 150px; display: inline-block; }
    </style>
</head>
<body>
    <div class="title">Profil Lembaga Kesejahteraan Sosial</div>

    <div class="section"><span class="label">Nama:</span> {{ $lks->nama }}</div>
    <div class="section"><span class="label">Alamat:</span> {{ $lks->alamat }}</div>
    <div class="section"><span class="label">Jenis Layanan:</span> {{ $lks->jenis_layanan }}</div>
    <div class="section"><span class="label">Kecamatan:</span> {{ $lks->kecamatan }}</div>
    <div class="section"><span class="label">Status:</span> {{ $lks->status }}</div>

    <hr>

    <div class="section"><strong>Legalitas & Akreditasi</strong></div>
    <div class="section"><span class="label">Legalitas:</span> {{ $lks->legalitas ?? '-' }}</div>
    <div class="section"><span class="label">Akreditasi:</span> {{ $lks->akreditasi ?? '-' }}</div>

    <hr>

    <div class="section"><strong>Lokasi</strong></div>
    <div class="section"><span class="label">Koordinat:</span> {{ $lks->koordinat ?? '-' }}</div>

    <hr>

    <div class="section"><strong>Pengurus</strong></div>
    <div class="section">
        @if($lks->pengurus)
            {!! nl2br(e($lks->pengurus)) !!}
        @else
            <i>Belum diisi</i>
        @endif
    </div>

    <hr>

    <div class="section"><strong>Sarana & Prasarana</strong></div>
    <div class="section">
        @if($lks->sarana)
            {!! nl2br(e($lks->sarana)) !!}
        @else
            <i>Belum diisi</i>
        @endif
    </div>
</body>
</html>
