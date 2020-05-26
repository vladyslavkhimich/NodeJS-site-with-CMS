exports.returnHomePage = function(request, response) {
  response.render('home', {
      title: 'Садівник - головна сторінка'
  })
};