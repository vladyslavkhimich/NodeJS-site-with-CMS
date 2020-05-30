var manufacturerInput = document.getElementById('manufacturerInput');
var manufacturerLogoInput = document.getElementById('manufacturerLogoInput');
var alertContainer = new AlertContainer('alertContainer');
var creationURL = 'http://localhost:3000/admin/panel/create/manufacturer/submit';
alertContainer.makeAlertContainerInvisible();

function createNewManufacturer() {
    if(manufacturerInput.value.length === 0 || manufacturerLogoInput.value.length === 0)
        alertContainer.showErrorAlertContainer('Fields must not be empty');
    else if (!checkIfImageExists(manufacturerLogoInput.value))
        alertContainer.showErrorAlertContainer('This image does not exist');
    else
        fetch(creationURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                manufacturerName: manufacturerInput.value,
                manufacturerLogoURL: manufacturerLogoInput.value
            })
        }).then(function (response) {
            response.text().then(function (text) {
                if (text === 'Manufacturer exists')
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

function checkIfImageExists(imageURL) {
    let request = new XMLHttpRequest();
    request.open('HEAD', imageURL, false);
    return request.status != 404;
}

function clearInputFields() {
    manufacturerInput.value = '';
    manufacturerLogoInput.value = '';
}