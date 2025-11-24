<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Administrasi Kabupaten</title>

    <style>
        body { font-family: sans-serif; font-size: 12px; color: #222; }
        h2, h3 { margin: 0; padding: 0; }
        .header { text-align: center; margin-bottom: 15px; }
        .sub-header { text-align: center; margin-bottom: 25px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 18px; }
        th, td { border: 1px solid #666; padding: 6px 8px; }
        th { background: #efefef; text-align: center; }
        .center { text-align: center; }
    </style>
</head>

<body>

    <div class="header">
        <h2>Laporan Administrasi Kabupaten</h2>
    </div>

    <div class="sub-header">
        <p><strong>Periode:</strong> {{ ucfirst($periode) }}</p>
        <p><strong>Rentang:</strong> {{ $range['start'] }} — {{ $range['end'] }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Kecamatan</th>
                <th>LKS Valid</th>
                <th>LKS Tidak Valid</th>
                <th>LKS Proses</th>
                <th>Klien Aktif</th>
                <th>Klien Tidak Aktif</th>
            </tr>
        </thead>

        <tbody>
            @foreach($data as $row)
                <tr>
                    <td>{{ $row['kecamatan'] }}</td>
                    <td class="center">{{ $row['lks_valid'] }}</td>
                    <td class="center">{{ $row['lks_tidak_valid'] }}</td>
                    <td class="center">{{ $row['lks_proses'] }}</td>
                    <td class="center">{{ $row['klien_aktif'] }}</td>
                    <td class="center">{{ $row['klien_tidak_aktif'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
