/**
 * @author synder
 * @date 16/1/13
 * @desc 用户Session 管理
 */

/**
 * 1.session是一个全局的东西，需要跨进程使用，所以最好是在主进程建立，传递到子进程
 * 2.针对大型程序，最好是将session存放在集中的地方，比如redis或者mongodb里面
 * 3.session需要安全性，防止被偷窥，防止被串改
 * */
var Session = function(config){
    this._age = config.age || 3600 * 24 * 30;              //默认最长30天
    this.__repository = config.repository;                 //session存储的仓库
    this.__sessions = {};
    this.__init();
};

Session.prototype.__init = function(){

    var self = this;

    if(self.__repository != null){
        if(!!self.__repository.get){
            throw new Error('repository must have two method get(key, callback) & set(key, age, value, callback)');
        }

        if(!!self.__repository.set){
            throw new Error('repository must have two method get(key, callback) & set(key, age, value, callback)');
        }
    }else{
        //采用本地存储时，每隔60秒删除过期的key
        setInterval(function(){
            for(var key in self.__sessions){
                var temp = self.__sessions[key];
                if((temp.time + temp.age) < Date.now()){
                    delete this.__sessions[key];
                }
            }
        }, 60000);
    }
};

/**
 * @desc 根据一个key获取session
 * */
Session.prototype.get = function(key, callback){

    if(this.__repository){
        return this.__repository.get(key, callback);
    }

    var temp = this.__sessions[key];

    if(!temp){
        return callback(null, null);
    }

    if((temp.time + temp.age) < Date.now()){
        delete this.__sessions[key];
        callback(null, null);
    }else{
        callback(null, this.__sessions[key]);
    }
};

/**
 * @desc 设置一个session值
 * */
Session.prototype.set = function(key, value, callback){

    var age = this._age;

    if(this.__repository){
        return this.__repository.set(key, age, value, callback);
    }

    this.__sessions[key] = {
        age : age * 1000,
        time : Date.now(),
        value : value
    };

    callback(null, true);
};
