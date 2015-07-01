var app = angular.module('app', [
    'ngStorage',
    'ngRoute',
    'angular-loading-bar'
])

    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

        $routeProvider
            .when('/', {
                templateUrl: '../views/chat.html',
                controller: 'ChatController'
            })
            .when('/signin', {
                templateUrl: '../views/login.html',
                controller: 'ChatController'
            })
            .when('/signup', {
                templateUrl: '../views/register.html',
                controller: 'ChatController'
            })
            .otherwise({
                redirectTo: '/'
            });

        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {

                'request': function(config) {
                    config.headers = config.headers || {};

                    if($localStorage.token) {
                        config.headers.Authorization = 'Baerer ' + $localStorage.token;
                    }

                    return config;
                },

                'responseError': function(responce) {
                    if (responce.status == 401 || responce.status == 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(responce);
                }
            };
        }]);
    }])
    .controller('AppController', function($scope) {
        $scope.nahuy = 'zaebis';
    });/*
    .run(function($rootScope, $location, $localStorage) {
        $rootScope.$on( "$routeChangeStart", function(event, next) {
            if ($localStorage.token == null) {
                $location.path("/signin");
            }
        });
    });*/