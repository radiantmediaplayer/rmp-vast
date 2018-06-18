'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/vpaid-3-js-linear.xml';

describe("Test for vpaid-js-linear-3", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  var params = {
    enableVpaid: true,
    vpaidSettings: {
      width: 960,
      height: 540,
      viewMode: 'normal',
      desiredBitrate: 500
    }
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

  it("should load and play vpaid-js-linear-3", function (done) {
    var validSteps = 0;

    var _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log('RMP-VAST-TEST: ' + event.type);
      }
    };

    container.addEventListener('adloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adstarted', function (e) {
      if (env.isAndroid[0]) {
        rmpVast.resizeAd(320, 180, 'normal');
      }
      _incrementAndLog(e);
      setTimeout(() => {
        if (!env.isAndroid[0] && !(env.isMacOSX && env.isSafari[0])) {
          rmpVast.setMute(true);
        }
      }, 400);
    });
    container.addEventListener('advolumechanged', function (e) {
      if (rmpVast.getMute()) {
        _incrementAndLog(e);
        setTimeout(() => {
          if (!env.isAndroid[0] && !(env.isMacOSX && env.isSafari[0])) {
            rmpVast.setMute(false);
          }
          if (rmpVast.getAdTagUrl() !== ADTAG) {
            return;
          }
          if (rmpVast.getAdMediaUrl() !== 'http://static.innovid.com/mobileapps/js/vpaid/1h41kg?cb=0ef1c87f-3745-1b3f-7978-b942737337c7&deviceid=&ivc=[ecp]') {
            return;
          }
          if (!rmpVast.getAdLinear()) {
            return;
          }
          if (rmpVast.getAdContentType() !== 'application/javascript') {
            return;
          }
          if (!rmpVast.getAdOnStage()) {
            return;
          }
          if (rmpVast.getAdMediaWidth() !== 640 && rmpVast.getAdMediaWidth() !== 320) {
            return;
          }
          if (rmpVast.getAdMediaHeight() !== 360 && rmpVast.getAdMediaWidth() !== 180) {
            return;
          }
          if (rmpVast.getAdDuration() !== 15140) {
            return;
          }
          if (rmpVast.getAdCurrentTime() < 500) {
            return;
          }
        }, 1500);
      }
    });
    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      if (!env.isAndroid[0] && !(env.isMacOSX && env.isSafari[0])) {
        expect(validSteps).toBe(6);
        if (validSteps === 6) {
          title.textContent = 'Test completed';
        }
      } else {
        expect(validSteps).toBe(5);
        if (validSteps === 5) {
          title.textContent = 'Test completed';
        }
      }
      setTimeout(() => {
        done();
      }, 100);
    });

    rmpVast.loadAds(ADTAG);
  });


});
