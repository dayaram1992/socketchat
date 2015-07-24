;(function() {

    angular
        .module('app')
        .directive('chat', chatDirective);

    chatDirective.$inject = ['Auth'];

    function chatDirective(Auth) {

        var user = Auth.getTokenClaims();

        function onChatMsg(msg) {

            var message = ''
                + '<div class="list-group-item">'
                    + ' <p>'
                        + '<span class="label label-primary">' + msg.msgUser + '</span> '
                        + '<span class="label label-warning">' + (moment(msg.msgCreated).format('MMM Do, hh:mm:ss')) + '</span> '
                        + '<a>[remove]</a>'
                    + '</p>'
                    + '<p>' + msg.msgBody + '</p>'
                + '</div>';

            $('#messages').prepend($(message));

        }

        function link(scope, el, attrs) {

            $(function() {

                /*var socket = io();

                $('#chatForm').on('submit', function() {

                    socket.emit('chat message', {
                        msgUser: user.username,
                        msgBody: $('#m').val()
                    });

                    $('#m').val('');

                });

                socket.on('chat message', onChatMsg);*/

            });

        }

        return {
            restrict: 'EA',
            scope: {},
            link: link
        };

    }

})();