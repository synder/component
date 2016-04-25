/**
 * @author synder
 * @date 16/1/10
 * @desc
 */
var Router = require('xpress').Router;
var oauthRouter = new Router();

var editorWeb = require('../../controller/editor/web');

oauthRouter.get('/editor', editorWeb.page);
oauthRouter.post('/editor/data', editorWeb.data);

module.exports = oauthRouter;