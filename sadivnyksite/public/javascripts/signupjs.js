var nameInput = document.getElementById('nameInput');
var emailInput = document.getElementById('emailInput');
var passwordInput = document.getElementById('passwordInput');
var signUpAlertContainer = new AlertContainer('signUpAlertContainer');
signUpAlertContainer.makeAlertContainerInvisible();
var createURL = '/user/signup/submit';
var nameRegExp = /^([^Ьа-я][а-яіїщґ]+[-']?(?:[А-Яа-яіїщґ]+)*)$/;

function createNewUser() {
    nameInput.value = trim(nameInput.value);
    emailInput.value = trim(emailInput.value);
    if (nameInput.value.length === 0 || emailInput.value.length === 0 || passwordInput.value.length === 0)
        signUpAlertContainer.showErrorAlertContainer('Поля мають бути заповнені');
    else if (!nameInput.value.match(nameRegExp))
        signUpAlertContainer.showErrorAlertContainer("Ім'я має бути у формі, наприклад: Олег");
    else if (passwordInput.value.length < 8)
        signUpAlertContainer.showErrorAlertContainer('Довжина паролю має бути щонайменше 8 символів');
    else if (emailInput.value === passwordInput.value)
        signUpAlertContainer.showErrorAlertContainer('Електронна пошта не має співападати з паролем');
    else
        fetch(createURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                email: emailInput.value,
                name: nameInput.value,
                password: passwordInput.value
            })
        }).then( function(response) {
            response.text().then( function(text) {
                if (text === 'Email exists')
                    signUpAlertContainer.showErrorAlertContainer('Користувач з такою електронною адресою вже існує');
                else if (text === 'Creation failed')
                    signUpAlertContainer.showErrorAlertContainer('Не вдалося створити користувача');
                else if (text === 'Record created'){
                    signUpAlertContainer.showSuccessAlertContainer('Користувача успішно створено');
                    clearRegisterInputs();
                }
            })
        })
}

function trim(value) {
    return value.replace(/^\s+|\s+$/g,"");
}

$('#login-register').click(function() {
    $('#loginModal').modal('hide');
    $('#registerModal').modal('show');
});

$('#register-login').click(function() {
    $('#registerModal').modal('hide');
    $('#loginModal').modal('show');
});

function clearRegisterInputs() {
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
}