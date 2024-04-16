const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml';

describe('Test for linear-touch-learn-more', () => {

  const id = 'rmp';
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id);
  video.muted = true;
  const title = document.getElementsByTagName('title')[0];
  const container = document.getElementById(id);
  container.style.width = '320px';
  container.style.height = '180px';

  it('should linear-touch-learn-more', done => {
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
    });

    rmpVast.on('addestroyed', e => {
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
