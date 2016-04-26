/**
 * Created by synder on 16/4/21.
 */

var configure = require('./configure');
var Reporter = require('./Reporter');
var REPORT_URL = configure.REPORT_URL;
var MSG_TYPE = configure.PROCESS_MSG_TYPE;

var ifExitByUser = false;

var reporter = new Reporter({
    host : process.argv[2],
    port : process.argv[3],
    appName : process.argv[4],
    appKey : process.argv[5]
});

var masterProcessId = process.argv[6];

//this process will exit
process.on('SIGINT', function() {
    ifExitByUser = true;
    reporter.report(REPORT_URL.APP_STOP_EVENT.METHOD, REPORT_URL.APP_STOP_EVENT.URL, false, {
        time : Date.now()
    });
    setTimeout(function(){
        process.exit(0);
    }, 500);
});

//master process crash
process.on('disconnect', function(){
    if(!ifExitByUser){
        reporter.report(REPORT_URL.APP_CRASH_EVENT.METHOD, REPORT_URL.APP_CRASH_EVENT.URL, false, {
            time : Date.now(),
            pid : masterProcessId,
            master: true
        }, function(){
            process.exit(0);
        });
    }
});

/**
 * 智能向主进程询问进程信息
 * */
//系统空闲时间
var lastReportProcessInfoTime = 0;

setInterval(function(){
    if(Date.now() - lastReportProcessInfoTime > 30000){
        process.send({type: MSG_TYPE.SYS_NODE_APP_PROCESS_INFO});
    }
}, 1000);

process.on('message', function(message){

    switch (message.type){
        //报告系统信息
        case MSG_TYPE.SYS_INFO: {
            var SYS = REPORT_URL.SYS;
            reporter.report(SYS.METHOD, SYS.URL, false, message.data);
        } break;

        //报告NODE.JS信息
        case MSG_TYPE.SYS_NODE_INFO: {
            var SYS_NODE = REPORT_URL.SYS_NODE;
            reporter.report(SYS_NODE.METHOD, SYS_NODE.URL, false, message.data);
        } break;

        //报告应用信息
        case MSG_TYPE.SYS_NODE_APP_INFO: {
            var SYS_NODE_APP = REPORT_URL.SYS_NODE_APP;
            reporter.report(SYS_NODE_APP.METHOD, SYS_NODE_APP.URL, false, message.data);
        } break;

        //报告应用进程信息
        case MSG_TYPE.SYS_NODE_APP_PROCESS_INFO: {
            var SYS_NODE_APP_PROCESS = REPORT_URL.SYS_NODE_APP_PROCESS;
            reporter.report(SYS_NODE_APP_PROCESS.METHOD, SYS_NODE_APP_PROCESS.URL, false, message.data);
        } break;

        //报告WEB应用事务信息
        case MSG_TYPE.SYS_NODE_APP_WEBTRANS_INFO: {
            var SYS_NODE_APP_WEBTRANS = REPORT_URL.SYS_NODE_APP_WEBTRANS;
            lastReportProcessInfoTime = Date.now();
            reporter.report(SYS_NODE_APP_WEBTRANS.METHOD, SYS_NODE_APP_WEBTRANS.URL, false, message.data);
        } break;

        //报告应用启动事件
        case MSG_TYPE.APP_START_EVENT: {
            reporter.report(REPORT_URL.APP_START_EVENT.METHOD, REPORT_URL.APP_START_EVENT.URL, false, {
                time : Date.now()
            });
        } break;

        //报告应用停止事件
        case MSG_TYPE.APP_STOP_EVENT: {
            reporter.report(REPORT_URL.APP_STOP_EVENT.METHOD, REPORT_URL.APP_STOP_EVENT.URL, false, message.data);
        } break;

        //报告应用错误事件
        case MSG_TYPE.APP_ERROR_EVENT: {
            reporter.report(REPORT_URL.APP_ERROR_EVENT.METHOD, REPORT_URL.APP_ERROR_EVENT.URL, false, message.data);
        } break;

        //报告应用崩溃事件
        case MSG_TYPE.APP_CRASH_EVENT: {
            reporter.report(REPORT_URL.APP_CRASH_EVENT.METHOD, REPORT_URL.APP_CRASH_EVENT.URL, false, message.data);
        } break;
    }
});