// --- KONFIGURASI API ---
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTG0yPwSyNqlBdF-9L3Ts60r6raWcb-bk5CxdfOnnSZXHtg-2I3aNw9nFn0s9wwpildQ/exec';

document.getElementById('btnHamburger').addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('show');
});

function cekLogin() {
    const user = localStorage.getItem('userPGRI');
    return user ? JSON.parse(user) : null;
}

function prosesLogout() {
    localStorage.removeItem('userPGRI');
    alert('Anda telah berhasil keluar.');
    loadView('beranda');
}

// --- FUNGSI ROUTING UTAMA ---
function loadView(viewName) {
    const contentArea = document.getElementById('app-content');
    document.getElementById('navMenu').classList.remove('show'); 
    
    const user = cekLogin(); 
    const btnPortal = document.querySelector('.btn-login-toggle');
    
    if (user) {
        btnPortal.innerHTML = `<i class="ph ph-user-circle"></i> <span style="font-size: 0.85rem;">Dasbor</span>`;
        btnPortal.onclick = () => loadView('dashboard');
    } else {
        btnPortal.innerHTML = `<i class="ph ph-lock-key"></i> <span style="font-size: 0.85rem;">Portal</span>`;
        btnPortal.onclick = () => loadView('login');
    }

    if (viewName === 'beranda') {
        contentArea.innerHTML = `
            <div style="text-align: center; margin-top: 3rem;">
                <h1 style="font-size: 3rem; color: #1E293B;">Membangun Ekosistem Digital<br><span style="color: #D92B38;">Ciamis Tangguh</span></h1>
                <p style="margin-top: 1rem; color: #64748B;">Selamat datang di portal SAKTI PGRI Cabang Sukahaji.</p>
                <br><p style="color: #94A3B8; font-style: italic;">(Konten publik web utama akan muncul di sini)</p>
            </div>`;
    } 
    else if (viewName === 'login') {
        if (user) { loadView('dashboard'); return; }
        contentArea.innerHTML = `
            <div style="max-width: 400px; margin: 3rem auto; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #E2E8F0;">
                <h2 style="text-align: center; margin-bottom: 1.5rem; color: #D92B38;">Portal Anggota</h2>
                <div id="loginAlert" style="display:none; padding: 10px; margin-bottom: 15px; background: #FEE2E2; color: #991B1B; border-radius: 6px; font-size: 0.85rem; text-align:center;"></div>
                <form onsubmit="prosesLogin(event)">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem;">Nomor Pokok Anggota (NPA)</label>
                        <input type="text" id="npa" placeholder="Contoh: 32070625811" required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: inherit;">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem;">Kata Sandi</label>
                        <input type="password" id="password" placeholder="Masukkan Sandi" required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: inherit;">
                    </div>
                    <button type="submit" id="btnLoginSubmit" style="width: 100%; padding: 10px; background: #D92B38; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.3s;">Masuk</button>
                </form>
            </div>`;
    }
    else if (viewName === 'dashboard') {
        if (!user) { alert('Silakan login terlebih dahulu.'); loadView('login'); return; }

        contentArea.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #F1F5F9; z-index: 2000; display: flex; font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- SIDEBAR KIRI -->
                <div style="width: 260px; background: #1E293B; color: white; display: flex; flex-direction: column; box-shadow: 2px 0 5px rgba(0,0,0,0.1);">
                    <div style="padding: 1.5rem; background: #0F172A; text-align: center; border-bottom: 1px solid #334155;">
                        <h2 style="color: white; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 10px;"><i class="ph-fill ph-book-open" style="color: #D92B38;"></i> PGRI Sukahaji</h2>
                        <span style="font-size: 0.75rem; color: #94A3B8;">Portal Anggota</span>
                    </div>
                    <div style="padding: 1.5rem 1rem; flex-grow: 1;">
                        <p style="font-size: 0.75rem; color: #64748B; margin-bottom: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Menu Utama</p>
                        <button onclick="bukaMenuDasbor('menu-beranda', this)" class="btn-sidebar active" style="width: 100%; text-align: left; padding: 12px 15px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 8px; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 500; transition: 0.3s;"><i class="ph ph-house" style="font-size: 1.2rem;"></i> Beranda</button>
                        <button onclick="bukaMenuDasbor('menu-sakti', this)" class="btn-sidebar" style="width: 100%; text-align: left; padding: 12px 15px; background: transparent; color: #94A3B8; border: none; border-radius: 8px; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 500; transition: 0.3s;"><i class="ph ph-article" style="font-size: 1.2rem;"></i> SAKTI</button>
                    </div>
                    <div style="padding: 1rem; text-align: center; border-top: 1px solid #334155; font-size: 0.75rem; color: #64748B;">&copy; 2026 PGRI Sukahaji</div>
                </div>

                <!-- AREA KONTEN UTAMA (KANAN) -->
                <div style="flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden;">
                    <!-- TOPBAR -->
                    <div style="height: 65px; background: white; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem;">
                        <div style="font-weight: 600; color: #64748B; display: flex; align-items: center; gap: 8px;">
                            <i class="ph-fill ph-list" style="font-size: 1.2rem;"></i> <span id="judul-topbar">Beranda - Publikasi</span>
                        </div>
                        <div style="position: relative; display: inline-block;">
                            <!-- Trigger Button dengan Penambahan event passing & ID -->
                            <button id="btn-profil-trigger" onclick="toggleDropdownProfil(event)" style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 6px 15px 6px 6px; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s;">
                                <div style="width: 32px; height: 32px; background: #D92B38; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem;">${user.nama.charAt(0)}</div>
                                <div style="text-align: left;">
                                    <div style="font-size: 0.85rem; font-weight: 700; color: #1E293B;">${user.nama.split(',')[0]}</div>
                                    <div style="font-size: 0.7rem; color: #64748B;">${user.role}</div>
                                </div>
                                <i class="ph ph-caret-down" style="color: #64748B; margin-left: 5px;"></i>
                            </button>
                            <div id="dropdownProfil" style="display: none; position: absolute; right: 0; top: 110%; background: white; min-width: 200px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden; z-index: 100;">
                                <!-- Mengaktifkan menu Profil Saya -->
                                <a href="#" onclick="bukaProfil(); toggleDropdownProfil(event);" style="display: block; padding: 12px 15px; color: #1E293B; text-decoration: none; font-size: 0.9rem; border-bottom: 1px solid #F1F5F9;"><i class="ph ph-user" style="margin-right: 8px;"></i> Profil Saya</a>
                                <a href="#" onclick="prosesLogout()" style="display: block; padding: 12px 15px; color: #D92B38; text-decoration: none; font-size: 0.9rem; background: #FFF0F1;"><i class="ph ph-sign-out" style="margin-right: 8px;"></i> Keluar</a>
                            </div>
                        </div>
                    </div>

                    <!-- KONTEN DINAMIS DASBOR -->
                    <div style="flex: 1; padding: 2rem; overflow-y: auto;">
                        
                        <!-- MENU BERANDA (FEED FB STYLE) -->
                        <div id="menu-beranda" class="dasbor-konten" style="display: block;">
                            <div style="background: white; padding: 1.5rem 2rem; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                                <h3 style="color: #1E293B; margin-bottom: 5px;">Linimasa Praktik Baik SAKTI</h3>
                                <p style="color: #64748B; font-size: 0.9rem;">Temukan inspirasi inovasi dari rekan-rekan pendidik PGRI Sukahaji.</p>
                            </div>
                            <div id="feed-container">
                                <div style="text-align: center; padding: 2rem; color: #64748B;">
                                    <i class="ph ph-spinner-gap ph-spin" style="font-size: 2rem; color: #D92B38;"></i>
                                    <p>Memuat linimasa...</p>
                                </div>
                            </div>
                        </div>

                        <!-- MENU SAKTI -->
                        <div id="menu-sakti" class="dasbor-konten" style="display: none;">
                            <div id="panel-riwayat" style="display:block;">
                                <div style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 2rem;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                        <div>
                                            <h3 style="color: #1E293B;">Pengajuan & Riwayat SAKTI</h3>
                                            <p style="color: #64748B; font-size: 0.9rem;">Pantau status publikasi inovasi Anda.</p>
                                        </div>
                                        <button onclick="toggleFormArtikel(true)" style="padding: 10px 15px; background: #D92B38; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                            <i class="ph-bold ph-plus"></i> Buat Artikel Baru
                                        </button>
                                    </div>
                                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                        <thead style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
                                            <tr>
                                                <th style="padding: 12px; font-size: 0.85rem; color: #64748B;">Tanggal</th>
                                                <th style="padding: 12px; font-size: 0.85rem; color: #64748B;">Judul Artikel</th>
                                                <th style="padding: 12px; font-size: 0.85rem; color: #64748B;">Kategori</th>
                                                <th style="padding: 12px; font-size: 0.85rem; color: #64748B;">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabel-riwayat-body">
                                            <tr><td colspan="4" style="padding: 20px; text-align: center; color: #94A3B8; font-size: 0.9rem;"><i class="ph ph-spinner-gap ph-spin"></i> Memuat data...</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div id="panel-form-artikel" style="display:none;">
                                <div style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 2rem;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #E2E8F0; padding-bottom: 15px;">
                                        <h3 style="color: #1E293B;">Form Publikasi SAKTI</h3>
                                        <button onclick="toggleFormArtikel(false)" style="padding: 6px 12px; background: #F1F5F9; color: #64748B; border: 1px solid #CBD5E1; border-radius: 6px; cursor: pointer;">Kembali</button>
                                    </div>
                                    
                                    <form id="formArtikelSakti" onsubmit="submitArtikelSAKTI(event)">
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                            <div>
                                                <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Nama Lengkap & Gelar</label>
                                                <input type="text" name="nama" value="${user.nama}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #64748B; cursor: not-allowed;">
                                            </div>
                                            <div>
                                                <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Jenjang Pendidikan</label>
                                                <input type="text" name="jenjang" value="${user.jenjang}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #64748B; cursor: not-allowed;">
                                            </div>
                                        </div>

                                        <div style="margin-bottom: 15px;">
                                            <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Topik Inovasi (SAKTI)</label>
                                            <select name="kategori" required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: white;">
                                                <option value="" disabled selected>-- Pilih Topik Utama --</option>
                                                <option value="Pembelajaran Mendalam">Pembelajaran Mendalam (Deep Learning)</option>
                                                <option value="Rumah Pendidikan">Pemanfaatan Rumah Pendidikan</option>
                                                <option value="PID">Papan Interaktif Digital (PID)</option>
                                                <option value="Koding/KKA">Koding / Kecerdasan Komputasional (KKA)</option>
                                            </select>
                                        </div>

                                        <div style="margin-bottom: 15px;">
                                            <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Judul Artikel</label>
                                            <input type="text" name="judul" placeholder="Judul menarik..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px;">
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                            <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Abstraksi Singkat</label>
                                            <textarea name="abstraksi" placeholder="Ringkasan padat..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; min-height: 60px; font-family: inherit;"></textarea>
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                            <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Situasi (S)</label>
                                            <textarea name="situasi" placeholder="Kondisi awal..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; min-height: 60px; font-family: inherit;"></textarea>
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                            <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Tantangan (T)</label>
                                            <textarea name="tantangan" placeholder="Rintangan nyata..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; min-height: 60px; font-family: inherit;"></textarea>
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                            <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Langkah Aksi (A)</label>
                                            <textarea name="aksi" placeholder="Narasi operasional..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; min-height: 60px; font-family: inherit;"></textarea>
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                            <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Refleksi & Dampak (R)</label>
                                            <textarea name="refleksi" placeholder="Perubahan, umpan balik..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; min-height: 60px; font-family: inherit;"></textarea>
                                        </div>

                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                            <div>
                                                <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Link Foto Utama</label>
                                                <input type="url" name="link_foto" placeholder="https://drive..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px;">
                                            </div>
                                            <div>
                                                <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Link Dokumen</label>
                                                <input type="url" name="link_dokumen" placeholder="https://..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px;">
                                            </div>
                                        </div>

                                        <div style="text-align: right; margin-bottom: 10px; font-size: 0.85rem; font-weight: 600; color: #64748B;">
                                            Total Kata: <span id="angka-kata">0</span> / 1500
                                        </div>

                                        <button type="submit" id="btnSubmitArtikel" style="width: 100%; padding: 12px; background: #D92B38; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: 0.3s;">
                                            Kirim Artikel SAKTI
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- MENU PROFIL SAYA (BARU) -->
                        <div id="menu-profil" class="dasbor-konten" style="display: none;">
                            <div style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 2rem;">
                                <h3 style="color: #1E293B; margin-bottom: 15px;">Profil & Biodata</h3>
                                <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 20px;">Lengkapi data diri dan foto profil Anda (Fitur Simpan akan disiapkan di tahap berikutnya).</p>
                                <form>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                        <div>
                                            <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Nama Lengkap</label>
                                            <input type="text" value="${user.nama}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #64748B;">
                                        </div>
                                        <div>
                                            <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Jenjang Mengajar</label>
                                            <input type="text" value="${user.jenjang}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #64748B;">
                                        </div>
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                        <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Link Foto Profil (Google Drive)</label>
                                        <input type="url" placeholder="Paste link foto di sini..." style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px;">
                                    </div>
                                    <button type="button" onclick="alert('Pembaruan profil belum tersambung ke backend.')" style="padding: 10px 20px; background: #D92B38; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Simpan Pembaruan</button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>`;
        
        setTimeout(() => {
            fetchRiwayat();
            fetchFeed();
        }, 100);

    } else {
        contentArea.innerHTML = `<h2 style="text-align:center; margin-top: 3rem;">Halaman dalam pengembangan...</h2>`;
    }
}

// --- FUNGSI PENGHITUNG KATA REAL-TIME ---
document.addEventListener('input', function(e) {
    if (e.target.closest('#formArtikelSakti')) {
        const form = document.getElementById('formArtikelSakti');
        const teksGabungan = `${form.abstraksi.value} ${form.situasi.value} ${form.tantangan.value} ${form.aksi.value} ${form.refleksi.value}`;
        const jumlahKata = teksGabungan.trim().split(/\s+/).filter(word => word.length > 0).length;
        
        const spanAngka = document.getElementById('angka-kata');
        if (spanAngka) {
            spanAngka.innerText = jumlahKata;
            spanAngka.style.color = jumlahKata > 1500 ? '#D92B38' : '#10B981'; 
        }
    }
});

// --- FUNGSI LOGIN & SUBMIT API ---
async function prosesLogin(event) {
    event.preventDefault();
    const npa = document.getElementById('npa').value.trim();
    const pwd = document.getElementById('password').value.trim();
    const btn = document.getElementById('btnLoginSubmit');
    const alertBox = document.getElementById('loginAlert');
    
    btn.innerText = 'Memeriksa...'; btn.disabled = true; alertBox.style.display = 'none';

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'login', npa: npa, password: pwd })
        });
        const result = await response.json();
        if (result.status === 'success') {
            localStorage.setItem('userPGRI', JSON.stringify(result.data));
            loadView('dashboard'); 
        } else {
            alertBox.innerText = result.message; alertBox.style.display = 'block';
        }
    } catch (error) {
        alertBox.innerText = 'Gagal terhubung server.'; alertBox.style.display = 'block';
    } finally {
        btn.innerText = 'Masuk'; btn.disabled = false;
    }
}

async function submitArtikelSAKTI(event) {
    event.preventDefault();
    const form = document.getElementById('formArtikelSakti');
    const teksGabungan = `${form.abstraksi.value} ${form.situasi.value} ${form.tantangan.value} ${form.aksi.value} ${form.refleksi.value}`;
    const totalKata = teksGabungan.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (totalKata > 1500) {
        alert(`Mohon maaf, artikel Anda melebihi batas maksimal 1500 kata.\n(Saat ini: ${totalKata} kata).`);
        return;
    }

    const btn = document.getElementById('btnSubmitArtikel');
    btn.innerText = 'Mengirim Data... Mohon Tunggu...'; btn.disabled = true;

    const dataObj = {
        nama: form.nama.value, jenjang: form.jenjang.value,
        kategori: form.kategori.value, judul: form.judul.value,
        abstraksi: form.abstraksi.value, situasi: form.situasi.value,
        tantangan: form.tantangan.value, aksi: form.aksi.value,
        refleksi: form.refleksi.value, link_foto: form.link_foto.value,
        link_dokumen: form.link_dokumen.value
    };

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'submit_article', data: dataObj })
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert('Berhasil! Artikel Anda terkirim dengan status "Draft" menunggu validasi Ketua.');
            form.reset();
            document.getElementById('angka-kata').innerText = '0';
            toggleFormArtikel(false);
            fetchRiwayat(); 
        } else { alert('Gagal: ' + result.message); }
    } catch (error) { alert('Terjadi kesalahan jaringan.'); } 
    finally { btn.innerText = 'Kirim Artikel SAKTI'; btn.disabled = false; }
}

async function fetchRiwayat() {
    const user = cekLogin();
    if (!user) return;
    const tbody = document.getElementById('tabel-riwayat-body');
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'get_riwayat', nama: user.nama })
        });
        const result = await response.json();
        if (result.status === 'success') {
            if (result.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="padding: 20px; text-align: center; color: #94A3B8;">Belum ada artikel yang diajukan.</td></tr>';
            } else {
                let html = '';
                result.data.forEach(item => {
                    let statusBg = item.status === 'Approved' ? '#D1FAE5' : '#FEF3C7';
                    let statusText = item.status === 'Approved' ? '#065F46' : '#92400E';
                    html += `<tr style="border-bottom: 1px solid #E2E8F0;">
                        <td style="padding: 12px; font-size: 0.85rem; color: #64748B;">${item.tanggal}</td>
                        <td style="padding: 12px; font-size: 0.9rem; color: #1E293B; font-weight: 600;">${item.judul}</td>
                        <td style="padding: 12px; font-size: 0.85rem; color: #64748B;">${item.kategori}</td>
                        <td style="padding: 12px; font-size: 0.85rem;"><span style="background: ${statusBg}; color: ${statusText}; padding: 4px 10px; border-radius: 20px; font-weight: 600;">${item.status}</span></td>
                    </tr>`;
                });
                tbody.innerHTML = html;
            }
        }
    } catch (error) { tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #D92B38;">Kesalahan jaringan.</td></tr>`; }
}

async function fetchFeed() {
    const container = document.getElementById('feed-container');
    if(!container) return;
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'get_feed' })
        });
        const result = await response.json();
        if (result.status === 'success') {
            if (result.data.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 3rem; background: white; border-radius: 12px; border: 1px dashed #CBD5E1; color: #94A3B8;">Belum ada artikel yang dipublikasikan.</div>';
            } else {
                let html = '';
                result.data.forEach(item => {
                    const inisial = item.nama.charAt(0).toUpperCase();
                    html += `
                    <div style="background: white; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 1.5rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div style="padding: 1rem 1.5rem; display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #F1F5F9;">
                            <div style="width: 45px; height: 45px; border-radius: 50%; background: #1E293B; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem;">${inisial}</div>
                            <div>
                                <div style="font-weight: 700; color: #1E293B; font-size: 0.95rem;">${item.nama}</div>
                                <div style="font-size: 0.75rem; color: #64748B;">${item.tanggal} • <span style="color: #D92B38; font-weight:600;">${item.kategori}</span> • ${item.jenjang}</div>
                            </div>
                        </div>
                        <div style="padding: 1.5rem;">
                            <h4 style="color: #1E293B; margin-bottom: 10px; font-size: 1.1rem;">${item.judul}</h4>
                            <p style="color: #475569; font-size: 0.9rem; line-height: 1.6;">${item.abstraksi}</p>
                            <a href="#" onclick="alert('Mengarahkan ke artikel penuh.')" style="color: #D92B38; font-size: 0.85rem; font-weight: 600; text-decoration: none; display: inline-block; margin-top: 10px;">Lihat Selengkapnya &raquo;</a>
                        </div>
                        ${item.link_foto && item.link_foto.startsWith('http') ? `<div style="width: 100%; height: 350px; background-color: #F1F5F9; background-image: url('${item.link_foto.replace('view?usp=sharing', 'preview')}'); background-size: cover; background-position: center; border-top: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9;"></div>` : ''}
                        <div style="padding: 1rem 1.5rem; background: #F8FAFC; display: flex; gap: 25px;">
                            <button style="background: transparent; border: none; color: #64748B; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 8px;"><i class="ph ph-thumbs-up" style="font-size: 1.2rem;"></i> Suka</button>
                            <button style="background: transparent; border: none; color: #64748B; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 8px;"><i class="ph ph-chat-circle" style="font-size: 1.2rem;"></i> Komentar</button>
                        </div>
                    </div>`;
                });
                container.innerHTML = html;
            }
        }
    } catch (error) { container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #D92B38;">Kesalahan jaringan.</div>`; }
}

// --- FUNGSI UI DASBOR UTAMA ---
function toggleDropdownProfil(event) {
    if (event) event.stopPropagation(); // Mencegah klik terdeteksi oleh listener window
    const dropdown = document.getElementById('dropdownProfil');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
    }
}

// Listener Global untuk "Click Outside to Close"
window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('dropdownProfil');
    const trigger = document.getElementById('btn-profil-trigger');
    if (dropdown && dropdown.style.display === 'block') {
        // Tutup jika klik bukan di dalam dropdown dan bukan di dalam tombol trigger
        if (!dropdown.contains(e.target) && (!trigger || !trigger.contains(e.target))) {
            dropdown.style.display = 'none';
        }
    }
});

function bukaMenuDasbor(idMenu, btnElement) {
    document.getElementById('judul-topbar').innerText = idMenu === 'menu-beranda' ? 'Beranda - Publikasi' : 'SAKTI - Pengajuan & Riwayat';
    const semuaKonten = document.getElementsByClassName('dasbor-konten');
    for (let i = 0; i < semuaKonten.length; i++) semuaKonten[i].style.display = 'none';
    document.getElementById(idMenu).style.display = 'block';

    const semuaTombol = document.getElementsByClassName('btn-sidebar');
    for (let i = 0; i < semuaTombol.length; i++) {
        semuaTombol[i].style.background = 'transparent';
        semuaTombol[i].style.color = '#94A3B8';
    }
    // Jika dipanggil dari tombol sidebar (bukan dari dropdown), beri efek sorot
    if (btnElement) {
        btnElement.style.background = 'rgba(255,255,255,0.1)'; 
        btnElement.style.color = 'white';
    }
}

function bukaProfil() {
    // Sembunyikan konten lain, tampilkan menu profil
    const semuaKonten = document.getElementsByClassName('dasbor-konten');
    for (let i = 0; i < semuaKonten.length; i++) semuaKonten[i].style.display = 'none';
    
    document.getElementById('menu-profil').style.display = 'block';
    document.getElementById('judul-topbar').innerText = 'Profil - Data Pengguna';

    // Matikan sorotan semua tombol sidebar
    const semuaTombol = document.getElementsByClassName('btn-sidebar');
    for (let i = 0; i < semuaTombol.length; i++) {
        semuaTombol[i].style.background = 'transparent';
        semuaTombol[i].style.color = '#94A3B8';
    }
}

function toggleFormArtikel(show) {
    document.getElementById('panel-riwayat').style.display = show ? 'none' : 'block';
    document.getElementById('panel-form-artikel').style.display = show ? 'block' : 'none';
}

window.onload = () => loadView('beranda');
