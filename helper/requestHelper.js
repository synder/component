/**
 * Created by synder on 16/4/15.
 */

var Requester = require('../lib/Requester.js');

exports.apiRequester = new Requester({
    protocol: config.private.services.api.protocol,
    host: config.private.services.api.host,
    port: config.private.services.api.port,
    appKey: config.private.services.api._appKey,
    appSecret: config.private.services.api._appSecret,
    timeout: 200
});