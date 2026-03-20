const QRCode = require('qrcode');

window.openQRCodeModal = function(code) {
    const canvas = document.getElementById('qrcode');
    const url = `${window.location.origin}/questionnaire/code/${code}`;

    QRCode.toCanvas(canvas, url, {
        width: 200,
        margin: 2
    }, function (error) {
        if (error) console.error(error);
    });

    document.getElementById("qr-code-display").innerText = code;
    document.getElementById("qr-modal").style.display = "flex";
};

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("qr-modal");
    const closeBtn = document.querySelector(".close-modal");
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }
});
