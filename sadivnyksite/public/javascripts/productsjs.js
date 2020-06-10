var productsContainer = document.getElementById('products-container');

window.onload = function() {
    let priceSpans = document.getElementsByClassName('price-span');
    let spansValues = [];
    for (let i = 0; i < priceSpans.length; i++)
        if (priceSpans[i].innerText !== '')
            spansValues.push(parseInt(priceSpans[i].innerText));
    let minValue = Math.min(...spansValues) - 1;
    let maxValue = Math.max(...spansValues) + 1;
    $('#priceSlider').ionRangeSlider({
        type: 'double',
        min: minValue,
        max: maxValue,
        prefix: '₴',
        skin: 'modern'
    })
};

function openNav() {
    document.getElementById('sidebar').style.width = '250px';
}

function closeNav() {
    document.getElementById('sidebar').style.width = '0';
}

function filterProducts(filterURL) {
    let url = new URL('http://localhost:3000' + filterURL);
    let params = new URLSearchParams(url.search.slice(1));
    let manufacturersCheckboxes = document.getElementsByClassName('manufacturer-checkbox');
    for (let i = 0; i < manufacturersCheckboxes.length; i++) {
        if (manufacturersCheckboxes[i].checked)
            params.append('manufacturer', manufacturersCheckboxes[i].value);
    }
    let categoryCheckboxes = document.getElementsByClassName('category-checkbox');
    for (let i = 0; i < categoryCheckboxes.length; i++)
        if (categoryCheckboxes[i].checked)
            params.append('category', categoryCheckboxes[i].value);
    let priceSlider = $('#priceSlider').data('ionRangeSlider');
    let fromPrice = priceSlider.result.from;
    let toPrice = priceSlider.result.to;
    params.append('productName', document.getElementById('productName').innerText);
    params.append('fromPrice', fromPrice);
    params.append('toPrice', toPrice);
    url.search = new URLSearchParams(params).toString();
    fetch(url.toString(), {
        method: 'GET'
    }).then(function (response) {
        response.json().then(jsonObjects => {
            if (jsonObjects.length === 0)
                productsContainer.innerHTML = `<div class="my-5 no-products-container">
                                                    Нічого не знайдено за запитом "${document.getElementById('productName').innerText}"
                                                </div>`;
            else {
                let chunkSize = 4;
                let generalProductsChunks = [];
                let productsHtml = '';
                for (let i = 0; i < jsonObjects.length; i+=chunkSize) {
                    generalProductsChunks.push(jsonObjects.slice(i, i + chunkSize));
                }
                generalProductsChunks.forEach(generalProductChunk => {
                    productsHtml += `<div class="row display-flex">`;
                    generalProductChunk.forEach(generalProduct => {
                        productsHtml += `<a href="/product/${generalProduct.General_Product_ID}" class="thumbnail-link">
<div class="col-sm-6 col-md-3 shadow thumbnail-helper my-2">
            <div class="img-thumbnail mx-2">
                <div class="text-center">
                    <img src="${generalProduct.General_Product_Image_Path}" alt="Зображення товару" class="img-responsive">
                </div>
                <div class="caption py-3 px-5">
                    <h5>${generalProduct.Product_Name}</h5>
                    <div>&#8372; ${generalProduct.minimumPrice}</div>
                    <a href="/product/${generalProduct.General_Product_ID}" class="btn default-button" role="button">Детальніше</a>
                </div>
            </div>
        </div>
</a>`;
                    });
                    productsHtml += `</div>`
                });
                productsContainer.innerHTML = productsHtml;
            }
        })
    })
}