const API_URL =
"https://script.google.com/macros/s/AKfycbyq2CFjJsTzA9xi_bWYbtgHJxs6OmOxy3S8cC6q20Ohb7PtuYDyMYEnzPKfmPRV2Nni/exec";

let keranjang = [];
let menuSementara = "";
let hargaSementara = 0;
let toppingDipilih = [];

function renderKeranjang(){

  const list =
  document.getElementById("list-keranjang");

  const totalText =
  document.getElementById("total");

  if(keranjang.length === 0){

    list.innerHTML =
    "Belum ada pesanan";

    totalText.innerHTML =
    "Total: Rp 0";

    return;
  }

  let html = "";

  let total = 0;

  keranjang.forEach((item,index) => {

    const subtotal =
    item.harga * item.qty;

    total += subtotal;

    html += `
    <div class="item-keranjang">

      <div>

        <strong>
          ${item.menu}
        </strong>

        <div class="qty-control">

          <button
          class="qty-btn"
          onclick="kurangQty(${index})">
          -
          </button>

          <span>
            ${item.qty}
          </span>

          <button
          class="qty-btn"
          onclick="tambahQty(${index})">
          +
          </button>

        </div>

        <button
        class="hapus-btn"
        onclick="hapusItem(${index})">
        Hapus
        </button>

      </div>

      <div>
        Rp ${subtotal}
      </div>

    </div>
    `;

  });

  list.innerHTML = html;

  totalText.innerHTML =
  `Total: Rp ${total}`;
}

function tambahKeranjang(menu, harga){

  menuSementara = menu;

  hargaSementara = harga;

  document
  .getElementById("popup-topping")
  .style.display = "block";

}

function checkout(){

  if(keranjang.length === 0){

    alert("Keranjang masih kosong");

    return;
  }

  document
  .getElementById("popup")
  .style.display = "block";

}

function tutupPopup(){

  document
  .getElementById("popup")
  .style.display = "none";

}

function tambahQty(index){

  keranjang[index].qty += 1;

  renderKeranjang();

}

function kurangQty(index){

  if(keranjang[index].qty > 1){

    keranjang[index].qty -= 1;

  }else{

    keranjang.splice(index,1);

  }

  renderKeranjang();

}

function hapusItem(index){

  keranjang.splice(index,1);

  renderKeranjang();

}

async function kirimPesanan(){

  const nama =
  document.getElementById("nama").value;

  const wa =
  document.getElementById("wa").value;

  const lokasi =
  document.getElementById("lokasi").value;

  const catatan =
  document.getElementById("catatan").value;

  if(!nama || !wa || !lokasi){

    alert("Lengkapi data");

    return;
  }

  const kode =
  "CMN-" + Date.now();

  const tanggal =
  new Date().toLocaleString();

  let total = 0;

  let daftarPesanan = "";

  keranjang.forEach(item => {

    const subtotal =
    item.harga * item.qty;

    total += subtotal;

    daftarPesanan +=
    `${item.menu} x${item.qty}\n`;

  });

  const data = {

    kode: kode,
    tanggal: tanggal,
    nama: nama,
    wa: wa,
    lokasi: lokasi,
    menu: daftarPesanan,
    total: total,
    catatan: catatan

  };

  simpanDataPemesan();
  await fetch(
    "https://script.google.com/macros/s/AKfycbyq2CFjJsTzA9xi_bWYbtgHJxs6OmOxy3S8cC6q20Ohb7PtuYDyMYEnzPKfmPRV2Nni/exec",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );

  /*const pesanWA = `
  *PESANAN BARU CEMIL.IN*
  
  Kode:
  ${kode}
  
  Nama:
  ${nama}
  
  Pesanan:
  ${daftarPesanan}
  
  Catatan:
  ${catatan}
  
  Total:
  Rp ${total}
  
  Lokasi:
  ${lokasi}
  `;
  
    window.open(
      `https://wa.me/62895338946122?text=${encodeURIComponent(pesanWA)}`
    );
  */
  
const invoiceHTML = `

<hr>

<p>
<strong>Kode:</strong><br>
${kode}
</p>

<p>
<strong>Tanggal:</strong><br>
${tanggal}
</p>

<p>
<strong>Nama:</strong><br>
${nama}
</p>

<p>
<strong>Pesanan:</strong><br>
${daftarPesanan.replace(/\n/g,"<br>")}
</p>

<p>
<strong>Catatan:</strong><br>
${catatan || "-"}
</p>

<p>
<strong>Total:</strong><br>
Rp ${total}
</p>

<p>
<strong>Lokasi:</strong><br>
${lokasi}
</p>

<hr>

`;

document
.getElementById("invoice-content")
.innerHTML = invoiceHTML;

document
.getElementById("popup-invoice")
.style.display = "block";

document
.getElementById("loading-checkout")
.style.display = "none";

  keranjang = [];

  renderKeranjang();

  tutupPopup();

}

function tutupPopupTopping(){

  document
  .getElementById("popup-topping")
  .style.display = "none";

}

function simpanTopping(){

  toppingDipilih = [];

  let tambahanHarga = 0;

  if(document.getElementById("telur").checked){

    toppingDipilih.push("Extra Telur");

    tambahanHarga += 3000;

  }

  if(document.getElementById("keju").checked){

    toppingDipilih.push("Extra Keju");

    tambahanHarga += 5000;

  }

  if(document.getElementById("pedas").checked){

    toppingDipilih.push("Saos Pedas");

  }

  if(document.getElementById("manis").checked){

    toppingDipilih.push("Saos Manis");

  }

  const namaMenuGabungan =
  menuSementara +
  (toppingDipilih.length > 0
  ? " (" + toppingDipilih.join(", ") + ")"
  : "");

  const itemLama =
  keranjang.find(
    item => item.menu === namaMenuGabungan
  );

  if(itemLama){

    itemLama.qty += 1;

  }else{

    keranjang.push({
      menu: namaMenuGabungan,
      harga: hargaSementara + tambahanHarga,
      qty: 1
    });

  }

  renderKeranjang();

  tutupPopupTopping();

  document.getElementById("telur").checked = false;
  document.getElementById("keju").checked = false;
  document.getElementById("pedas").checked = false;
  document.getElementById("manis").checked = false;

}

function tutupInvoice(){

  document
  .getElementById("popup-invoice")
  .style.display = "none";

}

async function loadProduk(){

  try{

    const response =
    await fetch(
      API_URL + "?action=produk"
    );

    const produk =
    await response.json();

    let html = "";

    produk.forEach(item => {

      const tombol =
      item.stok == "habis"

      ?

      `
      <button
      disabled
      class="btn-habis">
        STOK HABIS
      </button>
      `

      :

      `
      <button
      onclick="
      tambahKeranjang(
      '${item.nama}',
      ${item.harga}
      )">
        Tambah ke Keranjang
      </button>
      `;

      const badge =
      item.stok == "habis"

      ?

      `
      <div class="badge-habis">
        STOK HABIS
      </div>
      `

      :

      "";

      html += `

      <div class="card
      ${item.stok == "habis"
      ? "habis"
      : ""}">

        <img
        src="${item.foto}"
        loading="lazy">

        ${badge}

        <h2>
          ${item.nama}
        </h2>

        <p class="harga">
          Rp ${item.harga}
        </p>

        ${tombol}

      </div>

      `;

    });

    document
    .getElementById("daftar-menu")
    .innerHTML = html;

  }catch(error){

    console.log(error);

  }finally{

    document
    .getElementById("loading")
    .style.display = "none";

  }

}

function simpanDataPemesan(){

  localStorage.setItem(
    "cemilin_nama",
    document.getElementById("nama").value
  );

  localStorage.setItem(
    "cemilin_wa",
    document.getElementById("wa").value
  );

}

function loadDataPemesan(){

  const nama =
  localStorage.getItem(
    "cemilin_nama"
  );

  const wa =
  localStorage.getItem(
    "cemilin_wa"
  );

  if(nama){

    document
    .getElementById("nama")
    .value = nama;

  }

  if(wa){

    document
    .getElementById("wa")
    .value = wa;

  }

}

async function loadStatistik(){

  const response =
    await fetch(
      SCRIPT_URL +
      "?action=statistik"
    );

  const data =
    await response.json();

  document
    .getElementById("jumlahPesanan")
    .innerText =
      data.jumlahPesanan;

  document
    .getElementById("omzetHariIni")
    .innerText =
      "Rp " +
      Number(
        data.omzetHariIni
      ).toLocaleString("id-ID");

  document
    .getElementById("menuTerlaris")
    .innerText =
      data.menuTerlaris;

  document
    .getElementById("totalPesanan")
    .innerText =
      data.totalPesanan;

}

loadProduk();
loadDataPemesan();
