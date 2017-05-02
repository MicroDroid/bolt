const axios = require('axios');
const Logger = require('../logger');

module.exports = {
	handle: (message, event, datastore, bot) => {
		axios.get('http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json&key=' + message.args)
			.then(response => {
				bot.postMessage(event.channel, `${response.data.quoteAuthor} says: ${response.data.quoteText}`);
			}).catch(error => {
				Logger.err(error.toString());
				bot.postMessage(event.channel, 'API seems down');
			})
	}
}