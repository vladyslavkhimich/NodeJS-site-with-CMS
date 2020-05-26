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

var app = express();

// controllers
const contactsController = require('./controllers/contactsController.js');
const homeController = require('./controllers/homeController.js');

// routers
const adminRouter = require('./routes/admin/adminrouter');
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', expressHbs(
    {
        layoutsDir: 'views/layouts',
        defaultLayout: 'layout',
        extname: 'hbs',
        helpers: {
            isId: function(key, options) {
                console.log(key);
                if (key === 'Admin_ID' || key === 'Category_ID' || key === 'Manufacturer_ID')
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
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'adminsecret', resave: false, saveUninitialized: false}));
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



app.use('/admin', adminRouter);
app.use('/contacts', contactsController.returnContactsPage);
app.use('/', homeController.returnHomePage);

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