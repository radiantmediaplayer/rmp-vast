import FW from '../framework/fw';


export default class ContentPlayer {

  constructor(rmpVast) {
    this._rmpVast = rmpVast;
    this._contentPlayer = rmpVast.currentContentPlayer;
    this._customPlaybackCurrentTime = 0;
    this._antiSeekLogicInterval = null;
  }

  set volume(level) {
    if (this._contentPlayer) {
      this._contentPlayer.volume = level;
    }
  }

  get volume() {
    if (this._contentPlayer) {
      return this._contentPlayer.volume;
    }
    return -1;
  }

  get muted() {
    if (this._contentPlayer) {
      return this._contentPlayer.muted;
    }
    return false;
  }

  set muted(muted) {
    if (this._contentPlayer) {
      if (muted && !this._contentPlayer.muted) {
        this._contentPlayer.muted = true;
      } else if (!muted && this._contentPlayer.muted) {
        this._contentPlayer.muted = false;
      }
    }
  }

  get currentTime() {
    if (this._contentPlayer && FW.isNumber(this._contentPlayer.currentTime)) {
      return this._contentPlayer.currentTime * 1000;
    }
    return -1;
  }

  destroy() {
    FW.clearInterval(this._antiSeekLogicInterval);
  }

  play(firstContentPlayerPlayRequest) {
    if (this._contentPlayer && this._contentPlayer.paused) {
      this._rmpVast.rmpVastUtils.playPromise('content', firstContentPlayerPlayRequest);
    }
  }

  pause() {
    if (this._contentPlayer && !this._contentPlayer.paused) {
      this._contentPlayer.pause();
    }
  }

  seekTo(msSeek) {
    if (!FW.isNumber(msSeek)) {
      return;
    }
    if (msSeek >= 0 && this._contentPlayer) {
      this._contentPlayer.currentTime = msSeek / 1000;
    }
  }

  preventSeekingForCustomPlayback() {
    // after much poking it appears we cannot rely on seek events for iOS to 
    // set this up reliably - so interval it is
    if (this._contentPlayer) {
      this._antiSeekLogicInterval = setInterval(() => {
        if (this._rmpVast.creative.isLinear && this._rmpVast.__adOnStage) {
          const diff = Math.abs(this._customPlaybackCurrentTime - this._contentPlayer.currentTime);
          if (diff > 1) {
            this._contentPlayer.currentTime = this._customPlaybackCurrentTime;
          }
          this._customPlaybackCurrentTime = this._contentPlayer.currentTime;
        }
      }, 200);
    }
  }

}
