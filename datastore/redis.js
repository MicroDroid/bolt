const Logger = require('../logger');
const Redis = require('redis');

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
	Logger.err('Redis datastore is not configured!');
	process.exit(0);
}

const client = Redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
	db: process.env.REDIS_DB,
});

client.on('error', err => {
	Logger.err(`Connection to redis failed: ${err}`);
	process.exit(0);
})

client.on('ready', () => {
	Logger.info('Connected to redis datastore');
})

module.exports = {
	get: key => {
		return new Promise((resolve, reject) => {
			client.get(key, (err, result) => {
				if (err)
					reject(err);
				else resolve(result);
			});
		});
	},

	set: (key, value) => {
		return new Promise((resolve, reject) => {
			client.set(key, value, (err) => {
				if (err)
					reject(err);
				else resolve();
			})
		})
	}
}
