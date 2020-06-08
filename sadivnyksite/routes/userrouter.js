const express = require('express');
const passport = require('passport');
const csrf = require('csurf');

var csrfProtection = new csrf();

const { sequelize, Sequelize } = require('../models/sequelize');
const signUpController = require('../controllers/user/signupcontroller');
const profileController = require('../controllers/user/profilecontroller');
const User = require('../models/user/user')(Sequelize, sequelize);

const userRouter = express.Router();
userRouter.use(csrfProtection);

userRouter.get('/profile', isLoggedIn, profileController.returnProfilePage);
userRouter.post('/profile/personaldata', function(request, response) {
   profileController.changePersonalData(request, response, request.user.User_ID);
});
userRouter.post('/profile/contactsdata', function(request, response) {
    profileController.changeContactsData(request, response, request.user.User_ID);
});
userRouter.post('/profile/passworddata', function(request, response) {
    profileController.changePasswordData(request, response, request.user.User_ID);
});
userRouter.post('/signin', passport.authenticate('local.user', {
    failureRedirect: '/'
}),  function (request, response) {
    if (request.session.orderUrl) {
        let orderUrl = request.session.orderUrl;
        request.session.orderUrl = null;
        request.session.save();
        response.redirect(orderUrl);
    }
    else
        response.redirect('user/profile');
});
userRouter.get('/logout', isLoggedIn, function (request, response) {
    request.logout();
    response.redirect('/');
});
userRouter.use('/', isNotLoggedIn, function (request, response, next) {
   next();
});
userRouter.post('/signup/submit', signUpController.tryToRegisterUser);

function isLoggedIn(request, response, next) {
    if (request.user) {
        let isUser = 'User_ID' in request.user;
        if (request.isAuthenticated() && isUser) {
            return next();
        }
    }
    response.redirect('/');
}

function isNotLoggedIn(request, response, next) {
    if (!request.isAuthenticated()) {
        return next();
    }
    response.redirect('/');
}

module.exports = userRouter;