/**
 * @author synder
 * @date 16/1/10
 * @desc
 */
var Router = require('xpress').Router;
var editorRouter = new Router();

var editorWeb = require('../../controller/editor/web');

editorRouter.get('/editor', editorWeb.page);
editorRouter.post('/editor/data', editorWeb.data);

module.exports = editorRouter;