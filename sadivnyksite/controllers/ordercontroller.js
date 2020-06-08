const { sequelize, Sequelize } = require('../models/sequelize');
const SubProduct = require('../models/product/subproduct')(Sequelize, sequelize);
const Order = require('../models/user/order')(Sequelize, sequelize);
const OrderProduct = require('../models/user/orderproduct')(Sequelize, sequelize);

var Cart = require('../models/helpers/cart');

exports.returnOrderPage = function (request, response) {
  if (!request.session.cart)
      return response.redirect('/cart');
    let cart = new Cart(request.session.cart);
  response.render('order', {
      title: 'Садівник - Оформлення Замовлення',
      csrfToken: request.csrfToken,
      user: request.user,
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      scripts: [{script: '/javascripts/orderjs.js'}]
  })
};

exports.tryToRedirectToOrderPage = function (request, response) {
    if (request.user) {
        let isUser = 'User_ID' in request.user;
        if (request.isAuthenticated() && isUser) {
            response.send('Redirect');
        }
        else
            response.send('Not logged');
    }
    else {
        request.session.orderUrl = '/order';
        request.session.save();
        response.send('Not logged');
    }
};

exports.placeOrder = function (request, response) {
    if (!request.session.cart)
        return response.send('Redirect cart');
    if (!request.user) {
        return response.send('Log in');
    }
    if (request.user) {
        let isUser = 'User_ID' in request.user;
        if (request.isAuthenticated() && !isUser) {
            return response.send('Admin');
        }
    }
    let cart = new Cart(request.session.cart);
    Order.create({Name: request.body.name, Last_Name: request.body.lastName, City: request.body.city, Area: request.body.area, Street: request.body.street, House_Number: request.body.building, Apartment_Number: request.body.apartment, Mobile_Phone_Number: request.body.phone, User_ID_FK: request.user.User_ID }).then(result => {
        if (result) {
            let count = 0;
            for (let item in cart.items) {
                OrderProduct.create({Product_Amount: cart.items[item].qty, Sub_Product_ID_FK: cart.items[item].item.Sub_Product_ID, Order_ID_FK: result.Order_ID}).then(result => {
                    if (result) {
                        count++;
                        if (count === Object.keys(cart.items).length) {
                            request.session.cart = {};
                            request.session.save();
                            response.send('Order placed');
                        }
                    }
                });
            }
        }
        else
            response.send('Creation failed');
    }).catch(err => {
        console.log(err);
        response.send('Creation failed');
    })
};