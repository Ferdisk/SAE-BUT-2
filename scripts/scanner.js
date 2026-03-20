const { Html5QrcodeScanner } = require('html5-qrcode');

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById('start-scan-btn');
    const inputField = document.getElementById('label-link');

    if (!startBtn) return;

    const scanner = new Html5QrcodeScanner(
        "reader", 
        { fps: 10, qrbox: { width: 250, height: 250 } }
    );

    function onScanSuccess(decodedText) {
        const parts = decodedText.split('/');
        const code = parts[parts.length - 1];

        inputField.value = code;

        scanner.clear();
        document.getElementById('reader').style.display = 'none';

        document.getElementById("questionnaire-access-button").click();
    }

    startBtn.addEventListener('click', () => {
        document.getElementById('reader').style.display = 'block';
        scanner.render(onScanSuccess, (error) => {
        });
    });
});
