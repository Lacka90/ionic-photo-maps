var fs = require('fs');
var path = require('path');
var config = require('../config');
const configClone = JSON.parse(JSON.stringify(config));
delete configClone.private;

const filename = path.join(__dirname, '../src/config.json');
fs.writeFileSync(filename, JSON.stringify(configClone));
