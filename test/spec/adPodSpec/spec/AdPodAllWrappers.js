import { RmpVast } from '../../../../js/src/index.js';

const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/ad-pod-all-wrappers.xml';

// right now pod in wrappers only cause the first ad to return
// open ticket at https://github.com/dailymotion/vast-client-js for this

describe('Test for AdPodAllWrappers', function () {

  const id = 'rmpPlayer';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  video.muted = true;
  const rmpVast = new RmpVast(id);
  const fw = rmpVast.getFramework();
  const env = rmpVast.getEnvironment();
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];

  it('should load adTag play adpod of wrapper items', function (done) {

    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        fw.log(event.type);
      }
    };

    container.addEventListener('adstarted', function (e) {
      _incrementAndLog(e);
    });

    let timeupdateCount = 0;
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          if (validSteps === 3) {
            expect(validSteps).toBe(3);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);
  });


});
