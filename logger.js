const colors = require('colors/safe');

const getCaller = () => {
	try {
        var err = new Error();
        var callerfile;
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();
            if (currentfile !== callerfile) 
				if (callerfile.startsWith(__dirname))
					return callerfile.substr(__dirname.length + 1);
				else callerfile;
        }
    } catch (err) {}
    return undefined;
}

module.exports = {
	info: (t) => console.log(`${(new Date()).toISOString()} ${colors.black.bgBlue(' INFO ')} ${colors.white(t)} ${colors.grey(getCaller())}`),
	err: (t) => console.log(`${(new Date()).toISOString()} ${colors.black.bgRed(' ERR  ')} ${colors.red(t)} ${colors.grey(getCaller())}`),
	warn: (t) => console.log(`${(new Date()).toISOString()} ${colors.black.bgYellow(' WARN ')} ${colors.yellow(t)} ${colors.grey(getCaller())}`),
    recv: (t) => console.log(`${(new Date()).toISOString()} ${colors.black.bgWhite(' RECV ')} ${colors.white(t)} ${colors.grey(getCaller())}`),
	send: (t) => console.log(`${(new Date()).toISOString()} ${colors.black.bgGreen(' SEND ')} ${colors.white(t)} ${colors.grey(getCaller())}`),
}