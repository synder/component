/**
 * Created by synder on 15/9/19.
 *
 * @desc api请求方法封装
 */

var url = require('url');
var request = require('request');

var signature = require('./signature.js');

/**
 * @params config
 * {
 *  config.protocol;  //api使用协议
 *  config.host;      //api主机地址
 *  config.port;      //api主机端口
 *  config.appKey;    //appKey    如果需要app验证需要添加这个参数
 *  config.appSecret; //appSecret 如果需要app验证需要添加这个参数, 表示app秘钥
 *  config.timeout;   //api请求默认超时时间
 * */
var Requester = function(config){

    if(!config.protocol){
        throw new Error('config.protocol should be http or https');
    }

    if(!config.host){
        throw new Error('config.host should not be null or undefined');
    }

    if(!config.port){
        throw new Error('config.port should not be null or undefined');
    }

    this.protocol = config.protocol;
    this.host = config.host;
    this.port = config.port;

    this._appKey = config._appKey;
    this._appSecret = config._appSecret;

    this.timeout = config.timeout || 200;
};

/**
 * @desc 获取请求url
 * */
Requester.prototype.__url = function(options){

    return url.format({
        protocol : this.protocol,
        hostname : this.host,
        port : this.port,
        pathname : options.path,
        query : options.query
    });

};

/**
 * @desc 请求签名
 * */
Requester.prototype.__sign = function(options) {

    var data = options.data;

    var timestamp = Date.now() + '';

    return signature.sign(this._appKey, this._appSecret, timestamp, data);
};


/**
 * @desc 初始化请求参数
 * */
Requester.prototype._init = function( method, options){

    var self = this;

    if(!options.version){
        throw new Error('option.version is null');
    }

    if(!options.channel){
        throw new Error('option.channel is null');
    }

    if(!options.path){
        throw new Error('option.path is null');
    }

    if(options.query && !(options.query instanceof  Object)){
        throw new Error('option.query must be an Object instance');
    }

    if(options.upload && !(options.upload instanceof  Object)){
        throw new Error('option.upload must be an Object instance');
    }

    var requestUrl = self.__url(options);

    method = method.toUpperCase();

    var requestOptions = {
        method : method.toUpperCase(),
        url : requestUrl,
        timeout : options.timeout || self.timeout,
        headers : options.header || {}
    };

    if(options.auth){
        requestOptions.auth = options.auth;
    }

    if(self._appKey && self._appSecret){
        var temp = self.__sign(options);
        requestOptions.headers['X-AuthApp-AppKey'] = self._appKey;
        requestOptions.headers['X-AuthApp-Signature'] = temp.signature;
        requestOptions.headers['X-AuthApp-Timestamp'] = temp.timestamp;
    }

    requestOptions.headers['X-Api-Version'] = self.version;
    requestOptions.headers['X-Api-Channel'] = self.channel;

    if(method != 'POST' && method != 'PUT' && method != 'PATCH'){
        if(options.upload){
            throw new Error( method + ' can not send options.upload');
        }

        if(options.body){
            throw new Error( method + ' can not send options.body');
        }
    }

    if(options.upload){
        requestOptions.formData = options.upload;
    }else{
        if(options.body){
            if(options.body instanceof Object){
                requestOptions.json = true;
            }
            requestOptions.body = options.body;
        }
    }

    return requestOptions;
};

/**
 * @params options
 * options.header   //自定义的header参数 {'Content-Type':'Application/Json'}
 * options.channel  //Api请求频道 'DESKTOP' | 'IOS' | 'ANDROID'
 * options.version  //Api请求版本 10
 * options.query    //url的查询参数
 * options.auth     //基础验证
 * */
Requester.prototype.header = function(options, callback) {
    request(this._init('header', options), callback);
};


/**
 * @params options
 * options.header   //自定义的header参数 {'Content-Type':'Application/Json'}
 * options.channel  //Api请求频道 'DESKTOP' | 'IOS' | 'ANDROID'
 * options.version  //Api请求版本 10
 * options.query    //url的查询参数
 * options.auth     //基础验证
 * */
Requester.prototype.get = function(options, callback){
    request(this._init('get', options), callback);
};

/**
 * @params options
 * options.header   //自定义的header参数 {'Content-Type':'Application/Json'}
 * options.channel  //Api请求频道 'DESKTOP' | 'IOS' | 'ANDROID'
 * options.version  //Api请求版本 10
 * options.query    //url的查询参数
 * options.auth     //基础验证
 * */
Requester.prototype.delete = function(options, callback){
    request(this._init('delete', options), callback);
};


/**
 * @params options
 * options.header   //自定义的header参数 {'Content-Type':'Application/Json'}
 * options.channel  //Api请求频道 'DESKTOP' | 'IOS' | 'ANDROID'
 * options.version  //Api请求版本 10
 * options.query    //url的查询参数
 * options.body     //Body中以Json方式发送的参数 { name : 'sam', age : 20}
 * options.upload   //以Form-Data方式上传数据 { avatar : new Buffer(), card : fs.createReadStream()}
 * options.auth     //基础验证
 * */
Requester.prototype.post = function(options, callback){
    request(this._init('post', options), callback);
};


/**
 * @params options
 * options.header   //自定义的header参数 {'Content-Type':'Application/Json'}
 * options.channel  //Api请求频道 'DESKTOP' | 'IOS' | 'ANDROID'
 * options.version  //Api请求版本 10
 * options.query    //url的查询参数
 * options.body     //Body中以Json方式发送的参数 { name : 'sam', age : 20}
 * options.upload   //以Form-Data方式上传数据 { avatar : new Buffer(), card : fs.createReadStream()}
 * options.auth     //基础验证
 * */
Requester.prototype.put = function(options, callback){
    request(this._init('put', options), callback);
};

/**
 * @params options
 * options.header   //自定义的header参数 {'Content-Type':'Application/Json'}
 * options.channel  //Api请求频道 'DESKTOP' | 'IOS' | 'ANDROID'
 * options.version  //Api请求版本 10
 * options.query    //url的查询参数
 * options.body     //Body中以Json方式发送的参数 { name : 'sam', age : 20}
 * options.upload   //以Form-Data方式上传数据 { avatar : new Buffer(), card : fs.createReadStream()}
 * options.auth     //基础验证
 * */
Requester.prototype.patch = function(options, callback){
    request(this._init('patch', options), callback);
};


module.exports = Requester;