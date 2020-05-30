var categoryInput = document.getElementById('categoryInput');
var alertContainer = new AlertContainer('alertContainer');
alertContainer.makeAlertContainerInvisible();

function editCategory(editURL) {
    if (categoryInput.value.length === 0)
        alertContainer.showErrorAlertContainer('Fields must not be empty');
    else
        fetch(editURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                categoryName: categoryInput.value
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