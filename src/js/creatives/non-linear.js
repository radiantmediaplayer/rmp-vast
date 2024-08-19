import FW from '../framework/fw';
import Logger from '../framework/logger';


export default class NonLinearCreative {

  #rmpVast;
  #params;
  #adContainer;
  #container;
  #nonLinearMinSuggestedDuration = 0;
  #firstContentPlayerPlayRequest = true;
  #nonLinearCloseElement = null;
  #nonLinearAElement = null;
  #nonLinearInnerElement = null;
  #nonLinearContainerElement = null;
  #closeButtonTimeoutFn = null;

  constructor(rmpVast) {
    this.#rmpVast = rmpVast;
    this.#params = rmpVast.params;
    this.#adContainer = rmpVast.adContainer;
    this.#container = rmpVast.container;
  }

  #onNonLinearLoadError() {
    this.#rmpVast.rmpVastUtils.processVastErrors(502, true);
  }

  #onNonLinearLoadSuccess() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `success loading non-linear creative at ${this.#rmpVast.creative.mediaUrl}`);
    this.#rmpVast.__adOnStage = true;
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent(
      ['adloaded', 'adimpression', 'adstarted', 'adcreativeview']
    );
  }

  #onNonLinearClickThrough(event) {
    try {
      if (event) {
        event.stopPropagation();
      }
      this.#rmpVast.pause();
      this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adclick');
    } catch (error) {
      console.warn(error);
    }
  }

  #onClickCloseNonLinear(event) {
    if (event) {
      event.stopPropagation();
      if (event.type === 'touchend') {
        event.preventDefault();
      }
    }
    FW.setStyle(this.#nonLinearContainerElement, { display: 'none' });
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adclosed');
  }

  #appendCloseButton() {
    this.#nonLinearCloseElement = document.createElement('div');
    this.#nonLinearCloseElement.className = 'rmp-ad-non-linear-close';
    FW.makeButtonAccessible(this.#nonLinearCloseElement, this.#params.labels.closeAd);
    if (this.#nonLinearMinSuggestedDuration > 0) {
      FW.setStyle(this.#nonLinearCloseElement, { display: 'none' });
      window.clearTimeout(this.#closeButtonTimeoutFn);
      this.#closeButtonTimeoutFn = window.setTimeout(() => {
        FW.setStyle(this.#nonLinearCloseElement, { display: 'block' });
      }, this.#nonLinearMinSuggestedDuration * 1000);
    } else {
      FW.setStyle(this.#nonLinearCloseElement, { display: 'block' });
    }
    const onClickCloseNonLinearFn = this.#onClickCloseNonLinear.bind(this);
    FW.addEvents(['touchend', 'click'], this.#nonLinearCloseElement, onClickCloseNonLinearFn);
    this.#nonLinearContainerElement.appendChild(this.#nonLinearCloseElement);
  }

  destroy() {
    window.clearTimeout(this.#closeButtonTimeoutFn);
    try {
      FW.removeElement(this.#nonLinearContainerElement);
    } catch (error) {
      console.warn(error);
    }
  }

  update() {
    // non-linear ad container
    this.#nonLinearContainerElement = document.createElement('div');
    this.#nonLinearContainerElement.className = 'rmp-ad-non-linear-container';
    FW.setStyle(this.#nonLinearContainerElement, {
      width: (this.#rmpVast.creative.width).toString() + 'px',
      height: (this.#rmpVast.creative.height).toString() + 'px'
    });

    // a tag to handle click - a tag is best for WebView support
    this.#nonLinearAElement = document.createElement('a');
    this.#nonLinearAElement.className = 'rmp-ad-non-linear-anchor';
    if (this.#rmpVast.creative.clickThroughUrl) {
      this.#nonLinearAElement.href = this.#rmpVast.creative.clickThroughUrl;
      this.#nonLinearAElement.target = '_blank';
      const onNonLinearClickThroughFn = this.#onNonLinearClickThrough.bind(this);
      FW.addEvents(['touchend', 'click'], this.#nonLinearAElement, onNonLinearClickThroughFn);
    }

    // non-linear creative image
    if (this.#rmpVast.creative.nonLinearType === 'image') {
      this.#nonLinearInnerElement = document.createElement('img');
    } else {
      this.#nonLinearInnerElement = document.createElement('iframe');
      this.#nonLinearInnerElement.sandbox = 'allow-scripts allow-same-origin';
      FW.setStyle(this.#nonLinearInnerElement, { border: 'none', overflow: 'hidden' });
      this.#nonLinearInnerElement.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
      this.#nonLinearInnerElement.setAttribute('scrolling', 'no');
      this.#nonLinearInnerElement.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    }
    this.#nonLinearInnerElement.className = 'rmp-ad-non-linear-creative';

    const onNonLinearLoadErrorFn = this.#onNonLinearLoadError.bind(this);
    this.#nonLinearInnerElement.addEventListener('error', onNonLinearLoadErrorFn);
    const onNonLinearLoadSuccessFn = this.#onNonLinearLoadSuccess.bind(this);
    this.#nonLinearInnerElement.addEventListener('load', onNonLinearLoadSuccessFn);

    if (this.#rmpVast.creative.nonLinearType === 'html') {
      this.#nonLinearInnerElement.srcdoc = this.#rmpVast.creative.mediaUrl;
    } else {
      this.#nonLinearInnerElement.src = this.#rmpVast.creative.mediaUrl;
    }

    // append to adContainer
    this.#nonLinearAElement.appendChild(this.#nonLinearInnerElement);
    this.#nonLinearContainerElement.appendChild(this.#nonLinearAElement);
    this.#adContainer.appendChild(this.#nonLinearContainerElement);

    // display a close button when non-linear ad has reached minSuggestedDuration
    this.#appendCloseButton();
    FW.show(this.#adContainer);

    this.#rmpVast.rmpVastContentPlayer.play(this.#firstContentPlayerPlayRequest);
    this.#firstContentPlayerPlayRequest = false;
  }

  parse(variations) {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `non-linear creatives follow`, variations);

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
      if (width > FW.getWidth(this.#container) || height > FW.getHeight(this.#container)) {
        isDimensionError = true;
        continue;
      }
      // get minSuggestedDuration (optional)
      this.#nonLinearMinSuggestedDuration = currentVariation.minSuggestedDuration;
      const staticResource = currentVariation.staticResource;
      const iframeResource = currentVariation.iframeResource;
      const htmlResource = currentVariation.htmlResource;
      // we have a valid NonLinear/StaticResource with supported creativeType - we break
      if (staticResource !== null || iframeResource !== null || htmlResource !== null) {
        if (staticResource) {
          this.#rmpVast.creative.mediaUrl = staticResource;
          this.#rmpVast.creative.nonLinearType = 'image';
        } else if (iframeResource) {
          this.#rmpVast.creative.mediaUrl = iframeResource;
          this.#rmpVast.creative.nonLinearType = 'iframe';
        } else if (htmlResource) {
          this.#rmpVast.creative.mediaUrl = htmlResource;
          this.#rmpVast.creative.nonLinearType = 'html';
        }
        this.#rmpVast.creative.width = width;
        this.#rmpVast.creative.height = height;
        this.#rmpVast.creative.type = currentVariation.type;
        Logger.print(this.#rmpVast.debugRawConsoleLogs, `selected non-linear creative`, this.#rmpVast.creative);
        break;
      }
    }
    // if not supported NonLinear type ping for error
    if (!this.#rmpVast.creative.mediaUrl || isDimensionError) {
      let vastErrorCode = 503;
      if (isDimensionError) {
        vastErrorCode = 501;
      }
      this.#rmpVast.rmpVastUtils.processVastErrors(vastErrorCode, true);
      return;
    }
    this.#rmpVast.creative.clickThroughUrl = currentVariation.nonlinearClickThroughURLTemplate;
    if (currentVariation.nonlinearClickTrackingURLTemplates.length > 0) {
      currentVariation.nonlinearClickTrackingURLTemplates.forEach(nonlinearClickTrackingURLTemplate => {
        if (nonlinearClickTrackingURLTemplate.url) {
          this.#rmpVast.trackingTags.push({
            event: 'clickthrough',
            url: nonlinearClickTrackingURLTemplate.url
          });
        }
      });
    }
    if (this.#rmpVast.rmpVastAdPlayer) {
      this.#rmpVast.rmpVastAdPlayer.append();
    }
  }

}
