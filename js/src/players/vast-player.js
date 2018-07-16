import FW from '../fw/fw';
import ENV from '../fw/env';
import HELPERS from '../utils/helpers';
import CONTENTPLAYER from '../players/content-player';
import VPAID from '../players/vpaid';
import ICONS from '../creatives/icons';
import RESET from '../utils/reset';
import TRACKINGEVENTS from '../tracking/tracking-events';
import NONLINEAR from '../creatives/non-linear';
import LINEAR from '../creatives/linear';
import API from '../api/api';
import VASTERRORS from '../utils/vast-errors';

const VASTPLAYER = {};

const _destroyVastPlayer = function () {
  if (DEBUG) {
    FW.log('start destroying vast player');
  }
  // destroy icons if any 
  if (this.icons.length > 0) {
    ICONS.destroy.call(this);
  }
  if (this.isVPAID) {
    VPAID.destroy.call(this);
  }
  // unwire events
  RESET.unwireVastPlayerEvents.call(this);
  // remove clickUI on mobile
  if (this.clickUIOnMobile) {
    FW.removeElement(this.clickUIOnMobile);
  }
  if (this.isSkippableAd) {
    FW.removeElement(this.skipButton);
  }
  // hide rmp-ad-container
  FW.hide(this.adContainer);
  // unwire anti-seek logic (iOS)
  clearInterval(this.antiSeekLogicInterval);
  // reset creativeLoadTimeout
  clearTimeout(this.creativeLoadTimeoutCallback);
  if (this.useContentPlayerForAds) {
    if (!this.params.outstream) {
      if (this.nonLinearContainer) {
        FW.removeElement(this.nonLinearContainer);
      } else {
        // when content is restored we need to seek to previously known currentTime
        // this must happen on playing event
        // the below is some hack I come up with because Safari is confused with 
        // what it is asked to do when post roll come into play
        if (this.currentContentCurrentTime > 4000) {
          this.needsSeekAdjust = true;
          if (this.contentPlayerCompleted) {
            this.needsSeekAdjust = false;
          }
          if (!this.seekAdjustAttached) {
            this.seekAdjustAttached = true;
            this.contentPlayer.addEventListener('playing', () => {
              if (this.needsSeekAdjust) {
                this.needsSeekAdjust = false;
                CONTENTPLAYER.seekTo.call(this, this.currentContentCurrentTime);
              }
            });
          }
        }
        if (DEBUG) {
          FW.log('recovering content with src ' + this.currentContentSrc +
            ' - at time: ' + this.currentContentCurrentTime);
        }
        this.contentPlayer.src = this.currentContentSrc;
      }
    } else {
      // specific handling for outstream ad === flush buffer and do not attempt to resume content
      try { 
        if (this.contentPlayer) {
          this.contentPlayer.pause();
          // empty buffer
          this.contentPlayer.removeAttribute('src');
          this.contentPlayer.load();
          if (DEBUG) {
            FW.log('flushing contentPlayer buffer after outstream ad');
          }
        }
      } catch (e) {
        FW.trace(e);
      }
    }
  } else {
    // flush vastPlayer
    try {
      if (this.vastPlayer) {
        this.vastPlayer.pause();
        // empty buffer
        this.vastPlayer.removeAttribute('src');
        this.vastPlayer.load();
        FW.hide(this.vastPlayer);
        if (DEBUG) {
          FW.log('flushing vastPlayer buffer after ad');
        }
      }
      if (this.nonLinearContainer) {
        FW.removeElement(this.nonLinearContainer);
      }
    } catch (e) {
      FW.trace(e);
    }
  }
  RESET.internalVariables.call(this);
  API.createEvent.call(this, 'addestroyed');
};

VASTPLAYER.init = function () {
  if (DEBUG) {
    FW.log('init called');
  }
  this.adContainer = document.createElement('div');
  this.adContainer.className = 'rmp-ad-container';
  this.content.appendChild(this.adContainer);
  FW.hide(this.adContainer);
  if (!this.useContentPlayerForAds) {
    this.vastPlayer = document.createElement('video');
    if (DEBUG) {
      FW.logVideoEvents(this.vastPlayer, 'vast');
    }
    // disable casting of video ads for Android
    if (ENV.isAndroid[0] && typeof this.vastPlayer.disableRemotePlayback !== 'undefined') {
      this.vastPlayer.disableRemotePlayback = true;
    }
    this.vastPlayer.className = 'rmp-ad-vast-video-player';
    this.vastPlayer.controls = false;
    // this.contentPlayer.muted may not be set because of a bug in some version of Chromium
    if (this.contentPlayer.hasAttribute('muted')) {
      this.contentPlayer.muted = true;
    }
    if (this.contentPlayer.muted) {
      this.vastPlayer.muted = true;
    }
    // black poster based 64 png
    this.vastPlayer.poster = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    // note to myself: we use setAttribute for non-standard attribute (instead of . notation)
    this.vastPlayer.setAttribute('x-webkit-airplay', 'allow');
    if (typeof this.contentPlayer.playsInline === 'boolean' && this.contentPlayer.playsInline) {
      this.vastPlayer.playsInline = true;
    } else if (ENV.isMobile) {
      // this is for iOS/Android WebView where webkit-playsinline may be available
      this.vastPlayer.setAttribute('webkit-playsinline', true);
    }
    this.vastPlayer.defaultPlaybackRate = 1;
    // append to rmp-ad-container
    FW.hide(this.vastPlayer);
    this.adContainer.appendChild(this.vastPlayer);
  } else {
    this.vastPlayer = this.contentPlayer;
  }
  // we track ended state for content player
  this.contentPlayer.addEventListener('ended', () => {
    if (this.adOnStage) {
      return;
    }
    this.contentPlayerCompleted = true;
  });
  // we need to preload as much creative data as possible
  // also on macOS and iOS Safari we need to force preload to avoid 
  // playback issues
  this.vastPlayer.preload = 'auto';
  // we need to init the vast player video tag
  // according to https://developers.google.com/interactive-media-ads/docs/sdks/html5/mobile_video
  // to initialize the content element, a call to the load() method is sufficient.
  if (ENV.isMobile) {
    // on Android both this.contentPlayer (to resume content)
    // and this.vastPlayer (to start ads) needs to be init
    // on iOS only init this.vastPlayer (as same as this.contentPlayer)
    if (!this.useContentPlayerForAds) {
      this.contentPlayer.load();
    }
    this.vastPlayer.load();
  } else {
    // due to autoplay being blocked on macOS Safari 11+
    // we also need to init player on this browser
    // this also work on previous version of Safari
    if (this.useContentPlayerForAds) {
      this.vastPlayer.load();
    }
  }
  this.rmpVastInitialized = true;
};

VASTPLAYER.append = function (url, type) {
  // in case loadAds is called several times - rmpVastInitialized is already true
  // but we still need to locate the vastPlayer
  if (!this.vastPlayer) {
    if (this.useContentPlayerForAds) {
      this.vastPlayer = this.contentPlayer;
    } else {
      // we use existing rmp-ad-vast-video-player as it is already 
      // available and initialized (no need for user interaction)
      const existingVastPlayer = this.adContainer.querySelector('.rmp-ad-vast-video-player');
      if (existingVastPlayer === null) {
        VASTERRORS.process.call(this, 1004);
        return;
      }
      this.vastPlayer = existingVastPlayer;
    }
  }
  if (!this.adIsLinear) {
    // we do not display non-linear ads with outstream ad 
    // they won't fit the format
    if (this.params.outstream) {
      if (DEBUG) {
        FW.log('non-linear creative detected for outstream ad mode - discarding creative');
      }
      VASTERRORS.process.call(this, 201);
      return;
    } else {
      NONLINEAR.update.call(this);
    }
  } else {
    if (url && type) {
      LINEAR.update.call(this, url, type);
    }
  }
  // wire tracking events
  TRACKINGEVENTS.wire.call(this);

  // append icons - only where vast player is different from 
  // content player
  if (!this.useContentPlayerForAds && this.icons.length > 0) {
    ICONS.append.call(this);
  }
};

VASTPLAYER.setVolume = function (level) {
  if (this.vastPlayer) {
    this.vastPlayer.volume = level;
  }
};

VASTPLAYER.getVolume = function () {
  if (this.vastPlayer) {
    return this.vastPlayer.volume;
  }
  return -1;
};

VASTPLAYER.setMute = function (muted) {
  if (this.vastPlayer) {
    if (muted && !this.vastPlayer.muted) {
      this.vastPlayer.muted = true;
      HELPERS.dispatchPingEvent.call(this, 'mute');
    } else if (!muted && this.vastPlayer.muted) {
      this.vastPlayer.muted = false;
      HELPERS.dispatchPingEvent.call(this, 'unmute');
    }
  }
};

VASTPLAYER.getMute = function () {
  if (this.vastPlayer) {
    return this.vastPlayer.muted;
  }
  return false;
};

VASTPLAYER.play = function (firstVastPlayerPlayRequest) {
  if (this.vastPlayer && this.vastPlayer.paused) {
    HELPERS.playPromise.call(this, 'vast', firstVastPlayerPlayRequest);
  }
};

VASTPLAYER.pause = function () {
  if (this.vastPlayer && !this.vastPlayer.paused) {
    this.vastPlayer.pause();
  }
};

VASTPLAYER.getDuration = function () {
  if (this.vastPlayer) {
    const duration = this.vastPlayer.duration;
    if (FW.isNumber(duration)) {
      return Math.round(duration * 1000);
    }
  }
  return -1;
};

VASTPLAYER.getCurrentTime = function () {
  if (this.vastPlayer) {
    const currentTime = this.vastPlayer.currentTime;
    if (FW.isNumber(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }
  return -1;
};

VASTPLAYER.resumeContent = function () {
  if (DEBUG) {
    FW.log('resumeContent');
  }
  _destroyVastPlayer.call(this);
  // if this.contentPlayerCompleted = true - we are in a post-roll situation
  // in that case we must not resume content once the post-roll has completed
  // you can use setContentPlayerCompleted/getContentPlayerCompleted to support 
  // custom use-cases when dynamically changing source for content
  // no need to resume content for outstream ads
  if (!this.contentPlayerCompleted && !this.params.outstream) {
    CONTENTPLAYER.play.call(this);
  }
  this.contentPlayerCompleted = false;
};

export default VASTPLAYER;