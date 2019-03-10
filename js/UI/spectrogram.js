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
  stop: function() {
    this.player.stop();
  },

  stopRender: function() {
    this.isRendering = false;
  },

  startRender: function() {
    if (this.isRendering) {
      return;
    }
    this.isRendering = true;
    this.draw_();
  },

  loopChanged: function(loop) {
    this.player.setLoop(loop);
  },

  play: function(src) {
    this.src = src;
    this.player.playSrc(src);
  },

  live: function() {
    this.player.live();
  },

  init: function(canvas) {
    // Initialize everything.
    this.player = new Player();
    this.analyserNode = this.player.getAnalyserNode();
    this.canvas = canvas;
    this.resize_();

    this.analyserView = new AnalyserView(this.canvas);
    this.analyserView.setAnalyserNode(this.analyserNode);
    this.analyserView.initByteBuffer();

    window.addEventListener('resize', this.resize_.bind(this));

    console.log('spectrogram-3d initialized');
  },

  resize_: function() {
    console.log('onResize_');
    this.canvas.width = $(window).width();
    this.canvas.height = $(window).height();
  },

  draw_: function() {
    if (!this.isRendering) {
      console.log('stopped draw_');
      return;
    }

    this.analyserView.doFrequencyAnalysis();
    requestAnimationFrame(this.draw_.bind(this));
  }
};


module.exports = spec3D;
