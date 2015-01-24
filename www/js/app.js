'use strict';

var modules = [
        'ngRoute',
        'neeTax.taxer',
        'neeTax.filters'
    ];
// Declare app level module which depends on views, and components
angular.module('neeTax', modules)
    .config([
        '$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $routeProvider.otherwise({ redirectTo: '/taxer' });
            $routeProvider.when('/taxer', {
                templateUrl: 'taxer/taxer.html',
                controller: 'taxerCtrl'
            });
            $httpProvider.defaults.crossDomain = true;
        }
    ])
    .constant("priceData", {
        "fixed": {
            "start": 500,
            "epidural": 1800,
            "n2o": 250,
            "paragin": 8,
            "oxytocin": 200,
            "fluids": 300,
            "sucction": 250,
            "tub": 200,
            "acupuncture": 150,
            "ctg": 400
        },
        "multi": {
            "night": 0.5,
            "weekend": 1,
            "msecperkr": 620
        }
    });
