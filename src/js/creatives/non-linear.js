import FW from '../framework/fw';
import Utils from '../framework/utils';
import Tracking from '../tracking/tracking';


export default class NonLinearCreative {

  constructor(rmpVast) {
    this._rmpVast = rmpVast;
    this._params = rmpVast.params;
    this._adContainer = rmpVast.adContainer;
    this._container = rmpVast.container;
    this._nonLinearMinSuggestedDuration = 0;
    this._firstContentPlayerPlayRequest = true;
    this._nonLinearCloseElement = null;
    this._nonLinearAElement = null;
    this._nonLinearInnerElement = null;
    this._nonLinearContainerElement = null;
    this._onNonLinearLoadSuccessFn = null;
    this._onNonLinearLoadErrorFn = null;
    this._onNonLinearClickThroughFn = null;
    this._onClickCloseNonLinearFn = null;
  }

  get nonLinearContainerElement() {
    return this._nonLinearContainerElement;
  }

  _onNonLinearLoadError() {
    Utils.processVastErrors.call(this._rmpVast, 502, true);
  }

  _onNonLinearLoadSuccess() {
    console.log(
      `${FW.consolePrepend} success loading non-linear creative at ${this._rmpVast.creative.mediaUrl}`,
      FW.consoleStyle,
      ''
    );

    this._rmpVast.__adOnStage = true;
    Utils.createApiEvent.call(this._rmpVast, ['adloaded', 'adimpression', 'adstarted']);
    Tracking.dispatch.call(this._rmpVast, ['impression', 'creativeView', 'start', 'loaded']);
  }

  _onNonLinearClickThrough(event) {
    try {
      if (event) {
        event.stopPropagation();
      }
      this._rmpVast.pause();
      Utils.createApiEvent.call(this._rmpVast, 'adclick');
      Tracking.dispatch.call(this._rmpVast, 'clickthrough');
    } catch (e) {
      console.warn(e);
    }
  }

  _onClickCloseNonLinear(event) {
    if (event) {
      event.stopPropagation();
      if (event.type === 'touchend') {
        event.preventDefault();
      }
    }
    FW.setStyle(this._nonLinearContainerElement, { display: 'none' });
    Utils.createApiEvent.call(this._rmpVast, 'adclosed');
    Tracking.dispatch.call(this._rmpVast, 'close');
  }

  _appendCloseButton() {
    this._nonLinearCloseElement = document.createElement('div');
    this._nonLinearCloseElement.className = 'rmp-ad-non-linear-close';
    Utils.makeButtonAccessible(this._nonLinearCloseElement, this._params.labels.closeAd);
    if (this._nonLinearMinSuggestedDuration > 0) {
      FW.setStyle(this._nonLinearCloseElement, { display: 'none' });
      setTimeout(() => {
        FW.setStyle(this._nonLinearCloseElement, { display: 'block' });
      }, this._nonLinearMinSuggestedDuration * 1000);
    } else {
      FW.setStyle(this._nonLinearCloseElement, { display: 'block' });
    }
    this._onClickCloseNonLinearFn = this._onClickCloseNonLinear.bind(this);
    FW.addEvents(['touchend', 'click'], this._nonLinearCloseElement, this._onClickCloseNonLinearFn);
    this._nonLinearContainerElement.appendChild(this._nonLinearCloseElement);
  }

  destroy() {
    if (this._nonLinearInnerElement) {
      this._nonLinearInnerElement.removeEventListener('load', this._onNonLinearLoadSuccessFn);
      this._nonLinearInnerElement.removeEventListener('error', this._onNonLinearLoadErrorFn);
    }
    FW.removeEvents(['touchend', 'click'], this._nonLinearAElement, this._onNonLinearClickThroughFn);
    FW.removeEvents(['touchend', 'click'], this._nonLinearCloseElement, this._onClickCloseNonLinearFn);
  }

  update() {
    // non-linear ad container
    this._nonLinearContainerElement = document.createElement('div');
    this._nonLinearContainerElement.className = 'rmp-ad-non-linear-container';
    FW.setStyle(this._nonLinearContainerElement, {
      width: (this._rmpVast.creative.width).toString() + 'px',
      height: (this._rmpVast.creative.height).toString() + 'px'
    });

    // a tag to handle click - a tag is best for WebView support
    this._nonLinearAElement = document.createElement('a');
    this._nonLinearAElement.className = 'rmp-ad-non-linear-anchor';
    if (this._rmpVast.creative.clickThroughUrl) {
      this._nonLinearAElement.href = this._rmpVast.creative.clickThroughUrl;
      this._nonLinearAElement.target = '_blank';
      this._onNonLinearClickThroughFn = this._onNonLinearClickThrough.bind(this);
      FW.addEvents(['touchend', 'click'], this._nonLinearAElement, this._onNonLinearClickThroughFn);
    }

    // non-linear creative image
    if (this._rmpVast.creative.nonLinearType === 'image') {
      this._nonLinearInnerElement = document.createElement('img');
    } else {
      this._nonLinearInnerElement = document.createElement('iframe');
      this._nonLinearInnerElement.sandbox = 'allow-scripts allow-same-origin';
      FW.setStyle(this._nonLinearInnerElement, { border: 'none', overflow: 'hidden' });
      this._nonLinearInnerElement.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
      this._nonLinearInnerElement.setAttribute('scrolling', 'no');
      this._nonLinearInnerElement.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    }
    this._nonLinearInnerElement.className = 'rmp-ad-non-linear-creative';

    this._onNonLinearLoadErrorFn = this._onNonLinearLoadError.bind(this);
    this._nonLinearInnerElement.addEventListener('error', this._onNonLinearLoadErrorFn);
    this._onNonLinearLoadSuccessFn = this._onNonLinearLoadSuccess.bind(this);
    this._nonLinearInnerElement.addEventListener('load', this._onNonLinearLoadSuccessFn);

    if (this._rmpVast.creative.nonLinearType === 'html') {
      this._nonLinearInnerElement.srcdoc = this._rmpVast.creative.mediaUrl;
    } else {
      this._nonLinearInnerElement.src = this._rmpVast.creative.mediaUrl;
    }

    // append to adContainer
    this._nonLinearAElement.appendChild(this._nonLinearInnerElement);
    this._nonLinearContainerElement.appendChild(this._nonLinearAElement);
    this._adContainer.appendChild(this._nonLinearContainerElement);

    // display a close button when non-linear ad has reached minSuggestedDuration
    this._appendCloseButton();
    FW.show(this._adContainer);

    this._rmpVast.rmpVastContentPlayer.play(this._firstContentPlayerPlayRequest);
    this._firstContentPlayerPlayRequest = false;
  }

  parse(variations) {
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
      if (width > FW.getWidth(this._container) || height > FW.getHeight(this._container)) {
        isDimensionError = true;
        continue;
      }
      // get minSuggestedDuration (optional)
      this._nonLinearMinSuggestedDuration = currentVariation.minSuggestedDuration;
      const staticResource = currentVariation.staticResource;
      const iframeResource = currentVariation.iframeResource;
      const htmlResource = currentVariation.htmlResource;
      // we have a valid NonLinear/StaticResource with supported creativeType - we break
      if (staticResource !== null || iframeResource !== null || htmlResource !== null) {
        if (staticResource) {
          this._rmpVast.creative.mediaUrl = staticResource;
          this._rmpVast.creative.nonLinearType = 'image';
        } else if (iframeResource) {
          this._rmpVast.creative.mediaUrl = iframeResource;
          this._rmpVast.creative.nonLinearType = 'iframe';
        } else if (htmlResource) {
          this._rmpVast.creative.mediaUrl = htmlResource;
          this._rmpVast.creative.nonLinearType = 'html';
        }
        this._rmpVast.creative.width = width;
        this._rmpVast.creative.height = height;
        this._rmpVast.creative.type = currentVariation.type;

        console.log(`${FW.consolePrepend} selected non-linear creative`, FW.consoleStyle, '');
        console.log(this._rmpVast.creative);
        break;
      }
    }
    // if not supported NonLinear type ping for error
    if (!this._rmpVast.creative.mediaUrl || isDimensionError) {
      let vastErrorCode = 503;
      if (isDimensionError) {
        vastErrorCode = 501;
      }
      Utils.processVastErrors.call(this._rmpVast, vastErrorCode, true);
      return;
    }
    this._rmpVast.creative.clickThroughUrl = currentVariation.nonlinearClickThroughURLTemplate;
    if (currentVariation.nonlinearClickTrackingURLTemplates.length > 0) {
      currentVariation.nonlinearClickTrackingURLTemplates.forEach(nonlinearClickTrackingURLTemplate => {
        if (nonlinearClickTrackingURLTemplate.url) {
          this._rmpVast.trackingTags.push({
            event: 'clickthrough',
            url: nonlinearClickTrackingURLTemplate.url
          });
        }
      });
    }
    if (this._rmpVast.rmpVastAdPlayer) {
      this._rmpVast.rmpVastAdPlayer.append();
    }
  }

}
