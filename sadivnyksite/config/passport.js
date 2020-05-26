const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { sequelize, Sequelize } = require('../models/sequelize');
const Admin = require('../models/admin/admin')(Sequelize, sequelize);
const bcrypt = require('./passwordencryption');

passport.serializeUser(function(admin, done) {
   done(null, admin.Admin_ID)
});

passport.deserializeUser(function (Admin_ID, done) {
    Admin.findByPk(Admin_ID).then(admin => {
        if (admin)
            done(null, admin);
    })
});

passport.use('local.admin', new LocalStrategy({
    usernameField: 'Login',
    passwordField: 'Password',
    passReqToCallback: true
}, function(req, Login, Password, done) {
    Admin.findOne({where: {Login: Login}}).then(admin => {
        if (!admin)
            return done(null, false, {message: 'No such login'});
        if (!admin.validatePassword(Password)) {
            console.log('Password doesn\'t match');
            return  done(null, false, {message: 'Password doesn\'t match'});
        }
        else
            return done(null, admin);
    })
}));

passport.use('local.admin.create', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
}, function(request, login, password, done){
    Admin.findOne({where: {Login: login}}).then(admin => {
        if (admin)
            return done(null, false, {message: 'Login already exists'});
        else if (password.length < 8)
            return done(null, false, {message: 'Password must be at least 8 characters'});
        else if (login.length < 5)
            return done(null, false, {message: 'Login must be at least 5 characters'});
        Admin.create({
                Login: login,
                Password: password
            }
        ).then(res => {
            done(null, res)
        }).catch(err => {
                console.log(err);
                done(err);
            }
        )
    })
}));