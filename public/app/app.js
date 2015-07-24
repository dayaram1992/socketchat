var app = angular.module('app', [
    'ngStorage',
    'ngRoute',
    'angular-loading-bar',
    'btford.socket-io'
])

    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

        $routeProvider
            .when('/', {
                templateUrl: '../views/chat.html',
                controller: 'AppController'
            })
            .when('/signin', {
                templateUrl: '../views/login.html',
                controller: 'AppController'
            })
            .when('/signup', {
                templateUrl: '../views/register.html',
                controller: 'AppController'
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

                    console.log(config.headers);

                    return config;
                },

                'responseError': function(responce) {
                    if (responce.status == 401 || responce.status == 403) {
                        console.log('responceerror');

                        $location.path('/signin');
                    }
                    return $q.reject(responce);
                }
            };
        }]);
    }])
    .run(function($rootScope, $location, $localStorage) {

        $rootScope.$on( "$routeChangeStart", function(event, next) {

            $rootScope.error = '';

            console.log('token: ' + $localStorage.token);

            if ($localStorage.token == null) {

                if ( next.templateUrl === "../views/chat.html") {

                    $location.path("/signin");

                }

            }

        });

    });