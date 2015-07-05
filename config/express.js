var path = require('path'),
    express = require('express'),
    app = express();

module.exports = function() {
    app.disable('x-powered-by');
    app.set('port', process.env.PORT || 3030);

    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.set('view options', {
        layout: false
    });

    app.use(express.static(path.join(__dirname, 'public')));

    var site = require('../routes/site');
    app.use('/', site.index);
    return app;
}
