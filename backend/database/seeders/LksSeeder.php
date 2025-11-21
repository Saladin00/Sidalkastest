<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Lks;
use App\Models\Kecamatan;
use App\Models\Verifikasi;

class LksSeeder extends Seeder
{
     public function run(): void
    {
        /* ========================================================
         *  RESET DATA (agar tidak numpuk setiap seeding)
         * ====================================================== */
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

// bersihkan verifikasi log dulu
DB::table('verifikasi_logs')->delete();
DB::table('verifikasi')->delete();
DB::table('klien')->delete();
DB::table('lks')->delete();

// reset auto increment
DB::statement('ALTER TABLE verifikasi_logs AUTO_INCREMENT = 1;');
DB::statement('ALTER TABLE verifikasi AUTO_INCREMENT = 1;');
DB::statement('ALTER TABLE klien AUTO_INCREMENT = 1;');
DB::statement('ALTER TABLE lks AUTO_INCREMENT = 1;');

// hapus user role LKS
User::role('lks')->get()->each(function ($u) {
    $u->delete();
});

DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $desaByKecamatan = [
            'Indramayu' => [
                'Bojongsari (Kelurahan)','Karanganyar (Kelurahan)','Karangmalang (Kelurahan)',
                'Kepandean (Kelurahan)','Lemahabang (Kelurahan)','Lemahmekar (Kelurahan)',
                'Margadadi (Kelurahan)','Paoman (Kelurahan)','Dukuh','Karangsong','Pabeanudik',
                'Pekandangan','Singajaya','Sindang','Sukasari','Tambak','Telukagung','Terusan'
            ],
            'Jatibarang' => [
                'Bulak','Bulak Lor','Jatibarang','Jatibarang Baru','Jatisawit','Jatisawit Lor',
                'Kebulen','Lohbener','Malang Semboja','Pawidean','Pilangsari','Segeran',
                'Segeran Kidul','Tegalwangi','Tinumpuk'
            ],
            'Lohbener' => [
                'Bojongslawi','Kiajarankulon','Kiajaranketan','Lanjan','Lohbener',
                'Pamayahan','Rambatan Kulon','Sindangkerta','Waru','Sukawera','Sukamulya','Purwasari'
            ],
            'Sindang' => [
                'Babadan','Dermayu','Kenanga','Panyindangan Kulon','Panyindangan Wetan',
                'Pekandangan Jaya','Sindang','Terusan','Wanantara','Sindang Laut'
            ],
            'Kandanghaur' => [
                'Bulak','Curug','Eretan Kulon','Eretan Wetan','Kandanghaur','Karangmulya',
                'Kiarajaya','Pareangirang','Pranti','Soge','Wirapanjunan','Wirakanan','Ilir'
            ],
            'Balongan' => [
                'Balongan','Gelarmendala','Majakerta','Rawadalem','Sudimampir','Sudimampirlor',
                'Sukareja','Sukaurip','Tegalsembadra','Tegalurung'
            ],
        ];

        $jenisList = ['Anak', 'Lansia', 'Disabilitas', 'Fakir Miskin'];

        foreach ($desaByKecamatan as $namaKec => $desaList) {

            $kec = Kecamatan::where('nama', $namaKec)->first();
            if (!$kec) continue;

            foreach ($desaList as $desa) {

                for ($i = 1; $i <= 5; $i++) {

                    $lksName = "LKS {$i} {$desa} - {$namaKec}";

                    $lks = Lks::create([
                        'nama'           => $lksName,
                        'jenis_layanan'  => $jenisList[array_rand($jenisList)],
                        'status'         => 'pending', // default sebelum validasi
                        'alamat'         => "Jl. Mawar {$i}, {$desa}",
                        'kelurahan'      => $desa,
                        'kecamatan_id'   => $kec->id,
                    ]);

                   // --- Buat Akun User LKS (tanpa konflik) ---
$username = "lks{$i}_" . Str::slug($desa, '_') . "_" . Str::random(4);
$email = $username . "@gmail.com";

$user = User::create([
    'name'         => "User {$lksName}",
    'email'        => $email,
    'username'     => $username,
    'password'     => Hash::make('password'),
    'kecamatan_id' => $kec->id,
    'status_aktif' => true,
    'lks_id'       => $lks->id,
]);

$user->assignRole('lks');

// Bind user ke LKS
$lks->update(['user_id' => $user->id]);

// ===================================
//  CREATE VERIFIKASI AWAL (STATUS MENUNGGU)
// ===================================
// =======================================
// GENERATE TANGGAL VERIFIKASI RANDOM
// =======================================
$tanggalVerif = now()
    ->setYear(2025)
    ->setMonth(rand(1, 12))
    ->setDay(rand(1, 28))
    ->setTime(rand(8, 16), rand(0, 59), rand(0, 59));


// =======================================
//  CREATE VERIFIKASI AWAL (STATUS MENUNGGU)
// =======================================
Verifikasi::create([
    'lks_id' => $lks->id,
    'petugas_id' => null,
    'status' => 'menunggu', 
    'penilaian' => 'Menunggu penugasan dari operator kecamatan.',
    'catatan' => 'Pengajuan verifikasi awal dari sistem (seeder).',
    'tanggal_verifikasi' => $tanggalVerif,
]);


                }
            }
        }

        echo "\nSeeder LKS + Pengajuan Verifikasi → Sukses.\n";
    }
}
