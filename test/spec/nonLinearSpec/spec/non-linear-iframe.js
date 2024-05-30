const _createStdEvent = function (eventName, element) {
  let event;
  if (element) {
    try {
      event = new Event(eventName);
      element.dispatchEvent(event);
    } catch (e) {
      console.trace(e);
    }
  }
};

const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/non-linear-iframe.xml';

describe('Test for non-linear-iframe', function () {

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
        const close = document.getElementsByClassName('rmp-ad-non-linear-close')[0];
        console.log('click close');
        _createStdEvent('click', close);
      }, 7000);
    });

    rmpVast.on('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adclosed', function (e) {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          expect(validSteps).toBe(7);
          if (validSteps === 7) {
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
