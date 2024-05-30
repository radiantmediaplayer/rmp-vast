import FW from '../framework/fw';
import Logger from '../framework/logger';


export default class Icons {

  constructor(rmpVast) {
    this._rmpVast = rmpVast;
    this._adContainer = rmpVast.adContainer;
    this._adPlayer = rmpVast.currentAdPlayer;
    this._debugRawConsoleLogs = rmpVast.debugRawConsoleLogs;
    this._onPlayingAppendIconsFn = null;
    this._iconsData = [];
  }

  get iconsData() {
    return this._iconsData;
  }

  _onIconClickThrough(index, event) {
    if (event) {
      event.stopPropagation();
      if (event.type === 'touchend') {
        event.preventDefault();
      }
    }
    FW.openWindow(this._iconsData[index].iconClickThroughUrl);
    // send trackers if any for IconClickTracking
    const iconClickTrackingUrls = this._iconsData[index].iconClickTrackingUrls;
    if (iconClickTrackingUrls.length > 0) {
      iconClickTrackingUrls.forEach(tracking => {
        if (tracking.url) {
          this._rmpVast.rmpVastTracking.pingURI(tracking.url);
        }
      });
    }
    this._rmpVast.rmpVastUtils.createApiEvent('adiconclick');
  }

  _onIconLoadPingTracking(index) {
    Logger.print(this._debugRawConsoleLogs, `IconViewTracking for icon at index ${index}`);
    this._rmpVast.rmpVastTracking.pingURI(this._iconsData[index].iconViewTrackingUrl);
  }

  _onPlayingAppendIcons() {
    Logger.print(this._debugRawConsoleLogs, `playing states has been reached - append icons`);
    this._iconsData.forEach((iconData, index) => {
      let icon;
      let src;
      if (iconData.staticResourceUrl) {
        icon = document.createElement('img');
        src = iconData.staticResourceUrl;
      } else if (iconData.iframeResourceUrl || iconData.htmlContent) {
        icon = document.createElement('iframe');
        icon.sandbox = 'allow-scripts allow-same-origin';
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
        icon.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
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
        icon.onload = this._onIconLoadPingTracking.bind(this, index);
      }
      if (iconData.iconClickThroughUrl) {
        const _onIconClickThroughFn = this._onIconClickThrough.bind(this, index);
        FW.addEvents(['touchend', 'click'], icon, _onIconClickThroughFn);
      }
      if (iconData.htmlContent) {
        icon.srcdoc = src;
      } else {
        icon.src = src;
      }
      Logger.print(this._debugRawConsoleLogs, `Selected icon details follow`, icon);
      this._adContainer.appendChild(icon);
    });
  }

  destroy() {
    Logger.print(this._debugRawConsoleLogs, `Start destroying icons`);
    const icons = this._adContainer.querySelectorAll('.rmp-ad-container-icons');
    if (icons.length > 0) {
      icons.forEach(icon => {
        FW.removeElement(icon);
      });
    }
    if (this._adPlayer) {
      this._adPlayer.removeEventListener('playing', this._onPlayingAppendIconsFn);
    }
  }

  parse(icons) {
    Logger.print(this._debugRawConsoleLogs, `Start parsing icons`);
    for (let i = 0; i < icons.length; i++) {
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
      const htmlContent = currentIcon.htmlResource;
      // we only support StaticResource (HTMLResource not supported)
      if (staticResourceUrl === null && iframeResourceUrl === null && htmlContent === null) {
        continue;
      }
      const iconData = {
        program,
        width,
        height,
        xPosition,
        yPosition,
        staticResourceUrl,
        iframeResourceUrl,
        htmlContent
      };
      iconData.iconViewTrackingUrl = currentIcon.iconViewTrackingURLTemplate;
      iconData.iconClickThroughUrl = currentIcon.iconClickThroughURLTemplate;
      iconData.iconClickTrackingUrls = currentIcon.iconClickTrackingURLTemplates;
      this._iconsData.push(iconData);
    }
    Logger.print(this._debugRawConsoleLogs, `Validated parsed icons follows`, this._iconsData);
  }

  append() {
    this._onPlayingAppendIconsFn = this._onPlayingAppendIcons.bind(this);
    // as per VAST 3 spec only append icon when ad starts playing
    this._adPlayer.addEventListener('playing', this._onPlayingAppendIconsFn, { once: true });
  }

}
