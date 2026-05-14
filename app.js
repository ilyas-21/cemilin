function pesan(){

const nama =
prompt("Nama Pemesan");

const lokasi =
prompt("Lokasi Kampus");

const total = 15000;

const kode =
"CMN-" + Date.now();

const text = `
Kode: ${kode}

Nama: ${nama}

Pesanan:
Kebab Premium

Total:
Rp ${total}

Lokasi:
${lokasi}
`;

window.open(
`https://wa.me/628xxxxxxxxxx?text=${encodeURIComponent(text)}`
);

}