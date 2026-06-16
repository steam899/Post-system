let products = [];
let cart = [];
let grandTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Ambil data produk (jika kosong, ia akan guna fungsi default dalam file products.js jika ada, 
    // jika tidak kita set default di sini)
    products = JSON.parse(localStorage.getItem('pos_products'));
    if (!products || products.length === 0) {
        products = [
            { id: 1, sku: "NA001", name: "Nasi Ayam Original", price: 8.90, category: "Makanan" },
            { id: 2, sku: "MN001", name: "Teh O Ais", price: 2.00, category: "Minuman" }
        ];
        localStorage.setItem('pos_products', JSON.stringify(products));
    }
    
    renderProducts(products);

    // Fungsi carian
    document.getElementById('search-product').addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(keyword) || 
            p.sku.toLowerCase().includes(keyword)
        );
        renderProducts(filtered);
    });
});

function renderProducts(items) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted mt-4">Tiada produk dijumpai.</div>`;
        return;
    }

    items.forEach(p => {
        container.innerHTML += `
            <div class="col-md-4 col-sm-6">
                <div class="card product-card p-3 shadow-sm text-center" onclick="addToCart(${p.id})">
                    <span class="cat-badge mx-auto mb-2">${p.category}</span>
                    <strong class="mb-1">${p.name}</strong>
                    <small class="text-muted mb-2">SKU: ${p.sku}</small>
                    <h5 class="text-primary mb-0">RM ${p.price.toFixed(2)}</h5>
                </div>
            </div>
        `;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);

    if (existing) {
        existing.qty++;
    } else {
        // Salin data mengikut format (name, qty, price)
        cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    }
    updateCart();
}

function updateQty(id, change) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(c => c.id !== id);
        }
        updateCart();
    }
}

function updateCart() {
    const cartEl = document.getElementById('cart-items');
    cartEl.innerHTML = '';
    grandTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;

        cartEl.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center p-2">
                <div style="flex:1;">
                    <h6 class="my-0">${item.name}</h6>
                    <small class="text-muted">RM ${item.price.toFixed(2)}</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-danger px-2 py-0" onclick="updateQty(${item.id}, -1)">-</button>
                    <span class="mx-2" style="min-width: 20px; text-align:center;">${item.qty}</span>
                    <button class="btn btn-sm btn-outline-success px-2 py-0" onclick="updateQty(${item.id}, 1)">+</button>
                    <strong class="ms-3" style="width: 70px; text-align: right;">RM ${itemTotal.toFixed(2)}</strong>
                </div>
            </li>
        `;
    });

    document.getElementById('total').innerText = `RM ${grandTotal.toFixed(2)}`;
    document.getElementById('modal-total').innerText = `RM ${grandTotal.toFixed(2)}`;
    document.getElementById('btn-checkout').disabled = cart.length === 0;
}

// Logik Bayaran
const cashInput = document.getElementById('cash-received');
const changeEl = document.getElementById('modal-change');
const btnConfirm = document.getElementById('btn-confirm-pay');

cashInput.addEventListener('input', () => {
    const paid = parseFloat(cashInput.value) || 0;
    const balance = paid - grandTotal;
    
    if (balance >= 0 && cart.length > 0) {
        changeEl.innerText = `RM ${balance.toFixed(2)}`;
        changeEl.classList.replace('text-danger', 'text-success');
        btnConfirm.disabled = false;
    } else {
        changeEl.innerText = `RM 0.00 (Tidak Cukup)`;
        changeEl.classList.replace('text-success', 'text-danger');
        btnConfirm.disabled = true;
    }
});

btnConfirm.addEventListener('click', () => {
    const paid = parseFloat(cashInput.value);
    const balance = paid - grandTotal;

    let transactions = JSON.parse(localStorage.getItem('pos_transactions')) || [];
    
    // Generate Nombor Resit Format: NA-YYYYMMDD-XXXX
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const datePrefix = `${yyyy}${mm}${dd}`;

    const todayTrans = transactions.filter(t => t.receiptNo && t.receiptNo.includes(datePrefix));
    const seq = String(todayTrans.length + 1).padStart(4, '0');
    const receiptNo = `NA-${datePrefix}-${seq}`;

    // Format Tarikh "YYYY-MM-DD HH:mm"
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const dateFormatted = `${yyyy}-${mm}-${dd} ${hh}:${min}`;

    const transactionData = {
        receiptNo: receiptNo,
        date: dateFormatted,
        items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
        total: grandTotal,
        paid: paid,
        balance: balance
    };

    transactions.push(transactionData);
    localStorage.setItem('pos_transactions', JSON.stringify(transactions));

    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    modal.hide();

    // Print resit menggunakan logic receipt.js
    generateReceipt(transactionData);

    // Reset Sistem
    cart = [];
    updateCart();
    cashInput.value = '';
    changeEl.innerText = 'RM 0.00';
    btnConfirm.disabled = true;
});
