const Helpers = require('../helpers');

let todos = [
	// user: todos[]
];

module.exports = {
	description: 'Simple todo list management',

	onCreate: (datastore, bot) => {
		datastore.get('todos')
			.then(json => {
				todos = json ? JSON.parse(json) : [];
			}).catch(e => {
				todos = [];
			});
	},

	handle: (message, event, datastore, bot) => {
		const matches = (/(\-(\d+)|(.+))/).exec(message.args);

		if (!matches)
			return bot.postMessage(event.channel, todos[event.user] && todos[event.user].length > 0 ? todos[event.user].map((t, i) => `${i+1}. ${t}`).join('\n') : 'You have no tasks.');

		if (!todos[event.user])
			todos[event.user] = [];

		if (matches[2])
			todos[event.user].pop(matches[2])
		else
			todos[event.user].push(matches[3]);

		// Save todos
		datastore.set('todos', JSON.stringify(todos)).catch(console.log);
		
		bot._api('reactions.add', {name: 'thumbsup', channel: 'C54UQ9N8M', timestamp: event.ts});
	}
}