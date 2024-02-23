app.service('BookService', function($http) {
    this.getBooks = function(page, pageSize, query) {
      // Adjust the API endpoint and query parameters as needed
      var url = 'https://www.googleapis.com/books/v1/volumes';
      var params = {
        q: query+'+intitle', // Example query
        startIndex: (page - 1) * pageSize,
        maxResults: pageSize
      };
      return $http.get(url, { params: params });
    };
  });