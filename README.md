# drone-tones
An online tool where people can record a voice message and it is transformed into a little drone clip which they can share/email to a friend

# Local development locally

* Clone the repo
* Run `npm install` to set everything up. I got an error when I did this. Running `npm config set registry="http://registry.npmjs.org/"` first helped)
* Run `node_modules/.bin/gulp` to start a webserver, and auto-build any files as you make changes

You might be able use `gulp` instead of `node_modules/.bin/gulp`, but you’ll have to fix your `PATH`, which I could not be bothered to do.

## Other commands

* `node_modules/.bin/gulp webserver` to _only_ start a webserver
* `node_modules/.bin/gulp watch` to _only_ auto-build any app.js and bundle.js as you make changes to other files
* `node_modules/.bin/gulp watch build-all` to manually rebuild app.js and bundle.js
* `node_modules/.bin/gulp watch browserify` to manually rebuild _just_ app.js
* `node_modules/.bin/gulp watch bundle-libs` to manually rebuild _just_ bundle.js
