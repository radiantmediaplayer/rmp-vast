import { FW } from '../fw/fw';
import { ENV } from '../fw/env';
import { PING } from '../tracking/ping';
import { VASTPLAYER } from '../players/vast-player';
import { CONTENTPLAYER } from '../players/content-player';
import { API } from '../api/api';
import { VASTERRORS } from '../utils/vast-errors';

const NONLINEAR = {};

var _onNonLinearLoadError = function () {
  PING.error.call(this, 502);
  VASTERRORS.process.call(this, 502);
};

var _onNonLinearLoadSuccess = function () {
  if (DEBUG) {
    FW.log('success loading non-linear creative at ' + this.adMediaUrl);
  }
  this.adOnStage = true;
  API.createEvent.call(this, 'adloaded');
  API.createEvent.call(this, 'adimpression');
  API.createEvent.call(this, 'adstarted');
  FW.dispatchPingEvent.call(this, ['impression', 'creativeView', 'start']);
};

var _onNonLinearClickThrough = function (event) {
  try {
    if (event) {
      event.stopPropagation();
    }
    if (this.params.pauseOnClick) {
      this.pause();
    }
    API.createEvent.call(this, 'adclick');
    FW.dispatchPingEvent.call(this, 'clickthrough');
  } catch (e) {
    FW.trace(e);
  }
};

var _onClickCloseNonLinear = function (event) {
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  this.nonLinearContainer.style.display = 'none';
  API.createEvent.call(this, 'adclosed');
  FW.dispatchPingEvent.call(this, 'close');
};

var _appendCloseButton = function () {
  this.nonLinearClose = document.createElement('div');
  this.nonLinearClose.className = 'rmp-ad-non-linear-close';
  if (this.nonLinearMinSuggestedDuration > 0) {
    this.nonLinearClose.style.display = 'none';
    setTimeout(() => {
      if (this.nonLinearClose) {
        this.nonLinearClose.style.display = 'block';
      }
    }, this.nonLinearMinSuggestedDuration * 1000);
  } else {
    this.nonLinearClose.style.display = 'block';
  }
  this.onClickCloseNonLinear = _onClickCloseNonLinear.bind(this);
  this.nonLinearClose.addEventListener('touchend', this.onClickCloseNonLinear);
  this.nonLinearClose.addEventListener('click', this.onClickCloseNonLinear);
  this.nonLinearContainer.appendChild(this.nonLinearClose);
};

NONLINEAR.update = function () {
  if (DEBUG) {
    FW.log('appending non-linear creative to .rmp-ad-container element');
  }

  // non-linear ad container
  this.nonLinearContainer = document.createElement('div');
  this.nonLinearContainer.className = 'rmp-ad-non-linear-container';
  this.nonLinearContainer.style.width = (this.nonLinearCreativeWidth).toString() + 'px';
  this.nonLinearContainer.style.height = (this.nonLinearCreativeHeight).toString() + 'px';

  // a tag to handle click - a tag is best for WebView support
  this.nonLinearATag = document.createElement('a');
  this.nonLinearATag.className = 'rmp-ad-non-linear-anchor';
  if (this.clickThroughUrl) {
    this.nonLinearATag.href = this.clickThroughUrl;
    this.nonLinearATag.target = '_blank';
    this.onNonLinearClickThrough = _onNonLinearClickThrough.bind(this);
    if (ENV.isMobile) {
      this.nonLinearATag.addEventListener('touchend', this.onNonLinearClickThrough);
    } else {
      this.nonLinearATag.addEventListener('click', this.onNonLinearClickThrough);
    }
  }

  // non-linear creative image
  this.nonLinearImg = document.createElement('img');
  this.nonLinearImg.className = 'rmp-ad-non-linear-img';
  this.onNonLinearLoadError = _onNonLinearLoadError.bind(this);
  this.nonLinearImg.addEventListener('error', this.onNonLinearLoadError);
  this.onNonLinearLoadSuccess = _onNonLinearLoadSuccess.bind(this);
  this.nonLinearImg.addEventListener('load', this.onNonLinearLoadSuccess);
  this.nonLinearImg.src = this.adMediaUrl;

  // append to adContainer
  this.nonLinearATag.appendChild(this.nonLinearImg);
  this.nonLinearContainer.appendChild(this.nonLinearATag);
  this.adContainer.appendChild(this.nonLinearContainer);

  // display a close button when non-linear ad has reached minSuggestedDuration
  _appendCloseButton.call(this);

  FW.show(this.adContainer);
  CONTENTPLAYER.play.call(this, this.firstContentPlayerPlayRequest);
  if (this.firstContentPlayerPlayRequest) {
    this.firstContentPlayerPlayRequest = false;
  }
};

NONLINEAR.parse = function (nonLinearAds) {
  if (DEBUG) {
    FW.log('start parsing NonLinearAds');
  }
  this.adIsLinear = false;

  let nonLinear = nonLinearAds[0].getElementsByTagName('NonLinear');
  // at least 1 NonLinear is expected to continue
  // but according to spec this should not trigger an error
  // 2.3.4 One or more <NonLinear> ads may be included within a <NonLinearAds> element.
  if (nonLinear.length === 0) {
    return;
  }
  let currentNonLinear;
  let adMediaUrl = '';
  let isDimensionError = false;
  // The video player should poll each <NonLinear> element to determine 
  // which creative is offered in a format the video player can support.
  for (let i = 0, len = nonLinear.length; i < len; i++) {
    isDimensionError = false;
    currentNonLinear = nonLinear[i];
    let width = currentNonLinear.getAttribute('width');
    // width attribute is required
    if (width === null || width === '') {
      PING.error.call(this, 101);
      VASTERRORS.process.call(this, 101);
      continue;
    }
    let height = currentNonLinear.getAttribute('height');
    // height attribute is also required
    if (height === null || height === '') {
      PING.error.call(this, 101);
      VASTERRORS.process.call(this, 101);
      continue;
    }
    width = parseInt(width);
    height = parseInt(height);
    if (width <= 0 || height <= 0) {
      continue;
    }
    // get minSuggestedDuration (optional)
    let minSuggestedDuration = currentNonLinear.getAttribute('minSuggestedDuration');
    if (minSuggestedDuration !== null && minSuggestedDuration !== '' && FW.isValidDuration(minSuggestedDuration)) {
      this.nonLinearMinSuggestedDuration = FW.convertDurationToSeconds(minSuggestedDuration);
    }
    let staticResource = currentNonLinear.getElementsByTagName('StaticResource');
    // we expect at least one StaticResource tag
    // we do not support IFrameResource or HTMLResource
    if (staticResource.length === 0) {
      continue;
    }
    let creativeType;
    for (let i = 0, len = staticResource.length; i < len; i++) {
      let currentStaticResource = staticResource[i];
      creativeType = currentStaticResource.getAttribute('creativeType');
      if (creativeType === null || creativeType === '') {
        continue;
      }
      // we only support images for StaticResource
      let imagePattern = /^image\/(png|jpeg|jpg|gif)$/i;
      if (!imagePattern.test(creativeType)) {
        continue;
      }
      // if width of non-linear creative does not fit within current player container width 
      // we should skip this creative
      if (width > FW.getWidth(this.container)) {
        isDimensionError = true;
        continue;
      }
      adMediaUrl = FW.getNodeValue(currentStaticResource, true);
      break;
    }
    // we have a valid NonLinear/StaticResource with supported creativeType - we break
    if (adMediaUrl !== '') {
      this.adMediaUrl = adMediaUrl;
      this.nonLinearCreativeWidth = width;
      this.nonLinearCreativeHeight = height;
      this.nonLinearContentType = creativeType;
      break;
    }
  }
  // if not supported NonLinear type ping for error
  if (!this.adMediaUrl || !currentNonLinear) {
    let vastErrorCode = 503;
    if (isDimensionError) {
      vastErrorCode = 501;
    }
    PING.error.call(this, vastErrorCode);
    VASTERRORS.process.call(this, vastErrorCode);
    return;
  }
  let nonLinearClickThrough = currentNonLinear.getElementsByTagName('NonLinearClickThrough');
  // if NonLinearClickThrough is present we expect one tag
  if (nonLinearClickThrough.length > 0) {
    this.clickThroughUrl = FW.getNodeValue(nonLinearClickThrough[0], true);
    let nonLinearClickTracking = nonLinear[0].getElementsByTagName('NonLinearClickTracking');
    if (nonLinearClickTracking.length > 0) {
      for (let i = 0, len = nonLinearClickTracking.length; i < len; i++) {
        let nonLinearClickTrackingUrl = FW.getNodeValue(nonLinearClickTracking[i], true);
        if (nonLinearClickTrackingUrl !== null) {
          this.trackingTags.push({ event: 'clickthrough', url: nonLinearClickTrackingUrl });
        }
      }
    }
  }
  VASTPLAYER.append.call(this);

};

export { NONLINEAR };