/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

var apiRequester = require('../../helper/requestHelper').apiRequester;

exports.homeIndex = function(req, res, next){

    var i = Math.round(Math.random() * 1000 + 250);

    setTimeout(function(){
        if(i % 2 == 0){
            var buffer = new Array(i * 10000);
            for(var x = 0 ; x < buffer.length; x++){
                buffer[x] = x;
            }
        }

        if(i % 7 == 0){
            return next(new Error('my name is'));
        }

        res.render('home/index');
    }, Math.random() * 10);

    return;



    if(i % 7 == 0){
        throw new Error('x');
    }

    if(i % 2 == 0){
        var buffer = new Array(1000000);
        for(var x = 0 ; x < 1000000; x++){
            buffer[x] = x;
        }
        return res.render('home/index');
    }

    if(i % 3 == 0){
        setTimeout(function(){
            res.render('home/index');
        }, i);
    }
};