/**
 * @author synder
 * @date 16/1/10
 * @desc
 */
var engine = require('ejs');
var io = require('socket.io');
var Xpress = require('xpress');

var config = require('./config');
var monitor = require('./lib/monitor');

global.config = config;

monitor.start({
    host: '127.0.0.1',
    port: 8001,
    appName: 'name',
    appKey: 'key'
});

//---------------------------------------------------------
var server = new Xpress({
    host: config.private.server.host,
    key: config.private.server.key,
    cert: config.private.server.cert,
    port: {
        http: config.private.server.port.http,
        https: config.private.server.port.https
    }
});

//---------------------------------------------------------
server.conf('x-powered-by', false);
server.conf('trust proxy', true);
server.conf('views', config.public.server.view.path);
server.conf('view engine', config.public.server.view.engine);
server.conf('view cache', false);
server.engine('html', engine.__express);

//---------------------------------------------------------
var body = require('body-parser');
var cookie = require('cookie-parser');
var timeout = require('connect-timeout');
var compression = require("compression");
var statics = require('express-static');

server.use(compression());
server.use(timeout('20s'));
server.use(cookie());
server.use(body.json());
server.use(body.urlencoded({extended: true}));
server.use(statics(config.public.server.statics.path));


//---------------------------------------------------------
var homeRouter = require('./router/home');
var pdfRouter = require('./router/pdf');

server.sub(homeRouter);
server.sub(pdfRouter);

//---------------------------------------------------------

server.error(404, function (err, req, res, next) {
    res.status(404).send('not found');
});

server.error(500, function (err, req, res, next) {
    res.status(500).send('server error');
});

//---------------------------------------------------------
server.listen(function (message) {
    console.log(message);
});

//---------------------------------------------------------
module.exports = server;
