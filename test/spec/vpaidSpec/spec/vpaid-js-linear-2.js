'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/vpaid-2-js-linear.xml';

describe("Test for vpaid-js-linear-2", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
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
  var fw = rmpVast.getFW();
  var title = document.getElementsByTagName('title')[0];

  it("should load and play vpaid-js-linear-2", function (done) {
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
    container.addEventListener('adstarted', function (e) {
      _incrementAndLog(e);
      setTimeout(() => {
        rmpVast.setVolume(0.5);
      }, 500);
    });
    container.addEventListener('advolumechanged', function (e) {
      if (rmpVast.getVolume() === 0.5) {
        _incrementAndLog(e);
        setTimeout(() => {
          rmpVast.stopAds();
        }, 500);
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
      expect(validSteps).toBe(7);
      if (validSteps === 7) {
        title.textContent = 'Test completed';
      }
      setTimeout(() => {
        done();
      }, 100);
    });

    rmpVast.loadAds(ADTAG);
  });


});
