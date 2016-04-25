/**
 * Created by synder on 16/4/23.
 */

var METHODS = require('./method');

/**
 * shou warn
 * */
var warn = function (option) {
    if (option.v !== null && option.v !== undefined && typeof option.v !== 'number') {
        console.warn('Number type version is fast than other type version');
    }

    if (option.c !== null && option.c !== undefined && typeof option.c !== 'number') {
        console.warn('Number type channel is fast than other type channel');
    }

    if(option.v === 0){
        throw new Error('version can not set to 0');
    }

    if(option.c === 0){
        throw new Error('channel can not set to 0');
    }

};

/***
 * wraper method
 */
var wraper = function (option, handler) {
    return function (req, res, next) {
        console.log(req.version, option);
        console.log(req.channel, option);
        if (option.v) {
            if (req.version != option.v) {
                return next();
            }
        }

        if (option.c) {
            if (req.channel != option.c) {
                return next();
            }
        }

        handler(req, res, next);
    };
};


exports.method = function (Prototype, instance, router) {
    /**
     * 挂接方法
     * */
    METHODS.forEach(function (method) {

        /***
         * router.get(function(req, res, next){})
         * router.get({v:1, c:1}, function(req, res, next){});
         * router.get('/', function(req, res, next){});
         * router.get(/^name$/, function(req, res, next){});
         * router.get('/', {v:1, c:1}, function(req, res, next){});
         * */
        Prototype.prototype[method] = function () {

            if (typeof arguments[0] === 'function') {
                for (var x = 0; x < arguments.length; x++) {
                    router[method](arguments[x]);
                }
                return instance;
            }

            if (typeof arguments[1] === 'function') {
                if (!arguments[0].v && !arguments[0].c) {
                    for (var z = 1; z < arguments.length; z++) {
                        router[method](arguments[0], arguments[z]);
                    }
                } else {
                    warn(arguments[0]);
                    for (var y = 1; y < arguments.length; y++) {
                        router[method](wraper(arguments[0], arguments[y]));
                    }
                }
                return instance;
            }

            if (typeof arguments[1] === 'object') {

                warn(arguments[1]);

                for (var i = 2; i < arguments.length; i++) {
                    if (typeof arguments[i]) {
                        router[method](arguments[0], wraper(arguments[1], arguments[i]));
                    }
                }

                return instance;
            }

            throw new Error('param error');
        };

    });
};
