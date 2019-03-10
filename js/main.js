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
					if (window.isIOS){
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

		window.addEventListener('blur', function () {
			killSound();
		});

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
