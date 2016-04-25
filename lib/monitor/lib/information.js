/**
 * Created by synder on 16/4/21.
 */

var os = require('os');

exports.system = {
    info: function () {
        return {
            hostname: os.hostname(),
            type: os.type(),
            platform: os.platform(),
            arch: os.arch(),
            release: os.release(),
            uptime: os.uptime(),
            cpus: os.cpus().length,
            totalmem: os.totalmem()
        };
    },
    node: {
        info: function () {
            return {
                node: process.versions.node,
                v8: process.versions.v8,
                uv: process.versions.uv,
                zlib: process.versions.zlib,
                ares: process.versions.ares,
                icu: process.versions.icu,
                modules: process.versions.modules,
                openssl: process.versions.openssl
            };
        },
        app: {
            info: function () {
                return {
                    dir: process.cwd()
                };
            },
            process: {
                info: function () {

                    var memoryUsage = process.memoryUsage();

                    return {
                        ppid: null,
                        pid: process.pid,
                        time: Date.now(),
                        load: Math.round(os.loadavg()[0] * 100),
                        memory: {
                            rss: memoryUsage.rss >> 10,
                            heap: memoryUsage.heapTotal >> 10,
                            used: memoryUsage.heapUsed >> 10,
                            free: os.freemem() / 1024 >> 10
                        }
                    }
                }
            }
        }
    }
};
