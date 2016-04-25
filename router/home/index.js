/**
 * @author synder
 * @date 16/1/10
 * @desc
 */
var Router = require('xpress').Router;
var homeRouter = new Router();

var homeIndex = require('../../controller/home/index');

homeRouter.get('/', homeIndex.homeIndex);

module.exports = homeRouter;