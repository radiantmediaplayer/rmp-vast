'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/redirect-redirect-redirect.xml';


describe("Test for Maximum Redirects", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = container.getElementsByClassName('rmp-video')[0];
  var params = {
    maxNumRedirects: 2
  };
  var rmpVast = new RmpVast(id, params);
  var fw = rmpVast.getFW();

  it("should load adTag and trigger an error", function (done) {
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

    container.addEventListener('aderror', function (e) {
      _incrementAndLog(e);
      expect(rmpVast.getAdVastErrorCode()).toBe(302);
    });

    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(3);
      done();
    });

    video.addEventListener('play', _onPlayLoadAds);
    rmpVast.play();
  });


});
