document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    document.getElementById('settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });
});

function loadSettings() {
    // Default settings
    const defaultSettings = {
        name: "Kedai Runcit ABC",
        logo: "",
        address: "No 1, Jalan Contoh,\nKuala Lumpur",
        phone: "012-3456789",
        ssm: "202301234567 (KT0123456-A)",
        footer: "Terima Kasih. Sila Datang Lagi!",
        paper: "80mm"
    };

    let settings = JSON.parse(localStorage.getItem('pos_settings'));
    if (!settings) {
        settings = defaultSettings;
        localStorage.setItem('pos_settings', JSON.stringify(settings));
    }

    document.getElementById('set-name').value = settings.name;
    document.getElementById('set-logo').value = settings.logo;
    document.getElementById('set-address').value = settings.address;
    document.getElementById('set-phone').value = settings.phone;
    document.getElementById('set-ssm').value = settings.ssm;
    document.getElementById('set-footer').value = settings.footer;
    document.getElementById('set-paper').value = settings.paper;
}

function saveSettings() {
    const settings = {
        name: document.getElementById('set-name').value,
        logo: document.getElementById('set-logo').value,
        address: document.getElementById('set-address').value,
        phone: document.getElementById('set-phone').value,
        ssm: document.getElementById('set-ssm').value,
        footer: document.getElementById('set-footer').value,
        paper: document.getElementById('set-paper').value
    };

    localStorage.setItem('pos_settings', JSON.stringify(settings));
    alert("Tetapan berjaya disimpan!");
}
