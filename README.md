Bolt
========

The best bot since mankind.

Usage
-----

```
git clone https://github.com/syk-yaman/bolt
cd ./bolt
npm i
echo "TOKEN=<your bot token>
PREFIX=<prefix such as exclamation>"
node .
```

Writing plugins
--------

Plugins are the heart of bolt. Plugins are so flexible that you can write plugins in as much code as they need, they're so powerful that you could create things like relays.

Plugins have lifecycles, starts with `onCreate` when the plugin is loaded, and ends with `onDestroy` when the plugin is just about to die.

Filenames of plugins reserve and represent a command name. i.e. an `inspire.js` plugin reserves the command `inspire`, and everytime someone says something starting with something like `!inspire`, the `handle` method of that plugin gets loaded.

All plugins are automatically hot-reloaded, and if a plugin fails to load, the old code will still be running.

--------------

Each plugin **must** export a `handle` function, which gets fed up with `message`, `event`, `datastore`, and `bot` params:

- `message` is a parsed message, which conains the following properties:
    - `raw` The message itself with absolutely no formatting
    - `command` The command, with prefix striped out (i.e. `test`, not `!test`)
    - `args` Arguments, full string
    - `argWords` Arguments. array of argument words
- `datastore` is a very simply key/value store.
    - `get(key)` Returns a promise, which returns the value. `null` or `undefined` if non-existant
    - `set(key, value)` Sets value of `key` to `value`. Returns a promise.
- `event` is the message event that Slack returns
- `bot` is a uh, a [`Slackbots`](https://github.com/mishk0/slack-bot-api)

Here's an example plugin that utilizes all features:

###### test.js
```JavaScript
module.exports = {
    handle: (message, event, datastore, bot) => {
        // Someone said !test
        // Here you can handle the command.
    },

    onCreate: (datastore, bot) => {
        // Bot is a Slackbots instance
        // Do whatever. Such as initialize a connection,
        // Listen to an event.
    },

    onDestroy: (datastore, bot) => {
        // Bot is also Slackbots instance
        // And you can listen to also whatever, close a connection,
        // Remove event listener.
    }
}
```