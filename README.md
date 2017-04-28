Bolt
========

The best bot since mankind.

Usage
-----

```
git clone https://github.com/syk-yaman/bolt
cd ./bolt
npm i
node .
```

Writing plugins
--------

Writing plugins is extremely simple. Just follow the steps below:

###### Step #1

Create the file:

```
touch ./plugins/test.js
```

###### Step #2

Put things in the file:

```JavaScript
module.exports = {
    handle: (message, bot) => {
        console.log('yay my plugin works!');
    }
}
```

###### Step #3

Test your plugin:

```
<me>   !test
```

In console:

```
[+] Reloaded 'test'
[+] LOLNICEID: !test
yay my plugins works!
```

###### Step #4

???

PROFIT!


------------

But one last thing, you need to create a `.env` file in the root directory of the project. You'll have to put in it something like:

```
TOKEN=<your bot token>
PREFIX=<prefix such as exclamation>
```

..and you're done.

All plugins are automatically hot-reloaded, and if a plugin fails to load, the old code will still be running.

Each plugin **must** export a `handle` function, which gets fed up with `message`, `event`, and `bot` params:

- `message` is a parsed message, which conains the following properties:
    - `raw` The message itself with absolutely no formatting
    - `command` The command, with prefix striped out (i.e. `test`, not `!test`)
    - `args` Arguments, full string
    - `argWords` Arguments. array of argument words
- `event` is the message event that Slack returns
- `bot` is a uh, a [`Slackbots`](https://github.com/mishk0/slack-bot-api)