const express = require('express');

const adminDeleteController = require('../../controllers/admin/admindeletecontroller');

const deleteRouter = express.Router();

deleteRouter.use('/:table/:id', function(request, response) {
    let tableName = request.params.table;
    let recordId = request.params.id;
    if(tableName === 'admin')
        adminDeleteController.deleteAdmin(request, response, recordId);
    else if (tableName === 'category')
        adminDeleteController.deleteCategory(request, response, recordId);
    else if (tableName === 'manufacturer')
        adminDeleteController.deleteManufacturer(request, response, recordId);
    else if (tableName === 'generalproduct')
        adminDeleteController.deleteGeneralProduct(request, response, recordId);
    else if (tableName === 'subproduct')
        adminDeleteController.deleteSubProduct(request, response, recordId);
});

module.exports = deleteRouter;