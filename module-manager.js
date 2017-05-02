const Helpers = require('./helpers');
const Logger = require('./logger');

let modules = {
    // command: module
};

let exceptions = {
    // user : {command, grant}
}

function can(id, command) {
    const isAdmin = Helpers.isAdmin(id);

    var exception = exceptions[id] ? exceptions[id].filter(e => e.command === command)[0] : null;
        exception = exception ? exception.grant : null;

    if (exception === null)
        return isAdmin;
    else return exception;
}

function generateHelp() {
    var help = '```Bolt is a simple bot that helps you do non-sense.\n\n';

    help += 'User commands:';

    for (let key in modules)
      if (modules.hasOwnProperty(key) && !modules[key].adminOnly)
        help += '\n  ' + key + (modules[key].description ? ': ' + modules[key].description : '');

    help += '\n\nAdmin commands:';

    for (let key in modules)
      if (modules.hasOwnProperty(key) && modules[key].adminOnly)
        help += '\n  ' + key + (modules[key].description ? ': ' + modules[key].description : '');

    help += '\n```';

    return help;
}

module.exports = {
    handle: (message, event, datastore, bot) => {
        if ((message.command === 'grant' || message.command === 'deny') && isAdmin(event.user)) {
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
        } else if (message.command === 'help') {
            bot.postMessage(event.channel, generateHelp());
        } else {
            if (modules[message.command] && process.env.ADMINS && modules[message.command].adminOnly)
                if (!can(event.user, message.command))
                    return Logger.info(`User ${event.user} (${Helpers.usernameFromId(event.user)}) tried to use '${message.command}'`);

            if (modules[message.command]) {
                try {
                    modules[message.command].handle(message, event, datastore, bot);
                } catch (e) {
                    Logger.err(`Module ${message.command} threw: ${e}`);
                }
            }
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