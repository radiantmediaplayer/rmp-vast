const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/non-linear-html.xml';

describe('Test for non-linear-html', function () {

  const id = 'rmp';
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id);
  video.muted = true;
  const title = document.getElementsByTagName('title')[0];
  const result = document.getElementById('result');
  const timeout = 30000;

  it('should load adTag and play it', function (done) {
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

    rmpVast.on('adimpression', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adstarted', function (e) {
      _incrementAndLog(e);
      setTimeout(function () {
        _incrementAndLog(e);
        expect(validSteps).toBe(6);
        if (validSteps === 6) {
          _pass();
        } else {
          _fail();
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
