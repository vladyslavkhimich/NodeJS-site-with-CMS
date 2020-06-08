const scripts = [{script: '/javascripts/contactsjs.js'}];
const { sequelize, Sequelize } = require('../models/sequelize');
const Category = require('../models/product/category')(Sequelize, sequelize);

exports.returnContactsPage = function(request, response) {
        response.render('contacts', {
            title: 'Контакти',
            scripts: scripts,
            csrfToken: request.csrfToken()
        });
};