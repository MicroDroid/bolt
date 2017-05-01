require('dotenv').config();

const SlackBots = require('slackbots');
const Parser = require('./parser');
const ModuleManager = require('./module-manager');
const Watch = require('watch');
const fs = require('fs');
const reload = require('require-reload')(require);
const logger = require('./logger');

logger.info('Starting..');

fs.readdir('./plugins', (err, files) => {
	files.filter(f => f.endsWith('.js')).forEach(f => {
		const name = f.substr(0, f.length - 3);
		try {
			const module = reload(`./plugins/${f}`);
			ModuleManager.register(name, module);
			logger.info(`Loaded '${name}'`);
		} catch (e) {
			logger.warn(`Failed to unload/load '${name}': ${e}`);
		}
	});
});

Watch.watchTree('./plugins', {
    filter: filename => filename.endsWith('.js')
}, (f, curr, prev) => {
	const name = typeof(f) === 'string' ? (f.startsWith('plugins/') ? f.slice(8, -3): f) : '';
	try {
		if (typeof f == 'object' && prev === null && curr === null) {
			// Finished walking the tree
		} else if (prev === null) {
			// f is a new file
			const Module = reload(`./${f}`);
			ModuleManager.register(name, module);
			logger.info(`Loaded '${name}'`);
		} else if (curr.nlink === 0) {
			// f was removed
			ModuleManager.unregister(name);
			logger.info(`Unloaded '${name}'`);
		} else {
			// f was changed
			const module = reload(`./${f}`);
			ModuleManager.unregister(name);
			ModuleManager.register(name, module);
			logger.info(`Reloaded '${name}'`);
		}
	} catch (e) {
		logger.warn(`Failed to reload '${name}': ${e}`);
	}
});

const bot = new SlackBots({
	token: process.env.TOKEN,
	name: 'Bolt',
	as_user: false,
});

const originalPostMessage = bot.postMessage;

bot.postMessage = function (id, text, params) {
	logger.send(`${id}: ${text}`);
	originalPostMessage.call(this, id, text, params);
}

bot.on('message', data => {
	if (data.type === 'message' && data.subtype !== 'bot_message') {
		logger.recv(`${data.user}@${data.channel}: ${data.text}`);
		const message = data.text;
		const parsed = Parser.parse(message);

        if (parsed)
            ModuleManager.handle(parsed, data, bot);
    }
});

bot.on('start', () => {
	logger.info('Connected!');
});