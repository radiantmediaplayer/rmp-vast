'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

var ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml';
var ADTAG2 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml';


describe("Test for TwoConsecutiveLinearSpec", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var rmpVast = new RmpVast(id);
  var fw = rmpVast.getFW();
  var testResults = document.getElementById('test-results');


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
    container.addEventListener('addurationchange', function (e) {
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
        expect(validSteps).toBe(10);
        rmpVast.loadAds(ADTAG2);
      }
      if (addestroyedCount === 2) {
        expect(validSteps).toBe(20);
        if (validSteps === 20) {
          testResults.style.display = 'block';
        }
        setTimeout(function () {
          done();
        }, 1500);
      }
    });

    rmpVast.loadAds(ADTAG1);
  });


});
