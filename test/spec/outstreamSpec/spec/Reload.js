'use strict';

var ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';
var ADTAG2 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-2.xml';

describe('Test for outstream/Simple', function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  var params = {
    outstream: true
  };
  var rmpVast = new RmpVast(id, params);
  var fw = rmpVast.getFW();
  var env = rmpVast.getEnv();
  var ua = window.navigator.userAgent;
  var regExp = /(edge\/|firefox\/)/i;
  if (!regExp.test(ua)) {
    video.muted = true;
  }
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }

  var title = document.getElementsByTagName('title')[0];

  it('should load outstream', function (done) {
    var validSteps = 0;

    var _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log(event.type);
      }
    };

    container.addEventListener('adloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adstarted', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adcomplete', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adfirstquartile', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('admidpoint', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adthirdquartile', function (e) {
      _incrementAndLog(e);
    });
    var count = 0;
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      count++;
      setTimeout(function () {
        if (count === 1) {
          rmpVast.loadAds(ADTAG2);
        } else {
          expect(validSteps).toBe(18);
          if (validSteps === 18) {
            title.textContent = 'Test completed';
          }
          done();
        }
      }, 500);
    });

    rmpVast.loadAds(ADTAG1);
  });


});
