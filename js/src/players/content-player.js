import { FW } from '../fw/fw';

const CONTENTPLAYER = {};

CONTENTPLAYER.play = function (firstContentPlayerPlayRequest) {
  if (this.contentPlayer && this.contentPlayer.paused) {
    FW.playPromise.call(this, 'content', firstContentPlayerPlayRequest);
  }
};

CONTENTPLAYER.pause = function () {
  if (this.contentPlayer && !this.contentPlayer.paused) {
    this.contentPlayer.pause();
  }
};

CONTENTPLAYER.setVolume = function (level) {
  if (this.contentPlayer) {
    this.contentPlayer.volume = level;
  }
};

CONTENTPLAYER.getVolume = function () {
  if (this.contentPlayer) {
    return this.contentPlayer.volume;
  }
  return -1;
};

CONTENTPLAYER.getMute = function () {
  if (this.contentPlayer) {
    return this.contentPlayer.muted;
  }
  return false;
};

CONTENTPLAYER.setMute = function (muted) {
  if (this.contentPlayer) {
    if (muted && !this.contentPlayer.muted) {
      this.contentPlayer.muted = true;
    } else if (!muted && this.contentPlayer.muted) {
      this.contentPlayer.muted = false;
    }
  }
};

CONTENTPLAYER.getDuration = function () {
  if (this.contentPlayer) {
    let duration = this.contentPlayer.duration;
    if (typeof duration === 'number' && Number.isFinite(duration)) {
      return Math.round(duration * 1000);
    }
  }
  return -1;
};

CONTENTPLAYER.getCurrentTime = function () {
  if (this.contentPlayer) {
    let currentTime = this.contentPlayer.currentTime;
    if (typeof currentTime === 'number' && Number.isFinite(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }
  return -1;
};

CONTENTPLAYER.seekTo = function (msSeek) {
  if (typeof msSeek !== 'number') {
    return;
  }
  if (msSeek >= 0 && this.contentPlayer) {
    let seekValue = Math.round((msSeek / 1000) * 100) / 100;
    this.contentPlayer.currentTime = seekValue;
  }
};

CONTENTPLAYER.preventSeekingForCustomPlayback = function () {
  // after much poking it appears we cannot rely on seek events for iOS to 
  // set this up reliably - so interval it is
  if (this.contentPlayer) {
    this.antiSeekLogicInterval = setInterval(() => {
      if (this.adIsLinear && this.adOnStage) {
        let diff = Math.abs(this.customPlaybackCurrentTime - this.contentPlayer.currentTime);
        if (diff > 1) {
          this.contentPlayer.currentTime = this.customPlaybackCurrentTime;
        }
        this.customPlaybackCurrentTime = this.contentPlayer.currentTime;
      }
    }, 200);
  }
};


export { CONTENTPLAYER };