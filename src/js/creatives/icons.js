import FW from '../framework/fw';
import Logger from '../framework/logger';


export default class Icons {

  #rmpVast;
  #adContainer;
  #adPlayer;
  #onPlayingAppendIconsFn = null;
  #iconsData = [];

  constructor(rmpVast) {
    this.#rmpVast = rmpVast;
    this.#adContainer = rmpVast.adContainer;
    this.#adPlayer = rmpVast.currentAdPlayer;
  }

  get iconsData() {
    return this.#iconsData;
  }

  #onIconClickThrough(index, event) {
    if (event) {
      event.stopPropagation();
      if (event.type === 'touchend') {
        event.preventDefault();
      }
    }
    FW.openWindow(this.#iconsData[index].iconClickThroughUrl);
    // send trackers if any for IconClickTracking
    const iconClickTrackingUrls = this.#iconsData[index].iconClickTrackingUrls;
    if (iconClickTrackingUrls.length > 0) {
      iconClickTrackingUrls.forEach(tracking => {
        if (tracking.url) {
          this.#rmpVast.rmpVastTracking.pingURI(tracking.url);
        }
      });
    }
    this.#rmpVast.rmpVastUtils.createApiEvent('adiconclick');
  }

  #onIconLoadPingTracking(index) {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `IconViewTracking for icon at index ${index}`);
    this.#rmpVast.rmpVastTracking.pingURI(this.#iconsData[index].iconViewTrackingUrl);
  }

  #onPlayingAppendIcons() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `playing states has been reached - append icons`);
    this.#iconsData.forEach((iconData, index) => {
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
        icon.onload = this.#onIconLoadPingTracking.bind(this, index);
      }
      if (iconData.iconClickThroughUrl) {
        const onIconClickThroughFn = this.#onIconClickThrough.bind(this, index);
        FW.addEvents(['touchend', 'click'], icon, onIconClickThroughFn);
      }
      if (iconData.htmlContent) {
        icon.srcdoc = src;
      } else {
        icon.src = src;
      }
      Logger.print(this.#rmpVast.debugRawConsoleLogs, `Selected icon details follow`, icon);
      this.#adContainer.appendChild(icon);
    });
  }

  destroy() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `Start destroying icons`);
    const icons = this.#adContainer.querySelectorAll('.rmp-ad-container-icons');
    if (icons.length > 0) {
      icons.forEach(icon => {
        FW.removeElement(icon);
      });
    }
    if (this.#adPlayer) {
      this.#adPlayer.removeEventListener('playing', this.#onPlayingAppendIconsFn);
    }
  }

  parse(icons) {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `Start parsing icons`);
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
      this.#iconsData.push(iconData);
    }
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `Validated parsed icons follows`, this.#iconsData);
  }

  append() {
    this.#onPlayingAppendIconsFn = this.#onPlayingAppendIcons.bind(this);
    // as per VAST 3 spec only append icon when ad starts playing
    this.#adPlayer.addEventListener('playing', this.#onPlayingAppendIconsFn, { once: true });
  }

}
