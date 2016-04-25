/**
 * @author synder
 * @date 16/1/10
 * @desc
 */
var Router = require('xpress').Router;
var mqttRouter = new Router();

var mqttNotify = require('../../controller/mqtt/notify');

mqttRouter.get('/mqtt', mqttNotify.page);

module.exports = mqttRouter;