
/**
 * Created by synder on 16/4/20.
 * @desc a monitor agent
 */

var path = require('path');
var cluster = require('cluster');
var wraper = require('./lib/wraper');
var Daemon = require('./lib/Daemon');
var configure = require('./lib/configure');
var information = require('./lib/information');

var MSG_TYPE = configure.PROCESS_MSG_TYPE;
var DIR_NAME = __dirname;

/**
 * @desc start monitor
 * */
exports.start = function(config){

    if(cluster.isMaster){

        var masterProcessId = process.pid;

        var configArray = [
            config.host,
            config.port,
            config.appName,
            config.appKey,
            masterProcessId
        ];

        var daemon = new Daemon();
        var childModule = path.join(DIR_NAME, './lib/agent.js');

        //start child process with daemon
        daemon.start(childModule, configArray);

        var isStartWithCluster = false;
        var workerProcessCount = 0;

        //wrap http and https function to get web transaction
        wraper.wrap(function(data){
            //报告WEB事务
            if(!isStartWithCluster){
                daemon.message(childModule, {
                    type : MSG_TYPE.SYS_NODE_APP_WEBTRANS_INFO,
                    data : data
                });
            }
        });

        //recode work process number
        cluster.on('fork', function(work){
            isStartWithCluster = true;
            workerProcessCount++;

            work.on('exit', function(code){
                if(code !== 0){
                    daemon.message(childModule, {
                        type : MSG_TYPE.APP_CRASH_EVENT,
                        data : {
                            pid : work.process.pid,
                            time: Date.now(),
                            master : false
                        }
                    });
                }
            });
        });

        //report online info
        cluster.on('online', function(){
            daemon.message(childModule, {
                type : MSG_TYPE.SYS_NODE_APP_INFO,
                data : {
                    dir : information.system.node.app.info(),
                    cluster : isStartWithCluster,
                    worker : workerProcessCount
                }
            });
        });

        //receive child process message
        cluster.on('message', function(message){
            if(isStartWithCluster){
                if(message.type === MSG_TYPE.SYS_NODE_APP_PROCESS_INFO){
                    message.data.ppid = process.pid;
                    daemon.message(childModule, {
                        type: message.type,
                        data: message.data
                    });
                } else if (message.type === MSG_TYPE.SYS_NODE_APP_WEBTRANS_INFO){
                    daemon.message(childModule, message);
                }
            }
        });

        //report system info
        daemon.message(childModule, {
            type : MSG_TYPE.SYS_INFO,
            data : information.system.info()
        });

        //report node info
        daemon.message(childModule, {
            type : MSG_TYPE.SYS_NODE_INFO,
            data : information.system.node.info()
        });

        //report application start event
        daemon.message(childModule, {
            type : MSG_TYPE.APP_START_EVENT,
            data:{
                time : Date.now()
            }
        });

        //report application info
        daemon.message(childModule, {
            type : MSG_TYPE.SYS_NODE_APP_INFO,
            data : {
                dir : information.system.node.app.info(),
                cluster : isStartWithCluster,
                worker : workerProcessCount
            }
        });

        //receive message from childModule
        daemon.receive(childModule, function(message){

            var processInfo = information.system.node.app.process.info();

            if(isStartWithCluster){
                //send message to child process to get process info
                for(var key in cluster.workers){
                    cluster.workers[key].process.send(message);
                }
                //report master info
                processInfo.ppid = processInfo.pid;
                daemon.message(childModule, {
                    type: message.type,
                    data: processInfo
                });
            }else{
                if(message.type === MSG_TYPE.SYS_NODE_APP_PROCESS_INFO){
                    processInfo.ppid = processInfo.pid;
                    daemon.message(childModule, {
                        type: message.type,
                        data: processInfo
                    });
                }
            }
        });
    }

    if(cluster.isWorker){

        //wrap http and https function to get web transaction
        wraper.wrap(function(data){
            process.send({
                type : MSG_TYPE.SYS_NODE_APP_WEBTRANS_INFO,
                data : data
            });
        });

        //receive message from master process
        process.on('message', function(message){
            if(message.type === MSG_TYPE.SYS_NODE_APP_PROCESS_INFO){
                var processInfo = information.system.node.app.process.info();
                process.send({
                    type : message.type,
                    data : processInfo
                });
            }
        });
    }
};
