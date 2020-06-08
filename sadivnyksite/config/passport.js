function UserInfo(userId, userType) {
    this.userId = userId;
    this.userType = userType;
}

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { sequelize, Sequelize } = require('../models/sequelize');
const Admin = require('../models/admin/admin')(Sequelize, sequelize);
const User = require('../models/user/user')(Sequelize, sequelize);

passport.serializeUser(function(someUser, done) {
    let userType = 'user';
    let userId;
    let userPrototype = Object.getPrototypeOf(someUser);
    if (userPrototype === Admin.prototype) {
        userType = 'admin';
        userId = someUser.Admin_ID;
    }
    else if (userPrototype === User.prototype) {
        userType = 'user';
        userId = someUser.User_ID;
    }
    let userInfo = new UserInfo(userId, userType);
   done(null, userInfo);
});

passport.deserializeUser(function (UserInfo, done) {
    if (UserInfo.userType === 'admin') {
        Admin.findByPk(UserInfo.userId).then(admin => {
        if (admin)
            done(null, admin);
    })
    }
    else if (UserInfo.userType === 'user') {
        User.findByPk(UserInfo.userId).then(user => {
            if (user)
                done(null, user);
        })
    }
});

passport.use('local.admin', new LocalStrategy({
    usernameField: 'Login',
    passwordField: 'Password',
    passReqToCallback: true
}, function(req, Login, Password, done) {
    req.usedStrategy = 'local.admin';
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

passport.use('local.user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.usedStrategy = 'local.user';
    User.findOne({where: {Email: email}}).then(user => {
        if (!user)
            return done(null, false, {message: 'No such email'});
        if (!user.validatePassword(password)) {
            console.log('User password does not match');
            return done(null, false, {message: 'Password doesn\'t match'});
        }
        else
            return done(null, user);
    });
}));