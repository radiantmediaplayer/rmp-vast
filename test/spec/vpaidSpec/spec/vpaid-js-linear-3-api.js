const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/vpaid-3-js-linear.xml';

describe('Test for vpaid-js-linear-3', function () {

  const id = 'rmp';
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
  const env = rmpVast.environment;
  video.muted = true;
  let mutedAutoplay = false;
  if (env.isAndroid[0] || (env.isMacOSX && env.isSafari[0]) || env.isIos[0]) {
    mutedAutoplay = true;
  }
  if (env.isAndroid[0] || env.isIos[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];
  const result = document.getElementById('result');
  const timeout = 30000;
  
  let timeupdateCount = 0;

  it('should load and play vpaid-js-linear-3', function (done) {
    const _fail = () => {
      result.textContent = 'failed';
      title.textContent = 'Test finished';
      done.fail();
    };

    const _pass = () => {
      result.textContent = 'passed';
      title.textContent = 'Test finished';
      done();
    };

    setTimeout(() => {
      _fail();
    }, timeout);

    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        console.log(event.type);
      }
    };

    rmpVast.on('adloaded', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adstarted', function (e) {
      if (env.isAndroid[0] || env.isIos[0]) {
        rmpVast.resizeAd(320, 180, 'normal');
      }
      _incrementAndLog(e);
      setTimeout(function () {
        if (!mutedAutoplay) {
          rmpVast.muted = true;
        }
      }, 1500);
    });
    rmpVast.on('advolumechanged', function (e) {
      if (rmpVast.muted) {
        setTimeout(function () {
          _incrementAndLog(e);
          if (rmpVast.adTagUrl !== ADTAG) {
            return;
          }
          if (rmpVast.adMediaUrl !== 'http://static.innovid.com/mobileapps/js/vpaid/1h41kg?cb=0ef1c87f-3745-1b3f-7978-b942737337c7&deviceid=&ivc=[ecp]') {
            return;
          }
          if (!rmpVast.adLinear) {
            return;
          }
          if (rmpVast.adContentType !== 'application/javascript') {
            return;
          }
          if (!rmpVast.adOnStage) {
            return;
          }
          if (rmpVast.adMediaWidth !== 640 && rmpVast.adMediaWidth !== 320) {
            return;
          }
          if (rmpVast.adMediaHeight !== 360 && rmpVast.adMediaHeight !== 180) {
            return;
          }
          if (rmpVast.adDuration !== 15140) {
            return;
          }
          if (rmpVast.adCurrentTime < 500) {
            return;
          }
        }, 1500);
      }
    });
    rmpVast.on('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adtagloaded', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('addestroyed', function (e) {
      _incrementAndLog(e);
      if (mutedAutoplay) {
        video.addEventListener('timeupdate', function (e) {
          timeupdateCount++;
          if (timeupdateCount === 5) {
            _incrementAndLog(e);
            expect(validSteps).toBe(6);
            if (validSteps === 6) {
              _pass();
            } else {
              _fail();
            }
          }
        });
      } else {
        video.addEventListener('timeupdate', function (e) {
          timeupdateCount++;
          if (timeupdateCount === 5) {
            _incrementAndLog(e);
            expect(validSteps).toBe(7);
            if (validSteps === 7) {
              _pass();
            } else {
              _fail();
            }
          }
        });
      }
    });

    rmpVast.loadAds(ADTAG);
  });


});
