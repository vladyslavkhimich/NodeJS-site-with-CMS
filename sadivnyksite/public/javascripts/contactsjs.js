const copiedTitle = 'Copied';
const phoneNumberInput = document.getElementById('phone-number-input');
phoneNumberInput.removeAttribute('title');
function copyNumberToClipboard() {
    phoneNumberInput.setAttribute('title', copiedTitle);
    $('#copy-button').tooltip({
        animation: true,
        trigger: 'manual'
    });
    phoneNumberInput.select();
    phoneNumberInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    showCopyTooltip();
}

function showCopyTooltip() {
    $('#copy-button').tooltip('show');
    setTimeout(hideTooltip, 5000);
}

function hideTooltip() {
    $('#copy-button').tooltip('hide');
}