import Logger from '../framework/logger';


export default class OmSdkManager {

  #rmpVast;
  #contentPlayer;
  #adPlayer;
  #params;
  #isSkippableAd;
  #skipTimeOffset;
  #adVerifications;
  #VastProperties = null;
  #adEvents = null;
  #mediaEvents = null;
  #adSession = null;
  #lastVideoTime = -1;
  #onFullscreenChangeFn = null;

  constructor(adVerifications, rmpVast) {
    this.#rmpVast = rmpVast;
    this.#contentPlayer = rmpVast.currentContentPlayer;
    this.#adPlayer = rmpVast.currentAdPlayer;
    this.#params = rmpVast.params;
    this.#isSkippableAd = rmpVast.isSkippableAd;
    this.#skipTimeOffset = rmpVast.skipTimeOffset;
    this.#adVerifications = adVerifications;
  }

  #destroy() {
    document.removeEventListener('fullscreenchange', this.#onFullscreenChangeFn);
    this.#adSession.finish();
  }

  #onFullscreenChange() {
    const isFullscreen = document.fullscreenElement !== null;
    const playerState = isFullscreen ? 'fullscreen' : 'normal';
    this.#mediaEvents.playerStateChange(playerState);
  }

  #pingVerificationNotExecuted(verification, reasonCode) {
    if (typeof verification.trackingEvents !== 'undefined' &&
      Array.isArray(verification.trackingEvents.verificationNotExecuted) &&
      verification.trackingEvents.verificationNotExecuted.length > 0) {
      verification.trackingEvents.verificationNotExecuted.forEach(verificationNotExecutedURI => {
        let validatedURI = verificationNotExecutedURI;
        const reasonPattern = /\[REASON\]/gi;
        if (reasonPattern.test(validatedURI)) {
          validatedURI = validatedURI.replace(reasonPattern, reasonCode);
        }
        this.#rmpVast.rmpVastTracking.pingURI(validatedURI);
      });
    }
  }

  #adPlayerDidDispatchTimeUpdate() {
    if (!this.#adEvents || !this.#mediaEvents || !this.#adPlayer || this.#adPlayer.playbackRate === 0) {
      return;
    }
    // Check if playback has crossed a quartile threshold, and report that to
    // the OMSDK.
    const adPlayerCurrentTime = this.#adPlayer.currentTime;
    const adPlayerDuration = this.#adPlayer.duration;
    if (adPlayerCurrentTime > -1 && adPlayerDuration > 0) {
      const currentVideoTimePerCent = adPlayerCurrentTime / adPlayerDuration;
      if (this.#lastVideoTime < 0 && currentVideoTimePerCent >= 0) {
        this.#adEvents.impressionOccurred();
        this.#mediaEvents.start(
          adPlayerDuration,
          this.#adPlayer.volume
        );
      } else if (this.#lastVideoTime < 0.25 && currentVideoTimePerCent >= 0.25) {
        this.#mediaEvents.firstQuartile();
      } else if (this.#lastVideoTime < 0.5 && currentVideoTimePerCent >= 0.5) {
        this.#mediaEvents.midpoint();
      } else if (this.#lastVideoTime < 0.75 && currentVideoTimePerCent >= 0.75) {
        this.#mediaEvents.thirdQuartile();
      } else if (this.#lastVideoTime < 1 && currentVideoTimePerCent >= 1) {
        this.#mediaEvents.complete();
        // to prevent ad pod to fire verification events
        this.#adEvents = null;
        this.#mediaEvents = null;
        // Wait 300 ms, then finish the session.
        window.setTimeout(() => {
          this.#destroy();
        }, 300);
      }
      this.#lastVideoTime = currentVideoTimePerCent;
    }
  }

  #adPlayerDidDispatchEvent(event) {
    if (!this.#adSession || !this.#adEvents || !this.#mediaEvents || !this.#VastProperties) {
      return;
    }
    let vastProperties, volume;
    let videoPosition = 'preroll';
    switch (event.type) {
      case 'error':
        this.#adSession.error(
          'video',
          this.#adPlayer.error.message
        );
        break;
      case 'loadeddata':
        if (this.#skipTimeOffset < 0) {
          this.#skipTimeOffset = 0;
        }
        if (this.#params.outstream) {
          videoPosition = 'standalone';
        } else {
          const contentPlayerCurrentTime = this.#contentPlayer.currentTime;
          const contentPlayerDuration = this.#contentPlayer.duration;
          if (contentPlayerCurrentTime > 0 && contentPlayerCurrentTime < contentPlayerDuration) {
            videoPosition === 'midroll';
          } else if (contentPlayerCurrentTime >= contentPlayerDuration) {
            videoPosition = 'postroll';
          }
        }
        vastProperties = new this.#VastProperties(
          this.#isSkippableAd,
          this.#skipTimeOffset,
          this.#params.omidAutoplay,
          videoPosition
        );
        this.#adEvents.loaded(vastProperties);
        break;
      case 'pause':
        this.#mediaEvents.pause();
        break;
      case 'play':
        if (this.#adPlayer.currentTime > 0) {
          this.#mediaEvents.resume();
        }
        break;
      case 'timeupdate':
        this.#adPlayerDidDispatchTimeUpdate();
        break;
      case 'volumechange':
        volume = this.#adPlayer.muted ? 0 : this.#adPlayer.volume;
        this.#mediaEvents.volumeChange(volume);
        break;
      case 'click':
        this.#mediaEvents.adUserInteraction('click');
        break;
      default:
        break;
    }
  }

  #onOMWebLoaded() {
    // remove executable to only have JavaScriptResource
    const validatedVerificationArray = [];
    // we only execute browserOptional="false" unless there are none 
    // in which case we will look for browserOptional="true"
    let browserOptional = [];
    for (let i = 0; i < this.#adVerifications.length; i++) {
      const verification = this.#adVerifications[i];
      if (typeof verification.resource !== 'string' || verification.resource === '') {
        continue;
      }
      // Ping rejection code 2
      // Verification not supported. The API framework or language type of
      // verification resources provided are not implemented or supported by
      // the player/SDK
      if (typeof verification.type !== 'undefined' && verification.type === 'executable') {
        this.#pingVerificationNotExecuted(verification, '2');
        continue;
      }
      // if not OMID, we reject
      if (typeof verification.apiFramework !== 'undefined' && verification.apiFramework !== 'omid') {
        this.#pingVerificationNotExecuted(verification, '2');
        continue;
      }
      // reject vendors not in omidAllowedVendors if omidAllowedVendors is not empty
      if (this.#params.omidAllowedVendors.length > 0 && typeof verification.vendor !== 'undefined') {
        if (!this.#params.omidAllowedVendors.includes(verification.vendor)) {
          continue;
        }
      }
      if (typeof verification.browserOptional !== 'undefined' && verification.browserOptional === true) {
        browserOptional.push(i);
        continue;
      }
      validatedVerificationArray.push(verification);
    }
    if (validatedVerificationArray.length === 0 && browserOptional.length > 0) {
      browserOptional.forEach(browserOptionalItem => {
        validatedVerificationArray.push(this.#adVerifications[browserOptionalItem]);
      });
    }
    this.#adVerifications = validatedVerificationArray;
    let sessionClient;
    try {
      sessionClient = OmidSessionClient.default;
    } catch (error) {
      console.warn(error);
      return;
    }
    const AdSession = sessionClient.AdSession;
    const Partner = sessionClient.Partner;
    const Context = sessionClient.Context;
    const VerificationScriptResource = sessionClient.VerificationScriptResource;
    const AdEvents = sessionClient.AdEvents;
    const MediaEvents = sessionClient.MediaEvents;
    this.#VastProperties = sessionClient.VastProperties;
    const partner = new Partner(this.#params.partnerName, this.#params.partnerVersion);

    let resources = [];
    if (this.#params.omidRunValidationScript) {
      // https://interactiveadvertisingbureau.github.io/Open-Measurement-SDKJS/validation.html
      const VALIDATION_SCRIPT_URL = 'https://cdn.radiantmediatechs.com/rmp/omsdk/1.3.37/omid-validation-verification-script-v1.js';
      const VENDOR_KEY = 'dummyVendor'; // you must use this value as is
      const PARAMS = JSON.stringify({ k: 'v' });
      resources.push(new VerificationScriptResource(VALIDATION_SCRIPT_URL, VENDOR_KEY, PARAMS));
    } else {
      // we support Access Modes Creative Access a.k.a full (we do not support Domain Access for now)
      const accessMode = 'full';
      resources = this.#adVerifications.map(verification => {
        return new VerificationScriptResource(
          verification.resource,
          verification.vendor,
          verification.parameters,
          accessMode
        );
      });
    }
    const contentUrl = document.location.href;
    const context = new Context(partner, resources, contentUrl);

    Logger.print(this.#rmpVast.debugRawConsoleLogs, ``, resources);

    if (this.#params.omidUnderEvaluation) {
      context.underEvaluation = true;
    }

    const omdSdkServiceWindow = window.top;
    if (!omdSdkServiceWindow) {
      Logger.print(this.#rmpVast.debugRawConsoleLogs, `OMSDK: invalid serviceWindow - return`);
      return;
    }
    context.setServiceWindow(omdSdkServiceWindow);
    context.setVideoElement(this.#adPlayer);
    Logger.print(this.#rmpVast.debugRawConsoleLogs, ``, context);
    this.#adSession = new AdSession(context);
    this.#adSession.setCreativeType('video');
    this.#adSession.setImpressionType('beginToRender');
    if (!this.#adSession.isSupported()) {
      Logger.print(this.#rmpVast.debugRawConsoleLogs, `OMSDK: invalid serviceWindow - return`);
      return;
    }
    this.#adEvents = new AdEvents(this.#adSession);
    this.#mediaEvents = new MediaEvents(this.#adSession);
    this.#adSession.start();
  }

  init() {
    const videoEventTypes = [
      'error',
      'loadeddata',
      'pause',
      'play',
      'timeupdate',
      'volumechange',
      'click',
    ];

    // handle ad player events
    videoEventTypes.forEach(eventType => {
      this.#adPlayer.addEventListener(eventType, event => this.#adPlayerDidDispatchEvent(event));
    });
    // handle fullscreenchange 
    this.#onFullscreenChangeFn = this.#onFullscreenChange.bind(this);
    document.addEventListener('fullscreenchange', this.#onFullscreenChangeFn);
    // Service Script To incorporate omweb-v1.js, use a <script> tag - we are assuming it is there
    this.#onOMWebLoaded();
  }

}
