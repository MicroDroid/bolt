const safeEval = require('safe-eval');

module.exports = {
	adminOnly: true,
	description: ':eyes:',

	handle: (message, event, datastore, bot) => {
		var result;

		try {
			result = safeEval(message.args, {
				env: process.env,
				bot, datastore
			});
		} catch (e) {
			result = e;
		}

		bot.postMessage(event.channel, '```\n' + result + '\n```');
	}
}