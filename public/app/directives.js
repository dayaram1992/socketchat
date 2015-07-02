;(function() {

    angular
        .module('app')
        .directive('chat', chatDirective);

    chatDirective.$inject = ['Auth'];

    function chatDirective(Auth) {

        var user = Auth.getTokenClaims();

        return {
            restrict: 'EA',
            scope: {},
            link: function(scope, el, attrs) {

                $(function() {
                    var socket = io();

                    $(document).ready(function() {

                        $('#chatForm').submit(function() {

                            socket.emit('chat message', {
                                user: user.username,
                                msg: $('#m').val()
                            });

                            $('#m').val('');

                            return false;

                        });

                        socket.on('chat message', function(msg) {
                            console.log(msg);
                            var message = ''
                                + '<div class="list-group-item">'
                                + '<span class="label label-primary">' + msg.user + '</span> '
                                + msg.msg
                                + '</div>';
                            $('#messages').append($(message));

                        });

                    });

                });

                console.log('chat directive');

            }
        };

    };

})();