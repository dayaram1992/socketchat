var app = require('express')();
var http = require('http').Server(app);
var serveStatic = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');

app.use('/', serveStatic(path.join(__dirname, 'public'), {}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(require('./middleware/auth.js'));

require('./routes.js')(app);

var server = http.listen(3001, function() {
    console.log('listening on *:3001');
});

require('./socket/index.js')(server);