var categoryInput = document.getElementById('categoryInput');
var alertContainer = new AlertContainer('alertContainer');
var creationURL = 'http://localhost:3000/admin/panel/create/category/submit';
alertContainer.makeAlertContainerInvisible();

function createNewCategory() {
    if (categoryInput.value.length === 0)
        alertContainer.showErrorAlertContainer('Fields must not be empty');
    else {
        fetch(creationURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.getElementById('_csrf').value
            },
            body: JSON.stringify({
                category: categoryInput.value
            })
        }).then(function(response) {
            response.text().then(function (text) {
                if (text === 'Category exists')
                    alertContainer.showErrorAlertContainer('Category with such name already exists');
                else if (text === 'Creation failed')
                    alertContainer.showErrorAlertContainer('Creation process failed');
                else if (text === 'Record created') {
                    alertContainer.showSuccessAlertContainer('Record was successfully created');
                    clearInputFields();
                }
            })
        })
    }
}

function clearInputFields() {
    categoryInput.value = '';
}