let modules = {
    // command: handler
};

module.exports = {
    handle: (message, event, datastore, bot) => {
        if (modules[message.command])
            modules[message.command].handle(message, event, datastore, bot);
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