var createError = require('http-errors');
var express = require('express');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var fs = require('fs');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

var app = express();

// controllers
const contactsController = require('./controllers/contactsController.js');
const homeController = require('./controllers/homeController.js');
const categoriesController = require('./controllers/categoriesController.js');
const productController = require('./controllers/productController.js');
const searchController = require('./controllers/searchController.js');
const cartController = require('./controllers/cartController.js');
const orderController = require('./controllers/orderController.js');

// routers
const adminRouter = require('./routes/admin/adminrouter');
const userRouter = require('./routes/userrouter');
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', expressHbs(
    {
        layoutsDir: 'views/layouts',
        defaultLayout: 'layout',
        extname: 'hbs',
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        helpers: {
            isId: function(key, options) {
                console.log(key);
                if (key === 'Admin_ID' || key === 'Category_ID' || key === 'Manufacturer_ID' || key === 'General_Product_ID' || key === 'Sub_Product_ID')
                     return options.fn(this);
                else
                    return options.inverse(this);
            },
            isHaveContent: function(length, options) {
                if (parseInt(length) > 0)
                    return options.fn(this);
                else
                    return options.inverse(this);
            }
        }
    }
));

var SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize, Sequelize } = require('./models/sequelize');
const Category = require('./models/product/category')(Sequelize, sequelize);
const SubProduct = require('./models/product/subproduct')(Sequelize, sequelize);
const GeneralProduct = require('./models/product/generalproduct')(Sequelize, sequelize);
var SessionSequelize = new sequelize(
    'sessiondatabase',
    'username',
    'password',
    {
        "dialect": "sqlite",
        "storage": "./session.sqlite"
    }
);

var sessionStore = new SequelizeStore({
    db: SessionSequelize,
    checkExpirationInterval: 60 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000
});

app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'adminsecret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));
sessionStore.sync();
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

const csrf = require('csurf');

var csrfProtection = new csrf();

app.use(csrfProtection);

app.use(function (request, response, next) {
    response.locals.login = request.isAuthenticated();
    response.locals.session = request.session;
    Category.findAll().then(categories => {
       response.locals.categories = categories;
        next();
    });
});
app.get('/trytoorder', orderController.tryToRedirectToOrderPage);
app.get('/order', isLoggedIn, orderController.returnOrderPage);
app.post('/placeorder', orderController.placeOrder);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.get('/addtocart/:id', cartController.addProductToCart);
app.get('/reduce/:id', cartController.reduceProductQty);
app.get('/remove/:id', cartController.removeProduct);
app.get('/cart', cartController.returnCartPage);
app.get('/products/filter', searchController.returnFilteredProducts);
app.get('/search', searchController.returnProductsByName);
app.use('/product/:productId', function (request, response) {
    productController.returnProductPage(request, response, request.params.productId);
});
app.use('/categories/:categoryId/filter', function (request, response) {
    categoriesController.returnFilteredProducts(request, response, request.params.categoryId)
});
app.use('/categories/:categoryId', function(request, response) {
   let categoryId = request.params.categoryId;
   categoriesController.returnCategoryProductsPage(request, response, categoryId);
});
app.use('/contacts', contactsController.returnContactsPage);
app.use('/', homeController.returnHomePage);

function isLoggedIn(request, response, next) {
    if (request.user) {
        let isUser = 'User_ID' in request.user;
        if (request.isAuthenticated() && isUser) {
            return next();
        }
    }
    response.redirect('/cart');
}

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
app.listen(3000);