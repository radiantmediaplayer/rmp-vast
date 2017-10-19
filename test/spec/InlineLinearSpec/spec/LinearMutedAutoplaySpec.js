'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';


describe("Test for LinearMutedAutoplaySpec", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var rmpVast = new RmpVast(id);
  var fw = rmpVast.getFW();
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
      if (rmpVast.getMute()) {
        _incrementAndLog(e);
        setTimeout(() => {
          if (!rmpVast.getAdPaused()) {
            rmpVast.pause();
          }
          setTimeout(() => {
            if (rmpVast.getAdPaused()) {
              rmpVast.play();
            }
          }, 500);
        }, 500);
      }
    });

    container.addEventListener('adpaused', function (e) {
      // also fires before adcomplete
      _incrementAndLog(e);
    });

    container.addEventListener('adresumed', function (e) {
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

    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(14);
      if (validSteps === 14) {
        title.textContent = 'Test completed';
      }
      setTimeout(function () {
        done();
      }, 500);
    });

    rmpVast.loadAds(ADTAG);
  });


});
