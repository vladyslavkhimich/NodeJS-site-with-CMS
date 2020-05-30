var fs = require('fs');
var Handlebars = require('handlebars');
const csrf = require('csurf');

var csrfProtection = new csrf();

const tableLink = require('../../models/helpers/tablelink');
const numberOfRecordsOnPage = 10;

var tables = [];
var pagesNumbers = [];
var adminsEntities = [];
var categoryEntities = [];
var manufacturerEntities = [];
var generalProductsEntities = [];
var subProductsEntities = [];

var adminEntitiesCount = 0;
var categoryEntitiesCount = 0;
var manufacturerEntitiesCount = 0;

const scripts = [{script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/adminpaneljs.js'}];
const mainScripts = [{script: '/javascripts/mainadminpaneljs.js'}];

var currentPageIndex = 0;

const { sequelize, Sequelize } = require('../../models/sequelize');

const Admin = require('../../models/admin/admin')(Sequelize, sequelize);
const Category = require('../../models/product/category')(Sequelize, sequelize);
const Manufacturer = require('../../models/product/manufacturer')(Sequelize, sequelize);
const GeneralProduct = require('../../models/product/generalproduct')(Sequelize, sequelize);
const SubProduct = require('../../models/product/subproduct')(Sequelize, sequelize);

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
    Admin.findAll({raw: true, attributes: {exclude: ['Password']}, offset: currentPageIndex * numberOfRecordsOnPage, limit: numberOfRecordsOnPage}).then(admins => {
        adminsEntities = admins;
        Admin.count().then(recordsCount => {
            adminEntitiesCount = recordsCount;
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
        });
    }).catch(err => console.log(err));
};

exports.returnAdminPanelCategoryEntities = function(request, response, newPageNumber) {
    Category.findAll({raw: true, offset: currentPageIndex * numberOfRecordsOnPage, limit: numberOfRecordsOnPage}).then(categories => {
        categoryEntities = categories;
            Category.count().then(recordsCount => {
                categoryEntitiesCount = recordsCount;
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
            }
        );

    }).catch(err => console.log(err));

};

exports.returnAdminPanelManufacturerEntities = function(request, response, newPageNumber) {
    Manufacturer.findAll({raw: true, offset: currentPageIndex * numberOfRecordsOnPage, limit: numberOfRecordsOnPage}).then(manufacturers => {
        manufacturerEntities = manufacturers;
        Manufacturer.count().then(recordsCount => {
            manufacturerEntitiesCount = recordsCount;
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
            }
        )

    }).catch(err => console.log(err));
};

exports.returnAdminPanelGeneralProductsEntities = function (request, response, newPageNumber) {
    GeneralProduct.findAll({raw: true,
        offset: currentPageIndex * numberOfRecordsOnPage,
        limit: numberOfRecordsOnPage,
        attributes: {exclude: ['createdAt', 'updatedAt', 'Recommend_Percentage', 'Average_Rating']},
    }).then(generalProducts => {
        let counter = 0;
        if (generalProducts.length === 0) {
            generalProductsEntities = generalProducts;
            GeneralProduct.count().then(recordsCount => {
                    currentPageIndex = newPageNumber - 1;
                    response.render('admin/adminpanel', {
                        title: 'Admin panel - General product',
                        layout: 'adminlayout',
                        tables: tables,
                        tableName: 'General products',
                        tableNameForLink: 'generalproduct',
                        totalRecords: recordsCount,
                        object: generalProductsEntities[0],
                        entities: generalProductsEntities,
                        numberOfPages: calculateNumberOfPagesForPanel(recordsCount),
                        maxPage: pagesNumbers[pagesNumbers.length - 1],
                        isRightSideOfPanelVisible: 'true',
                        scripts: scripts
                    })
                }
            )
        }
        else {
        generalProducts.forEach(generalProduct => {
            Category.findOne({where: {Category_ID: generalProduct.Category_ID_FK}}).then(category => {
                if (category)
                    generalProduct.Category_ID_FK = category.Category_Name;
                else
                    generalProduct.Category_ID_FK = 'No category selected';
            });
            Manufacturer.findOne({where: {Manufacturer_ID: generalProduct.Manufacturer_ID_FK}}).then(manufacturer => {
                if (manufacturer)
                    generalProduct.Manufacturer_ID_FK = manufacturer.Manufacturer_Name;
                else
                    generalProduct.Manufacturer_ID_FK = 'No manufacturer selected';
                counter++;
                if (counter === generalProducts.length) {
                    generalProductsEntities = generalProducts;
                    GeneralProduct.count().then(recordsCount => {
                            currentPageIndex = newPageNumber - 1;
                            response.render('admin/adminpanel', {
                                title: 'Admin panel - General product',
                                layout: 'adminlayout',
                                tables: tables,
                                tableName: 'General products',
                                tableNameForLink: 'generalproduct',
                                totalRecords: recordsCount,
                                object: generalProductsEntities[0],
                                entities: generalProductsEntities,
                                numberOfPages: calculateNumberOfPagesForPanel(recordsCount),
                                maxPage: pagesNumbers[pagesNumbers.length - 1],
                                isRightSideOfPanelVisible: 'true',
                                scripts: scripts
                            })
                        }
                    )
                }
            })
            });
        }
    }).catch(err => console.log(err));
};

exports.returnAdminPanelSubProductEntities = function (request, response, newPageNumber) {
  SubProduct.findAll({raw: true,
      offset: currentPageIndex * numberOfRecordsOnPage,
      limit: numberOfRecordsOnPage}).then(subProducts => {
        let counter = 0;
        if (subProducts.length === 0) {
            subProductsEntities = subProducts;
            SubProduct.count().then(recordsCount => {
                currentPageIndex = newPageNumber - 1;
                response.render('admin/adminpanel', {
                    title: 'Admin panel - Sub product',
                    layout: 'adminlayout',
                    tables: tables,
                    tableName: 'Sub products',
                    tableNameForLink: 'subproduct',
                    totalRecords: recordsCount,
                    object: subProductsEntities[0],
                    entities: subProductsEntities,
                    numberOfPages: calculateNumberOfPagesForPanel(recordsCount),
                    maxPage: pagesNumbers[pagesNumbers.length - 1],
                    isRightSideOfPanelVisible: 'true',
                    scripts: scripts
                })
            })
        }
        else {
            subProducts.forEach(subProduct => {
                GeneralProduct.findOne({where: {General_Product_ID: subProduct.General_Product_ID_FK}}).then(generalProduct => {
                    subProduct.General_Product_ID_FK = generalProduct.Product_Name;
                    counter++;
                    if (counter === subProducts.length) {
                        subProductsEntities = subProducts;
                        SubProduct.count().then(recordsCount => {
                            currentPageIndex = newPageNumber - 1;
                            response.render('admin/adminpanel', {
                                title: 'Admin panel - Sub product',
                                layout: 'adminlayout',
                                tables: tables,
                                tableName: 'Sub products',
                                tableNameForLink: 'subproduct',
                                totalRecords: recordsCount,
                                object: subProductsEntities[0],
                                entities: subProductsEntities,
                                numberOfPages: calculateNumberOfPagesForPanel(recordsCount),
                                maxPage: pagesNumbers[pagesNumbers.length - 1],
                                isRightSideOfPanelVisible: 'true',
                                scripts: scripts
                            })
                        })
                    }
                })
            })
        }
})
};

function setTablesLinks() {
    tables.push(new tableLink('admin', 'Admin'));
    tables.push(new tableLink('category', 'Category'));
    tables.push(new tableLink('manufacturer', 'Manufacturer'));
    tables.push(new tableLink('generalproduct', 'General product'));
    tables.push(new tableLink('subproduct', 'Sub product'));
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

exports.returnAdminCreationPage = function(request, response) {
    let creationPageHtml = getHtmlFromFile('views/admin/create/admincreate.hbs');
    creationPageHtml = creationPageHtml.replace('{csrfToken}', request.csrfToken());
    creationPageHtml = creationPageHtml.replace('{pageNumber}', currentPageIndex + 1);
    response.render('admin/adminpanel', {
        title: 'Admin Panel - Admin Creation',
        layout: 'adminlayout',
        tables: tables,
        isRightSideOfPanelVisible: 'true',
        scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/create/admincreationjs.js'}],
        isCreation: true,
        creationFormHbs: creationPageHtml
    })
};

exports.returnCategoryCreationPage = function(request, response) {
    let creationPageHtml = getHtmlFromFile('views/admin/create/categorycreate.hbs');
    creationPageHtml = creationPageHtml.replace('{csrfToken}', request.csrfToken());
    creationPageHtml = creationPageHtml.replace('{pageNumber}', currentPageIndex + 1);
    response.render('admin/adminpanel', {
        title: 'Admin Panel - Category Creation',
        layout: 'adminlayout',
        tables: tables,
        isRightSideOfPanelVisible: 'true',
        scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/create/categorycreationjs.js'}],
        isCreation: true,
        creationFormHbs: creationPageHtml
    })
};

exports.returnManufacturerCreationPage = function(request, response) {
    let creationPageHtml = getHtmlFromFile('views/admin/create/manufacturercreate.hbs');
    creationPageHtml = creationPageHtml.replace('{csrfToken}', request.csrfToken());
    creationPageHtml = creationPageHtml.replace('{pageNumber}', currentPageIndex + 1);
    response.render('admin/adminpanel', {
        title: 'Admin Panel - Manufacturer Creation',
        layout: 'adminlayout',
        tables: tables,
        isRightSideOfPanelVisible: 'true',
        scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/create/manufacturercreationjs.js'}],
        isCreation: true,
        creationFormHbs: creationPageHtml
    })
};

exports.returnGeneralProductCreationPage = function (request, response) {
    let manufacturerOptions;
    let categoryOptions;
    Manufacturer.findAll({raw: true}).then(manufacturers => {
        manufacturers.forEach(manufacturer => manufacturerOptions += `<option>${manufacturer.Manufacturer_Name}</option>`);
        Category.findAll({raw: true}).then(categories => {
            categories.forEach(category => categoryOptions += `<option>${category.Category_Name}</option>`);
            let creationPageHtml = getHtmlFromFile('views/admin/create/generalproductcreate.hbs');
            creationPageHtml = creationPageHtml.replace('{csrfToken}', request.csrfToken());
            creationPageHtml = creationPageHtml.replace('{pageNumber}', currentPageIndex + 1);
            creationPageHtml = creationPageHtml.replace('{manufactureroptions}', manufacturerOptions);
            creationPageHtml = creationPageHtml.replace('{categoryoptions}', categoryOptions);
            response.render('admin/adminpanel', {
                title: 'Admin Panel - General Product Creation',
                layout: 'adminlayout',
                tables: tables,
                isRightSideOfPanelVisible: 'true',
                scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/create/generalproductcreationjs.js'}],
                isCreation: true,
                creationFormHbs: creationPageHtml
            })
        })
    })
};

exports.returnSubProductCreationPage = function (request, response) {
    let generalProductOptions;
    GeneralProduct.findAll({raw: true}).then(generalProducts => {
        let counter = 0;
        if (generalProducts.length === 0) {
            let creationPageHtml = getHtmlFromFile('views/admin/create/subproductcreate.hbs');
            creationPageHtml = creationPageHtml.replace('{csrfToken}', request.csrfToken());
            creationPageHtml = creationPageHtml.replace('{pageNumber}', currentPageIndex + 1);
            creationPageHtml = creationPageHtml.replace('{generalproductoptions}', 'No general products');
            response.render('admin/adminpanel', {
                title: 'Admin Panel - Manufacturer Creation',
                layout: 'adminlayout',
                tables: tables,
                isRightSideOfPanelVisible: 'true',
                scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/create/subproductcreationjs.js'}],
                isCreation: true,
                creationFormHbs: creationPageHtml
            })
        }
        else {
            generalProducts.forEach(generalProduct => {
                generalProductOptions += `<option>${generalProduct.Product_Name}</option>`;
                counter++;
                if (counter === generalProducts.length) {
                    let creationPageHtml = getHtmlFromFile('views/admin/create/subproductcreate.hbs');
                    creationPageHtml = creationPageHtml.replace('{csrfToken}', request.csrfToken());
                    creationPageHtml = creationPageHtml.replace('{pageNumber}', currentPageIndex + 1);
                    creationPageHtml = creationPageHtml.replace('{generalproductoptions}', generalProductOptions);
                    response.render('admin/adminpanel', {
                        title: 'Admin Panel - Manufacturer Creation',
                        layout: 'adminlayout',
                        tables: tables,
                        isRightSideOfPanelVisible: 'true',
                        scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/create/subproductcreationjs.js'}],
                        isCreation: true,
                        creationFormHbs: creationPageHtml
                    })
                }
            })
        }
    })
};

exports.returnAdminEditingPage = function(request, response, recordId) {
    Admin.findByPk(recordId).then(result => {
        let editPageHtml = getHtmlFromFile('views/admin/edit/adminedit.hbs');
        editPageHtml = editPageHtml.replace('{csrfToken}', request.csrfToken);
        editPageHtml = editPageHtml.replace('{pageNumber}', currentPageIndex + 1);
        editPageHtml = editPageHtml.replace('{login}', result.Login);
        editPageHtml = editPageHtml.replace('{requestPath}', request.originalUrl + '/submit');
        response.render('admin/adminpanel', {
            title: 'Admin Panel - Admin Editing',
            layout: 'adminlayout',
            tables: tables,
            isRightSideOfPanelVisible: 'true',
            scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/edit/admineditjs.js'}],
            isEditing: true,
            editingFormHbs: editPageHtml
        })
    });
};

exports.returnCategoryEditingPage = function(request, response, recordId) {
    Category.findByPk(recordId).then(result => {
        let editPageHtml = getHtmlFromFile('views/admin/edit/categoryedit.hbs');
        editPageHtml = editPageHtml.replace('{csrfToken}', request.csrfToken);
        editPageHtml = editPageHtml.replace('{pageNumber}', currentPageIndex + 1);
        editPageHtml = editPageHtml.replace('{category}', result.Category_Name);
        editPageHtml = editPageHtml.replace('{requestPath}', request.originalUrl + '/submit');
        response.render('admin/adminpanel', {
            title: 'Admin Panel - Admin Editing',
            layout: 'adminlayout',
            tables: tables,
            isRightSideOfPanelVisible: 'true',
            scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/edit/categoryeditjs.js'}],
            isEditing: true,
            editingFormHbs: editPageHtml
        })
    });
};

exports.returnManufacturerEditingPage = function(request, response, recordId) {
    Manufacturer.findByPk(recordId).then(result => {
        let editPageHtml = getHtmlFromFile('views/admin/edit/manufactureredit.hbs');
        editPageHtml = editPageHtml.replace('{csrfToken}', request.csrfToken);
        editPageHtml = editPageHtml.replace('{pageNumber}', currentPageIndex + 1);
        editPageHtml = editPageHtml.replace('{manufacturerName}', result.Manufacturer_Name);
        editPageHtml = editPageHtml.replace('{manufacturerLogo}', result.Manufacturer_Logo_Path);
        editPageHtml = editPageHtml.replace('{requestPath}', request.originalUrl + '/submit');
        response.render('admin/adminpanel', {
            title: 'Admin Panel - Admin Editing',
            layout: 'adminlayout',
            tables: tables,
            isRightSideOfPanelVisible: 'true',
            scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/edit/manufacturereditjs.js'}],
            isEditing: true,
            editingFormHbs: editPageHtml
        })
    });
};

exports.returnGeneralProductEditingPage = function(request, response, recordId) {
    GeneralProduct.findByPk(recordId).then(result => {
        let currentCategory;
        let currentManufacturer;
        let categoryOptions;
        let manufacturerOptions;
        let generalProduct = result;
        Category.findOne({where: {Category_ID: result.Category_ID_FK}}).then(category => {
            if (category)
                currentCategory = category.Category_Name;
            else
                currentCategory = 'No category selected';
           Manufacturer.findOne({where: {Manufacturer_ID: generalProduct.Manufacturer_ID_FK}}).then(manufacturer => {
               if (manufacturer)
                    currentManufacturer = manufacturer.Manufacturer_Name;
               else
                   currentManufacturer = 'No manufacturer selected';
               Category.findAll().then(categories => {
                   categories.forEach(category => categoryOptions += `<option>${category.Category_Name}</option>`);
                   Manufacturer.findAll().then(manufacturers => {
                       manufacturers.forEach(manufacturer => manufacturerOptions += `<option>${manufacturer.Manufacturer_Name}</option>`);
                       let editPageHtml = getHtmlFromFile('views/admin/edit/generalproductedit.hbs');
                       editPageHtml = editPageHtml.replace('{csrfToken}', request.csrfToken);
                       editPageHtml = editPageHtml.replace('{pageNumber}', currentPageIndex + 1);
                       editPageHtml = editPageHtml.replace('{productName}', generalProduct.Product_Name);
                       editPageHtml = editPageHtml.replace('{currentCategory}', currentCategory);
                       editPageHtml = editPageHtml.replace('{categoryOptions}', categoryOptions);
                       editPageHtml = editPageHtml.replace('{currentManufacturer}', currentManufacturer);
                       editPageHtml = editPageHtml.replace('{manufacturerOptions}', manufacturerOptions);
                       editPageHtml = editPageHtml.replace('{productImage}', generalProduct.General_Product_Image_Path);
                       editPageHtml = editPageHtml.replace('{productDescription}', generalProduct.General_Product_Description);
                       editPageHtml = editPageHtml.replace('{requestPath}', request.originalUrl + '/submit');
                       response.render('admin/adminpanel', {
                           title: 'Admin Panel - Product Editing',
                           layout: 'adminlayout',
                           tables: tables,
                           isRightSideOfPanelVisible: 'true',
                           scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/edit/generalproducteditjs.js'}],
                           isEditing: true,
                           editingFormHbs: editPageHtml
                       })
                   })
               })
           })
        });

    });
};

exports.returnSubProductEditingPage = function (request, response, recordId) {
    SubProduct.findByPk(recordId).then(result => {
        let currentGeneralProduct;
        let generalProductOptions;
        let subProduct = result;
        GeneralProduct.findOne({where: {General_Product_ID: subProduct.General_Product_ID_FK}}).then(generalProduct => {
            currentGeneralProduct = generalProduct.Product_Name;
            GeneralProduct.findAll().then(generalProducts => {
                if (generalProducts.length === 0) {
                    let editPageHtml = getHtmlFromFile('views/admin/edit/subproductedit.hbs');
                    editPageHtml = editPageHtml.replace('{csrfToken}', request.csrfToken);
                    editPageHtml = editPageHtml.replace('{pageNumber}', currentPageIndex + 1);
                    editPageHtml = editPageHtml.replace('{currentGeneralProduct}', currentGeneralProduct);
                    editPageHtml = editPageHtml.replace('{generalproductoptions}', 'No general products');
                    editPageHtml = editPageHtml.replace('{subproductcode}', subProduct.Sub_Product_Code);
                    editPageHtml = editPageHtml.replace('{subproductprice}', subProduct.Price);
                    editPageHtml = editPageHtml.replace('{subproductdescription}', subProduct.Sub_Product_Description);
                    editPageHtml = editPageHtml.replace('{requestPath}', request.originalUrl + '/submit');
                    response.render('admin/adminpanel', {
                        title: 'Admin Panel - Sub Product Editing',
                        layout: 'adminlayout',
                        tables: tables,
                        isRightSideOfPanelVisible: 'true',
                        scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/edit/subproducteditjs.js'}],
                        isEditing: true,
                        editingFormHbs: editPageHtml
                    })
                }
                else {
                    let counter = 0;
                    generalProducts.forEach(generalProduct => {
                        generalProductOptions +=  `<option>${generalProduct.Product_Name}</option>`;
                        counter++;
                        if (counter === generalProducts.length) {
                            let editPageHtml = getHtmlFromFile('views/admin/edit/subproductedit.hbs');
                            editPageHtml = editPageHtml.replace('{csrfToken}', request.csrfToken);
                            editPageHtml = editPageHtml.replace('{pageNumber}', currentPageIndex + 1);
                            editPageHtml = editPageHtml.replace('{currentGeneralProduct}', currentGeneralProduct);
                            editPageHtml = editPageHtml.replace('{generalproductoptions}', generalProductOptions);
                            editPageHtml = editPageHtml.replace('{subproductcode}', subProduct.Sub_Product_Code);
                            editPageHtml = editPageHtml.replace('{subproductprice}', subProduct.Price);
                            editPageHtml = editPageHtml.replace('{subproductdescription}', subProduct.Sub_Product_Description);
                            editPageHtml = editPageHtml.replace('{requestPath}', request.originalUrl + '/submit');
                            response.render('admin/adminpanel', {
                                title: 'Admin Panel - Sub Product Editing',
                                layout: 'adminlayout',
                                tables: tables,
                                isRightSideOfPanelVisible: 'true',
                                scripts: [{script: '/javascripts/mainadminpaneljs.js'}, {script: '/javascripts/helpers/alertContainer.js'}, {script: '/javascripts/admin/edit/subproducteditjs.js'}],
                                isEditing: true,
                                editingFormHbs: editPageHtml
                            })
                        }
                    })
                }
            })
        })
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
    return template(fileHtml);
}