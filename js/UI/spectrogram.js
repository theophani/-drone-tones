/********************************************************
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*********************************************************/

'use strict'

var Player = require('../ui/player');
var AnalyserView = require('../3D/visualizer');

var spec3D = {
  attached: function() {
    console.log('spectrogram-3d attached');
    spec3D.onResize_();
    spec3D.init_();

    window.addEventListener('resize', spec3D.onResize_.bind(spec3D));
  },

  stop: function() {
    spec3D.player.stop();
  },

  stopRender: function() {
    spec3D.isRendering = false;
  },

  startRender: function() {
    if (spec3D.isRendering) {
      return;
    }
    spec3D.isRendering = true;
    spec3D.draw_();
  },

  loopChanged: function(loop) {
    spec3D.player.setLoop(loop);
  },

  play: function(src) {
    spec3D.src = src;
    spec3D.player.playSrc(src);
  },

  live: function() {
    spec3D.player.live();
  },

  init_: function() {
    // Initialize everything.
    var player = new Player();
    var analyserNode = player.getAnalyserNode();

    var analyserView = new AnalyserView(this.canvas);
    analyserView.setAnalyserNode(analyserNode);
    analyserView.initByteBuffer();

    spec3D.player = player;
    spec3D.analyserView = analyserView;
  },

  onResize_: function() {
    console.log('onResize_');
    var canvas = $('#spectrogram')[0];
    spec3D.canvas = canvas;

    // access sibling or parent elements here
    canvas.width = $(window).width();
    canvas.height = $(window).height();
  },

  draw_: function() {
    if (!spec3D.isRendering) {
      console.log('stopped draw_');
      return;
    }

    spec3D.analyserView.doFrequencyAnalysis();
    requestAnimationFrame(spec3D.draw_.bind(spec3D));
  }
};


module.exports = spec3D;
