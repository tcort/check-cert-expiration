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
    host=does-not-exist.example.com port=443 message="getaddrinfo ENOTFOUND"

## API

### checkCertExpiration(targetUrl, callback)

Parameters:

* `targetUrl` - a server URL (e.g. `https://www.tomcort.com/`) or hostname (e.g. `tomcort.com`).
* `callback` - a callback function which accepts `(err, result`). `result` will have the following properties:
 * `host` - hostname of the host checked.
 * `port` - TCP port number of the host checked,
 * `valid_to` - ISO8601 timestamp string.
 * `daysLeft` - how many days left until the certificate expires.

### Examples

    "use strict";

    var checkCertExpiration = require('check-cert-expiration');

    checkCertExpiration('tomcort.com', function (err, result) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("%s days until the certificate expires for %s:%s", result.daysLeft, result.host, result.port);
    });

## Testing

    npm test

## License

See [LICENSE.md](https://github.com/tcort/check-cert-expiration/blob/master/LICENSE.md)
