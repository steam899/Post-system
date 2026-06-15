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

    // Sort by latest first
    const sortedData = [...data].reverse();

    sortedData.forEach(t => {
        const dateStr = new Date(t.date).toLocaleString('ms-MY');
        let itemNames = t.items.map(i => `${i.name} (x${i.qty})`).join(', ');

        tbody.innerHTML += `
            <tr>
                <td>${dateStr}</td>
                <td><strong>#${t.receiptNo}</strong></td>
                <td><small>${itemNames}</small></td>
                <td class="text-primary fw-bold">RM ${t.total.toFixed(2)}</td>
            </tr>
        `;
    });

    if(sortedData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center">Tiada rekod jualan dijumpai.</td></tr>`;
    }
}

function exportCSV() {
    if(transactions.length === 0) {
        alert("Tiada rekod untuk di-export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Tarikh,No Resit,Item Terjual,Jumlah (RM),Tunai (RM),Baki (RM)\n";

    transactions.forEach(t => {
        const dateStr = new Date(t.date).toLocaleString('ms-MY').replace(/,/g, '');
        const items = t.items.map(i => `${i.name}(${i.qty})`).join('; ');
        
        const row = `${dateStr},${t.receiptNo},${items},${t.total.toFixed(2)},${t.cash.toFixed(2)},${t.change.toFixed(2)}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekod_Jualan_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
