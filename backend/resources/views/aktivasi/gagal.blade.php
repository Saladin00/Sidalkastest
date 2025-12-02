<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Aktivasi Gagal</title>
<style>
    body { 
        font-family: Arial, sans-serif; 
        background: #f6f9fc; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        height: 100vh; 
        margin: 0;
    }
    .box {
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        width: 380px;
        text-align: center;
    }
    h2 { color: #e74c3c; margin-bottom: 10px; }
    p { color: #555; margin-bottom: 20px; }
    .btn {
        background: #3498db;
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
    }
</style>
</head>
<body>

<div class="box">
    <h2>Aktivasi Gagal ❌</h2>
    <p>{{ $pesan }}</p>

    @if(isset($email))
    <form action="{{ url('/api/resend-activation') }}" method="POST">
        @csrf
        <input type="hidden" name="email" value="{{ $email }}">
        <button class="btn">Kirim Ulang Link Aktivasi</button>
    </form>
    @endif
</div>

</body>
</html>
