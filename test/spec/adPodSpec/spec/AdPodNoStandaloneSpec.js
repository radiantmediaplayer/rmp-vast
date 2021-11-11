import { RmpVast } from '../../../../js/src/index.js';

const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/ad-pod-no-standalone.xml';

describe('Test for AdPodNoStandaloneSpec', function () {

  const id = 'rmpPlayer';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  video.muted = true;
  const rmpVast = new RmpVast(id);
  const env = rmpVast.getEnvironment();

  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];

  it('should load adTag and play pod of 3 ads', function (done) {
    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        console.log(event.type);
      }
    };

    container.addEventListener('adstarted', function (e) {
      const adPodInfo = rmpVast.getAdPodInfo();
      if (adPodInfo && adPodInfo.adPodLength === 3) {
        _incrementAndLog(e);
      }
    });

    container.addEventListener('adpodcompleted', function (e) {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          if (validSteps === 5) {
            expect(validSteps).toBe(5);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);
  });


});
