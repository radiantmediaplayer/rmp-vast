import { RmpVast } from '../../../../js/src/index.js';

const ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';
const ADTAG2 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-2.xml';

describe('Test for outstream/Simple', function () {

  const id = 'rmpPlayer';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const params = {
    outstream: true
  };
  const rmpVast = new RmpVast(id, params);
  const env = rmpVast.getEnvironment();
  video.muted = true;
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }

  const title = document.getElementsByTagName('title')[0];

  it('should load outstream', function (done) {
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
    container.addEventListener('adstarted', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adcomplete', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adfirstquartile', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('admidpoint', function (e) {
      _incrementAndLog(e);
    });
    container.addEventListener('adthirdquartile', function (e) {
      _incrementAndLog(e);
    });
    let count = 0;
    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      count++;
      setTimeout(function () {
        if (count === 1) {
          rmpVast.loadAds(ADTAG2);
        } else {
          expect(validSteps).toBe(18);
          if (validSteps === 18) {
            title.textContent = 'Test completed';
          }
          done();
        }
      }, 500);
    });

    rmpVast.loadAds(ADTAG1);
  });


});
