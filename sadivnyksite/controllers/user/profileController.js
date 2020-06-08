const { sequelize, Sequelize } = require('../../models/sequelize');

const User = require('../../models/user/user')(Sequelize, sequelize);
const GeneralProduct = require('../../models/product/generalproduct')(Sequelize, sequelize);
const SubProduct = require('../../models/product/subproduct')(Sequelize, sequelize);
const Order = require('../../models/user/order')(Sequelize, sequelize);
const OrderProduct = require('../../models/user/orderproduct')(Sequelize, sequelize);
var Cart = require('../../models/helpers/cart');

exports.returnProfilePage = function (request, response) {
    if('User_ID' in request.user) {
        let userOrders = [];
        User.findByPk(request.user.User_ID).then(user => {
            Order.findAll({where: {User_ID_FK: request.user.User_ID}}).then(orders => {
                if (orders.length > 0) {
                    let orderCounter = 0;
                    orders.forEach(order => {
                        let orderCart = new Cart({});
                        let orderForHbs = {};
                        OrderProduct.findAll({where: {Order_ID_FK: order.Order_ID}}).then(orderProducts => {
                            let orderProductsCounter = 0;
                            orderProducts.forEach(orderProduct => {
                                SubProduct.findByPk(orderProduct.Sub_Product_ID_FK).then(subProduct => {
                                    GeneralProduct.findByPk(subProduct.General_Product_ID_FK).then(generalProduct => {
                                        for (let i = 0; i < orderProduct.Product_Amount; i++)
                                            orderCart.add(subProduct, generalProduct.Product_Name + ', код: ' + subProduct.Sub_Product_Code, subProduct.Sub_Product_ID);
                                        orderProductsCounter++;
                                        if (orderProductsCounter === orderProducts.length) {

                                            let options = {
                                              year: 'numeric',
                                              month: 'numeric',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            };
                                            orderForHbs.orderDate = new Date(Date.parse(order.Order_Datetime)).toLocaleString('uk', options);;
                                            orderForHbs.name = order.Name;
                                            orderForHbs.lastName = order.Last_Name;
                                            orderForHbs.totalPrice = orderCart.totalPrice;
                                            orderForHbs.totalQty = orderCart.totalQty;
                                            orderForHbs.products = orderCart.generateArray();
                                            userOrders.push(orderForHbs);
                                            orderCounter++;
                                            if (orderCounter === orders.length) {
                                                response.render('profile', {
                                                    title: 'Садівник - Особистий кабінет',
                                                    user: user,
                                                    orders: userOrders,
                                                    csrfToken: request.csrfToken(),
                                                    scripts: [{script: '/javascripts/profilejs.js'}]
                                                })
                                            }
                                        }
                                    })
                                })
                            })
                        })
                    })
                }
                else {
                    response.render('profile', {
                        title: 'Садівник - Особистий кабінет',
                        user: user,
                        orders: userOrders,
                        csrfToken: request.csrfToken(),
                        scripts: [{script: '/javascripts/profilejs.js'}]
                    })
                }
            });
        });
    }
};

exports.changePersonalData = function (request, response, userId) {
    User.findByPk(userId).then(user => {
        if (user) {
            let values = {};
            values.Name = request.body.name;
            values.Last_Name = request.body.lastName;
            values.Surname = request.body.surname;
            if (request.body.birthDate)
                values.Birth_Date = request.body.birthDate;
            if (request.body.sex)
                values.Sex = request.body.sex;
            User.update(values, {where: {User_ID: user.User_ID}}).then(result => {
                if (result)
                    response.send('Record updated');
                else
                    response.send('Update failed');
            }).catch(err => {
                console.log(err);
                response.send('Update failed');
            })
        }
        else
            response.send('Update failed');
    }).catch(err => {
        console.log(err);
        response.send('Update failed');
    })
};

exports.changeContactsData = function (request, response, userId) {
    User.findByPk(userId).then(user => {
        if (user) {
            let values = {};
            if (request.body.phoneNumber)
                values.Mobile_Phone_Number = request.body.phoneNumber;
            User.update(values, {where: {User_ID: user.User_ID}}).then(result => {
                if (result)
                    response.send('Record updated');
                else
                    response.send('Update failed');
            }).catch(err => {
                console.log(err);
                response.send('Update failed');
            })
        }
        else
            response.send('Update failed');
    }).catch(err => {
        console.log(err);
        response.send('Update failed');
    })
};

exports.changePasswordData = function (request, response, userId) {
    User.findByPk(userId).then(user => {
        if (user) {
            let values = {};
            if (!user.validatePassword(request.body.oldPassword))
                response.send('Password mismatched');
            else {
                values.Password = User.generatePassword(request.body.newPassword);
                User.update(values, {where: {User_ID: user.User_ID}}).then(result => {
                    if (result)
                        response.send('Record updated');
                    else
                        response.send('Update failed');
                }).catch(err => {
                    console.log(err);
                    response.send('Update failed');
                })
            }
        }
        else
            response.send('Update failed');
    }).catch(err => {
        console.log(err);
        response.send('Update failed');
    })
};