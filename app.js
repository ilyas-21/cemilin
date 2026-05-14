let keranjang = [];

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

  const itemLama =
  keranjang.find(item => item.menu === menu);

  if(itemLama){

    itemLama.qty += 1;

  }else{

    keranjang.push({
      menu: menu,
      harga: harga,
      qty: 1
    });

  }

  renderKeranjang();
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
    lokasi: lokasi,
    menu: daftarPesanan,
    total: total,
    catatan: catatan

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

  alert("Pesanan berhasil dibuat");

  keranjang = [];

  renderKeranjang();

  tutupPopup();

}
