var generalProductInput = document.getElementById('generalProductInput');
var categorySelectInput = document.getElementById('categorySelectInput');
var manufacturerSelectInput = document.getElementById('manufacturerSelectInput');
var generalProductImageInput = document.getElementById('generalProductImageInput');
var productDescriptionInput = document.getElementById('productDescriptionInput');
var alertContainer = new AlertContainer('alertContainer');
alertContainer.makeAlertContainerInvisible();

function editGeneralProduct(editURL) {
    if (generalProductInput.value.length === 0 || generalProductImageInput.value.length === 0 || productDescriptionInput.value.length === 0)
        alertContainer.showErrorAlertContainer('Fields must not be empty');
    else if (categorySelectInput.value === '')
        alertContainer.showErrorAlertContainer('Category must be chosen');
    else if (manufacturerSelectInput.value === '')
        alertContainer.showErrorAlertContainer('Manufacturer must be chosen');
    else if (!checkIfImageExists(generalProductImageInput.value))
        alertContainer.showErrorAlertContainer('Such image URL does not exist');
    else
        fetch(editURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                productName: generalProductInput.value,
                category: categorySelectInput.value,
                manufacturer: manufacturerSelectInput.value,
                imageURL: generalProductImageInput.value,
                description: productDescriptionInput.value
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

function checkIfImageExists(imageURL) {
    let request = new XMLHttpRequest();
    request.open('HEAD', imageURL, false);
    return request.status != 404;
}