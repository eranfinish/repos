app.component('bookDetails', {
  templateUrl: 'views/book-details.html',
  controller: 'BookDetailsController',
  bindings: {
    selectedBook: '=',
    showDetailsPanel: '=',
    isFavorite: '&',
    toggleFavorite: '&',
    closeDetails: '&'
  },
  

});