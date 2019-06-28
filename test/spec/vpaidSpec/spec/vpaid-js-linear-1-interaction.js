'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/vpaid-1-js-linear.xml';

describe('Test for vpaid-js-linear-1-interaction', function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  var params = {
    enableVpaid: true,
    vpaidSettings: {
      width: 640,
      height: 360,
      viewMode: 'normal',
      desiredBitrate: 500
    }
  };
  var rmpVast = new RmpVast(id, params);
  var fw = rmpVast.getFramework();
  var env = rmpVast.getEnvironment();
  video.muted = true;
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  var title = document.getElementsByTagName('title')[0];

  it('should load and play vpaid-js-linear-1-interaction', function (done) {
    var validSteps = 0;

    var _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log(event.type);
      }
    };

    container.addEventListener('adimpression', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adstarted', function (e) {
      if (env.isAndroid[0]) {
        rmpVast.resizeAd(320, 180, 'normal');
      }
      _incrementAndLog(e);
      setTimeout(function () {
        rmpVast.pause();
      }, 400);
    });
    container.addEventListener('adskippablestatechanged', function (e) {
      _incrementAndLog(e);
      setTimeout(function () {
        rmpVast.skipAd();
      }, 400);
    });
    container.addEventListener('adpaused', function (e) {
      _incrementAndLog(e);
      setTimeout(function () {
        if (rmpVast.getAdPaused()) {
          rmpVast.play();
        }
      }, 400);
    });
    container.addEventListener('adresumed', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adskipped', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      var timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          if (validSteps === 8) {
            expect(validSteps).toBe(8);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);
  });


});
