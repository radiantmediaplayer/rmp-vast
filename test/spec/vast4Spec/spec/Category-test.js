const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/iab/vast4_2/Category-test.xml';


describe('Category-test', function () {

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
      const adSystem = rmpVast.getAdSystem();
      window.console.log(adSystem);
      if (adSystem.value === 'iabtechlab' && adSystem.version === '1') {
        const pricing = rmpVast.getAdPricing();
        window.console.log(pricing);
        if (pricing.model === 'cpm' && pricing.currency === 'USD' && pricing.value === '25.00') {
          const adServingId = rmpVast.getAdAdServingId();
          window.console.log(adServingId);
          if (adServingId === 'a532d16d-4d7f-4440-bd29-2ec0e693fc82') {
            const categories = rmpVast.getAdCategories();
            window.console.log(categories);
            let valid = 0;
            for (let i = 0, len = categories.length; i < len; i++) {
              const category = categories[i];
              switch (i) {
                case 0:
                  if (category.authority === 'https://www.iabtechlab.com/categoryauthority' && category.value === 'American Cuisine') {
                    valid++;
                  }
                  break;
                case 1:
                  if (category.authority === 'https://www.iabtechlab.com/categoryauthority' && category.value === 'Guitar') {
                    valid++;
                  }
                  break;
                case 2:
                  if (category.authority === 'https://www.iabtechlab.com/categoryauthority' && category.value === 'Vegan') {
                    valid++;
                  }
                  break;
                default:
                  break;
              }
            }
            if (valid === 3) {
              const advertiser = rmpVast.getAdAdvertiser();
              if (advertiser.value === '') {
                const universalAdIds = rmpVast.getAdUniversalAdIds();
                window.console.log(universalAdIds);
                if (universalAdIds[0].idRegistry === 'Ad-ID' && universalAdIds[0].value === '8465') {
                  const title = rmpVast.getAdTitle();
                  if (title === 'iabtechlab video ad') {
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
          if (validSteps === 13) {
            expect(validSteps).toBe(13);
            title.textContent = 'Test completed';
            done();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);

  });


});
