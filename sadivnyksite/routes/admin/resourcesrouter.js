const express = require('express');



//controllers
const adminPanelController = require('../../controllers/admin/adminpanelcontroller');

const resourcesRouter = express.Router();

resourcesRouter.use('/:table/:page', function(request, response) {
    let tableName = request.params.table;
    let pageNumber = request.params.page;
    if (tableName === 'admin')
        adminPanelController.returnAdminPanelAdminEntities(request, response, pageNumber);
    else if (tableName === 'category')
        adminPanelController.returnAdminPanelCategoryEntities(request, response, pageNumber);
    else if (tableName === 'manufacturer')
        adminPanelController.returnAdminPanelManufacturerEntities(request, response, pageNumber);
    else if (tableName === 'generalproduct')
        adminPanelController.returnAdminPanelGeneralProductsEntities(request, response, pageNumber);
    else if (tableName === 'subproduct')
        adminPanelController.returnAdminPanelSubProductEntities(request, response, pageNumber);
});

module.exports = resourcesRouter;