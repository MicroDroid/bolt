let modules = {
    // command: handler
};

module.exports = {
    handle: (message, event, bot) => {
        if (modules[message.command])
            modules[message.command].handle(message, event, bot);
    },

    register: (command, module) => {
        if (typeof(module.handle) !== 'function') // wat
            throw `Invalid or undefined handler for '${command}'`;
        if (module.onCreate)
            module.onCreate();
        modules[command] = module;
    },

    unregister: (command) => {
        if (modules[command]) {
            if (modules[command].onDestroy)
                modules[command].onDestroy();
            delete modules[command];
        }
    }
}