var generalProductSelectInput = document.getElementById('generalProductSelectInput');
var subProductCodeInput = document.getElementById('subProductCodeInput');
var subProductPriceInput = document.getElementById('subProductPriceInput');
var subProductDescriptionInput = document.getElementById('subProductDescriptionInput');
var alertContainer = new AlertContainer('alertContainer');

alertContainer.makeAlertContainerInvisible();
var codeRegexp = /^\d{2}-\d{3}$/;

function editSubProduct(editURL) {
    if (generalProductSelectInput.value.length === 0 || subProductCodeInput.value.length === 0 || subProductPriceInput.value.length === 0 || subProductDescriptionInput.value.length === 0)
        alertContainer.showErrorAlertContainer('Fields must bot be empty');
    else if (!subProductCodeInput.value.match(codeRegexp))
        alertContainer.showErrorAlertContainer('Code input must be in such form: i.e. 12-345');
    else if (generalProductSelectInput.value === 'No general products')
        alertContainer.showErrorAlertContainer('Create general product first');
    else if (!isDatalistOption(generalProductSelectInput.value))
        alertContainer.showErrorAlertContainer('Product from list must be selected');
    else
        fetch(editURL, {
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
                if (text === 'Update failed')
                    alertContainer.showErrorAlertContainer('Updating process failed');
                else if (text === 'Record updated')
                    alertContainer.showSuccessAlertContainer('Record was successfully updated');
            })
        })
}

function isDatalistOption(value) {
    for (let i = 0; i < generalProductOptions.options.length; i++) {
        if (value === generalProductOptions.options[i].value)
            return true;
    }
    return false;
}