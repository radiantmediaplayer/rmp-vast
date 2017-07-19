'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml';
var ADTAG2 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-5.xml';


describe("Test for 2 Inline Linear ads", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = container.getElementsByClassName('rmp-video')[0];
  var rmpVast = new RmpVast(id);
  var fw = rmpVast.getFW();
  var testResults = document.getElementById('test-results');


  it("should load 2 adTag and play them", function (done) {
    var validSteps = 0;

    var _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log('RMP-VAST-TEST: ' + event.type);
      }
    };

    var _onPlayLoadAds = function (e) {
      video.removeEventListener('play', _onPlayLoadAds);
      _incrementAndLog(e);
      rmpVast.loadAds(ADTAG);
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
    var addestroyedCount = 0;
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      addestroyedCount++;
      if (addestroyedCount === 2) {
        expect(validSteps).toBe(29);
        if (validSteps === 29) {
          testResults.style.display = 'block';
        }
        done();
        return;
      }
      expect(validSteps).toBe(15);
      setTimeout(function () {
        rmpVast.loadAds(ADTAG2);
      }, 3000);
    });

    video.addEventListener('play', _onPlayLoadAds);
    rmpVast.play();
  });


});
