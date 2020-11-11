import FW from '../fw/fw';

const COMPANION = {};

COMPANION.parse = function (creative) {
  // reset variables in case wrapper
  this.validCompanionAds = [];
  this.companionAdsRequiredAttribute = '';
  if (creative.required === null) {
    this.companionAdsRequiredAttribute = creative.required;
  }
  const companions = creative.variations;
  // at least 1 Companion is expected to continue
  if (companions.length > 0) {
    for (let i = 0, len = companions.length; i < len; i++) {
      const companion = companions[i];
      const staticResources = companion.staticResources;
      const iframeResources = companion.iframeResources;
      const htmlResources = companion.htmlResources;
      let staticResourceUrl;
      for (let j = 0, len = staticResources.length; j < len; j++) {
        if (staticResources[j].url) {
          staticResourceUrl = staticResources[j].url;
          break;
        }
      }
      let iframeResourceUrl;
      for (let k = 0, len = iframeResources.length; k < len; k++) {
        if (iframeResources[k]) {
          iframeResourceUrl = iframeResources[k];
          break;
        }
      }
      let htmlResourceContent;
      for (let k = 0, len = htmlResources.length; k < len; k++) {
        if (htmlResources[k]) {
          htmlResourceContent = htmlResources[k];
          break;
        }
      }
      let width = companion.width;
      let height = companion.height;
      if (!staticResourceUrl && !iframeResourceUrl && !htmlResourceContent) {
        continue;
      }
      const newCompanionAds = {
        width: width,
        height: height,
        imageUrl: staticResourceUrl,
        iframeUrl: iframeResourceUrl,
        htmlContent: htmlResourceContent
      };
      if (companion.companionClickThroughURLTemplate) {
        newCompanionAds.companionClickThroughUrl = companion.companionClickThroughURLTemplate;
      }
      if (companion.companionClickTrackingURLTemplates.length > 0) {
        newCompanionAds.companionClickTrackingUrl = companion.companionClickTrackingURLTemplates;
      }
      if (companion.altText) {
        newCompanionAds.altText = companion.altText;
      }
      if (companion.adSlotID) {
        newCompanionAds.adSlotID = companion.adSlotID;
      }
      newCompanionAds.trackingEventsUrls = [];
      for (let j = 0, len = companion.trackingEvents.length; j < len; j++) {
        newCompanionAds.trackingEventsUrls.push(companion.trackingEvents[j].creativeView);
      }
      this.validCompanionAds.push(newCompanionAds);
    }
  }
  if (this.debug) {
    FW.log('parse companion ads follow', this.validCompanionAds);
  }
};

export default COMPANION;
