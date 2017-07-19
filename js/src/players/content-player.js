import { FW } from '../fw/fw';

const CONTENTPLAYER = {};

CONTENTPLAYER.init = function () {
  FW.playPromise(this.contentPlayer);
  this.contentPlayer.pause();
};


CONTENTPLAYER.play = function () {
  if (this.contentPlayer.paused) {
    FW.playPromise(this.contentPlayer);
  }
};

CONTENTPLAYER.pause = function () {
  if (!this.contentPlayer.paused) {
    this.contentPlayer.pause();
  }
};

CONTENTPLAYER.setVolume = function (level) {
  this.contentPlayer.volume = level;
};

CONTENTPLAYER.getVolume = function () {
  return this.contentPlayer.volume;
};

CONTENTPLAYER.getMute = function () {
  return this.contentPlayer.muted;
};

CONTENTPLAYER.setMute = function (muted) {
  if (muted && !this.contentPlayer.muted) {
    this.contentPlayer.muted = true;
  } else if (!muted && this.contentPlayer.muted) {
    this.contentPlayer.muted = false;
  }
};

CONTENTPLAYER.getDuration = function () {
  let duration = this.contentPlayer.duration;
  if (FW.isNumber(duration)) {
    return Math.round(duration * 1000);
  }
  return -1;
};

CONTENTPLAYER.getCurrentTime = function () {
  let currentTime = this.contentPlayer.currentTime;
  if (FW.isNumber(currentTime)) {
    return Math.round(currentTime * 1000);
  }
  return -1;
};

CONTENTPLAYER.seekTo = function (msSeek) {
  if (!FW.isNumber(msSeek)) {
    return;
  }
  if (msSeek >= 0) {
    let seekValue = Math.round((msSeek / 1000) * 100) / 100;
    try {
      this.contentPlayer.currentTime = seekValue;
    } catch (e) {
      FW.trace(e);
    }
  }
};

CONTENTPLAYER.preventSeekingForCustomPlayback = function () {
  // after much poking it appears we cannot rely on seek events for iOS to 
  // set this up reliably - so interval it is
  this.antiSeekLogicInterval = setInterval(() => {
    if (this.adIsLinear && this.adOnStage) {
      let diff = Math.abs(this.customPlaybackCurrentTime - this.contentPlayer.currentTime);
      if (diff > 1) {
        this.contentPlayer.currentTime = this.customPlaybackCurrentTime;
      }
      this.customPlaybackCurrentTime = this.contentPlayer.currentTime;
    }
  }, 200);
};


export { CONTENTPLAYER };