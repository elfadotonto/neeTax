angular.module('neeTax.config', [])
    .config([
        '$routeProvider', function($routeProvider) {
            $routeProvider.otherwise({ redirectTo: '/taxer' });
            $routeProvider.when('/taxer', {
                templateUrl: 'taxer/taxer.html',
                controller: 'taxerCtrl'
            });
        }
    ]);