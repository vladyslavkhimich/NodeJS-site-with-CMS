const tableContentContainer = document.getElementById('table-content-container');
const isRightSideOfPanelVisibleSpan = document.getElementById('is-visible-span');

if (isRightSideOfPanelVisibleSpan.innerText === 'false')
    tableContentContainer.classList.add('invisible');
else
    tableContentContainer.classList.add('visible');