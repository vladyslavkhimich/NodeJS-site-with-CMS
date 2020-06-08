let $orderForm = $('#orderForm');
let orderURL = '/placeorder';
let alertContainer = new AlertContainer('alertContainer');

function tryToMakeOrder() {
    if(!$orderForm[0].checkValidity()) {
        $orderForm.find(':submit').click();
    }
    else {
        let formInputs = document.getElementById('orderForm').elements;
        fetch(orderURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                name: formInputs['userNameInput'].value,
                lastName: formInputs['lastNameInput'].value,
                phone: $('#phoneInput').cleanVal(),
                city: formInputs['cityInput'].value,
                area: formInputs['areaInput'].value,
                street: formInputs['streetInput'].value,
                building: formInputs['buildingNumberInput'].value,
                apartment: formInputs['apartmentNumberInput'].value,
            })
        }).then(function (response) {
            response.text().then(function (text) {
                if (text === 'Redirect cart')
                    window.location = 'http://localhost:3000/cart';
                else if (text === 'Log in') {
                    alertContainer.showErrorAlertContainer('Ви маєте ввійти в аккаунт, щоб здійснювати покупки');
                    $('#loginModal').modal('show');
                }
                else if (text === 'Admin')
                    alertContainer.showErrorAlertContainer('You are logged as admin. Logout on admin-panel!');
                else if (text === 'Creation failed')
                    alertContainer.showErrorAlertContainer('Не вдалося створити замовлення');
                else if (text === 'Order placed') {
                    document.getElementById('totalQtySpan').innerText = '0';
                    alertContainer.showSuccessAlertContainer('Ваше замовлення прийнято до обробки');
                    $('#successModal').modal('show');
                    setTimeout(() => {
                        $('#successModal').modal('hide');
                    }, 10000);
                }
            })
        })
    }
}