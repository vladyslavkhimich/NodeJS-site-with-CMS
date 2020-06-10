const { sequelize, Sequelize } = require('../models/sequelize');

const Manufacturer = require('../models/product/manufacturer')(Sequelize, sequelize);
const GeneralProduct = require('../models/product/generalproduct')(Sequelize, sequelize);
const SubProduct = require('../models/product/subproduct')(Sequelize, sequelize);


exports.returnProductPage = function (request, response, productId) {
    let product;
    let subProducts;
    let productManufacturer;
    GeneralProduct.findByPk(productId).then(generalProduct => {
        product = generalProduct;
        Manufacturer.findByPk(generalProduct.Manufacturer_ID_FK).then(manufacturer => {
            productManufacturer = manufacturer;
            SubProduct.findAll({where: {General_Product_ID_FK: product.General_Product_ID}}).then(subProductsFromDatabase => {
                subProducts = subProductsFromDatabase;
                    response.render('product', {
                        title: 'Садівник - ' + product.Product_Name,
                        product: product,
                        manufacturer: productManufacturer,
                        subProducts: subProducts,
                        csrfToken: request.csrfToken(),
                        scripts: [{script: '/javascripts/productjs.js'}]
                    })
            })
        })

    })
};