const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
      User_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      Name: DataTypes.STRING,
      Last_Name: DataTypes.STRING,
      Surname: DataTypes.STRING,
      Email: DataTypes.STRING,
      Sex: DataTypes.BOOLEAN,
      Birth_Date: DataTypes.DATEONLY,
      Mobile_Phone_Number: DataTypes.STRING(9),
      Password: DataTypes.STRING
  });
    User.beforeCreate((user, options) => {
        user.Password = User.generatePassword(user.Password);
    });
    User.generatePassword = function(password) {
        return  bcrypt.hashSync(password, bcrypt.genSaltSync(5), null, function (err, hash) {
            console.log('Password creation process was done')
        });
    };
    User.prototype.validatePassword = function(password) {
        return  bcrypt.compareSync(password, this.Password);
    };
    return User;
};