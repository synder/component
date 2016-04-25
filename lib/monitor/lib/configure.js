/**
 * Created by synder on 16/4/23.
 */

/**
 *  process message type
 * */
exports.PROCESS_MSG_TYPE = {
    SYS_INFO : 1,
    SYS_NODE_INFO : 2,
    SYS_NODE_APP_INFO : 3,
    SYS_NODE_APP_PROCESS_INFO : 4,
    SYS_NODE_APP_WEBTRANS_INFO : 5,

    APP_START_EVENT : 6,
    APP_STOP_EVENT : 7,
    APP_ERROR_EVENT : 8,
    APP_CRASH_EVENT : 9
};

exports.REPORT_URL = {
    SYS:{
        METHOD : 'PUT',
        URL : '/system/info'
    },
    SYS_NODE: {
        METHOD : 'PUT',
        URL : '/system/node/info/'
    },
    SYS_NODE_APP: {
        METHOD : 'PUT',
        URL : '/system/node/app/info'
    },
    SYS_NODE_APP_PROCESS: {
        METHOD : 'PUT',
        URL : '/system/node/app/process/info/'
    },
    SYS_NODE_APP_WEBTRANS : {
        METHOD : 'PUT',
        URL : '/system/node/app/web/transaction'
    },

    APP_START_EVENT : {
        METHOD : 'PUT',
        URL : '/app/event/start'
    },

    APP_STOP_EVENT : {
        METHOD : 'PUT',
        URL : '/app/event/stop'
    },

    APP_ERROR_EVENT : {
        METHOD : 'PUT',
        URL : '/app/event/error'
    },

    APP_CRASH_EVENT : {
        METHOD : 'PUT',
        URL : '/app/event/crash'
    }
};