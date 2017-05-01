'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

var ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/redirect-redirect.xml';


describe("Test for VAST wrapper to VAST wrapper", function () {

  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = container.getElementsByClassName('rmp-video')[0];
  var rmpVast = new RmpVast(id);
  var fw = rmpVast.getFW();

  it("should load adTag and play it", function (done) {
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

    container.addEventListener('adimpression', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adfollowingredirect', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(12);
      done();
    });

    video.addEventListener('play', _onPlayLoadAds);
    rmpVast.play();
  });


});
