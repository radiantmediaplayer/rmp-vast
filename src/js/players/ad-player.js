import FW from '../framework/fw';
import Environment from '../framework/environment';
import Logger from '../framework/logger';


export default class AdPlayer {

  constructor(rmpVast) {
    this._rmpVast = rmpVast;
    this._params = rmpVast.params;
    this._contentPlayer = rmpVast.currentContentPlayer;
    this._adContainer = rmpVast.adContainer;
    this._contentWrapper = rmpVast.contentWrapper;
    this._adPlayer = null;
  }

  set volume(level) {
    if (this._adPlayer) {
      this._adPlayer.volume = level;
    }
  }

  get volume() {
    if (this._adPlayer) {
      return this._adPlayer.volume;
    }
    return -1;
  }

  set muted(muted) {
    if (this._adPlayer) {
      if (muted && !this._adPlayer.muted) {
        this._adPlayer.muted = true;
      } else if (!muted && this._adPlayer.muted) {
        this._adPlayer.muted = false;
      }
    }
  }

  get muted() {
    if (this._adPlayer) {
      return this._adPlayer.muted;
    }
    return false;
  }

  get duration() {
    if (this._adPlayer && FW.isNumber(this._adPlayer.duration)) {
      return this._adPlayer.duration * 1000;
    }
    return -1;
  }

  get currentTime() {
    if (this._adPlayer && FW.isNumber(this._adPlayer.currentTime)) {
      return this._adPlayer.currentTime * 1000;
    }
    return -1;
  }

  destroy() {
    Logger.print('info', `start destroying ad player`);

    // destroy icons if any 
    if (this._rmpVast.rmpVastIcons) {
      this._rmpVast.rmpVastIcons.destroy();
    }

    if (this._rmpVast.rmpVastVpaidPlayer) {
      this._rmpVast.rmpVastVpaidPlayer.destroy();
    }

    // reset non-linear creative
    if (this._rmpVast.rmpVastNonLinearCreative) {
      this._rmpVast.rmpVastNonLinearCreative.destroy();
    }

    // reset linear creative
    if (this._rmpVast.rmpVastLinearCreative) {
      this._rmpVast.rmpVastLinearCreative.destroy();
    }

    // unwire events
    this._rmpVast.rmpVastTracking.destroy();

    // hide rmp-ad-container
    FW.hide(this._adContainer);

    // unwire anti-seek logic (iOS)
    if (this._rmpVast.rmpVastContentPlayer) {
      this._rmpVast.rmpVastContentPlayer.destroy();
    }
    // flush currentAdPlayer
    try {
      if (this._adPlayer) {
        this._adPlayer.pause();
        if (this._rmpVast.rmpVastLinearCreative && this._rmpVast.rmpVastLinearCreative.readingHlsJS) {
          this._rmpVast.rmpVastLinearCreative.readingHlsJS = false;
          this._rmpVast.rmpVastLinearCreative.hlsJSInstances[this._rmpVast.rmpVastLinearCreative.hlsJSIndex].destroy();
          this._rmpVast.rmpVastLinearCreative.hlsJSIndex = this._rmpVast.rmpVastLinearCreative.hlsJSIndex++;
        } else {
          // empty buffer
          this._adPlayer.removeAttribute('src');
          this._adPlayer.load();
        }
        FW.hide(this._adPlayer);
        Logger.print('info', `flushing currentAdPlayer buffer after ad`);
      }
      if (this._rmpVast.rmpVastNonLinearCreative) {
        FW.removeElement(this._rmpVast.rmpVastNonLinearCreative.nonLinearContainerElement);
      }
    } catch (error) {
      Logger.print('warning', error);
    }

    this._rmpVast.resetVariablesForNewLoadAds();
    this._rmpVast.rmpVastUtils.createApiEvent('addestroyed');
  }

  init() {
    this._rmpVast.adContainer = this._adContainer = document.createElement('div');
    this._adContainer.className = 'rmp-ad-container';
    this._contentWrapper.appendChild(this._adContainer);
    FW.hide(this._adContainer);

    this._rmpVast.currentAdPlayer = this._adPlayer = document.createElement('video');
    Logger.printVideoEvents(this._adPlayer, 'ad');
    // disable native UI cast/PiP for ad player
    this._adPlayer.disableRemotePlayback = true;
    this._adPlayer.disablePictureInPicture = true;
    this._adPlayer.className = 'rmp-ad-vast-video-player';
    if (this._params.showControlsForAdPlayer) {
      this._adPlayer.controls = true;
    } else {
      this._adPlayer.controls = false;
    }

    // this.currentContentPlayer.muted may not be set because of a bug in some version of Chromium
    if (this._contentPlayer.hasAttribute('muted')) {
      this._contentPlayer.muted = true;
    }
    if (this._contentPlayer.muted) {
      this._adPlayer.muted = true;
    }
    // black poster based 64 png
    this._adPlayer.poster = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    // note to myself: we use setAttribute for non-standard attribute (instead of . notation)
    this._adPlayer.setAttribute('x-webkit-airplay', 'allow');
    if (typeof this._contentPlayer.playsInline === 'boolean' && this._contentPlayer.playsInline) {
      this._adPlayer.playsInline = true;
    }
    // append to rmp-ad-container
    FW.hide(this._adPlayer);
    this._adContainer.appendChild(this._adPlayer);

    // we track ended state for content player
    this._contentPlayer.addEventListener('ended', () => {
      if (this._rmpVast.__adOnStage) {
        return;
      }
      this._rmpVast.contentCompleted = true;
    });
    // we need to preload as much creative data as possible
    // also on macOS and iOS Safari we need to force preload to avoid 
    // playback issues
    this._adPlayer.preload = 'auto';
    // we need to init the ad player video tag
    // according to https://developers.google.com/interactive-media-ads/docs/sdks/html5/mobile_video
    // to initialize the content element, a call to the load() method is sufficient.
    if (Environment.isMobile) {
      // on Android both this.currentContentPlayer (to resume content)
      // and this.currentAdPlayer (to start ads) needs to be init
      // on iOS only init this.currentAdPlayer (as same as this.currentContentPlayer)
      this._contentPlayer.load();
      this._adPlayer.load();
    }
    this._rmpVast.rmpVastInitialized = true;
  }

  append(url, type) {
    // in case loadAds is called several times - rmpVastInitialized is already true
    // but we still need to locate the currentAdPlayer
    if (!this._adPlayer) {
      // we use existing ad player as it is already 
      // available and initialized (no need for user interaction)
      let existingAdPlayer = null;
      if (this._adContainer) {
        existingAdPlayer = this._adContainer.querySelector('.rmp-ad-vast-video-player');
      }
      if (existingAdPlayer === null) {
        this._rmpVast.rmpVastUtils.processVastErrors(900, true);
        return;
      }
      this._adPlayer = existingAdPlayer;
    }
    this._rmpVast.rmpVastContentPlayer.pause();
    if (!this._rmpVast.creative.isLinear) {
      // we do not display non-linear ads with outstream ad 
      // they won't fit the format
      if (this._params.outstream) {
        Logger.print('info', `non-linear creative detected for outstream ad mode - discarding creative`);
        this._rmpVast.rmpVastUtils.processVastErrors(201, true);
        return;
      } else {
        if (this._rmpVast.rmpVastNonLinearCreative) {
          this._rmpVast.rmpVastNonLinearCreative.update();
        }
      }
    } else {
      if (url && type && this._rmpVast.rmpVastLinearCreative) {
        this._rmpVast.rmpVastLinearCreative.update(url, type);
      }
    }
    // wire tracking events
    this._rmpVast.rmpVastTracking.wire();

    // append icons - only where ad player is different from 
    // content player
    if (this._rmpVast.rmpVastIcons) {
      const iconsData = this._rmpVast.rmpVastIcons.iconsData;
      if (iconsData.length > 0) {
        this._rmpVast.rmpVastIcons.append();
      }
    }
  }

  play(firstAdPlayerPlayRequest) {
    if (this._adPlayer && this._adPlayer.paused) {
      this._rmpVast.rmpVastUtils.playPromise('vast', firstAdPlayerPlayRequest);
    }
  }

  pause() {
    if (this._adPlayer && !this._adPlayer.paused) {
      this._adPlayer.pause();
    }
  }

  resumeContent() {
    Logger.print('info', `AdPlayer resumeContent requested`);
    if (this._rmpVast.rmpVastAdPlayer) {
      this._rmpVast.rmpVastAdPlayer.destroy();
    }
    if (this._rmpVast.rmpVastLinearCreative) {
      this._rmpVast.rmpVastLinearCreative.readingHlsJS = false;
    }
    // if contentPlayerCompleted = true - we are in a post-roll situation
    // in that case we must not resume content once the post-roll has completed
    // you can use contentPlayerCompleted to support 
    // custom use-cases when dynamically changing source for content
    // no need to resume content for outstream ads
    if (!this._rmpVast.contentCompleted && !this._params.outstream) {
      Logger.print('info', `content player play requested after ad player resumeContent`);
      this._rmpVast.rmpVastContentPlayer.play();
    }
    this._rmpVast.contentCompleted = false;
  }

}
