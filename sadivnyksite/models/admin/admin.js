const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    let Admin = sequelize.define('Admin', {
        Admin_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Login: DataTypes.STRING,
        Password: DataTypes.STRING
    });
    Admin.beforeCreate((admin, options) => {
        admin.Password = this.generatePassword(admin.Password);
    });
    Admin.generatePassword = function(password) {
        return  bcrypt.hashSync(password, bcrypt.genSaltSync(5), null, function (err, hash) {
            console.log('Password creation process was done')
        });
    };
    Admin.prototype.validatePassword = function(password) {
        return  bcrypt.compareSync(password, this.Password);
    };
    return Admin;
};