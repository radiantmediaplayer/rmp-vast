import FW from '../fw/fw';
import TRACKING_EVENTS from '../tracking/tracking-events';

const ICONS = {};

ICONS.destroy = function () {
  if (this.debug) {
    FW.log('start destroying icons');
  }
  const icons = this.adContainer.querySelectorAll('.rmp-ad-container-icons');
  if (icons.length > 0) {
    for (let i = 0, len = icons.length; i < len; i++) {
      FW.removeElement(icons[i]);
    }
  }
};

ICONS.parse = function (icons) {
  if (this.debug) {
    FW.log('start parsing for icons');
  }
  for (let i = 0, len = icons.length; i < len; i++) {
    const currentIcon = icons[i];
    const program = currentIcon.program;
    if (program === null) {
      continue;
    }
    const width = currentIcon.width;
    const height = currentIcon.height;
    const xPosition = currentIcon.xPosition;
    const yPosition = currentIcon.yPosition;
    if (width <= 0 || height <= 0 || xPosition < 0 || yPosition < 0) {
      continue;
    }
    const staticResourceUrl = currentIcon.staticResource;
    const iframeResourceUrl = currentIcon.iframeResource;
    const htmlResource = currentIcon.htmlResource;
    // we only support StaticResource (HTMLResource not supported)
    if (staticResourceUrl === null && iframeResourceUrl === null && htmlResource === null) {
      continue;
    }
    const iconData = {
      program: program,
      width: width,
      height: height,
      xPosition: xPosition,
      yPosition: yPosition,
      staticResourceUrl: staticResourceUrl,
      iframeResourceUrl: iframeResourceUrl,
      htmlContent: htmlResource
    };
    iconData.iconViewTrackingUrl = currentIcon.iconViewTrackingURLTemplate;
    iconData.iconClickThroughUrl = currentIcon.iconClickThroughURLTemplate;
    iconData.iconClickTrackingUrls = currentIcon.iconClickTrackingURLTemplates;
    this.iconsData.push(iconData);
  }
  if (this.debug) {
    FW.log('validated parsed icons follows', this.iconsData);
  }
};

const _onIconClickThrough = function (index, event) {
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  FW.openWindow(this.iconsData[index].iconClickThroughUrl);
  // send trackers if any for IconClickTracking
  const iconClickTrackingUrls = this.iconsData[index].iconClickTrackingUrls;
  if (iconClickTrackingUrls.length > 0) {
    iconClickTrackingUrls.forEach((tracking) => {
      if (tracking.url) {
        TRACKING_EVENTS.pingURI.call(this, tracking.url);
      }
    });
  }
};

const _onIconLoadPingTracking = function (index) {
  if (this.debug) {
    FW.log('IconViewTracking for icon at index ' + index);
  }
  TRACKING_EVENTS.pingURI.call(this, this.iconsData[index].iconViewTrackingUrl);
};

const _onPlayingAppendIcons = function () {
  if (this.debug) {
    FW.log('playing states has been reached - append icons');
  }
  this.vastPlayer.removeEventListener('playing', this.onPlayingAppendIcons);
  for (let i = 0, len = this.iconsData.length; i < len; i++) {
    let icon;
    let src;
    const iconData = this.iconsData[i];
    if (iconData.staticResourceUrl) {
      icon = document.createElement('img');
      src = iconData.staticResourceUrl;
    } else if (iconData.iframeResourceUrl || iconData.htmlContent) {
      icon = document.createElement('iframe');
      if (iconData.htmlContent) {
        src = iconData.htmlContent;
      } else {
        src = iconData.iframeResourceUrl;
      }
      FW.setStyle(
        icon,
        {
          border: 'none',
          overflow: 'hidden'
        }
      );
      icon.setAttribute('scrolling', 'no');
      icon.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media');
      icon.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    }
    icon.className = 'rmp-ad-container-icons';
    FW.setStyle(
      icon,
      {
        width: parseInt(iconData.width) + 'px',
        height: parseInt(iconData.height) + 'px'
      }
    );
    const xPosition = iconData.xPosition;
    if (xPosition === 'left') {
      icon.style.left = '0px';
    } else if (xPosition === 'right') {
      icon.style.right = '0px';
    } else if (parseInt(xPosition) >= 0) {
      icon.style.left = xPosition + 'px';
    } else {
      icon.style.left = '0px';
    }
    const yPosition = iconData.yPosition;
    if (yPosition === 'top') {
      icon.style.top = '0px';
    } else if (xPosition === 'bottom') {
      icon.style.bottom = '0px';
    } else if (parseInt(yPosition) >= 0) {
      icon.style.top = yPosition + 'px';
    } else {
      icon.style.top = '0px';
    }
    if (iconData.iconViewTrackingUrl) {
      icon.onload = _onIconLoadPingTracking.bind(this, i);
    }
    if (iconData.iconClickThroughUrl) {
      icon.addEventListener('touchend', _onIconClickThrough.bind(this, i));
      icon.addEventListener('click', _onIconClickThrough.bind(this, i));
    }
    if (iconData.htmlContent) {
      icon.srcdoc = src;
    } else {
      icon.src = src;
    }
    if (this.debug) {
      FW.log('selected icon details follow', icon);
    }
    this.adContainer.appendChild(icon);
  }
};

ICONS.append = function () {
  this.onPlayingAppendIcons = _onPlayingAppendIcons.bind(this);
  // as per VAST 3 spec only append icon when ad starts playing
  this.vastPlayer.addEventListener('playing', this.onPlayingAppendIcons);
};

export default ICONS;
