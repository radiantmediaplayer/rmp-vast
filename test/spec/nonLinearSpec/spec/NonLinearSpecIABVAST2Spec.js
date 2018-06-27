'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/iab/vast2/Inline_NonLinear_VAST2.0.xml';

describe("Test for NonLinearSpecIABVAST2", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  var rmpVast = new RmpVast(id);
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

  it("should load adTag and play it", function (done) {
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

    container.addEventListener('aderror', function (e) {
      var errorCode = rmpVast.getAdVastErrorCode();
      if (env.isAndroid[0] && errorCode === 501) {
        _incrementAndLog(e);
        expect(validSteps).toBe(3);
        if (validSteps === 3) {
          title.textContent = 'Test completed';
        }
        setTimeout(function () {
          done();
        }, 200);
      }
    });

    container.addEventListener('adimpression', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adstarted', function (e) {
      _incrementAndLog(e);
      setTimeout(() => {
        var close = document.getElementsByClassName('rmp-ad-non-linear-close')[0];
        fw.log('click close');
        fw.createStdEvent('click', close);
      }, 7000);
    });

    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adclosed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(6);
      if (validSteps === 6) {
        title.textContent = 'Test completed';
      }
      setTimeout(function () {
        done();
      }, 200);
    });

    rmpVast.loadAds(ADTAG);
  });


});
