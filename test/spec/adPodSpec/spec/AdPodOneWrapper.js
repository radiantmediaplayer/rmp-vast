'use strict';

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/ad-pod-one-wrapper.xml';

describe('Test for AdPodOneWrapper', function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = document.querySelector('.rmp-video');
  video.muted = true;
  var rmpVast = new RmpVast(id);
  var fw = rmpVast.getFramework();
  var env = rmpVast.getEnvironment();
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  var title = document.getElementsByTagName('title')[0];

  it('should load adTag play adpod of 2 InLine and 1 Wrapper items', function (done) {
    var validSteps = 0;

    var _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log(event.type);
      }
    };

    container.addEventListener('adstarted', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adfollowingredirect', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adpodcompleted', function (e) {
      _incrementAndLog(e);
      var timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          if (validSteps === 9) {
            expect(validSteps).toBe(9);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);
  });


});
