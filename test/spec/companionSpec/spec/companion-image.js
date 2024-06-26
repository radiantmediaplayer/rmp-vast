const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/iab/vast4_2/Inline_Companion_Tag-test.xml';


describe('companion-image', function () {

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
  const result = document.getElementById('result');
  const timeout = 30000;

  it('should load adTag and play it', function (done) {

    const _fail = () => {
      result.textContent = 'failed';
      title.textContent = 'Test finished';
      done.fail();
    };

    const _pass = () => {
      result.textContent = 'passed';
      title.textContent = 'Test finished';
      done();
    };

    setTimeout(() => {
      _fail();
    }, timeout);

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
      if (adSystem.value === 'iabtechlab' && adSystem.version === '1') {
        const pricing = rmpVast.adPricing;
        window.console.log(pricing);
        if (pricing.model === 'cpm' && pricing.currency === 'USD' && pricing.value === '25.00') {
          const adDescription = rmpVast.adDescription;
          window.console.log(adDescription);
          if (adDescription === 'This is sample companion ad tag with Linear ad tag. This tag while showing video ad on the player, will show a companion ad beside the player where it can be fitted. At most 3 companion ads can be placed. Modify accordingly to see your own content.') {
            const universalAdIds = rmpVast.adUniversalAdIds;
            window.console.log(universalAdIds);
            if (universalAdIds[0].idRegistry === 'Ad-ID' && universalAdIds[0].value === '8466') {
              const title = rmpVast.adTitle;
              window.console.log(title);
              if (title === 'VAST 4.0 Pilot - Scenario 5') {
                const companionAdsList = rmpVast.getCompanionAdsList();
                console.log(companionAdsList);
                if (companionAdsList.length === 1) {
                  const companionAd = rmpVast.getCompanionAd(0);
                  if (companionAd instanceof HTMLImageElement) {
                    window.console.log(rmpVast.companionAdsRequiredAttribute);
                    window.console.log(companionAd);
                    const companionDiv = document.getElementById('companion');
                    companionDiv.appendChild(companionAd);
                    _incrementAndLog(e);
                  }
                }

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

    rmpVast.on('adprogress', function (e) {
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
          expect(validSteps).toBe(13);
          if (validSteps === 13) {
            _pass();
          } else {
            _fail();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);

  });


});
