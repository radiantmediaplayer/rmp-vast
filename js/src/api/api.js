import FW from '../fw/fw';
import ENV from '../fw/env';
import VASTPLAYER from '../players/vast-player';
import CONTENTPLAYER from '../players/content-player';
import VPAID from '../players/vpaid';

const API = {};

API.attach = function(RmpVast) {

  RmpVast.prototype.play = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        VPAID.resumeAd.call(this);
      } else {
        VASTPLAYER.play.call(this);
      }
    } else {
      CONTENTPLAYER.play.call(this);
    }
  };
  
  RmpVast.prototype.pause = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        VPAID.pauseAd.call(this);
      } else {
        VASTPLAYER.pause.call(this);
      }
    } else {
      CONTENTPLAYER.pause.call(this);
    }
  }; 
  
  RmpVast.prototype.getAdPaused = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return VPAID.getAdPaused.call(this);
      } else {
        return this.vastPlayerPaused;
      }
    }
    return false;
  }; 
  
  RmpVast.prototype.setVolume = function (level) {
    if (!FW.isNumber(level)) {
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
        VPAID.setAdVolume.call(this, validatedLevel);
      }
      VASTPLAYER.setVolume.call(this, validatedLevel);
    }
    CONTENTPLAYER.setVolume.call(this, validatedLevel);
  };
  
  RmpVast.prototype.getVolume = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return VPAID.getAdVolume.call(this);
      } else {
        return VASTPLAYER.getVolume.call(this);
      }
    }
    return CONTENTPLAYER.getVolume.call(this);
  };
  
  RmpVast.prototype.setMute = function (muted) {
    if (typeof muted !== 'boolean') {
      return;
    }
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        if (muted) {
          VPAID.setAdVolume.call(this, 0);
        } else {
          VPAID.setAdVolume.call(this, 1);
        }
      } else {
        VASTPLAYER.setMute.call(this, muted);
      }
    }
    CONTENTPLAYER.setMute.call(this, muted);
  };
  
  RmpVast.prototype.getMute = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        if (VPAID.getAdVolume.call(this) === 0) {
          return true;
        }
        return false;
      } else {
        return VASTPLAYER.getMute.call(this);
      }
    }
    return CONTENTPLAYER.getMute.call(this);
  };
  
  RmpVast.prototype.stopAds = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        VPAID.stopAd.call(this);
      } else {
        // this will destroy ad
        VASTPLAYER.resumeContent.call(this);
      }
    }
  };
  
  RmpVast.prototype.getAdTagUrl = function () {
    return this.adTagUrl;
  };
  
  RmpVast.prototype.getAdMediaUrl = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return VPAID.getCreativeUrl.call(this);
      } else {
        return this.adMediaUrl;
      }
    }
    return null;
  };
  
  RmpVast.prototype.getAdLinear = function () {
    return this.adIsLinear;
  };
  
  RmpVast.prototype.getAdSystem = function () {
    return this.adSystem;
  };
  
  RmpVast.prototype.getAdContentType = function () {
    if (this.adOnStage) {
      if (this.adIsLinear || this.isVPAID) {
        return this.adContentType;
      } else {
        return this.nonLinearContentType;
      }
    }
    return '';
  };
  
  RmpVast.prototype.getAdTitle = function () {
    return this.adTitle;
  };
  
  RmpVast.prototype.getAdDescription = function () {
    return this.adDescription;
  };
  
  RmpVast.prototype.getAdDuration = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        let duration = VPAID.getAdDuration.call(this);
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
  
  RmpVast.prototype.getAdCurrentTime = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        const remainingTime = VPAID.getAdRemainingTime.call(this);
        const duration = VPAID.getAdDuration.call(this);
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
  
  RmpVast.prototype.getAdRemainingTime = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return VPAID.getAdRemainingTime.call(this);
      } else {
        const currentTime = VASTPLAYER.getCurrentTime.call(this);
        const duration = VASTPLAYER.getDuration.call(this);
        if (currentTime === -1 || duration === -1 || currentTime > duration) {
          return -1;
        }
        return (duration - currentTime) * 1000;
      }
    }
    return -1;
  };
  
  RmpVast.prototype.getAdOnStage = function () {
    return this.adOnStage;
  };
  
  RmpVast.prototype.getAdMediaWidth = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return VPAID.getAdWidth.call(this);
      } else if (this.adIsLinear) {
        return this.adMediaWidth;
      } else {
        return this.nonLinearCreativeWidth;
      }
    }
    return -1;
  };
  
  RmpVast.prototype.getAdMediaHeight = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return VPAID.getAdHeight.call(this);
      } else if (this.adIsLinear) {
        return this.adMediaHeight;
      } else {
        return this.nonLinearCreativeHeight;
      }
    }
    return -1;
  };
  
  RmpVast.prototype.getClickThroughUrl = function () {
    return this.clickThroughUrl;
  };
  
  RmpVast.prototype.getIsSkippableAd = function () {
    return this.isSkippableAd;
  };
  
  RmpVast.prototype.getContentPlayerCompleted = function () {
    return this.contentPlayerCompleted;
  };
   
  RmpVast.prototype.setContentPlayerCompleted = function (value) {
    if (typeof value === 'boolean') {
      this.contentPlayerCompleted = value;
    }
  };
  
  RmpVast.prototype.getAdErrorMessage = function () {
    return this.vastErrorMessage;
  };
  
  RmpVast.prototype.getAdVastErrorCode = function () {
    return this.vastErrorCode;
  };
  
  RmpVast.prototype.getAdErrorType = function () {
    return this.adErrorType;
  };
  
  RmpVast.prototype.getEnvironment = function () {
    return ENV;
  };
  
  RmpVast.prototype.getFramework = function () {
    return FW;
  };
  
  RmpVast.prototype.getVastPlayer = function () {
    return this.vastPlayer;
  };
  
  RmpVast.prototype.getContentPlayer = function () {
    return this.contentPlayer;
  };
  
  RmpVast.prototype.getVpaidCreative = function () {
    if (this.adOnStage && this.isVPAID) {
      return VPAID.getVpaidCreative.call(this);
    }
    return null;
  };
  
  RmpVast.prototype.getIsUsingContentPlayerForAds = function () {
    return this.useContentPlayerForAds;
  };
  
  RmpVast.prototype.initialize = function () {
    if (this.rmpVastInitialized) {
      if (DEBUG) {
        FW.log('rmp-vast already initialized');
      } 
    } else {
      if (DEBUG) {
        FW.log('on user interaction - player needs to be initialized');
      }
      VASTPLAYER.init.call(this);
    }
  };
  
  RmpVast.prototype.getInitialized = function () {
    return this.rmpVastInitialized;
  };
  
  // adpod 
  RmpVast.prototype.getAdPodInfo = function () {
    if (this.adPodApiInfo.length > 0) {
      const result = {};
      result.adPodCurrentIndex = this.adPodCurrentIndex;
      result.adPodLength = this.adPodApiInfo.length;
      return result;
    }
    return null;
  };
  
  // VPAID methods
  RmpVast.prototype.resizeAd = function (width, height, viewMode) {
    if (this.adOnStage && this.isVPAID) {
      VPAID.resizeAd.call(this, width, height, viewMode);
    }
  };
  
  RmpVast.prototype.expandAd = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.expandAd.call(this);
    }
  };
  
  RmpVast.prototype.collapseAd = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.collapseAd.call(this);
    }
  };
  
  RmpVast.prototype.skipAd = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.skipAd.call(this);
    }
  };
  
  RmpVast.prototype.getAdExpanded = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.getAdExpanded.call(this);
    }
    return false;
  };
  
  RmpVast.prototype.getAdSkippableState = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.getAdSkippableState.call(this);
    }
    return false;
  };
  
  RmpVast.prototype.getAdCompanions = function () {
    if (this.adOnStage && this.isVPAID) {
      VPAID.getAdCompanions.call(this);
    }
    return '';
  };
};

export default API;
