var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');

var dbUrl = 'mongodb://localhost:27017/socketchat';

module.exports = function(app) {

    function signToken(data) {
        return jwt.sign(data, 'secret');
    }

    function checkPassword(pass, user) {
        return encryptPass(pass, user.salt) == user.password;
    }

    function encryptPass(pass, salt) {
        return crypto.createHmac('sha1', salt).update(pass).digest('hex');
    }

    app.post('/signin', function(req, res) {

        var formData = req.body;

        MongoClient.connect(dbUrl, cb);

        function cb(err, db) {
            if (err) return res.status(500).json({
               msg:  'Error connecting to DB.'
            });

            console.log('connected to db')

            var users = db.collection('users');

            users.find({username: formData.username}).toArray(function(err, result) {
                if (err) {
                    return res.json({
                        msg: 'Error finding user.',
                        err: err
                    });
                }

                if (result.length == 0) {
                    return res.status(401).json({
                        msg: 'User with this username is not registered'
                    });
                }

                console.log(result);

                var user = result[0];

                if (checkPassword(formData.password, user)) {
                    return res.json({
                       token: signToken({username: user.username})
                    });
                } else {
                    return res.status(401).json({
                        msg: 'Password incorrect'
                    });
                }

                db.close();

            });
        }

    });

    app.post('/signup', function(req, res) {

        var formData = req.body;

        MongoClient.connect(dbUrl, cb);

        function cb(err, db) {
            if (err) return res.status(500).json({
                msg: 'Error connecting to db.'
            });

            var users = db.collection('users');

            var salt = Math.random() + '';

            users.insert([{
                username: formData.username,
                password: encryptPass(formData.password, salt),
                salt: salt
            }], function(err, result) {
                if (err) {
                    var msg = 'Failed to signup';

                    console.error(msg);
                    console.error(err.code);

                    if (err.code == 11000) {
                        msg = 'User allready exists';
                    }

                    return res.status(400).json({
                        err: err,
                        msg: msg
                    });
                }

                var token = signToken({username: formData.username});
                //console.log(token);

                res.json({
                    token: token
                });

                db.close();

            });

        };

    });

    app.get('/messages', function(req, res) {
        //TODO IP: get all messages by username (from token)
        //maybe get some specific messages depending on params
    });

    app.get('/user/rooms', function(req, res) {
        var token = req.headers.authorization.split(' ')[1];
        var data;

        data = jwt.verify(token, 'secret');

        MongoClient.connect(dbUrl, cb);

        function cb(err, db) {
            if (err) return res.status(500).json({msg: 'Error. Can\'t connect to DB.'})
            var users = db.collection('users');
            var rooms = db.collection('rooms');

            users
                .findOne({username: data.username}, function(err, user) {
                    if (err) return res.status(500).json({msg: 'Error. Can not get user.'});

                    if (typeof user.rooms == 'undefined' || user.rooms.length == 0) {
                        return res.json({
                            msg: 'User have no rooms.',
                            rooms: []
                        });
                    }

                    rooms.find({_id: {$in : user.rooms}}).toArray(function(err, result) {
                        if (err) return res.status(500).json({msg: 'Error. Can\'t get rooms.'});

                        res.json({
                            rooms: result
                        });

                    });

                });
        }

    });

    app.get('/user/friends', function(req, res) {
        //TODO IP: get user friends list
        //get username from token
    });

    app.get('/rooms/:roomId/messages', function(req, res) {
        var roomId = req.params.roomId;

        MongoClient.connect(dbUrl, cb);

        function cb(err, db) {
            if (err) res.status(500).json({msg: 'Error. Can\'t connect to DB.'});

            var messages = db.collection('messages');

            messages.find({roomId: roomId}).toArray(function(err, result) {

            });
        }

    });

    app.post('/rooms', function(req, res) {
        //TODO IP: insert new room into DB
        var newRoom = req.body.room;

        if (typeof newRoom == 'undefined') return res.status(400).json({msg: 'Error. Please provide room to add.'});

        MongoClient.connect(dbUrl, cb);

        function cb(err, db) {
            if (err) res.status(500).json({msg: 'Error. Can\'t connect to DB.'});
            var rooms = db.collection('rooms');
            var users = db.collection('users');

            rooms.insertOne({
                title: newRoom.title,
                members: [],
                creator: newRoom.creator,
                password: newRoom.password,
                public: newRoom.public
            }, function(err, room) {
                if (err) return res.status(500).json({msg: 'Error. Can\'t insert new room.'});

                var insertedRoom = room.ops[0];

                users.updateOne({username: insertedRoom.creator},
                    {$push: {rooms: insertedRoom._id}},
                    function(err, result) {
                        if (err) return res.status(500).json({msg: 'Error. Can not save room to user.'});

                        res.json({
                            room: insertedRoom
                        });

                });


            });
        }
    });

};