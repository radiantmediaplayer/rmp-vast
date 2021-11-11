import { RmpVast } from '../../../../js/src/index.js';

const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/redirect-redirect-redirect.xml';

describe('Test for MaximumRedirectSpec', function () {

  const id = 'rmpPlayer';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const params = {
    maxNumRedirects: 2
  };
  const rmpVast = new RmpVast(id, params);
  const env = rmpVast.getEnvironment();
  video.muted = true;
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];

  it('should load adTag and trigger an error', function (done) {
    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        console.log(event.type);
      }
    };

    container.addEventListener('aderror', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      let timeupdateCount = 0;
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
