const express = require('express');

const adminCreateController = require('../../controllers/admin/admincreatecontroller');
const adminPanelController = require('../../controllers/admin/adminpanelcontroller');

const createRouter = express.Router();

// Creation of admin with Fetch
createRouter.post('/admin/submit', adminCreateController.createNewAdmin);
createRouter.post('/category/submit', adminCreateController.createNewCategory);
createRouter.post('/manufacturer/submit', adminCreateController.createNewManufacturer);
createRouter.post('/generalproduct/submit', adminCreateController.createNewGeneralProduct);
createRouter.post('/subproduct/submit', adminCreateController.createNewSubProduct);

createRouter.use('/:table', function(request, response) {
    let tableName = request.params.table;
    if(tableName === 'admin')
        adminPanelController.returnAdminCreationPage(request, response);
    else if (tableName === 'category')
        adminPanelController.returnCategoryCreationPage(request, response);
    else if (tableName === 'manufacturer')
        adminPanelController.returnManufacturerCreationPage(request, response);
    else if (tableName === 'generalproduct')
        adminPanelController.returnGeneralProductCreationPage(request, response);
    else if(tableName === 'subproduct')
        adminPanelController.returnSubProductCreationPage(request, response);
});

module.exports = createRouter;