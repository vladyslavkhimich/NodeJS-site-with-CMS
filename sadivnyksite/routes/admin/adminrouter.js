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
const deleteRouter = require('./deleteRouter');
const editRouter = require('./editrouter');

const productSequelize = require('../../models/product/productsequelize');

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

// Right order of paths
/*adminRouter.get('/panel/!*', isAdminLogged);
adminRouter.use('/panel/create', createRouter);
adminRouter.use('/panel/resources', resourcesRouter);
adminRouter.use('/panel/delete', deleteRouter);
adminRouter.use('/panel/edit', editRouter);
adminRouter.get('/panel', isAdminLogged, adminPanelController.returnAdminPanel);
adminRouter.get('/', adminSignInController.returnAdminSignInPage);*/

// Order of paths only for developing
adminRouter.use('/panel/create', createRouter);
adminRouter.use('/panel/resources', resourcesRouter);
adminRouter.use('/panel/delete', deleteRouter);
adminRouter.use('/panel/edit', editRouter);
//adminRouter.get('/panel/*', isAdminLogged);
adminRouter.get('/panel', adminPanelController.returnAdminPanel);
adminRouter.get('/', adminSignInController.returnAdminSignInPage);

function isAdminLogged(request, response, next) {
    if (request.user)
        next();
    else
        response.sendStatus(403);
}

module.exports = adminRouter;
