import FW from '../framework/fw';
import Utils from '../framework/utils';

const CONTENT_PLAYER = {};

CONTENT_PLAYER.play = function (firstContentPlayerPlayRequest) {
  if (this.contentPlayer && this.contentPlayer.paused) {
    Utils.playPromise.call(this, 'content', firstContentPlayerPlayRequest);
  }
};

CONTENT_PLAYER.pause = function () {
  if (this.contentPlayer && !this.contentPlayer.paused) {
    this.contentPlayer.pause();
  }
};

CONTENT_PLAYER.setVolume = function (level) {
  if (this.contentPlayer) {
    this.contentPlayer.volume = level;
  }
};

CONTENT_PLAYER.getVolume = function () {
  if (this.contentPlayer) {
    return this.contentPlayer.volume;
  }
  return -1;
};

CONTENT_PLAYER.getMute = function () {
  if (this.contentPlayer) {
    return this.contentPlayer.muted;
  }
  return false;
};

CONTENT_PLAYER.setMute = function (muted) {
  if (this.contentPlayer) {
    if (muted && !this.contentPlayer.muted) {
      this.contentPlayer.muted = true;
    } else if (!muted && this.contentPlayer.muted) {
      this.contentPlayer.muted = false;
    }
  }
};

CONTENT_PLAYER.getDuration = function () {
  if (this.contentPlayer) {
    const duration = this.contentPlayer.duration;
    if (FW.isNumber(duration)) {
      return Math.round(duration * 1000);
    }
  }
  return -1;
};

CONTENT_PLAYER.getCurrentTime = function () {
  if (this.contentPlayer) {
    const currentTime = this.contentPlayer.currentTime;
    if (FW.isNumber(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }
  return -1;
};

CONTENT_PLAYER.seekTo = function (msSeek) {
  if (!FW.isNumber(msSeek)) {
    return;
  }
  if (msSeek >= 0 && this.contentPlayer) {
    const seekValue = Math.round((msSeek / 1000) * 100) / 100;
    this.contentPlayer.currentTime = seekValue;
  }
};

CONTENT_PLAYER.preventSeekingForCustomPlayback = function () {
  // after much poking it appears we cannot rely on seek events for iOS to 
  // set this up reliably - so interval it is
  if (this.contentPlayer) {
    this.antiSeekLogicInterval = setInterval(() => {
      if (this.creative.isLinear && this.adOnStage) {
        const diff = Math.abs(this.customPlaybackCurrentTime - this.contentPlayer.currentTime);
        if (diff > 1) {
          this.contentPlayer.currentTime = this.customPlaybackCurrentTime;
        }
        this.customPlaybackCurrentTime = this.contentPlayer.currentTime;
      }
    }, 200);
  }
};

export default CONTENT_PLAYER;
