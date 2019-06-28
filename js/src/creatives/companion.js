import FW from '../fw/fw';
import PING from '../tracking/ping';
import VASTERRORS from '../utils/vast-errors';

const COMPANION = {};

COMPANION.parse = function (companionAds) {
  // reset variables in case wrapper
  this.validCompanionAds = [];
  this.companionAdsRequiredAttribute = '';
  this.companionAdsAdSlotID = [];
  // getCompanionAdsRequiredAttribute
  this.companionAdsRequiredAttribute = companionAds[0].getAttribute('required');
  if (this.companionAdsRequiredAttribute === null) {
    this.companionAdsRequiredAttribute = '';
  }
  const companions = companionAds[0].getElementsByTagName('Companion');
  // at least 1 Companion is expected to continue
  let hasAltResources = false;
  if (companions.length > 0) {
    for (let i = 0, len = companions.length; i < len; i++) {
      const companion = companions[i];
      const staticResource = companion.getElementsByTagName('StaticResource');
      const iFrameResource = companion.getElementsByTagName('IFrameResource');
      const htmlResource = companion.getElementsByTagName('HTMLResource');
      // we expect at least one StaticResource tag
      // we do not support IFrameResource or HTMLResource
      if (staticResource.length === 0) {
        if (iFrameResource.length > 0 || htmlResource.length > 0) {
          hasAltResources = true;
        }
        continue;
      }
      const creativeType = staticResource[0].getAttribute('creativeType');
      if (creativeType === null || creativeType === '') {
        continue;
      }
      // we only support images for StaticResource
      if (!FW.imagePattern.test(creativeType)) {
        continue;
      }
      let width = companion.getAttribute('width');
      // width attribute is required
      if (width === null || width === '') {
        PING.error.call(this, 101);
        VASTERRORS.process.call(this, 101);
        continue;
      }
      let height = companion.getAttribute('height');
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
      const staticResourceUrl = FW.getNodeValue(staticResource[0], true);
      if (staticResourceUrl === null) {
        continue;
      }
      const newCompanionAds = {
        width: width,
        height: height,
        imageUrl: staticResourceUrl
      };

      const companionClickThrough = companion.getElementsByTagName('CompanionClickThrough');
      if (companionClickThrough.length > 0) {
        const companionClickThroughUrl = FW.getNodeValue(companionClickThrough[0], true);
        if (companionClickThroughUrl !== null) {
          newCompanionAds.companionClickThroughUrl = companionClickThroughUrl;
        }
      }

      const companionClickTracking = companion.getElementsByTagName('CompanionClickTracking');
      if (companionClickTracking.length > 0) {
        const companionClickTrackingUrl = FW.getNodeValue(companionClickTracking[0], true);
        if (companionClickTrackingUrl !== null) {
          newCompanionAds.companionClickTrackingUrl = companionClickTrackingUrl;
        }
      }

      const altTextNode = companion.getElementsByTagName('AltText');
      if (altTextNode.length > 0) {
        const altText = FW.getNodeValue(altTextNode[0], false);
        if (altText !== null) {
          newCompanionAds.altText = altText;
        }
      }
      
      const adSlotID = companion.getAttribute('adSlotID');
      if (adSlotID !== null) {
        this.companionAdsAdSlotID.push(adSlotID);
      }

      const trackingEvents = companion.getElementsByTagName('TrackingEvents');
      // if TrackingEvents tag
      if (trackingEvents.length > 0) {
        newCompanionAds.trackingEventsUri = [];
        const tracking = companion.getElementsByTagName('Tracking');
        if (tracking.length > 0) {
          for (let i = 0, len = tracking.length; i < len; i++) {
            let event = tracking[i].getAttribute('event');
            // width attribute is required
            if (event !== null && event === 'creativeView') {
              const url = FW.getNodeValue(tracking[i], true);
              newCompanionAds.trackingEventsUri.push(url);
            }
          }
        }
      }
      this.validCompanionAds.push(newCompanionAds);
    }
  }
  if (DEBUG) {
    FW.log('parse companion ads follow');
    FW.log(this.validCompanionAds);
  }
  if (this.validCompanionAds.length === 0 && hasAltResources) {
    PING.error.call(this, 604);
  }
};

export default COMPANION;
