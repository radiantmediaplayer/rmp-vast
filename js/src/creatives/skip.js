import FW from '../fw/fw';
import HELPERS from '../utils/helpers';
import VASTPLAYER from '../players/vast-player';

const SKIP = {};

const _setCanBeSkippedUI = function () {
  FW.setStyle(this.skipWaiting, { display: 'none' });
  FW.setStyle(this.skipMessage, { display: 'block' });
  FW.setStyle(this.skipIcon, { display: 'block' });
};

const _updateWaitingForCanBeSkippedUI = function (delta) {
  if (Math.round(delta) > 0) {
    this.skipWaiting.textContent = this.params.skipWaitingMessage + ' ' + Math.round(delta) + 's';
  }
};

const _onTimeupdateCheckSkip = function () {
  if (this.skipButton.style.display === 'none') {
    FW.setStyle(this.skipButton, { display: 'block' });
  }
  this.vastPlayerCurrentTime = this.vastPlayer.currentTime;
  if (FW.isNumber(this.vastPlayerCurrentTime) && this.vastPlayerCurrentTime > 0) {
    const skipoffsetSeconds = FW.convertOffsetToSeconds(this.skipoffset, this.vastPlayerDuration);
    if (this.vastPlayerCurrentTime >= skipoffsetSeconds) {
      this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
      _setCanBeSkippedUI.call(this);
      this.skippableAdCanBeSkipped = true;
      HELPERS.createApiEvent.call(this, 'adskippablestatechanged');
    } else if (skipoffsetSeconds - this.vastPlayerCurrentTime > 0) {
      _updateWaitingForCanBeSkippedUI.call(this, skipoffsetSeconds - this.vastPlayerCurrentTime);
    }
  }
};

const _onClickSkip = function (event) {
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  if (this.skippableAdCanBeSkipped) {
    // create API event 
    HELPERS.createApiEvent.call(this, 'adskipped');
    // request ping for skip event
    if (this.hasSkipEvent) {
      HELPERS.dispatchPingEvent.call(this, 'skip');
    }
    // resume content
    VASTPLAYER.resumeContent.call(this);
  }
};

SKIP.append = function () {
  this.skipButton = document.createElement('div');
  this.skipButton.className = 'rmp-ad-container-skip';
  FW.setStyle(this.skipButton, { display: 'none' });
  HELPERS.accessibleButton(this.skipButton, 'skip ad button');

  this.skipWaiting = document.createElement('div');
  this.skipWaiting.className = 'rmp-ad-container-skip-waiting';
  _updateWaitingForCanBeSkippedUI.call(this, this.skipoffset);
  FW.setStyle(this.skipWaiting, { display: 'block' });

  this.skipMessage = document.createElement('div');
  this.skipMessage.className = 'rmp-ad-container-skip-message';
  this.skipMessage.textContent = this.params.skipMessage;
  FW.setStyle(this.skipMessage, { display: 'none' });

  this.skipIcon = document.createElement('div');
  this.skipIcon.className = 'rmp-ad-container-skip-icon';
  FW.setStyle(this.skipIcon, { display: 'none' });

  this.onClickSkip = _onClickSkip.bind(this);
  this.skipButton.addEventListener('click', this.onClickSkip);
  this.skipButton.addEventListener('touchend', this.onClickSkip);
  this.skipButton.appendChild(this.skipWaiting);
  this.skipButton.appendChild(this.skipMessage);
  this.skipButton.appendChild(this.skipIcon);
  this.adContainer.appendChild(this.skipButton);
  this.onTimeupdateCheckSkip = _onTimeupdateCheckSkip.bind(this);
  this.vastPlayer.addEventListener('timeupdate', this.onTimeupdateCheckSkip);
};


export default SKIP;
