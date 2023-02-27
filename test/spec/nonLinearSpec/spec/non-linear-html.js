const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/non-linear-html.xml';

describe('Test for non-linear-html', function () {

  const id = 'rmp';
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

    rmpVast.on('adloaded', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adimpression', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adstarted', function (e) {
      _incrementAndLog(e);
      setTimeout(function () {
        _incrementAndLog(e);
        if (validSteps === 6) {
          expect(validSteps).toBe(6);
          title.textContent = 'Test completed';
          done();
        }
      }, 5000);
    });

    rmpVast.on('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.loadAds(ADTAG);
  });


});
