export default class Logger {

  static _rawConsoleLogs(dump) {
    if (dump === null) {
      console.log('null');
    } else if (typeof dump === 'object') {
      try {
        console.log(JSON.stringify(dump));
      } catch (error) {
        console.warn(error);
      }
    } else if (typeof dump.toString !== 'undefined') {
      console.log(dump.toString());
    }
  }


  static printVideoEvents(debugRawConsoleLogs, video, type) {
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
          Logger.print(debugRawConsoleLogs, `${type} video player event "${e.type}"`);
        }
      });
    });
  }

  static print(debugRawConsoleLogs, data, dump) {
    const consoleStyleRmpVast = `color: white; background-color: #00ACC1; padding:1px 3px; border-radius: 3px; margin-right: 7px;`;

    if (debugRawConsoleLogs) {
      if (data) {
        console.log(`RMP-VAST: ${data}`);
      }
      if (typeof dump !== 'undefined') {
        Logger._rawConsoleLogs(dump);
      }
    } else {
      if (data) {
        console.log(`%crmp-vast%c${data}`, consoleStyleRmpVast, '');
      }
      if (dump) {
        console.log(dump);
      }
    }
  }

}
