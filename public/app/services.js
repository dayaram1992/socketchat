;(function() {

    angular.module('app')

        .factory('Auth', ['$http', '$localStorage', function($http, $localStorage) {

            function urlBase64Decode(str) {
                var output = str.replace('-', '+').replace('_', '/');
                switch (output.length % 4) {
                    case 0:
                        break;
                    case 2:
                        output += '==';
                        break;
                    case 3:
                        output += '=';
                        break;
                    default:
                        throw 'Illegal base64url string!';
                }
                return window.atob(output);
            }

            function getClaimsFromToken() {
                var token = $localStorage.token;
                var data = {};
                if (typeof token !== 'undefined') {
                    var encoded = token.split('.')[1];
                    data = JSON.parse(urlBase64Decode(encoded));
                }
                return data;
            }

            var tokenClaims = getClaimsFromToken();

            return {

                signin: function(data, success, error) {
                    $http.post('/signin', data).success(success).error(error);
                },

                signup: function(data, success, error) {
                    $http.post('/signup', data).success(success).error(error);
                },

                logout: function (success) {
                    tokenClaims = {};
                    delete $localStorage.token;
                    $localStorage.$save();
                    success();
                },
                getTokenClaims: function () {
                    return tokenClaims;
                }
            };
        }])

        .factory('Data', ['$http', function($http) {

            return {

                getRooms: function(success, error) {
                    $http.get('/user/rooms').success(success).error(error);
                },
                getFriends: function(success, error) {
                    $http.get('/user/friends').success(success).error(error);
                },
                addRoom : function (room, success, error) {
                    $http.post('/rooms', {room: room}).success(success).error(error);
                },
                getRoomMessages: function(roomId, success, error) {
                    $http.get('/rooms/:roomId/messages').success(success).error(error);
                }

            };

        }])

        .factory('MySocket', ['socketFactory', function(socketFactory) {
            var mySocket = socketFactory();
            mySocket.forward('error');
            return mySocket;
        }]);

})();