/**
 * Created by synder on 16/4/18.
 */

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1:1884');

client.on('connect', function () {
    setInterval(function(){
        client.publish('presence', new Date() + '');
    }, 100);
});