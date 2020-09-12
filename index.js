"use strict";

const moment = require('moment');
const tls = require('tls');
const url = require('url');

function checkCertExpiration(targetUrl) {
    return new Promise((resolve, reject) => {
        const result = {};
        let target;

        try {
            target = url.parse(targetUrl);
            result.host = target.host = target.host || targetUrl;
            result.port = target.port = target.port || 443;
            target.protocol = target.protocol || 'https:';
        } catch (err) {
            err.name = 'CHECK_CERT_EXPIRATION_URL_PARSE';
            err.targetUrl = targetUrl;
            reject(err);
            return;
        }

        if (target.protocol !== 'https:') {
            let err = new Error('protocol is not https');
            err.name = 'CHECK_CERT_EXPIRATION_BAD_PROTOCOL';
            reject(err);
            return;
        }

        const sd = tls.connect(target.port, target.host, {
            servername: target.host,
        }, () => {
            const peerCertificate = sd.getPeerCertificate(true);
            result.valid_to = new Date(peerCertificate.valid_to).toJSON(); // ISO8601
            result.daysLeft = moment(result.valid_to, moment.ISO_8601).diff(moment(), 'days');
            result.fingerprint = peerCertificate.issuerCertificate.fingerprint;
            sd.end();
            resolve(result);
        });

        sd.on('error', function (err) {
            err.name = 'CHECK_CERT_EXPIRATION_COMM';
            reject(err);
        });
    });
}

module.exports = checkCertExpiration;
