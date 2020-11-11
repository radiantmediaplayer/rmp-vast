import FW from '../fw/fw';
import ENV from '../fw/env';
import HELPERS from '../utils/helpers';
import CONTENT_PLAYER from '../players/content-player';
import VPAID from '../players/vpaid';
import ICONS from '../creatives/icons';
import DEFAULT from '../utils/default';
import TRACKING_EVENTS from '../tracking/tracking-events';
import NON_LINEAR from '../creatives/non-linear';
import LINEAR from '../creatives/linear';
import VAST_ERRORS from '../utils/vast-errors';

const VAST_PLAYER = {};

const _unwireVastPlayerEvents = function () {
  if (this.debug) {
    FW.log('reset - unwireVastPlayerEvents');
  }
  if (this.nonLinearContainer) {
    this.nonLinearInnerElement.removeEventListener('load', this.onNonLinearLoadSuccess);
    this.nonLinearInnerElement.removeEventListener('error', this.onNonLinearLoadError);
    this.nonLinearATag.removeEventListener('click', this.onNonLinearClickThrough);
    this.nonLinearATag.removeEventListener('touchend', this.onNonLinearClickThrough);
    this.nonLinearClose.removeEventListener('click', this.onClickCloseNonLinear);
    this.nonLinearClose.removeEventListener('touchend', this.onClickCloseNonLinear);
    for (let i = 0, len = this.trackingTags.length; i < len; i++) {
      this.nonLinearContainer.removeEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    }
  }
  if (this.vastPlayer) {
    this.vastPlayer.removeEventListener('error', this.onPlaybackError);
    // vastPlayer content pause/resume events
    this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
    this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
    this.vastPlayer.removeEventListener('contextmenu', this.onContextMenu);
    // unwire HTML5 video events
    this.vastPlayer.removeEventListener('pause', this.onPause);
    this.vastPlayer.removeEventListener('play', this.onPlay);
    this.vastPlayer.removeEventListener('playing', this.onPlaying);
    this.vastPlayer.removeEventListener('ended', this.onEnded);
    this.vastPlayer.removeEventListener('volumechange', this.onVolumeChange);
    this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdate);

    // unwire HTML5 VAST events
    for (let i = 0, len = this.trackingTags.length; i < len; i++) {
      this.vastPlayer.removeEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    }
    // remove clicktrough handling
    if (this.onClickThrough !== null) {
      this.vastPlayer.removeEventListener('click', this.onClickThrough);
    }
    // remove icons 
    if (this.onPlayingAppendIcons !== null) {
      this.vastPlayer.removeEventListener('playing', this.onPlayingAppendIcons);
    }
    // skip
    if (this.onTimeupdateCheckSkip !== null) {
      this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
    }
    if (this.skipButton && this.onClickSkip !== null) {
      this.skipButton.removeEventListener('click', this.onClickSkip);
      this.skipButton.removeEventListener('touchend', this.onClickSkip);
    }
    // click UI on mobile
    if (this.clickUIOnMobile && this.onClickThrough !== null) {
      this.clickUIOnMobile.removeEventListener('touchend', this.onClickThrough);
    }
  }
  if (this.contentPlayer) {
    this.contentPlayer.removeEventListener('error', this.onPlaybackError);
  }
};

VAST_PLAYER.destroy = function () {
  if (this.debug) {
    FW.log('start destroying vast player');
  }
  // destroy icons if any 
  if (this.iconsData.length > 0) {
    ICONS.destroy.call(this);
  }
  if (this.isVPAID) {
    VPAID.destroy.call(this);
  }
  // unwire events
  _unwireVastPlayerEvents.call(this);
  // remove clickUI on mobile
  if (this.clickUIOnMobile) {
    FW.removeElement(this.clickUIOnMobile);
  }
  if (this.creative.isSkippableAd) {
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
                CONTENT_PLAYER.seekTo.call(this, this.currentContentCurrentTime);
              }
            });
          }
        }
        if (this.debug) {
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
          if (this.debug) {
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
        if (this.debug) {
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
  DEFAULT.resetLoadAds.call(this);
  HELPERS.createApiEvent.call(this, 'addestroyed');
};

VAST_PLAYER.init = function () {
  this.adContainer = document.createElement('div');
  this.adContainer.className = 'rmp-ad-container';
  this.contentWrapper.appendChild(this.adContainer);
  FW.hide(this.adContainer);
  if (!this.useContentPlayerForAds) {
    this.vastPlayer = document.createElement('video');
    if (this.debug) {
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

VAST_PLAYER.append = function (url, type) {
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
        VAST_ERRORS.process.call(this, 900, true);
        return;
      }
      this.vastPlayer = existingVastPlayer;
    }
  }
  if (!this.creative.isLinear) {
    // we do not display non-linear ads with outstream ad 
    // they won't fit the format
    if (this.params.outstream) {
      if (this.debug) {
        FW.log('non-linear creative detected for outstream ad mode - discarding creative');
      }
      VAST_ERRORS.process.call(this, 201, true);
      return;
    } else {
      NON_LINEAR.update.call(this);
    }
  } else {
    if (url && type) {
      LINEAR.update.call(this, url, type);
    }
  }
  // wire tracking events
  TRACKING_EVENTS.wire.call(this);

  // append icons - only where vast player is different from 
  // content player
  if (!this.useContentPlayerForAds && this.iconsData.length > 0) {
    ICONS.append.call(this);
  }
};

VAST_PLAYER.setVolume = function (level) {
  if (this.vastPlayer) {
    this.vastPlayer.volume = level;
  }
};

VAST_PLAYER.getVolume = function () {
  if (this.vastPlayer) {
    return this.vastPlayer.volume;
  }
  return -1;
};

VAST_PLAYER.setMute = function (muted) {
  if (this.vastPlayer) {
    if (muted && !this.vastPlayer.muted) {
      this.vastPlayer.muted = true;
    } else if (!muted && this.vastPlayer.muted) {
      this.vastPlayer.muted = false;
    }
  }
};

VAST_PLAYER.getMute = function () {
  if (this.vastPlayer) {
    return this.vastPlayer.muted;
  }
  return false;
};

VAST_PLAYER.play = function (firstVastPlayerPlayRequest) {
  if (this.vastPlayer && this.vastPlayer.paused) {
    HELPERS.playPromise.call(this, 'vast', firstVastPlayerPlayRequest);
  }
};

VAST_PLAYER.pause = function () {
  if (this.vastPlayer && !this.vastPlayer.paused) {
    this.vastPlayer.pause();
  }
};

VAST_PLAYER.getDuration = function () {
  if (this.vastPlayer) {
    const duration = this.vastPlayer.duration;
    if (FW.isNumber(duration)) {
      return Math.round(duration * 1000);
    }
  }
  return -1;
};

VAST_PLAYER.getCurrentTime = function () {
  if (this.vastPlayer) {
    const currentTime = this.vastPlayer.currentTime;
    if (FW.isNumber(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }
  return -1;
};

VAST_PLAYER.resumeContent = function () {
  VAST_PLAYER.destroy.call(this);
  // if this.contentPlayerCompleted = true - we are in a post-roll situation
  // in that case we must not resume content once the post-roll has completed
  // you can use setContentPlayerCompleted/getContentPlayerCompleted to support 
  // custom use-cases when dynamically changing source for content
  // no need to resume content for outstream ads
  if (!this.contentPlayerCompleted && !this.params.outstream) {
    CONTENT_PLAYER.play.call(this);
  }
  this.contentPlayerCompleted = false;
};

export default VAST_PLAYER;
