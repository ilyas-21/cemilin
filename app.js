const API_URL =
"https://script.google.com/macros/s/AKfycbyq2CFjJsTzA9xi_bWYbtgHJxs6OmOxy3S8cC6q20Ohb7PtuYDyMYEnzPKfmPRV2Nni/exec";

let keranjang = [];
let produkSementara = null;
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

function tambahKeranjang(produk){

  produkSementara = produk;

  if(
    !produk.varian ||
    produk.varian.length === 0
  ){

    const itemLama =
    keranjang.find(
      item => item.menu === produk.nama
    );

    if(itemLama){

      itemLama.qty++;

    }else{

      keranjang.push({

        menu: produk.nama,

        harga: produk.harga,

        qty:1

      });

    }

    renderKeranjang();

    return;

  }

  buatPopupVarian(produk);

  document
  .getElementById("popup-topping")
  .style.display = "block";

}

function buatPopupVarian(produk){

  const container =
  document.getElementById("daftar-varian");

  container.innerHTML = "";

  produk.varian.forEach((grup, i)=>{

    let html =
    `<h3>${grup.nama}</h3>`;

    grup.opsi.forEach((opsi,j)=>{

      const type =
      grup.tipe=="multiple"
      ? "checkbox"
      : "radio";

      html += `

      <label class="checkbox-container">

        <input
          type="${type}"
          name="varian${i}"
          value="${j}">

        <span>
          ${opsi.nama}
          (+Rp ${opsi.tambahan})
        </span>

      </label>

      <br>

      `;

    });

    container.innerHTML += html;

  });

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
  const loadingCheckout =
  document.getElementById(
    "loading-checkout"
  );
  
  if(loadingCheckout){
  
    loadingCheckout.style.display =
    "flex";
  
  }

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

<div class="invoice-header">

  <h2>CEMIL.IN</h2>

  <p>
    Cemilan Favorit Warga UM Banjarmasin
  </p>

</div>

<hr>

<table class="invoice-table">

<tr>
<td>Kode</td>
<td>: ${kode}</td>
</tr>

<tr>
<td>Tanggal</td>
<td>: ${tanggal}</td>
</tr>

<tr>
<td>Nama</td>
<td>: ${nama}</td>
</tr>

<tr>
<td>WA</td>
<td>: ${wa}</td>
</tr>

<tr>
<td>Lokasi</td>
<td>: ${lokasi}</td>
</tr>

</table>

<hr>

<h3>Pesanan</h3>

${buatDetailPesanan()}

<hr>

<p>
<b>Catatan:</b><br>
${catatan || "-"}
</p>

<div class="invoice-total">

TOTAL<br>

Rp ${total.toLocaleString("id-ID")}

</div>

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

  let nama =
  produkSementara.nama;

  let harga =
  Number(produkSementara.harga);

  let detail = [];

  produkSementara.varian.forEach((grup,i)=>{

    if(grup.tipe=="single"){

      const pilih =
      document.querySelector(
        `input[name="varian${i}"]:checked`
      );

      if(pilih){

        const opsi =
        grup.opsi[pilih.value];

        detail.push(opsi.nama);

        harga += Number(opsi.tambahan);

      }

    }else{

      document
      .querySelectorAll(
        `input[name="varian${i}"]:checked`
      )
      .forEach(pilih=>{

        const opsi =
        grup.opsi[pilih.value];

        detail.push(opsi.nama);

        harga += Number(opsi.tambahan);

      });

    }

  });

  const namaMenu =
  detail.length
  ? `${nama} (${detail.join(", ")})`
  : nama;

  const item =
  keranjang.find(
    x=>x.menu==namaMenu
  );

  if(item){

    item.qty++;

  }else{

    keranjang.push({

      menu:namaMenu,

      harga:harga,

      qty:1

    });

  }

  renderKeranjang();

  tutupPopupTopping();

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
    window.produkData = produk;

    let html = "";

    produk.forEach((item,index) => {

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
      onclick="tambahKeranjang(produkData[${index}])">
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
      API_URL +
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

function buatDetailPesanan(){

  let html = "";

  keranjang.forEach((item,index)=>{

    html += `

    <div class="invoice-item">

      <div class="invoice-no">
        ${index + 1}
      </div>

      <div class="invoice-menu">

        <b>${item.menu}</b>

        <br>

        Qty :
        ${item.qty}

      </div>

      <div class="invoice-harga">

        Rp ${(item.harga * item.qty)
        .toLocaleString("id-ID")}

      </div>

    </div>

    `;

  });

  return html;

}

loadProduk();
loadDataPemesan();
