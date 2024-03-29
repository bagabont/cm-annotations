var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    app = express();

var Db = function() {
    this.connect = function() {
        var nodeEnv = process.env.NODE_ENV || 'development';

        var connectionString = '';
        if (nodeEnv === 'production') {
            var dbUser = process.env.DB_USER;
            var dbPass = process.env.DB_PASS;
            connectionString = 'mongodb://' + dbUser + ':' + dbPass + '@ds031319.mongolab.com:31319/cm-annotations';
        } else {
            connectionString = 'mongodb://localhost:27017/course-mapper';
        }

        // connect to database
        console.log('Connecting to database ' + connectionString + ' ...');
        mongoose.connect(connectionString);

        var dbConnection = mongoose.connection;
        dbConnection.once('open', function(err) {
            if (err) {
                console.log('Database connection failed: ' + err);
                return;
            }
            console.log('Database up and running.');
        });

        // error handler
        dbConnection.on('error', function(err) {
            console.log('Database error: ' + err);
        });
    };
};

var App = function() {
    app.disable('x-powered-by');
    app.set('port', process.env.PORT || 3030);

    app.use(express.static(path.join(__dirname, '../bower_components')));
    app.use(express.static(path.join(__dirname, '../public')));

    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.set('view options', {
        layout: false
    });

    var site = require('../routes/site');
    app.use('/', site.index);

    return app;
};

module.exports = {
    App: new App(),
    Db: new Db()
};
