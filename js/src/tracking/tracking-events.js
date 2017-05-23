import { FW } from '../fw/fw';
import { FWVAST } from '../fw/fw-vast';
import { ENV } from '../fw/env';
import { PING } from './ping';
import { API } from '../api/api';
import { VASTPLAYER } from '../players/vast-player';

const TRACKINGEVENTS = {};

var _pingTrackers = function (trackers) {
  trackers.forEach((element) => {
    PING.tracking.call(this, element.url, this.adMediaUrl);
  });
};

TRACKINGEVENTS.updateResetStatus = function () {
  // in case a pause event is due to be ping - cancel it now (see above)
  clearTimeout(this.adPauseEventTimeout);
  this.readyForReset = true;
  FWVAST.dispatchPingEvent.call(this, 'reset');
};

var _onEventPingTracking = function (event) {
  if (event && event.type) {
    if (DEBUG) {
      FW.log('RMP-VAST: ping tracking for ' + event.type + ' VAST event');
    }
    // filter trackers - may return multiple urls for same event as allowed by VAST spec
    let trackers = this.trackingTags.filter((value) => {
      return event.type === value.event;
    });
    // send ping for each valid tracker
    if (trackers.length > 0) {
      // we need to filter pause event - because it can fire just before HTML5 video ended event 
      // and according to VAST spec we should not ping for this pause event - only for user initiated pause
      if (this.vastPlayer && event.type === 'pause') {
        clearTimeout(this.adPauseEventTimeout);
        this.adPauseEventTimeout = setTimeout(() => {
          _pingTrackers.call(this, trackers);
        }, 200);
      } else {
        _pingTrackers.call(this, trackers);
      }
    }
    // we need to tell the player it is ok to destroy as all pings have been sent
    if (this.vastPlayer && (event.type === 'complete' || event.type === 'skip')) {
      // in case a pause event is due to be ping - cancel it now (see above)
      TRACKINGEVENTS.updateResetStatus.call(this);
    }
  }
};

var _onVolumeChange = function () {
  if (this.vastPlayer.muted || this.vastPlayer.volume === 0) {
    API.createEvent.call(this, 'advolumemuted');
    FWVAST.dispatchPingEvent.call(this, 'mute');
    this.vastPlayerMuted = true;
  } else {
    if (this.vastPlayerMuted) {
      FWVAST.dispatchPingEvent.call(this, 'unmute');
      this.vastPlayerMuted = false;
    }
  }
  API.createEvent.call(this, 'advolumechanged');
};

var _onTimeupdate = function () {
  this.vastPlayerCurrentTime = VASTPLAYER.getCurrentTime.call(this);
  if (this.vastPlayerCurrentTime > 0) {
    if (this.vastPlayerDuration > 0 && this.vastPlayerDuration > this.vastPlayerCurrentTime) {
      if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.25 && !this.firstQuartileEventFired) {
        this.firstQuartileEventFired = true;
        API.createEvent.call(this, 'adfirstquartile');
        FWVAST.dispatchPingEvent.call(this, 'firstQuartile');
      } else if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.5 && !this.midpointEventFired) {
        this.midpointEventFired = true;
        API.createEvent.call(this, 'admidpoint');
        FWVAST.dispatchPingEvent.call(this, 'midpoint');
      } else if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.75 && !this.thirdQuartileEventFired) {
        this.thirdQuartileEventFired = true;
        API.createEvent.call(this, 'adthirdquartile');
        FWVAST.dispatchPingEvent.call(this, 'thirdQuartile');
      }
    }
    if (this.isSkippableAd) {
      // progress event for skippable ads
      if (this.progressEventOffsetsSeconds === null) {
        this.progressEventOffsetsSeconds = [];
        this.progressEventOffsets.forEach((element) => {
          this.progressEventOffsetsSeconds.push({
            offsetSeconds: FWVAST.convertOffsetToSeconds(element, this.vastPlayerDuration),
            offsetRaw: element
          });
        });
        this.progressEventOffsetsSeconds.sort((a, b) => {
          return a.offsetSeconds - b.offsetSeconds;
        });
      }
      if (Array.isArray(this.progressEventOffsetsSeconds) && this.progressEventOffsetsSeconds.length > 0 &&
        this.vastPlayerCurrentTime >= this.progressEventOffsetsSeconds[0].offsetSeconds * 1000) {
        FWVAST.dispatchPingEvent.call(this, 'progress-' + this.progressEventOffsetsSeconds[0].offsetRaw);
        this.progressEventOffsetsSeconds.shift();
      }
    }
  }
};

var _onPause = function () {
  if (!this.vastPlayerPaused) {
    this.vastPlayerPaused = true;
    API.createEvent.call(this, 'adpaused');
    // do not dispatchPingEvent for pause event here if it is already in this.trackingTags
    for (let i = 0, len = this.trackingTags.length; i < len; i++) {
      if (this.trackingTags[i].event === 'pause') {
        return;
      }
    }
    FWVAST.dispatchPingEvent.call(this, 'pause');
  }
};

var _onPlay = function () {
  if (this.vastPlayerPaused) {
    this.vastPlayerPaused = false;
    API.createEvent.call(this, 'adresumed');
    FWVAST.dispatchPingEvent.call(this, 'resume');
  }
};

var _onPlaying = function () {
  this.vastPlayer.removeEventListener('playing', this.onPlaying);
  API.createEvent.call(this, 'adimpression');
  API.createEvent.call(this, 'adstarted');
  FWVAST.dispatchPingEvent.call(this, ['impression', 'creativeView', 'start']);
};

var _onEnded = function () {
  this.vastPlayer.removeEventListener('ended', this.onEnded);
  API.createEvent.call(this, 'adcomplete');
  FWVAST.dispatchPingEvent.call(this, 'complete');
};

var _onFullscreenchange = function (event) {
  if (event && event.type) {
    if (DEBUG) {
      FW.log('RMP-VAST: event is ' + event.type + ' isInFullscreen before changes is ' + this.isInFullscreen);
    }
    if (event.type === 'fullscreenchange') {
      if (this.isInFullscreen) {
        this.isInFullscreen = false;
        FW.removeClass(this.container, 'rmp-fullscreen-on');
        if (this.adOnStage && this.adIsLinear) {
          FWVAST.dispatchPingEvent.call(this, 'exitFullscreen');
        }
      } else {
        this.isInFullscreen = true;
        FW.addClass(this.container, 'rmp-fullscreen-on');
        if (this.adOnStage && this.adIsLinear) {
          FWVAST.dispatchPingEvent.call(this, 'fullscreen');
        }
      }
    } else if (event.type === 'webkitbeginfullscreen') {
      this.isInFullscreen = true;
      if (this.adOnStage && this.adIsLinear) {
        FWVAST.dispatchPingEvent.call(this, 'fullscreen');
      }
    } else if (event.type === 'webkitendfullscreen') {
      this.isInFullscreen = false;
      if (this.adOnStage && this.adIsLinear) {
        FWVAST.dispatchPingEvent.call(this, 'exitFullscreen');
      }
    }
  }
};

TRACKINGEVENTS.wire = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: wire tracking events');
  }

  // we filter through all HTML5 video events and create new VAST events 
  // those VAST events are based on PING.events
  if (this.vastPlayer) {
    this.onPause = _onPause.bind(this);
    this.vastPlayer.addEventListener('pause', this.onPause);
    this.onPlay = _onPlay.bind(this);
    this.vastPlayer.addEventListener('play', this.onPlay);

    this.onPlaying = _onPlaying.bind(this);
    this.vastPlayer.addEventListener('playing', this.onPlaying);

    this.onEnded = _onEnded.bind(this);
    this.vastPlayer.addEventListener('ended', this.onEnded);

    this.onVolumeChange = _onVolumeChange.bind(this);
    this.vastPlayer.addEventListener('volumechange', this.onVolumeChange);

    this.onTimeupdate = _onTimeupdate.bind(this);
    this.vastPlayer.addEventListener('timeupdate', this.onTimeupdate);

    //if we have native fullscreen support we handle fullscreen events
    if (ENV.hasNativeFullscreenSupport) {
      this.onFullscreenchange = _onFullscreenchange.bind(this);
      document.addEventListener('fullscreenchange', this.onFullscreenchange);
      // for our beloved iOS 
      if (this.useContentPlayerForAds) {
        this.vastPlayer.addEventListener('webkitbeginfullscreen', this.onFullscreenchange);
        this.vastPlayer.addEventListener('webkitendfullscreen', this.onFullscreenchange);
      }
    }
  }

  // wire for VAST tracking events
  this.onEventPingTracking = _onEventPingTracking.bind(this);
  if (DEBUG) {
    FW.log('RMP-VAST: detected VAST events follow');
    FW.log(this.trackingTags);
  }
  for (let i = 0, len = this.trackingTags.length; i < len; i++) {
    if (this.vastPlayer && this.adIsLinear) {
      this.vastPlayer.addEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    } else if (this.nonLinearCreative && !this.adIsLinear) {
      // non linear
      this.nonLinearCreative.addEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    }
  }

};

TRACKINGEVENTS.filter = function (trackingEvents) {
  let trackingTags = trackingEvents[0].getElementsByTagName('Tracking');
  // collect supported tracking events with valid event names and tracking urls
  for (let i = 0, len = trackingTags.length; i < len; i++) {
    let event = trackingTags[i].getAttribute('event');
    let url = FWVAST.getNodeValue(trackingTags[i], true);
    if (event !== null && event !== '' && PING.events.indexOf(event) > -1 && url !== null) {
      if (this.isSkippableAd) {
        if (event === 'progress') {
          let offset = trackingTags[i].getAttribute('offset');
          if (offset === null || offset === '' || !FWVAST.isValidOffset(offset)) {
            // offset attribute is required on Tracking event="progress"
            continue;
          }
          this.progressEventOffsets.push(offset);
          event = event + '-' + offset;
        } else if (event === 'skip') {
          // we make sure we have a skip event - this is expected for skippable ads
          // but in case it is not there we still need to properly resume content
          this.hasSkipEvent = true;
        }
      }
      this.trackingTags.push({ event: event, url: url });
    }
  }
};

export { TRACKINGEVENTS };