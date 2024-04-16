import Logger from '../framework/logger';


export default class OmSdkManager {

  constructor(adVerifications, rmpVast) {
    this._rmpVast = rmpVast;
    this.VastProperties = null;
    this._adEvents = null;
    this._mediaEvents = null;
    this._adSession = null;
    this._lastVideoTime = -1;
    this._adVerifications = adVerifications;
    this._onFullscreenChangeFn = null;
    this._contentPlayer = rmpVast.currentContentPlayer;
    this._adPlayer = rmpVast.currentAdPlayer;
    this._params = rmpVast.params;
    this._isSkippableAd = rmpVast.isSkippableAd;
    this._skipTimeOffset = rmpVast.skipTimeOffset;
  }

  _destroy() {
    document.removeEventListener('fullscreenchange', this._onFullscreenChangeFn);
    this._adSession.finish();
  }

  _onFullscreenChange() {
    const isFullscreen = document.fullscreenElement !== null;
    const playerState = isFullscreen ? 'fullscreen' : 'normal';
    this._mediaEvents.playerStateChange(playerState);
  }

  _pingVerificationNotExecuted(verification, reasonCode) {
    if (typeof verification.trackingEvents !== 'undefined' &&
      Array.isArray(verification.trackingEvents.verificationNotExecuted) &&
      verification.trackingEvents.verificationNotExecuted.length > 0) {
      verification.trackingEvents.verificationNotExecuted.forEach(verificationNotExecutedURI => {
        let validatedURI = verificationNotExecutedURI;
        const reasonPattern = /\[REASON\]/gi;
        if (reasonPattern.test(validatedURI)) {
          validatedURI = validatedURI.replace(reasonPattern, reasonCode);
        }
        this._rmpVast.rmpVastTracking.pingURI(validatedURI);
      });
    }
  }

  _adPlayerDidDispatchTimeUpdate() {
    if (!this._adEvents || !this._mediaEvents || !this._adPlayer || this._adPlayer.playbackRate === 0) {
      return;
    }
    // Check if playback has crossed a quartile threshold, and report that to
    // the OMSDK.
    const adPlayerCurrentTime = this._adPlayer.currentTime;
    const adPlayerDuration = this._adPlayer.duration;
    if (adPlayerCurrentTime > -1 && adPlayerDuration > 0) {
      const currentVideoTimePerCent = adPlayerCurrentTime / adPlayerDuration;
      if (this._lastVideoTime < 0 && currentVideoTimePerCent >= 0) {
        this._adEvents.impressionOccurred();
        this._mediaEvents.start(
          adPlayerDuration,
          this._adPlayer.volume
        );
      } else if (this._lastVideoTime < 0.25 && currentVideoTimePerCent >= 0.25) {
        this._mediaEvents.firstQuartile();
      } else if (this._lastVideoTime < 0.5 && currentVideoTimePerCent >= 0.5) {
        this._mediaEvents.midpoint();
      } else if (this._lastVideoTime < 0.75 && currentVideoTimePerCent >= 0.75) {
        this._mediaEvents.thirdQuartile();
      } else if (this._lastVideoTime < 1 && currentVideoTimePerCent >= 1) {
        this._mediaEvents.complete();
        // to prevent ad pod to fire verification events
        this._adEvents = null;
        this._mediaEvents = null;
        // Wait 300 ms, then finish the session.
        setTimeout(() => {
          this._destroy();
        }, 300);
      }
      this._lastVideoTime = currentVideoTimePerCent;
    }
  }

  _adPlayerDidDispatchEvent(event) {
    if (!this._adSession || !this._adEvents || !this._mediaEvents || !this.VastProperties) {
      return;
    }
    let vastProperties, volume;
    let videoPosition = 'preroll';
    switch (event.type) {
      case 'error':
        this._adSession.error(
          'video',
          this._adPlayer.error.message
        );
        break;
      case 'loadeddata':
        if (this._skipTimeOffset < 0) {
          this._skipTimeOffset = 0;
        }
        if (this._params.outstream) {
          videoPosition = 'standalone';
        } else {
          const contentPlayerCurrentTime = this._contentPlayer.currentTime;
          const contentPlayerDuration = this._contentPlayer.duration;
          if (contentPlayerCurrentTime > 0 && contentPlayerCurrentTime < contentPlayerDuration) {
            videoPosition === 'midroll';
          } else if (contentPlayerCurrentTime >= contentPlayerDuration) {
            videoPosition = 'postroll';
          }
        }
        vastProperties = new this.VastProperties(
          this._isSkippableAd,
          this._skipTimeOffset,
          this._params.omidAutoplay,
          videoPosition
        );
        this._adEvents.loaded(vastProperties);
        break;
      case 'pause':
        this._mediaEvents.pause();
        break;
      case 'play':
        if (this._adPlayer.currentTime > 0) {
          this._mediaEvents.resume();
        }
        break;
      case 'timeupdate':
        this._adPlayerDidDispatchTimeUpdate();
        break;
      case 'volumechange':
        volume = this._adPlayer.muted ? 0 : this._adPlayer.volume;
        this._mediaEvents.volumeChange(volume);
        break;
      case 'click':
        this._mediaEvents.adUserInteraction('click');
        break;
      default:
        break;
    }
  }

  _onOMWebLoaded() {
    // remove executable to only have JavaScriptResource
    const validatedVerificationArray = [];
    // we only execute browserOptional="false" unless there are none 
    // in which case we will look for browserOptional="true"
    let browserOptional = [];
    for (let i = 0; i < this._adVerifications.length; i++) {
      const verification = this._adVerifications[i];
      if (typeof verification.resource !== 'string' || verification.resource === '') {
        continue;
      }
      // Ping rejection code 2
      // Verification not supported. The API framework or language type of
      // verification resources provided are not implemented or supported by
      // the player/SDK
      if (typeof verification.type !== 'undefined' && verification.type === 'executable') {
        this._pingVerificationNotExecuted(verification, '2');
        continue;
      }
      // if not OMID, we reject
      if (typeof verification.apiFramework !== 'undefined' && verification.apiFramework !== 'omid') {
        this._pingVerificationNotExecuted(verification, '2');
        continue;
      }
      // reject vendors not in omidAllowedVendors if omidAllowedVendors is not empty
      if (this._params.omidAllowedVendors.length > 0 && typeof verification.vendor !== 'undefined') {
        if (!this._params.omidAllowedVendors.includes(verification.vendor)) {
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
        validatedVerificationArray.push(this._adVerifications[browserOptionalItem]);
      });
    }
    this._adVerifications = validatedVerificationArray;
    let sessionClient;
    try {
      sessionClient = OmidSessionClient['default'];
    } catch (error) {
      Logger.print('warning', error);
      return;
    }
    const AdSession = sessionClient.AdSession;
    const Partner = sessionClient.Partner;
    const Context = sessionClient.Context;
    const VerificationScriptResource = sessionClient.VerificationScriptResource;
    const AdEvents = sessionClient.AdEvents;
    const MediaEvents = sessionClient.MediaEvents;
    this.VastProperties = sessionClient.VastProperties;
    const partner = new Partner(this._params.partnerName, this._params.partnerVersion);

    let resources = [];
    if (this._params.omidRunValidationScript) {
      // https://interactiveadvertisingbureau.github.io/Open-Measurement-SDKJS/validation.html
      const VALIDATION_SCRIPT_URL = 'https://cdn.radiantmediatechs.com/rmp/omsdk/1.3.37/omid-validation-verification-script-v1.js';
      const VENDOR_KEY = 'dummyVendor'; // you must use this value as is
      const PARAMS = JSON.stringify({ 'k': 'v' });
      resources.push(new VerificationScriptResource(VALIDATION_SCRIPT_URL, VENDOR_KEY, PARAMS));
    } else {
      // we support Access Modes Creative Access a.k.a full (we do not support Domain Access for now)
      const accessMode = 'full';
      resources = this._adVerifications.map(verification => {
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

    Logger.print('info', ``, resources);

    if (this._params.omidUnderEvaluation) {
      context.underEvaluation = true;
    }

    const omdSdkServiceWindow = window.top;
    if (!omdSdkServiceWindow) {
      Logger.print('info', `OMSDK: invalid serviceWindow - return`);
      return;
    }
    context.setServiceWindow(omdSdkServiceWindow);
    context.setVideoElement(this._adPlayer);
    Logger.print('info', ``, context);
    this._adSession = new AdSession(context);
    this._adSession.setCreativeType('video');
    this._adSession.setImpressionType('beginToRender');
    if (!this._adSession.isSupported()) {
      Logger.print('info', `OMSDK: invalid serviceWindow - return`);
      return;
    }
    this._adEvents = new AdEvents(this._adSession);
    this._mediaEvents = new MediaEvents(this._adSession);
    this._adSession.start();
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
      this._adPlayer.addEventListener(eventType, event => this._adPlayerDidDispatchEvent(event));
    });
    // handle fullscreenchange 
    this._onFullscreenChangeFn = this._onFullscreenChange.bind(this);
    document.addEventListener('fullscreenchange', this._onFullscreenChangeFn);
    // Service Script To incorporate omweb-v1.js, use a <script> tag - we are assuming it is there
    this._onOMWebLoaded();
  }

}
