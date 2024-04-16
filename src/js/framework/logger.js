export default class Logger {

  static printVideoEvents(video, type) {
    const events = [
      'loadstart',
      'durationchange',
      'playing',
      'waiting',
      'loadedmetadata',
      'loadeddata',
      'canplay',
      'canplaythrough'
    ];
    events.forEach(value => {
      video.addEventListener(value, e => {
        if (e && e.type) {
          Logger.print('info', `${type} video player event "${e.type}"`);
        }
      });
    });
  }

  static print(type, data, dump) {
    const classicLogPattern = /(edge|xbox|msie|trident)/i;
    const consoleStyleRmpVast = 'color: white; background-color: #00ACC1; padding:1px 3px; border-radius: 3px; margin-right: 7px;';
    if (data) {
      if (typeof navigator !== 'undefined' && navigator.userAgent && classicLogPattern.test(navigator.userAgent)) {
        console.log(`RMP-VAST: ${data}`);
      } else {
        switch (type) {
          case 'warning':
            console.warn(data);
            break;
          case 'error':
            console.error(data);
            break;
          default:
            console.log(`%crmp-vast%c${data}`, consoleStyleRmpVast, '');
            break;
        }

      }
    }
    if (dump) {
      console.log(dump);
    }
  }

}
