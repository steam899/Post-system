document.addEventListener('DOMContentLoaded', () => {
    loadProductsTable();

    document.getElementById('form-product').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });
});

function getProducts() {
    let products = JSON.parse(localStorage.getItem('pos_products'));
    if (!products || products.length === 0) {
        // Data Default mengikut format yang diminta
        products = [
            { id: 1, sku: "NA001", name: "Nasi Ayam Original", price: 8.90, category: "Makanan" },
            { id: 2, sku: "NA002", name: "Nasi Ayam Penyet", price: 10.50, category: "Makanan" },
            { id: 3, sku: "MN001", name: "Teh O Ais", price: 2.00, category: "Minuman" },
            { id: 4, sku: "MN002", name: "Milo Ais", price: 3.50, category: "Minuman" }
        ];
        localStorage.setItem('pos_products', JSON.stringify(products));
    }
    return products;
}

function loadProductsTable() {
    const products = getProducts();
    const tbody = document.getElementById('product-table-body');
    tbody.innerHTML = '';

    products.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${p.sku}</strong></td>
                <td>${p.name}</td>
                <td><span class="badge bg-secondary">${p.category}</span></td>
                <td>RM ${p.price.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function saveProduct() {
    const products = getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        id: newId,
        sku: document.getElementById('p-sku').value.toUpperCase(),
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        category: document.getElementById('p-category').value
    };

    products.push(newProduct);
    localStorage.setItem('pos_products', JSON.stringify(products));
    
    document.getElementById('form-product').reset();
    loadProductsTable();
}

function deleteProduct(id) {
    if(confirm("Padam produk ini?")) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        localStorage.setItem('pos_products', JSON.stringify(products));
        loadProductsTable();
    }
}
