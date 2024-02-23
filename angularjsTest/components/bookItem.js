app.directive('bookItem', function() {
    return {
        restrict: 'E',
        scope: {
            book: '=',
            showDetails: '&'
        },
        templateUrl: 'views/bookItem.html'
    };
});