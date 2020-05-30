const express = require('express');

const adminPanelController = require('../../controllers/admin/adminpanelcontroller');
const editController = require('../../controllers/admin/admineditcontroller');

const editRouter = express.Router();

editRouter.post('/:table/:id/submit', function(request, response) {
    let tableName = request.params.table;
    let recordId = request.params.id;
    if (tableName === 'admin')
        editController.editAdmin(request, response, recordId);
    else if (tableName === 'category')
        editController.editCategory(request, response, recordId);
    else if (tableName === 'manufacturer')
        editController.editManufacturer(request, response, recordId);
    else if (tableName === 'generalproduct')
        editController.editGeneralProduct(request, response, recordId);
    else if (tableName === 'subproduct')
        editController.editSubProduct(request, response, recordId);
});

editRouter.use('/:table/:id', function(request, response) {
   let tableName = request.params.table;
   let recordId = request.params.id;
   if (tableName === 'admin')
       adminPanelController.returnAdminEditingPage(request, response, recordId);
   else if (tableName === 'category')
       adminPanelController.returnCategoryEditingPage(request, response, recordId);
   else if (tableName === 'manufacturer')
       adminPanelController.returnManufacturerEditingPage(request, response, recordId);
   else if (tableName === 'generalproduct')
       adminPanelController.returnGeneralProductEditingPage(request, response, recordId);
   else if (tableName === 'subproduct')
       adminPanelController.returnSubProductEditingPage(request, response, recordId);
});


module.exports = editRouter;