const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-error-media.xml';


describe('Test for ErrorMediaSpec', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id);
  const env = rmpVast.getEnvironment();
  video.muted = true;
  if (env.isAndroid[0] || env.isIos[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];


  it('should load adTag and trigger a 401 error', function (done) {
    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        console.log(event.type);
      }
    };

    rmpVast.on('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('aderror', function (e) {
      if (rmpVast.getAdVastErrorCode() === 401 && rmpVast.getAdErrorType() === 'adPlayError' && rmpVast.getAdErrorMessage() === 'File not found. Unable to find Linear/MediaFile from URI.') {
        _incrementAndLog(e);
      }
    });

    rmpVast.on('addestroyed', function (e) {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          if (validSteps === 4) {
            expect(validSteps).toBe(4);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);

  });


});
