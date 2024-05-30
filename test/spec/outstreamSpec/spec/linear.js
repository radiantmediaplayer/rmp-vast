const ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';

describe('Test for outstream/linear', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  // enables outstream ad mode
  const params = {
    outstream: true
  };
  const rmpVast = new RmpVast(id, params);
  const env = rmpVast.environment;
  video.muted = true;
  if (env.isAndroid[0] || env.isIos[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }

  const title = document.getElementsByTagName('title')[0];
  const result = document.getElementById('result');
  const timeout = 30000;

  it('should load outstream/linear', function (done) {

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
    rmpVast.on('addestroyed', function (e) {
      _incrementAndLog(e);
      expect(validSteps).toBe(9);
      if (validSteps === 9) {
        _pass();
      } else {
        _fail();
      }
    });

    rmpVast.loadAds(ADTAG1);
  });


});
