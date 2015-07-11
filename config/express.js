var path = require('path'),
    express = require('express'),
    app = express();

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

exports.App = new App();
