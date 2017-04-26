require('dotenv').config();

const SlackBots = require('slackbots');
const Parser = require('./parser');
const Handler = require('./handler');
const Watch = require('watch');
const fs = require('fs');
const reload = require('require-reload')(require);

console.log('[+] Starting..');

fs.readdir('./plugins', (err, files) => {
	files.forEach(f => {
		const name = f.substr(0, f.length - 3);
		try {
			const Module = reload(`./plugins/${f}`);
			Handler.register(name, Module.handle);
			console.log(`[+] Loaded '${name}'`);
		} catch (e) {
			console.log(`[!] Failed to unload/load '${name}': ${e}`);
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
			Handler.register(name, Module.handle);
			console.log(`[+] Loaded '${name}'`);
		} else if (curr.nlink === 0) {
			// f was removed
			Handler.unregister(name);
			console.log(`[+] Unloaded '${name}'`);
		} else {
			// f was changed
			const Module = reload(`./${f}`);
			Handler.unregister(name);
			Handler.register(name, Module.handle);
			console.log(`[+] Reloaded '${name}'`);
		}
	} catch (e) {
		console.log(`[!] Failed to unload/load '${name}': ${e}`);
	}
});

const bot = new SlackBots({
	token: process.env.TOKEN,
	name: 'Bolt',
});

bot.on('message', data => {
	if (data.type === 'message') {
		console.log(`[+] ${data.user}: ${data.text}`);
		const message = data.text;
		const parsed = Parser.parse(message);

		if (parsed)
			Handler.handle(parsed);
	}
});

bot.on('start', () => {
	console.log('[+] Connected!');
});