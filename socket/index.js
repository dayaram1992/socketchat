var MongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/socketchat';

function saveMsg(msg, cb) {
    MongoClient.connect(dbUrl, dbCallback);

    function dbCallback(err, db) {
        if (err) return cb({msg: 'Error. Failed to save message.'});

        var msgColl = db.collection('messages');

        msgColl.insert({
            msgBody: msg.msgBody,
            msgCreated: new Date(),
            msgUser: msg.msgUser
        }, function(err, result) {
            if (err) return cb({msg: 'Error. Failed to save message.'});

            cb(null, result.ops[0]);
        });
    }

}

module.exports = function(server) {
    var io = require('socket.io').listen(server);
    io.on('connection', onConnect);

    function onChatMsg(msg) {
        saveMsg(msg, function(err, msg) {
            io.emit('chat message', msg);

            console.log('message: ');
            console.log(msg);
        });
    }

    function onDisconnect() {
        console.log('user disconnected')
    }

    function onConnect(socket) {
        console.log('a user connected');

        socket.on('chat message', onChatMsg);
        socket.on('disconnect', onDisconnect);
    }

};