import FW from '../framework/fw';
import Logger from '../framework/logger';


export default class CompanionCreative {

  constructor(rmpVast) {
    this._rmpVast = rmpVast;
    this._debugRawConsoleLogs = rmpVast.debugRawConsoleLogs;
    this.reset();
  }

  get requiredAttribute() {
    return this._requiredAttribute;
  }

  _onImgClickThrough(companionClickThroughUrl, companionClickTrackingUrls, event) {
    if (event) {
      event.stopPropagation();
      if (event.type === 'touchend') {
        event.preventDefault();
      }
    }
    if (companionClickTrackingUrls) {
      companionClickTrackingUrls.forEach(companionClickTrackingUrl => {
        if (companionClickTrackingUrl.url) {
          this._rmpVast.rmpVastTracking.pingURI(companionClickTrackingUrl.url);
        }
      });
    }
    FW.openWindow(companionClickThroughUrl);
  }

  reset() {
    this._requiredAttribute = '';
    this._validCompanionAds = [];
    this._companionAdsList = [];
  }

  parse(creative) {
    // reset variables in case wrapper
    this._validCompanionAds = [];
    this._requiredAttribute = '';
    if (creative.required) {
      this._requiredAttribute = creative.required;
    }
    const companions = creative.variations;
    // at least 1 Companion is expected to continue
    if (companions.length > 0) {
      for (let i = 0; i < companions.length; i++) {
        const companion = companions[i];
        const newCompanionAds = {
          width: companion.width,
          height: companion.height
        };
        const staticResourceFound = companion.staticResources.find(staticResource => {
          if (staticResource.url) {
            return true;
          }
          return false;
        });
        const iframeResourceFound = companion.iframeResources.find(iframeResource => {
          if (iframeResource) {
            return true;
          }
          return false;
        });
        const htmlResourceFound = companion.htmlResources.find(htmlResource => {
          if (htmlResource) {
            return true;
          }
          return false;
        });
        if (staticResourceFound && staticResourceFound.url) {
          newCompanionAds.imageUrl = staticResourceFound.url;
        }
        if (iframeResourceFound && iframeResourceFound.length > 0) {
          newCompanionAds.iframeUrl = iframeResourceFound;
        }
        if (htmlResourceFound && htmlResourceFound.length > 0) {
          newCompanionAds.htmlContent = htmlResourceFound;
        }
        // if no companion content for this <Companion> then move on to the next
        if (typeof staticResourceFound === 'undefined' &&
          typeof iframeResourceFound === 'undefined' &&
          typeof htmlResourceFound === 'undefined') {
          continue;
        }
        if (companion.companionClickThroughURLTemplate) {
          newCompanionAds.companionClickThroughUrl = companion.companionClickThroughURLTemplate;
        }
        if (companion.companionClickTrackingURLTemplates.length > 0) {
          newCompanionAds.companionClickTrackingUrls = companion.companionClickTrackingURLTemplates;
        }
        if (companion.altText) {
          newCompanionAds.altText = companion.altText;
        }
        if (companion.adSlotId) {
          newCompanionAds.adSlotId = companion.adSlotId;
        }
        newCompanionAds.trackingEventsUrls = [];
        if (companion.trackingEvents && companion.trackingEvents.creativeView) {
          companion.trackingEvents.creativeView.forEach(creativeView => {
            newCompanionAds.trackingEventsUrls.push(creativeView);
          });
        }
        this._validCompanionAds.push(newCompanionAds);
      }
    }
    Logger.print(this._debugRawConsoleLogs, `Parse companion ads follow`, this._validCompanionAds);
  }

  getList(inputWidth, inputHeight) {
    if (this._validCompanionAds.length > 0) {
      let availableCompanionAds;
      if (typeof inputWidth === 'number' && inputWidth > 0 && typeof inputHeight === 'number' && inputHeight > 0) {
        availableCompanionAds = this._validCompanionAds.filter(companionAds => {
          return inputWidth >= companionAds.width && inputHeight >= companionAds.height;
        });
      } else {
        availableCompanionAds = this._validCompanionAds;
      }
      if (availableCompanionAds.length > 0) {
        this._companionAdsList = availableCompanionAds;
        return this._companionAdsList;
      }
    }
    return [];
  }

  getItem(index) {
    if (typeof this._companionAdsList[index] === 'undefined') {
      return null;
    }
    const companionAd = this._companionAdsList[index];
    let html;
    if (companionAd.imageUrl || companionAd.iframeUrl) {
      if (companionAd.imageUrl) {
        html = document.createElement('img');
      } else {
        html = document.createElement('iframe');
        html.sandbox = 'allow-scripts allow-same-origin';
      }
      if (companionAd.altText) {
        html.alt = companionAd.altText;
      }
      html.width = companionAd.width;
      html.height = companionAd.height;
      html.style.cursor = 'pointer';
    } else if (companionAd.htmlContent) {
      html = companionAd.htmlContent;
    }
    if (companionAd.imageUrl || companionAd.iframeUrl) {
      const trackingEventsUrls = companionAd.trackingEventsUrls;
      if (trackingEventsUrls.length > 0) {
        html.onload = () => {
          trackingEventsUrls.forEach(trackingEventsUrl => {
            this._rmpVast.rmpVastTracking.pingURI(trackingEventsUrl);
          });
        };
        html.onerror = () => {
          this._rmpVast.rmpVastTracking.error(603);
        };
      }
      let companionClickTrackingUrls = null;
      if (companionAd.companionClickTrackingUrls) {
        Logger.print(this._debugRawConsoleLogs, `Companion click tracking URIs`, companionClickTrackingUrls);

        companionClickTrackingUrls = companionAd.companionClickTrackingUrls;
      }
      if (companionAd.companionClickThroughUrl) {
        const _onImgClickThroughFn = this._onImgClickThrough.bind(
          this,
          companionAd.companionClickThroughUrl,
          companionClickTrackingUrls
        );
        FW.addEvents(['touchend', 'click'], html, _onImgClickThroughFn);
      }
    }
    if (companionAd.imageUrl) {
      html.src = companionAd.imageUrl;
    } else if (companionAd.iframeUrl) {
      html.src = companionAd.iframeUrl;
    } else if (companionAd.htmlContent) {
      try {
        const parser = new DOMParser();
        html = parser.parseFromString(companionAd.htmlContent, 'text/html');
        html = html.documentElement;
      } catch (error) {
        console.warn(error);
        return null;
      }
    }
    return html;
  }

}
