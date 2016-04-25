/**
 * @author synder
 * @date 16/1/10
 * @desc
 */
var Router = require('xpress').Router;
var socketRouter = new Router();

var socketNotify = require('../../controller/socket/notify');

socketRouter.get('/socket', socketNotify.page);


module.exports = socketRouter;