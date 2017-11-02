'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/vpaid-3-js-linear.xml';

describe("Test for vpaid-js-linear-3", function () {

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
    container.addEventListener('addurationchange', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adstarted', function (e) {
      _incrementAndLog(e);
      setTimeout(() => {
        rmpVast.setMute(true);
      }, 500);
    });
    container.addEventListener('advolumechanged', function (e) {
      if (rmpVast.getMute()) {
        _incrementAndLog(e);
        setTimeout(() => {
          rmpVast.setMute(false);
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
          if (rmpVast.getAdMediaWidth() !== 640) {
            return;
          }
          if (rmpVast.getAdMediaHeight() !== 360) {
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
