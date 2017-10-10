'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/malformed.xml';


describe("Test for malformed VAST response", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var rmpVast = new RmpVast(id);
  var fw = rmpVast.getFW();
  var testResults = document.getElementById('test-results');

  it("should load adTag and trigger an error", function (done) {
    var validSteps = 0;

    var _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log('RMP-VAST-TEST: ' + event.type);
      }
    };

    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('aderror', function (e) {
      _incrementAndLog(e);
      expect(rmpVast.getAdVastErrorCode()).toBe(101);
    });

    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(3);
      if (validSteps === 3) {
        testResults.style.display = 'block';
      }
      setTimeout(function () {
        done();
      }, 2000);
    });

    rmpVast.loadAds(ADTAG);

  });

});
