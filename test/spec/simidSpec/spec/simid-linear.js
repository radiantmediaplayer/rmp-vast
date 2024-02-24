const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/simid.xml';

// official test tags from https://github.com/InteractiveAdvertisingBureau/SIMID
//ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/simid.xml';
//ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/simid-error-interactive-creative-file.xml';
//ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/simid-survey.xml';
//ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/simid-selector.xml';
//ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/simid-error-interactive-media-file.xml';
//ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/simid-extender.xml';
//ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/simid-map.xml';
//ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/simid-non-linear.xml';

describe('Test for simid-linear', function () {

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


  const playButton = document.getElementById('play');
  playButton.addEventListener('click', () => {
    rmpVast.play();
  });
  const pauseButton = document.getElementById('pause');
  pauseButton.addEventListener('click', () => {
    rmpVast.pause();
  });
  const skipButton = document.getElementById('skip');
  skipButton.addEventListener('click', () => {
    rmpVast.skipAd();
  });
  const closeButton = document.getElementById('close');
  closeButton.addEventListener('click', () => {
    rmpVast.stopAds();
  });
  const fatalButton = document.getElementById('fatal');
  fatalButton.addEventListener('click', () => {
    rmpVast.rmpVastSimidPlayer.stopAd(1, true, 1100);
  });

  it('should load and play simid-linear', function (done) {
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
    rmpVast.on('addurationchange', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adstarted', function (e) {
      if (env.isAndroid[0] || env.isIos[0]) {
        rmpVast.resizeAd(320, 180, 'normal');
      }
      _incrementAndLog(e);
    });
    rmpVast.on('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adtagloaded', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('addestroyed', function (e) {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
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
