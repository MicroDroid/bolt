const Helpers = require('./helpers');
const Logger = require('./logger');

let modules = {
    // command: module
};

let exceptions = {
    // user : {command, grant}
}

function can(id, command) {
    try {
        var admins = JSON.parse(process.env.ADMINS);
            admins = typeof(admins) === 'string' ? [admins] : admins;

        const username = Helpers.usernameFromId(id);

        const isAdmin = admins.indexOf(username) !== -1;
        var exception = exceptions[id].filter(e => e.command === command)[0];
            exception = hasException ? hasException.grant : null;

        if (exception === null)
            return isAdmin;
        else return exception;
    } catch (e) {
        Logger.warn(`Failed to parse admins list for command '${message.command}'`);
        return false;
    }
}

module.exports = {
    handle: (message, event, datastore, bot) => {
        if (message.command === 'grant' || message.command === 'deny') {
            const matches = (/\<@([\w\d]+)\>(\ssome|\saccess\sto)*\s(\w+)/).exec(message.args);

            if (!matches)
                return;

            const user = matches[1];
            const command = matches[3] ? matches[3] : matches[2];

            if (!(command in modules))
                return bot.postMessage(event.channel, `Unknown command ${command}`);

            if (!exceptions[event.user])
                exceptions[event.user] = [];

            exceptions[event.user] = exceptions[event.user].filter(e => e.command !== command);
            exceptions[event.user].push({command, grant: message.command === 'grant'});

            bot.postMessage(event.channel, ':thumbsup::skin-tone-3:');

            return;
        } else {
            if (modules[message.command] && process.env.ADMINS && modules[message.command].adminOnly)
                if (!can(event.user, message.command))
                    return Logger.info(`User ${event.user} (${username}) tried to use '${message.command}'`);

            if (modules[message.command])
                modules[message.command].handle(message, event, datastore, bot);
        }
    },

    register: (command, module, datastore, bot) => {
        if (typeof(module.handle) !== 'function') // wat
            throw `Invalid or undefined handler for '${command}'`;
        if (module.onCreate)
            module.onCreate(datastore, bot);
        modules[command] = module;
    },

    unregister: (command, datastore, bot) => {
        if (modules[command]) {
            if (modules[command].onDestroy)
                modules[command].onDestroy(datastore, bot);
            delete modules[command];
        }
    }
}