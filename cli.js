import pkg from './package.json.cjs';
import yosay from './index.js';
import _taketalk from 'taketalk';
_taketalk({
    init(input, options) {
        console.log(yosay(input, options));
    },
    help() {
        console.log(`
  ${ pkg.description }

  Usage
    $ yosay <string>
    $ yosay <string> --maxLength 8
    $ echo <string> | yosay

  Example
    $ yosay 'Sindre is a horse'
    ${ yosay('Sindre is a horse') }`);
    },
    version: pkg.version
});