async function pesan(){

try{

const nama =
prompt("Masukkan Nama Anda");

if(!nama) return;

const lokasi =
prompt("Lokasi Kampus");

if(!lokasi) return;

const kode =
"CMN-" + Date.now();

const tanggal =
new Date().toLocaleString();

const menu =
"Kebab Premium";

const total = 15000;

const data = {
  kode,
  tanggal,
  nama,
  lokasi,
  menu,
  total
};

const response = await fetch(
"https://script.google.com/macros/s/AKfycbyq2CFjJsTzA9xi_bWYbtgHJxs6OmOxy3S8cC6q20Ohb7PtuYDyMYEnzPKfmPRV2Nni/exec",
{
  method: "POST",
  body: JSON.stringify(data)
}
);

console.log(await response.text());

const pesanWA = `
PESANAN BARU

Kode:
${kode}

Nama:
${nama}

Pesanan:
${menu}

Total:
Rp ${total}

Lokasi:
${lokasi}
`;

window.open(
`https://wa.me/62895338946122?text=${encodeURIComponent(pesanWA)}`
);

}catch(error){

alert("ERROR: " + error);

console.log(error);

}

}
