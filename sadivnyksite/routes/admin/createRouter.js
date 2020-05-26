const express = require('express');
const passport = require('passport');

const adminPanelController = require('../../controllers/admin/adminpanelcontroller');

const createRouter = express.Router();

createRouter.use('/admin/submit', passport.authenticate('local.admin.create',
    {
        successRedirect: '/admin/panel/create/admin',
        failureRedirect: '/admin/panel/create/admin',
        failureFlash: true
    }
    ));
createRouter.use('/:table', function(request, response) {
    let tableName = request.params.table;
    let messages = request.flash('error');
    if(tableName === 'admin')
        adminPanelController.returnAdminCreationPage(request, response, messages);
});

module.exports = createRouter;