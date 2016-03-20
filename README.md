# check-cert-expiry

Queries an SSL/TLS server and reports when its certificate expires.

## Installation

    npm install --global check-cert-expiry # for the command line utility
    npm install --save check-cert-expiry # for the library function

## Command Line Interface

The `check-cert-expiry` script accepts 1 or more URLs as command line arguments and prints the results.

### Examples

Happy path (return code is `0`):

    $ check-cert-expiry tomcort.com github.com
    host=tomcort.com port=443 valid_to="Apr 15 13:54:00 2016 GMT" daysLeft=26
    host=github.com port=443 valid_to="May 17 12:00:00 2018 GMT" daysLeft=787

Error path (return code is `1`):

    $ check-cert-expiry does-not-exist.example.com
    host=does-not-exist.example.com port=443 message="getaddrinfo ENOTFOUND"

## API

### checkCertExpiry(targetUrl, callback)

Parameters:

* `targetUrl` - a server URL (e.g. `https://www.tomcort.com/`) or hostname (e.g. `tomcort.com`).
* `callback` - a callback function which accepts `(err, result`). `result` will have the following properties:
 * `host` - hostname of the host checked.
 * `port` - TCP port number of the host checked,
 * `valid_to` - JavaScript Date string.
 * `daysLeft` - how many days left until the certificate expires.

### Examples

    "use strict";

    var checkCertExpiry = require('check-cert-expiry');

    checkCertExpiry('tomcort.com', function (err, result) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("%s days until the certificate expires for %s:%s", result.daysLeft, result.host, result.port);
    });

## Testing

    npm test

## License

See [LICENSE.md](https://github.com/tcort/check-cert-expiry/blob/master/LICENSE.md)
