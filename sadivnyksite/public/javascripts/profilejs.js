var userNameInput = document.getElementById('userNameInput');
var lastNameInput = document.getElementById('lastNameInput');
var surnameInput = document.getElementById('surnameInput');
var dateInput = document.getElementById('dateInput');
var sexInput = document.getElementById('sexInput');
var userBirthDateSpan = document.getElementById('userBirthDateSpan');
var userSexSpan = document.getElementById('userSexSpan');

var editPersonalDataButton = document.getElementById('editPersonalDataButton');
var editContactsDataButton = document.getElementById('editContactsDataButton');
var editPasswordDataButton = document.getElementById('editPasswordDataButton');

var oldPasswordInput = document.getElementById('oldPasswordInput');
var newPasswordInput = document.getElementById('newPasswordInput');
var repeatNewPasswordInput = document.getElementById('repeatNewPasswordInput');

var personalDataAlertContainer = new AlertContainer('personalDataAlertContainer');
var contactsDataAlertContainer = new AlertContainer('contactsDataAlertContainer');
var passwordDataAlertContainer = new AlertContainer('passwordDataAlertContainer');

personalDataAlertContainer.makeAlertContainerInvisible();
contactsDataAlertContainer.makeAlertContainerInvisible();
passwordDataAlertContainer.makeAlertContainerInvisible();

var changePersonalDataUrl = '/user/profile/personaldata';
var changeContactsDataUrl = '/user/profile/contactsdata';
var changePasswordDataUrl = '/user/profile/passworddata';

var nameRegExp = /^([^Ьа-я][а-яіїщґ]+[-']?(?:[А-Яа-яіїщґ]+)*)$/;

$.fn.extend({
    trackChanges: function() {
        $(':input', this).change(function() {
            $(this.form).data('changed', true);
        });
    },
    isChanged: function() {
        return this.data('changed');
    }
});

$.fn.datepicker.dates['uk'] = {
    days: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"],
    daysShort: ["Нед", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нед"],
    daysMin: ["Нед", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нед"],
    months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
    monthsShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"]
};

function changePersonalData() {
    userNameInput.value = trim(userNameInput.value);
    lastNameInput.value = trim(lastNameInput.value);
    surnameInput.value = trim(surnameInput.value);
    /*if (lastNameInput.value.length !== 0) {
        if (!lastNameInput.value.match(nameRegExp))
            personalDataAlertContainer.showErrorAlertContainer("Прізвище має бути у формі, наприклад: Хіміч");
    }*/
    if (!$('#editPersonalDataForm').isChanged())
        personalDataAlertContainer.showErrorAlertContainer('Персональні дані не були змінені');
    else if (userNameInput.value.length === 0)
        personalDataAlertContainer.showErrorAlertContainer("Ім'я не може бути відсутнім");
    else if (!userNameInput.value.match(nameRegExp))
        personalDataAlertContainer.showErrorAlertContainer("Ім'я має бути у формі, наприклад: Владислав");
    else if (lastNameInput.value.length !== 0 && !lastNameInput.value.match(nameRegExp))
        personalDataAlertContainer.showErrorAlertContainer("Прізвище має бути у формі, наприклад: Хіміч");
    else if (surnameInput.value.length !== 0 && !surnameInput.value.match(nameRegExp))
        personalDataAlertContainer.showErrorAlertContainer("По-батькові має бути у формі, наприклад: Олегович");
    else
        fetch(changePersonalDataUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                name: userNameInput.value,
                lastName: lastNameInput.value,
                surname: surnameInput.value,
                birthDate: $("#dateInput").data("datepicker").getDate(),
                sex: sexInput.value
            })
        }).then( function (response) {
            response.text().then(function (text) {
                if (text === 'Record updated') {
                    personalDataAlertContainer.showSuccessAlertContainer('Дані було успішно змінено');
                    cancelChangingPersonalData();
                }
                else if (text === 'Update failed')
                    personalDataAlertContainer.showErrorAlertContainer('Не вдалося оновити дані');
            })
        })
}

function changeContactsData() {
    if (!$('#editPersonalDataForm').isChanged())
        contactsDataAlertContainer.showErrorAlertContainer('Контактні дані не були змінені');
    else if ($('#phoneInput').cleanVal().length < 9)
        contactsDataAlertContainer.showErrorAlertContainer('Має бути введено 9 цифр мобільного номеру');
    else
        fetch(changeContactsDataUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                phoneNumber: $('#phoneInput').cleanVal()
            })
        }).then( function (response) {
            response.text().then( function (text) {
                if (text === 'Record updated') {
                    contactsDataAlertContainer.showSuccessAlertContainer('Дані було успішно змінено');
                    cancelChangingContactsData();
                }
                else if (text === 'Update failed')
                    contactsDataAlertContainer.showErrorAlertContainer('Не вдалося оновити дані');
            })
        })
}

function changePasswordData() {
    if (oldPasswordInput.value.length < 8 || newPasswordInput.value.length < 8 || repeatNewPasswordInput.value.length < 8)
        passwordDataAlertContainer.showErrorAlertContainer('Дані у всіх полях мають містити щонайменше 8 символів');
    else if (newPasswordInput.value !== repeatNewPasswordInput.value)
        passwordDataAlertContainer.showErrorAlertContainer('Нові паролі не співпадають');
    else if (newPasswordInput.value === oldPasswordInput.value)
        passwordDataAlertContainer.showErrorAlertContainer('Новий пароль співпадає зі старим');
    else
        fetch(changePasswordDataUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                oldPassword: oldPasswordInput.value,
                newPassword: newPasswordInput.value
            })
        }).then( function (response) {
            response.text().then( function (text) {
                if (text === 'Record updated') {
                    passwordDataAlertContainer.showSuccessAlertContainer('Дані було успішно змінено');
                    cancelChangingPasswordData();
                }
                else if (text === 'Update failed')
                    passwordDataAlertContainer.showErrorAlertContainer('Не вдалося оновити дані');
                else if (text === 'Password mismatched')
                    passwordDataAlertContainer.showErrorAlertContainer('Вказано невірний старий пароль');
            })
        })
}

function cancelChangingPersonalData() {
    disableFormInputs('editPersonalDataForm');
    editPersonalDataButton.style.display = 'block';
}

function cancelChangingContactsData() {
    disableFormInputs('editContactsDataForm');
    editContactsDataButton.style.display = 'block';
}

function cancelChangingPasswordData() {
    disableFormInputs('editPasswordDataForm');
    editPasswordDataButton.style.display = 'block';
    clearPasswordFields();
}

$('#editPersonalDataForm').trackChanges();
$('#editContactsDataForm').trackChanges();

window.onload = function() {
    let birthDate = userBirthDateSpan.innerText;
    let date = new Date(birthDate.replace(/[-]/g, '/'));
    $('#dateInput').datepicker({
        language: 'uk',
        weekStart: 1,
        minDate: new Date(1900, 1, 1),
        maxDate: new Date()
    });
    $('#dateInput').datepicker('update', date);
    if (userSexSpan.innerText !== '') {
        if (userSexSpan.innerText === 'false')
            sexInput.value = 0;
        else
            sexInput.value = 1;
    }
    disableFormInputs('editPersonalDataForm');
    disableFormInputs('editContactsDataForm');
    disableFormInputs('editPasswordDataForm');
};

function disableFormInputs(formId) {
    $('#' + formId).find('input, button, select').attr('disabled', 'disabled');
}

function enableFormInputs(formId) {
    $('#' + formId).find('input, button, select').removeAttr('disabled');
}

function enablePersonalDataForm() {
    enableFormInputs('editPersonalDataForm');
    editPersonalDataButton.style.display = 'none';
}

function enableContactsDataForm() {
    enableFormInputs('editContactsDataForm');
    editContactsDataButton.style.display = 'none';
}

function enablePasswordDataForm() {
    enableFormInputs('editPasswordDataForm');
    editPasswordDataButton.style.display = 'none';
}

function clearPasswordFields() {
    oldPasswordInput.value = '';
    newPasswordInput.value = '';
    repeatNewPasswordInput.value = '';
}

function trim(value) {
    return value.replace(/^\s+|\s+$/g,"");
}