import { FW } from '../fw/fw';
import { ENV } from '../fw/env';
import { CONTENTPLAYER } from '../players/content-player';
import { VPAID } from '../players/vpaid';
import { ICONS } from '../creatives/icons';
import { RESET } from '../utils/reset';
import { TRACKINGEVENTS } from '../tracking/tracking-events';
import { NONLINEAR } from '../creatives/non-linear';
import { LINEAR } from '../creatives/linear';
import { API } from '../api/api';
import { VASTERRORS } from '../utils/vast-errors';
import { HELPERS } from '../utils/helpers';

const VASTPLAYER = {};

var _destroyVastPlayer = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: start destroying vast player');
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
    try {
      this.adContainer.removeChild(this.clickUIOnMobile);
    } catch (e) {
      FW.trace(e);
    }
  }
  if (this.isSkippableAd) {
    try {
      this.adContainer.removeChild(this.skipButton);
    } catch (e) {
      FW.trace(e);
    }
  }
  // hide rmp-ad-container
  FW.hide(this.adContainer);
  // unwire anti-seek logic (iOS)
  clearInterval(this.antiSeekLogicInterval);
  // reset creativeLoadTimeout
  clearTimeout(this.creativeLoadTimeoutCallback);
  if (this.useContentPlayerForAds) {
    if (this.nonLinearContainer) {
      try {
        this.adContainer.removeChild(this.nonLinearContainer);
      } catch (e) {
        FW.trace(e);
      }
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
        FW.log('RMP-VAST: recovering content with src ' + this.currentContentSrc +
          ' - at time: ' + this.currentContentCurrentTime);
      }
      this.contentPlayer.src = this.currentContentSrc;
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
          FW.log('RMP-VAST: vastPlayer flushed');
        }
      }
      if (this.nonLinearContainer) {
        try {
          this.adContainer.removeChild(this.nonLinearContainer);
        } catch (e) {
          FW.trace(e);
        }
      }
    } catch (e) {
      FW.trace(e);
    }
  }
  // reset internal variables for next ad if any
  // we tick to let buffer empty
  setTimeout(() => {
    RESET.internalVariables.call(this);
    API.createEvent.call(this, 'addestroyed');
  }, 100);
};

VASTPLAYER.init = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: init called');
  }
  this.adContainer = document.createElement('div');
  this.adContainer.className = 'rmp-ad-container';
  this.content.appendChild(this.adContainer);
  FW.hide(this.adContainer);
  if (!this.useContentPlayerForAds) {
    this.vastPlayer = document.createElement('video');
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
      let existingVastPlayer = this.adContainer.getElementsByClassName('rmp-ad-vast-video-player')[0];
      if (!existingVastPlayer) {
        VASTERRORS.process.call(this, 1004);
        return;
      }
      this.vastPlayer = existingVastPlayer;
    }
  }
  if (!this.adIsLinear) {
    NONLINEAR.update.call(this);
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
  return null;
};

VASTPLAYER.setMute = function (muted) {
  if (this.vastPlayer) {
    if (muted && !this.vastPlayer.muted) {
      this.vastPlayer.muted = true;
      FW.dispatchPingEvent.call(this, 'mute');
    } else if (!muted && this.vastPlayer.muted) {
      this.vastPlayer.muted = false;
      FW.dispatchPingEvent.call(this, 'unmute');
    }
  }
};

VASTPLAYER.getMute = function () {
  if (this.vastPlayer) {
    return this.vastPlayer.muted;
  }
  return null;
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
    let duration = this.vastPlayer.duration;
    if (typeof duration === 'number' && Number.isFinite(duration)) {
      return Math.round(duration * 1000);
    }
  }
  return -1;
};

VASTPLAYER.getCurrentTime = function () {
  if (this.vastPlayer) {
    let currentTime = this.vastPlayer.currentTime;
    if (typeof currentTime === 'number' && Number.isFinite(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }
  return -1;
};

VASTPLAYER.resumeContent = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: resumeContent');
  }
  _destroyVastPlayer.call(this);
  // if this.contentPlayerCompleted = true - we are in a post-roll situation
  // in that case we must not resume content once the post-roll has completed
  // you can use setContentPlayerCompleted/getContentPlayerCompleted to support 
  // custom use-cases when dynamically changing source for content
  if (!this.contentPlayerCompleted) {
    CONTENTPLAYER.play.call(this);
  }
  this.contentPlayerCompleted = false;
};

export { VASTPLAYER };