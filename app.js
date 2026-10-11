// --- KONFIGURASI API ---
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTG0yPwSyNqlBdF-9L3Ts60r6raWcb-bk5CxdfOnnSZXHtg-2I3aNw9nFn0s9wwpildQ/exec';

// Penyimpanan sementara di memori browser untuk keperluan Preview & Edit
let daftarRiwayatUser = [];
let daftarFeedPublik = [];

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

// Helper: Mengubah Link GDrive menjadi Link Gambar Langsung (Bypass Blokir Google)
function getDirectDriveLink(url) {
    if (!url) return '';
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
    return url;
}

// Helper: Membuat Komponen Rich Text Editor (Ala MS Word)
function buatRichEditor(id, label, placeholder) {
    return `
    <div style="margin-bottom: 18px;">
        <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; color: #1E293B;">${label}</label>
        <div class="rte-container">
            <div class="rte-toolbar">
                <button type="button" class="rte-btn" onclick="formatTeks('${id}', 'bold')" title="Tebal (Bold)"><i class="ph-bold ph-text-b"></i></button>
                <button type="button" class="rte-btn" onclick="formatTeks('${id}', 'italic')" title="Miring (Italic)"><i class="ph-bold ph-text-italic"></i></button>
                <button type="button" class="rte-btn" onclick="formatTeks('${id}', 'underline')" title="Garis Bawah (Underline)"><i class="ph-bold ph-text-underline"></i></button>
                <div class="rte-divider"></div>
                <button type="button" class="rte-btn" onclick="formatTeks('${id}', 'justifyLeft')" title="Rata Kiri"><i class="ph-bold ph-text-align-left"></i></button>
                <button type="button" class="rte-btn" onclick="formatTeks('${id}', 'justifyCenter')" title="Rata Tengah"><i class="ph-bold ph-text-align-center"></i></button>
                <button type="button" class="rte-btn" onclick="formatTeks('${id}', 'justifyRight')" title="Rata Kanan"><i class="ph-bold ph-text-align-right"></i></button>
                <button type="button" class="rte-btn" onclick="formatTeks('${id}', 'justifyFull')" title="Rata Kiri-Kanan (Justify)"><i class="ph-bold ph-text-align-justify"></i></button>
                <div class="rte-divider"></div>
                <button type="button" class="rte-btn" onclick="formatTeks('${id}', 'insertUnorderedList')" title="Bullet List"><i class="ph-bold ph-list-bullets"></i></button>
                <button type="button" class="rte-btn" onclick="formatTeks('${id}', 'insertOrderedList')" title="Numbering List"><i class="ph-bold ph-list-numbers"></i></button>
                <div class="rte-divider"></div>
                <button type="button" class="rte-btn" onclick="sisipTabel('${id}')" title="Sisipkan Tabel"><i class="ph-bold ph-table"></i></button>
                <button type="button" class="rte-btn" onclick="sisipGambarDrive('${id}')" title="Sisipkan Gambar dari Google Drive"><i class="ph-bold ph-image"></i></button>
            </div>
            <div id="rte-${id}" class="rte-editor" contenteditable="true" data-placeholder="${placeholder}" oninput="hitungKataRealtime()"></div>
        </div>
    </div>`;
}

// Fungsi Eksekusi Toolbar MS Word
function formatTeks(id, command, value = null) {
    const editor = document.getElementById('rte-' + id);
    editor.focus();
    document.execCommand(command, false, value);
    hitungKataRealtime();
}

function sisipTabel(id) {
    const baris = prompt("Masukkan jumlah baris tabel:", "3");
    const kolom = prompt("Masukkan jumlah kolom tabel:", "3");
    if (baris && kolom && parseInt(baris) > 0 && parseInt(kolom) > 0) {
        let htmlTabel = '<table style="width:100%; border-collapse: collapse; margin: 10px 0;"><tbody>';
        for (let r = 0; r < parseInt(baris); r++) {
            htmlTabel += '<tr>';
            for (let c = 0; c < parseInt(kolom); c++) {
                htmlTabel += `<td style="border: 1px solid #CBD5E1; padding: 8px;">${r === 0 ? '<b>Judul Kolom</b>' : 'Isi sel...'}</td>`;
            }
            htmlTabel += '</tr>';
        }
        htmlTabel += '</tbody></table><p><br></p>';
        formatTeks(id, 'insertHTML', htmlTabel);
    }
}

function sisipGambarDrive(id) {
    const url = prompt("Tempelkan (Paste) Link Foto Google Drive di sini:\n(Pastikan akses foto sudah 'Siapa saja yang memiliki link')");
    if (url && url.trim() !== '') {
        const directUrl = getDirectDriveLink(url.trim());
        const imgHtml = `<div style="text-align: center; margin: 12px 0;"><img src="${directUrl}" referrerpolicy="no-referrer" style="max-width: 100%; max-height: 400px; border-radius: 8px; border: 1px solid #E2E8F0;"><br><small style="color: #64748B; font-style: italic;">Ketik keterangan gambar di sini...</small></div><p><br></p>`;
        formatTeks(id, 'insertHTML', imgHtml);
    }
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

        const inisialUser = user.nama ? user.nama.charAt(0).toUpperCase() : 'U';
        const avatarHTML = user.foto && user.foto.trim() !== '' 
            ? `<img src="${getDirectDriveLink(user.foto)}" referrerpolicy="no-referrer" onerror="this.outerHTML='<div style=\\'width: 32px; height: 32px; background: #D92B38; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem;\\'>${inisialUser}</div>'" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">` 
            : `<div style="width: 32px; height: 32px; background: #D92B38; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem;">${inisialUser}</div>`;

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
                            <button id="btn-profil-trigger" onclick="toggleDropdownProfil(event)" style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 6px 15px 6px 6px; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s;">
                                ${avatarHTML}
                                <div style="text-align: left;">
                                    <div style="font-size: 0.85rem; font-weight: 700; color: #1E293B;">${user.nama.split(',')[0]}</div>
                                    <div style="font-size: 0.7rem; color: #64748B;">${user.role}</div>
                                </div>
                                <i class="ph ph-caret-down" style="color: #64748B; margin-left: 5px;"></i>
                            </button>
                            <div id="dropdownProfil" style="display: none; position: absolute; right: 0; top: 110%; background: white; min-width: 200px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden; z-index: 100;">
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
                                            <p style="color: #64748B; font-size: 0.9rem;">Kelola draf, pratinjau, edit, dan pantau status publikasi inovasi Anda.</p>
                                        </div>
                                        <button onclick="bukaFormBuatBaru()" style="padding: 10px 15px; background: #D92B38; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                            <i class="ph-bold ph-plus"></i> Buat Artikel Baru
                                        </button>
                                    </div>
                                    <div style="overflow-x: auto;">
                                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                            <thead style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
                                                <tr>
                                                    <th style="padding: 12px; font-size: 0.85rem; color: #64748B;">Tanggal</th>
                                                    <th style="padding: 12px; font-size: 0.85rem; color: #64748B;">Judul Artikel</th>
                                                    <th style="padding: 12px; font-size: 0.85rem; color: #64748B;">Kategori</th>
                                                    <th style="padding: 12px; font-size: 0.85rem; color: #64748B;">Status</th>
                                                    <th style="padding: 12px; font-size: 0.85rem; color: #64748B; text-align: right;">Tindakan (Aksi)</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tabel-riwayat-body">
                                                <tr><td colspan="5" style="padding: 20px; text-align: center; color: #94A3B8; font-size: 0.9rem;"><i class="ph ph-spinner-gap ph-spin"></i> Memuat data...</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <!-- PANEL FORM ARTIKEL (DENGAN RICH TEXT EDITOR) -->
                            <div id="panel-form-artikel" style="display:none;">
                                <div style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 2rem;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #E2E8F0; padding-bottom: 15px;">
                                        <div>
                                            <h3 id="judul-form-sakti" style="color: #1E293B;">Form Publikasi SAKTI</h3>
                                            <small id="subjudul-form-sakti" style="color: #64748B;">Gunakan bilah alat (toolbar) di setiap kotak untuk memformat tulisan layaknya MS Word.</small>
                                        </div>
                                        <button type="button" onclick="toggleFormArtikel(false)" style="padding: 6px 12px; background: #F1F5F9; color: #64748B; border: 1px solid #CBD5E1; border-radius: 6px; cursor: pointer; font-weight: 600;">Kembali</button>
                                    </div>
                                    
                                    <form id="formArtikelSakti" onsubmit="event.preventDefault();">
                                        <!-- Penyimpan ID Baris jika dalam Mode Edit -->
                                        <input type="hidden" id="edit-row-id" value="">

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
                                            <select name="kategori" id="input-kategori" required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: white;">
                                                <option value="" disabled selected>-- Pilih Topik Utama --</option>
                                                <option value="Pembelajaran Mendalam">Pembelajaran Mendalam (Deep Learning)</option>
                                                <option value="Rumah Pendidikan">Pemanfaatan Rumah Pendidikan</option>
                                                <option value="PID">Papan Interaktif Digital (PID)</option>
                                                <option value="Koding/KKA">Koding / Kecerdasan Komputasional (KKA)</option>
                                            </select>
                                        </div>

                                        <div style="margin-bottom: 18px;">
                                            <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Judul Artikel Praktik Baik</label>
                                            <input type="text" name="judul" id="input-judul" placeholder="Ketikkan judul inovasi yang menarik..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; font-weight: 600;">
                                        </div>

                                        <!-- 5 Kotak Rich Text Editor Ala MS Word -->
                                        ${buatRichEditor('abstraksi', 'Abstraksi Singkat', 'Tuliskan ringkasan padat mengenai praktik baik ini...')}
                                        ${buatRichEditor('situasi', 'Situasi (S)', 'Paparkan kondisi awal / latar belakang masalah...')}
                                        ${buatRichEditor('tantangan', 'Tantangan (T)', 'Jelaskan rintangan nyata yang dihadapi...')}
                                        ${buatRichEditor('aksi', 'Langkah Aksi (A)', 'Uraikan strategi dan langkah operasional yang dilakukan (Anda bisa menyisipkan tabel atau foto di sini)...')}
                                        ${buatRichEditor('refleksi', 'Refleksi & Dampak (R)', 'Tuliskan hasil perubahan, dampak pada murid, dan refleksi...')}

                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                            <div>
                                                <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Link Foto Sampul Utama (Google Drive)</label>
                                                <input type="url" name="link_foto" id="input-link-foto" placeholder="https://drive.google.com/file/d/..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px;">
                                            </div>
                                            <div>
                                                <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Link Dokumen Bukti Karya / Modul (Google Drive)</label>
                                                <input type="url" name="link_dokumen" id="input-link-dokumen" placeholder="https://drive.google.com/file/d/..." required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px;">
                                            </div>
                                        </div>

                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 10px 15px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0;">
                                            <span style="font-size: 0.82rem; color: #64748B;"><i class="ph-fill ph-info" style="color: #0284C7;"></i> Mengedit artikel yang sudah tayang akan mengembalikan statusnya menjadi <b>Menunggu Persetujuan</b>.</span>
                                            <div style="font-size: 0.88rem; font-weight: 700; color: #64748B;">
                                                Total Kata: <span id="angka-kata" style="color: #10B981;">0</span> / 1500
                                            </div>
                                        </div>

                                        <!-- Dua Tombol Aksi: Simpan Draf & Ajukan Publikasi -->
                                        <div style="display: flex; gap: 15px;">
                                            <button type="button" id="btnSimpanDraft" onclick="prosesSimpanArtikel('Draft')" style="flex: 1; padding: 12px; background: #F1F5F9; color: #334155; border: 1px solid #CBD5E1; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s;">
                                                <i class="ph-bold ph-floppy-disk"></i> Simpan sebagai Draf
                                            </button>
                                            <button type="button" id="btnSubmitArtikel" onclick="prosesSimpanArtikel('Pending')" style="flex: 2; padding: 12px; background: #D92B38; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s;">
                                                <i class="ph-bold ph-paper-plane-tilt"></i> Ajukan Publikasi (Kirim ke Ketua)
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- MENU PROFIL SAYA -->
                        <div id="menu-profil" class="dasbor-konten" style="display: none;">
                            <div style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 2rem;">
                                <h3 style="color: #1E293B; margin-bottom: 5px;">Profil & Biodata Anggota</h3>
                                <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 20px;">Informasi resmi keanggotaan yang terdaftar di pangkalan data PGRI Cabang Sukahaji.</p>
                                
                                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 25px; padding: 18px; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
                                    ${user.foto && user.foto.trim() !== '' 
                                        ? `<img src="${getDirectDriveLink(user.foto)}" referrerpolicy="no-referrer" onerror="this.outerHTML='<div style=\\'width: 80px; height: 80px; background: #D92B38; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 2rem;\\'>${inisialUser}</div>'" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #D92B38;">`
                                        : `<div style="width: 80px; height: 80px; background: #D92B38; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 2rem;">${inisialUser}</div>`
                                    }
                                    <div>
                                        <div style="font-weight: 700; color: #1E293B; font-size: 1.2rem;">${user.nama || '-'}</div>
                                        <div style="font-size: 0.85rem; color: #64748B; margin-top: 4px;">NPA: <b>${user.npa || '-'}</b> | Tempat Tugas: <b>${user.tempat_tugas || '-'}</b></div>
                                        <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                                            <span style="background: #FEE2E2; color: #991B1B; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">Role: ${user.role || '-'}</span>
                                            <span style="background: #E0F2FE; color: #075985; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">Status: ${user.pegawai || '-'}</span>
                                            <span style="background: #F1F5F9; color: #475569; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">Sertifikat: ${user.sertifikat || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                <form id="formProfil" onsubmit="submitProfil(event)">
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">
                                        <div>
                                            <label style="display:block; font-weight: 600; font-size: 0.82rem; color: #475569; margin-bottom: 5px;">Nomor Pokok Anggota (NPA)</label>
                                            <input type="text" value="${user.npa || '-'}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #334155; font-weight: 600;">
                                        </div>
                                        <div>
                                            <label style="display:block; font-weight: 600; font-size: 0.82rem; color: #475569; margin-bottom: 5px;">Nomor Induk Kependudukan (NIK)</label>
                                            <input type="text" value="${user.nik || '-'}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #334155;">
                                        </div>
                                        <div>
                                            <label style="display:block; font-weight: 600; font-size: 0.82rem; color: #475569; margin-bottom: 5px;">Nama Lengkap & Gelar</label>
                                            <input type="text" value="${user.nama || '-'}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #334155;">
                                        </div>
                                        <div>
                                            <label style="display:block; font-weight: 600; font-size: 0.82rem; color: #475569; margin-bottom: 5px;">Tempat Tugas</label>
                                            <input type="text" value="${user.tempat_tugas || '-'}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #334155;">
                                        </div>
                                        <div>
                                            <label style="display:block; font-weight: 600; font-size: 0.82rem; color: #475569; margin-bottom: 5px;">Mata Pelajaran</label>
                                            <input type="text" value="${user.mapel || '-'}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #334155;">
                                        </div>
                                        <div>
                                            <label style="display:block; font-weight: 600; font-size: 0.82rem; color: #475569; margin-bottom: 5px;">Sertifikat Pendidik</label>
                                            <input type="text" value="${user.sertifikat || '-'}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #334155;">
                                        </div>
                                        <div>
                                            <label style="display:block; font-weight: 600; font-size: 0.82rem; color: #475569; margin-bottom: 5px;">Jenjang Mengajar</label>
                                            <input type="text" value="${user.jenjang || '-'}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #334155;">
                                        </div>
                                        <div>
                                            <label style="display:block; font-weight: 600; font-size: 0.82rem; color: #475569; margin-bottom: 5px;">Status Pegawai</label>
                                            <input type="text" value="${user.pegawai || '-'}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #334155;">
                                        </div>
                                        <div style="grid-column: 1 / -1;">
                                            <label style="display:block; font-weight: 600; font-size: 0.82rem; color: #475569; margin-bottom: 5px;">Peran Sistem (Role)</label>
                                            <input type="text" value="${user.role || '-'}" readonly style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; background: #F1F5F9; color: #334155;">
                                        </div>
                                    </div>

                                    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;">

                                    <div style="margin-bottom: 15px;">
                                        <label style="display:block; font-weight: 600; font-size: 0.85rem; margin-bottom: 5px;">Link Foto Profil (Google Drive)</label>
                                        <input type="url" id="input-foto-profil" value="${user.foto || ''}" placeholder="https://drive.google.com/file/d/.../view?usp=sharing" required style="width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px;">
                                        <small style="display:block; margin-top: 6px; color: #64748B; font-size: 0.78rem;">
                                            <i class="ph-fill ph-info" style="color: #D92B38;"></i> <b>Penting:</b> Pastikan pengaturan berbagi (*Share*) file foto di Google Drive sudah diubah menjadi <b>"Siapa saja yang memiliki link"</b>.
                                        </small>
                                    </div>
                                    <button type="submit" id="btnSubmitProfil" style="padding: 10px 20px; background: #D92B38; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Simpan Pembaruan Foto</button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- MODAL PREVIEW ARTIKEL PENUH -->
                <div id="modal-preview" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.75); z-index: 3000; align-items: center; justify-content: center; padding: 1.5rem;">
                    <div style="background: white; width: 100%; max-width: 850px; max-height: 90vh; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);">
                        <div style="padding: 1rem 1.5rem; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 700; color: #1E293B; display: flex; align-items: center; gap: 8px;"><i class="ph-fill ph-book-open" style="color: #D92B38;"></i> Pratinjau Artikel SAKTI</span>
                            <button onclick="tutupModalPreview()" style="background: #FEE2E2; color: #D92B38; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center;"><i class="ph-bold ph-x"></i></button>
                        </div>
                        <div id="isi-modal-preview" class="konten-artikel-penuh" style="padding: 2rem; overflow-y: auto; line-height: 1.7; color: #334155;">
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

// --- FUNGSI PENGHITUNG KATA REAL-TIME (MENGABAIKAN TAG HTML) ---
function hitungKataRealtime() {
    const ids = ['abstraksi', 'situasi', 'tantangan', 'aksi', 'refleksi'];
    let gabunganTeksMurni = '';
    ids.forEach(id => {
        const el = document.getElementById('rte-' + id);
        if (el) gabunganTeksMurni += ' ' + (el.innerText || '');
    });
    const jumlahKata = gabunganTeksMurni.trim().split(/\s+/).filter(w => w.length > 0).length;
    const spanAngka = document.getElementById('angka-kata');
    if (spanAngka) {
        spanAngka.innerText = jumlahKata;
        spanAngka.style.color = jumlahKata > 1500 ? '#D92B38' : '#10B981';
    }
    return jumlahKata;
}

// --- FUNGSI BUKA FORM BUAT BARU VS EDIT ---
function bukaFormBuatBaru() {
    document.getElementById('formArtikelSakti').reset();
    document.getElementById('edit-row-id').value = '';
    ['abstraksi', 'situasi', 'tantangan', 'aksi', 'refleksi'].forEach(id => {
        document.getElementById('rte-' + id).innerHTML = '';
    });
    document.getElementById('judul-form-sakti').innerText = 'Buat Artikel Praktik Baik Baru';
    hitungKataRealtime();
    toggleFormArtikel(true);
}

function bukaEditRiwayat(index) {
    const item = daftarRiwayatUser[index];
    if (!item) return;

    document.getElementById('edit-row-id').value = item.row_id;
    document.getElementById('input-kategori').value = item.kategori || '';
    document.getElementById('input-judul').value = item.judul || '';
    document.getElementById('input-link-foto').value = item.link_foto || '';
    document.getElementById('input-link-dokumen').value = item.link_dokumen || '';

    document.getElementById('rte-abstraksi').innerHTML = item.abstraksi || '';
    document.getElementById('rte-situasi').innerHTML = item.situasi || '';
    document.getElementById('rte-tantangan').innerHTML = item.tantangan || '';
    document.getElementById('rte-aksi').innerHTML = item.aksi || '';
    document.getElementById('rte-refleksi').innerHTML = item.refleksi || '';

    document.getElementById('judul-form-sakti').innerText = 'Edit Artikel: ' + item.judul;
    hitungKataRealtime();
    toggleFormArtikel(true);
}

// --- FUNGSI SIMPAN / AJUKAN ARTIKEL (BARU MAUPUN EDIT) ---
async function prosesSimpanArtikel(statusTujuan) {
    const form = document.getElementById('formArtikelSakti');
    const rowId = document.getElementById('edit-row-id').value;
    const totalKata = hitungKataRealtime();

    if (!form.judul.value.trim() || !form.kategori.value) {
        alert('Mohon lengkapi minimal Topik Inovasi dan Judul Artikel terlebih dahulu.');
        return;
    }

    if (statusTujuan === 'Pending') {
        if (totalKata === 0) {
            alert('Isi narasi artikel tidak boleh kosong saat diajukan.');
            return;
        }
        if (totalKata > 1500) {
            alert(`Mohon maaf, artikel Anda melebihi batas maksimal 1500 kata.\n(Saat ini: ${totalKata} kata). Silakan ringkas kembali.`);
            return;
        }
        if (!form.link_foto.value.trim() || !form.link_dokumen.value.trim()) {
            alert('Untuk mengajukan publikasi, Link Foto Sampul dan Link Dokumen wajib diisi.');
            return;
        }
    }

    const btnDraft = document.getElementById('btnSimpanDraft');
    const btnSubmit = document.getElementById('btnSubmitArtikel');
    btnDraft.disabled = true; btnSubmit.disabled = true;
    
    if (statusTujuan === 'Draft') btnDraft.innerText = 'Menyimpan Draf...';
    else btnSubmit.innerText = 'Mengirim ke Ketua...';

    const dataObj = {
        row_id: rowId,
        nama: form.nama.value,
        jenjang: form.jenjang.value,
        kategori: form.kategori.value,
        judul: form.judul.value,
        abstraksi: document.getElementById('rte-abstraksi').innerHTML,
        situasi: document.getElementById('rte-situasi').innerHTML,
        tantangan: document.getElementById('rte-tantangan').innerHTML,
        aksi: document.getElementById('rte-aksi').innerHTML,
        refleksi: document.getElementById('rte-refleksi').innerHTML,
        link_foto: form.link_foto.value,
        link_dokumen: form.link_dokumen.value,
        status_ajuan: statusTujuan
    };

    const actionType = rowId ? 'edit_article' : 'submit_article';

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: actionType, data: dataObj })
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            if (statusTujuan === 'Draft') {
                alert('Draf berhasil disimpan! Anda dapat melanjutkan menulis kapan saja.');
            } else {
                alert('Berhasil! Artikel telah diajukan dengan status "Menunggu Persetujuan" Ketua.');
            }
            toggleFormArtikel(false);
            fetchRiwayat();
            fetchFeed();
        } else {
            alert('Gagal: ' + result.message);
        }
    } catch (error) {
        alert('Terjadi kesalahan jaringan.');
    } finally {
        btnDraft.disabled = false; btnSubmit.disabled = false;
        btnDraft.innerHTML = '<i class="ph-bold ph-floppy-disk"></i> Simpan sebagai Draf';
        btnSubmit.innerHTML = '<i class="ph-bold ph-paper-plane-tilt"></i> Ajukan Publikasi (Kirim ke Ketua)';
    }
}

// --- FUNGSI HAPUS ARTIKEL ---
async function hapusArtikelRiwayat(index) {
    const item = daftarRiwayatUser[index];
    if (!item) return;

    const konfirmasi = confirm(`Apakah Anda yakin ingin menghapus artikel "${item.judul}" secara permanen?`);
    if (!konfirmasi) return;

    const user = cekLogin();
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'delete_article', row_id: item.row_id, nama: user.nama })
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert('Artikel berhasil dihapus.');
            fetchRiwayat();
            fetchFeed();
        } else {
            alert('Gagal menghapus: ' + result.message);
        }
    } catch (error) {
        alert('Kesalahan jaringan saat menghapus artikel.');
    }
}

// --- FUNGSI MODAL PREVIEW ARTIKEL ---
function bukaPreview(sumber, index) {
    const item = sumber === 'riwayat' ? daftarRiwayatUser[index] : daftarFeedPublik[index];
    if (!item) return;

    const modal = document.getElementById('modal-preview');
    const wadah = document.getElementById('isi-modal-preview');

    wadah.innerHTML = `
        <div style="margin-bottom: 15px;">
            <span style="background: #FEE2E2; color: #D92B38; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">${item.kategori}</span>
            <span style="color: #64748B; font-size: 0.85rem; margin-left: 8px;">• ${item.jenjang} • ${item.tanggal}</span>
        </div>
        <h2 style="color: #1E293B; font-size: 1.6rem; margin-bottom: 10px;">${item.judul}</h2>
        <div style="font-size: 0.9rem; color: #475569; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #E2E8F0;">
            Oleh: <b>${item.nama}</b>
        </div>
        ${item.link_foto && item.link_foto.startsWith('http') ? `<div style="margin-bottom: 20px; text-align: center;"><img src="${getDirectDriveLink(item.link_foto)}" referrerpolicy="no-referrer" style="max-width: 100%; max-height: 400px; border-radius: 10px; object-fit: cover;"></div>` : ''}
        
        <h4 style="color: #D92B38; margin-top: 15px; margin-bottom: 5px;">Abstraksi</h4>
        <div style="margin-bottom: 15px;">${item.abstraksi || '-'}</div>

        <h4 style="color: #D92B38; margin-top: 15px; margin-bottom: 5px;">Situasi (S)</h4>
        <div style="margin-bottom: 15px;">${item.situasi || '-'}</div>

        <h4 style="color: #D92B38; margin-top: 15px; margin-bottom: 5px;">Tantangan (T)</h4>
        <div style="margin-bottom: 15px;">${item.tantangan || '-'}</div>

        <h4 style="color: #D92B38; margin-top: 15px; margin-bottom: 5px;">Langkah Aksi (A)</h4>
        <div style="margin-bottom: 15px;">${item.aksi || '-'}</div>

        <h4 style="color: #D92B38; margin-top: 15px; margin-bottom: 5px;">Refleksi & Dampak (R)</h4>
        <div style="margin-bottom: 25px;">${item.refleksi || '-'}</div>

        ${item.link_dokumen && item.link_dokumen.startsWith('http') ? `
        <div style="padding: 15px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; font-size: 0.9rem;">Dokumen Bukti Karya / Modul Ajar:</span>
            <a href="${item.link_dokumen}" target="_blank" style="padding: 8px 15px; background: #1E293B; color: white; text-decoration: none; border-radius: 6px; font-size: 0.85rem; font-weight: 600;">Buka Dokumen &raquo;</a>
        </div>` : ''}
    `;
    modal.style.display = 'flex';
}

function tutupModalPreview() {
    document.getElementById('modal-preview').style.display = 'none';
}

// --- FUNGSI LOGIN & PROFIL ---
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

async function submitProfil(event) {
    event.preventDefault();
    const btn = document.getElementById('btnSubmitProfil');
    const linkFoto = document.getElementById('input-foto-profil').value;
    const user = cekLogin();

    btn.innerText = 'Menyimpan...'; btn.disabled = true;

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'update_profil', npa: user.npa, link_foto: linkFoto })
        });
        const result = await response.json();

        if (result.status === 'success') {
            alert('Profil berhasil diperbarui!');
            user.foto = result.data.link_foto;
            localStorage.setItem('userPGRI', JSON.stringify(user));
            loadView('dashboard');
            bukaProfil();
        } else {
            alert('Gagal: ' + result.message);
        }
    } catch (error) {
        alert('Terjadi kesalahan jaringan.');
    } finally {
        btn.innerText = 'Simpan Pembaruan Foto'; btn.disabled = false;
    }
}

// --- FUNGSI TARIK RIWAYAT & FEED ---
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
            daftarRiwayatUser = result.data;
            if (daftarRiwayatUser.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #94A3B8;">Belum ada artikel yang diajukan.</td></tr>';
            } else {
                let html = '';
                daftarRiwayatUser.forEach((item, index) => {
                    let statusBg = '#FEF3C7', statusText = '#92400E', labelStatus = 'Menunggu Persetujuan';
                    if (item.status === 'Approved') {
                        statusBg = '#D1FAE5'; statusText = '#065F46'; labelStatus = 'Approved';
                    } else if (item.status === 'Draft') {
                        statusBg = '#F1F5F9'; statusText = '#475569'; labelStatus = 'Draf Tersimpan';
                    }

                    html += `<tr style="border-bottom: 1px solid #E2E8F0;">
                        <td style="padding: 12px; font-size: 0.85rem; color: #64748B;">${item.tanggal}</td>
                        <td style="padding: 12px; font-size: 0.9rem; color: #1E293B; font-weight: 600;">${item.judul}</td>
                        <td style="padding: 12px; font-size: 0.85rem; color: #64748B;">${item.kategori}</td>
                        <td style="padding: 12px; font-size: 0.82rem;">
                            <span style="background: ${statusBg}; color: ${statusText}; padding: 4px 10px; border-radius: 20px; font-weight: 700; display: inline-block;">${labelStatus}</span>
                        </td>
                        <td style="padding: 12px; text-align: right; white-space: nowrap;">
                            <button class="btn-aksi" onclick="bukaPreview('riwayat', ${index})" title="Pratinjau Artikel" style="color: #0284C7;"><i class="ph-bold ph-eye"></i> Preview</button>
                            <button class="btn-aksi" onclick="bukaEditRiwayat(${index})" title="Edit Artikel" style="color: #D97706; margin-left: 4px;"><i class="ph-bold ph-pencil-simple"></i> Edit</button>
                            <button class="btn-aksi" onclick="hapusArtikelRiwayat(${index})" title="Hapus Artikel" style="color: #D92B38; margin-left: 4px;"><i class="ph-bold ph-trash"></i> Hapus</button>
                        </td>
                    </tr>`;
                });
                tbody.innerHTML = html;
            }
        }
    } catch (error) { tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #D92B38;">Kesalahan jaringan.</td></tr>`; }
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
            daftarFeedPublik = result.data;
            if (daftarFeedPublik.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 3rem; background: white; border-radius: 12px; border: 1px dashed #CBD5E1; color: #94A3B8;">Belum ada artikel yang dipublikasikan.</div>';
            } else {
                let html = '';
                daftarFeedPublik.forEach((item, index) => {
                    const namaAman = item.nama ? String(item.nama) : "Tanpa Nama";
                    const inisial = namaAman.charAt(0).toUpperCase();
                    
                    html += `
                    <div style="background: white; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 1.5rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div style="padding: 1rem 1.5rem; display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #F1F5F9;">
                            <div style="width: 45px; height: 45px; border-radius: 50%; background: #1E293B; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem;">${inisial}</div>
                            <div>
                                <div style="font-weight: 700; color: #1E293B; font-size: 0.95rem;">${namaAman}</div>
                                <div style="font-size: 0.75rem; color: #64748B;">${item.tanggal} • <span style="color: #D92B38; font-weight:600;">${item.kategori}</span> • ${item.jenjang}</div>
                            </div>
                        </div>
                        <div style="padding: 1.5rem;">
                            <h4 style="color: #1E293B; margin-bottom: 10px; font-size: 1.1rem;">${item.judul}</h4>
                            <div style="color: #475569; font-size: 0.9rem; line-height: 1.6;">${item.abstraksi}</div>
                            <a href="#" onclick="bukaPreview('feed', ${index}); return false;" style="color: #D92B38; font-size: 0.85rem; font-weight: 700; text-decoration: none; display: inline-block; margin-top: 12px;">Baca Selengkapnya &raquo;</a>
                        </div>
                        ${item.link_foto && item.link_foto.startsWith('http') ? `<div style="width: 100%; height: 350px; background-color: #F1F5F9; background-image: url('${getDirectDriveLink(item.link_foto)}'); background-size: cover; background-position: center; border-top: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9;"></div>` : ''}
                        <div style="padding: 1rem 1.5rem; background: #F8FAFC; display: flex; gap: 25px;">
                            <button style="background: transparent; border: none; color: #64748B; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 8px;"><i class="ph ph-thumbs-up" style="font-size: 1.2rem;"></i> Suka</button>
                            <button style="background: transparent; border: none; color: #64748B; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 8px;"><i class="ph ph-chat-circle" style="font-size: 1.2rem;"></i> Komentar</button>
                        </div>
                    </div>`;
                });
                container.innerHTML = html;
            }
        } else {
            container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #D92B38;">Gagal memuat: ${result.message}</div>`;
        }
    } catch (error) { 
        container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #D92B38;">Terjadi masalah jaringan saat memuat linimasa.</div>`; 
    }
}

// --- FUNGSI UI DASBOR UTAMA ---
function toggleDropdownProfil(event) {
    if (event) event.stopPropagation(); 
    const dropdown = document.getElementById('dropdownProfil');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
    }
}

window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('dropdownProfil');
    const trigger = document.getElementById('btn-profil-trigger');
    if (dropdown && dropdown.style.display === 'block') {
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
    if (btnElement) {
        btnElement.style.background = 'rgba(255,255,255,0.1)'; 
        btnElement.style.color = 'white';
    }
}

function bukaProfil() {
    const semuaKonten = document.getElementsByClassName('dasbor-konten');
    for (let i = 0; i < semuaKonten.length; i++) semuaKonten[i].style.display = 'none';
    
    document.getElementById('menu-profil').style.display = 'block';
    document.getElementById('judul-topbar').innerText = 'Profil - Data Pengguna';

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
