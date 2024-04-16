import FW from './fw';
import Environment from './environment';
import Logger from './logger';


export default class Tracking {

  constructor(rmpVast) {
    this._rmpVast = rmpVast;
    this.reset();
    this._createTrackingApiEventMap();
  }

  _createTrackingApiEventMap() {
    this._trackingApiEventMap = new Map();
    // ViewableImpression
    this._trackingApiEventMap.set('adviewable', 'viewable');
    this._trackingApiEventMap.set('adviewundetermined', 'viewundetermined');
    // Tracking Event Elements
    this._trackingApiEventMap.set('admuted', 'mute');
    this._trackingApiEventMap.set('adunmuted', 'unmute');
    this._trackingApiEventMap.set('adpaused', 'pause');
    this._trackingApiEventMap.set('adresumed', 'resume');
    this._trackingApiEventMap.set('adskipped', 'skip');
    // VAST 4 events
    this._trackingApiEventMap.set('adplayerexpand', 'playerExpand');
    this._trackingApiEventMap.set('adplayercollapse', 'playerCollapse');
    // VAST 3 events
    this._trackingApiEventMap.set('adfullscreen', 'fullscreen');
    this._trackingApiEventMap.set('adexitfullscreen', 'exitFullscreen');
    // Linear Ad Metrics
    this._trackingApiEventMap.set('adloaded', 'loaded');
    this._trackingApiEventMap.set('adstarted', 'start');
    this._trackingApiEventMap.set('adfirstquartile', 'firstQuartile');
    this._trackingApiEventMap.set('admidpoint', 'midpoint');
    this._trackingApiEventMap.set('adthirdquartile', 'thirdQuartile');
    this._trackingApiEventMap.set('adcomplete', 'complete');
    // tracking progress event happens in _onTimeupdate
    // InLine > Impression
    this._trackingApiEventMap.set('adimpression', 'impression');

    // creativeView for companion ads happens in getCompanionAd (index.js)
    // creativeView tracking needs to happen for linear creative as well (support for VAST 3)
    this._trackingApiEventMap.set('adcreativeview', 'creativeView');

    // for non-linear and VPAID only
    this._trackingApiEventMap.set('adcollapse', 'adCollapse');

    // only support for VPAID - PR welcome for non-linear
    this._trackingApiEventMap.set('aduseracceptinvitation', 'acceptInvitation');
    this._trackingApiEventMap.set('adclosed', 'close');
    // VideoClicks > ClickThrough
    this._trackingApiEventMap.set('adclick', 'clickthrough');

    // Need to investigate overlayViewDuration (non-linear) - interactiveStart (SIMID) further
  }

  _dispatch(event) {
    Logger.print('info', `ping tracking for ${event} VAST event`);
    // filter trackers - may return multiple urls for same event as allowed by VAST spec
    const trackers = this._rmpVast.trackingTags.filter(value => {
      return event === value.event;
    });
    // send ping for each valid tracker
    if (trackers.length > 0) {
      trackers.forEach(element => {
        this.pingURI(element.url);
      });
    }
  }

  _vastReadableTime(time) {
    if (FW.isNumber(time) && time >= 0) {
      let seconds = 0;
      let minutes = 0;
      let hours = 0;
      let ms = Math.floor(time % 1000);
      if (ms === 0) {
        ms = '000';
      } else if (ms < 10) {
        ms = '00' + ms;
      } else if (ms < 100) {
        ms = '0' + ms;
      } else {
        ms = ms.toString();
      }
      seconds = Math.floor(time * 1.0 / 1000);
      if (seconds > 59) {
        minutes = Math.floor(seconds * 1.0 / 60);
        seconds = seconds - (minutes * 60);
      }
      if (seconds === 0) {
        seconds = '00';
      } else if (seconds < 10) {
        seconds = '0' + seconds;
      } else {
        seconds = seconds.toString();
      }
      if (minutes > 59) {
        hours = Math.floor(minutes * 1.0 / 60);
        minutes = minutes - (hours * 60);
      }
      if (minutes === 0) {
        minutes = '00';
      } else if (minutes < 10) {
        minutes = '0' + minutes;
      } else {
        minutes = minutes.toString();
      }
      if (hours === 0) {
        hours = '00';
      } else if (hours < 10) {
        hours = '0' + hours;
      } else {
        if (hours > 23) {
          hours = '00';
        } else {
          hours = hours.toString();
        }
      }
      return hours + ':' + minutes + ':' + seconds + '.' + ms;
    } else {
      return '00:00:00.000';
    }
  }

  _generateCacheBusting() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  _ping(url) {
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
        Logger.print('warning', error);
        document.body.appendChild(script);
      }
    } else {
      FW.ajax(url, this._rmpVast.params.ajaxTimeout, false, 'GET').
        then(() => {
          Logger.print('info', `VAST tracker successfully loaded ${url}`);
        }).catch(error => {
          Logger.print('warning', `VAST tracker failed loading ${url} with error ${error}`);
        });
    }
  }

  _onVolumeChange() {
    if (this._rmpVast.currentAdPlayer) {
      const muted = this._rmpVast.currentAdPlayer.muted;
      const volume = this._rmpVast.currentAdPlayer.volume;
      if (muted || volume === 0) {
        this.dispatchTrackingAndApiEvent('admuted');
      } else if (!muted && volume > 0) {
        this.dispatchTrackingAndApiEvent('adunmuted');
      }
      this._rmpVast.rmpVastUtils.createApiEvent('advolumechanged');
    }
  }

  _onTimeupdate() {
    let adPlayerDuration = -1;
    let adPlayerCurrentTime = -1;
    if (this._rmpVast.rmpVastAdPlayer) {
      adPlayerCurrentTime = this._rmpVast.rmpVastAdPlayer.currentTime;
      adPlayerDuration = this._rmpVast.rmpVastAdPlayer.duration;
    }
    if (adPlayerCurrentTime > 0) {
      if (adPlayerDuration > 0 && adPlayerDuration > adPlayerCurrentTime) {
        if (adPlayerCurrentTime >= adPlayerDuration * 0.25 && !this._firstQuartileEventFired) {
          this._firstQuartileEventFired = true;
          this.dispatchTrackingAndApiEvent('adfirstquartile');
        } else if (adPlayerCurrentTime >= adPlayerDuration * 0.5 && !this._midpointEventFired) {
          this._midpointEventFired = true;
          this.dispatchTrackingAndApiEvent('admidpoint');
        } else if (adPlayerCurrentTime >= adPlayerDuration * 0.75 && !this._thirdQuartileEventFired) {
          this._thirdQuartileEventFired = true;
          this.dispatchTrackingAndApiEvent('adthirdquartile');
        }
      }
      // progress event
      if (this._rmpVast.progressEvents.length > 0) {
        if (adPlayerCurrentTime > this._rmpVast.progressEvents[0].time) {
          const filterProgressEvent = this._rmpVast.progressEvents.filter(progressEvent => {
            return progressEvent.time === this._rmpVast.progressEvents[0].time;
          });
          filterProgressEvent.forEach(progressEvent => {
            if (progressEvent.url) {
              this.pingURI(progressEvent.url);
            }
          });
          this._rmpVast.progressEvents.shift();
          this._rmpVast.rmpVastUtils.createApiEvent('adprogress');
        }
      }
    }
  }

  _onPause() {
    if (this._rmpVast.currentAdPlayer && this._rmpVast.currentAdPlayer.paused) {
      const currentTime = this._rmpVast.currentAdPlayer.currentTime;
      const currentDuration = this._rmpVast.currentAdPlayer.duration;
      // we have reached end of linear creative - a HTML5 video pause event may fire just before ended event
      // in this case we ignore the adpaused event as adcomplete prevails
      if (currentTime === currentDuration) {
        return;
      }
      this.dispatchTrackingAndApiEvent('adpaused');
    }
  }

  _onPlay() {
    if (this._rmpVast.currentAdPlayer && !this._rmpVast.currentAdPlayer.paused) {
      this.dispatchTrackingAndApiEvent('adresumed');
    }
  }

  _onPlaying() {
    this.dispatchTrackingAndApiEvent(['adimpression', 'adcreativeview', 'adstarted']);
  }

  _onEnded() {
    this.dispatchTrackingAndApiEvent('adcomplete');
    if (this._rmpVast.rmpVastAdPlayer) {
      this._rmpVast.rmpVastAdPlayer.resumeContent();
    }
  }

  _dispatchTracking(event) {
    if (Array.isArray(event)) {
      event.forEach(currentEvent => {
        this._dispatch(currentEvent);
      });
    } else {
      this._dispatch(event);
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
    if (this._rmpVast.params.macros.size > 0) {
      for (let [key, value] of this._rmpVast.params.macros) {
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
      if (this._rmpVast.adPodLength > 0) {
        adCount = this._rmpVast.adSequence;
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
      finalString = finalString.replace(pattern2, this._generateCacheBusting());
    }

    const pattern3 = /\[(CONTENTPLAYHEAD|MEDIAPLAYHEAD)\]/gi;
    let currentContentTime = this._rmpVast.rmpVastContentPlayer.currentTime;
    if (pattern3.test(finalString) && currentContentTime > -1) {
      finalString = finalString.replace(pattern3, encodeURIComponent(this._vastReadableTime(currentContentTime)));
    }

    const pattern5 = /\[BREAKPOSITION\]/gi;
    let adPlayerDuration = -1;
    if (this._rmpVast.rmpVastAdPlayer) {
      adPlayerDuration = this._rmpVast.rmpVastAdPlayer.duration;
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
    if (pattern9.test(finalString) && this._rmpVast.ad.adType) {
      finalString = finalString.replace(pattern9, encodeURIComponent(this._rmpVast.ad.adType));
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
      const width = parseInt(FW.getWidth(this._rmpVast.container));
      const height = parseInt(FW.getHeight(this._rmpVast.container));
      finalString = finalString.replace(
        pattern21, encodeURIComponent(width.toString() + ',' + height.toString())
      );
    }

    if (trackingPixels) {
      const pattern4 = /\[ADPLAYHEAD\]/gi;
      let adPlayerCurrentTime = -1;
      if (this._rmpVast.rmpVastAdPlayer) {
        adPlayerCurrentTime = this._rmpVast.rmpVastAdPlayer.currentTime;
      }
      if (pattern4.test(finalString) && adPlayerCurrentTime > -1) {
        finalString = finalString.replace(
          pattern4,
          encodeURIComponent(this._vastReadableTime(adPlayerCurrentTime))
        );
      }

      const pattern10 = /\[UNIVERSALADID\]/gi;
      if (pattern10.test(finalString) && this._rmpVast.creative.universalAdIds.length > 0) {
        let universalAdIdString = '';
        this._rmpVast.creative.universalAdIds.forEach((universalAdId, index) => {
          if (index !== 0 || index !== this._rmpVast.creative.universalAdIds.length - 1) {
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
      const assetUri = this._rmpVast.adMediaUrl;
      if (pattern22.test(finalString) && typeof assetUri === 'string' && assetUri !== '') {
        finalString = finalString.replace(pattern22, encodeURIComponent(assetUri));
      }

      const pattern23 = /\[PODSEQUENCE\]/gi;
      if (pattern23.test(finalString) && this._rmpVast.ad.sequence) {
        finalString = finalString.replace(pattern23, encodeURIComponent((this._rmpVast.ad.sequence).toString()));
      }

      const pattern24 = /\[ADSERVINGID\]/gi;
      if (pattern24.test(finalString) && this._rmpVast.ad.adServingId) {
        finalString = finalString.replace(pattern24, encodeURIComponent(this._rmpVast.ad.adServingId));
      }
    } else {

      const pattern6 = /\[ADCATEGORIES\]/gi;
      if (pattern6.test(finalString) && this._rmpVast.ad.categories.length > 0) {
        const categories = this._rmpVast.ad.categories.map(categorie => categorie.value).join(',');
        finalString = finalString.replace(pattern6, encodeURIComponent(categories));
      }

      const pattern7 = /\[BLOCKEDADCATEGORIES\]/gi;
      if (pattern7.test(finalString) && this._rmpVast.ad.blockedAdCategories.length > 0) {
        const blockedAdCategories = this._rmpVast.ad.blockedAdCategories.map(blockedAdCategories => blockedAdCategories.value).join(',');
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
            if (Environment.checkCanPlayType(value) || this._rmpVast.rmpVastLinearCreative.readingHlsJS) {
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
        if (this._rmpVast.rmpVastContentPlayer.muted) {
          playerState += 'muted';
        }
        if (this._rmpVast.isInFullscreen) {
          if (playerState) {
            playerState += ',';
          }
          playerState += 'fullscreen';
        }
        finalString = finalString.replace(pattern20, playerState);
      }
    }

    const pattern25 = /\[LIMITADTRACKING\]/gi;
    const regulationsInfo = this._rmpVast.regulationsInfo;
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
    this._ping(trackingUrl);
  }

  error(errorCode) {
    // for each Error tag within an InLine or chain of Wrapper ping error URL
    let errorTags = this._rmpVast.adErrorTags;
    if (errorCode === 303 && this._rmpVast.vastErrorTags.length > 0) {
      // here we ping vastErrorTags with error code 303 according to spec
      // concat array thus
      errorTags = [...errorTags, ...this._rmpVast.vastErrorTags];
    }
    if (errorTags.length > 0) {
      errorTags.forEach(errorTag => {
        if (errorTag.url) {
          let errorUrl = errorTag.url;
          const errorRegExp = /\[ERRORCODE\]/gi;
          if (errorRegExp.test(errorUrl) && FW.isNumber(errorCode) && errorCode > 0 && errorCode < 1000) {
            errorUrl = errorUrl.replace(errorRegExp, errorCode);
          }
          this._ping(errorUrl);
        }
      });
    }
  }

  reset() {
    this._onPauseFn = null;
    this._onPlayFn = null;
    this._onPlayingFn = null;
    this._onEndedFn = null;
    this._onVolumeChangeFn = null;
    this._onTimeupdateFn = null;
    this._firstQuartileEventFired = false;
    this._midpointEventFired = false;
    this._thirdQuartileEventFired = false;
  }

  dispatchTrackingAndApiEvent(apiEvent) {
    if (Array.isArray(apiEvent)) {
      apiEvent.forEach(currentApiEvent => {
        this._rmpVast.rmpVastUtils.createApiEvent(currentApiEvent);
        this._dispatchTracking(this._trackingApiEventMap.get(currentApiEvent));
      });
    } else {
      this._rmpVast.rmpVastUtils.createApiEvent(apiEvent);
      this._dispatchTracking(this._trackingApiEventMap.get(apiEvent));
    }
  }

  destroy() {
    if (this._rmpVast.currentAdPlayer) {
      this._rmpVast.currentAdPlayer.removeEventListener('pause', this._onPauseFn);
      this._rmpVast.currentAdPlayer.removeEventListener('play', this._onPlayFn);
      this._rmpVast.currentAdPlayer.removeEventListener('playing', this._onPlayingFn);
      this._rmpVast.currentAdPlayer.removeEventListener('ended', this._onEndedFn);
      this._rmpVast.currentAdPlayer.removeEventListener('volumechange', this._onVolumeChangeFn);
      this._rmpVast.currentAdPlayer.removeEventListener('timeupdate', this._onTimeupdateFn);
    }
  }

  wire() {
    // we filter through all HTML5 video events and create new VAST events 
    if (this._rmpVast.currentAdPlayer && this._rmpVast.creative.isLinear && !this._rmpVast.rmpVastVpaidPlayer) {
      this._onPauseFn = this._onPause.bind(this);
      this._rmpVast.currentAdPlayer.addEventListener('pause', this._onPauseFn);

      this._onPlayFn = this._onPlay.bind(this);
      this._rmpVast.currentAdPlayer.addEventListener('play', this._onPlayFn);

      this._onPlayingFn = this._onPlaying.bind(this);
      this._rmpVast.currentAdPlayer.addEventListener('playing', this._onPlayingFn, { once: true });

      this._onEndedFn = this._onEnded.bind(this);
      this._rmpVast.currentAdPlayer.addEventListener('ended', this._onEndedFn, { once: true });

      this._onVolumeChangeFn = this._onVolumeChange.bind(this);
      this._rmpVast.currentAdPlayer.addEventListener('volumechange', this._onVolumeChangeFn);

      this._onTimeupdateFn = this._onTimeupdate.bind(this);
      this._rmpVast.currentAdPlayer.addEventListener('timeupdate', this._onTimeupdateFn);
    }
  }

}
