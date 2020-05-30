var loginInput = document.getElementById('loginInput');
var passwordInput = document.getElementById('passwordInput');
var repeatPasswordInput = document.getElementById('repeatPasswordInput');
var alertContainer = new AlertContainer('alertContainer');
var adminCreationUrl = 'http://localhost:3000/admin/panel/create/admin/submit';
alertContainer.makeAlertContainerInvisible();

function createNewAdmin() {
    if (loginInput.value.length === 0 || passwordInput.value.length === 0 || repeatPasswordInput.value.length === 0) {
        alertContainer.showErrorAlertContainer('Fields must not be empty');
    }
    else if (loginInput.value.length < 5)
        alertContainer.showErrorAlertContainer('Login must be at least 5 characters long');
    else if (passwordInput.value.length < 8)
        alertContainer.showErrorAlertContainer('Password must be at least 8 characters long');
    else if (passwordInput.value !== repeatPasswordInput.value)
        alertContainer.showErrorAlertContainer('Passwords are not equal');
    else {
        fetch(adminCreationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                login: loginInput.value,
                password: passwordInput.value
            })
        }).then(function (response) {
            response.text().then(function (text) {
                if (text === 'Admin exists')
                    alertContainer.showErrorAlertContainer('Admin with such login already exists');
                else if (text === 'Creation failed')
                    alertContainer.showErrorAlertContainer('Creation process failed');
                else if (text === 'Record created') {
                    alertContainer.showSuccessAlertContainer('Record was successfully created');
                    clearInputFields();
                }
            })
        })
    }
}

function clearInputFields() {
    loginInput.value = '';
    passwordInput.value = '';
    repeatPasswordInput.value = '';
}