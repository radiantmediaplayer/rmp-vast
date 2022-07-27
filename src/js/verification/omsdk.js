import FW from '../framework/fw';
import TRACKING_EVENTS from '../tracking/tracking-events';

const VIDEO_EVENT_TYPES = [
  'error',
  'loadeddata',
  'pause',
  'play',
  'timeupdate',
  'volumechange'
];

const CONTENT_URL = document.location.href;
const ACCESS_MODE = 'full';

class OmSdkManager {

  constructor(adVerifications, videoElement, params, isSkippableAd, skipTimeOffset) {
    this.adEvents = null;
    this.mediaEvents = null;
    this.adSession = null;
    this.OMIframe = null;
    this.VastProperties = null;
    this.lastVideoTime = -1;
    this.videoElement = videoElement;
    this.adVerifications = adVerifications;
    this.params = params;
    this.isSkippableAd = isSkippableAd;
    this.skipTimeOffset = skipTimeOffset;
    this.videoPosition = 'preroll';
    console.log(
      `${FW.consolePrepend}${FW.consolePrepend2} create new class Instance`,
      FW.consoleStyle,
      FW.consoleStyle2,
      ''
    );
  }

  init() {
    // load omweb script
    this.OMIframe = this._createOMIframe();
    this.OMIframe.onload = this._onOMWebIframeLoaded.bind(this);
    try {
      document.body.appendChild(this.OMIframe);
    } catch (error) {
      console.warn(error);
      document.head.appendChild(this.OMIframe);
    }
    VIDEO_EVENT_TYPES.forEach((eventType) => {
      this.videoElement.addEventListener(
        eventType,
        (event) => this._vastPlayerDidDispatchEvent(event)
      );
    });
  }

  destroy() {
    this.adSession.finish();
    FW.removeElement(this.OMIframe);
  }

  _pingVerificationNotExecuted(verification, reasonCode) {
    if (typeof verification.trackingEvents !== 'undefined' &&
      Array.isArray(verification.trackingEvents.verificationNotExecuted) &&
      verification.trackingEvents.verificationNotExecuted.length > 0) {
      verification.trackingEvents.verificationNotExecuted.forEach((verificationNotExecutedURI) => {
        let validatedURI = verificationNotExecutedURI;
        const reasonPattern = /\[REASON\]/gi;
        if (reasonPattern.test(validatedURI)) {
          validatedURI = validatedURI.replace(reasonPattern, reasonCode);
        }
        console.log(
          `${FW.consolePrepend}${FW.consolePrepend2} ping VerificationNotExecuted at URI ${validatedURI}`,
          FW.consoleStyle,
          FW.consoleStyle2,
          ''
        );
        TRACKING_EVENTS.pingURI(validatedURI);
      });
    }
  }

  _createOMIframe() {
    const iframe = document.createElement('iframe');
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.style.display = 'none';
    iframe.srcdoc = `<script src=${this.params.omidPathTo}></script>`;
    console.log(
      `${FW.consolePrepend}${FW.consolePrepend2} load omweb-v1.js at URI ${this.params.omidPathTo}`,
      FW.consoleStyle,
      FW.consoleStyle2,
      ''
    );
    return iframe;
  }

  _vastPlayerDidDispatchTimeUpdate() {
    if (!this.adEvents || !this.mediaEvents || this.videoElement.playbackRate === 0) {
      return;
    }
    // Check if playback has crossed a quartile threshold, and report that to
    // the OMSDK.
    const vastPlayerCurrentTime = this.videoElement.currentTime;
    const vastPlayerDuration = this.videoElement.duration;
    if (vastPlayerCurrentTime > -1 && vastPlayerDuration > 0) {
      if (vastPlayerCurrentTime >= 1 && this.videoPosition === 'preroll') {
        this.videoPosition === 'midroll';
      }
      const currentVideoTimePerCent = vastPlayerCurrentTime / vastPlayerDuration;
      if (this.lastVideoTime < 0 && currentVideoTimePerCent >= 0) {
        this.adEvents.impressionOccurred();
        this.mediaEvents.start(
          vastPlayerDuration,
          this.videoElement.volume
        );
      } else if (this.lastVideoTime < 0.25 && currentVideoTimePerCent >= 0.25) {
        this.mediaEvents.firstQuartile();
      } else if (this.lastVideoTime < 0.5 && currentVideoTimePerCent >= 0.5) {
        this.mediaEvents.midpoint();
      } else if (this.lastVideoTime < 0.75 && currentVideoTimePerCent >= 0.75) {
        this.mediaEvents.thirdQuartile();
      } else if (this.lastVideoTime < 1 && currentVideoTimePerCent >= 1) {
        this.videoPosition = 'postroll';
        this.mediaEvents.complete();
        // to prevent ad pod to fire verification events
        this.adEvents = null;
        this.mediaEvents = null;
        // Wait 3s, then finish the session.
        setTimeout(() => {
          this.destroy();
        }, 300);
      }
      this.lastVideoTime = currentVideoTimePerCent;
    }
  }

  _vastPlayerDidDispatchEvent(event) {
    if (!this.adSession || !this.adEvents || !this.mediaEvents || !this.VastProperties) {
      return;
    }
    let vastProperties, volume;
    switch (event.type) {
      case 'error':
        this.adSession.error(
          'video',
          this.videoElement.error.message
        );
        break;
      case 'loadeddata':
        if (this.skipTimeOffset < 0) {
          this.skipTimeOffset = 0;
        }
        if (this.params.outstream) {
          this.videoPosition = 'standalone';
        }
        vastProperties = new this.VastProperties(
          this.isSkippableAd,
          this.skipTimeOffset,
          this.params.omidAutoplay,
          this.videoPosition
        );
        this.adEvents.loaded(vastProperties);
        break;
      case 'pause':
        this.mediaEvents.pause();
        break;
      case 'play':
        if (this.videoElement.currentTime > 0) {
          this.mediaEvents.resume();
        }
        break;
      case 'timeupdate':
        this._vastPlayerDidDispatchTimeUpdate();
        break;
      case 'volumechange':
        volume = this.videoElement.muted ? 0 : this.videoElement.volume;
        this.mediaEvents.volumeChange(volume);
        break;
      default:
        break;
    }
  }

  _onOMWebIframeLoaded() {
    console.log(
      `${FW.consolePrepend}${FW.consolePrepend2} iframe content loaded`,
      FW.consoleStyle,
      FW.consoleStyle2,
      ''
    );
    // remove executable to only have JavaScriptResource
    const validatedVerificationArray = [];
    // we only execute browserOptional="false" unless there are none 
    // in which case we will look for browserOptional="true"
    let browserOptional = [];
    for (let i = 0; i < this.adVerifications.length; i++) {
      const verification = this.adVerifications[i];
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
      if (this.params.omidAllowedVendors.length > 0 && typeof verification.vendor !== 'undefined') {
        if (!this.params.omidAllowedVendors.includes(verification.vendor)) {
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
        validatedVerificationArray.push(this.adVerifications[browserOptionalItem]);
      });
    }
    this.adVerifications = validatedVerificationArray;
    let sessionClient;
    try {
      sessionClient = OmidSessionClient['default'];
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
    this.VastProperties = sessionClient.VastProperties;
    const partner = new Partner(this.params.partnerName, this.params.partnerVersion);

    let resources = [];
    if (this.params.omidRunValidationScript) {
      // https://interactiveadvertisingbureau.github.io/Open-Measurement-SDKJS/validation.html
      const VALIDATION_SCRIPT_URL = 'https://cdn.radiantmediatechs.com/rmp/omsdk/1.3.36/omid-validation-verification-script-v1.js';
      const VENDOR_KEY = 'dummyVendor'; // you must use this value as is
      const PARAMS = JSON.stringify({ 'k': 'v' });
      resources.push(new VerificationScriptResource(VALIDATION_SCRIPT_URL, VENDOR_KEY, PARAMS));
    } else {
      resources = this.adVerifications.map((verification) => {
        return new VerificationScriptResource(
          verification.resource,
          verification.vendor,
          verification.parameters,
          ACCESS_MODE
        );
      });
    }
    const context = new Context(partner, resources, CONTENT_URL);

    console.dir(resources);

    if (this.params.omidUnderEvaluation) {
      context.underEvaluation = true;
    }
    const serviceWindow = this.OMIframe.contentWindow;
    if (!serviceWindow) {
      console.log(
        `${FW.consolePrepend}${FW.consolePrepend2} invalid serviceWindow - return`,
        FW.consoleStyle,
        FW.consoleStyle2,
        ''
      );
      return;
    }
    context.setServiceWindow(serviceWindow);
    context.setVideoElement(this.videoElement);

    console.dir(context);

    this.adSession = new AdSession(context);
    this.adSession.setCreativeType('video');
    this.adSession.setImpressionType('beginToRender');
    if (!this.adSession.isSupported()) {
      console.log(
        `${FW.consolePrepend}${FW.consolePrepend2} invalid serviceWindow - return`,
        FW.consoleStyle,
        FW.consoleStyle2,
        ''
      );
      return;
    }
    this.adEvents = new AdEvents(this.adSession);
    this.mediaEvents = new MediaEvents(this.adSession);
    this.adSession.start();
  }
}


export default OmSdkManager;
