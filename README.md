# game

A html5 multiplayer & -device jump and run and shoot.

# readings

* Anything from [gafferongames], read it all. It's awesome!

# development

## setup

Install the latest version of [Node.js][nodejs] (which comes with [npm] preinstalled) and run:
```
$ npm install
$ npm start
```

## stack

* [express] web framework running on [Node.js][nodejs] to serve the client code/assets and will host game server via websocket
* [socketio] as client and server-side websocket abstraction ([why-socketio]).

## tooling

* [npm] for dependency management (client and server) and as task runner.
* [webpack] loads and transforms development code/assets to production versions.
* [eslint] linter, style based on [Airbnb's coding style][eslint-config-airbnb], obey!

## production

To build a production version with statically build client assets, run the following commands:
```
$ npm run build
$ npm start
```
The `build` command creates a `dist` folder that's gonna served by `start` if it exists.


[gafferongames]: http://gafferongames.com/
[nodejs]: https://nodejs.org/
[express]: http://expressjs.com/
[socketio]: http://socket.io/
[why-socketio]: https://gist.github.com/zeusdeux/5491cff541fb4ac4c142
[npm]: https://www.npmjs.com/
[webpack]: https://webpack.github.io/
[eslint]: http://eslint.org/
[eslint-config-airbnb]: https://www.npmjs.com/package/eslint-config-airbnb
