var fs = require('fs');
var path = require('path');
var config = require('../config');

const filename = path.join(__dirname, '../config.xml');
let cordovaConfig = fs.readFileSync(filename, { encoding: 'UTF-8' });
cordovaConfig = cordovaConfig.replace('{{ MAPS_ANDROID }}', config.private.gmaps.androidKey);
cordovaConfig = cordovaConfig.replace('{{ MAPS_IOS }}', config.private.gmaps.iosKey);
fs.writeFileSync(filename, cordovaConfig,  { encoding: 'UTF-8' });
