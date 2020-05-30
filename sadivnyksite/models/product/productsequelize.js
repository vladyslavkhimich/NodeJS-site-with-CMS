const {sequelize, Sequelize} = require('../sequelize');

// models
const categoryFile = require('./category');
const manufacturerFile = require('./manufacturer');
const generalProductFile = require('./generalproduct');
const subProductFile = require('./subproduct');
const adminFile = require('../admin/admin');

// models instances
const category = categoryFile(Sequelize, sequelize);
const manufacturer = manufacturerFile(Sequelize, sequelize);
const generalProduct = generalProductFile(Sequelize, sequelize);
const subProduct = subProductFile(Sequelize, sequelize);
const admin = adminFile(Sequelize, sequelize);

// relationships
manufacturer.hasMany(generalProduct, {foreignKey: 'Manufacturer_ID_FK', onDelete: 'set null'});
generalProduct.belongsTo(manufacturer, {foreignKey: 'Manufacturer_ID_FK', as: 'Manufacturers'});
category.hasMany(generalProduct, {foreignKey: 'Category_ID_FK', onDelete: 'set null'});
generalProduct.belongsTo(category, {foreignKey: 'Category_ID_FK', as: 'Categories'});
generalProduct.hasMany(subProduct, {foreignKey: 'General_Product_ID_FK', sourceKey: 'General_Product_ID', onDelete: 'cascade'});
subProduct.belongsTo(generalProduct, {foreignKey: 'General_Product_ID_FK', targetKey: 'General_Product_ID'});

/*admin.create({
   Login: 'admin',
   Password:  'mypassword123'
}).then(res => {
    console.log('Admin created');
    console.log(res);
}).catch(err => console.log(err));*/

// creation of tables if not exist
Sequelize.sync().then(() => {
   console.log('Database and tables created!')
});