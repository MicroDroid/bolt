const moment = require('moment');
const reltime = require('reltime');
const Helpers = require('../helpers');

module.exports = {
	description: 'Reminds you or someone else to do stuff',

	handle: (message, event, datastore, bot) => {
		const matches = (/(me|<@([\w\d]+)>)\s+(to\s+)*(.+)\s+in\s+([\s\d\w]+)/).exec(message.args);

		if (!matches)
			return bot.postMessage(event.channel, `Syntax is:\n\`\`\`{process.env.PREFIX} remind <user> [to] do stuff... <in time>\`\`\``);

		const user = matches[1] === 'me' ? event.user : matches[2];
		const reminder = matches[4];
		const target = matches[5];

		const start = Date.now();

		setTimeout(() => {
			const timePassed = moment(start).fromNow();
			const author = matches[1] === 'me' ? 'you' : Helpers.usernameFromId(event.user);
			bot.postMessage(event.channel, `<@${user}> ${reminder} - _from ${author}, ${timePassed}_`);
		}, reltime.parse(new Date(), target) - Date.now());
		
		bot._api('reactions.add', {name: 'thumbsup', channel: 'C54UQ9N8M', timestamp: event.ts});
        // bot.postMessage(event.channel, ':thumbsup::skin-tone-3:');
	}
}