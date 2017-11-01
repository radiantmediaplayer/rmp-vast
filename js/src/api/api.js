import { FW } from '../fw/fw';
import { FWVAST } from '../fw/fw-vast';
import { ENV } from '../fw/env';
import { VASTPLAYER } from '../players/vast-player';
import { CONTENTPLAYER } from '../players/content-player';
import { VPAID } from '../players/vpaid';

const API = {};

API.play = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      VPAID.resumeAd();
    } else {
      VASTPLAYER.play.call(this);
    }
  } else {
    CONTENTPLAYER.play.call(this);
  }
};

API.pause = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      VPAID.pauseAd();
    } else {
      VASTPLAYER.pause.call(this);
    }
  } else {
    CONTENTPLAYER.pause.call(this);
  }
};

API.getAdPaused = function () { 
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      return VPAID.getAdPaused();
    } else {
      return this.vastPlayerPaused;
    }
  }
  return null;
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
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      VPAID.setAdVolume(level);
    } else {
      VASTPLAYER.setVolume.call(this, level);
    }
  }
  CONTENTPLAYER.setVolume.call(this, level);
};

API.getVolume = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      return VPAID.getAdVolume();
    } else {
      return VASTPLAYER.getVolume.call(this);
    }
  }
  return CONTENTPLAYER.getVolume.call(this);

};

API.setMute = function (muted) {
  if (typeof muted !== 'boolean') {
    return;
  }
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      if (muted) {
        VPAID.setAdVolume(0);
      } else {
        VPAID.setAdVolume(1);
      }
    } else {
      VASTPLAYER.setMute.call(this, muted);
    }
  }
  CONTENTPLAYER.setMute.call(this, muted);
};

API.getMute = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      if (VPAID.getAdVolume() === 0) {
        return true;
      }
      return false;
    } else {
      return VASTPLAYER.getMute.call(this);
    }
  }
  return CONTENTPLAYER.getMute.call(this);
};

API.stopAds = function () {
  if (this.adOnStage) {
    if (this.isVPAID) {
      VPAID.stopAd();
    } else {
      // this will destroy ad
      VASTPLAYER.resumeContent.call(this);
    }
  }
};

API.getAdTagUrl = function () {
  return this.adTagUrl;
};

API.getAdMediaUrl = function () {
  if (this.adOnStage) {
    if (this.isVPAID) {
      return VPAID.getCreativeUrl();
    } else if (this.adIsLinear) {
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
    if (this.adIsLinear || this.isVPAID) {
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
    if (this.isVPAID) {
      let duration = VPAID.getAdDuration();
      if (duration > 0) {
        duration = duration * 1000;
      }
      return duration;
    } else {
      return VASTPLAYER.getDuration.call(this);
    }
  }
  return -1;
};

API.getAdCurrentTime = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      let remainingTime = VPAID.getAdRemainingTime();
      let duration = VPAID.getAdDuration();
      if (remainingTime === -1 || duration === -1 || remainingTime > duration) {
        return -1;
      }
      return (duration - remainingTime) * 1000;
    } else {
      return VASTPLAYER.getCurrentTime.call(this);
    }
  }
  return -1;
};

API.getAdRemainingTime = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      return VPAID.getAdRemainingTime();
    } else {
      let currentTime = VASTPLAYER.getCurrentTime.call(this);
      let duration = VASTPLAYER.getDuration.call(this);
      if (currentTime === -1 || duration === -1 || currentTime > duration) {
        return -1;
      }
      return (duration - currentTime) * 1000;
    }
  }
  return -1;
};

API.getAdOnStage = function () {
  return this.adOnStage;
};

API.getAdMediaWidth = function () {
  if (this.adOnStage) {
    if (this.isVPAID) {
      return VPAID.getAdWidth();
    } else if (this.adIsLinear) {
      return this.adMediaWidth;
    } else {
      return this.nonLinearCreativeWidth;
    }
  }
  return null;
};

API.getAdMediaHeight = function () {
  if (this.adOnStage) {
    if (this.isVPAID) {
      return VPAID.getAdHeight();
    } else if (this.adIsLinear) {
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
  // adloaded, addurationchange, adclick, adimpression, adstarted, 
  // adtagloaded, adtagstartloading, adpaused, adresumed 
  // advolumemuted, advolumechanged, adcomplete, adskipped, 
  // adskippablestatechanged, adclosed
  // adfirstquartile, admidpoint, adthirdquartile, aderror, 
  // adfollowingredirect, addestroyed
  // adlinearchange, adexpandedchange, adremainingtimechange 
  // adinteraction, adsizechange
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

API.getVastPlayer = function () {
  return this.vastPlayer;
};

API.getContentPlayer = function () {
  return this.contentPlayer;
};

API.getVpaidCreative = function () {
  if (this.adOnStage && this.isVPAID) {
    return VPAID.getVpaidCreative();
  }
  return null;
};

API.getIsUsingContentPlayerForAds = function () {
  return this.useContentPlayerForAds;
};

API.initialize = function () {
  if (this.rmpVastInitialized) {
    if (DEBUG) {
      FW.log('RMP-VAST: rmp-vast already initialized');
    }
  } else {
    if (DEBUG) {
      FWVAST.logPerformance('RMP-VAST: on user interaction - player needs to be initialized');
    }
    VASTPLAYER.init.call(this);
  }
};

API.getInitialized = function () {
  return this.rmpVastInitialized;
};

// VPAID methods
API.resizeAd = function (width, height, viewMode) {
  if (this.adOnStage && this.isVPAID) {
    VPAID.resizeAd(width, height, viewMode);
  }
};

API.expandAd = function () {
  if (this.adOnStage && this.isVPAID) {
    VPAID.expandAd();
  }
};

API.collapseAd = function () {
  if (this.adOnStage && this.isVPAID) {
    VPAID.collapseAd();
  }
};

API.skipAd = function () {
  if (this.adOnStage && this.isVPAID) {
    VPAID.skipAd();
  }
};

API.getAdExpanded = function () {
  if (this.adOnStage && this.isVPAID) {
    VPAID.getAdExpanded();
  }
  return null;
};

API.getAdSkippableState = function () {
  if (this.adOnStage && this.isVPAID) {
    VPAID.getAdSkippableState();
  }
  return null;
};

API.getAdCompanions = function () {
  if (this.adOnStage && this.isVPAID) {
    VPAID.getAdCompanions();
  }
  return null;
};

export { API };