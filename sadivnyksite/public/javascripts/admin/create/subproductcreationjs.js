var generalProductSelectInput = document.getElementById('generalProductSelectInput');
var generalProductOptions = document.getElementById('generalProductOptions');
var subProductCodeInput = document.getElementById('subProductCodeInput');
var subProductPriceInput = document.getElementById('subProductPriceInput');
var subProductDescriptionInput = document.getElementById('subProductDescriptionInput');
var alertContainer = new AlertContainer('alertContainer');

alertContainer.makeAlertContainerInvisible();
var creationURL = 'http://localhost:3000/admin/panel/create/subproduct/submit';
var codeRegexp = /^\d{2}-\d{3}$/;

function createNewSubProduct() {
    if (generalProductSelectInput.value.length === 0 || subProductCodeInput.value.length === 0 || subProductPriceInput.value.length === 0 || subProductDescriptionInput.value.length === 0)
        alertContainer.showErrorAlertContainer('Fields must bot be empty');
    else if (!subProductCodeInput.value.match(codeRegexp))
        alertContainer.showErrorAlertContainer('Code input must be in such form: i.e. 12-345');
    else if (generalProductSelectInput.value === 'No general products')
        alertContainer.showErrorAlertContainer('Create general product first');
    else if (!isDatalistOption(generalProductSelectInput.value))
        alertContainer.showErrorAlertContainer('Product from list must be selected');
    else {
        fetch(creationURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                generalProduct: generalProductSelectInput.value,
                code: subProductCodeInput.value,
                price: subProductPriceInput.value,
                description: subProductDescriptionInput.value
            })
        }).then(function (response) {
            response.text().then(function (text) {
                if (text === 'Creation failed')
                    alertContainer.showErrorAlertContainer('Creation process failed');
                else if (text === 'Record created') {
                    alertContainer.showSuccessAlertContainer('Record was successfully created');
                    clearInputFields();
                }
            })
        })
    }

}

function isDatalistOption(value) {
    for (let i = 0; i < generalProductOptions.options.length; i++) {
        if (value === generalProductOptions.options[i].value)
            return true;
    }
    return false;
}

function clearInputFields() {
    subProductCodeInput.value = '';
    subProductPriceInput.value = '';
    subProductDescriptionInput.value = '';
}