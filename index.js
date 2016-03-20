"use strict";

var _ = require('lodash');
var moment = require('moment');
var tls = require('tls');
var url = require('url');

function checkCertExpiry(targetUrl, callback) {
    var target = { host: 'unknown', port: 0, valid_to: new Date(0), daysLeft: 0 };

    try {
        target = url.parse(targetUrl);
        target.host = target.host || targetUrl;
        target.port = target.port || 443;
    } catch (err) {
        callback(err, target);
        return;
    }

    var sd = tls.connect(target.port, target.host, function () {
        target.valid_to = sd.getPeerCertificate().valid_to; 
        target.daysLeft = moment(new Date(target.valid_to)).diff(new Date(), 'days');
        sd.end();
        callback(null, target);
    });

    sd.on('error', function (err) {
        callback(_.extend(err, target), target);
    });
}

module.exports = checkCertExpiry;
