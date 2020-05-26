var fs = require('fs');
var Handlebars = require('handlebars');

const tableLink = require('../../models/helpers/tablelink');
const numberOfRecordsOnPage = 10;

var tables = [];
var pagesNumbers = [];
var adminsEntities = [];
var categoryEntities = [];
var manufacturerEntities = [];

var adminEntitiesCount = 0;
var categoryEntitiesCount = 0;
var manufacturerEntitiesCount = 0;

const scripts = [{script: '/javascripts/adminpaneljs.js'}];
const mainScripts = [{script: '/javascripts/mainadminpaneljs.js'}];

var currentPageIndex = 0;

const { sequelize, Sequelize } = require('../../models/sequelize');

const Admin = require('../../models/admin/admin')(Sequelize, sequelize);
const Category = require('../../models/product/category')(Sequelize, sequelize);
const Manufacturer = require('../../models/product/manufacturer')(Sequelize, sequelize);

setTablesLinks();
exports.returnAdminPanel = function(request, response) {
  response.render('admin/adminpanel', {
        title: 'Admin panel',
        layout: 'adminlayout',
        tables: tables,
        isRightSideOfPanelVisible: 'false',
        scripts: mainScripts
    })
};

exports.returnAdminPanelAdminEntities = function(request, response, newPageNumber) {
    getAdminEntitiesFromDatabase();
    getAdminRecordsCount();
    currentPageIndex = newPageNumber - 1;
    response.render('admin/adminpanel', {
        title: 'Admin panel - Admins',
        layout: 'adminlayout',
        tables: tables,
        tableName: 'Admins',
        tableNameForLink: 'admin',
        totalRecords: adminEntitiesCount,
        object: adminsEntities[0],
        entities: adminsEntities,
        numberOfPages: calculateNumberOfPagesForPanel(adminEntitiesCount),
        maxPage: pagesNumbers[pagesNumbers.length - 1],
        isRightSideOfPanelVisible: 'true',
        scripts: scripts
    })
};

exports.returnAdminPanelCategoryEntities = function(request, response, newPageNumber) {
    getCategoryEntitiesFromDatabase();
    getCategoryRecordsCount();
    currentPageIndex = newPageNumber - 1;
    response.render('admin/adminpanel', {
        title: 'Admin panel - Category',
        layout: 'adminlayout',
        tables: tables,
        tableName: 'Categories',
        tableNameForLink: 'category',
        totalRecords: categoryEntitiesCount,
        object: categoryEntities[0],
        entities: categoryEntities,
        numberOfPages: calculateNumberOfPagesForPanel(categoryEntitiesCount),
        maxPage: pagesNumbers[pagesNumbers.length - 1],
        isRightSideOfPanelVisible: 'true',
        scripts: scripts
    })
};

exports.returnAdminPanelManufacturerEntities = function(request, response, newPageNumber) {
    getManufacturerEntitiesFromDatabase();
    getManufacturerRecordsCount();
    currentPageIndex = newPageNumber - 1;
    response.render('admin/adminpanel', {
        title: 'Admin panel - Manufacturer',
        layout: 'adminlayout',
        tables: tables,
        tableName: 'Manufacturers',
        tableNameForLink: 'manufacturer',
        totalRecords: manufacturerEntitiesCount,
        object: manufacturerEntities[0],
        entities: manufacturerEntities,
        numberOfPages: calculateNumberOfPagesForPanel(manufacturerEntitiesCount),
        maxPage: pagesNumbers[pagesNumbers.length - 1],
        isRightSideOfPanelVisible: 'true',
        scripts: scripts
    })
};

function setTablesLinks() {
    tables.push(new tableLink('admin', 'Admin'));
    tables.push(new tableLink('category', 'Category'));
    tables.push(new tableLink('manufacturer', 'Manufacturer'));
}

function getAdminEntitiesFromDatabase() {
    Admin.findAll({raw: true, attributes: {exclude: ['Password']}, offset: currentPageIndex * numberOfRecordsOnPage, limit: numberOfRecordsOnPage}).then(admins => {
        adminsEntities = admins;
    }).catch(err => console.log(err));
}

function getAdminRecordsCount() {
     Admin.count().then(recordsCount => {
         adminEntitiesCount = recordsCount;
     });
}

function getCategoryEntitiesFromDatabase() {
    Category.findAll({raw: true, offset: currentPageIndex * numberOfRecordsOnPage, limit: numberOfRecordsOnPage}).then(categories => {
        categoryEntities = categories
    }).catch(err => console.log(err));
}

function getCategoryRecordsCount() {
    Category.count().then(recordsCount => {
            categoryEntitiesCount = recordsCount;
        }
    )
}

function getManufacturerEntitiesFromDatabase() {
    Manufacturer.findAll({raw: true, offset: currentPageIndex * numberOfRecordsOnPage, limit: numberOfRecordsOnPage}).then(manufacturers => {
        manufacturerEntities = manufacturers
    }).catch(err => console.log(err));
}

function getManufacturerRecordsCount() {
    Manufacturer.count().then(recordsCount => {
            manufacturerEntitiesCount = recordsCount;
        }
    )
}

function calculateNumberOfPagesForPanel(numberOfRecords) {
    createNewPagingArray(numberOfRecords);
    if (currentPageIndex < 5)
        return pagesNumbers.slice(0, numberOfRecordsOnPage);
    return pagesNumbers.slice(currentPageIndex - 5, currentPageIndex + 4);
}

function createNewPagingArray(numberOfRecords) {
    let totalNumberOfPages = calculateNumberOfPages(numberOfRecords);
    pagesNumbers = [];
    for (let i = 1; i <= totalNumberOfPages; i++)  {
        pagesNumbers.push(i);
    }
}

function calculateNumberOfPages(numberOfRecords) {
    return Math.ceil(numberOfRecords / numberOfRecordsOnPage);
}

exports.returnAdminCreationPage = function(request, response, messages) {
    let creationPageHtml = getHtmlFromFile('views/admin/create/admincreate.hbs');
    creationPageHtml.replace('{test}', `<span>testValue</span>`);
    response.render('admin/adminpanel', {
        title: 'Admin panel',
        layout: 'adminlayout',
        tables: tables,
        isRightSideOfPanelVisible: 'true',
        scripts: mainScripts,
        isCreation: true,
        creationFormHbs: creationPageHtml,
        test: 'test'
    })
};

function getHtmlFromFile(filePath) {
    let fileHtml = fs.readFileSync(filePath, function(err, data) {
        if (!err) {
        }
        else {
            console.log(err);
        }
    });
    let source = fileHtml.toString();
    let template = Handlebars.compile(source);
    let outputString = template(fileHtml);
    return outputString;
}