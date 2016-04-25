/**
 * Created by synder on 16/4/15.
 * @desc 用于在线查看pdf文档
 */

var fs = require('fs');
var path = require('path');

exports.page = function (req, res, next) {
    res.render('pdf/index');
};





exports.data = function (req, res, next) {

    var filePath = path.join(config.public.project.path, '/public/upload/mqtt.pdf');

    fs.readFile(filePath, function (err, data) {

        if (err) {
            return next(err);
        }

        res.set({
            'Content-Type': 'application/pdf'
        });

        res.send(data);
    });
};