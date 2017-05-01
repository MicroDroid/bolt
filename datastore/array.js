const Logger = require('../logger');

let store = [];

module.exports = {
	get: key => new Promise((resolve, reject) => resolve(store[key])),
	set: (key, value) => new Promise((resolve, reject) => {store[key] = value; resolve()}),
}

Logger.info('Array datastore ready');