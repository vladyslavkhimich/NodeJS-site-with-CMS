const csrf = require('csurf');

var csrfProtection = new csrf();

exports.returnAdminSignInPage = function(request, response) {
  response.render('admin/adminsignin', {
      title: 'Admin Sign-In',
      layout: 'adminlayout',
      csrfToken: request.csrfToken()
  })
};