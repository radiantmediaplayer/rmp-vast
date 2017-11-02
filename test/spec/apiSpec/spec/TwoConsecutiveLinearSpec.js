'use strict';

var ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/vpaid-4-js-linear.xml';
var ADTAG2 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';

describe("Test for TwoConsecutiveLinearSpec", function () {

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


  it("should load 2 consecutive adTag and play them", function (done) {
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
    container.addEventListener('adimpression', function (e) {
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
    var addestroyedCount = 0;
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      addestroyedCount++;
      if (addestroyedCount === 1) {
        expect(validSteps).toBe(9);
        rmpVast.loadAds(ADTAG2);
      }
      if (addestroyedCount === 2) {
        expect(validSteps).toBe(18);
        if (validSteps === 18) {
          title.textContent = 'Test completed';
        }
        setTimeout(function () {
          done();
        }, 100);
      }
    });

    rmpVast.loadAds(ADTAG1);
  });


});
