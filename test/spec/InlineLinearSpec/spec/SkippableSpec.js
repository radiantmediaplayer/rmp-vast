'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-skippable.xml';

describe("Test for Inline Skippable Linear ad", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  var rmpVast = new RmpVast(id);
  var fw = rmpVast.getFW();
  var env = rmpVast.getEnv();
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
    video.setAttribute('muted', 'muted');
  } else if (env.isMacOSX && env.isSafari[0]) {
    video.muted = true;
  }
  var title = document.getElementsByTagName('title')[0];

  it("should load adTag and play it", function (done) {
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

    container.addEventListener('addurationchange', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adimpression', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adstarted', function (e) {
      _incrementAndLog(e);
      setTimeout(() => {
        var skip = document.getElementsByClassName('rmp-ad-container-skip')[0];
        fw.log('click skip');
        fw.createStdEvent('click', skip);
      }, 6500);
    });

    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adskipped', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adskippablestatechanged', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(9);
      if (validSteps === 9) {
        title.textContent = 'Test completed';
      }
      setTimeout(function () {
        done();
      }, 500);
    });

    rmpVast.loadAds(ADTAG);
  });


});
