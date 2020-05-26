const {sequelize, Sequelize} = require('../sequelize');
const passwordEncryption = require('../../config/passwordencryption');

const adminFile = require('./admin');

const admin = adminFile(Sequelize, sequelize);

Sequelize.sync().then(() =>
    console.log('Admin database synced')
);


/*admin.create({
   Login: 'admin',
   Password:  'mypassword123'
}).then(res => {
    console.log('Admin created');
    console.log(res);
}).catch(err => console.log(err));*/
