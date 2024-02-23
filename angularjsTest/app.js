
var app = angular.module('myApp', ['ngRoute','ngAnimate'] );

app.factory('checkLoggedIn', function($q, $location) {
    return function() {
      var deferred = $q.defer();
  
      if (sessionStorage.getItem('username')) {
        deferred.resolve();
      } else {
        $location.path('/login');
        deferred.reject();
      }
  
      return deferred.promise;
    };
  });
app.config(['$routeProvider',function($routeProvider) {

    $routeProvider .when('/',{
        templateUrl: 'views/book-search.html',
        resolve: {
            loggedIn: function(checkLoggedIn) {
              return checkLoggedIn();
            }
        }    
    }) 
    .when('/favorites', {
        templateUrl: 'views/favorites.html',
        controller: 'FavoritesController',
        resolve: {
            loggedIn: function(checkLoggedIn) {
              return checkLoggedIn();
            }
        } 
    })
     .when('/login',{
        controller:'LoginController',
        templateUrl: 'views/login.html'
        
    })  .otherwise({
        redirectTo: '/'
    })
 /*    .when('/home',{
        templateUrl: 'views/homepage.html'
        
    }) 
    .when('/directory',{
        templateUrl: 'views/directory.html',
        controller: 'app-controller-1'
    })*/
  
}]);


app.controller('MenuController', ['$scope', '$location', function($scope, $location) {
    $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };
}]);

  app.controller('LoginController', ['$scope', '$location', function($scope, $location) {
    $scope.login = function() {
        // Storeד username and password in session storage
        sessionStorage.setItem('username', $scope.username);
        sessionStorage.setItem('password', $scope.password);

      
        $scope.username = '';
        $scope.password = '';

        $location.path('/');

    };
}]);
app.controller('MainController', function($scope, BookService, FavoriteBooksService) {
    $scope.books = [];
    $scope.selectedBook = null;
    $scope.showDetailsPanel = false;
    $scope.currentPage = 1;
    $scope.pageSize = 10; // Number of books per page
    $scope.totalItems = 0;
    $scope.totalPages = 0;
    $scope.pagedBooks = [];

    // Load books using the BookService

    $scope.loadBooks = function(page, pageSize, searchTerm) {
        if (!isNaN(page) && !isNaN(pageSize)) {
        BookService.getBooks(page, pageSize, searchTerm).then(function(response) {
            $scope.pagedBooks = response.data.items;
            $scope.books =  $scope.pagedBooks;
            $scope.totalItems = response.data.totalItems;
            $scope.totalPages = Math.ceil($scope.totalItems / $scope.pageSize);
          //  $scope.updatePagedBooks();
        }, function(error) {
            console.error('Error fetching books', error);
        }); 
    }
    };
   
    $scope.searchBooks = function() {
        $scope.currentPage = 1;
        $scope.pageSize = 10; // Number of books per page
        $scope.totalItems = 0;
        $scope.totalPages = 0;
        $scope.pagedBooks = [];
        $scope.loadBooks($scope.currentPage, $scope.pageSize, $scope.searchTerm);
    };

    // Function to update the pagedBooks array based on the current page
    $scope.updatePagedBooks = function() {
        var start = ($scope.currentPage - 1) * $scope.pageSize;
        var end = start + $scope.pageSize;
        $scope.pagedBooks = $scope.books.slice(start, end);
    };

    // Handle the selection of a book from the list
    $scope.showDetails = function(book) {
        $scope.selectedBook = book;
        $scope.showDetailsPanel = true;
    };
$scope.closeDetails =()=>{
    $scope.showDetailsPanel = false;
}
    // Go to the previous page
    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
          //  $scope.updatePagedBooks();
            $scope.loadBooks($scope.currentPage, $scope.pageSize, $scope.searchTerm);
        }
    };

    // Go to the next page
    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPages) {
            $scope.currentPage++;
         //   $scope.updatePagedBooks();
            $scope.loadBooks($scope.currentPage, $scope.pageSize, $scope.searchTerm);
        }
    };

    $scope.toggleFavorite = function(book) {
        var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        var index = favorites.findIndex(function(favorite) {
            return favorite.id === book.id;
        });
    
        if (index !== -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(book);
        }
    
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };
    
    $scope.isFavorite = function(book) {
        var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.some(function(favorite) {
            return favorite.id === book.id;
        });
        $scope.isFavorite = function(book) {
            return FavoriteBooksService.isFavorite(book);
        };
    };

    // Initialize the book list
    $scope.loadBooks();

    
});
app.controller('FavoritesController', function($scope, BookService, FavoriteBooksService) {
    $scope.books = [];
    $scope.selectedBook = null;
    $scope.showDetailsPanel = false;
    $scope.currentPage = 1;
    $scope.pageSize = 10; // Number of books per page
    $scope.totalItems = 0;
    $scope.totalPages = 0;
    $scope.pagedBooks = [];

    $scope.favoriteBooks = FavoriteBooksService.getFavorites();

    $scope.toggleFavorite = function(book) {
        if (FavoriteBooksService.isFavorite(book)) {
            FavoriteBooksService.removeFavorite(book);
        } else {
            FavoriteBooksService.addFavorite(book);
        }
    };

    $scope.isFavorite = function(book) {
        return FavoriteBooksService.isFavorite(book);
    };
        $scope.showDetails = function(book) {
        $scope.selectedBook = book;
        $scope.showDetailsPanel = true;
   
    };
    $scope.closeDetails =()=>{
        $scope.showDetailsPanel = false;
    }
});


var checkLoggedIn = function ($q, $location) {
    var deferred = $q.defer();

    if (sessionStorage.getItem('username')) {
        deferred.resolve();
    } else {
        $location.path('/login');
        deferred.reject();
    }

    return deferred.promise;
};