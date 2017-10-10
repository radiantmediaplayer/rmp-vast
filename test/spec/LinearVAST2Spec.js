'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-vast-2.xml';


describe("Test for Inline Linear VAST v2 ad", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var rmpVast = new RmpVast(id);
  var fw = rmpVast.getFW();
  var testResults = document.getElementById('test-results');

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
        rmpVast.pause();
        setTimeout(() => {
          rmpVast.play();
        }, 1000);
      }, 5000);
    });
    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adpaused', function (e) {
      // adpaused fires also just before adcomplete
      _incrementAndLog(e);
    });
    container.addEventListener('adresumed', function (e) {
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
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(14);
      if (validSteps === 14) {
        testResults.style.display = 'block';
      }
      setTimeout(function () {
        done();
      }, 2000);
    });

    rmpVast.loadAds(ADTAG);
    
  });


});
