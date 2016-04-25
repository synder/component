/**
 * Created by synder on 16/4/15.
 * @desc app 身份验证
 */

var crypto = require('crypto');

/**
 * @desc 对请求参数进行签名, 防止客户端伪装, 同时也防止数据伪造
 * */
exports.sign = function(appKey, appSecret, timestamp, other){

    if(!appKey){
        throw new Error('appKey should not be null or undefined');
    }

    if(!appSecret){
        throw new Error('appSecret should not be null or undefined');
    }

    appKey = appKey + '';

    appSecret = appSecret + '';

    other = other ? JSON.stringify(other) : '';

    timestamp = timestamp ? timestamp + '' : Date.now() + '';

    var temp = [appKey, appSecret, timestamp, other].sort();

    var signature = crypto.createHash('sha1').update(temp.join('')).digest('hex');

    return {
        timestamp : timestamp,
        signature : signature
    };
};

