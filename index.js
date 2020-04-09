"use strict";

const _ = require('lodash');
const moment = require('moment');
const tls = require('tls');
const url = require('url');

function checkCertExpiration(targetUrl, callback) {
    let target = { host: 'unknown', port: 0, valid_to: new Date(0), daysLeft: 0 };

    try {
        target = url.parse(targetUrl);
        target.host = target.host || targetUrl;
        target.port = target.port || 443;
        target.protocol = target.protocol || 'https:';
    } catch (err) {
        callback(err, target);
        return;
    }

    if (target.protocol !== 'https:') {
        callback(_.extend(new Error('protocol is not https'), target), target);
        return;
    }

    const sd = tls.connect(target.port, target.host, {servername: target.host}, () => {
        target.valid_to = new Date(sd.getPeerCertificate().valid_to).toJSON(); // ISO8601
        target.daysLeft = moment(target.valid_to, moment.ISO_8601).diff(moment(), 'days');
        sd.end();
        callback(null, target);
    });

    sd.on('error', function (err) {
        callback(_.extend(err, target), target);
    });
}

module.exports = checkCertExpiration;
