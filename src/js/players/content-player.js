import FW from '../framework/fw';


export default class ContentPlayer {

  #rmpVast;
  #contentPlayer;
  #customPlaybackCurrentTime = 0;
  #antiSeekLogicInterval = null;

  constructor(rmpVast) {
    this.#rmpVast = rmpVast;
    this.#contentPlayer = rmpVast.currentContentPlayer;
  }

  set volume(level) {
    if (this.#contentPlayer) {
      this.#contentPlayer.volume = level;
    }
  }

  get volume() {
    if (this.#contentPlayer) {
      return this.#contentPlayer.volume;
    }
    return -1;
  }

  get muted() {
    if (this.#contentPlayer) {
      return this.#contentPlayer.muted;
    }
    return false;
  }

  set muted(muted) {
    if (this.#contentPlayer) {
      if (muted && !this.#contentPlayer.muted) {
        this.#contentPlayer.muted = true;
      } else if (!muted && this.#contentPlayer.muted) {
        this.#contentPlayer.muted = false;
      }
    }
  }

  get currentTime() {
    if (this.#contentPlayer && FW.isNumber(this.#contentPlayer.currentTime)) {
      return this.#contentPlayer.currentTime * 1000;
    }
    return -1;
  }

  destroy() {
    window.clearInterval(this.#antiSeekLogicInterval);
  }

  play(firstContentPlayerPlayRequest) {
    if (this.#contentPlayer && this.#contentPlayer.paused) {
      this.#rmpVast.rmpVastUtils.playPromise('content', firstContentPlayerPlayRequest);
    }
  }

  pause() {
    if (this.#contentPlayer && !this.#contentPlayer.paused) {
      this.#contentPlayer.pause();
    }
  }

  seekTo(msSeek) {
    if (!FW.isNumber(msSeek)) {
      return;
    }
    if (msSeek >= 0 && this.#contentPlayer) {
      this.#contentPlayer.currentTime = msSeek / 1000;
    }
  }

  preventSeekingForCustomPlayback() {
    // after much poking it appears we cannot rely on seek events for iOS to 
    // set this up reliably - so interval it is
    if (this.#contentPlayer) {
      this.#antiSeekLogicInterval = window.setInterval(() => {
        if (this.#rmpVast.creative.isLinear && this.#rmpVast.__adOnStage) {
          const diff = Math.abs(this.#customPlaybackCurrentTime - this.#contentPlayer.currentTime);
          if (diff > 1) {
            this.#contentPlayer.currentTime = this.#customPlaybackCurrentTime;
          }
          this.#customPlaybackCurrentTime = this.#contentPlayer.currentTime;
        }
      }, 200);
    }
  }

}
