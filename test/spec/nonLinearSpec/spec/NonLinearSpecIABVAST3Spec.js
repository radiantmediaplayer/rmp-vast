import { RmpVast } from '../../../../js/src/index.js';
import { HELP } from '../../helpers/function.js';

const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/iab/vast3/Inline_Non-Linear_Tag-test.xml';

describe('Test for NonLinearSpecIABVAST3Spec', function () {

  const id = 'rmpPlayer';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id);
  const env = rmpVast.getEnvironment();
  video.muted = true;
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];

  it('should load adTag and play it', function (done) {
    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        console.log(event.type);
      }
    };

    container.addEventListener('adloaded', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('aderror', function (e) {
      const errorCode = rmpVast.getAdVastErrorCode();
      if (env.isAndroid[0] && errorCode === 501) {
        _incrementAndLog(e);
        let timeupdateCount = 0;
        video.addEventListener('timeupdate', function (e) {
          timeupdateCount++;
          if (timeupdateCount === 5) {
            _incrementAndLog(e);
            if (validSteps === 4) {
              expect(validSteps).toBe(4);
              title.textContent = 'Test completed';
              done();
            }
          }
        });
      }
    });

    container.addEventListener('adimpression', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adstarted', function (e) {
      _incrementAndLog(e);
      setTimeout(function () {
        const close = document.getElementsByClassName('rmp-ad-non-linear-close')[0];
        console.log('click close');
        HELP.createStdEvent('click', close);
      }, 7000);
    });

    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adclosed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(6);
      if (validSteps === 6) {
        title.textContent = 'Test completed';
      }
      setTimeout(function () {
        done();
      }, 200);
    });

    rmpVast.loadAds(ADTAG);
  });


});
