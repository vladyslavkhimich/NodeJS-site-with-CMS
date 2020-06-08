const { sequelize, Sequelize } = require('../../models/sequelize');

const User = require('../../models/user/user')(Sequelize, sequelize);

exports.tryToRegisterUser = function (request, response) {
    let email = request.body.email;
    let name = request.body.name;
    let password = request.body.password;
    User.findOne({where: {Email: email}}).then(user => {
        if (user)
            response.end('Email exists');
        else
            User.create({
                Email: email,
                Name: name,
                Password: password
            }).then(res => {
                response.end('Record created');
            }).catch (err => {
                console.log(err);
                response.end('Creation failed');
            })
    })
};
