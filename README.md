# rmp-vast

A client-side JavaScript solution to load, parse and display VAST resources (advertising).

It aims at closely implementing the [IAB VAST 3 specification](https://www.iab.com/guidelines/digital-video-ad-serving-template-vast-3-0/) for web-based environments 
(e.g. browser, WebView ...) where both HTML5 video and JavaScript are available.

rmp-vast is used and maintained by [Radiant Media Player](https://www.radiantmediaplayer.com/).

rmp-vast is an open-source project released under [MIT license](https://github.com/radiantmediaplayer/rmp-vast/blob/master/LICENSE). It is built with ES2015 JavaScript and ported to ES5 JavaScript with Babel.

## Supported VAST 3 features
- Inline and Wrapper Ads
- Linear Ads (MP4/WebM or HLS, DASH where natively supported)
- Skippable Linear Ads (MP4/WebM or HLS, DASH where natively supported)
- Non Linear Ads (Images)
- Tracking Events (tracking URLs must return an image - typically a 1px GIF/PNG/JPG)
- Error Reporting
- Industry Icons
- VAST 3 Macros
- VPAID 1 and 2 JavaScript
- Ad Pods
- Audio Ads (MP3/M4A/HLS where natively supported) in HTML5 video

VAST 2 resources should also be compatible with rmp-vast.

rmp-vast scope is not to implement all aspects of the VAST 3 specification but rather provide 
enough coverage to support current industry requirements and best practices.

## Additional supported features
- Mobile compatible (Android + iOS)
- Autoplay support (muted autoplay on mobile)
- API to build a fully fledged player on top of rmp-vast

## Currently unsupported VAST features
- Companion Ads
- VMAP

## Supported environments

### Browsers
- Chrome for Android 5+
- Chrome for Desktop
- Firefox for Android 5+
- Firefox for Desktop
- Samsung Internet 5+ for Android 5+
- Safari 10+ for macOS
- Safari for iOS 10+
- MS Edge for Desktop
- Internet Explorer 11+ for Desktop

Specifically we support the latest stable release for each browser

### WebViews
- Android 5+
- iOS 10+

It is fairly possible that rmp-vast would work in other environments but they are not officially supported.

## CORS requirements
rmp-vast uses JavaScript XMLHttpRequests to load VAST tags. Hence proper [CORS configuration](https://enable-cors.org/) is required on your ad-server in order for rmp-vast to be able to retrieve VAST tags. Refer to this [Google documentation](https://developers.google.com/interactive-media-ads/docs/sdks/html5/cors) for more information.

## Quick start guide
First download latest rmp-vast package from the [release tab](https://github.com/radiantmediaplayer/rmp-vast/releases).

You must use rmp-vast in a well-formed HTML document. This means a web-page with a valid HTML5 DOCTYPE and other elements that are commonly available in today's web. See app/index.html for an example.

- Include rmp-vast.min.css
- Include rmp-vast.min.js - for debug logs include rmp-vast.js instead
- In order to use rmp-vast you must adhere to a specific HTML layout pattern. This pattern is as follows: 
```html
<div class="rmp-container" id="rmpPlayer">
  <div class="rmp-content">
    <video class="rmp-video" src="https://www.rmp-streaming.com/media/bbb-360p.mp4" playsinline></video>
  </div>
</div>
```
This structure must not be altered. CSS classes on the above elements must not be renamed.
The HTML5 video tag used for content must use the src property on the HTML5 video (e.g. do not use source tag).
- Init rmp-vast with JavaScript:
```javascript
var adTag = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-5.xml';
var id = 'rmpPlayer';

// create RmpVast instance
var rmpVast = new RmpVast(id);

// call loadAds - this will start the ad loading process, display the ad and resume content automatically in the case of linear pre-roll
// in this case we use autoplay
rmpVast.loadAds(adTag);

// or if autoplay is not wanted the call to loadAds must be the result 
// of a user interaction (click, touchend ...)
// playButton.addEventListener('click', function() {
//   rmpVast.loadAds(adTag);
// });
```
A complete implementation example is provided in app/index.html. You should look at app/js/app.js. 
This example can be found live at https://www.radiantmediaplayer.com/rmp-vast/app/.

## Documentation
Source code for rmp-vast is available for review in js/src/ folder. Code comments should be available at key points to better understand rmp-vast inner workings.

### Creating a rmp-vast instance
Once rmp-vast library is loaded on your page you can create a new rmp-vast instance as follows:

`new RmpVast(id, params)`

`id: String` is the id for the player container. This is a required parameter.

`params: Object` is an optional object representing various parameters that can be passed to a rmp-vast instance and that will affect the player inner-workings. Available properties for the params object follow:

`params.ajaxTimeout: Number` timeout in ms for an AJAX request to load a VAST tag from the ad server. Default 8000.

`params.creativeLoadTimeout: Number` timeout in ms to load linear media creative from the server. Default 10000.

`params.ajaxWithCredentials: Boolean` AJAX request to load VAST tag from ad server should or should not be made with credentials. Default: false.

`params.maxNumRedirects: Number` the number of VAST wrappers the player should follow before triggering an error. Default: 4. Capped at 30 to avoid infinite wrapper loops.

`params.maxNumItemsInAdPod: Number` maximum number of Ad an AdPod can play. Default: 10.

`params.pauseOnClick: Boolean` when an ad is clicked - pause or not VAST player (linear) or content player (non-linear). Default: true.

`params.skipMessage: String` the skip message to show on player when a skippable ad is detected and the ad is in a state where it can be skipped. Default: 'Skip ad'.

`params.skipWaitingMessage: String` the skip message to show on player when a skippable ad is detected and the ad is in a state where it cannot be skipped. Default: 'Skip ad in'. This will be completed by the number of seconds remaining before the ad state changes to a state where it can be skipped.

`params.textForClickUIOnMobile: String` on mobile devices the click-through URL for a linear ad is provided in a box located at the top right corner of the player. This setting set the text for this box. Default: 'Learn more'.

`params.enableVpaid: Boolean` Enables VPAID support or not. Default: true.

`params.vpaidSettings: Object` information required to properly display VPAID creatives - note that it is to the parent application of rmp-vast to provide those informations - below values are default (see test/spec/vpaidSpec/ for examples):
```javascript
vpaidSettings: {
  width: 640,
  height: 360,
  viewMode: 'normal',
  desiredBitrate: 500
}
```

### Starting the rmp-vast player
It is important for the rmp-vast instance to be properly initialized to avoid playback issues. 

Playing video ads in HTML5 video is a non-trivial process that requires the overlaying of multiple video tags or changes in source depending on the targeted environments. On mobile devices a user interaction is required to properly initialized a video tag and various restrictions are set by the OS to limit the manipulation of a video tag with JavaScript.

To sum up: use the rmp-vast API `loadAds()` method to start playback. On mobile devices this should be the result of a direct user interaction. You can also use autoplay (desktop) or muted autoplay (mobiles) to start playback. Refer to the autoplay support section.

If you do not want to call `loadAds()` method directly - call `initialize()` method (as a result of a user interaction or on page 
load for autoplay) then call `loadAds()` later on when you wish to load a VAST tag.

### API events
rmp-vast will fire VAST-related events on the player container as they occur. 

Events are registered and unregistered with the addEventListener and removeEventListener JavaScript methods set on the player container. Example:
```javascript
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
- `adclosed`
- `aderror`
- `addestroyed`
- `adinitialplayrequestfailed`
- `adinitialplayrequestsucceeded`
- `adpodcompleted`: the current ad pod has finished playing all its Ad

The `adinitialplayrequestfailed` event tells if the vast (or content in case of non-linear creatives) player was able to play on first attempt. Typically this event will fire when autoplay is requested but blocked by an interference engine (macOS Safari 11+, Chrome 66+, Firefox w/ media.autoplay.enabled set to false, browser extensions ...). If the initial play request was a success, the `adinitialplayrequestsucceeded` event will fire.

VPAID-related events:
- `adlinearchange`
- `adsizechange`
- `adexpandedchange`
- `adremainingtimechange`
- `adinteraction`

### API methods
Once a rmp-vast instance is created you can query the API methods to interact with the player. Example:
```javascript
var rmpVast = new RmpVast(id);
...
rmpVast.pause();
...
rmpVast.setVolume(0.5);
```
For linear ads rmp-vast exposes 2 players: a content player (for the actual content) and a vast player (for the loaded ad).
- `play()`: play content or vast player depending on what is on stage
- `pause()`: pause content or vast player depending on what is on stage
- `loadAds()`: load a new VAST tag and start displaying it - if rmp-vast is not initialized when loadAds is called then `initialize()` is called first
- `initialize()`: initialize rmp-vast - this method can be used in case of deferred use of `loadAds()` - Note that when autoplay is not wanted the call to `initialize()` must be the result of a direct user interaction
- `getAdPaused()`: return (boolean|null) stating if the ad on stage is paused or not. Null is returned if no ad is on stage or if the ad is non-linear
- `setVolume(volume)`: set the volume of the content or vast player depending on what is on stage. Input value should be a number between 0 and 1
- `getVolume()`: return (number|null) the volume of the content or vast player depending on what is on stage. Returned value is a number between 0 and 1
- `setMute(muted)`: set the mute state of the content or vast player depending on what is on stage. Input value should be a boolean
- `getMute()`: return (boolean|null) the mute state of the content or vast player depending on what is on stage.  Returned value is a boolean
- `stopAds()`: stop playing the ad on stage (either linear or non-linear)
- `getAdTagUrl()`: return (string|null) representing the current VAST tag URL
- `getAdOnStage()`: return a (boolean) stating if an ad (linear or non-linear) is currently on stage
- `getInitialized()`: return a (boolean) stating if rmp-vast has been initialized

The following methods should be queried after the `adstarted` event has fired for accurate data:
- `getAdMediaUrl()`: return (string|null) representing the selected creative URL
- `getAdLinear()`: return (boolean|null) representing the type of the selected creative either linear (true) or non linear (false)
- `getAdSystem()`: return (string|null) representing the VAST AdSystem tag
- `getAdContentType()`: return (string|null) representing the MIME type for the selected creative
- `getAdTitle()`: return (string|null) representing the VAST AdTitle tag
- `getAdDescription()`: return (string|null) representing the VAST Description tag
- `getAdDuration()`: return (number|-1) in ms representing the duration of the selected linear creative
- `getAdCurrentTime()`: return (number|-1) in ms representing the current timestamp in the selected linear creative
- `getAdRemainingTime()`: return (number|-1) in ms representing the current time remaining in the selected linear creative
- `getAdMediaWidth()`: return (number|-1) representing the width of the selected creative
- `getAdMediaHeight()`: return (number|-1) representing the height of the selected creative
- `getClickThroughUrl()`: return (string|null) representing the click-through (e.g. destination) URL for the selected creative
- `getIsSkippableAd()`: return (boolean) stating if the loaded linear ad is a VAST skippable ad - can be querried when adloaded event fires
- `getContentPlayerCompleted()`: return (boolean) stating if content player has reached end of content
- `setContentPlayerCompleted(value)`: input value must be a (boolean) - sets the contentPlayerCompleted state of the player, this is used when source on content player changes and we need to explicitly reset contentPlayerCompleted internal value so that content can resume as expected on next ad load

Additional AdPod-related methods
- `getAdPodInfo()`: return (object|null) as {adPodCurrentIndex: Number, adPodLength: Number} giving information about the currently playing pod


Additional VPAID-related methods
- `resizeAd(width, height, viewMode)`: resizes the VPAID creative based on width (number), height (number) and viewMode (string). viewMode should be either 'normal' or 'fullscreen' 
- `expandAd()`: expands the VPAID creative on stage
- `collapseAd()`: collapses the VPAID creative on stage
- `skipAd()`: skips the VPAID creative on stage
- `getVpaidCreative()`: return (object|null) reference to the VPAID creative 
- `getAdExpanded()`: return (boolean|null) stating if the VPAID creative on stage is expanded or not
- `getAdSkippableState()`: return (boolean|null) stating if the VPAID creative on stage can be skipped or not
- `getAdCompanions()`: return (string|null) that provides ad companion details in VAST 3.0 format for the `<CompanionAds>` element

The following methods should be queried after the `aderror` event has fired for accurate data:
- `getAdErrorMessage()`: return (string) representing the error message for the current error
- `getAdVastErrorCode()`: return (number|-1) representing the VAST error code for the current error
- `getAdErrorType()`: return (string) representing the detected ad error type, possible values: 'adLoadError', 'adPlayError' or '' (if unknown error type)

The following methods provide context information for the rmp-vast instance:
- `getEnv()`: returns the environment object
- `getFW()`: returns the core internal rmp-vast framework
- `getVastPlayer()`: returns the VAST player video tag
- `getContentPlayer()`: returns the content player video tag
- `getIsUsingContentPlayerForAds()`: return (boolean) - on iOS and macOS Safari the VAST player is the content player. This is to avoid fullscreen management and autoplay issues and to provide a consistent user experience. This method will return true for iOS and macOS Safari, false otherwise

### VPAID support
**We need your help!**
It is no secret that VPAID in the industry is a jungle and we need your help to best implement it. 
Any feedback and test adTags that can improve VPAID support in rmp-vast are welcome - open an issue when needed.
Current VPAID support limitations:
- supports only linear VPAID (non-linear support may be coming later)
- no support for changes in linearity (likely to cause playback issues): we need production adTag to test this but we have not found reliable resources for it - please share if you have some available
 
### Autoplay support
This is done by simply calling `loadAds` method on page load (after HTML5 content video player is in DOM and rmp-vast library is loaded and instantiated). For muted autoplay (mobile) also add the `muted` attribute on the HTML5 content video player. See the test/LinearMutedAutoplaySpec.html file for an example.

### Fullscreen management
rmp-vast supports fullscreen for the global player (e.g. content + vast players) but there is an extra layer to add to your application. See the app/js/app.js file around line 25 for an example of implementation.

### pre/mid/post rolls
rmp-vast can handle pre/mid/post rolls ad breaks through the loadAds API method. See app/pre-mid-post-roll.html for an example.

## Contributing
Contributions are welcome. Please review general code structure and stick to existing patterns.
Provide test where appropriate (see test/ folder). Tests are written with Jasmine and automated with [node.js 6.11+ and selenium web driver 3.6+](https://www.npmjs.com/package/selenium-webdriver) and are validated in latest webdriver for Chrome, Firefox and MS Edge for Windows 10. Additionally we test on latest Chrome for Android 8 and macOS Safari 11.

To develop rmp-vast do install it:

`git clone https://github.com/radiantmediaplayer/rmp-vast.git`

`npm install`

Please review grunt/shell.js - you need to have jshint, browserify, watchify, uglifyjs, node and stylelint installed globally to move forward.

Make changes to code and then run:

`grunt build`

You can also use 

`grunt concurrent` 

to make developement easier (watchify task) and use the app/dev.html file (which references js/dist/rmp-vast.js).

Before committing for a pull request - run test:

`grunt test` 

For testing on Android use:

`grunt testAndroid` 

For testing on macOS Safari use:

`grunt testSafari` 

Before running `grunt test` make sure to update `TEST.pathToTest` in test/helpers/test.js with your local IP address. Running test on Android requires a [runnning adb server](https://developer.android.com/studio/command-line/adb.html).
