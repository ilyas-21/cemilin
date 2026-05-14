async function pesan(){

const nama =
prompt("Masukkan Nama Anda");

if(!nama) return;

const lokasi =
prompt(
"Pilih Lokasi:\nKampus 1 S. Parman\nKampus 2 Pascasarjana\nKampus 3 Handil Bakti"
);

if(!lokasi) return;

const kode =
"CMN-" + Date.now();

const tanggal =
new Date().toLocaleString();

const menu =
"Kebab Premium";

const total = 15000;

const data = {
  kode: kode,
  tanggal: tanggal,
  nama: nama,
  lokasi: lokasi,
  menu: menu,
  total: total
};

await fetch(
"https://script.google.com/macros/s/AKfycbyq2CFjJsTzA9xi_bWYbtgHJxs6OmOxy3S8cC6q20Ohb7PtuYDyMYEnzPKfmPRV2Nni/exec",
{
  method: "POST",
  body: JSON.stringify(data)
}
);

const pesanWA = `
*PESANAN BARU CEMIL.IN*

Kode:
${kode}

Tanggal:
${tanggal}

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
