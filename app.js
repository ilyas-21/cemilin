javascript
let menuDipilih = "";
let hargaDipilih = 0;

function pesan(menu,harga){

menuDipilih = menu;
hargaDipilih = harga;

document
.getElementById("popup")
.style.display = "block";

}

function tutupPopup(){

document
.getElementById("popup")
.style.display = "none";

}

async function kirimPesanan(){

const nama =
document.getElementById("nama").value;

const lokasi =
document.getElementById("lokasi").value;

const catatan =
document.getElementById("catatan").value;

if(!nama || !lokasi){

alert("Lengkapi data");

return;

}

const kode =
"CMN-" + Date.now();

const tanggal =
new Date().toLocaleString();

const data = {

kode: kode,
tanggal: tanggal,
nama: nama,
lokasi: lokasi,
menu: menuDipilih,
total: hargaDipilih,
catatan: catatan

};

await fetch(
"https://script.google.com/macros/s/AKfycbyq2CFjJsTzA9xi_bWYbtgHJxs6OmOxy3S8cC6q20Ohb7PtuYDyMYEnzPKfmPRV2Nni/exec",
{
method:"POST",
body:JSON.stringify(data)
}
);

const pesanWA = `
*PESANAN BARU CEMIL.IN*

Kode:
${kode}

Nama:
${nama}

Pesanan:
${menuDipilih}

Catatan:
${catatan}

Total:
Rp ${hargaDipilih}

Lokasi:
${lokasi}
`;

window.open(
`https://wa.me/62895338946122?text=${encodeURIComponent(pesanWA)}`
);

tutupPopup();

alert("Pesanan berhasil dibuat");

}
