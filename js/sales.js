let transactions = [];

document.addEventListener('DOMContentLoaded', () => {
    transactions = JSON.parse(localStorage.getItem('pos_transactions')) || [];
    renderSales(transactions);

    document.getElementById('search-sales').addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = transactions.filter(t => t.receiptNo.toLowerCase().includes(keyword));
        renderSales(filtered);
    });
});

function renderSales(data) {
    const tbody = document.getElementById('sales-table-body');
    tbody.innerHTML = '';

    const sortedData = [...data].reverse();

    sortedData.forEach(t => {
        let itemNames = t.items.map(i => `${i.name} (x${i.qty})`).join('<br>');

        tbody.innerHTML += `
            <tr>
                <td>${t.date}</td>
                <td><strong>${t.receiptNo}</strong></td>
                <td><small>${itemNames}</small></td>
                <td class="text-primary fw-bold">RM ${t.total.toFixed(2)}</td>
            </tr>
        `;
    });

    if(sortedData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center">Tiada rekod jualan.</td></tr>`;
    }
}
