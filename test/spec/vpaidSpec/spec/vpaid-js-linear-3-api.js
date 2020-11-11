import { RmpVast } from '../../../../js/src/index.js';
const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/vpaid-3-js-linear.xml';

describe('Test for vpaid-js-linear-3', function () {

  const id = 'rmpPlayer';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const params = {
    enableVpaid: true,
    vpaidSettings: {
      width: 640,
      height: 360,
      viewMode: 'normal',
      desiredBitrate: 500
    }
  };
  const rmpVast = new RmpVast(id, params);
  const fw = rmpVast.getFramework();
  const env = rmpVast.getEnvironment();
  video.muted = true;
  let mutedAutoplay = false;
  if (env.isAndroid[0] || (env.isMacOSX && env.isSafari[0])) {
    mutedAutoplay = true;
  }
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];

  let timeupdateCount = 0;

  it('should load and play vpaid-js-linear-3', function (done) {
    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log(event.type);
      }
    };

    container.addEventListener('adloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adstarted', function (e) {
      if (env.isAndroid[0]) {
        rmpVast.resizeAd(320, 180, 'normal');
      }
      _incrementAndLog(e);
      setTimeout(function () {
        if (!mutedAutoplay) {
          rmpVast.setMute(true);
        }
      }, 1500);
    });
    container.addEventListener('advolumechanged', function (e) {
      if (rmpVast.getMute()) {
        setTimeout(function () {
          _incrementAndLog(e);
          if (rmpVast.getAdTagUrl() !== ADTAG) {
            return;
          }
          if (rmpVast.getAdMediaUrl() !== 'http://static.innovid.com/mobileapps/js/vpaid/1h41kg?cb=0ef1c87f-3745-1b3f-7978-b942737337c7&deviceid=&ivc=[ecp]') {
            return;
          }
          if (!rmpVast.getAdLinear()) {
            return;
          }
          if (rmpVast.getAdContentType() !== 'application/javascript') {
            return;
          }
          if (!rmpVast.getAdOnStage()) {
            return;
          }
          if (rmpVast.getAdMediaWidth() !== 640 && rmpVast.getAdMediaWidth() !== 320) {
            return;
          }
          if (rmpVast.getAdMediaHeight() !== 360 && rmpVast.getAdMediaWidth() !== 180) {
            return;
          }
          if (rmpVast.getAdDuration() !== 15140) {
            return;
          }
          if (rmpVast.getAdCurrentTime() < 500) {
            return;
          }
        }, 1500);
      }
    });
    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      if (mutedAutoplay) {
        video.addEventListener('timeupdate', function (e) {
          timeupdateCount++;
          if (timeupdateCount === 5) {
            _incrementAndLog(e);
            if (validSteps === 6) {
              expect(validSteps).toBe(6);
              title.textContent = 'Test completed';
              done();
            }
          }
        });
      } else {
        video.addEventListener('timeupdate', function (e) {
          timeupdateCount++;
          if (timeupdateCount === 5) {
            _incrementAndLog(e);
            if (validSteps === 7) {
              expect(validSteps).toBe(7);
              title.textContent = 'Test completed';
              done();
            }
          }
        });
      }
    });

    rmpVast.loadAds(ADTAG);
  });


});
