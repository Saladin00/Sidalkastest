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
        /* ================================
         * RESET DATA
         * ================================ */
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('verifikasi_logs')->truncate();
        DB::table('verifikasi')->truncate();
        DB::table('klien')->truncate();
        DB::table('lks')->truncate();

        // Hapus semua user role LKS
        User::role('lks')->get()->each(fn($u) => $u->delete());

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        /* ================================
         * DATA DESA PER KECAMATAN
         * ================================ */
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


        /* ================================
         * LOOP KECAMATAN → DESA → 5 LKS
         * ================================ */
        foreach ($desaByKecamatan as $namaKec => $desaList) {

            $kec = Kecamatan::where('nama', $namaKec)->first();
            if (!$kec) continue;

            foreach ($desaList as $desa) {

                for ($i = 1; $i <= 5; $i++) {

                    /* ================================
                     * CREATE LKS
                     * ================================ */
                    $lksName = "LKS {$i} {$desa} - {$namaKec}";

                    $lks = Lks::create([
                        'nama'          => $lksName,
                        'jenis_layanan' => $jenisList[array_rand($jenisList)],
                        'status'        => 'pending',
                        'alamat'        => "Jl. Mawar {$i}, {$desa}",
                        'kelurahan'     => $desa,
                        'kecamatan_id'  => $kec->id,
                    ]);

                    /* ================================
                     * CREATE USER LKS
                     * ================================ */
                    $username = "lks{$i}_" . Str::slug($desa, '_') . "_" . Str::random(4);
                    $email    = $username . "@gmail.com";

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

                    // Bind ke LKS
                    $lks->update(['user_id' => $user->id]);


                    /* ================================
                     * STATUS VERIFIKASI REALISTIK
                     * ================================ */
                    $skenario = rand(1, 4);

                    switch ($skenario) {

                        case 1:
                            // Baru mengajukan
                            $statusLks    = 'menunggu_operator';
                            $statusVerif  = 'menunggu';
                            $catatan      = 'LKS baru mengajukan verifikasi.';
                            $tanggalVerif = now()->subDays(rand(1, 30));
                            break;

                        case 2:
                            // Operator → petugas
                            $statusLks    = 'proses_survei';
                            $statusVerif  = 'proses_survei';
                            $catatan      = 'Operator mengirim ke petugas survei.';
                            $tanggalVerif = now()->subDays(rand(31, 90));
                            break;

                        case 3:
                            // Petugas → admin
                            $statusLks    = 'proses_validasi';
                            $statusVerif  = 'dikirim_admin';
                            $catatan      = 'Petugas telah mengirim hasil survei ke admin.';
                            $tanggalVerif = now()->subDays(rand(91, 180));
                            break;

                        case 4:
                        default:
                            // Admin valid
                            $statusLks    = 'valid';
                            $statusVerif  = 'valid';
                            $catatan      = 'Admin telah menyetujui verifikasi.';
                            $tanggalVerif = now()->subDays(rand(181, 365)); // 6–12 bulan (2024)
                            break;
                    }

                    // Update status LKS (kolom status_verifikasi)
                    $lks->update(['status_verifikasi' => $statusLks]);

                    /* ================================
                     * CREATE VERIFIKASI
                     * ================================ */
                    Verifikasi::create([
                        'lks_id'            => $lks->id,
                        'petugas_id'        => null,
                        'status'            => $statusVerif,
                        'penilaian'         => ucfirst(str_replace('_', ' ', $statusVerif)),
                        'catatan'           => $catatan,
                        'tanggal_verifikasi'=> $tanggalVerif,
                    ]);
                }
            }
        }

        echo "\nSeeder LKS + Verifikasi Realistik → SUKSES.\n";
    }
}
