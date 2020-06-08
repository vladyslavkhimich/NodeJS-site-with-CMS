const { sequelize, Sequelize } = require('../models/sequelize');
const { Op } = require('sequelize');

const Category = require('../models/product/category')(Sequelize, sequelize);
const Manufacturer = require('../models/product/manufacturer')(Sequelize, sequelize);
const GeneralProduct = require('../models/product/generalproduct')(Sequelize, sequelize);
const SubProduct = require('../models/product/subproduct')(Sequelize, sequelize);

exports.returnProductsByName = function (request, response) {
    let productName = request.query.searchText;
    let manufacturers = [];
    let filteredCategories = [];
    GeneralProduct.findAll({where: {Product_Name: {[Op.like]: '%' + productName + '%'}}}).then(generalProducts => {
        if (generalProducts.length > 0) {
            let counter = 0;
            for (let i = 0; i < generalProducts.length; i++) {
                Manufacturer.findOne({where: {Manufacturer_ID: generalProducts[i].Manufacturer_ID_FK}}).then(databaseManufacturer => {
                    if (!manufacturers.some(manufacturer => manufacturer.Manufacturer_ID === databaseManufacturer.Manufacturer_ID))
                        manufacturers.push(databaseManufacturer);
                    Category.findOne({where: {Category_ID: generalProducts[i].Category_ID_FK}}).then (databaseCategory => {
                        if (!filteredCategories.some(category => category.Manufacturer_ID === databaseCategory.Manufacturer_ID))
                            filteredCategories.push(databaseCategory);
                        SubProduct.findAll({where: {General_Product_ID_FK: generalProducts[i].General_Product_ID}}).then(subProducts => {
                                let min = subProducts[0].Price;
                                for (let i = 0; i < subProducts.length; i++) {
                                    if (subProducts[i].Price < min)
                                        min = subProducts[i].Price;
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
                                    response.render('products', {
                                        title: 'Садівник - Пошук за назвою "' + productName + '"',
                                        productName: productName,
                                        products: generalProductChunks,
                                        filteredCategories: filteredCategories,
                                        manufacturers: manufacturers,
                                        isHaveRecords: true,
                                        filterURL: '/products/filter',
                                        scripts: [{script: '/javascripts/productsjs.js'}],
                                        csrfToken: request.csrfToken
                                    })
                            }
                        });
                    });
                });
            }
        }
        else {
                response.render('products', {
                    title: 'Садівник - Пошук за назвою "' + productName + '"',
                    productName: productName,
                    isHaveRecords: false,
                    filterURL: '/products/filter',
                    scripts: [{script: '/javascripts/productsjs.js'}],
                    csrfToken: request.csrfToken
                })
        }
    })
};

exports.returnFilteredProducts = function (request, response) {
    let category = request.query.category;
    let manufacturer = request.query.manufacturer;
    let productName = request.query.productName;
    let options = {where: {}};
    options.where.Product_Name = {[Op.like]: '%' + productName + '%'};
    if (category)
        options.where.Category_ID_FK = category;
    if (manufacturer)
        options.where.Manufacturer_ID_FK = manufacturer;
    GeneralProduct.findAll(options).then(generalProducts => {
        if (generalProducts.length > 0) {
        let counter = 0;
        generalProducts.forEach(generalProduct => {
            SubProduct.findAll({where: {General_Product_ID_FK: generalProduct.General_Product_ID, Price: {[Op.between]: [request.query.fromPrice, request.query.toPrice]}}}).then(subProducts => {
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
        }
        else
            response.send();
    });
};