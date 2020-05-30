const { sequelize, Sequelize } = require('../../models/sequelize');

const Admin = require('../../models/admin/admin')(Sequelize, sequelize);
const Category = require('../../models/product/category')(Sequelize, sequelize);
const Manufacturer = require('../../models/product/manufacturer')(Sequelize, sequelize);
const GeneralProduct = require('../../models/product/generalproduct')(Sequelize, sequelize);
const SubProduct = require('../../models/product/subproduct')(Sequelize, sequelize);

exports.deleteAdmin = function (request, response, adminId) {
    Admin.destroy({where: {Admin_ID: adminId}}). then(result => {
        if (result)
            response.send('Record deleted');
        else
            response.send('Deletion failed');
    }).catch(err => {
        console.log(err);
        response.send('Deletion failed');
    })
};

exports.deleteCategory = function (request, response, categoryId) {
    Category.destroy({where: {Category_ID: categoryId}}). then(result => {
        if (result)
            response.send('Record deleted');
        else
            response.send('Deletion failed');
    }).catch(err => {
        console.log(err);
        response.send('Deletion failed');
    })
};

exports.deleteManufacturer = function (request, response, manufacturerId) {
    Manufacturer.destroy({where: {Manufacturer_ID: manufacturerId}}). then(result => {
        if (result)
            response.send('Record deleted');
        else
            response.send('Deletion failed');
    }).catch(err => {
        console.log(err);
        response.send('Deletion failed');
    })
};

exports.deleteGeneralProduct = function(request, response, generalProductId) {
    GeneralProduct.destroy({where: {General_Product_ID: generalProductId}}).then(result => {
        if (result)
            response.send('Record deleted');
        else
            response.send('Deletion failed');
    }).catch(err => {
        console.log(err);
        response.send('Deletion failed');
    })
};

exports.deleteSubProduct = function(request, response, subProductId) {
  SubProduct.destroy({where: {Sub_Product_ID: subProductId}}).then(result => {
      if (result)
        response.send('Record deleted');
      else
        response.send('Deletion failed');
  }).catch(err => {
      console.log(err);
      response.send('Deletion failed');
  })
};