import FW from '../framework/fw';
import Environment from '../framework/environment';
import Logger from '../framework/logger';


export default class AdPlayer {

  #rmpVast;
  #params;
  #contentPlayer;
  #adContainer;
  #contentWrapper;
  #adPlayer = null;

  constructor(rmpVast) {
    this.#rmpVast = rmpVast;
    this.#params = rmpVast.params;
    this.#contentPlayer = rmpVast.currentContentPlayer;
    this.#adContainer = rmpVast.adContainer;
    this.#contentWrapper = rmpVast.contentWrapper;
  }

  set volume(level) {
    if (this.#adPlayer) {
      this.#adPlayer.volume = level;
    }
  }

  get volume() {
    if (this.#adPlayer) {
      return this.#adPlayer.volume;
    }
    return -1;
  }

  set muted(muted) {
    if (this.#adPlayer) {
      if (muted && !this.#adPlayer.muted) {
        this.#adPlayer.muted = true;
      } else if (!muted && this.#adPlayer.muted) {
        this.#adPlayer.muted = false;
      }
    }
  }

  get muted() {
    if (this.#adPlayer) {
      return this.#adPlayer.muted;
    }
    return false;
  }

  get duration() {
    if (this.#adPlayer && FW.isNumber(this.#adPlayer.duration)) {
      return this.#adPlayer.duration * 1000;
    }
    return -1;
  }

  get currentTime() {
    if (this.#adPlayer && FW.isNumber(this.#adPlayer.currentTime)) {
      return this.#adPlayer.currentTime * 1000;
    }
    return -1;
  }

  destroy() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `start destroying ad player`);

    // destroy icons if any 
    if (this.#rmpVast.rmpVastIcons) {
      this.#rmpVast.rmpVastIcons.destroy();
    }

    if (this.#rmpVast.rmpVastVpaidPlayer) {
      this.#rmpVast.rmpVastVpaidPlayer.destroy();
    }

    // reset non-linear creative
    if (this.#rmpVast.rmpVastNonLinearCreative) {
      this.#rmpVast.rmpVastNonLinearCreative.destroy();
    }

    // reset linear creative
    if (this.#rmpVast.rmpVastLinearCreative) {
      this.#rmpVast.rmpVastLinearCreative.destroy();
    }

    // unwire events
    this.#rmpVast.rmpVastTracking.destroy();

    // hide rmp-ad-container
    FW.hide(this.#adContainer);

    // unwire anti-seek logic (iOS)
    if (this.#rmpVast.rmpVastContentPlayer) {
      this.#rmpVast.rmpVastContentPlayer.destroy();
    }
    // flush currentAdPlayer
    try {
      if (this.#adPlayer) {
        this.#adPlayer.pause();
        if (this.#rmpVast.rmpVastLinearCreative && this.#rmpVast.rmpVastLinearCreative.readingHlsJS) {
          this.#rmpVast.rmpVastLinearCreative.readingHlsJS = false;
          this.#rmpVast.rmpVastLinearCreative.hlsJSInstances[this.#rmpVast.rmpVastLinearCreative.hlsJSIndex].destroy();
          this.#rmpVast.rmpVastLinearCreative.hlsJSIndex = this.#rmpVast.rmpVastLinearCreative.hlsJSIndex++;
        } else {
          // empty buffer
          this.#adPlayer.removeAttribute('src');
          this.#adPlayer.load();
        }
        FW.hide(this.#adPlayer);
        Logger.print(this.#rmpVast.debugRawConsoleLogs, `flushing currentAdPlayer buffer after ad`);
      }
      if (this.#rmpVast.rmpVastNonLinearCreative) {
        this.#rmpVast.rmpVastNonLinearCreative.destroy();
      }
    } catch (error) {
      console.warn(error);
    }

    this.#rmpVast.resetVariablesForNewLoadAds();
    this.#rmpVast.rmpVastUtils.createApiEvent('addestroyed');
  }

  init() {
    this.#rmpVast.adContainer = this.#adContainer = document.createElement('div');
    this.#adContainer.className = 'rmp-ad-container';
    this.#contentWrapper.appendChild(this.#adContainer);
    FW.hide(this.#adContainer);

    this.#rmpVast.currentAdPlayer = this.#adPlayer = document.createElement('video');
    Logger.printVideoEvents(this.#rmpVast.debugRawConsoleLogs, this.#adPlayer, 'ad');
    // disable native UI cast/PiP for ad player 
    // DEPRECATED - this is no longer necessary 
    //this.#adPlayer.disableRemotePlayback = true;
    //this.#adPlayer.disablePictureInPicture = true;
    this.#adPlayer.className = 'rmp-ad-vast-video-player';
    if (this.#params.showControlsForAdPlayer) {
      this.#adPlayer.controls = true;
    } else {
      this.#adPlayer.controls = false;
    }

    // this.currentContentPlayer.muted may not be set because of a bug in some version of Chromium
    if (this.#contentPlayer.hasAttribute('muted')) {
      this.#contentPlayer.muted = true;
    }
    if (this.#contentPlayer.muted) {
      this.#adPlayer.muted = true;
    }
    // black poster based 64 png
    this.#adPlayer.poster = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    // note to myself: we use setAttribute for non-standard attribute (instead of . notation)
    this.#adPlayer.setAttribute('x-webkit-airplay', 'allow');
    if (typeof this.#contentPlayer.playsInline === 'boolean' && this.#contentPlayer.playsInline) {
      this.#adPlayer.playsInline = true;
    }
    // append to rmp-ad-container
    FW.hide(this.#adPlayer);
    this.#adContainer.appendChild(this.#adPlayer);

    // we track ended state for content player
    this.#contentPlayer.addEventListener('ended', () => {
      if (this.#rmpVast.__adOnStage) {
        return;
      }
      this.#rmpVast.contentCompleted = true;
    });
    // we need to preload as much creative data as possible
    // also on macOS and iOS Safari we need to force preload to avoid 
    // playback issues
    this.#adPlayer.preload = 'auto';
    // we need to init the ad player video tag
    // according to https://developers.google.com/interactive-media-ads/docs/sdks/html5/mobile_video
    // to initialize the content element, a call to the load() method is sufficient.
    if (Environment.isMobile) {
      // on Android both this.currentContentPlayer (to resume content)
      // and this.currentAdPlayer (to start ads) needs to be init
      // on iOS only init this.currentAdPlayer (as same as this.currentContentPlayer)
      this.#contentPlayer.load();
      this.#adPlayer.load();
    }
    this.#rmpVast.rmpVastInitialized = true;
  }

  append(url, type) {
    // in case loadAds is called several times - rmpVastInitialized is already true
    // but we still need to locate the currentAdPlayer
    if (!this.#adPlayer) {
      // we use existing ad player as it is already 
      // available and initialized (no need for user interaction)
      let existingAdPlayer = null;
      if (this.#adContainer) {
        existingAdPlayer = this.#adContainer.querySelector('.rmp-ad-vast-video-player');
      }
      if (existingAdPlayer === null) {
        this.#rmpVast.rmpVastUtils.processVastErrors(900, true);
        return;
      }
      this.#adPlayer = existingAdPlayer;
    }
    this.#rmpVast.rmpVastContentPlayer.pause();
    if (!this.#rmpVast.creative.isLinear) {
      // we do not display non-linear ads with outstream ad 
      // they won't fit the format
      if (this.#params.outstream) {
        Logger.print(this.#rmpVast.debugRawConsoleLogs, `non-linear creative detected for outstream ad mode - discarding creative`);
        this.#rmpVast.rmpVastUtils.processVastErrors(201, true);
        return;
      } else {
        if (this.#rmpVast.rmpVastNonLinearCreative) {
          this.#rmpVast.rmpVastNonLinearCreative.update();
        }
      }
    } else {
      if (url && type && this.#rmpVast.rmpVastLinearCreative) {
        this.#rmpVast.rmpVastLinearCreative.update(url, type);
      }
    }
    // wire tracking events
    this.#rmpVast.rmpVastTracking.wire();

    // append icons - only where ad player is different from 
    // content player
    if (this.#rmpVast.rmpVastIcons) {
      const iconsData = this.#rmpVast.rmpVastIcons.iconsData;
      if (iconsData.length > 0) {
        this.#rmpVast.rmpVastIcons.append();
      }
    }
  }

  play(firstAdPlayerPlayRequest) {
    if (this.#adPlayer && this.#adPlayer.paused) {
      this.#rmpVast.rmpVastUtils.playPromise('vast', firstAdPlayerPlayRequest);
    }
  }

  pause() {
    if (this.#adPlayer && !this.#adPlayer.paused) {
      this.#adPlayer.pause();
    }
  }

  resumeContent() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `AdPlayer resumeContent requested`);
    if (this.#rmpVast.rmpVastAdPlayer) {
      this.#rmpVast.rmpVastAdPlayer.destroy();
    }
    if (this.#rmpVast.rmpVastLinearCreative) {
      this.#rmpVast.rmpVastLinearCreative.readingHlsJS = false;
    }
    // if contentPlayerCompleted = true - we are in a post-roll situation
    // in that case we must not resume content once the post-roll has completed
    // you can use contentPlayerCompleted to support 
    // custom use-cases when dynamically changing source for content
    // no need to resume content for outstream ads
    if (!this.#rmpVast.contentCompleted && !this.#params.outstream) {
      Logger.print(this.#rmpVast.debugRawConsoleLogs, `content player play requested after ad player resumeContent`);
      this.#rmpVast.rmpVastContentPlayer.play();
    }
    this.#rmpVast.contentCompleted = false;
  }

}
