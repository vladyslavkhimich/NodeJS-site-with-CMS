var manufacturerInput = document.getElementById('manufacturerInput');
var manufacturerLogoInput = document.getElementById('manufacturerLogoInput');
var alertContainer = new AlertContainer('alertContainer');
alertContainer.makeAlertContainerInvisible();

function editManufacturer(editURL) {
    if (manufacturerInput.value.length === 0 || manufacturerLogoInput.value.length === 0)
        alertContainer.showErrorAlertContainer('Fields must not be empty');
    else if (!checkIfImageExists(manufacturerLogoInput.value))
        alertContainer.showErrorAlertContainer('Manufacturer logo image does not exist');
    else
        fetch(editURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                manufacturerName: manufacturerInput.value,
                manufacturerLogo: manufacturerLogoInput.value
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