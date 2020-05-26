const scripts = [{script: '/javascripts/contactsjs.js'}];

exports.returnContactsPage = function(request, response) {
  response.render('contacts', {
      title: 'Контакти',
      scripts: scripts
  });
};