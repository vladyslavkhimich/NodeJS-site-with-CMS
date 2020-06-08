const { sequelize, Sequelize } = require('../models/sequelize');


const Category = require('../models/product/category')(Sequelize, sequelize);
const Manufacturer = require('../models/product/manufacturer')(Sequelize, sequelize);
const GeneralProduct = require('../models/product/generalproduct')(Sequelize, sequelize);
const SubProduct = require('../models/product/subproduct')(Sequelize, sequelize);

exports.returnHomePage = function(request, response) {
    GeneralProduct.findAll({limit: 8, order: [['updatedAt', 'DESC']]}).then(generalProducts => {
        if (generalProducts.length > 0) {
            let counter = 0;
            for (let i = 0; i < generalProducts.length; i++) {
                SubProduct.findAll({where: {General_Product_ID_FK: generalProducts[i].General_Product_ID}}).then(subProducts => {
                    if(subProducts[0]) {
                        let min = subProducts[0].Price;
                        for (let j = 0; j < subProducts.length; j++) {
                            if (subProducts[j].Price < min)
                                min = subProducts[j].Price;
                        }
                        generalProducts[i].setDataValue('minimumPrice', min);
                        generalProducts[i] = generalProducts[i].get({plain: true});
                        counter++;
                    }
                    else {
                        counter++;
                    }
                    if (counter === generalProducts.length) {
                        let generalProductChunks = [];
                        let chunkSize = 4;
                        for (let i = 0; i < generalProducts.length; i += chunkSize) {
                            generalProductChunks.push(generalProducts.slice(i, i + chunkSize));
                        }
                        response.render('home', {
                            title: 'Садівник - головна сторінка',
                            products: generalProductChunks,
                            csrfToken: request.csrfToken()
                        })
                    }
                });
            }
        }
        else {
            response.render('home', {
                title: 'Садівник - головна сторінка',
                csrfToken: request.csrfToken()
            })
        }
    });
};