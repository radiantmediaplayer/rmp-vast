const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/ad-pod-error-creative-on-second-ad.xml';

describe('Test for AdPodErrorCreativeOnSecondAd', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  video.muted = true;
  const rmpVast = new RmpVast(id);
  const env = rmpVast.environment;
  if (env.isAndroid[0] || env.isIos[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];
  const result = document.getElementById('result');
  const timeout = 30000;


  it('should load adTag play adpod with load error on second ad creative', function (done) {

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

    rmpVast.on('aderror', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adstarted', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('addestroyed', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adpodcompleted', function (e) {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          expect(validSteps).toBe(8);
          if (validSteps === 8) {
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
