import Environment from '../framework/environment';
import FW from '../framework/fw';
import Utils from '../framework/utils';


export default class Tracking {

  static _dispatch(event) {
    console.log(`${FW.consolePrepend} ping tracking for ${event} VAST event`, FW.consoleStyle, '');

    // filter trackers - may return multiple urls for same event as allowed by VAST spec
    const trackers = this.trackingTags.filter((value) => {
      return event === value.event;
    });
    // send ping for each valid tracker
    if (trackers.length > 0) {
      trackers.forEach((element) => {
        Tracking.pingURI.call(this, element.url);
      });
    }
  }

  static _vastReadableTime(time) {
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

  static _generateCacheBusting() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static _ping(url) {
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
      FW.ajax(url, this.params.ajaxTimeout, false, 'GET').
        then(() => {
          console.log(`${FW.consolePrepend} VAST tracker successfully loaded ${url}`, FW.consoleStyle, '');
        }).catch((error) => {
          console.log(`${FW.consolePrepend} VAST tracker failed loading ${url} with error ${error}`, FW.consoleStyle, '');
        });
    }
  }

  static _onVolumeChange() {
    if (this.__adPlayer.muted || this.__adPlayer.volume === 0) {
      Utils.createApiEvent.call(this, 'advolumemuted');
      Tracking.dispatch.call(this, 'mute');
    } else if (!this.__adPlayer.muted && this.__adPlayer.volume > 0) {
      Tracking.dispatch.call(this, 'unmute');
    }
    Utils.createApiEvent.call(this, 'advolumechanged');
  }

  static _onTimeupdate() {
    let adPlayerDuration = -1;
    let adPlayerCurrentTime = -1;
    if (this.rmpVastAdPlayer) {
      adPlayerCurrentTime = this.rmpVastAdPlayer.currentTime;
      adPlayerDuration = this.rmpVastAdPlayer.duration;
    }
    if (adPlayerCurrentTime > 0) {
      if (adPlayerDuration > 0 && adPlayerDuration > adPlayerCurrentTime) {
        if (adPlayerCurrentTime >= adPlayerDuration * 0.25 && !this.firstQuartileEventFired) {
          this.firstQuartileEventFired = true;
          Utils.createApiEvent.call(this, 'adfirstquartile');
          Tracking.dispatch.call(this, 'firstQuartile');
        } else if (adPlayerCurrentTime >= adPlayerDuration * 0.5 && !this.midpointEventFired) {
          this.midpointEventFired = true;
          Utils.createApiEvent.call(this, 'admidpoint');
          Tracking.dispatch.call(this, 'midpoint');
        } else if (adPlayerCurrentTime >= adPlayerDuration * 0.75 && !this.thirdQuartileEventFired) {
          this.thirdQuartileEventFired = true;
          Utils.createApiEvent.call(this, 'adthirdquartile');
          Tracking.dispatch.call(this, 'thirdQuartile');
        }
      }
      // progress event
      if (this.progressEvents.length > 0) {
        if (adPlayerCurrentTime > this.progressEvents[0].time) {
          const filterProgressEvent = this.progressEvents.filter(progressEvent => {
            return progressEvent.time === this.progressEvents[0].time;
          });
          filterProgressEvent.forEach(progressEvent => {
            if (progressEvent.url) {
              Tracking.pingURI.call(this, progressEvent.url);
            }
          });
          this.progressEvents.shift();
          Utils.createApiEvent.call(this, 'adprogress');
        }
      }
    }
  }

  static _onPause() {
    if (this.__adPlayer && this.__adPlayer.paused) {
      const currentTime = this.__adPlayer.currentTime;
      const currentDuration = this.__adPlayer.duration;
      // we have reached end of linear creative - a HTML5 video pause event may fire just before ended event
      // in this case we ignore the adpaused event as adcomplete prevails
      if (currentTime === currentDuration) {
        return;
      }
      Utils.createApiEvent.call(this, 'adpaused');
      Tracking.dispatch.call(this, 'pause');
    }
  }

  static _onPlay() {
    if (this.__adPlayer && !this.__adPlayer.paused) {
      Utils.createApiEvent.call(this, 'adresumed');
      Tracking.dispatch.call(this, 'resume');
    }
  }

  static _onPlaying() {
    Utils.createApiEvent.call(this, ['adimpression', 'adstarted']);
    Tracking.dispatch.call(this, ['impression', 'creativeView', 'start']);
  }

  static _onEnded() {
    Utils.createApiEvent.call(this, 'adcomplete');
    Tracking.dispatch.call(this, 'complete');
    if (this.rmpVastAdPlayer) {
      this.rmpVastAdPlayer.resumeContent();
    }
  }


  static replaceMacros(url, trackingPixels) {
    const pattern0 = /\[.+?\]/i;
    if (!pattern0.test(url)) {
      return url;
    }
    let finalString = url;

    // Marking Macro Values as Unknown or Unavailable 
    const pattern8 = /\[(ADCOUNT|TRANSACTIONID|PLACEMENTTYPE|BREAKMAXDURATION|BREAKMINDURATION|BREAKMAXADS|BREAKMINADLENGTH|BREAKMAXADLENGTH|IFA|IFATYPE|CLIENTUA|SERVERUA|DEVICEIP|APPBUNDLE|EXTENSIONS|VERIFICATIONVENDORS|OMIDPARTNER|INVENTORYSTATE|CONTENTID|LATLONG)\]/gi;
    if (pattern8.test(finalString)) {
      finalString = finalString.replace(pattern8, '-1');
    }
    const pattern8bis = /\[(CONTENTURI|CLICKPOS)\]/gi;
    if (pattern8bis.test(finalString)) {
      finalString = finalString.replace(pattern8bis, '-2');
    }

    // available macros
    const pattern1 = /\[TIMESTAMP\]/gi;
    const date = (new Date()).toISOString();
    if (pattern1.test(finalString)) {
      finalString = finalString.replace(pattern1, encodeURIComponent(date));
    }
    const pattern2 = /\[CACHEBUSTING\]/gi;
    if (pattern2.test(finalString)) {
      finalString = finalString.replace(pattern2, Tracking._generateCacheBusting());
    }

    const pattern3 = /\[(CONTENTPLAYHEAD|MEDIAPLAYHEAD)\]/gi;
    let currentContentTime = this.rmpVastContentPlayer.currentTime;
    if (pattern3.test(finalString) && currentContentTime > -1) {
      finalString = finalString.replace(pattern3, encodeURIComponent(Tracking._vastReadableTime(currentContentTime)));
    }

    const pattern5 = /\[BREAKPOSITION\]/gi;
    let adPlayerDuration = -1;
    if (this.rmpVastAdPlayer) {
      adPlayerDuration = this.rmpVastAdPlayer.duration;
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
    if (pattern9.test(finalString) && this.ad.adType) {
      finalString = finalString.replace(pattern9, encodeURIComponent(this.ad.adType));
    }

    const pattern11 = /\[DEVICEUA\]/gi;
    if (pattern11.test(finalString) && Environment.userAgent) {
      finalString = finalString.replace(
        pattern11,
        encodeURIComponent(Environment.userAgent)
      );
    }

    const pattern11bis = /\[SERVERSIDE\]/gi;
    if (pattern11bis.test(finalString) && Environment.userAgent) {
      finalString = finalString.replace(
        pattern11bis,
        '0'
      );
    }

    const pattern13 = /\[DOMAIN\]/gi;
    if (pattern13.test(finalString) && window.location.hostname) {
      finalString = finalString.replace(
        pattern13,
        encodeURIComponent(window.location.hostname)
      );
    }

    const pattern14 = /\[PAGEURL\]/gi;
    if (pattern14.test(finalString) && window.location.href) {
      finalString = finalString.replace(
        pattern14,
        encodeURIComponent(window.location.href)
      );
    }

    const pattern18 = /\[PLAYERCAPABILITIES\]/gi;
    if (pattern18.test(finalString)) {
      finalString = finalString.replace(
        pattern18, 'skip,mute,autoplay,mautoplay,fullscreen,icon'
      );
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
      const width = parseInt(FW.getWidth(this.container));
      const height = parseInt(FW.getHeight(this.container));
      finalString = finalString.replace(
        pattern21, encodeURIComponent(width.toString() + ',' + height.toString())
      );
    }

    if (trackingPixels) {
      const pattern4 = /\[ADPLAYHEAD\]/gi;
      let adPlayerCurrentTime = -1;
      if (this.rmpVastAdPlayer) {
        adPlayerCurrentTime = this.rmpVastAdPlayer.currentTime;
      }
      if (pattern4.test(finalString) && adPlayerCurrentTime > -1) {
        finalString = finalString.replace(
          pattern4,
          encodeURIComponent(Tracking._vastReadableTime(adPlayerCurrentTime))
        );
      }

      const pattern10 = /\[UNIVERSALADID\]/gi;
      if (pattern10.test(finalString) && this.creative.universalAdIds.length > 0) {
        let universalAdIdString = '';
        this.creative.universalAdIds.forEach((universalAdId, index) => {
          if (index !== 0 || index !== this.creative.universalAdIds.length - 1) {
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
      const assetUri = this.adMediaUrl;
      if (pattern22.test(finalString) && typeof assetUri === 'string' && assetUri !== '') {
        finalString = finalString.replace(pattern22, encodeURIComponent(assetUri));
      }

      const pattern23 = /\[PODSEQUENCE\]/gi;
      if (pattern23.test(finalString) && this.ad.sequence) {
        finalString = finalString.replace(pattern23, encodeURIComponent((this.ad.sequence).toString()));
      }

      const pattern24 = /\[ADSERVINGID\]/gi;
      if (pattern24.test(finalString) && this.ad.adServingId) {
        finalString = finalString.replace(pattern24, encodeURIComponent(this.ad.adServingId));
      }
    } else {

      const pattern6 = /\[ADCATEGORIES\]/gi;
      if (pattern6.test(finalString) && this.ad.categories.length > 0) {
        const categories = this.ad.categories.map(categorie => categorie.value).join(',');
        finalString = finalString.replace(pattern6, encodeURIComponent(categories));
      }

      const pattern7 = /\[BLOCKEDADCATEGORIES\]/gi;
      if (pattern7.test(finalString) && this.ad.blockedAdCategories.length > 0) {
        const blockedAdCategories = this.ad.blockedAdCategories.map(blockedAdCategories => blockedAdCategories.value).join(',');
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
          pattern16, '2'
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
        mediaMime.forEach((value) => {
          if (Environment.checkCanPlayType(value)) {
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
        if (this.rmpVastContentPlayer.muted) {
          playerState += 'muted';
        }
        if (this.isInFullscreen) {
          if (playerState) {
            playerState += ',';
          }
          playerState += 'fullscreen';
        }
        finalString = finalString.replace(pattern20, playerState);
      }
    }

    const pattern25 = /\[LIMITADTRACKING\]/gi;
    if (pattern25.test(finalString) && this.regulationsInfo.limitAdTracking) {
      finalString = finalString.replace(pattern25, encodeURIComponent(this.regulationsInfo.limitAdTracking));
    }

    const pattern26 = /\[REGULATIONS\]/gi;
    if (pattern26.test(finalString) && this.regulationsInfo.regulations) {
      finalString = finalString.replace(pattern26, encodeURIComponent(this.regulationsInfo.regulations));
    }

    const pattern27 = /\[GDPRCONSENT\]/gi;
    if (pattern27.test(finalString) && this.regulationsInfo.gdprConsent) {
      finalString = finalString.replace(pattern27, encodeURIComponent(this.regulationsInfo.gdprConsent));
    }

    return finalString;
  }

  static pingURI(url) {
    const trackingUrl = Tracking.replaceMacros.call(this, url, true);
    Tracking._ping.call(this, trackingUrl);
  }

  static error(errorCode) {
    // for each Error tag within an InLine or chain of Wrapper ping error URL
    let errorTags = this.adErrorTags;
    if (errorCode === 303 && this.vastErrorTags.length > 0) {
      // here we ping vastErrorTags with error code 303 according to spec
      // concat array thus
      errorTags = [...errorTags, ...this.vastErrorTags];
    }
    if (errorTags.length > 0) {
      errorTags.forEach(errorTag => {
        if (errorTag.url) {
          let errorUrl = errorTag.url;
          const errorRegExp = /\[ERRORCODE\]/gi;
          if (errorRegExp.test(errorUrl) && FW.isNumber(errorCode) && errorCode > 0 && errorCode < 1000) {
            errorUrl = errorUrl.replace(errorRegExp, errorCode);
          }
          Tracking._ping.call(this, errorUrl);
        }
      });
    }
  }

  static dispatch(event) {
    if (Array.isArray(event)) {
      event.forEach(currentEvent => {
        Tracking._dispatch.call(this, currentEvent);
      });
    } else {
      Tracking._dispatch.call(this, event);
    }
  }

  static destroy() {
    if (this.__adPlayer) {
      this.__adPlayer.removeEventListener('pause', this.onPauseFn);
      this.__adPlayer.removeEventListener('play', this.onPlayFn);
      this.__adPlayer.removeEventListener('playing', this.onPlayingFn);
      this.__adPlayer.removeEventListener('ended', this.onEndedFn);
      this.__adPlayer.removeEventListener('volumechange', this.onVolumeChangeFn);
      this.__adPlayer.removeEventListener('timeupdate', this.onTimeupdateFn);
    }
  }

  static wire() {
    // we filter through all HTML5 video events and create new VAST events 
    if (this.__adPlayer && this.creative.isLinear && !this.rmpVastVpaidPlayer) {
      this.onPauseFn = Tracking._onPause.bind(this);
      this.__adPlayer.addEventListener('pause', this.onPauseFn);

      this.onPlayFn = Tracking._onPlay.bind(this);
      this.__adPlayer.addEventListener('play', this.onPlayFn);

      this.onPlayingFn = Tracking._onPlaying.bind(this);
      this.__adPlayer.addEventListener('playing', this.onPlayingFn, { once: true });

      this.onEndedFn = Tracking._onEnded.bind(this);
      this.__adPlayer.addEventListener('ended', this.onEndedFn, { once: true });

      this.onVolumeChangeFn = Tracking._onVolumeChange.bind(this);
      this.__adPlayer.addEventListener('volumechange', this.onVolumeChangeFn);

      this.onTimeupdateFn = Tracking._onTimeupdate.bind(this);
      this.__adPlayer.addEventListener('timeupdate', this.onTimeupdateFn);
    }
  }

}
