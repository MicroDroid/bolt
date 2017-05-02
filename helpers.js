module.exports = {
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
	}
}