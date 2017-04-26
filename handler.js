let handlers = {
	// command: handler
};

module.exports = {
	handle: (message, event, bot) => {
		if (handlers[message.command])
			handlers[message.command](message, event, bot);
	},

	register: (command, handler) => {
		if (typeof(handler) !== 'function') // wat
			throw `Invalid or undefined handler for '${command}'`;
		handlers[command] = handler;
	},

	unregister: (command) => {
		if (!handlers[command])
			throw `Unregistering non-existant handler '${command}'`;
		delete handlers[command];
	}
}