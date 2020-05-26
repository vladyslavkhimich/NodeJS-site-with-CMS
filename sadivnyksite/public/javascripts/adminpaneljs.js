const previousPaginationLink = document.getElementById('previous-pagination-link');
const previousPaginationLinkContainer = document.getElementById('previous-pagination-link-container');
const nextPaginationLink = document.getElementById('next-pagination-link');
const nextPaginationLinkContainer = document.getElementById('next-pagination-link-container');
const tableNameSpan = document.getElementById('table-name-for-link-span');
const maxPageSpan = document.getElementById('max-page-span');

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


