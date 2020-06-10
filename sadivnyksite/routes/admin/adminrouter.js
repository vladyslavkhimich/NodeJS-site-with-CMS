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

const databaseSequelize = require('../../models/databasesequelize');

const adminRouter = express.Router();
adminRouter.use(csrfProtection);
adminRouter.post('/signin', passport.authenticate('local.admin', {
    successRedirect: '/admin/panel',
    failureRedirect: '/admin'
}, ));

// Right order of paths
adminRouter.get('/panel/*', isAdminLogged);
adminRouter.get('/panel/logout', adminPanelController.logoutAdmin);
adminRouter.use('/panel/create', createRouter);
adminRouter.use('/panel/resources', resourcesRouter);
adminRouter.use('/panel/delete', deleteRouter);
adminRouter.use('/panel/edit', editRouter);
adminRouter.get('/panel', isAdminLogged, adminPanelController.returnAdminPanel);
adminRouter.get('/', adminSignInController.returnAdminSignInPage);

// Order of paths only for developing
/*adminRouter.get('/panel/logout', adminPanelController.logoutAdmin);
adminRouter.use('/panel/create', createRouter);
adminRouter.use('/panel/resources', resourcesRouter);
adminRouter.use('/panel/delete', deleteRouter);
adminRouter.use('/panel/edit', editRouter);
//adminRouter.get('/panel/!*', isAdminLogged);
adminRouter.get('/panel', adminPanelController.returnAdminPanel);
adminRouter.get('/', adminSignInController.returnAdminSignInPage);*/

function isAdminLogged(request, response, next) {
    if (request.user && 'Admin_ID' in request.user)
        next();
    else
        response.sendStatus(403);
}

module.exports = adminRouter;
