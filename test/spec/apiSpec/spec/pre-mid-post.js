const ADTAG1 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';
const ADTAG2 = 'https://www.radiantmediaplayer.com/vast/tags/vpaid-2-js-linear.xml';
const ADTAG3 = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';

describe('Test for pre-mid-post', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const params = {
    enableVpaid: true,
    vpaidSettings: {
      width: 640,
      height: 360,
      viewMode: 'normal',
      desiredBitrate: 500
    }
  };
  const rmpVast = new RmpVast(id, params);
  const env = rmpVast.getEnvironment();
  video.muted = true;
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }

  const title = document.getElementsByTagName('title')[0];

  it('should load pre-mid-post', function (done) {
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
      if (env.isAndroid[0]) {
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
    let addestroyedCount = 0;
    const contentPlayer = document.querySelector('.rmp-video');
    let loadPostRoll = true;
    rmpVast.on('addestroyed', function (e) {
      _incrementAndLog(e);
      addestroyedCount++;
      if (addestroyedCount === 1) {
        expect(validSteps).toBe(9);
        setTimeout(function () {
          contentPlayer.currentTime = 15;
        }, 1000);

        setTimeout(function () {
          rmpVast.loadAds(ADTAG2);
        }, 3000);
      }
      if (addestroyedCount === 2) {
        expect(validSteps).toBe(18);
        contentPlayer.addEventListener('ended', function () {
          if (loadPostRoll) {
            loadPostRoll = false;
            rmpVast.loadAds(ADTAG3);
          }
        });
        setTimeout(function () {
          contentPlayer.currentTime = 96;
        }, 1000);
      }
      if (addestroyedCount === 3) {
        expect(validSteps).toBe(27);
        if (validSteps === 27) {
          title.textContent = 'Test completed';
        }
        setTimeout(function () {
          done();
        }, 100);
      }
    });

    rmpVast.loadAds(ADTAG1);
  });


});
