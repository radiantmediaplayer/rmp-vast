import HELPERS from '../utils/helpers';
import TRACKING_EVENTS from '../tracking/tracking-events';

const VIEWABLE_IMPRESSION = {};

const _handleIntersect = function (entries) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > this.viewablePreviousRatio) {
      this.viewableObserver.unobserve(this.container);
      HELPERS.createApiEvent.call(this, 'adviewable');
      TRACKING_EVENTS.dispatch.call(this, 'viewable');
    }
    this.viewablePreviousRatio = entry.intersectionRatio;
  });
};

const _attachViewableObserver = function () {
  this.container.removeEventListener('adstarted', this.attachViewableObserver);
  if (typeof window.IntersectionObserver !== 'undefined') {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.5],
    };
    this.viewableObserver = new IntersectionObserver(_handleIntersect.bind(this), options);
    this.viewableObserver.observe(this.container);
  } else {
    HELPERS.createApiEvent.call(this, 'adviewundetermined');
    TRACKING_EVENTS.dispatch.call(this, 'viewundetermined');
  }
};

VIEWABLE_IMPRESSION.init = function() {
  if (this.viewableObserver) {
    this.viewableObserver.unobserve(this.container);
  }
  if (this.ad.viewableImpression.viewable.length > 0) {
    this.ad.viewableImpression.viewable.forEach(url => {
      this.trackingTags.push({
        event: 'viewable',
        url: url
      });
    });
  }
  if (this.ad.viewableImpression.notviewable.length > 0) {
    this.ad.viewableImpression.notviewable.forEach(url => {
      this.trackingTags.push({
        event: 'notviewable',
        url: url
      });
    });
  }
  if (this.ad.viewableImpression.viewundetermined.length > 0) {
    this.ad.viewableImpression.viewundetermined.forEach(url => {
      this.trackingTags.push({
        event: 'viewundetermined',
        url: url
      });
    });
  }
  this.attachViewableObserver = _attachViewableObserver.call(this);
  this.container.addEventListener('adstarted', this.attachViewableObserver);
};

export default VIEWABLE_IMPRESSION;
