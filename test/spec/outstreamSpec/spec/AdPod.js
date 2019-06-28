'use strict';

var ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/ad-pod-no-standalone.xml';

describe('Test for outstream/AdPod', function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
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

  it('should load AdPod outstream', function (done) {
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
    container.addEventListener('adpodcompleted', function (e) {
      _incrementAndLog(e);
      setTimeout(function () {
        expect(validSteps).toBe(21);
        if (validSteps === 21) {
          title.textContent = 'Test completed';
        }
        done();
      }, 100);
    });

    rmpVast.loadAds(ADTAG1);
  });


});
