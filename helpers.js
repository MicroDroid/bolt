const Logger = require('./logger');

const Helpers = {
	usernameFromId: id => {
	    const user = global.users ? global.users.members.filter(u => u.id === id) : [];
	    return user[0] ? user[0].name : null;
	},

	idFromUsername: username => {
		const user = global.users ? global.users.members.filter(u => u.name === username) : [];
		return user[0] ? user[0].id : null;
	},

	channelNameFromId: id => {
	    const channel = global.channels ? global.channels.channels.filter(c => c.id === id) : [];
	    return channel[0] ? channel[0].name : null;
	},

	isAdmin: id => {
	    try {
	        var admins = JSON.parse(process.env.ADMINS);
	            admins = typeof(admins) === 'string' ? [admins] : admins;

	        const username = Helpers.usernameFromId(id);

	        return admins.indexOf(username) !== -1;
	    } catch (e) {
	        Logger.warn('Failed to parse admins list');
	        return false;
	    }
	}
}

module.exports = Helpers;