var jwt = require('jsonwebtoken');

module.exports = function(app) {

    app.post('/signin', function(req, res) {

    });

    app.post('/signup', function(req, res) {
        var formData = req.body;
        //console.log(formData);

        //make request to mongoDB

        var token = jwt.sign(formData, 'secret')

        console.log(token);

        res.json({
            token: token
        });
    });

    app.get('/messages', function(req, res) {

    });
};