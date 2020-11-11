import FW from '../fw/fw';
import ENV from '../fw/env';
import HELPERS from '../utils/helpers';
import VAST_PLAYER from '../players/vast-player';
import CONTENT_PLAYER from '../players/content-player';
import VAST_ERRORS from '../utils/vast-errors';
import TRACKING_EVENTS from '../tracking/tracking-events';

const NON_LINEAR = {};

const _onNonLinearLoadError = function () {
  VAST_ERRORS.process.call(this, 502, true);
};

const _onNonLinearLoadSuccess = function () {
  if (this.debug) {
    FW.log('success loading non-linear creative at ' + this.creative.mediaUrl);
  }
  this.adOnStage = true;
  HELPERS.createApiEvent.call(this, ['adloaded', 'adimpression', 'adstarted']);
  TRACKING_EVENTS.dispatch.call(this, ['impression', 'creativeView', 'start', 'loaded']);
};

const _onNonLinearClickThrough = function (event) {
  try {
    if (event) {
      event.stopPropagation();
    }
    if (this.params.pauseOnClick) {
      this.pause();
    }
    HELPERS.createApiEvent.call(this, 'adclick');
    TRACKING_EVENTS.dispatch.call(this, 'clickthrough');
  } catch (e) {
    FW.trace(e);
  }
};

const _onClickCloseNonLinear = function (event) {
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  FW.setStyle(this.nonLinearContainer, { display: 'none' });
  HELPERS.createApiEvent.call(this, 'adclosed');
  TRACKING_EVENTS.dispatch.call(this, 'close');
};

const _appendCloseButton = function () {
  this.nonLinearClose = document.createElement('div');
  this.nonLinearClose.className = 'rmp-ad-non-linear-close';
  HELPERS.accessibleButton(this.nonLinearClose, this.params.labels.closeAd);
  if (this.nonLinearMinSuggestedDuration > 0) {
    FW.setStyle(this.nonLinearClose, { display: 'none' });
    setTimeout(() => {
      FW.setStyle(this.nonLinearClose, { display: 'block' });
    }, this.nonLinearMinSuggestedDuration * 1000);
  } else {
    FW.setStyle(this.nonLinearClose, { display: 'block' });
  }
  this.onClickCloseNonLinear = _onClickCloseNonLinear.bind(this);
  this.nonLinearClose.addEventListener('touchend', this.onClickCloseNonLinear);
  this.nonLinearClose.addEventListener('click', this.onClickCloseNonLinear);
  this.nonLinearContainer.appendChild(this.nonLinearClose);
};

NON_LINEAR.update = function () {
  // non-linear ad container
  this.nonLinearContainer = document.createElement('div');
  this.nonLinearContainer.className = 'rmp-ad-non-linear-container';
  FW.setStyle(this.nonLinearContainer, {
    width: (this.creative.width).toString() + 'px',
    height: (this.creative.height).toString() + 'px'
  });
  // a tag to handle click - a tag is best for WebView support
  this.nonLinearATag = document.createElement('a');
  this.nonLinearATag.className = 'rmp-ad-non-linear-anchor';
  if (this.creative.clickThroughUrl) {
    this.nonLinearATag.href = this.creative.clickThroughUrl;
    this.nonLinearATag.target = '_blank';
    this.onNonLinearClickThrough = _onNonLinearClickThrough.bind(this);
    if (ENV.isMobile) {
      this.nonLinearATag.addEventListener('touchend', this.onNonLinearClickThrough);
    } else {
      this.nonLinearATag.addEventListener('click', this.onNonLinearClickThrough);
    }
  }
  // non-linear creative image
  if (this.creative.nonLinearType === 'image') {
    this.nonLinearInnerElement = document.createElement('img');
  } else {
    this.nonLinearInnerElement = document.createElement('iframe');
    FW.setStyle(
      this.nonLinearInnerElement,
      {
        border: 'none',
        overflow: 'hidden'
      }
    );
    this.nonLinearInnerElement.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media');
    this.nonLinearInnerElement.setAttribute('scrolling', 'no');
    this.nonLinearInnerElement.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
  }
  this.nonLinearInnerElement.className = 'rmp-ad-non-linear-creative';
  this.onNonLinearLoadError = _onNonLinearLoadError.bind(this);
  this.nonLinearInnerElement.addEventListener('error', this.onNonLinearLoadError);
  this.onNonLinearLoadSuccess = _onNonLinearLoadSuccess.bind(this);
  this.nonLinearInnerElement.addEventListener('load', this.onNonLinearLoadSuccess);
  if (this.creative.nonLinearType === 'html') {
    this.nonLinearInnerElement.srcdoc = this.creative.mediaUrl;
  } else {
    this.nonLinearInnerElement.src = this.creative.mediaUrl;
  }
  // append to adContainer
  this.nonLinearATag.appendChild(this.nonLinearInnerElement);
  this.nonLinearContainer.appendChild(this.nonLinearATag);
  this.adContainer.appendChild(this.nonLinearContainer);
  // display a close button when non-linear ad has reached minSuggestedDuration
  _appendCloseButton.call(this);
  FW.show(this.adContainer);
  CONTENT_PLAYER.play.call(this, this.firstContentPlayerPlayRequest);
  if (this.firstContentPlayerPlayRequest) {
    this.firstContentPlayerPlayRequest = false;
  }
};

NON_LINEAR.parse = function (variations) {
  if (this.debug) {
    FW.log('non-linear creatives follow', variations);
  }
  let isDimensionError = false;
  let currentVariation;
  // The video player should poll each <NonLinear> element to determine 
  // which creative is offered in a format the video player can support.
  for (let i = 0, len = variations.length; i < len; i++) {
    isDimensionError = false;
    currentVariation = variations[i];
    let width = currentVariation.width;
    let height = currentVariation.height;
    // width/height attribute is required
    if (width <= 0) {
      width = 300;
    }
    if (height <= 0) {
      height = 44;
    }
    // if width of non-linear creative does not fit within current player container width 
    // we should skip this creative
    if (width > FW.getWidth(this.container) || height > FW.getHeight(this.container)) {
      isDimensionError = true;
      continue;
    }
    // get minSuggestedDuration (optional)
    this.nonLinearMinSuggestedDuration = currentVariation.minSuggestedDuration;
    const staticResource = currentVariation.staticResource;
    const iframeResource = currentVariation.iframeResource;
    const htmlResource = currentVariation.htmlResource;
    // we have a valid NonLinear/StaticResource with supported creativeType - we break
    if (staticResource !== null || iframeResource !== null || htmlResource !== null) {
      if (staticResource) {
        this.creative.mediaUrl = staticResource;
        this.creative.nonLinearType = 'image';
      } else if (iframeResource) {
        this.creative.mediaUrl = iframeResource;
        this.creative.nonLinearType = 'iframe';
      } else if (htmlResource) {
        this.creative.mediaUrl = htmlResource;
        this.creative.nonLinearType = 'html';
      }
      this.creative.width = width;
      this.creative.height = height;
      this.creative.type = currentVariation.type;
      if (this.debug) {
        FW.log('selected non-linear creative', this.creative);
      }
      break;
    }
  }
  // if not supported NonLinear type ping for error
  if (!this.creative.mediaUrl || isDimensionError) {
    let vastErrorCode = 503;
    if (isDimensionError) {
      vastErrorCode = 501;
    }
    VAST_ERRORS.process.call(this, vastErrorCode, true);
    return;
  }
  this.creative.clickThroughUrl = currentVariation.nonlinearClickThroughURLTemplate;
  if (currentVariation.nonlinearClickTrackingURLTemplates.length > 0) {
    for (let i = 0, len = currentVariation.nonlinearClickTrackingURLTemplates.length; i < len; i++) {
      this.trackingTags.push({
        event: 'clickthrough',
        url: currentVariation.nonlinearClickTrackingURLTemplates[i].url
      });
    }
  }
  VAST_PLAYER.append.call(this);
};

export default NON_LINEAR;
