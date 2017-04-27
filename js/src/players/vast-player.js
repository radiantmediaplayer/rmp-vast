import { FW } from '../fw/fw';
import { FWVAST } from '../fw/fw-vast';
import { ENV } from '../fw/env';
import { CONTENTPLAYER } from '../players/content-player';
import { ICONS } from '../creatives/icons';
import { RESET } from '../utils/reset';
import { TRACKINGEVENTS } from '../tracking/tracking-events';
import { NONLINEAR } from '../creatives/non-linear';
import { LINEAR } from '../creatives/linear';
import { API } from '../api/api';
import { VASTERRORS } from '../utils/vast-errors';

const VASTPLAYER = {};

var _onPlayingSeek = function () {
  this.contentPlayer.removeEventListener('playing', this.onPlayingSeek);
  CONTENTPLAYER.seekTo.call(this, this.currentContentCurrentTime);
};

var _destroyVastPlayer = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: start destroying vast player');
  }
  // destroy icons if any 
  if (this.icons.length > 0) {
    ICONS.destroy.call(this);
  }
  // unwire events
  RESET.unwireVastPlayerEvents.call(this);
  // remove clickUI on mobile
  if (this.clickUIOnMobile) {
    this.adContainer.removeChild(this.clickUIOnMobile);
  }
  // hide rmp-ad-container
  FW.hide(this.adContainer);
  if (this.useContentPlayerForAds) {
    if (this.currentContentCurrentTime > 200) {
      this.onPlayingSeek = _onPlayingSeek.bind(this);
      this.contentPlayer.addEventListener('playing', this.onPlayingSeek);
    }
    if (DEBUG) {
      FW.log('RMP-VAST: recovering content with src ' + this.currentContentSrc);
    }
    this.contentPlayer.src = this.currentContentSrc;
    this.contentPlayer.load();
  } else {
    this.vastPlayer.pause();
    FW.hide(this.vastPlayer);
    // empty buffer for vastPlayer
    try {
      if (this.vastPlayer && this.vastPlayerSource) {
        if (this.vastPlayerSource.hasAttribute('src')) {
          this.vastPlayerSource.removeAttribute('src');
          this.vastPlayer.load();
          if (DEBUG) {
            FW.log('RMP-VAST: emptied VAST player buffer');
          }
        }
      }
      if (this.nonLinearCreative) {
        this.adContainer.removeChild(this.nonLinearCreative);
      }
    } catch (e) {
      FW.trace(e);
    }
  }
  // reset internal variables for next ad if any
  RESET.internalVariables.call(this);
  API.createEvent.call(this, 'addestroyed');
};

VASTPLAYER.init = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: init called on VASTPLAYER');
  }
  if (!this.adContainer) {
    this.adContainer = document.createElement('div');
    this.adContainer.className = 'rmp-ad-container';
    this.content.appendChild(this.adContainer);
  }
  FW.hide(this.adContainer);
  if (!this.useContentPlayerForAds) {
    this.vastPlayer = document.createElement('video');
    this.vastPlayer.className = 'rmp-ad-vast-video-player';
    if (!ENV.isMobile) {
      this.vastPlayer.style.cursor = 'pointer';
    }
    FW.hide(this.vastPlayer);
    this.vastPlayer.controls = false;
    if (this.contentPlayer.muted) {
      this.vastPlayer.muted = true;
    }
    this.vastPlayer.setAttribute('x-webkit-airplay', 'allow');
    if (typeof this.contentPlayer.playsInline === 'boolean' && this.contentPlayer.playsInline) {
      this.vastPlayer.playsInline = true;
    } else if (ENV.isMobile) {
      // TO REVIEW
      this.vastPlayer.setAttribute('webkit-playsinline', true);
    }
    this.vastPlayer.preload = 'auto';
    this.vastPlayer.defaultPlaybackRate = 1;
    if (ENV.isMobile) {
      if (DEBUG) {
        FW.log('RMP-VAST: fake start for mobiles to init video tag');
      }
      FW.playPromise(this.vastPlayer);
      this.vastPlayer.pause();
    }
  } else {
    this.vastPlayer = this.contentPlayer;
  }
  this.vastPlayerInitialized = true;
};

VASTPLAYER.append = function (url, type) {
  // this is for autoplay on desktop
  // or muted autoplay on mobile where player is not initialize
  if (!this.vastPlayerInitialized) {
    VASTPLAYER.init.call(this);
  }
  // in case loadAds is called several times - vastPlayerInitialized is already true
  // but we still need to locate the vastPlayer
  if (!this.vastPlayer) {
    if (this.useContentPlayerForAds) {
      this.vastPlayer = this.contentPlayer;
    } else {
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
  this.vastPlayer.volume = level;
};

VASTPLAYER.getVolume = function () {
  return this.vastPlayer.volume;
};

VASTPLAYER.setMute = function (muted) {
  if (muted && !this.vastPlayer.muted) {
    this.vastPlayer.muted = true;
    FWVAST.dispatchPingEvent.call(this, 'mute');
  } else if (!muted && this.vastPlayer.muted) {
    this.vastPlayer.muted = false;
    FWVAST.dispatchPingEvent.call(this, 'unmute');
  }
};

VASTPLAYER.getMute = function () {
  return this.vastPlayer.muted;
};

VASTPLAYER.play = function () {
  if (this.vastPlayer.paused) {
    FW.playPromise(this.vastPlayer);
  }
};

VASTPLAYER.pause = function () {
  if (!this.vastPlayer.paused) {
    this.vastPlayer.pause();
  }
};

VASTPLAYER.getDuration = function () {
  let duration = this.vastPlayer.duration;
  if (FW.isNumber(duration)) {
    return Math.round(duration * 1000);
  }
  return -1;
};

VASTPLAYER.getCurrentTime = function () {
  let currentTime = this.vastPlayer.currentTime;
  if (FW.isNumber(currentTime)) {
    return Math.round(currentTime * 1000);
  }
  return -1;
};

var _onReset = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: processing onReset after adcontentresumerequested');
  }
  if (this.vastPlayer) {
    this.vastPlayer.removeEventListener('reset', this.onReset);
  }
  _destroyVastPlayer.call(this);
  CONTENTPLAYER.play.call(this);
};

VASTPLAYER.resumeContent = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: resumeContent');
  }
  this.onReset = _onReset.bind(this);
  if (this.readyForReset) {
    this.onReset();
  } else {
    // in case we need to wait for the ping on complete/skip
    this.vastPlayer.addEventListener('reset', this.onReset);
  }
};

export { VASTPLAYER };