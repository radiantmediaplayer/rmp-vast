const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-companion-html.xml';


describe('companion-html', function () {

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

  it('should load adTag and play it', function (done) {
    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        window.console.log(event.type);
        window.console.log(validSteps);
      }
    };

    rmpVast.on('adloaded', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('addurationchange', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adimpression', function (e) {
      _incrementAndLog(e);
    });

    rmpVast.on('adstarted', function (e) {
      const adSystem = rmpVast.adSystem;
      window.console.log(adSystem);
      if (adSystem.value === 'RMP' && adSystem.version === '') {
        const adDescription = rmpVast.adDescription;
        window.console.log(adDescription);
        if (adDescription === 'Test adTag for Radiant Media Player - inline linear with companion ad (HTML)') {
          const title = rmpVast.adTitle;
          window.console.log(title);
          if (title === 'Inline linear video ad with companion ad (HTML)') {
            const companionAdsList = rmpVast.getCompanionAdsList();
            window.console.log(companionAdsList);
            if (companionAdsList.length === 1) {
              const companionAd = rmpVast.getCompanionAd(0);
              window.console.log(companionAd);
              if (typeof companionAd === 'object') {
                const companionDiv = document.getElementById('companion');
                companionDiv.appendChild(companionAd);
                _incrementAndLog(e);
              }
            }
          }
        }
      }
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

    rmpVast.on('addestroyed', function (e) {
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
