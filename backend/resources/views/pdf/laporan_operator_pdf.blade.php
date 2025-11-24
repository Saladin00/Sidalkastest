<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #444; padding: 6px; }
        th { background: #efefef; }
    </style>
</head>
<body>

<h2>Laporan Operator Kecamatan {{ $kecamatan }}</h2>

@if(isset($range) && is_array($range))
    <p>Periode: {{ ucfirst($periode) }}</p>
    <p>Rentang: {{ $range['start'] }} — {{ $range['end'] }}</p>
@endif

<table>
    <thead>
        <tr>
            <th>LKS Valid</th>
            <th>LKS Tidak Valid</th>
            <th>LKS Proses</th>
            <th>Klien Aktif</th>
            <th>Klien Tidak Aktif</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>{{ $data['lks_valid'] ?? 0 }}</td>
            <td>{{ $data['lks_tidak_valid'] ?? 0 }}</td>
            <td>{{ $data['lks_proses'] ?? 0 }}</td>
            <td>{{ $data['klien_aktif'] ?? 0 }}</td>
            <td>{{ $data['klien_tidak_aktif'] ?? 0 }}</td>
        </tr>
    </tbody>
</table>

</body>
</html>
