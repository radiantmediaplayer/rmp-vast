import { FW } from '../fw/fw';
import { PING } from '../tracking/ping';
import { API } from '../api/api';
import { VASTERRORS } from '../utils/vast-errors';

const HELPERS = {};

HELPERS.playPromise = function (whichPlayer, firstPlayerPlayRequest) {
  let targetPlayer;
  switch (whichPlayer) {
    case 'content':
      targetPlayer = this.contentPlayer;
      break;
    case 'vast':
      targetPlayer = this.vastPlayer;
      break;
    default:
      break;
  }
  if (targetPlayer) {
    let playPromise = targetPlayer.play();
    // on Chrome 50+ play() returns a promise
    // https://developers.google.com/web/updates/2016/03/play-returns-promise
    // but not all browsers support this - so we just catch the potential Chrome error that 
    // may result if pause() is called in between - pause should overwrite play 
    // and in this case causes a promise rejection
    if (playPromise !== undefined) { 
      playPromise.then(() => {
        if (DEBUG) {
          FW.log('RMP-VAST: playPromise on ' + whichPlayer + ' player has resolved');
        }
      }).catch((e) => {
        if (firstPlayerPlayRequest && whichPlayer === 'vast' && this.adIsLinear) {
          if (DEBUG) {
            FW.log(e);
            FW.log('RMP-VAST: initial play promise on VAST player has been rejected - likely autoplay is being blocked');
          }
          PING.error.call(this, 400, this.inlineOrWrapperErrorTags);
          VASTERRORS.process.call(this, 400);
          API.createEvent.call(this, 'adinitialplayrequestfailed');
        } else if (firstPlayerPlayRequest && whichPlayer === 'content' && !this.adIsLinear) {
          if (DEBUG) {
            FW.log(e);
            FW.log('RMP-VAST: initial play promise on content player has been rejected - likely autoplay is being blocked');
          }
          API.createEvent.call(this, 'adinitialplayrequestfailed');
        } else {
          if (DEBUG) {
            FW.log(e);
            FW.log('RMP-VAST: playPromise on ' + whichPlayer + ' player has been rejected');
          }
        }
      });
    }
  }
};


export { HELPERS };
