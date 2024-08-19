import FW from '../framework/fw';
import Environment from '../framework/environment';
import Logger from '../framework/logger';


export default class Tracking {

  #rmpVast;
  #trackingApiEventMap = new Map();
  #onPauseFn = null;
  #onPlayFn = null;
  #onPlayingFn = null;
  #onEndedFn = null;
  #onVolumeChangeFn = null;
  #onTimeupdateFn = null;
  #firstQuartileEventFired = false;
  #midpointEventFired = false;
  #thirdQuartileEventFired = false;

  constructor(rmpVast) {
    this.#rmpVast = rmpVast;
    this.#createTrackingApiEventMap();
  }

  #createTrackingApiEventMap() {
    // ViewableImpression
    this.#trackingApiEventMap.set('adviewable', 'viewable');
    this.#trackingApiEventMap.set('adviewundetermined', 'viewundetermined');
    // Tracking Event Elements
    this.#trackingApiEventMap.set('advolumemuted', 'mute');
    this.#trackingApiEventMap.set('advolumeunmuted', 'unmute');
    this.#trackingApiEventMap.set('adpaused', 'pause');
    this.#trackingApiEventMap.set('adresumed', 'resume');
    this.#trackingApiEventMap.set('adskipped', 'skip');
    // VAST 4 events
    this.#trackingApiEventMap.set('adplayerexpand', 'playerExpand');
    this.#trackingApiEventMap.set('adplayercollapse', 'playerCollapse');
    // VAST 3 events
    this.#trackingApiEventMap.set('adfullscreen', 'fullscreen');
    this.#trackingApiEventMap.set('adexitfullscreen', 'exitFullscreen');
    // Linear Ad Metrics
    this.#trackingApiEventMap.set('adloaded', 'loaded');
    this.#trackingApiEventMap.set('adstarted', 'start');
    this.#trackingApiEventMap.set('adfirstquartile', 'firstQuartile');
    this.#trackingApiEventMap.set('admidpoint', 'midpoint');
    this.#trackingApiEventMap.set('adthirdquartile', 'thirdQuartile');
    this.#trackingApiEventMap.set('adcomplete', 'complete');
    // tracking progress event happens in #onTimeupdate
    // InLine > Impression
    this.#trackingApiEventMap.set('adimpression', 'impression');

    // creativeView for companion ads happens in getCompanionAd (index.js)
    // creativeView tracking needs to happen for linear creative as well (support for VAST 3)
    this.#trackingApiEventMap.set('adcreativeview', 'creativeView');

    // for non-linear and VPAID only
    this.#trackingApiEventMap.set('adcollapse', 'adCollapse');

    // only support for VPAID - PR welcome for non-linear
    this.#trackingApiEventMap.set('aduseracceptinvitation', 'acceptInvitation');
    this.#trackingApiEventMap.set('adclosed', 'close');
    // VideoClicks > ClickThrough
    this.#trackingApiEventMap.set('adclick', 'clickthrough');

    // Need to investigate overlayViewDuration (non-linear) - interactiveStart (SIMID) further
  }

  #dispatch(event) {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `ping tracking for ${event} VAST event`);
    // filter trackers - may return multiple urls for same event as allowed by VAST spec
    const trackers = this.#rmpVast.trackingTags.filter(value => {
      return event === value.event;
    });
    // send ping for each valid tracker
    if (trackers.length > 0) {
      trackers.forEach(element => {
        this.pingURI(element.url);
      });
    }
  }

  #ping(url) {
    // we expect an image format for the tracker (generally a 1px GIF/PNG/JPG/AVIF) or JavaScript as 
    // those are the most common format in the industry 
    // other format may produce errors and the related tracker may not be requested properly
    const jsPattern = /\.js$/i;
    if (jsPattern.test(url)) {
      const script = document.createElement('script');
      script.src = url;
      try {
        document.head.appendChild(script);
      } catch (error) {
        console.warn(error);
        document.body.appendChild(script);
      }
    } else {
      FW.ajax(url, this.#rmpVast.params.ajaxTimeout, false, 'GET').
        then(() => {
          Logger.print(this.#rmpVast.debugRawConsoleLogs, `VAST tracker successfully loaded ${url}`);
        }).catch(error => {
          console.warn(error);
        });
    }
  }

  #onVolumeChange() {
    if (this.#rmpVast.currentAdPlayer) {
      const muted = this.#rmpVast.currentAdPlayer.muted;
      const volume = this.#rmpVast.currentAdPlayer.volume;
      if (muted || volume === 0) {
        this.dispatchTrackingAndApiEvent('advolumemuted');
      } else if (!muted && volume > 0) {
        this.dispatchTrackingAndApiEvent('advolumeunmuted');
      }
      this.#rmpVast.rmpVastUtils.createApiEvent('advolumechanged');
    }
  }

  #onTimeupdate() {
    let adPlayerDuration = -1;
    let adPlayerCurrentTime = -1;
    if (this.#rmpVast.rmpVastAdPlayer) {
      adPlayerCurrentTime = this.#rmpVast.rmpVastAdPlayer.currentTime;
      adPlayerDuration = this.#rmpVast.rmpVastAdPlayer.duration;
    }
    if (adPlayerCurrentTime > 0) {
      if (adPlayerDuration > 0 && adPlayerDuration > adPlayerCurrentTime) {
        if (adPlayerCurrentTime >= adPlayerDuration * 0.25 && !this.#firstQuartileEventFired) {
          this.#firstQuartileEventFired = true;
          this.dispatchTrackingAndApiEvent('adfirstquartile');
        } else if (adPlayerCurrentTime >= adPlayerDuration * 0.5 && !this.#midpointEventFired) {
          this.#midpointEventFired = true;
          this.dispatchTrackingAndApiEvent('admidpoint');
        } else if (adPlayerCurrentTime >= adPlayerDuration * 0.75 && !this.#thirdQuartileEventFired) {
          this.#thirdQuartileEventFired = true;
          this.dispatchTrackingAndApiEvent('adthirdquartile');
        }
      }
      // progress event
      if (this.#rmpVast.progressEvents.length > 0) {
        if (adPlayerCurrentTime > this.#rmpVast.progressEvents[0].time) {
          const filterProgressEvent = this.#rmpVast.progressEvents.filter(progressEvent => {
            return progressEvent.time === this.#rmpVast.progressEvents[0].time;
          });
          filterProgressEvent.forEach(progressEvent => {
            if (progressEvent.url) {
              this.pingURI(progressEvent.url);
            }
          });
          this.#rmpVast.progressEvents.shift();
          this.#rmpVast.rmpVastUtils.createApiEvent('adprogress');
        }
      }
    }
  }

  #onPause() {
    if (this.#rmpVast.currentAdPlayer && this.#rmpVast.currentAdPlayer.paused) {
      const currentTime = this.#rmpVast.currentAdPlayer.currentTime;
      const currentDuration = this.#rmpVast.currentAdPlayer.duration;
      // we have reached end of linear creative - a HTML5 video pause event may fire just before ended event
      // in this case we ignore the adpaused event as adcomplete prevails
      if (currentTime === currentDuration) {
        return;
      }
      this.dispatchTrackingAndApiEvent('adpaused');
    }
  }

  #onPlay() {
    if (this.#rmpVast.currentAdPlayer && !this.#rmpVast.currentAdPlayer.paused) {
      this.dispatchTrackingAndApiEvent('adresumed');
    }
  }

  #onPlaying() {
    this.dispatchTrackingAndApiEvent(['adimpression', 'adcreativeview', 'adstarted']);
  }

  #onEnded() {
    this.dispatchTrackingAndApiEvent('adcomplete');
    if (this.#rmpVast.rmpVastAdPlayer) {
      this.#rmpVast.rmpVastAdPlayer.resumeContent();
    }
  }

  #dispatchTracking(event) {
    if (Array.isArray(event)) {
      event.forEach(currentEvent => {
        this.#dispatch(currentEvent);
      });
    } else {
      this.#dispatch(event);
    }
  }

  replaceMacros(url, trackingPixels) {
    const pattern0 = /\[.+?\]/i;
    if (!pattern0.test(url)) {
      return url;
    }
    let finalString = url;

    // Macros that need to be set explicitly
    // CONTENTCAT GPPSECTIONID GPPSTRING PLAYBACKMETHODS STOREID STOREURL BREAKMAXADLENGTH BREAKMAXADS BREAKMAXDURATION
    // BREAKMINADLENGTH  PLACEMENTTYPE TRANSACTIONID CLIENTUA DEVICEIP IFA IFATYPE LATLONG SERVERUA APPBUNDLE
    // EXTENSIONS OMIDPARTNER VERIFICATIONVENDORS CONTENTID CONTENTURI INVENTORYSTATE
    if (this.#rmpVast.params.macros.size > 0) {
      for (let [key, value] of this.#rmpVast.params.macros) {
        const pattern = '\\[' + key + '\\]';
        const regex = new RegExp(pattern, 'gi');
        if (regex.test(finalString)) {
          finalString = finalString.replace(regex, value.toString());
        }
      }
    }

    // Value is known, but information can't be shared because of policy (unwilling to share)
    const patternUNWILLING = /\[CLICKPOS\]/gi;
    if (patternUNWILLING.test(finalString)) {
      finalString = finalString.replace(patternUNWILLING, '-2');
    }

    // available macros

    const patternADCOUNT = /\[ADCOUNT\]/gi;
    if (patternADCOUNT.test(finalString)) {
      let adCount = 1;
      if (this.#rmpVast.adPodLength > 0) {
        adCount = this.#rmpVast.adSequence;
      }
      finalString = finalString.replace(patternADCOUNT, adCount.toString());
    }

    const patternSERVERSIDE = /\[SERVERSIDE\]/gi;
    if (patternSERVERSIDE.test(finalString)) {
      finalString = finalString.replace(patternADCOUNT, '0');
    }

    const pattern1 = /\[TIMESTAMP\]/gi;
    const date = (new Date()).toISOString();
    if (pattern1.test(finalString)) {
      finalString = finalString.replace(pattern1, encodeURIComponent(date));
    }
    const pattern2 = /\[CACHEBUSTING\]/gi;
    if (pattern2.test(finalString)) {
      finalString = finalString.replace(pattern2, FW.generateCacheBusting());
    }

    const pattern3 = /\[(CONTENTPLAYHEAD|MEDIAPLAYHEAD)\]/gi;
    let currentContentTime = this.#rmpVast.rmpVastContentPlayer.currentTime;
    if (pattern3.test(finalString) && currentContentTime > -1) {
      finalString = finalString.replace(pattern3, encodeURIComponent(FW.vastReadableTime(currentContentTime)));
    }

    const pattern5 = /\[BREAKPOSITION\]/gi;
    let adPlayerDuration = -1;
    if (this.#rmpVast.rmpVastAdPlayer) {
      adPlayerDuration = this.#rmpVast.rmpVastAdPlayer.duration;
    }
    if (pattern5.test(finalString)) {
      if (currentContentTime === 0) {
        finalString = finalString.replace(pattern5, '1');
      } else if (currentContentTime > 0 && currentContentTime < adPlayerDuration) {
        finalString = finalString.replace(pattern5, '2');
      } else {
        finalString = finalString.replace(pattern5, '3');
      }
    }

    const pattern9 = /\[ADTYPE\]/gi;
    if (pattern9.test(finalString) && this.#rmpVast.ad.adType) {
      finalString = finalString.replace(pattern9, encodeURIComponent(this.#rmpVast.ad.adType));
    }

    const pattern11 = /\[DEVICEUA\]/gi;
    if (pattern11.test(finalString) && Environment.userAgent) {
      finalString = finalString.replace(pattern11, encodeURIComponent(Environment.userAgent));
    }

    const pattern11bis = /\[SERVERSIDE\]/gi;
    if (pattern11bis.test(finalString) && Environment.userAgent) {
      finalString = finalString.replace(pattern11bis, '0');
    }

    const pattern13 = /\[DOMAIN\]/gi;
    if (pattern13.test(finalString) && window.location.hostname) {
      finalString = finalString.replace(pattern13, encodeURIComponent(window.location.hostname));
    }

    const pattern14 = /\[PAGEURL\]/gi;
    if (pattern14.test(finalString) && window.location.href) {
      finalString = finalString.replace(pattern14, encodeURIComponent(window.location.href));
    }

    const pattern18 = /\[PLAYERCAPABILITIES\]/gi;
    if (pattern18.test(finalString)) {
      finalString = finalString.replace(pattern18, 'skip,mute,autoplay,mautoplay,fullscreen,icon');
    }

    const pattern19 = /\[CLICKTYPE\]/gi;
    if (pattern19.test(finalString)) {
      let clickType = '1';
      if (Environment.isMobile) {
        clickType = '2';
      }
      finalString = finalString.replace(pattern19, clickType);
    }

    const pattern21 = /\[PLAYERSIZE\]/gi;
    if (pattern21.test(finalString)) {
      const width = parseInt(FW.getWidth(this.#rmpVast.container));
      const height = parseInt(FW.getHeight(this.#rmpVast.container));
      finalString = finalString.replace(
        pattern21, encodeURIComponent(width.toString() + ',' + height.toString())
      );
    }

    if (trackingPixels) {
      const pattern4 = /\[ADPLAYHEAD\]/gi;
      let adPlayerCurrentTime = -1;
      if (this.#rmpVast.rmpVastAdPlayer) {
        adPlayerCurrentTime = this.#rmpVast.rmpVastAdPlayer.currentTime;
      }
      if (pattern4.test(finalString) && adPlayerCurrentTime > -1) {
        finalString = finalString.replace(
          pattern4,
          encodeURIComponent(FW.vastReadableTime(adPlayerCurrentTime))
        );
      }

      const pattern10 = /\[UNIVERSALADID\]/gi;
      if (pattern10.test(finalString) && this.#rmpVast.creative.universalAdIds.length > 0) {
        let universalAdIdString = '';
        this.#rmpVast.creative.universalAdIds.forEach((universalAdId, index) => {
          if (index !== 0 || index !== this.#rmpVast.creative.universalAdIds.length - 1) {
            universalAdIdString += ',';
          }
          universalAdIdString += universalAdId.idRegistry + ' ' + universalAdId.value;
        });
        finalString = finalString.replace(
          pattern10,
          encodeURIComponent(universalAdIdString)
        );
      }

      const pattern22 = /\[ASSETURI\]/gi;
      const assetUri = this.#rmpVast.adMediaUrl;
      if (pattern22.test(finalString) && typeof assetUri === 'string' && assetUri !== '') {
        finalString = finalString.replace(pattern22, encodeURIComponent(assetUri));
      }

      const pattern23 = /\[PODSEQUENCE\]/gi;
      if (pattern23.test(finalString) && this.#rmpVast.ad.sequence) {
        finalString = finalString.replace(pattern23, encodeURIComponent((this.#rmpVast.ad.sequence).toString()));
      }

      const pattern24 = /\[ADSERVINGID\]/gi;
      if (pattern24.test(finalString) && this.#rmpVast.ad.adServingId) {
        finalString = finalString.replace(pattern24, encodeURIComponent(this.#rmpVast.ad.adServingId));
      }
    } else {

      const pattern6 = /\[ADCATEGORIES\]/gi;
      if (pattern6.test(finalString) && this.#rmpVast.ad.categories.length > 0) {
        const categories = this.#rmpVast.ad.categories.map(categorie => categorie.value).join(',');
        finalString = finalString.replace(pattern6, encodeURIComponent(categories));
      }

      const pattern7 = /\[BLOCKEDADCATEGORIES\]/gi;
      if (pattern7.test(finalString) && this.#rmpVast.ad.blockedAdCategories.length > 0) {
        const blockedAdCategories = this.#rmpVast.ad.blockedAdCategories.map(blockedAdCategories => blockedAdCategories.value).join(',');
        finalString = finalString.replace(pattern7, encodeURIComponent(blockedAdCategories));
      }

      const pattern15 = /\[VASTVERSIONS\]/gi;
      if (pattern15.test(finalString)) {
        finalString = finalString.replace(
          pattern15, '2,3,5,6,7,8,11,12,13,14'
        );
      }

      const pattern16 = /\[APIFRAMEWORKS\]/gi;
      if (pattern16.test(finalString)) {
        finalString = finalString.replace(
          pattern16, '2,7,8,9'
        );
      }

      const pattern17 = /\[MEDIAMIME\]/gi;
      const mediaMime = [
        'video/webm',
        'video/mp4',
        'video/ogg',
        'video/3gpp',
        'application/vnd.apple.mpegurl',
        'application/dash+xml'
      ];
      if (pattern17.test(finalString)) {
        let mimeTyepString = '';
        mediaMime.forEach(value => {
          if (value === 'application/vnd.apple.mpegurl') {
            if (Environment.checkCanPlayType(value) || this.#rmpVast.rmpVastLinearCreative.readingHlsJS) {
              mimeTyepString += value + ',';
            }
          } else if (Environment.checkCanPlayType(value)) {
            mimeTyepString += value + ',';
          }
        });
        if (mimeTyepString) {
          mimeTyepString = mimeTyepString.slice(0, -1);
          finalString = finalString.replace(pattern17, encodeURIComponent(mimeTyepString));
        }
      }

      const pattern20 = /\[PLAYERSTATE\]/gi;
      if (pattern20.test(finalString)) {
        let playerState = '';
        if (this.#rmpVast.rmpVastContentPlayer.muted) {
          playerState += 'muted';
        }
        if (this.#rmpVast.isInFullscreen) {
          if (playerState) {
            playerState += ',';
          }
          playerState += 'fullscreen';
        }
        finalString = finalString.replace(pattern20, playerState);
      }
    }

    const pattern25 = /\[LIMITADTRACKING\]/gi;
    const regulationsInfo = this.#rmpVast.regulationsInfo;
    if (pattern25.test(finalString) && regulationsInfo.limitAdTracking) {
      finalString = finalString.replace(pattern25, encodeURIComponent(regulationsInfo.limitAdTracking));
    }

    const pattern26 = /\[REGULATIONS\]/gi;
    if (pattern26.test(finalString) && regulationsInfo.regulations) {
      finalString = finalString.replace(pattern26, encodeURIComponent(regulationsInfo.regulations));
    }

    const pattern27 = /\[GDPRCONSENT\]/gi;
    if (pattern27.test(finalString) && regulationsInfo.gdprConsent) {
      finalString = finalString.replace(pattern27, encodeURIComponent(regulationsInfo.gdprConsent));
    }

    return finalString;
  }

  pingURI(url) {
    const trackingUrl = this.replaceMacros(url, true);
    this.#ping(trackingUrl);
  }

  error(errorCode) {
    // for each Error tag within an InLine or chain of Wrapper ping error URL
    let errorTags = this.#rmpVast.adErrorTags;
    if (errorCode === 303 && this.#rmpVast.vastErrorTags.length > 0) {
      // here we ping vastErrorTags with error code 303 according to spec
      // concat array thus
      errorTags = [...errorTags, ...this.#rmpVast.vastErrorTags];
    }
    if (errorTags.length > 0) {
      errorTags.forEach(errorTag => {
        if (errorTag.url) {
          let errorUrl = errorTag.url;
          const errorRegExp = /\[ERRORCODE\]/gi;
          if (errorRegExp.test(errorUrl) && FW.isNumber(errorCode) && errorCode > 0 && errorCode < 1000) {
            errorUrl = errorUrl.replace(errorRegExp, errorCode);
          }
          this.#ping(errorUrl);
        }
      });
    }
  }

  reset() {
    this.#onPauseFn = null;
    this.#onPlayFn = null;
    this.#onPlayingFn = null;
    this.#onEndedFn = null;
    this.#onVolumeChangeFn = null;
    this.#onTimeupdateFn = null;
    this.#firstQuartileEventFired = false;
    this.#midpointEventFired = false;
    this.#thirdQuartileEventFired = false;
  }

  dispatchTrackingAndApiEvent(apiEvent) {
    if (Array.isArray(apiEvent)) {
      apiEvent.forEach(currentApiEvent => {
        this.#rmpVast.rmpVastUtils.createApiEvent(currentApiEvent);
        this.#dispatchTracking(this.#trackingApiEventMap.get(currentApiEvent));
      });
    } else {
      this.#rmpVast.rmpVastUtils.createApiEvent(apiEvent);
      this.#dispatchTracking(this.#trackingApiEventMap.get(apiEvent));
    }
  }

  destroy() {
    if (this.#rmpVast.currentAdPlayer) {
      this.#rmpVast.currentAdPlayer.removeEventListener('pause', this.#onPauseFn);
      this.#rmpVast.currentAdPlayer.removeEventListener('play', this.#onPlayFn);
      this.#rmpVast.currentAdPlayer.removeEventListener('playing', this.#onPlayingFn);
      this.#rmpVast.currentAdPlayer.removeEventListener('ended', this.#onEndedFn);
      this.#rmpVast.currentAdPlayer.removeEventListener('volumechange', this.#onVolumeChangeFn);
      this.#rmpVast.currentAdPlayer.removeEventListener('timeupdate', this.#onTimeupdateFn);
    }
  }

  wire() {
    // we filter through all HTML5 video events and create new VAST events 
    if (this.#rmpVast.currentAdPlayer && this.#rmpVast.creative.isLinear && !this.#rmpVast.rmpVastVpaidPlayer) {
      this.#onPauseFn = this.#onPause.bind(this);
      this.#rmpVast.currentAdPlayer.addEventListener('pause', this.#onPauseFn);

      this.#onPlayFn = this.#onPlay.bind(this);
      this.#rmpVast.currentAdPlayer.addEventListener('play', this.#onPlayFn);

      this.#onPlayingFn = this.#onPlaying.bind(this);
      this.#rmpVast.currentAdPlayer.addEventListener('playing', this.#onPlayingFn, { once: true });

      this.#onEndedFn = this.#onEnded.bind(this);
      this.#rmpVast.currentAdPlayer.addEventListener('ended', this.#onEndedFn, { once: true });

      this.#onVolumeChangeFn = this.#onVolumeChange.bind(this);
      this.#rmpVast.currentAdPlayer.addEventListener('volumechange', this.#onVolumeChangeFn);

      this.#onTimeupdateFn = this.#onTimeupdate.bind(this);
      this.#rmpVast.currentAdPlayer.addEventListener('timeupdate', this.#onTimeupdateFn);
    }
  }

}
