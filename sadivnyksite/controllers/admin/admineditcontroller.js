const { sequelize, Sequelize } = require('../../models/sequelize');

const Admin = require('../../models/admin/admin')(Sequelize, sequelize);
const Category = require('../../models/product/category')(Sequelize, sequelize);
const Manufacturer = require('../../models/product/manufacturer')(Sequelize, sequelize);
const GeneralProduct = require('../../models/product/generalproduct')(Sequelize, sequelize);
const SubProduct = require('../../models/product/subproduct')(Sequelize, sequelize);

exports.editAdmin = function(request, response, recordId) {
    let login = request.body.login;
    let oldPassword = request.body.oldPassword;
    if (request.body.isChangePassword) {
    let newPassword = request.body.newPassword;
    Admin.findOne({where: {Admin_ID: recordId}}).then(admin => {
        if (admin) {
            if (!admin.validatePassword(oldPassword))
                response.send('Password mismatched');
            else
                Admin.update({ Login: login, Password: Admin.generatePassword(newPassword)}, {where: {Admin_ID: recordId}}).then(result => {
                    if (result)
                        response.send('Record updated');
                    else
                        response.send('Update failed');
            }).catch(err => {
                console.log(err);
                response.send('Update failed');
                })
        }
        else
            response.send('Update failed');
    })
    }
    else {
        Admin.findOne({where: {Admin_ID: recordId}}).then(admin => {
            if (admin) {
                if (!admin.validatePassword(oldPassword))
                    response.send('Password mismatched');
                else
                    Admin.update({ Login: login}, {where: {Admin_ID: recordId}}).then(result => {
                        if (result)
                            response.send('Record updated');
                        else
                            response.send('Update failed');
                    }).catch(err => {
                        console.log(err);
                        response.send('Update failed');
                    })
            }
            else
                response.send('Update failed')
        }).catch(err => {
            console.log(err);
            response.send('Update failed');
        })
    }
};

exports.editCategory = function(request, response, recordId) {
    Category.findOne({where: {Category_ID: recordId}}).then(category => {
        if (category) {
            Category.update({Category_Name: request.body.categoryName}, {where: {Category_ID: recordId}}).then(result => {
                if (result)
                    response.send('Record updated');
                else
                    response.send('Update failed');
            }).catch(err => {
                console.log(err);
                response.send('Update failed');
            })
        }
        else
            response.send('Update failed');
    }).catch(err => {
        console.log(err);
        response.send('Update failed');
    })
};

exports.editManufacturer = function(request, response, recordId) {
    Manufacturer.findOne({where: {Manufacturer_ID: recordId}}).then(manufacturer => {
        if (manufacturer) {
            Manufacturer.update({Manufacturer_Name: request.body.manufacturerName, Manufacturer_Logo_Path: request.body.manufacturerLogo}, {where: {Manufacturer_ID: recordId}}).then(result => {
                if (result)
                    response.send('Record updated');
                else
                    response.send('Update failed');
            }).catch(err => {
                console.log(err);
                response.send('Update failed');
            })
        }
        else
            response.send('Update failed');
    }).catch(err => {
        console.log(err);
        response.send('Update failed');
    })
};

exports.editGeneralProduct = function(request, response, recordId) {
    let generalProductInstance;
    let categoryId;
    let manufacturerId;
    let categoryName = request.body.category;
    let manufacturerName = request.body.manufacturer;
    let productName = request.body.productName;
    let description = request.body.description;
    let imageURL = request.imageURL;
    GeneralProduct.findOne({where: {General_Product_ID: recordId}}).then(generalProduct => {
        generalProductInstance = generalProduct;
        Category.findOne({where: {Category_Name: categoryName}}).then(category => {
            categoryId = category.Category_ID;
            Manufacturer.findOne({where: {Manufacturer_Name: manufacturerName}}).then(manufacturer => {
                manufacturerId = manufacturer.Manufacturer_ID;
                if (generalProductInstance) {
                    GeneralProduct.update({Product_Name: productName, General_Product_Description: description, General_Product_Image_Path: imageURL, Category_ID_FK: categoryId, Manufacturer_ID_FK: manufacturerId}, {where: {General_Product_ID: recordId}}).then(result => {
                        if (result)
                            response.send('Record updated');
                        else
                            response.send('Update failed');
                    }).catch(err => {
                        console.log(err);
                        response.send('Update failed');
                    })
                }
                else
                    response.send('Update failed');
            })
        })
    })
};

exports.editSubProduct = function (request, response, recordId) {
    let subProductInstance;
    let generalProductId;
    SubProduct.findByPk(recordId).then(subProduct => {
        subProductInstance = subProduct;
        GeneralProduct.findOne({where: {Product_Name: request.body.generalProduct}}).then(generalProduct => {
            generalProductId = generalProduct.General_Product_ID;
            if(subProductInstance) {
                SubProduct.update({Sub_Product_Description: request.body.description, Sub_Product_Code: request.body.code, Price: request.body.price, General_Product_ID_FK: generalProductId}, {where: {Sub_Product_ID: recordId}}).then(result => {
                    if (result)
                        response.send('Record updated');
                    else
                        response.send('Update failed');
                }).catch(err => {
                    console.log(err);
                    response.send('Update failed');
                })
            }
            else
                response.send('Update failed');
        })
    })
};