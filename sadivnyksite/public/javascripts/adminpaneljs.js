const previousPaginationLink = document.getElementById('previous-pagination-link');
const previousPaginationLinkContainer = document.getElementById('previous-pagination-link-container');
const nextPaginationLink = document.getElementById('next-pagination-link');
const nextPaginationLinkContainer = document.getElementById('next-pagination-link-container');
const tableNameSpan = document.getElementById('table-name-for-link-span');
const maxPageSpan = document.getElementById('max-page-span');
const alertContainer = new AlertContainer('alertContainer');
alertContainer.makeAlertContainerInvisible();

if (previousPaginationLink) {
    let currentPageNumber = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
    if (currentPageNumber > 1)
        previousPaginationLink.href = '/admin/panel/resources/' + tableNameSpan.innerText + '/' + currentPageNumber - 1;
    else
        previousPaginationLinkContainer.classList.add('disabled');
}

if(nextPaginationLink) {
    let currentPageNumber = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
    if (currentPageNumber !== parseInt(maxPageSpan.innerText))
        nextPaginationLink.href = '/admin/panel/resources/' + tableNameSpan.innerText;
    else
        nextPaginationLinkContainer.classList.add('disabled');
}

let pageLinks = document.getElementsByClassName('class-for-activation');

if(pageLinks) {
    let currentPageNumber = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
    for (let i = 0; i < pageLinks.length; i++) {
        if (pageLinks[i].innerText == currentPageNumber)
            pageLinks[i].parentElement.classList.add('active');
    }
}

function deleteRecord(deleteURL) {
    let rowIndexToDelete;
    if (event.target.tagName.toLowerCase() === 'a')
        rowIndexToDelete = event.target.parentNode.parentNode.rowIndex;
    else
        rowIndexToDelete = event.target.parentNode.parentNode.parentNode.rowIndex;
    fetch(deleteURL, {
     method: 'GET'
    }).then(function(response) {
        response.text().then(function (text) {
            if (text === 'Deletion failed')
                alertContainer.showErrorAlertContainer('Deletion failed');
            else if (text === 'Record deleted') {

                alertContainer.showSuccessAlertContainer('Record was successfully deleted');
                document.getElementById('displayTable').deleteRow(rowIndexToDelete);
                let totalRecordsCount = parseInt(document.getElementById('total-records-span').innerText);
                document.getElementById('total-records-span').innerText = (totalRecordsCount - 1).toString();
            }
        })
    })
}


