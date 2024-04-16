const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';

// right now pod in wrappers only cause the first ad to return
// open ticket at https://github.com/dailymotion/vast-client-js for this

describe('Test for pass', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  video.muted = true;
  const rmpVast = new RmpVast(id);
  const env = rmpVast.environment;
  if (env.isAndroid[0] || env.isIos[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];

  it('should load adTag play adpod of wrapper items', function (done) {

    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        console.log(event.type);
      }
    };

    rmpVast.on('adstarted', function (e) {
      _incrementAndLog(e);
    });

    let timeupdateCount = 0;
    rmpVast.on('addestroyed', function (e) {
      _incrementAndLog(e);
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          if (validSteps === 3) {
            expect(validSteps).toBe(3);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);
  });


});
