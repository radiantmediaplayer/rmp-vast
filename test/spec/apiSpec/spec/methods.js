const ADTAG1 = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=' + Date.now();

describe('Test for API methods', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id, {
    showControlsForVastPlayer: true
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

    container.addEventListener('adstarted', function (e) {
      _incrementAndLogMethods(e);
      setTimeout(() => {
        const adVolume = rmpVast.getVolume();
        const adMuted = rmpVast.getMute();
        const adTagUrl = rmpVast.getAdTagUrl();
        const adOnStage = rmpVast.getAdOnStage();
        const initialized = rmpVast.getInitialized();
        const adLinear = rmpVast.getAdLinear();
        const adMediaUrl = rmpVast.getAdMediaUrl();
        const adSystem = rmpVast.getAdSystem();
        const adUniversalAdIds = rmpVast.getAdUniversalAdIds();
        const adContentType = rmpVast.getAdContentType();
        const adTitle = rmpVast.getAdTitle();
        const adDescription = rmpVast.getAdDescription();
        const adPricing = rmpVast.getAdPricing();
        const adSurvey = rmpVast.getAdSurvey();
        const adAdServingId = rmpVast.getAdAdServingId();
        const adCategories = rmpVast.getAdCategories();
        const adBlockedAdCategories = rmpVast.getAdBlockedAdCategories();
        const adDuration = rmpVast.getAdDuration();
        const adCurrentTime = rmpVast.getAdCurrentTime();
        const adRemainingTime = rmpVast.getAdRemainingTime();
        const adMediaWidth = rmpVast.getAdMediaWidth();
        const adMediaHeight = rmpVast.getAdMediaHeight();
        const clickThroughUrl = rmpVast.getClickThroughUrl();
        const isSkippableAd = rmpVast.getIsSkippableAd();
        const skipTimeOffset = rmpVast.getSkipTimeOffset();
        const contentPlayerCompleted = rmpVast.getContentPlayerCompleted();
        const vastPlayer = rmpVast.getVastPlayer();
        const contentPlayer = rmpVast.getContentPlayer();
        const isUsingContentPlayerForAds = rmpVast.getIsUsingContentPlayerForAds();

        if (vastPlayer instanceof HTMLVideoElement && contentPlayer instanceof HTMLVideoElement) {
          _incrementAndLogMethods('vastPlayer');
        }
        if (!contentPlayerCompleted && !isUsingContentPlayerForAds) {
          _incrementAndLogMethods('contentPlayerCompleted');
        }
        if (isSkippableAd && skipTimeOffset === 5) {
          _incrementAndLogMethods('isSkippableAd');
        }
        if (/file\/file.webm/.test(adMediaUrl) && adContentType === 'video/webm') {
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
        if (adSurvey === '' && adAdServingId === '') {
          _incrementAndLogMethods('adSurvey');
        }
        if (adDuration === 10024 && adCurrentTime > 900 && adCurrentTime < 1100 && adRemainingTime > 9000 && adRemainingTime < 10000) {
          _incrementAndLogMethods('adDuration');
        }
        if ([1280, 640, 426, 854].includes(adMediaWidth) && [360, 240, 480, 720].includes(adMediaHeight) && /https:\/\/googleads\.github\.io\/googleads-ima-html5\/vsi\//.test(clickThroughUrl)) {
          _incrementAndLogMethods('adMediaWidth');
        }
        if (adVolume === 1 && adMuted && adTagUrl === ADTAG1 && adOnStage && initialized && adLinear) {
          _incrementAndLogMethods('adVolume');
        }
        if (!rmpVast.getAdPaused()) {
          _incrementAndLogMethods('!adPaused');
          rmpVast.pause();
        }
      }, 1000);
      setTimeout(() => {
        if (rmpVast.getAdPaused()) {
          _incrementAndLogMethods('adPaused');
          rmpVast.play();
        }
      }, 2000);
    });

    container.addEventListener('adskippablestatechanged', function (e) {
      _incrementAndLogMethods(e);
      if (rmpVast.getAdSkippableState()) {
        rmpVast.skipAd();
      }
    });

    container.addEventListener('addestroyed', function (e) {
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
