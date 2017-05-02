module.exports = {
	adminOnly: true,
	description: 'Says something',

	handle: (message, event, datastore, bot) => {
		bot.postMessage(event.channel, message.args);
	}
}