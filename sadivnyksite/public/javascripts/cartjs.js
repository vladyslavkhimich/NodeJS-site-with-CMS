var alertContainer = new AlertContainer('alertContainer');
var totalPriceSpan = document.getElementById('totalPriceSpan');
var totalQtySpan = document.getElementById('totalQtySpan');
var tryToOrderURL = '/trytoorder';

function reduceQtyByOne(reduceURL) {
    let qtySpan;
    let sumSpan;
    let productPrice;
    if (event.target.tagName.toLowerCase() === 'i') {
        qtySpan = event.target.parentNode.nextElementSibling;
        sumSpan = event.target.parentNode.parentNode.nextElementSibling;
    }
    else {
        qtySpan = event.target.nextElementSibling;
        sumSpan = event.target.parentNode.nextElementSibling;
    }
    productPrice = parseFloat(sumSpan.innerText) / parseInt(qtySpan.innerText);
    if (parseInt(qtySpan.innerText) === 1)
        alertContainer.showErrorAlertContainer('Одиниць товару не може бути менше, ніж 1');
    else
        fetch(reduceURL, {
            method: 'GET',
            headers: {
                'X-CSRF-Token': document.getElementById('_csrf').value
            }
        }).then( function (response) {
            response.text().then( function (text) {
                if (text === 'Reduced') {
                    qtySpan.innerText = (parseInt(qtySpan.innerText) - 1).toString();
                    sumSpan.innerText = (Math.round(((parseFloat(sumSpan.innerText) - productPrice) + Number.EPSILON) * 100) / 100).toString();
                    totalPriceSpan.innerText = (Math.round(((parseFloat(totalPriceSpan.innerText) - productPrice) + Number.EPSILON) * 100) / 100).toString();
                    totalQtySpan.innerText = (parseInt(totalQtySpan.innerText) - 1).toString();
                }
            })
        })
}

function increaseQtyByOne(increaseURL) {
    let qtySpan;
    let sumSpan;
    let productPrice;
    if (event.target.tagName.toLowerCase() === 'i') {
        qtySpan = event.target.parentNode.previousElementSibling;
        sumSpan = event.target.parentNode.parentNode.nextElementSibling;
    }
    else {
        qtySpan = event.target.previousElementSibling;
        sumSpan = event.target.parentNode.nextElementSibling;
    }
    productPrice = parseFloat(sumSpan.innerText) / parseInt(qtySpan.innerText);
    fetch(increaseURL, {
        method: 'GET',
        headers: {
            'X-CSRF-Token': document.getElementById('_csrf').value
        }
    }).then( function (response) {
        response.text().then( function (text) {
            if (text === 'Product added') {
                qtySpan.innerText = (parseInt(qtySpan.innerText) + 1).toString();
                sumSpan.innerText = (Math.round(((parseFloat(sumSpan.innerText) + productPrice) + Number.EPSILON) * 100) / 100).toString();
                totalPriceSpan.innerText = (Math.round(((parseFloat(totalPriceSpan.innerText) + productPrice) + Number.EPSILON) * 100) / 100).toString();
                totalQtySpan.innerText = (parseInt(totalQtySpan.innerText) + 1).toString();
            }
        })
    })
}

function removeProduct(removeURL) {
    let qtySpan;
    let sumSpan;
    let productNode;
    if (event.target.tagName.toLowerCase() === 'i') {
        qtySpan = event.target.parentNode.previousElementSibling.previousElementSibling.getElementsByClassName('qty-span')[0];
        sumSpan = event.target.parentNode.previousElementSibling;
        productNode = event.target.parentNode.parentNode;
    }
    else {
        qtySpan = event.target.previousElementSibling.previousElementSibling.getElementsByClassName('qty-span')[0];
        sumSpan = event.target.previousElementSibling;
        productNode = event.target.parentNode;
    }
    fetch(removeURL, {
        method: 'GET',
        headers: {
            'X-CSRF-Token': document.getElementById('_csrf').value
        }
    }).then( function (response) {
        response.text().then( function (text) {
            if (text === 'Removed') {
                let productQty = parseInt(qtySpan.innerText);
                let productPrice = sumSpan.innerText;
                productNode.remove();
                totalPriceSpan.innerText = (Math.round(((parseFloat(totalPriceSpan.innerText) - productPrice) + Number.EPSILON) * 100) / 100).toString();
                totalQtySpan.innerText = (parseInt(totalQtySpan.innerText) - productQty).toString();
                if ($('#products-list li').length === 0)
                    location.reload();

            }
        })
    })
}

function tryToOrder() {
    fetch(tryToOrderURL, {
        method: 'GET'
    }).then(function (response) {
        response.text().then(function (text) {
            if (text === 'Not logged') {
                alertContainer.showErrorAlertContainer('Для оформлення замовлення Ви маєте ввійти в свій акаунт');
                $('#loginModal').modal('show');
            }
            else if (text === 'Redirect')
                window.location = 'http://localhost:3000/order';
        })
    })
}