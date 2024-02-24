const ADTAG1 = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=' + Date.now();

describe('Test for API methods', function () {

  const id = 'rmp';
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id, {
    showControlsForAdPlayer: true
  });
  video.muted = true;
  const title = document.getElementsByTagName('title')[0];

  it('should API methods', function (done) {
    let methodsSteps = 0;

    const _incrementAndLogMethods = function (event) {
      methodsSteps++;
      if (event && event.type) {
        console.log(event.type);
      } else {
        console.log(event);
      }
    };

    rmpVast.on('adstarted', function (e) {
      _incrementAndLogMethods(e);
      setTimeout(() => {
        const adVolume = rmpVast.volume;
        const adMuted = rmpVast.muted;
        const adTagUrl = rmpVast.adTagUrl;
        const adOnStage = rmpVast.adOnStage;
        const initialized = rmpVast.initialized;
        const adLinear = rmpVast.adLinear;
        const adMediaUrl = rmpVast.adMediaUrl;
        const adSystem = rmpVast.adSystem;
        const adUniversalAdIds = rmpVast.adUniversalAdIds;
        const adContentType = rmpVast.adContentType;
        const adTitle = rmpVast.adTitle;
        const adDescription = rmpVast.adDescription;
        const adPricing = rmpVast.adPricing;
        const adSurvey = rmpVast.adSurvey;
        const adAdServingId = rmpVast.adAdServingId;
        const adCategories = rmpVast.adCategories;
        const adBlockedAdCategories = rmpVast.adBlockedAdCategories;
        const adDuration = rmpVast.adDuration;
        const adCurrentTime = rmpVast.adCurrentTime;
        const adRemainingTime = rmpVast.adRemainingTime;
        const adMediaWidth = rmpVast.adMediaWidth;
        const adMediaHeight = rmpVast.adMediaHeight;
        const clickThroughUrl = rmpVast.clickThroughUrl;
        const isSkippableAd = rmpVast.isSkippableAd;
        const skipTimeOffset = rmpVast.skipTimeOffset;
        const contentPlayerCompleted = rmpVast.contentPlayerCompleted;
        const adPlayer = rmpVast.adPlayer;
        const contentPlayer = rmpVast.contentPlayer;
        const isUsingContentPlayerForAds = rmpVast.isUsingContentPlayerForAds;

        if (adPlayer instanceof HTMLVideoElement && contentPlayer instanceof HTMLVideoElement) {
          _incrementAndLogMethods('adPlayer');
        }
        if (!contentPlayerCompleted && !isUsingContentPlayerForAds) {
          _incrementAndLogMethods('contentPlayerCompleted');
        }
        if (isSkippableAd && skipTimeOffset === 5) {
          _incrementAndLogMethods('isSkippableAd');
        }
        if (/file\/file.(webm|mp4)/.test(adMediaUrl) && /video\/(webm|mp4)/.test(adContentType)) {
          _incrementAndLogMethods('adMediaUrl');
        }
        if (adSystem && adSystem.value === 'GDFP') {
          _incrementAndLogMethods('adSystem');
        }
        if (adUniversalAdIds.length === 0 && adCategories.length === 0 && adBlockedAdCategories.length === 0) {
          _incrementAndLogMethods('adUniversalAdIds');
        }
        if (adTitle === 'External - Single Inline Linear Skippable' && adDescription === 'External - Single Inline Linear Skippable ad') {
          _incrementAndLogMethods('adTitle');
        }
        if (adPricing && adPricing.value === '') {
          _incrementAndLogMethods('adPricing');
        }
        if (typeof adSurvey === 'object' && adSurvey.value === '' && adAdServingId === '') {
          _incrementAndLogMethods('adSurvey');
        }
        window.console.log(adDuration);
        window.console.log(adCurrentTime);
        window.console.log(adRemainingTime);
        if (adDuration >= 10000 && adDuration <= 10500 && adCurrentTime > 700 && adCurrentTime < 1100 && adRemainingTime > 9000 && adRemainingTime < 10000) {
          _incrementAndLogMethods('adDuration');
        }
        if ([1280, 640, 426, 854].includes(adMediaWidth) && [360, 240, 480, 720].includes(adMediaHeight) && /https:\/\/googleads\.github\.io\/googleads-ima-html5\/vsi\//.test(clickThroughUrl)) {
          _incrementAndLogMethods('adMediaWidth');
        }
        if (adVolume === 1 && adMuted && adTagUrl === ADTAG1 && adOnStage && initialized && adLinear) {
          _incrementAndLogMethods('adVolume');
        }
        if (!rmpVast.adPaused) {
          _incrementAndLogMethods('!adPaused');
          rmpVast.pause();
        }
      }, 1000);
      setTimeout(() => {
        if (rmpVast.adPaused) {
          _incrementAndLogMethods('adPaused');
          rmpVast.play();
        }
      }, 2000);
    });

    rmpVast.on('adskippablestatechanged', function (e) {
      _incrementAndLogMethods(e);
      if (rmpVast.adSkippableState) {
        rmpVast.skipAd();
      }
    });

    rmpVast.on('addestroyed', function (e) {
      _incrementAndLogMethods(e);
      expect(methodsSteps).toBe(17);
      if (methodsSteps === 17) {
        title.textContent = 'Test completed';
        done();
      }
    });

    rmpVast.loadAds(ADTAG1);
  });


});
