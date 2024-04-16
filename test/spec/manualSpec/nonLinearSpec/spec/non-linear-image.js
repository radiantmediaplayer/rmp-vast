const _createStdEvent = (eventName, element) => {
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

const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/non-linear.xml';

describe('Test for non-linear-image', () => {

  const id = 'rmp';
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id);
  video.muted = true;
  const title = document.getElementsByTagName('title')[0];

  it('should load adTag and play it', done => {
    let validSteps = 0;

    const _incrementAndLog = event => {
      validSteps++;
      if (event && event.type) {
        console.log(event.type);
      }
    };

    rmpVast.one('adloaded', e => {
      _incrementAndLog(e);
    });

    rmpVast.one('adimpression', e => {
      _incrementAndLog(e);
    });

    rmpVast.one('adcreativeview', e => {
      _incrementAndLog(e);
    });

    rmpVast.one('adclick', e => {
      _incrementAndLog(e);
      setTimeout(() => {
        rmpVast.play();
      }, 2000);
    });

    rmpVast.on('adstarted', e => {
      _incrementAndLog(e);
      setTimeout(() => {
        const close = document.getElementsByClassName('rmp-ad-non-linear-close')[0];
        console.log('click close');
        _createStdEvent('click', close);
      }, 7000);
    });

    rmpVast.on('adclosed', e => {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', e => {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          if (validSteps === 7) {
            expect(validSteps).toBe(7);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);
  });


});
