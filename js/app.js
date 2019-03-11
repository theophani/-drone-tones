(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * Copyright (c) 2009 The Chromium Authors. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *    * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *    * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// A simple camera controller which uses an HTML element as the event
// source for constructing a view matrix. Assign an "onchange"
// function to the controller as follows to receive the updated X and
// Y angles for the camera:
//
//   var controller = new CameraController(canvas);
//   controller.onchange = function(xRot, yRot) { ... };
//
// The view matrix is computed elsewhere.
//
// opt_canvas (an HTMLCanvasElement) and opt_context (a
// WebGLRenderingContext) can be passed in to make the hit detection
// more precise -- only opaque pixels will be considered as the start
// of a drag action.
function CameraController(element, opt_canvas, opt_context) {
    var controller = this;
    this.onchange = null;
    this.xRot = 0;
    this.yRot = 0;
    this.zRot = 0;
    this.scaleFactor = 3.0;
    this.dragging = false;
    this.curX = 0;
    this.curY = 0;

    if (opt_canvas)
        this.canvas_ = opt_canvas;

    if (opt_context)
        this.context_ = opt_context;

    // TODO(smus): Remove this to re-introduce mouse panning.
    return;

    // Assign a mouse down handler to the HTML element.
    element.onmousedown = function(ev) {
        controller.curX = ev.clientX;
        controller.curY = ev.clientY;
        var dragging = false;
        if (controller.canvas_ && controller.context_) {
            var rect = controller.canvas_.getBoundingClientRect();
            // Transform the event's x and y coordinates into the coordinate
            // space of the canvas
            var canvasRelativeX = ev.pageX - rect.left;
            var canvasRelativeY = ev.pageY - rect.top;
            var canvasWidth = controller.canvas_.width;
            var canvasHeight = controller.canvas_.height;

            // Read back a small portion of the frame buffer around this point
            if (canvasRelativeX > 0 && canvasRelativeX < canvasWidth &&
                canvasRelativeY > 0 && canvasRelativeY < canvasHeight) {
                var pixels = controller.context_.readPixels(canvasRelativeX,
                                                            canvasHeight - canvasRelativeY,
                                                            1,
                                                            1,
                                                            controller.context_.RGBA,
                                                            controller.context_.UNSIGNED_BYTE);
                if (pixels) {
                    // See whether this pixel has an alpha value of >= about 10%
                    if (pixels[3] > (255.0 / 10.0)) {
                        dragging = true;
                    }
                }
            }
        } else {
            dragging = true;
        }

        controller.dragging = dragging;
    };

    // Assign a mouse up handler to the HTML element.
    element.onmouseup = function(ev) {
        controller.dragging = false;
    };

    // Assign a mouse move handler to the HTML element.
    element.onmousemove = function(ev) {
        if (controller.dragging) {
            // Determine how far we have moved since the last mouse move
            // event.
            var curX = ev.clientX;
            var curY = ev.clientY;
            var deltaX = (controller.curX - curX) / controller.scaleFactor;
            var deltaY = (controller.curY - curY) / controller.scaleFactor;
            controller.curX = curX;
            controller.curY = curY;
            // Update the X and Y rotation angles based on the mouse motion.
            controller.yRot = (controller.yRot + deltaX) % 360;
            controller.xRot = (controller.xRot + deltaY);
            // Clamp the X rotation to prevent the camera from going upside
            // down.
            if (controller.xRot < -90) {
                controller.xRot = -90;
            } else if (controller.xRot > 90) {
                controller.xRot = 90;
            }
            // Send the onchange event to any listener.
            if (controller.onchange != null) {
                controller.onchange(controller.xRot, controller.yRot);
            }
        }
    };
}


module.exports = CameraController;

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/3D/cameraController.js","/3D")
},{"1YiZ5S":11,"buffer":8}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * Copyright (c) 2009, Mozilla Corp
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY <copyright holder> ''AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <copyright holder> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Based on sample code from the OpenGL(R) ES 2.0 Programming Guide, which carriers
 * the following header:
 *
 * Book:      OpenGL(R) ES 2.0 Programming Guide
 * Authors:   Aaftab Munshi, Dan Ginsburg, Dave Shreiner
 * ISBN-10:   0321502795
 * ISBN-13:   9780321502797
 * Publisher: Addison-Wesley Professional
 * URLs:      http://safari.informit.com/9780321563835
 *            http://www.opengles-book.com
 */

//
// A simple 4x4 Matrix utility class
//

function Matrix4x4() {
  this.elements = Array(16);
  this.loadIdentity();
}

Matrix4x4.prototype = {
  scale: function (sx, sy, sz) {
    this.elements[0*4+0] *= sx;
    this.elements[0*4+1] *= sx;
    this.elements[0*4+2] *= sx;
    this.elements[0*4+3] *= sx;

    this.elements[1*4+0] *= sy;
    this.elements[1*4+1] *= sy;
    this.elements[1*4+2] *= sy;
    this.elements[1*4+3] *= sy;

    this.elements[2*4+0] *= sz;
    this.elements[2*4+1] *= sz;
    this.elements[2*4+2] *= sz;
    this.elements[2*4+3] *= sz;

    return this;
  },

  translate: function (tx, ty, tz) {
    this.elements[3*4+0] += this.elements[0*4+0] * tx + this.elements[1*4+0] * ty + this.elements[2*4+0] * tz;
    this.elements[3*4+1] += this.elements[0*4+1] * tx + this.elements[1*4+1] * ty + this.elements[2*4+1] * tz;
    this.elements[3*4+2] += this.elements[0*4+2] * tx + this.elements[1*4+2] * ty + this.elements[2*4+2] * tz;
    this.elements[3*4+3] += this.elements[0*4+3] * tx + this.elements[1*4+3] * ty + this.elements[2*4+3] * tz;

    return this;
  },

  rotate: function (angle, x, y, z) {
    var mag = Math.sqrt(x*x + y*y + z*z);
    var sinAngle = Math.sin(angle * Math.PI / 180.0);
    var cosAngle = Math.cos(angle * Math.PI / 180.0);

    if (mag > 0) {
      var xx, yy, zz, xy, yz, zx, xs, ys, zs;
      var oneMinusCos;
      var rotMat;

      x /= mag;
      y /= mag;
      z /= mag;

      xx = x * x;
      yy = y * y;
      zz = z * z;
      xy = x * y;
      yz = y * z;
      zx = z * x;
      xs = x * sinAngle;
      ys = y * sinAngle;
      zs = z * sinAngle;
      oneMinusCos = 1.0 - cosAngle;

      rotMat = new Matrix4x4();

      rotMat.elements[0*4+0] = (oneMinusCos * xx) + cosAngle;
      rotMat.elements[0*4+1] = (oneMinusCos * xy) - zs;
      rotMat.elements[0*4+2] = (oneMinusCos * zx) + ys;
      rotMat.elements[0*4+3] = 0.0;

      rotMat.elements[1*4+0] = (oneMinusCos * xy) + zs;
      rotMat.elements[1*4+1] = (oneMinusCos * yy) + cosAngle;
      rotMat.elements[1*4+2] = (oneMinusCos * yz) - xs;
      rotMat.elements[1*4+3] = 0.0;

      rotMat.elements[2*4+0] = (oneMinusCos * zx) - ys;
      rotMat.elements[2*4+1] = (oneMinusCos * yz) + xs;
      rotMat.elements[2*4+2] = (oneMinusCos * zz) + cosAngle;
      rotMat.elements[2*4+3] = 0.0;

      rotMat.elements[3*4+0] = 0.0;
      rotMat.elements[3*4+1] = 0.0;
      rotMat.elements[3*4+2] = 0.0;
      rotMat.elements[3*4+3] = 1.0;

      rotMat = rotMat.multiply(this);
      this.elements = rotMat.elements;
    }

    return this;
  },

  frustum: function (left, right, bottom, top, nearZ, farZ) {
    var deltaX = right - left;
    var deltaY = top - bottom;
    var deltaZ = farZ - nearZ;
    var frust;

    if ( (nearZ <= 0.0) || (farZ <= 0.0) ||
         (deltaX <= 0.0) || (deltaY <= 0.0) || (deltaZ <= 0.0) )
         return this;

    frust = new Matrix4x4();

    frust.elements[0*4+0] = 2.0 * nearZ / deltaX;
    frust.elements[0*4+1] = frust.elements[0*4+2] = frust.elements[0*4+3] = 0.0;

    frust.elements[1*4+1] = 2.0 * nearZ / deltaY;
    frust.elements[1*4+0] = frust.elements[1*4+2] = frust.elements[1*4+3] = 0.0;

    frust.elements[2*4+0] = (right + left) / deltaX;
    frust.elements[2*4+1] = (top + bottom) / deltaY;
    frust.elements[2*4+2] = -(nearZ + farZ) / deltaZ;
    frust.elements[2*4+3] = -1.0;

    frust.elements[3*4+2] = -2.0 * nearZ * farZ / deltaZ;
    frust.elements[3*4+0] = frust.elements[3*4+1] = frust.elements[3*4+3] = 0.0;

    frust = frust.multiply(this);
    this.elements = frust.elements;

    return this;
  },

  perspective: function (fovy, aspect, nearZ, farZ) {
    var frustumH = Math.tan(fovy / 360.0 * Math.PI) * nearZ;
    var frustumW = frustumH * aspect;

    return this.frustum(-frustumW, frustumW, -frustumH, frustumH, nearZ, farZ);
  },

  ortho: function (left, right, bottom, top, nearZ, farZ) {
    var deltaX = right - left;
    var deltaY = top - bottom;
    var deltaZ = farZ - nearZ;

    var ortho = new Matrix4x4();

    if ( (deltaX == 0.0) || (deltaY == 0.0) || (deltaZ == 0.0) )
        return this;

    ortho.elements[0*4+0] = 2.0 / deltaX;
    ortho.elements[3*4+0] = -(right + left) / deltaX;
    ortho.elements[1*4+1] = 2.0 / deltaY;
    ortho.elements[3*4+1] = -(top + bottom) / deltaY;
    ortho.elements[2*4+2] = -2.0 / deltaZ;
    ortho.elements[3*4+2] = -(nearZ + farZ) / deltaZ;

    ortho = ortho.multiply(this);
    this.elements = ortho.elements;

    return this;
  },

  multiply: function (right) {
    var tmp = new Matrix4x4();

    for (var i = 0; i < 4; i++) {
      tmp.elements[i*4+0] =
	(this.elements[i*4+0] * right.elements[0*4+0]) +
	(this.elements[i*4+1] * right.elements[1*4+0]) +
	(this.elements[i*4+2] * right.elements[2*4+0]) +
	(this.elements[i*4+3] * right.elements[3*4+0]) ;

      tmp.elements[i*4+1] =
	(this.elements[i*4+0] * right.elements[0*4+1]) +
	(this.elements[i*4+1] * right.elements[1*4+1]) +
	(this.elements[i*4+2] * right.elements[2*4+1]) +
	(this.elements[i*4+3] * right.elements[3*4+1]) ;

      tmp.elements[i*4+2] =
	(this.elements[i*4+0] * right.elements[0*4+2]) +
	(this.elements[i*4+1] * right.elements[1*4+2]) +
	(this.elements[i*4+2] * right.elements[2*4+2]) +
	(this.elements[i*4+3] * right.elements[3*4+2]) ;

      tmp.elements[i*4+3] =
	(this.elements[i*4+0] * right.elements[0*4+3]) +
	(this.elements[i*4+1] * right.elements[1*4+3]) +
	(this.elements[i*4+2] * right.elements[2*4+3]) +
	(this.elements[i*4+3] * right.elements[3*4+3]) ;
    }

    this.elements = tmp.elements;
    return this;
  },

  copy: function () {
    var tmp = new Matrix4x4();
    for (var i = 0; i < 16; i++) {
      tmp.elements[i] = this.elements[i];
    }
    return tmp;
  },

  get: function (row, col) {
    return this.elements[4*row+col];
  },

  // In-place inversion
  invert: function () {
    var tmp_0 = this.get(2,2) * this.get(3,3);
    var tmp_1 = this.get(3,2) * this.get(2,3);
    var tmp_2 = this.get(1,2) * this.get(3,3);
    var tmp_3 = this.get(3,2) * this.get(1,3);
    var tmp_4 = this.get(1,2) * this.get(2,3);
    var tmp_5 = this.get(2,2) * this.get(1,3);
    var tmp_6 = this.get(0,2) * this.get(3,3);
    var tmp_7 = this.get(3,2) * this.get(0,3);
    var tmp_8 = this.get(0,2) * this.get(2,3);
    var tmp_9 = this.get(2,2) * this.get(0,3);
    var tmp_10 = this.get(0,2) * this.get(1,3);
    var tmp_11 = this.get(1,2) * this.get(0,3);
    var tmp_12 = this.get(2,0) * this.get(3,1);
    var tmp_13 = this.get(3,0) * this.get(2,1);
    var tmp_14 = this.get(1,0) * this.get(3,1);
    var tmp_15 = this.get(3,0) * this.get(1,1);
    var tmp_16 = this.get(1,0) * this.get(2,1);
    var tmp_17 = this.get(2,0) * this.get(1,1);
    var tmp_18 = this.get(0,0) * this.get(3,1);
    var tmp_19 = this.get(3,0) * this.get(0,1);
    var tmp_20 = this.get(0,0) * this.get(2,1);
    var tmp_21 = this.get(2,0) * this.get(0,1);
    var tmp_22 = this.get(0,0) * this.get(1,1);
    var tmp_23 = this.get(1,0) * this.get(0,1);

    var t0 = ((tmp_0 * this.get(1,1) + tmp_3 * this.get(2,1) + tmp_4 * this.get(3,1)) -
              (tmp_1 * this.get(1,1) + tmp_2 * this.get(2,1) + tmp_5 * this.get(3,1)));
    var t1 = ((tmp_1 * this.get(0,1) + tmp_6 * this.get(2,1) + tmp_9 * this.get(3,1)) -
              (tmp_0 * this.get(0,1) + tmp_7 * this.get(2,1) + tmp_8 * this.get(3,1)));
    var t2 = ((tmp_2 * this.get(0,1) + tmp_7 * this.get(1,1) + tmp_10 * this.get(3,1)) -
              (tmp_3 * this.get(0,1) + tmp_6 * this.get(1,1) + tmp_11 * this.get(3,1)));
    var t3 = ((tmp_5 * this.get(0,1) + tmp_8 * this.get(1,1) + tmp_11 * this.get(2,1)) -
              (tmp_4 * this.get(0,1) + tmp_9 * this.get(1,1) + tmp_10 * this.get(2,1)));

    var d = 1.0 / (this.get(0,0) * t0 + this.get(1,0) * t1 + this.get(2,0) * t2 + this.get(3,0) * t3);

    var out_00 = d * t0;
    var out_01 = d * t1;
    var out_02 = d * t2;
    var out_03 = d * t3;

    var out_10 = d * ((tmp_1 * this.get(1,0) + tmp_2 * this.get(2,0) + tmp_5 * this.get(3,0)) -
                      (tmp_0 * this.get(1,0) + tmp_3 * this.get(2,0) + tmp_4 * this.get(3,0)));
    var out_11 = d * ((tmp_0 * this.get(0,0) + tmp_7 * this.get(2,0) + tmp_8 * this.get(3,0)) -
                      (tmp_1 * this.get(0,0) + tmp_6 * this.get(2,0) + tmp_9 * this.get(3,0)));
    var out_12 = d * ((tmp_3 * this.get(0,0) + tmp_6 * this.get(1,0) + tmp_11 * this.get(3,0)) -
                      (tmp_2 * this.get(0,0) + tmp_7 * this.get(1,0) + tmp_10 * this.get(3,0)));
    var out_13 = d * ((tmp_4 * this.get(0,0) + tmp_9 * this.get(1,0) + tmp_10 * this.get(2,0)) -
                      (tmp_5 * this.get(0,0) + tmp_8 * this.get(1,0) + tmp_11 * this.get(2,0)));

    var out_20 = d * ((tmp_12 * this.get(1,3) + tmp_15 * this.get(2,3) + tmp_16 * this.get(3,3)) -
                      (tmp_13 * this.get(1,3) + tmp_14 * this.get(2,3) + tmp_17 * this.get(3,3)));
    var out_21 = d * ((tmp_13 * this.get(0,3) + tmp_18 * this.get(2,3) + tmp_21 * this.get(3,3)) -
                      (tmp_12 * this.get(0,3) + tmp_19 * this.get(2,3) + tmp_20 * this.get(3,3)));
    var out_22 = d * ((tmp_14 * this.get(0,3) + tmp_19 * this.get(1,3) + tmp_22 * this.get(3,3)) -
                      (tmp_15 * this.get(0,3) + tmp_18 * this.get(1,3) + tmp_23 * this.get(3,3)));
    var out_23 = d * ((tmp_17 * this.get(0,3) + tmp_20 * this.get(1,3) + tmp_23 * this.get(2,3)) -
                      (tmp_16 * this.get(0,3) + tmp_21 * this.get(1,3) + tmp_22 * this.get(2,3)));

    var out_30 = d * ((tmp_14 * this.get(2,2) + tmp_17 * this.get(3,2) + tmp_13 * this.get(1,2)) -
                      (tmp_16 * this.get(3,2) + tmp_12 * this.get(1,2) + tmp_15 * this.get(2,2)));
    var out_31 = d * ((tmp_20 * this.get(3,2) + tmp_12 * this.get(0,2) + tmp_19 * this.get(2,2)) -
                      (tmp_18 * this.get(2,2) + tmp_21 * this.get(3,2) + tmp_13 * this.get(0,2)));
    var out_32 = d * ((tmp_18 * this.get(1,2) + tmp_23 * this.get(3,2) + tmp_15 * this.get(0,2)) -
                      (tmp_22 * this.get(3,2) + tmp_14 * this.get(0,2) + tmp_19 * this.get(1,2)));
    var out_33 = d * ((tmp_22 * this.get(2,2) + tmp_16 * this.get(0,2) + tmp_21 * this.get(1,2)) -
                      (tmp_20 * this.get(1,2) + tmp_23 * this.get(2,2) + tmp_17 * this.get(0,2)));

    this.elements[0*4+0] = out_00;
    this.elements[0*4+1] = out_01;
    this.elements[0*4+2] = out_02;
    this.elements[0*4+3] = out_03;
    this.elements[1*4+0] = out_10;
    this.elements[1*4+1] = out_11;
    this.elements[1*4+2] = out_12;
    this.elements[1*4+3] = out_13;
    this.elements[2*4+0] = out_20;
    this.elements[2*4+1] = out_21;
    this.elements[2*4+2] = out_22;
    this.elements[2*4+3] = out_23;
    this.elements[3*4+0] = out_30;
    this.elements[3*4+1] = out_31;
    this.elements[3*4+2] = out_32;
    this.elements[3*4+3] = out_33;
    return this;
  },

  // Returns new matrix which is the inverse of this
  inverse: function () {
    var tmp = this.copy();
    return tmp.invert();
  },

  // In-place transpose
  transpose: function () {
    var tmp = this.elements[0*4+1];
    this.elements[0*4+1] = this.elements[1*4+0];
    this.elements[1*4+0] = tmp;

    tmp = this.elements[0*4+2];
    this.elements[0*4+2] = this.elements[2*4+0];
    this.elements[2*4+0] = tmp;

    tmp = this.elements[0*4+3];
    this.elements[0*4+3] = this.elements[3*4+0];
    this.elements[3*4+0] = tmp;

    tmp = this.elements[1*4+2];
    this.elements[1*4+2] = this.elements[2*4+1];
    this.elements[2*4+1] = tmp;

    tmp = this.elements[1*4+3];
    this.elements[1*4+3] = this.elements[3*4+1];
    this.elements[3*4+1] = tmp;

    tmp = this.elements[2*4+3];
    this.elements[2*4+3] = this.elements[3*4+2];
    this.elements[3*4+2] = tmp;

    return this;
  },

  loadIdentity: function () {
    for (var i = 0; i < 16; i++)
      this.elements[i] = 0;
    this.elements[0*4+0] = 1.0;
    this.elements[1*4+1] = 1.0;
    this.elements[2*4+2] = 1.0;
    this.elements[3*4+3] = 1.0;
    return this;
  }
};

module.exports = Matrix4x4;

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/3D/matrix4x4.js","/3D")
},{"1YiZ5S":11,"buffer":8}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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

var Matrix4x4 = require('./matrix4x4');
var CameraController = require('./cameraController');

var ANALYSISTYPE_FREQUENCY 		= 0;
var ANALYSISTYPE_SONOGRAM 		= 1;
var ANALYSISTYPE_3D_SONOGRAM 	= 2;
var ANALYSISTYPE_WAVEFORM 		= 3;

// The "model" matrix is the "world" matrix in Standard Annotations and Semantics
var model 		= 0;
var view 		= 0;
var projection 	= 0;

function createGLErrorWrapper(context, fname) {
	return function() {
		var rv = context[fname].apply(context, arguments);
		var err = context.getError();
		if (err != 0)
			throw "GL error " + err + " in " + fname;
		return rv;
	};
}

function create3DDebugContext(context) {
	// Thanks to Ilmari Heikkinen for the idea on how to implement this so elegantly.
	var wrap = {};
	for (var i in context) {
		try {
			if (typeof context[i] == 'function') {
				wrap[i] = createGLErrorWrapper(context, i);
			} else {
				wrap[i] = context[i];
			}
		} catch (e) {
			// console.log("create3DDebugContext: Error accessing " + i);
		}
	}
	wrap.getError = function() {
		return context.getError();
	};
	return wrap;
}

/**
 * Class AnalyserView
 */

AnalyserView = function(canvas) {
	// NOTE: the default value of this needs to match the selected radio button

	// This analysis type may be overriden later on if we discover we don't support the right shader features.
	this.analysisType = ANALYSISTYPE_3D_SONOGRAM;

	this.sonogram3DWidth = 256;
	this.sonogram3DHeight = 256;
	this.sonogram3DGeometrySize = 9.5;
	
	this.freqByteData = 0;
	this.texture = 0;
	this.TEXTURE_HEIGHT = 256;
	this.yoffset = 0;

	this.frequencyShader = 0;
	this.waveformShader = 0;
	this.sonogramShader = 0;
	this.sonogram3DShader = 0;

	// Background color
	this.backgroundColor = [.08, .08, .08, 1];
	this.foregroundColor = [0,.7,0,1];

	this.canvas = canvas;
	this.initGL();
}

AnalyserView.prototype.getAvailableContext = function(canvas, contextList) {
	if (canvas.getContext) {
		for(var i = 0; i < contextList.length; ++i) {
			try {
				var context = canvas.getContext(contextList[i], { antialias:true });
				if(context !== null)
					return context;
			} catch(ex) { }
		}
	}
	return null;
}

AnalyserView.prototype.initGL = function() {
	model 		= new Matrix4x4();
	view 		= new Matrix4x4();
	projection 	= new Matrix4x4();
	// ________________________________________
	var sonogram3DWidth = this.sonogram3DWidth;
	var sonogram3DHeight = this.sonogram3DHeight;
	var sonogram3DGeometrySize = this.sonogram3DGeometrySize;
	var backgroundColor = this.backgroundColor;
	// ________________________________________
	var canvas = this.canvas;
	// ________________________________________
	var gl = this.getAvailableContext(canvas, ['webgl', 'experimental-webgl']);
	this.gl = gl;

	// If we're missing this shader feature, then we can't do the 3D visualization.
	this.has3DVisualizer = (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0);

	if (!this.has3DVisualizer && this.analysisType == ANALYSISTYPE_3D_SONOGRAM)
		this.analysisType = ANALYSISTYPE_FREQUENCY;

	var cameraController = new CameraController(canvas);
	this.cameraController = cameraController;


	cameraController.xRot = -180;
	cameraController.yRot = 270;
	cameraController.zRot = 90;

	cameraController.xT = 0;
	// Zoom level.
	cameraController.yT = -2;
	// Translation in the x axis.
	cameraController.zT = -2;

	gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
	gl.enable(gl.DEPTH_TEST);

	// Initialization for the 2D visualizations
	var vertices = new Float32Array([
		1.0,   1.0,   0.0,
		-1.0,   1.0,   0.0,
		-1.0,   -1.0,   0.0,
		1.0,   1.0,   0.0,
		-1.0,   -1.0,   0.0,
		1.0,   -1.0,   0.0]);
	var texCoords = new Float32Array([
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		1.0, 1.0,
		0.0, 0.0,
		1.0, 0.0]);

	var vboTexCoordOffset = vertices.byteLength;
	this.vboTexCoordOffset = vboTexCoordOffset;

	// Create the vertices and texture coordinates
	var vbo = gl.createBuffer();
	this.vbo = vbo;

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER,
		vboTexCoordOffset + texCoords.byteLength,
		gl.STATIC_DRAW);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
		gl.bufferSubData(gl.ARRAY_BUFFER, vboTexCoordOffset, texCoords);

	// Initialization for the 3D visualizations
	var numVertices = sonogram3DWidth * sonogram3DHeight;
	if (numVertices > 65536) {
		throw "Sonogram 3D resolution is too high: can only handle 65536 vertices max";
	}
	vertices = new Float32Array(numVertices * 3);
	texCoords = new Float32Array(numVertices * 2);

	for (var z = 0; z < sonogram3DHeight; z++) {
		for (var x = 0; x < sonogram3DWidth; x++) {
			// Generate a reasonably fine mesh in the X-Z plane
			vertices[3 * (sonogram3DWidth * z + x) + 0] =
			sonogram3DGeometrySize * (x - sonogram3DWidth / 2) / sonogram3DWidth;
			vertices[3 * (sonogram3DWidth * z + x) + 1] = 0;
			vertices[3 * (sonogram3DWidth * z + x) + 2] = sonogram3DGeometrySize * (z - sonogram3DHeight / 2) / sonogram3DHeight;

			texCoords[2 * (sonogram3DWidth * z + x) + 0] = x / (sonogram3DWidth - 1);
			texCoords[2 * (sonogram3DWidth * z + x) + 1] = z / (sonogram3DHeight - 1);
		}
	}

	var vbo3DTexCoordOffset = vertices.byteLength;
	this.vbo3DTexCoordOffset = vbo3DTexCoordOffset;

	// Create the vertices and texture coordinates
	var sonogram3DVBO = gl.createBuffer();
	this.sonogram3DVBO = sonogram3DVBO;

	gl.bindBuffer(gl.ARRAY_BUFFER, sonogram3DVBO);
	gl.bufferData(gl.ARRAY_BUFFER, vbo3DTexCoordOffset + texCoords.byteLength, gl.STATIC_DRAW);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
	gl.bufferSubData(gl.ARRAY_BUFFER, vbo3DTexCoordOffset, texCoords);

	// Now generate indices
	var sonogram3DNumIndices = (sonogram3DWidth - 1) * (sonogram3DHeight - 1) * 6;
	this.sonogram3DNumIndices = sonogram3DNumIndices - (6 * 600);

	var indices = new Uint16Array(sonogram3DNumIndices);
	// We need to use TRIANGLES instead of for example TRIANGLE_STRIP
	// because we want to make one draw call instead of hundreds per
	// frame, and unless we produce degenerate triangles (which are very
	// ugly) we won't be able to split the rows.
	var idx = 0;
	for (var z = 0; z < sonogram3DHeight - 1; z++) {
		for (var x = 0; x < sonogram3DWidth - 1; x++) {
			indices[idx++] = z * sonogram3DWidth + x;
			indices[idx++] = z * sonogram3DWidth + x + 1;
			indices[idx++] = (z + 1) * sonogram3DWidth + x + 1;
			indices[idx++] = z * sonogram3DWidth + x;
			indices[idx++] = (z + 1) * sonogram3DWidth + x + 1;
			indices[idx++] = (z + 1) * sonogram3DWidth + x;
		}
	}

	var sonogram3DIBO = gl.createBuffer();
	this.sonogram3DIBO = sonogram3DIBO;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sonogram3DIBO);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	// Note we do not unbind this buffer -- not necessary

	// Load the shaders
	this.frequencyShader = o3djs.shader.loadFromURL(gl, "bin/shaders/common-vertex.shader", "bin/shaders/frequency-fragment.shader");
	this.waveformShader = o3djs.shader.loadFromURL(gl, "bin/shaders/common-vertex.shader", "bin/shaders/waveform-fragment.shader");
	this.sonogramShader = o3djs.shader.loadFromURL(gl, "bin/shaders/common-vertex.shader", "bin/shaders/sonogram-fragment.shader");

	if (this.has3DVisualizer){
		this.sonogram3DShader = o3djs.shader.loadFromURL(gl, "bin/shaders/sonogram-vertex.shader", "bin/shaders/sonogram-fragment.shader");

	}
	console.log('this.sonogramShader', this.sonogramShader);
	console.log('this.sonogram3DShader', this.sonogram3DShader);
}

AnalyserView.prototype.initByteBuffer = function() {
	var gl = this.gl;
	var TEXTURE_HEIGHT = this.TEXTURE_HEIGHT;

	if (!this.freqByteData || this.freqByteData.length != this.analyser.frequencyBinCount) {
		freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
		this.freqByteData = freqByteData;

		// (Re-)Allocate the texture object
		if (this.texture) {
			gl.deleteTexture(this.texture);
			this.texture = null;
		}
		var texture = gl.createTexture();
		this.texture = texture;

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		// TODO(kbr): WebGL needs to properly clear out the texture when null is specified
		var tmp = new Uint8Array(freqByteData.length * TEXTURE_HEIGHT);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, freqByteData.length, TEXTURE_HEIGHT, 0, gl.ALPHA, gl.UNSIGNED_BYTE, tmp);
	}
}

AnalyserView.prototype.setAnalysisType = function(type) {
	// Check for read textures in vertex shaders.
	if (!this.has3DVisualizer && type == ANALYSISTYPE_3D_SONOGRAM)
		return;

	this.analysisType = type;
}

AnalyserView.prototype.analysisType = function() {
	return this.analysisType;
}

AnalyserView.prototype.doFrequencyAnalysis = function(event) {
	var freqByteData = this.freqByteData;

	switch(this.analysisType) {
	case ANALYSISTYPE_FREQUENCY:
		this.analyser.smoothingTimeConstant = 0.75;
		this.analyser.getByteFrequencyData(freqByteData);
		break;

	case ANALYSISTYPE_SONOGRAM:
	case ANALYSISTYPE_3D_SONOGRAM:
		this.analyser.smoothingTimeConstant = 0;
		this.analyser.getByteFrequencyData(freqByteData);
		break;

	case ANALYSISTYPE_WAVEFORM:
		this.analyser.smoothingTimeConstant = 0.1;
		this.analyser.getByteTimeDomainData(freqByteData);
		break;
	}

	this.drawGL();
}

AnalyserView.prototype.drawGL = function() {
	var canvas = this.canvas;
	var gl = this.gl;
	var vbo = this.vbo;
	var vboTexCoordOffset = this.vboTexCoordOffset;
	var sonogram3DVBO = this.sonogram3DVBO;
	var vbo3DTexCoordOffset = this.vbo3DTexCoordOffset;
	var sonogram3DGeometrySize = this.sonogram3DGeometrySize;
	var sonogram3DNumIndices = this.sonogram3DNumIndices;
	var sonogram3DWidth = this.sonogram3DWidth;
	var sonogram3DHeight = this.sonogram3DHeight;
	var freqByteData = this.freqByteData;
	var texture = this.texture;
	var TEXTURE_HEIGHT = this.TEXTURE_HEIGHT;

	var frequencyShader = this.frequencyShader;
	var waveformShader = this.waveformShader;
	var sonogramShader = this.sonogramShader;
	var sonogram3DShader = this.sonogram3DShader;


	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	if (this.analysisType != ANALYSISTYPE_SONOGRAM && this.analysisType != ANALYSISTYPE_3D_SONOGRAM) {
		this.yoffset = 0;
	}

	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, this.yoffset, freqByteData.length, 1, gl.ALPHA, gl.UNSIGNED_BYTE, freqByteData);

	if (this.analysisType == ANALYSISTYPE_SONOGRAM || this.analysisType == ANALYSISTYPE_3D_SONOGRAM) {
		this.yoffset = (this.yoffset + 1) % TEXTURE_HEIGHT;
	}
	var yoffset = this.yoffset;

	// Point the frequency data texture at texture unit 0 (the default),
	// which is what we're using since we haven't called activeTexture
	// in our program

	var vertexLoc;
	var texCoordLoc;
	var frequencyDataLoc;
	var foregroundColorLoc;
	var backgroundColorLoc;
	var texCoordOffset;

	var currentShader;

	switch (this.analysisType) {
	case ANALYSISTYPE_FREQUENCY:
	case ANALYSISTYPE_WAVEFORM:
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		currentShader = this.analysisType == ANALYSISTYPE_FREQUENCY ? frequencyShader : waveformShader;
		currentShader.bind();
		vertexLoc = currentShader.gPositionLoc;
		texCoordLoc = currentShader.gTexCoord0Loc;
		frequencyDataLoc = currentShader.frequencyDataLoc;
		foregroundColorLoc = currentShader.foregroundColorLoc;
		backgroundColorLoc = currentShader.backgroundColorLoc;
		gl.uniform1f(currentShader.yoffsetLoc, 0.5 / (TEXTURE_HEIGHT - 1));
		texCoordOffset = vboTexCoordOffset;
		break;

	case ANALYSISTYPE_SONOGRAM:
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		sonogramShader.bind();
		vertexLoc = sonogramShader.gPositionLoc;
		texCoordLoc = sonogramShader.gTexCoord0Loc;
		frequencyDataLoc = sonogramShader.frequencyDataLoc;
		foregroundColorLoc = sonogramShader.foregroundColorLoc;
		backgroundColorLoc = sonogramShader.backgroundColorLoc;
		gl.uniform1f(sonogramShader.yoffsetLoc, yoffset / (TEXTURE_HEIGHT - 1));
		texCoordOffset = vboTexCoordOffset;
		break;

	case ANALYSISTYPE_3D_SONOGRAM:

		gl.bindBuffer(gl.ARRAY_BUFFER, sonogram3DVBO);
		sonogram3DShader.bind();
		vertexLoc           = sonogram3DShader.gPositionLoc;
		texCoordLoc         = sonogram3DShader.gTexCoord0Loc;
		frequencyDataLoc    = sonogram3DShader.frequencyDataLoc;
		foregroundColorLoc  = sonogram3DShader.foregroundColorLoc;
		backgroundColorLoc  = sonogram3DShader.backgroundColorLoc;

		gl.uniform1i(sonogram3DShader.vertexFrequencyDataLoc, 0);

		var normalizedYOffset = this.yoffset / (TEXTURE_HEIGHT - 1);

		gl.uniform1f(sonogram3DShader.yoffsetLoc, normalizedYOffset);

		var discretizedYOffset = Math.floor(normalizedYOffset * (sonogram3DHeight - 1)) / (sonogram3DHeight - 1);

		gl.uniform1f(sonogram3DShader.vertexYOffsetLoc, discretizedYOffset);
		gl.uniform1f(sonogram3DShader.verticalScaleLoc, sonogram3DGeometrySize / 3.5 );

		// Set up the model, view and projection matrices
		projection.loadIdentity();
		projection.perspective(55 /*35*/, canvas.width / canvas.height, 1, 100);
		view.loadIdentity();
		view.translate(0, 0, -9.0 /*-13.0*/);

		// Add in camera controller's rotation
		model.loadIdentity();
		model.rotate(this.cameraController.xRot, 1, 0, 0);
		model.rotate(this.cameraController.yRot, 0, 1, 0);
		model.rotate(this.cameraController.zRot, 0, 0, 1);
		model.translate(this.cameraController.xT, this.cameraController.yT, this.cameraController.zT);

		// Compute necessary matrices
		var mvp = new Matrix4x4();
		mvp.multiply(model);
		mvp.multiply(view);
		mvp.multiply(projection);
		gl.uniformMatrix4fv(sonogram3DShader.worldViewProjectionLoc, gl.FALSE, mvp.elements);
		texCoordOffset = vbo3DTexCoordOffset;
		// console.log('model',mvp.elements);
		break;

	}

	if (frequencyDataLoc) {
		gl.uniform1i(frequencyDataLoc, 0);
	}
	if (foregroundColorLoc) {
		gl.uniform4fv(foregroundColorLoc, this.foregroundColor);
	}
	if (backgroundColorLoc) {
		gl.uniform4fv(backgroundColorLoc, this.backgroundColor);
	}

	// Set up the vertex attribute arrays
	gl.enableVertexAttribArray(vertexLoc);
	gl.vertexAttribPointer(vertexLoc, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(texCoordLoc);
	gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, gl.FALSE, 0, texCoordOffset);



	// Clear the render area
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Actually draw
	if (this.analysisType == ANALYSISTYPE_FREQUENCY || this.analysisType == ANALYSISTYPE_WAVEFORM || this.analysisType == ANALYSISTYPE_SONOGRAM) {
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	} else if (this.analysisType == ANALYSISTYPE_3D_SONOGRAM) {
		// Note: this expects the element array buffer to still be bound
		gl.drawElements(gl.TRIANGLES, sonogram3DNumIndices, gl.UNSIGNED_SHORT, 0);
	}

	// Disable the attribute arrays for cleanliness
	gl.disableVertexAttribArray(vertexLoc);
	gl.disableVertexAttribArray(texCoordLoc);
};

AnalyserView.prototype.setAnalyserNode = function(analyser) {
  this.analyser = analyser;
};


module.exports = AnalyserView;

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/3D/visualizer.js","/3D")
},{"./cameraController":1,"./matrix4x4":2,"1YiZ5S":11,"buffer":8}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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

'use strict';

window.isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
window.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
window.isAndroid = /Android/.test(navigator.userAgent) && !window.MSStream;

// -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
var spec3D = require('./ui/spectrogram');
// -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~

$(function(){
	var localizedStrings = {};

	var parseQueryString = function() {
		var q = window.location.search.slice(1).split('&');
		for (var i=0; i < q.length; ++i) {
			var qi = q[i].split('=');
			q[i] = {};
			q[i][qi[0]] = qi[1];
		}
		return q;
	};

	var getLocalization = function(){
		var q = parseQueryString();
		var lang = 'en';
		for (var i=0; i < q.length; i++) {
			if (q[i].ln != undefined) {
				lang = q[i].ln;
			}
		}
		var url = "/bin/locales/" + lang + ".json";
		$.ajax({
			url: url,
			dataType: "json",
			async: true,
			success: function (response) {
				localizedStrings = response;
				$.each(response, function (key, value) {
					var item = $("[data-name='"+ key +"']");
					if (item.length > 0) {
						item.attr('data-name', value.message);
					}
				});
			},
			error: function (err) {
				console.warn(err);
			}
		});
	};

	var startup = function () {
		getLocalization();

		spec3D.init($('#spectrogram')[0]);

		$('#loadingSound').hide();

		var killSound = function () {
			spec3D.stop();
			$('.music-box__buttons__button').removeClass('selected');
		};

		$('.music-box__buttons__button').click(function (e) {
			spec3D.startRender();

			if ($(this).hasClass('selected')) {
				// toggle off and stay off
				killSound();
			} else {
				// turn off whatever is playing first
				killSound();

				// the start playing the selection
				$(this).addClass('selected');

				// Check for start recoding data instruction **********************
				if ($(this).attr('data-mic') !== undefined) {
					if (window.isIOS && false){
						// Throw Microphone Error *********************************
						iosOverlay.removeClass('hide').html(localizedStrings.Error_Message_2.message);
						// Remove Selection ***************************************
						$(this).removeClass('selected');
					} else {
						// Show Record Modal Screen *******************************
						$('#record').fadeIn().delay(2000).fadeOut();
						// Start Recording ****************************************
						spec3D.live();
					}

				// Check for play audio data instruction **************************
				} else if ($(this).attr('data-src') !== undefined) {
					spec3D.loopChanged( true );
					$('#loadingMessage').text($(this).attr('data-name'));
					spec3D.play($(this).attr('data-src'));
				}
			}
		})

// I commented this out because I think it causes a bug
// where the mic is marked as unselected after approving the mic
// and I can’t think of when it is actually desired
//		window.addEventListener('blur', function () {
//			killSound();
//		});

		document.addEventListener('visibilitychange', function () {
			killSound();
		});
	};

	var iosOverlay = $('#iosButton');

	if (window.isIOS) {
		iosOverlay.removeClass('hide');
		iosOverlay[0].addEventListener('touchend', function (e) {
			iosOverlay.addClass('hide');
			startup();
		}, false);
	} else {
		startup();
	}
});

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_79d7b236.js","/")
},{"./ui/spectrogram":6,"1YiZ5S":11,"buffer":8}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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

var Util = require('../util/util.js');

function Player() {
	// Create an audio graph.
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext(); // this is global

	var analyser = context.createAnalyser();
	analyser.fftSize = (window.isMobile)?1024 : 2048;
	analyser.smoothingTimeConstant = 0;

	// Create a mix.
	var mix = context.createGain();

	// Create a gain filter
	var filterGain = context.createGain();
	filterGain.gain.value = 1;

	// Connect audio processing graph
	mix.connect(analyser);
	analyser.connect(filterGain);
	filterGain.connect(context.destination);

	this.context = context;
	this.mix = mix;
	this.filterGain = filterGain;
	this.analyser = analyser;

	this.buffers = {};

	// Connect an empty source node to the mix.
	// Note from Tiffany: I don’t know what this is for.
	// I thought maybe it primes the context, to get around
	// the rules about playback, but I tested without this,
	// and nothing broke ... I’m leaving it for now anyway.
	Util.loadTrackSrc(this.context, 'bin/snd/empty.mp3', function(buffer) {
		var source = this.createSource_(buffer, true);
		source.loop = true;
		source.start(0);
	}.bind(this));
}

Player.prototype.disconnectMic = function() {
	if (this.input) {
		this.input.disconnect();
		this.input = null;
		return;
	}
};

Player.prototype.playSrc = function(src) {
	// Stop all of the mic stuff.
	this.filterGain.gain.value = 1;

	this.disconnectMic();

	if (this.buffers[src]) {
		$('#loadingSound').fadeIn(100).delay(1000).fadeOut(500);
		this.playHelper_(src);
		return;
	}

	$('#loadingSound').fadeIn(100);
	Util.loadTrackSrc(this.context, src, function(buffer) {
		this.buffers[src] = buffer;
		this.playHelper_(src);
		$('#loadingSound').delay(500).fadeOut(500);
	}.bind(this));
};

Player.prototype.playHelper_ = function(src) {
	var buffer = this.buffers[src];
	this.source = this.createSource_(buffer, true);
	this.source.start(0);

	if (!this.loop) {
		this.playTimer = setTimeout(function() {
			this.stop();
		}.bind(this), buffer.duration * 2000);
	}
};

Player.prototype.live = function() {
	if (window.isIOS && false) {
		console.log("cant use mic on ios");
	} else {
		this.disconnectMic();

		var self = this;

		navigator.mediaDevices.getUserMedia({audio: true}).then(function(stream) {
			self.onStream_(stream);
		}).catch(function(e) {
			self.onStreamError_(e);
		});

		this.filterGain.gain.value = 0;
	}
};

Player.prototype.onStream_ = function(stream) {
	var input = this.context.createMediaStreamSource(stream);
	input.connect(this.mix);
	this.input = input;
	this.stream = stream;
};

Player.prototype.onStreamError_ = function(e) {
	console.log('onStreamError_');
	console.log(e);
};

Player.prototype.setLoop = function(loop) {
	this.loop = loop;
};

Player.prototype.createSource_ = function(buffer, loop) {
	var source = this.context.createBufferSource();
	source.buffer = buffer;
	source.loop = loop;
	source.connect(this.mix);
	return source;
};

Player.prototype.stop = function() {
	if (this.source) {
		this.source.stop(0);
		this.source = null;
		clearTimeout(this.playTimer);
		this.playTimer = null;
	}

	this.disconnectMic();
};

Player.prototype.getAnalyserNode = function() {
	return this.analyser;
};

// These aren’t used anymore, but I am going to keep them for reference
Player.prototype.playTone = function(freq) {
	if (!this.osc) {
		this.osc = this.context.createOscillator();
		this.osc.connect(this.mix);
		this.osc.type = 'sine';
		this.osc.start(0);
	}
	this.osc.frequency.value = freq;
	this.filterGain.gain.value = .2;
};

Player.prototype.stopTone = function() {
	this.osc.stop(0);
	this.osc = null;
};

module.exports = Player;

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/ui/player.js","/ui")
},{"../util/util.js":7,"1YiZ5S":11,"buffer":8}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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
    console.log('resize_');
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

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/ui/spectrogram.js","/ui")
},{"../3D/visualizer":3,"../ui/player":5,"1YiZ5S":11,"buffer":8}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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

var Util = window.Util || {};

Util.loadTrackSrc = function(context, src, callback, opt_progressCallback) {
  var request = new XMLHttpRequest();
  request.open('GET', src, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously.
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      callback(buffer);
    }, function(e) {
      console.error(e);
    });
  };
  if (opt_progressCallback) {
    request.onprogress = function(e) {
      var percent = e.loaded / e.total;
      opt_progressCallback(percent);
    };
  }

  request.send();
};

// Log scale conversion functions. Cheat sheet:
// http://stackoverflow.com/questions/19472747/convert-linear-scale-to-logarithmic
Util.setLogScale = function(x1, y1, x2, y2) {
  this.b = Math.log(y1/y2) / (x1-x2);
  this.a = y1 / Math.exp( this.b * x1 );
};

Util.lin2log = function(x) {
  return this.a * Math.exp( this.b * x );
};

Util.log2lin = function(y) {
  return Math.log( y / this.a ) / this.b;
};


module.exports = Util;

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/util/util.js","/util")
},{"1YiZ5S":11,"buffer":8}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/index.js","/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer")
},{"1YiZ5S":11,"base64-js":9,"buffer":8,"ieee754":10}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js","/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib")
},{"1YiZ5S":11,"buffer":8}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js","/../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754")
},{"1YiZ5S":11,"buffer":8}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../node_modules/gulp-browserify/node_modules/browserify/node_modules/process/browser.js","/../node_modules/gulp-browserify/node_modules/browserify/node_modules/process")
},{"1YiZ5S":11,"buffer":8}]},{},[4])