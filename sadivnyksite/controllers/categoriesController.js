const { sequelize, Sequelize } = require('../models/sequelize');
const { Op } = require('sequelize');

const Category = require('../models/product/category')(Sequelize, sequelize);
const Manufacturer = require('../models/product/manufacturer')(Sequelize, sequelize);
const GeneralProduct = require('../models/product/generalproduct')(Sequelize, sequelize);
const SubProduct = require('../models/product/subproduct')(Sequelize, sequelize);

exports.returnCategoryProductsPage = function(request, response, categoryId) {
    let categoryName;
    let manufacturers = [];
    Category.findByPk(categoryId).then(category => {
        categoryName = category.Category_Name;
        GeneralProduct.findAll({where: {Category_ID_FK: categoryId}}).then(generalProducts => {
            if (generalProducts.length > 0) {
                let counter = 0;
                for (let i = 0; i < generalProducts.length; i++) {
                    Manufacturer.findOne({where: {Manufacturer_ID: generalProducts[i].Manufacturer_ID_FK}}).then(databaseManufacturer => {
                        if (!manufacturers.some(manufacturer => manufacturer.Manufacturer_ID === databaseManufacturer.Manufacturer_ID))
                            manufacturers.push(databaseManufacturer);
                        SubProduct.findAll({where: {General_Product_ID_FK: generalProducts[i].General_Product_ID}}).then(subProducts => {
                                let min = subProducts[0].Price;
                                for (let j = 0; j < subProducts.length; j++) {
                                    if (subProducts[j].Price < min)
                                        min = subProducts[j].Price;
                                }
                                generalProducts[i].setDataValue('minimumPrice', min);
                                generalProducts[i] = generalProducts[i].get({plain:true});
                                counter++;
                                if (counter === generalProducts.length) {
                                    let generalProductChunks = [];
                                    let chunkSize = 4;
                                    for (let i = 0; i < generalProducts.length; i += chunkSize) {
                                        generalProductChunks.push(generalProducts.slice(i, i + chunkSize));
                                    }
                                        response.render('categoryproducts', {
                                            title: 'Садівник - Товари',
                                            categoryName: categoryName,
                                            products: generalProductChunks,
                                            manufacturers: manufacturers,
                                            filterURL: '/categories/' + categoryId + '/filter',
                                            scripts: [{script: '/javascripts/categoryproductsjs.js'}],
                                            csrfToken: request.csrfToken()
                                        });
                            }
                        });
                    });
                }
            }
            else {
                    response.render('categoryproducts', {
                        title: 'Садівник - Товари',
                        categoryName: categoryName,
                        manufacturers: manufacturers,
                        filterURL: '/categories/' + categoryId + '/filter',
                        scripts: [{script: '/javascripts/categoryproductsjs.js'}],
                        csrfToken: request.csrfToken
                    })
            }

        })
    })
};

exports.returnFilteredProducts = function (request, response, categoryId) {
    let manufacturer = request.query.manufacturer;
    let options = {where: {}};
    if (manufacturer)
        options.where.Manufacturer_ID_FK = manufacturer;
    options.where.Category_ID_FK = categoryId;
    let fromPrice = parseFloat(request.query.fromPrice);
    let toPrice = parseFloat(request.query.toPrice);
    GeneralProduct.findAll(options).then(generalProducts => {
        let counter = 0;
        generalProducts.forEach(generalProduct => {
            SubProduct.findAll({where: {General_Product_ID_FK: generalProduct.General_Product_ID, Price: {[Op.between]: [fromPrice, toPrice]}}}).then(subProducts => {
                if (subProducts.length !== 0) {
                    let min = subProducts[0].Price;
                    for (let i = 0; i < subProducts.length; i++) {
                        if (subProducts[i].Price < min)
                            min = subProducts[i].Price;
                    }
                    generalProduct.setDataValue('minimumPrice', min);
                    generalProduct = generalProduct.get({plain: true});
                    counter++;
                }
                else {
                    let index = generalProducts.indexOf(generalProduct);
                    generalProducts.splice(index, 1);
                }
                if (counter === generalProducts.length)
                    response.send(JSON.stringify(generalProducts));
            })
        });
    });
};