var fs = require('fs');
var path = require('path');
var config = require('../config');

const filename = path.join(__dirname, '../config.xml');
let cordovaConfig = fs.readFileSync(filename, { encoding: 'UTF-8' });
cordovaConfig = cordovaConfig.replace(config.private.gmaps.androidKey, '{{ MAPS_ANDROID }}');
cordovaConfig = cordovaConfig.replace(config.private.gmaps.iosKey, '{{ MAPS_IOS }}');
fs.writeFileSync(filename, cordovaConfig,  { encoding: 'UTF-8' });
