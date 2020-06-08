var totalQtySpan = document.getElementById('totalQtySpan');
var alertContainer = new AlertContainer('alertContainer');
alertContainer.makeAlertContainerInvisible();

function addToCart(addURL) {
    fetch (addURL, {
        method: 'GET',
        headers: {
            'X-CSRF-Token': document.getElementById('_csrf').value
        }
    }).then( function (response) {
        response.text().then( function(text) {
            if (text === 'Addition failed')
                alertContainer.showErrorAlertContainer('Не вдалося додати продукт до корзини');
            else if (text === 'Product added') {
                alertContainer.showSuccessAlertContainer('Продукт успішно додано до корзини');
                if (totalQtySpan.innerText.length > 0)
                    totalQtySpan.innerText = (parseInt(totalQtySpan.innerText) + 1).toString();
                else
                    totalQtySpan.innerText = '1';
            }
        })
    })
}