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

## Getting data about the audio

I have learned that the `freqByteData` property of the `spec3D.analyserView`
returns “frequency byte data” (whatever this is ...) as a 1024 item array,
which changes at any moment in time when you ask for the data.

So, more directly, at any moment of time, if you want a array representing
the “frequency byte data” of the audio, anywhere in main.js, call:

```javascript
spec3D.analyserView.freqByteData
```

### How much data do we need to represent 30 seconds of audio?

Let’s assume we want an array of data representing 30 seconds of audio.

Let's say we target a beat of 60 beats per minute,
and we want to have audio data to the 16th note,
then we would want a sample every 62.5 ms:

60 beats/minute / 60 seconds/minute / 16 samples/beat = 0.0625 seconds/sample
