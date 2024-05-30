//Viewable_Impression in wrapper >> not supported right now
//const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/iab/vast4_2/Viewable_Impression-test.xml';

const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-viewable.xml';

describe('Viewable_Impression-test', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id);
  const env = rmpVast.environment;
  video.muted = true;
  if (env.isAndroid[0] || env.isIos[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
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
        window.console.log(event.type);
        window.console.log(validSteps);
      }
    };

    rmpVast.on('adloaded', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('addurationchange', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adimpression', function (e) {
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

    rmpVast.on('adviewable', function (e) {
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

    rmpVast.on('addestroyed', function (e) {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          expect(validSteps).toBe(13);
          if (validSteps === 13) {
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
