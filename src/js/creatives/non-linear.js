import FW from '../framework/fw';
import ENV from '../framework/env';
import Utils from '../framework/utils';
import VAST_PLAYER from '../players/vast-player';
import CONTENT_PLAYER from '../players/content-player';
import TRACKING_EVENTS from '../tracking/tracking-events';

const NON_LINEAR = {};

const _onNonLinearLoadError = function () {
  Utils.processVastErrors.call(this, 502, true);
};

const _onNonLinearLoadSuccess = function () {
  console.log(
    `${FW.consolePrepend} success loading non-linear creative at ${this.creative.mediaUrl}`,
    FW.consoleStyle,
    ''
  );

  this.adOnStage = true;
  Utils.createApiEvent.call(this, ['adloaded', 'adimpression', 'adstarted']);
  TRACKING_EVENTS.dispatch.call(this, ['impression', 'creativeView', 'start', 'loaded']);
};

const _onNonLinearClickThrough = function (event) {
  try {
    if (event) {
      event.stopPropagation();
    }
    this.pause();
    Utils.createApiEvent.call(this, 'adclick');
    TRACKING_EVENTS.dispatch.call(this, 'clickthrough');
  } catch (e) {
    console.warn(e);
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
  Utils.createApiEvent.call(this, 'adclosed');
  TRACKING_EVENTS.dispatch.call(this, 'close');
};

const _appendCloseButton = function () {
  this.nonLinearClose = document.createElement('div');
  this.nonLinearClose.className = 'rmp-ad-non-linear-close';
  Utils.makeButtonAccessible(this.nonLinearClose, this.params.labels.closeAd);
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
    this.nonLinearInnerElement.sandbox = 'allow-scripts allow-same-origin';
    FW.setStyle(
      this.nonLinearInnerElement,
      {
        border: 'none',
        overflow: 'hidden'
      }
    );
    this.nonLinearInnerElement.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
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
  console.log(`${FW.consolePrepend} non-linear creatives follow`, FW.consoleStyle, '');
  console.log(variations);

  let isDimensionError = false;
  let currentVariation;
  // The video player should poll each <NonLinear> element to determine 
  // which creative is offered in a format the video player can support.
  for (let i = 0; i < variations.length; i++) {
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

      console.log(`${FW.consolePrepend} selected non-linear creative`, FW.consoleStyle, '');
      console.log(this.creative);
      break;
    }
  }
  // if not supported NonLinear type ping for error
  if (!this.creative.mediaUrl || isDimensionError) {
    let vastErrorCode = 503;
    if (isDimensionError) {
      vastErrorCode = 501;
    }
    Utils.processVastErrors.call(this, vastErrorCode, true);
    return;
  }
  this.creative.clickThroughUrl = currentVariation.nonlinearClickThroughURLTemplate;
  if (currentVariation.nonlinearClickTrackingURLTemplates.length > 0) {
    currentVariation.nonlinearClickTrackingURLTemplates.forEach(nonlinearClickTrackingURLTemplate => {
      if (nonlinearClickTrackingURLTemplate.url) {
        this.trackingTags.push({
          event: 'clickthrough',
          url: nonlinearClickTrackingURLTemplate.url
        });
      }
    });
  }
  VAST_PLAYER.append.call(this);
};

export default NON_LINEAR;
