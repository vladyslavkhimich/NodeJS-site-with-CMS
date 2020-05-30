const { sequelize, Sequelize } = require('../../models/sequelize');

const Admin = require('../../models/admin/admin')(Sequelize, sequelize);
const Category = require('../../models/product/category')(Sequelize, sequelize);
const Manufacturer = require('../../models/product/manufacturer')(Sequelize, sequelize);
const GeneralProduct = require('../../models/product/generalproduct')(Sequelize, sequelize);
const SubProduct = require('../../models/product/subproduct')(Sequelize, sequelize);

exports.createNewAdmin = function(request, response) {
    let login = request.body.login;
    let password = request.body.password;
    Admin.findOne({where: {Login: login}}).then(admin => {
        if (admin)
            response.end('Admin exists');
        else
            Admin.create({
                Login: login,
                Password: password
            }).then(res => {
                response.end('Record created');
            }).catch(err => {
                console.log(err);
                response.end('Creation failed');
            })
    })
};

exports.createNewCategory = function(request, response) {
    let categoryName = request.body.category;
    Category.findOne({where: {Category_Name: categoryName}}).then(category => {
        if (category)
            response.end('Category exists');
        else
            Category.create({
                Category_Name: categoryName
            }).then(res => {
                response.send('Record created');
            }).catch(err => {
                console.log(err);
                response.send('Creation failed');
            })
    })
};

exports.createNewManufacturer = function(request, response) {
    let manufacturerName = request.body.manufacturerName;
    let manufacturerLogoURL = request.body.manufacturerLogoURL;
    Manufacturer.findOne({where: {Manufacturer_Name: manufacturerName}}).then(manufacturer => {
        if (manufacturer)
            response.end('Manufacturer exists');
        else {
            Manufacturer.create({
                Manufacturer_Name: manufacturerName,
                Manufacturer_Logo_Path: manufacturerLogoURL
            }).then(res => {
                response.send('Record created');
            }).catch(err => {
                console.log(err);
                response.send('Creation failed');
            })
        }
    })
};

exports.createNewGeneralProduct = function (request, response) {
    let productName = request.body.productName;
    let category = request.body.category;
    let manufacturer = request.body.manufacturer;
    let imageURL = request.body.imageURL;
    let description = request.body.description;
    let categoryId;
    let manufacturerId;
    Category.findOne({where: {Category_Name: category}}).then(result => {
        categoryId = result.Category_ID;
        Manufacturer.findOne({where: {Manufacturer_Name: manufacturer}}).then(result => {
            manufacturerId = result.Manufacturer_ID;
            GeneralProduct.create({
                Product_Name: productName,
                General_Product_Image_Path: imageURL,
                General_Product_Description: description,
                Category_ID_FK: categoryId,
                Manufacturer_ID_FK: manufacturerId
            }).then(result => {
                response.send('Record created');
            }).catch(err => {
                console.log(err);
                response.send('Creation failed');
            })
        })
    })
};

exports.createNewSubProduct = function(request, response) {
    let generalProductId;
    GeneralProduct.findOne({where: {Product_Name: request.body.generalProduct}}).then(generalProduct => {
        generalProductId = generalProduct.General_Product_ID;
        SubProduct.create({
            General_Product_ID_FK: generalProductId,
            Sub_Product_Code: request.body.code,
            Price: request.body.price,
            Sub_Product_Description: request.body.description
        }).then(result => {
            response.send('Record created');
        }).catch(err => {
            console.log(err);
            response.send('Creation failed');
        })
    })
};