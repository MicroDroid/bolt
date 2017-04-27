module.exports = {
	parse: str => {
		var command, args, argWords;

		command = str.split(' ')[0];

		if (!command.startsWith(process.env.PREFIX))
			return false;

		command = command.substr(process.env.PREFIX.length);

		args = str.indexOf(' ') > -1 ? str.substr(str.indexOf(' ') + 1, str.length) : '';
		argWords = args.split(' ');

		return {command, args, argWords, raw: str};
	}
}