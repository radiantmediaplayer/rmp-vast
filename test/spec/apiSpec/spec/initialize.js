const ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';


describe('Test for initialize', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  window.rmpVast = new RmpVast(id, {
    showControlsForAdPlayer: true
  });
  video.volume = 0.8;
  const title = document.getElementsByTagName('title')[0];

  it('should initialize', function (done) {
    let eventsSteps = 0;
    const _incrementAndLog = function (event) {
      eventsSteps++;
      if (event && event.type) {
        console.log(event.type);
      }
    };

    container.addEventListener('click', (e) => {
      _incrementAndLog(e);
      window.rmpVast.initialize();
      setTimeout(() => {
        _incrementAndLog(e);
        window.rmpVast.loadAds(ADTAG1);
        setTimeout(() => {
          console.log(window.rmpVast.volume);
          if (window.rmpVast.volume === 0.8) {
            _incrementAndLog(e);
            window.rmpVast.volume = 0.2;
          }
          setTimeout(() => {
            if (window.rmpVast.volume === 0.2 && !window.rmpVast.muted) {
              _incrementAndLog(e);
              window.rmpVast.muted = true;
            }
          }, 500);
        }, 500);
      }, 2000);
    });

    window.rmpVast.on('addestroyed', function (e) {
      if (window.rmpVast.muted) {
        _incrementAndLog(e);
        expect(eventsSteps).toBe(5);
        if (eventsSteps === 5) {
          title.textContent = 'Test completed';
          done();
        }
      }
    });
  });
});
