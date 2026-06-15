// Mock Data Produk (Dalam realiti, ini datang dari backend/DB)
const products = [
    { id: 1, name: "Nasi Lemak Ayam", price: 8.50, img: "https://via.placeholder.com/150/ff7f7f/333333?text=Nasi+Lemak" },
    { id: 2, name: "Teh Tarik", price: 2.50, img: "https://via.placeholder.com/150/ffb84d/333333?text=Teh+Tarik" },
    { id: 3, name: "Milo Ais", price: 3.00, img: "https://via.placeholder.com/150/4dff4d/333333?text=Milo+Ais" },
    { id: 4, name: "Roti Canai", price: 1.50, img: "https://via.placeholder.com/150/ffff4d/333333?text=Roti+Canai" },
    { id: 5, name: "Mee Goreng", price: 6.00, img: "https://via.placeholder.com/150/ff4dff/333333?text=Mee+Goreng" },
    { id: 6, name: "Kopi O Panas", price: 2.00, img: "https://via.placeholder.com/150/8c8c8c/ffffff?text=Kopi+O" }
];

let cart = [];
let grandTotal = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
});

// Render Products
function renderProducts(items) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    items.forEach(p => {
        container.innerHTML += `
            <div class="col-md-4 col-sm-6 mb-3">
                <div class="card product-card shadow-sm" onclick="addToCart(${p.id})">
                    <img src="${p.img}" class="card-img-top" alt="${p.name}">
                    <div class="card-body p-2 text-center">
                        <h6 class="card-title mb-1">${p.name}</h6>
                        <strong class="text-primary">RM ${p.price.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        `;
    });
}

// Search Product
document.getElementById('search-product').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
    renderProducts(filtered);
});

// Add to Cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCart();
}

// Update Cart Quantity
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

// Render & Calculate Cart
function updateCart() {
    const cartEl = document.getElementById('cart-items');
    cartEl.innerHTML = '';
    grandTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;

        cartEl.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center p-2">
                <div>
                    <h6 class="my-0">${item.name}</h6>
                    <small class="text-muted">RM ${item.price.toFixed(2)}</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-danger px-2 py-0" onclick="updateQty(${item.id}, -1)">-</button>
                    <span class="mx-2">${item.qty}</span>
                    <button class="btn btn-sm btn-outline-success px-2 py-0" onclick="updateQty(${item.id}, 1)">+</button>
                    <strong class="ms-3" style="width: 60px; text-align: right;">RM ${itemTotal.toFixed(2)}</strong>
                </div>
            </li>
        `;
    });

    document.getElementById('subtotal').innerText = `RM ${grandTotal.toFixed(2)}`;
    document.getElementById('total').innerText = `RM ${grandTotal.toFixed(2)}`;
    document.getElementById('modal-total').innerText = `RM ${grandTotal.toFixed(2)}`;
    
    document.getElementById('btn-checkout').disabled = cart.length === 0;
}

// Payment Logic
const cashInput = document.getElementById('cash-received');
const changeEl = document.getElementById('modal-change');
const btnConfirm = document.getElementById('btn-confirm-pay');

cashInput.addEventListener('input', () => {
    const cash = parseFloat(cashInput.value) || 0;
    const change = cash - grandTotal;
    
    if (change >= 0 && cart.length > 0) {
        changeEl.innerText = `RM ${change.toFixed(2)}`;
        changeEl.classList.replace('text-danger', 'text-success');
        btnConfirm.disabled = false;
    } else {
        changeEl.innerText = `RM 0.00 (Tidak Cukup)`;
        changeEl.classList.replace('text-success', 'text-danger');
        btnConfirm.disabled = true;
    }
});

// Checkout & Save
btnConfirm.addEventListener('click', () => {
    const cash = parseFloat(cashInput.value);
    const change = cash - grandTotal;

    // Get previous transactions to auto-increment receipt number
    let transactions = JSON.parse(localStorage.getItem('pos_transactions')) || [];
    let receiptNo = "1001";
    if (transactions.length > 0) {
        const lastReceipt = parseInt(transactions[transactions.length - 1].receiptNo);
        receiptNo = (lastReceipt + 1).toString();
    }

    const transactionData = {
        date: new Date().toISOString(),
        receiptNo: receiptNo,
        items: cart,
        total: grandTotal,
        cash: cash,
        change: change
    };

    // Save to LocalStorage
    transactions.push(transactionData);
    localStorage.setItem('pos_transactions', JSON.stringify(transactions));

    // Hide Modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    modal.hide();

    // Print Receipt (function from receipt.js)
    generateReceipt(transactionData);

    // Reset Cart
    cart = [];
    updateCart();
    cashInput.value = '';
    changeEl.innerText = 'RM 0.00';
    btnConfirm.disabled = true;
});
