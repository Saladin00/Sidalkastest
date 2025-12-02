<!DOCTYPE html>
<html>
<body style="font-family: Arial; line-height: 1.6;">
    <h2>Aktivasi Akun SIDALEKAS</h2>

    <p>Halo {{ $user->name }},</p>

    <p>Untuk mengaktifkan akun Anda, klik tombol berikut:</p>

    <p>
       <a href="{{ config('app.url') }}/aktivasi/{{ $user->activation_code }}"
          style="background:#3498db;color:white;padding:12px 18px;border-radius:6px;text-decoration:none;">
            Aktivasi Akun
        </a>
    </p>

    <p>Link ini akan kadaluarsa dalam <b>30 menit</b>.</p>

    <p>Jika Anda tidak merasa membuat akun, abaikan email ini.</p>

    <hr>
    <small>SIDALEKAS © {{ date('Y') }}</small>
</body>
</html>
