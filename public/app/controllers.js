;(function() {

    angular.module('app').controller('AppController', AppController);

    AppController.$inject = ['$rootScope', '$scope', '$location', '$localStorage', 'Auth', 'Data', 'MySocket'];

    function AppController($rootScope, $scope, $location, $localStorage, Auth, Data, MySocket) {
        $scope.token = $localStorage.token;
        $scope.tokenClaims =  Auth.getTokenClaims();

        $scope.showRoomForm = false;
        $scope.chatSelected = false;
        $scope.passDisabled = false;
        $scope.roomIsPublic = true;
        $scope.selectedRoom = null;

        $scope.allMessages = [];
        $scope.rooms = {
            111: {
                _id: 111,
                title: 'All',
                messages: [
                    {
                        msgBody: 'Lorem ipsum dolor sit amet.',
                        msgCreated: 'Fri Jul 24 2015 18:48:27 GMT+0300 (EEST)',
                        msgUser: 'dayaram'
                    },
                    {
                        msgBody: 'Lorem ipsum dolor sit amet.',
                        msgCreated: 'Fri Jul 24 2015 18:48:27 GMT+0300 (EEST)',
                        msgUser: 'dayaram'
                    },
                    {
                        msgBody: 'Lorem ipsum dolor sit amet.',
                        msgCreated: 'Fri Jul 24 2015 18:48:27 GMT+0300 (EEST)',
                        msgUser: 'dayaram'
                    }
                ]
            }
        };

        $scope.$on('socket:error', function(ev, data) {
            console.error('Socket error');
            console.error(ev);
            console.error(data);
        });

        MySocket.on('chat message', function(msg) {
            console.log('message received!');


        });

        if ($scope.token) {
            getRooms();
        }

        //getFriends();

        $scope.signin = function() {
            var formData = {
                username: $scope.username,
                password: $scope.password
            };

            console.log(formData);

            Auth.signin(formData, successAuth, function(err) {
                console.error(err.msg);
                $rootScope.error = err.msg;
            });

        };

        $scope.signup = function() {
            var formData = {
                username: $scope.username,
                password: $scope.password
            };

            Auth.signup(formData, successAuth, function(err) {
                console.error(err.msg);
                $rootScope.error = err.msg;
            });
        };

        $scope.logout = function() {
            Auth.logout(function() {
                window.location = '/';
            });
        };

        $scope.sendMessageSubmit = function() {
            $scope.msgToSend;



        };

        $scope.createRoomSubmit = function() {
            var formData = {
                title: $scope.newRoomTitle,
                pass: null,
                creator: Auth.getTokenClaims().username,
                public: $scope.roomIsPublic
            };

            if (!$scope.passDisabled) {
                if ($scope.newRoomPass === $scope.newRoomPassConfirm) {
                    formData.password = $scope.newRoomPass;
                } else {
                    console.error('Password mismatch')
                }
            }

            Data.addRoom(
                formData,
                function(result) {
                    $scope.rooms[result.room._id] = result.room;
                    $scope.showRoomForm = false;
                },
                function (error) {

                }
            );

        };

        $scope.roomSelected = function(roomId) {
            console.log(roomId);
            $scope.chatSelected = true;
            $scope.selectedRoom = $scope.rooms[roomId];

            getRoomMessages(roomId);
        };

        $scope.closeRoom = function() {
            $scope.chatSelected = false;
            $scope.roomTitle = '';
        };

        $scope.toggleRoomForm = function() {
            $scope.showRoomForm = !$scope.showRoomForm;
        };

        function getRoomMessages(roomId) {
            Data.getRoomMessages(
                roomId,
                function(result) {

                },
                function(err) {

                }
            );
        }

        function getRooms() {
            Data.getRooms(
                function(result) {
                    if (result.rooms) {
                        result.rooms.forEach(function(room) {
                            $scope.rooms[room._id] = room;
                        });
                    }
                },
                function(err) {

                }
            );
        }

        function getFriends() {
            Data.getFriends(
                function(result) {

                },
                function(err) {

                }
            );
        }

        function successAuth(res) {
            $localStorage.token = res.token;
            $localStorage.$save();

            window.location = '/';
        }

    }

})();