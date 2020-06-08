const { sequelize, Sequelize } = require('../models/sequelize');
const SubProduct = require('../models/product/subproduct')(Sequelize, sequelize);
const GeneralProduct = require('../models/product/generalproduct')(Sequelize, sequelize);

var Cart = require('../models/helpers/cart');

exports.addProductToCart = function (request, response) {
    let productId = request.params.id;
    let cart = new Cart(request.session.cart ? request.session.cart : {});
    SubProduct.findByPk(productId).then (subProduct => {
        if (subProduct) {
            GeneralProduct.findOne({where: {General_Product_ID: subProduct.General_Product_ID_FK}}).then(generalProduct => {
                cart.add(subProduct, generalProduct.Product_Name + ', код: ' + subProduct.Sub_Product_Code, subProduct.Sub_Product_ID);
                request.session.cart = cart;
                request.session.save();
                console.log(request.session.cart);
                response.send('Product added');
            })
        }
        else
            response.send('Addition failed');
    })
};

exports.reduceProductQty = function (request, response) {
    let productId = request.params.id;
    let cart = new Cart(request.session.cart ? request.session.cart : {});
    cart.reduceByOne(productId);
    request.session.cart = cart;
    request.session.save();
    response.send('Reduced');
};

exports.removeProduct = function (request, response) {
    let productId = request.params.id;
    let cart = new Cart(request.session.cart ? request.session.cart : {});
    cart.removeItem(productId);
    request.session.cart = cart;
    request.session.save();
    response.send('Removed');
};

exports.returnCartPage = function (request, response) {
  if (!request.session.cart)
      return response.render('cart', {
          title: 'Садівник - Корзина',
          products: null,
          csrfToken: request.csrfToken
      });
    let cart = new Cart(request.session.cart);
    response.render('cart', {
        title: 'Садівник - Корзина',
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        csrfToken: request.csrfToken,
        scripts: [{script: '/javascripts/cartjs.js'}]
    });
};