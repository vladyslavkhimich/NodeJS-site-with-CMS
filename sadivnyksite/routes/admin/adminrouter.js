const express = require('express');
const passport = require('passport');
const csrf = require('csurf');

var csrfProtection = new csrf();

//controllers
const adminSignInController = require('../../controllers/admin/adminsignincontroller.js');
const adminPanelController = require('../../controllers/admin/adminpanelcontroller');

//routers
const resourcesRouter = require('./resourcesrouter');
const createRouter = require('./createRouter');

const productSequelize = require('../../models/product/productsequelize');
const admin = require('../../models/admin/adminsequelize');

const adminRouter = express.Router();
adminRouter.use(csrfProtection);
adminRouter.post('/signin', passport.authenticate('local.admin', {
    successRedirect: '/admin/panel',
    failureRedirect: '/admin'
}, ));
/*adminRouter.use('/!*', function(request, response, next) {
    console.log('Panel Middleware');
    if (request.user)
        next();
    else
        response.sendStatus(403);
});*/
adminRouter.use('/panel/create', createRouter);
adminRouter.use('/panel/resources', resourcesRouter);
adminRouter.get('/panel', isAdminLogged, adminPanelController.returnAdminPanel);
adminRouter.get('/', adminSignInController.returnAdminSignInPage);

function isAdminLogged(request, response, next) {
    if (request.user)
        next();
    else
        response.sendStatus(403);
}

module.exports = adminRouter;
