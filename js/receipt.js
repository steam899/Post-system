function generateReceipt(trans) {
    const settings = JSON.parse(localStorage.getItem('pos_settings')) || {
        name: "Kedai Saya", address: "", phone: "", ssm: "", footer: "Terima Kasih", paper: "80mm"
    };

    const dateObj = new Date(trans.date);
    const dateStr = dateObj.toLocaleDateString('ms-MY') + ' ' + dateObj.toLocaleTimeString('ms-MY');

    let itemsHtml = '';
    trans.items.forEach(item => {
        itemsHtml += `
            <div class="flex-row">
                <span>${item.name} x${item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
        `;
    });

    let logoHtml = settings.logo ? `<img src="${settings.logo}" alt="Logo">` : '';

    const receiptContent = `
        <div class="thermal-receipt size-${settings.paper}">
            <div class="text-center">
                ${logoHtml}
                <h3 style="margin:0;">${settings.name}</h3>
                ${settings.ssm ? `<div style="font-size:12px;">No Pendaftaran: ${settings.ssm}</div>` : ''}
                <div style="font-size:12px; white-space: pre-line;">${settings.address}</div>
                ${settings.phone ? `<div style="font-size:12px;">Tel: ${settings.phone}</div>` : ''}
            </div>
            
            <div class="divider"></div>
            
            <div class="flex-row" style="font-size:12px;">
                <span>Tarikh: ${dateStr}</span>
                <span>No: #${trans.receiptNo}</span>
            </div>

            <div class="divider"></div>
            
            <div style="margin-bottom:10px;">
                ${itemsHtml}
            </div>
            
            <div class="divider"></div>
            
            <div class="flex-row">
                <strong>Jumlah</strong>
                <strong>RM ${trans.total.toFixed(2)}</strong>
            </div>
            <div class="flex-row">
                <span>Tunai</span>
                <span>RM ${trans.cash.toFixed(2)}</span>
            </div>
            <div class="flex-row">
                <span>Baki</span>
                <span>RM ${trans.change.toFixed(2)}</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="text-center" style="margin-top:10px; font-size:12px;">
                ${settings.footer}
            </div>
        </div>
    `;

    const printArea = document.getElementById('print-area');
    printArea.innerHTML = receiptContent;

    // Trigger Print
    window.print();
}
