var path = require('path');
require('dotenv').config({ silent: true });
var convict = require('convict');

var conf = convict({
  apiKey: {
    doc: 'Firebase API key',
    format: String,
    default: 'API_KEY',
    env: 'API_KEY',
  },
  authDomain: {
    doc: 'Firebase Auth domain',
    format: String,
    default: 'http://localhost:8080',
    env: 'AUTH_DOMAIN',
  },
  databaseUrl: {
    doc: 'Firebase DB url',
    format: String,
    default: 'http://localhost:9090',
    env: 'DATABASE_URL',
  },
  storageBucket: {
    doc: 'Firebase Storage Bucket',
    format: String,
    default: 'BUCKET',
    env: 'STORAGE_BUCKET',
  },
  messagingSenderId: {
    doc: 'Firebase Messaging Sender ID',
    format: String,
    default: '0000000000',
    env: 'MESSAGING_SENDER_ID',
  },
});

// Perform validation
conf.validate({
  strict: true,
});

module.exports = conf.getProperties();
