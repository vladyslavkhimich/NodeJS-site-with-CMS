const bcrypt = require('bcrypt-nodejs');

function encryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

function validPassword(passwordToValidate, originalPassword) {
    return bcrypt.compareSync(passwordToValidate, originalPassword);
}

module.exports.encryptPassword = encryptPassword;
module.exports.validPassword = validPassword;