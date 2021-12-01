import RmpVast from '../../../../js/src/index.js';

const ADTAG = 'https://www.radiantmediaplayer.com/vast/tags/iab/vast4_2/Ad_Verification_OMID-valid-test-2.xml';


describe('Ad_Verification-test', function () {

  const id = 'rmpPlayer';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const params = {
    omidSupport: true,
    omidPathTo: 'https://cdn.radiantmediatechs.com/rmp/omsdk/omweb-v1.js',
    autoplay: true
  };
  const rmpVast = new RmpVast(id, params, true);
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
      if (adSystem.value === 'iabtechlab' && adSystem.version === '1.0') {
        const pricing = rmpVast.getAdPricing();
        window.console.log(pricing);
        if (pricing.model === 'cpm' && pricing.currency === 'USD' && pricing.value === '25.00') {
          const adServingId = rmpVast.getAdAdServingId();
          window.console.log(adServingId);
          if (adServingId === 'a532d16d-4d7f-4440-bd29-2ec0e693fc80') {
            const advertiser = rmpVast.getAdAdvertiser();
            window.console.log(advertiser);
            if (advertiser.value === 'IAB Sample Company') {
              const universalAdId = rmpVast.getAdUniversalAdId();
              window.console.log(universalAdId);
              if (universalAdId.idRegistry === 'Ad-ID' && universalAdId.value === '8465') {
                const title = rmpVast.getAdTitle();
                window.console.log(title);
                if (title === 'iabtechlab video ad') {
                  _incrementAndLog(e);
                }
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

    container.addEventListener('adprogress', function (e) {
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
