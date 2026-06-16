function generateReceipt(trans) {
    const settings = JSON.parse(localStorage.getItem('pos_settings')) || {
        name: "Sistem POS", address: "Alamat Kedai", phone: "0123456789", ssm: "", footer: "Terima Kasih!", paper: "80mm", logo: "assets/logo.png"
    };

    let itemsHtml = '';
    trans.items.forEach(item => {
        itemsHtml += `
            <div class="flex-row">
                <span>${item.name} x${item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
        `;
    });

    let logoHtml = settings.logo ? `<img src="${settings.logo}" alt="Logo" onerror="this.style.display='none'">` : '';

    const receiptContent = `
        <div class="thermal-receipt size-${settings.paper}">
            <div class="text-center">
                ${logoHtml}
                <h3 style="margin:0;">${settings.name}</h3>
                ${settings.ssm ? `<div style="font-size:12px;">No Pend: ${settings.ssm}</div>` : ''}
                <div style="font-size:12px; white-space: pre-line;">${settings.address}</div>
                ${settings.phone ? `<div style="font-size:12px;">Tel: ${settings.phone}</div>` : ''}
            </div>
            
            <div class="divider"></div>
            
            <div class="flex-row" style="font-size:12px;">
                <span>Tarikh: ${trans.date}</span>
                <span>Resit: ${trans.receiptNo}</span>
            </div>

            <div class="divider"></div>
            
            <div style="margin-bottom:10px;">
                ${itemsHtml}
            </div>
            
            <div class="divider"></div>
            
            <div class="flex-row">
                <strong>JUMLAH</strong>
                <strong>RM ${trans.total.toFixed(2)}</strong>
            </div>
            <div class="flex-row">
                <span>DIBAYAR</span>
                <span>RM ${trans.paid.toFixed(2)}</span>
            </div>
            <div class="flex-row">
                <span>BAKI</span>
                <span>RM ${trans.balance.toFixed(2)}</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="text-center" style="margin-top:10px; font-size:12px;">
                ${settings.footer}
            </div>
        </div>
    `;

    const printArea = document.getElementById('print-area');
    printArea.innerHTML = receiptContent;

    window.print();
}
