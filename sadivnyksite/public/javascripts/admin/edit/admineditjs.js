var loginInput = document.getElementById('loginInput');
var oldPasswordInput = document.getElementById('oldPasswordInput');
var newPasswordInput = document.getElementById('newPasswordInput');
var repeatPasswordInput = document.getElementById('repeatPasswordInput');
var isChangePasswordCheckbox = document.getElementById('is-change-password-checkbox');
var alertContainer = new AlertContainer('alertContainer');
alertContainer.makeAlertContainerInvisible();

function editAdmin(editURL) {
    if (!isChangePasswordCheckbox.checked) {
        if (loginInput.value.length === 0 || oldPasswordInput.value.length === 0 || newPasswordInput.value.length === 0 || repeatPasswordInput.value.length === 0)
            alertContainer.showErrorAlertContainer('Fields must not be empty');
        else if (loginInput.value.length < 5)
            alertContainer.showErrorAlertContainer('Login must be at least 5 characters long');
        else if (newPasswordInput.value.length < 8)
            alertContainer.showErrorAlertContainer('Password must be at least 8 characters long');
        else if (newPasswordInput.value !== repeatPasswordInput.value)
            alertContainer.showErrorAlertContainer('Passwords are not equal');
        else if (newPasswordInput.value === oldPasswordInput.value)
            alertContainer.showErrorAlertContainer('Old and new password are equal');
        else {
            fetch(editURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.getElementById('_csrf').value
                },
                body: JSON.stringify({
                    login: loginInput.value,
                    oldPassword: oldPasswordInput.value,
                    newPassword: newPasswordInput.value,
                    isChangePassword: true
                })
                }).then(function (response) {
                    response.text().then(function (text) {
                        if (text === 'Password mismatched')
                            alertContainer.showErrorAlertContainer('Old password is wrong');
                        else if (text === 'Update failed')
                            alertContainer.showErrorAlertContainer('Updating process failed');
                        else if (text === 'Record updated')
                            alertContainer.showSuccessAlertContainer('Record was successfully updated');
                    })
                })
            }
        }
    else {
        if (loginInput.value.length === 0 || oldPasswordInput.value.length === 0)
            alertContainer.showErrorAlertContainer('Fields must not be empty');
        else if (loginInput.value.length < 5)
            alertContainer.showErrorAlertContainer('Login must be at least 5 characters long');
        else if (oldPasswordInput.value.length < 8)
            alertContainer.showErrorAlertContainer('Password must be at least 8 characters long');
        else {
            fetch(editURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.getElementById('_csrf').value
                },
                body: JSON.stringify({
                    login: loginInput.value,
                    oldPassword: oldPasswordInput.value,
                    isChangePassword: false
                })
            }).then(function (response) {
                response.text().then(function (text) {
                    if (text === 'Password mismatched')
                        alertContainer.showErrorAlertContainer('Old password is wrong');
                    else if (text === 'Update failed')
                        alertContainer.showErrorAlertContainer('Updating process failed');
                    else if (text === 'Record updated')
                        alertContainer.showSuccessAlertContainer('Record was successfully updated');
                })
            })
        }
    }
}

function changePasswordCheckboxClick() {
    if (isChangePasswordCheckbox.checked) {
        newPasswordInput.setAttribute('disabled', 'disabled');
        repeatPasswordInput.setAttribute('disabled', 'disabled');
    }
    else {
        newPasswordInput.removeAttribute('disabled');
        repeatPasswordInput.removeAttribute('disabled');
    }
}