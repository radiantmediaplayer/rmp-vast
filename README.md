# rmp-vast

A client-side JavaScript solution to load, parse and display VAST resources (advertising).

It aims at closely implementing the [IAB VAST 3 specification](https://www.iab.com/guidelines/digital-video-ad-serving-template-vast-3-0/) for web-based environments 
(e.g. browser, WebView ...) where both HTML5 video and JavaScript are available.

rmp-vast is used (beta) and maintained by [Radiant Media Player](https://www.radiantmediaplayer.com/).

rmp-vast is an open-source project released under [MIT license](https://github.com/radiantmediaplayer/rmp-vast/blob/master/LICENSE). It is built with ES2015 JavaScript and ported to ES5 JavaScript with Babel.

## Supported VAST 3 features
- Inline and Wrapper Ads
- Linear Ads (MP4/WebM or HLS where natively supported)
- Skippable Linear Ads (MP4/WebM or HLS where natively supported)
- Non Linear Ads (Images)
- Tracking Events (tracking URLs must return an image - generally a 1px GIF/PNG/JPG)
- Error Reporting
- Industry Icons
- VAST 3 Macros

VAST 2 resources should also be compatible with rmp-vast.

rmp-vast scope is not to implement all aspects of the VAST 3 specification but rather provide 
enough coverage to support current industry requirements and best practices.

## Additional supported features
- Mobile compatible (Android + iOS)
- Autoplay support (muted autoplay on mobile)
- API to build a fully fledged player on top of rmp-vast

## Currently unsupported VAST features
- Ad Pods
- Companion Ads
- VPAID
- VMAP

## Supported environments

### Browsers
- Chrome for Android 5+
- Chrome for Desktop
- Firefox for Android 5+
- Firefox for Desktop
- Safari 10+ for macOS
- Safari for iOS 10+
- MS Edge for Desktop
- Internet Explorer 11+ for Desktop
- Opera for Desktop
- Vivaldi for Desktop

Specifically we support the latest stable release for each browser

### WebViews
- Android 5+
- iOS 10+

It is fairly possible that rmp-vast would work in other environments but they are not officially supported.

## Quick start guide
First download latest rmp-vast package from the [release tab](https://github.com/radiantmediaplayer/rmp-vast/releases).

You must use rmp-vast in a well-formed HTML document. This means a web-page with a valid HTML5 DOCTYPE and other elements that are commonly available in today's web. See app/index.html for an example.

- Include rmp-vast.min.css
- Include rmp-vast.min.js - for debug logs include rmp-vast.debug.js (minified + logs) or rmp-vast.js (unminified + logs)
- In order to use rmp-vast you must adhere to a specific HTML layout pattern. This pattern is as follows: 
```
<div class="rmp-container" id="rmpPlayer">
  <div class="rmp-content">
    <video class="rmp-video" preload="none" playsinline>
      <source src="https://www.rmp-streaming.com/media/bbb-360p.mp4" type="video/mp4">
      <source src="https://www.rmp-streaming.com/media/bbb-360p.webm" type="video/webm">
    </video>
  </div>
</div>
```
This structure must not be altered. CSS classes must not be renamed.
- Init rmp-vast with JavaScript:
```
var adTag = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-5.xml';
var id = 'rmpPlayer';
var container = document.getElementById(id);
var video = container.getElementsByClassName('rmp-video')[0];
var rmpVast = new RmpVast(id);
var _onPlayLoadAds = function () {
  video.removeEventListener('play', _onPlayLoadAds);
  rmpVast.loadAds(adTag);
};
video.addEventListener('play', _onPlayLoadAds);
// on mobile devices this needs to be the result of a user-interaction
rmpVast.play();
```
A complete implementation example is provided in the app/ folder. You should look at 
app/js/app.js. 
This example can be found live at https://www.radiantmediaplayer.com/rmp-vast/app/.

## Documentation
Source code for rmp-vast is available for review in js/src/ folder. Code comments should be available at key points to better understand rmp-vast inner workings.

### Creating a rmp-vast instance
Once rmp-vast is loaded on your page you can create a new rmp-vast instance as follows:

`new RmpVast(id, params)`

`id: String` is the id for the player container. This is a required parameter

`params: Object` is an optional object representing various parameters that can be passed to a rmp-vast instance and that will affect the player inner-workings. Available properties for the params object follow:

`params.ajaxTimeout: Number` timeout in ms for an AJAX request to load a VAST tag from the ad server. Default 10000.

`params.ajaxWithCredentials: Boolean` AJAX request to load VAST tag from ad server should or should not be made with credentials. Default: true.

`params.maxNumRedirects: Number` the number of VAST wrappers the player should follow before triggering an error. Default: 4.

`params.pauseOnClick: Boolean` when an ad is clicked - pause or not VAST player (linear) or content player (non-linear). Default: true.

`params.skipMessage: String` the skip message to show on player when a skippable ad is detected and the ad is in a state where it can be skipped. Default: 'Skip ad'.

`params.skipWaitingMessage: String` the skip message to show on player when a skippable ad is detected and the ad is in a state where it cannot be skipped. Default: 'Skip ad in'. This will be completed by the number of seconds remaining before the ad state changes to a state where it can be skipped.

`params.textForClickUIOnMobile: String` on mobile devices the click-through URL for a linear ad is provided in a box located at the top right corner of the player. This setting set the text for this box. Default: 'Learn more'.

### Starting the rmp-vast player
It is important that the rmp-vast instance is properly initialized to avoid playback issues. 

Playing video ads in HTML5 video is a non-trivial process that requires the overlaying of multiple video tags or changes in source depending on the targeted environments. On mobile devices a user interaction is required to properly initialized a video tag and various restrictions are set by the OS to limit the manipulation of a video tag with JavaScript.

To sum up: use the rmp-vast API `play()` method to start playback. On mobile devices this should be the result of a direct user interaction. You can also use autoplay (desktop) or muted autoplay (mobiles) to start playback. Refer to the autoplay support section.

### API events
rmp-vast will fire VAST-related events on the player container as they occur. 

Events are registered and unregistered with the addEventListener and removeEventListener JavaScript methods set on the player container. Example:
```
var id = 'rmpPlayer';
var container = document.getElementById(id);
...
container.addEventListener('adloaded', function() {
  console.log('adloaded event');
});
```
Available events are:
- `adtagstartloading`
- `adtagloaded`
- `adfollowingredirect`
- `adloaded`
- `addurationchange`
- `adimpression`
- `adstarted`
- `adpaused`
- `adresumed`
- `adskipped`
- `adskippablestatechanged`
- `adfirstquartile`
- `admidpoint`
- `adthirdquartile`
- `adcomplete`
- `adclick`
- `advolumemuted`
- `advolumechanged`
- `aderror`
- `addestroyed`

### API methods
Once a rmp-vast instance is created you can query the API methods to interact with the player. Example:
```
var rmpVast = new RmpVast(id);
rmpVast.play();
```
For linear ads rmp-vast exposes 2 players: a content player (for the actual content) and a vast player (for the loaded ad).
- `play()`: play content or vast player depending on what is on stage
- `pause()`: pause content or vast player depending on what is on stage
- `getAdPaused()`: return a boolean stating if the ad on stage is paused or not. Null is returned if no ad is on stage or if the ad is non-linear
- `seekTo(ms)`: seek content to the given timestamp (milliseconds). If a linear ad is on stage this has no effect (ad should not be seekable)
- `setVolume(volume)`: set the volume of the content or vast player depending on what is on stage. Input value should be a number between 0 and 1
- `getVolume()`: return the volume of the content or vast player depending on what is on stage. Returned value is a number between 0 and 1
- `setMute(muted)`: set the mute state of the content or vast player depending on what is on stage. Input value should be a boolean
- `getMute()`: return the mute state of the content or vast player depending on what is on stage.  Returned value is a boolean
- `setFullscreen(fs)`: enter or exit fullscreen for the content or vast player depending on what is on stage. Input value should be a boolean
- `getFullscreen()`: return the fullscreen state of the content or vast player depending on what is on stage.  Returned value is a boolean
- `stopAds()`: stop playing the ad on stage (either linear or non-linear)
- `getAdTagUrl()`: return a string representing the current VAST tag URL
- `getAdOnStage()`: return a boolean stating if an ad (linear or non-linear) is currently on stage
- `getInitialized()`: return a boolean stating if rmp-vast has been initialized

The following methods should be queried after the `adstarted` event has fired for accurate data:
- `getAdMediaUrl()`: return a string representing the selected creative URL
- `getAdLinear()`: return a boolean representing the type of the selected creative either linear (true) or non linear (false)
- `getAdSystem()`: return a string representing the VAST AdSystem tag
- `getAdContentType()`: return a string representing the MIME type for the selected creative
- `getAdTitle()`: return a string representing the VAST AdTitle tag
- `getAdDescription()`: return a string representing the VAST Description tag
- `getAdDuration()`: return a number in ms representing the duration of the selected linear creative
- `getAdCurrentTime()`: return a number in ms representing the current timestamp in the selected linear creative
- `getAdMediaWidth()`: return a number representing the width of the selected creative
- `getAdMediaHeight()`: return a number representing the height of the selected creative
- `getClickThroughUrl()`: return a string representing the click-through (e.g. destination) URL for the selected creative

The following methods should be queried after the `aderror` event has fired for accurate data:
- `getAdErrorMessage()`: return a string representing the error message for the current error
- `getAdVastErrorCode()`: return a string representing the VAST error code for the current error

The following methods provide context information for the rmp-vast instance:
- `getEnv()`: returns the environment object
- `getFW()`: returns the core internal rmp-vast framework
- `getFWVAST()`: returns the VAST-specific internal rmp-vast framework
- `getVastPlayer()`: returns the VAST player video tag
- `getContentPlayer()`: returns the content player video tag
- `getIsUsingContentPlayerForAds()`: on iOS (which we love) the VAST player is the content player. This is to avoid fullscreen management issues and to provide a consistent user experience. This method will return true for iOS, false otherwise
 
## Autoplay support
This is done by adding the `autoplay` attribute to the video tag having the `rmp-video` class. For muted autoplay (mobile) also add the `muted` attribute on this element. After that you just need to wait for the `play` event on the content player and call `loadAds` method. See the test/LinearMutedAutoplaySpec.html file for a complete example.

Detecting autoplay capabilities for a targeted device is not within rmp-vast scope of support but we strongly encourage you use a feature detection script to do so. At Radiant Media Player we use [rmp-detect-autoplay]( https://github.com/radiantmediaplayer/rmp-detect-autoplay) which we have created for this specific purpose. Indeed OS may apply restrictions and users may have specific settings or accessibility requirements that can prevent autoplay of HTML5 video. In order to provide a good user experience and to avoid technical issues it is best to feature detect autoplay support before using it.

## Contributing
Contributions are welcome. Please review general code structure and stick to existing patterns.
Provide test where appropriate (see test/ folder). Tests are written with Jasmine and are validated in latest stable Chrome for Windows 10.

To develop rmp-vast do install it:

`git clone https://github.com/radiantmediaplayer/rmp-vast.git`

`npm install`

Please review grunt/shell.js - you need to have jshint, browserify, watchify, uglifyjs and stylelint installed globally to move forward

Make changes to code and then run:

`grunt build`

You can also use 

`grunt concurrent` 

to make developement easier (watchify task) and use the app/dev.html file (which references js/dist/rmp-vast.js).

Before committing for a pull request - run test:

go into test/ folder and run any .html files that may have been affected by your changes (title for .html files should be explicit) - run test in latest Chrome for Windows 10. Add tests if your changes are not covered by existing tests.