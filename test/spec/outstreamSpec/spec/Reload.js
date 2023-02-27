const ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';
const ADTAG2 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-2.xml';

describe('Test for outstream/Simple', function () {

  const id = 'rmp';
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

    rmpVast.on('adloaded', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adstarted', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adtagloaded', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adcomplete', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adfirstquartile', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('admidpoint', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adthirdquartile', function (e) {
      _incrementAndLog(e);
    });
    let count = 0;
    rmpVast.on('addestroyed', function (e) {
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
