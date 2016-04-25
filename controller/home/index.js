/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

var apiRequester = require('../../helper/requestHelper').apiRequester;

exports.homeIndex = function(req, res, next){
    var i = Math.random() * 50 + 50;

   setTimeout(function(){
       res.render('home/index');
   }, i);

};