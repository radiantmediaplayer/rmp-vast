const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-icons-image.xml';


describe('icons-image', function () {

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

  it('should load adTag and play it', done => {
    let validSteps = 0;

    const _incrementAndLog = (event) => {
      validSteps++;
      if (event && event.type) {
        window.console.log(event.type + ' at step ' + validSteps);
      }
    };

    rmpVast.on('adloaded', e => {
      _incrementAndLog(e);
    });

    rmpVast.on('adstarted', e => {
      _incrementAndLog(e);
    });

    rmpVast.on('adcomplete', e => {
      _incrementAndLog(e);
    });

    rmpVast.on('adiconclick', e => {
      _incrementAndLog(e);
    });

    rmpVast.on('addestroyed', e => {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', e => {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          if (validSteps === 6) {
            expect(validSteps).toBe(6);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);

  });


});
