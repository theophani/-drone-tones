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
        var source = null; // global source for user dropped audio

		getLocalization();

		var sp = spec3D;
		sp.attached();
		// --------------------------------------------
		$('.music-box__tool-tip').hide(0);
		$('#loadingSound').hide(0);

		$('.music-box__buttons__button').click(function(e){
			sp.startRender();

			var wasPlaying = sp.isPlaying();
			sp.stop();
			sp.drawingMode = false;

			if($(this).hasClass('selected')) {
				$('.music-box__buttons__button').removeClass('selected');
			}else{
				$('.music-box__buttons__button').removeClass('selected');
				$(this).addClass('selected');
				// check for start recoding data instruction **********************
				if ($(this).attr('data-mic')!== undefined) {
					if(window.isIOS){
						// Throw Microphone Error *********************************
						iosOverlay.removeClass('hide').html(localizedStrings.Error_Message_2.message);
						// Remove Selection ***************************************
						$(this).removeClass('selected');
					}else{
						// Show Record Modal Screen *******************************
						$('#record').fadeIn().delay(2000).fadeOut();
						// Start Recording ****************************************
						sp.live();
					}
				// Check for Start drawing data instruction  **********************
				}else if ($(this).attr('data-draw') !== undefined) {
					sp.drawingMode = true;
					$('#drawAnywhere').fadeIn().delay(2000).fadeOut();
				// Check for play audio data instruction **************************
				}else if ($(this).attr('data-src') !== undefined) {
					sp.loopChanged( true );
					$('#loadingMessage').text($(this).attr('data-name'));
					sp.play($(this).attr('data-src'));
				}
			}
		})

		var killSound = function(){
			sp.startRender();
			var wasPlaying = sp.isPlaying();
			sp.stop();
			sp.drawingMode = false;
			$('.music-box__buttons__button').removeClass('selected');
		}

		window.addEventListener('blur', function() {
		   killSound();
		});
		document.addEventListener('visibilitychange', function(){
		    killSound();
		});

        var decodeBuffer = function(file) {
            // Credit: https://github.com/kylestetz/AudioDrop && https://ericbidelman.tumblr.com/post/13471195250/web-audio-api-how-to-playing-audio-based-on-user
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            var context = new AudioContext();
            // var source = null;
            var audioBuffer = null;
            var fileReader = new FileReader();

            fileReader.onload = function(fileEvent) {
                var data = fileEvent.target.result;

                context.decodeAudioData(data, function(buffer) {
                    // audioBuffer is global to reuse the decoded audio later.
                    audioBuffer = buffer;
                    source = context.createBufferSource();
                    source.buffer = audioBuffer;
                    source.loop = true;
                    source.connect(context.destination);

                    // Visualizer
                    sp.startRender();
                    sp.loopChanged( true );
                    sp.userAudio(source);
                    $('#loadingSound').delay(500).fadeOut().hide(0);
                }, function(e) {
                    console.log('Error decoding file', e);
                });
            };

            fileReader.readAsArrayBuffer(file);
        };
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
