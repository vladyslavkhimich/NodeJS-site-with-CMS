const {sequelize, Sequelize} = require('../sequelize');

// models
const categoryFile = require('./category');
const manufacturerFile = require('./manufacturer');
const generalProductFile = require('./generalproduct');
const subProductFile = require('./subproduct');

// models instances
const category = categoryFile(Sequelize, sequelize);
const manufacturer = manufacturerFile(Sequelize, sequelize);
const generalProduct = generalProductFile(Sequelize, sequelize);
const subProduct = subProductFile(Sequelize, sequelize);

// relationships
category.hasMany(generalProduct);
manufacturer.hasMany(generalProduct);
generalProduct.hasMany(subProduct);

// creation of tables if not exist
Sequelize.sync().then(() => {
   console.log('Database and tables created!')
});