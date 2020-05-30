var productInput = document.getElementById('productInput');
var categorySelectInput = document.getElementById('categorySelectInput');
var manufacturerSelectInput = document.getElementById('manufacturerSelectInput');
var productImageInput = document.getElementById('productImageInput');
var productDescriptionInput = document.getElementById('productDescriptionInput');
var alertContainer = new AlertContainer('alertContainer');
alertContainer.makeAlertContainerInvisible();

var creationURL = 'http://localhost:3000/admin/panel/create/generalproduct/submit';

function createNewGeneralProduct() {
    if (productInput.value.length === 0 || productImageInput.value.length === 0 || productDescriptionInput.value.length === 0)
        alertContainer.showErrorAlertContainer('Fields must not be empty');
    else if (categorySelectInput.value === '')
        alertContainer.showErrorAlertContainer('Category must be selected');
    else if (manufacturerSelectInput.value === '')
        alertContainer.showErrorAlertContainer('Manufacturer must be selected');
    else if (!checkIfImageExists(productImageInput.value))
        alertContainer.showErrorAlertContainer('Such image does not exist');
    else
        fetch(creationURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                productName: productInput.value,
                category: categorySelectInput.value,
                manufacturer: manufacturerSelectInput.value,
                imageURL: productImageInput.value,
                description: productDescriptionInput.value
            })
        }).then(function(response) {
            response.text().then(function(text) {
                if (text === 'Creation failed')
                    alertContainer.showErrorAlertContainer('Creation process failed');
                else if (text === 'Record created') {
                    alertContainer.showSuccessAlertContainer('Record was successfully created');
                    clearInputFields();
                }
            })
            })
}

function checkIfImageExists(imageURL) {
    let request = new XMLHttpRequest();
    request.open('HEAD', imageURL, false);
    return request.status != 404;
}

function clearInputFields() {
    productInput.value = '';
    productImageInput.value = '';
    productDescriptionInput.value = '';
}