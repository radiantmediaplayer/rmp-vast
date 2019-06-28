'use strict';

var ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';

describe('Test for outstream/Simple', function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  // enables outstream ad mode
  var params = {
    outstream: true
  };
  var rmpVast = new RmpVast(id, params);
  var fw = rmpVast.getFramework();
  var env = rmpVast.getEnvironment();
  video.muted = true;
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }

  var title = document.getElementsByTagName('title')[0];

  it('should load outstream', function (done) {
    var validSteps = 0;

    var _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log(event.type);
      }
    };

    container.addEventListener('adloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adstarted', function (e) {
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
      setTimeout(function () {
        expect(validSteps).toBe(9);
        if (validSteps === 9) {
          title.textContent = 'Test completed';
        }
        done();
      }, 100);
    });

    rmpVast.loadAds(ADTAG1);
  });


});
