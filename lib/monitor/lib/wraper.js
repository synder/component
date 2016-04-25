/**
 * Created by synder on 16/4/21.
 */

var os = require('os');
var http = require('http');
var https = require('https');

var wrapCreateServer = function(type, func, callback){

    type.createServer = function(){

        var server = func.apply(type, arguments);

        server.on('request', function(req, res){

            var info = {
                method : req.method,
                url : req.url,
                status : {
                    code : null,
                    msg :  null
                },
                time : {
                    in : Date.now(),
                    out : null,
                    end : null
                },
                mem : {
                    rss : null,
                    heap : null,
                    used : null,
                    free : null
                },
                load : null
            }, end = res.end;

            res.end = function(){

                var last = arguments.length - 1,
                    temp = arguments[arguments.length - 1];

                info.time.out = Date.now();
                info.status.code = res.statusCode;
                info.status.msg = res.statusMessage;

                if(!temp){
                    arguments[last] = function(){

                        info.time.end = Date.now();

                        var memory = process.memoryUsage(),
                            load = os.loadavg()[0],
                            freemem = os.freemem();

                        info.mem.rss = memory.rss;
                        info.mem.heap = memory.heapTotal;
                        info.mem.used = memory.heapUsed;
                        info.mem.free = freemem;
                        info.load = load;

                        callback(info);
                    };
                }else if(typeof temp === 'function'){
                    arguments[last] = function(){

                        info.time.end = Date.now();

                        temp();

                        var memory = process.memoryUsage(),
                            load = os.loadavg()[0],
                            freemem = os.freemem();

                        info.mem.rss = memory.rss;
                        info.mem.heap = memory.heapTotal;
                        info.mem.used = memory.heapUsed;
                        info.mem.free = freemem;
                        info.load = load;

                        callback(info);
                    };
                }

                return end.apply(res, arguments);
            };
        });

        return server;
    };
};

exports.wrap = function(callback){
    wrapCreateServer(http, http.createServer, callback);
    wrapCreateServer(https, https.createServer, callback);
};
