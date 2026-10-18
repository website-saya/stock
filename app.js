const KUNCI_DATA = "stockOpnameBahan";

const bahanAwal = [
    {
        id: "simple-syrup",
        nama: "Simple Syrup",
        jenisBotol: "botol monin 1 liter",
        beratBotol: 624,
        gramPerMl: 1.285
    },
    {
        id: "syrup-choco-sauce",
        nama: "Syrup Choco",
        jenisBotol: "botol Sauce",
        beratBotol: 43,
        gramPerMl: 1.345,
        satuan: "ml"
    },
    {
        id: "syrup-choco-davinci",
        nama: "Syrup Choco",
        jenisBotol: "botol DaVinci",
        beratBotol: 47,
        gramPerMl: 1.345,
        satuan: "ml"
    },
    {
        id: "syrup-coconut",
        nama: "Syrup Coconut",
        jenisBotol: "Botol monin 1 liter",
        beratBotol: 624,
        gramPerMl: 1.301,
        satuan: "ml"
    },
    {
        id: "syrup-pandan",
        nama: "Syrup Pandan",
        jenisBotol: "Botol botol monin 1 liter",
        beratBotol: 624,
        gramPerMl: 1.304,
        satuan: "ml"
    },
    {
        id: "abc-leci",
        nama: "ABC Leci",
        jenisBotol: "Botol leci",
        beratBotol: 305,
        gramPerMl: 1.135,
        satuan: "ml"
    },
    {
        id: "marjan-vanilla",
        nama: "Marjan Vanilla",
        jenisBotol: "Botol monin 1 liter",
        beratBotol: 474,
        gramPerMl: 1.278,
        satuan: "ml"
    },
    {
        id: "brown-sugar-sauce",
        nama: "Brown Sugar",
        jenisBotol: "botol Sauce",
        beratBotol: 43,
        gramPerMl: 1.405,
        satuan: "ml"
    },
    {
        id: "brown-sugar-bottle",
        nama: "Brown Sugar",
        jenisBotol: "Botol Brown Sugar",
        beratBotol: 74,
        gramPerMl: 1.405,
        satuan: "ml"
    }
];

function ambilBahan() {
    try {
        const data = localStorage.getItem(KUNCI_DATA);

        // Pengguna baru: gunakan daftar bahan awal
        if (data === null) {
            localStorage.setItem(
                KUNCI_DATA,
                JSON.stringify(bahanAwal)
            );

            return [...bahanAwal];
        }

        const tersimpan = JSON.parse(data);

        // Jika format data tidak valid
        if (!Array.isArray(tersimpan)) {
            return [...bahanAwal];
        }

        let adaPerubahan = false;

        // Tambahkan bahan bawaan yang belum ada.
        // Jangan menimpa data bahan yang sudah tersimpan.
        bahanAwal.forEach(bahanDefault => {
            const sudahAda = tersimpan.some(
                item => item.id === bahanDefault.id
            );

            if (!sudahAda) {
                tersimpan.push({ ...bahanDefault });
                adaPerubahan = true;
            }
        });

        // Simpan jika ada bahan bawaan baru
        if (adaPerubahan) {
            localStorage.setItem(
                KUNCI_DATA,
                JSON.stringify(tersimpan)
            );
        }

        return tersimpan;

    } catch (error) {
        console.error("Gagal membaca data bahan:", error);
        return [...bahanAwal];
    }
}

let daftar = ambilBahan();

const pilihan = document.getElementById("bahan");
const inputBerat = document.getElementById("berat");
const hasil = document.getElementById("hasil");

function simpanBahan() {
    try {
        localStorage.setItem(
            KUNCI_DATA,
            JSON.stringify(daftar)
        );

        return true;
    } catch (error) {
        alert("Data gagal disimpan di perangkat.");
        console.error(error);
        return false;
    }
}

function formatAngka(angka) {
    return angka.toLocaleString("id-ID", {
        maximumFractionDigits: 2
    });
}

function bahanTerpilih() {
    return daftar.find(item => item.id === pilihan.value);
}

function tampilkanPilihan(idSebelumnya) {
    pilihan.replaceChildren();

    daftar.forEach(item => {
        const opsi = document.createElement("option");

        opsi.value = item.id;
        opsi.textContent = item.jenisBotol
    ? `${item.nama} - ${item.jenisBotol}`
    : item.nama;

        pilihan.appendChild(opsi);
    });

    if (daftar.some(item => item.id === idSebelumnya)) {
        pilihan.value = idSebelumnya;
    }

    tampilkanInformasi();
    tampilkanDaftar();
}

function tampilkanInformasi() {
    const item = bahanTerpilih();

    if (!item) {
        document.getElementById("botol").textContent = "-";
        document.getElementById("konversi").textContent = "-";

        hasil.innerHTML = `
            <p>Belum ada bahan.</p>
            <p>Tambahkan bahan terlebih dahulu.</p>
        `;

        return;
    }

    document.getElementById("botol").textContent =
        formatAngka(item.beratBotol) + " gram";

    document.getElementById("konversi").textContent =
        "1 ml = " + formatAngka(item.gramPerMl) + " gram";
}

function hitungStok() {
    const item = bahanTerpilih();

    if (!item) {
        alert("Pilih atau tambahkan bahan terlebih dahulu.");
        return;
    }

    if (
        inputBerat.value.trim() === "" ||
        !Number.isFinite(Number(inputBerat.value)) ||
        Number(inputBerat.value) < 0
    ) {
        alert("Masukkan berat timbangan yang valid.");
        return;
    }

    const beratTotal = Number(inputBerat.value);
    const beratBersih = beratTotal - item.beratBotol;

    if (beratBersih < 0) {
        alert("Berat total tidak boleh kurang dari berat botol kosong.");
        return;
    }

    const sisaMl = beratBersih / item.gramPerMl;

    hasil.innerHTML = `
        <p>Sisa stok ${item.nama}</p>
        <h2>${formatAngka(sisaMl)} ml</h2>
        <p>Berat bersih: ${formatAngka(beratBersih)} gram</p>
        <p>Berat total: ${formatAngka(beratTotal)} gram</p>
    `;
}

function tambahBahan() {
    const nama = document.getElementById("namaBahan")
        .value.trim();

    const beratBotolInput = document.getElementById("beratBotol");
    const konversiInput = document.getElementById("gramPerMl");

    if (
        nama === "" ||
        beratBotolInput.value.trim() === "" ||
        konversiInput.value.trim() === ""
    ) {
        alert("Lengkapi semua data bahan.");
        return;
    }

    const beratBotol = Number(beratBotolInput.value);
    const gramPerMl = Number(konversiInput.value);

    if (
        !Number.isFinite(beratBotol) ||
        !Number.isFinite(gramPerMl) ||
        beratBotol < 0 ||
        gramPerMl <= 0
    ) {
        alert("Periksa kembali berat botol dan faktor konversi.");
        return;
    }

    const sudahAda = daftar.some(
        item => item.nama.toLowerCase() === nama.toLowerCase()
    );

    if (sudahAda) {
        alert("Nama bahan tersebut sudah ada.");
        return;
    }

    const id = "bahan-" + crypto.randomUUID();

    daftar.push({
        id,
        nama,
        beratBotol,
        gramPerMl
    });

    if (!simpanBahan()) {
        daftar.pop();
        return;
    }

    document.getElementById("namaBahan").value = "";
    beratBotolInput.value = "";
    konversiInput.value = "";

    tampilkanPilihan(id);

    alert("Bahan berhasil disimpan.");
}

function editBahan(id) {
    const item = daftar.find(bahan => bahan.id === id);

    if (!item) {
        alert("Bahan tidak ditemukan.");
        return;
    }

    // Meminta nama bahan baru
    const namaBaru = prompt(
        "Masukkan nama bahan:",
        item.nama
    );

    if (namaBaru === null) return;

    if (namaBaru.trim() === "") {
        alert("Nama bahan tidak boleh kosong.");
        return;
    }

    // Meminta nama botol baru
    const jenisBotolBaru = prompt(
        "Masukkan nama botol:",
        item.jenisBotol || ""
    );

    if (jenisBotolBaru === null) return;

    if (jenisBotolBaru.trim() === "") {
        alert("Nama botol tidak boleh kosong.");
        return;
    }

    // Meminta berat botol kosong
    const beratBaru = prompt(
        "Masukkan berat botol kosong (gram):",
        item.beratBotol
    );

    if (beratBaru === null) return;

    // Meminta faktor konversi
    const konversiBaru = prompt(
        "Masukkan faktor konversi (gram/ml):",
        item.gramPerMl
    );

    if (konversiBaru === null) return;

    const berat = Number(beratBaru);
    const konversi = Number(konversiBaru);

    if (
        beratBaru.trim() === "" ||
        konversiBaru.trim() === "" ||
        !Number.isFinite(berat) ||
        !Number.isFinite(konversi) ||
        berat < 0 ||
        konversi <= 0
    ) {
        alert("Berat atau faktor konversi tidak valid.");
        return;
    }

    // Simpan data lama untuk cadangan
    const dataLama = { ...item };

    // Perbarui data
    item.nama = namaBaru.trim();
    item.jenisBotol = jenisBotolBaru.trim();
    item.beratBotol = berat;
    item.gramPerMl = konversi;

    // Simpan ke localStorage
    if (!simpanBahan()) {
        Object.assign(item, dataLama);
        return;
    }

    // Perbarui tampilan
    tampilkanPilihan(item.id);

    // Bersihkan hasil perhitungan sebelumnya
    hasil.innerHTML = `
        <p>Sisa stok</p>
        <h2>—</h2>
        <p>Masukkan berat hasil timbangan.</p>
    `;

    alert("Data bahan berhasil diperbarui!");
}

function tampilkanDaftar() {
    const wadah = document.getElementById("daftarBahan");

    wadah.replaceChildren();

    if (daftar.length === 0) {
        wadah.textContent = "Belum ada bahan.";
        return;
    }

    daftar.forEach(item => {
        const baris = document.createElement("div");
        baris.className = "item-bahan";

        const informasi = document.createElement("div");

        const nama = document.createElement("strong");
        nama.textContent = item.nama;

        const detail = document.createElement("p");
        detail.textContent =
            "Botol: " + formatAngka(item.beratBotol) +
            " g | Faktor: " + formatAngka(item.gramPerMl) +
            " g/ml";

        informasi.append(nama, detail);

        // Tombol Edit
const tombolEdit = document.createElement("button");

tombolEdit.type = "button";
tombolEdit.textContent = "Edit";
tombolEdit.className = "edit";

tombolEdit.addEventListener("click", () => {
    editBahan(item.id);
});

// Tombol Hapus
const tombol = document.createElement("button");

tombol.type = "button";
tombol.className = "hapus";
tombol.textContent = "Hapus";

        tombol.addEventListener("click", () => {
            const setuju = confirm(
                "Hapus bahan " + item.nama + "?"
            );

            if (!setuju) return;

            const indeks = daftar.findIndex(
                data => data.id === item.id
            );

            if (indeks === -1) return;

            const bahanLama = daftar[indeks];
            daftar.splice(indeks, 1);

            if (!simpanBahan()) {
                daftar.splice(indeks, 0, bahanLama);
                return;
            }

            tampilkanPilihan("");
            hasil.innerHTML = `
                <p>Sisa stok</p>
                <h2>—</h2>
                <p>Masukkan berat hasil timbangan.</p>
            `;
        });

        baris.append(informasi, tombolEdit, tombol);
        wadah.appendChild(baris);
    });
}

pilihan.addEventListener("change", () => {
    tampilkanInformasi();

    hasil.innerHTML = `
        <p>Sisa stok</p>
        <h2>—</h2>
        <p>Masukkan berat hasil timbangan.</p>
    `;
});

document.getElementById("hitung")
    .addEventListener("click", hitungStok);

document.getElementById("tambahBahan")
    .addEventListener("click", tambahBahan);

tampilkanPilihan("simple-syrup");

const statusOffline = document.getElementById("statusOffline");

function perbaruiStatus() {
    statusOffline.textContent = navigator.onLine
        ? "Terhubung ke internet"
        : "Mode offline";
}

window.addEventListener("online", perbaruiStatus);
window.addEventListener("offline", perbaruiStatus);

perbaruiStatus();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .catch(error => {
                console.error("Service Worker gagal:", error);
            });
    });
}

// EKSPOR DATA
document.getElementById("eksporData").addEventListener("click", () => {
    const file = new Blob(
        [JSON.stringify(daftar, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "cadangan-stock-opname.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    alert("Cadangan data berhasil dibuat.");
});


// BUKA PILIHAN FILE IMPOR
document.getElementById("pilihImpor").addEventListener("click", () => {
    document.getElementById("fileImpor").click();
});


// IMPOR DATA
document.getElementById("fileImpor").addEventListener("change", async event => {
    const file = event.target.files[0];

    if (!file) return;

    try {
        const teks = await file.text();
        const dataImpor = JSON.parse(teks);

        if (!Array.isArray(dataImpor)) {
            throw new Error("Format file tidak valid.");
        }

        const valid = dataImpor.every(item =>
            item &&
            typeof item.id === "string" &&
            typeof item.nama === "string" &&
            typeof item.jenisBotol === "string" &&
            Number.isFinite(item.beratBotol) &&
            item.beratBotol >= 0 &&
            Number.isFinite(item.gramPerMl) &&
            item.gramPerMl > 0
        );

        if (!valid) {
            throw new Error("Ada data bahan yang tidak valid.");
        }

        const idUnik = new Set(dataImpor.map(item => item.id));

        if (idUnik.size !== dataImpor.length) {
            throw new Error("File memiliki ID bahan yang duplikat.");
        }

        const setuju = confirm(
            "Impor akan mengganti seluruh daftar bahan saat ini. " +
            "Pastikan data sekarang sudah dicadangkan. Lanjutkan?"
        );

        if (!setuju) return;

        const dataLama = daftar;
        daftar = dataImpor;

        if (!simpanBahan()) {
            daftar = dataLama;
            return;
        }

        tampilkanPilihan(daftar[0]?.id || "");

        hasil.innerHTML = `
            <p>Data berhasil diimpor.</p>
            <p>Pilih bahan untuk menghitung stok.</p>
        `;

        alert("Data berhasil diimpor!");

    } catch (error) {
        alert("Gagal mengimpor data: " + error.message);
    } finally {
        event.target.value = "";
    }
});