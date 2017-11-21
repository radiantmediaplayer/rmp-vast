'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/iab/vast2/Inline_LinearRegular_VAST2.0.xml';


describe("Test for Inline Linear ad (IAB VAST2)", function () {

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
        rmpVast.stopAds();
      }, 3000);
    });
    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(7);
      if (validSteps === 7) {
        title.textContent = 'Test completed';
      }
      setTimeout(function () {
        done();
      }, 500);
    });

    rmpVast.loadAds(ADTAG);
  });


});
