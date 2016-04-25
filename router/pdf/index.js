/**
 * @author synder
 * @date 16/1/10
 * @desc
 */
var Router = require('xpress').Router;
var pdfRouter = new Router();

var pdfView = require('../../controller/pdf/view');

pdfRouter.get('/pdf', pdfView.page);
pdfRouter.get('/pdf/data', pdfView.data);

module.exports = pdfRouter;