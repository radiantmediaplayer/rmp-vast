const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/ad-pod-no-standalone.xml';

describe('Test for AdPodNoStandaloneSpec', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id);
  const env = rmpVast.environment;

  if (env.isAndroid[0] || env.isIos[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];
  const result = document.getElementById('result');
  const timeout = 30000;

  it('should load adTag and play pod of 3 ads', function (done) {

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

    rmpVast.on('adstarted', function (e) {
      const adPodInfo = rmpVast.adPodInfo;
      if (adPodInfo && adPodInfo.adPodLength === 3) {
        _incrementAndLog(e);
      }
    });

    rmpVast.on('adpodcompleted', function (e) {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          expect(validSteps).toBe(5);
          if (validSteps === 5) {
            _pass();
          } else {
            _fail();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);
  });


});
