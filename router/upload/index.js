/**
 * @author synder
 * @date 16/1/10
 * @desc
 */
var Router = require('xpress').Router;
var uploadRouter = new Router();

var uploadLocal = require('../../controller/upload/local');
var uploadOss = require('../../controller/upload/oss');

uploadRouter.get('/upload/local', uploadLocal.page);
uploadRouter.put('/upload/local/block', uploadLocal.uploadInBlock);
uploadRouter.put('/upload/local/chunk', uploadLocal.uploadInChunk);

uploadRouter.get('/upload/oss', uploadOss.page);
uploadRouter.put('/upload/oss/block', uploadOss.uploadInBlock);
uploadRouter.put('/upload/oss/chunk', uploadOss.uploadInChunk);

module.exports = uploadRouter;