import { FW } from '../fw/fw';
import { FWVAST } from '../fw/fw-vast';
import { ENV } from '../fw/env';
import { VASTPLAYER } from '../players/vast-player';
import { CONTENTPLAYER } from '../players/content-player';

const API = {};

API.play = function () {
  if (!this.vastPlayerInitialized) {
    this.initialize();
    return;
  }
  if (this.adOnStage) {
    if (this.adIsLinear) {
      VASTPLAYER.play.call(this);
    } else {
      CONTENTPLAYER.play.call(this);
    }
  } else {
    CONTENTPLAYER.play.call(this);
  }
};

API.pause = function () {
  if (this.adOnStage) {
    if (this.adIsLinear) {
      VASTPLAYER.pause.call(this);
    } else {
      CONTENTPLAYER.pause.call(this);
    }
  } else {
    CONTENTPLAYER.pause.call(this);
  }
};

API.getAdPaused = function () {
  if (this.adOnStage && this.adIsLinear) {
    return this.vastPlayerPaused;
  }
  return null;
};

API.seekTo = function (msSeek) {
  if (this.adOnStage && this.adIsLinear) {
    // you cannot seek into a playing linear ad
    return;
  } else {
    CONTENTPLAYER.seekTo.call(this, msSeek);
  }
};

API.setVolume = function (level) {
  if (typeof level !== 'number') {
    return;
  }
  let validatedLevel = 0;
  if (level < 0) {
    validatedLevel = 0;
  } else if (level > 1) {
    validatedLevel = 1;
  } else {
    validatedLevel = level;
  }
  if (this.adOnStage) {
    if (this.adIsLinear) {
      VASTPLAYER.setVolume.call(this, level);
    }
    CONTENTPLAYER.setVolume.call(this, level);
  } else {
    CONTENTPLAYER.setVolume.call(this, level);
  }
};

API.getVolume = function () {
  if (this.adOnStage && this.adIsLinear) {
    return VASTPLAYER.getVolume.call(this);
  }
  return CONTENTPLAYER.getVolume.call(this);

};

API.setMute = function (muted) {
  if (typeof muted !== 'boolean') {
    return;
  }
  if (this.adOnStage) {
    if (this.adIsLinear) {
      VASTPLAYER.setMute.call(this, muted);
    }
    CONTENTPLAYER.setMute.call(this, muted);
  } else {
    CONTENTPLAYER.setMute.call(this, muted);
  }
};

API.getMute = function () {
  if (this.adOnStage && this.adIsLinear) {
    return VASTPLAYER.getMute.call(this);
  }
  return CONTENTPLAYER.getMute.call(this);
};

API.setFullscreen = function (fs) {
  if (typeof fs === 'boolean') {
    if (DEBUG) {
      FW.log('RMP-VAST: setFullscreen ' + fs);
    }
    if (this.isInFullscreen && !fs) {
      if (this.adOnStage && this.adIsLinear) {
        ENV.exitFullscreen(this.vastPlayer);
      } else {
        ENV.exitFullscreen(this.contentPlayer);
      }
    } else if (!this.isInFullscreen && fs) {
      if (this.adOnStage && this.adIsLinear) {
        ENV.requestFullscreen(this.container, this.vastPlayer);
      } else {
        ENV.requestFullscreen(this.container, this.contentPlayer);
      }
    }
  }
};

API.getFullscreen = function () {
  return this.isInFullscreen;
};

API.stopAds = function () {
  if (this.adOnStage) {
    this.readyForReset = true;
    // this will destroy ad
    VASTPLAYER.resumeContent.call(this);
  }
};

API.getAdTagUrl = function () {
  return this.adTagUrl;
};

API.getAdMediaUrl = function () {
  if (this.adOnStage) {
    if (this.adIsLinear) {
      return this.adMediaUrl;
    } else {
      return this.nonLinearCreativeUrl;
    }
  }
  return null;
};

API.getAdLinear = function () {
  return this.adIsLinear;
};

API.getAdSystem = function () {
  return this.adSystem;
};

API.getAdContentType = function () {
  if (this.adOnStage) {
    if (this.adIsLinear) {
      return this.adContentType;
    } else {
      return this.nonLinearContentType;
    }
  }
  return null;
};

API.getAdTitle = function () {
  return this.adTitle;
};

API.getAdDescription = function () {
  return this.adDescription;
};

API.getAdDuration = function () {
  if (this.adOnStage && this.adIsLinear) {
    return VASTPLAYER.getDuration.call(this);
  }
  return null;
};

API.getAdCurrentTime = function () {
  if (this.adOnStage && this.adIsLinear) {
    return VASTPLAYER.getCurrentTime.call(this);
  }
  return null;
};

API.getAdOnStage = function () {
  return this.adOnStage;
};

API.getAdMediaWidth = function () {
  if (this.adOnStage) {
    if (this.adIsLinear) {
      return this.adMediaWidth;
    } else {
      return this.nonLinearCreativeWidth;
    }
  }
  return null;
};

API.getAdMediaHeight = function () {
  if (this.adOnStage) {
    if (this.adIsLinear) {
      return this.adMediaHeight;
    } else {
      return this.nonLinearCreativeHeight;
    }
  }
  return null;
};

API.getClickThroughUrl = function () {
  return this.clickThroughUrl;
};

API.createEvent = function (event) {
  // adloaded, addurationchange, adclick, adimpression, adstarted, adtagloaded, adtagstartloading, adpaused, adresumed 
  // advolumemuted, advolumechanged, adcomplete, adskipped, adskippablestatechanged
  // adfirstquartile, admidpoint, adthirdquartile, aderror, adfollowingredirect, addestroyed
  if (typeof event === 'string' && event !== '' && this.container) {
    FW.createStdEvent(event, this.container);
  }
};

API.getAdErrorMessage = function () {
  return this.vastErrorMessage;
};

API.getAdVastErrorCode = function () {
  return this.vastErrorCode;
};

API.getEnv = function () {
  return ENV;
};

API.getFW = function () {
  return FW;
};

API.getFWVAST = function () {
  return FWVAST;
};

API.getVastPlayer = function () {
  return this.vastPlayer;
};

API.getContentPlayer = function () {
  return this.contentPlayer;
};

API.getIsUsingContentPlayerForAds = function () {
  return this.useContentPlayerForAds;
};

API.initialize = function () {
  if (!this.vastPlayerInitialized) {
    if (DEBUG) {
      FWVAST.logPerformance('RMP-VAST: on user interaction - player needs to be initialized');
    }
    VASTPLAYER.init.call(this);
    FW.playPromise(this.contentPlayer);
    this.contentPlayer.pause();
  }
};

export { API };