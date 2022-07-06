const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-companion-iframe.xml';


describe('companion-iframe', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id);
  const env = rmpVast.getEnvironment();
  video.muted = true;
  if (env.isAndroid[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];

  it('should load adTag and play it', function (done) {
    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        window.console.log(event.type);
        window.console.log(validSteps);
      }
    };

    container.addEventListener('adloaded', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('addurationchange', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adimpression', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adstarted', function (e) {
      const adSystem = rmpVast.getAdSystem();
      window.console.log(adSystem);
      if (adSystem.value === 'RMP' && adSystem.version === null) {
        const adDescription = rmpVast.getAdDescription();
        window.console.log(adDescription);
        if (adDescription === 'Test adTag for Radiant Media Player - inline linear with companion ad (iframe)') {
          const title = rmpVast.getAdTitle();
          window.console.log(title);
          if (title === 'Inline linear video ad with companion ad (iframe)') {
            const companionAdsList = rmpVast.getCompanionAdsList();
            if (companionAdsList.length === 1) {
              const companionAd = rmpVast.getCompanionAd(0);
              if (companionAd instanceof HTMLIFrameElement) {
                window.console.log(companionAd);
                _incrementAndLog(e);
              }
            }
          }
        }
      }
    });

    container.addEventListener('adtagstartloading', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adtagloaded', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adcomplete', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adfirstquartile', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('admidpoint', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('adthirdquartile', function (e) {
      _incrementAndLog(e);
    });

    container.addEventListener('addestroyed', function (e) {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          if (validSteps === 12) {
            expect(validSteps).toBe(12);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);

  });


});
