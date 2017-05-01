const Logger = require('../logger');

Logger.info('Connecting to datastore..');

if (!process.env.DATASTORE)
	Logger.warn('No datastore configured. Using array');

if (!process.env.DATASTORE || process.env.DATASTORE === 'array')
	module.exports = require('./array');
else if (process.env.DATASTORE === 'redis')
	module.exports = require('./redis');
else {
	Logger.err(`Unknown datastore type: ${process.env.DATASTORE}`);
	process.exit(0);
}