# check-cert-expiration

Queries an SSL/TLS server and reports when its certificate expires.

## Installation

    npm install --global check-cert-expiration # for the command line utility
    npm install --save check-cert-expiration # for the library function

## Command Line Interface

The `check-cert-expiration` script accepts 1 or more URLs as command line arguments and prints the results.

### Examples

Happy path (return code is `0`):

    $ check-cert-expiration tomcort.com github.com
    host=tomcort.com port=443 valid_to=2018-03-09T10:34:20.000Z daysLeft=89
    host=github.com port=443 valid_to=2018-05-17T12:00:00.000Z daysLeft=159

Error path (return code is `1`):

    $ check-cert-expiration does-not-exist.example.com
    { CHECK_CERT_EXPIRATION_COMM: getaddrinfo ENOTFOUND does-not-exist.example.com does-not-exist.example.com:443
        at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:56:26)
      errno: 'ENOTFOUND',
      code: 'ENOTFOUND',
      syscall: 'getaddrinfo',
      hostname: 'does-not-exist.example.com',
      host: 'does-not-exist.example.com',
      port: 443,
      name: 'CHECK_CERT_EXPIRATION_COMM' }

## API

### checkCertExpiration(targetUrl)

Parameters:

* `targetUrl` - a server URL (e.g. `https://www.tomcort.com/`) or hostname (e.g. `tomcort.com`).

Return Value:

* result object with the following properties:
  * `host` - hostname of the host checked.
  * `port` - TCP port number of the host checked,
  * `valid_to` - ISO8601 timestamp string.
  * `daysLeft` - how many days left until the certificate expires.

Errors:

Errors with the following values of `err.name` may occur:
* `CHECK_CERT_EXPIRATION_URL_PARSE` - when a URL parse error is encountered.
* `CHECK_CERT_EXPIRATION_BAD_PROTOCOL` - when the protocol portion of the URL is not `https:`
* `CHECK_CERT_EXPIRATION_COMM` - when there is some type of communications error. 

### Examples

    'use strict';

    const checkCertExpiration = require('check-cert-expiration');

    (async function () {
        try {
            const { daysLeft, host, port } = await checkCertExpiration('tomcort.com');
            console.log(`${daysLeft} days until the certificate expires for ${host}:${port}`);
            process.exit(0);
        } catch (err) {
            console.error(`${err.name}:${err.message}`);
            process.exit(1);
        }
    })();

## Testing

    npm test

## License

See [LICENSE.md](https://github.com/tcort/check-cert-expiration/blob/master/LICENSE.md)
