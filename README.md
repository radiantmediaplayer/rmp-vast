# rmp-vast

A client-side JavaScript solution to load, parse and display VAST resources (advertising).

It aims at implementing the [IAB VAST 4.2 specification](https://iabtechlab.com/standards/vast/) for web-based environments (e.g. browser, WebView ...) where both HTML5 video and JavaScript are available. VAST 2 and VAST 3 support is also provided.

rmp-vast is written in ES2017 and does not include any polyfill or transpiling to ES5 for backward compatibility. It is up to you to transpile/polyfill the library if needs be.

rmp-vast makes use of [vast-client-js](https://github.com/dailymotion/vast-client-js) for fetching and parsing VAST XML resources.

rmp-vast is used and maintained by [Radiant Media Player](https://www.radiantmediaplayer.com/).

## Documentation sections
- [Supported VAST 4.2 features](#supported-vast-3-features)
- [Supported environments](#supported-environments)
- [CORS requirements](#cors-requirements)
- [Video ads from Google Ads network and rmp-vast](#video-ads-from-google-ads-network-and-rmp-vast)
- [Quick start guide](#quick-start-guide)
- [Parameters, API events and methods](#parameters-api-events-and-methods)
  * [Parameters when creating a rmp-vast instance](#parameters-when-creating-a-rmp-vast-instance)
  * [Starting the rmp-vast player](#starting-the-rmp-vast-player)
  * [API events](#api-events)
  * [API methods](#api-methods)
- [Companion ads support](#companion-ads-support)
- [VPAID support](#vpaid-support)
- [Autoplay support](#autoplay-support)
- [Fullscreen management](#fullscreen-management)
- [Pre, mid and post rolls](#pre-mid-and-post-rolls)
- [Outstream ads](#outstream-ads)
- [Changes from v2 to v3](#changes-from-v2-to-v3)
- [Contributing](#contributing)
- [License](#license)
- [Radiant Media Player](#radiant-media-player)

## Supported VAST 4.2 features
- Inline and Wrapper Ads
- Linear Ads (MP4/WebM or HLS, DASH where natively supported)
- Skippable Linear Ads (MP4/WebM or HLS, DASH where natively supported)
- Non Linear Ads (image/iframe/HTML)
- Companion Ads (image/iframe/HTML)
- Tracking Events (tracking URLs must return an image - typically a 1px GIF/PNG/JPG)
- Error Reporting
- Industry Icons (image/iframe/HTML)
- VAST 4.2 Macros
- AdVerifications (OMID Web) <sup>TO BE COMING SOON</sup>
- VPAID 1 and 2 JavaScript (deprecated)
- Outstream ads
- Ad Pods
- Audio Ads (MP3/M4A/HLS where natively supported) in HTML5 video
- ViewableImpression, Universal Ad ID, AdServingId, Survey and Ad Categories

### Additional supported features
- Mobile compatible (Android + iOS)
- Autoplay support (muted autoplay on iOS, Android, Desktop Chrome 66+ and Desktop Safari 11+)
- API to build a fully fledged player on top of rmp-vast

### Currently unsupported features
- SIMID (PR welcome)
- VMAP

[Back to documentation sections](#documentation-sections)

## Supported environments

### Browsers
- Chrome 61+ for Android 5+
- Chrome 61+ for Desktop
- Firefox 60+ for Android 5+
- Firefox 60+ for Desktop
- Opera 62+ for Android 5+
- Opera 62+ for Desktop
- Samsung Internet 13+ for Android 5+
- Safari 11+ for macOS
- Safari for iOS 12+ and iPadOS 13+
- MS Edge 79+ for Desktop
- MS Edge Legacy 18+ for Desktop

Desktop means Windows 7+, macOS 10.11+, Linux (latest LTS Ubuntu).

### WebViews
- Android 5+
- iOS 12+ (WKWebView)

With the announcement of Apple in december 2019, to remove support for UIWebView API by end 2020, we only support WKWebView API for iOS apps built with Cordova, Ionic or WebView. [See this blog post](https://www.radiantmediaplayer.com/blog/updating-ios-apps-for-wkwebview.html) to help you update to WKWebView API.

It is fairly possible that rmp-vast would work in other environments but they are not officially supported.

[Back to documentation sections](#documentation-sections)

## CORS requirements
rmp-vast uses JavaScript XMLHttpRequests to load VAST tags. Hence proper [CORS configuration](https://enable-cors.org/) is required on your ad-server in order for rmp-vast to be able to retrieve VAST tags. Refer to this [Google documentation](https://developers.google.com/interactive-media-ads/docs/sdks/html5/cors) for more information.

[Back to documentation sections](#documentation-sections)

## Video ads from Google Ads network and rmp-vast

When serving ads from Google Ads network (DFP, ADX, AdSense for Video) you must use [Google IMA HTML5 SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/). Radiant Media Player supports [Google IMA HTML5 SDK](https://www.radiantmediaplayer.com/docs/latest/video-ads-documentation.html) and is a certified [Google's video technology partner](https://support.google.com/admanager/answer/186110?hl=en). ADX and AdSense for Video ads will not render with rmp-vast. DFP ads may render with rmp-vast but we cannot guarentee full support.

[Back to documentation sections](#documentation-sections)

## Quick start guide
First download latest rmp-vast package from the [release tab](https://github.com/radiantmediaplayer/rmp-vast/releases).

You must use rmp-vast in a well-formed HTML document. This means a web-page with a valid HTML5 DOCTYPE and other elements that are commonly available in today's web. See app/index.html for an example.

- Include rmp-vast.min.css
- In order to use rmp-vast you must adhere to a specific HTML layout pattern. This pattern is as follows: 
```html
<div class="rmp-container" id="rmpPlayer">
  <div class="rmp-content">
    <video class="rmp-video" src="https://www.rmp-streaming.com/media/big-buck-bunny-360p.mp4" playsinline></video>
  </div>
</div>
```
This structure must not be altered. CSS classes on the above elements must not be renamed.
The HTML5 video tag used for content must use the src property on the HTML5 video (e.g. do not use source tag).
- Import rmp-vast and init the library with JavaScript:
```javascript
import { RmpVast } from './js/src/index.js';
var adTag = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';
var id = 'rmpPlayer';
var params = {
  ajaxTimeout: 8000
};

// create RmpVast instance
var rmpVast = new RmpVast(id, params);

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

[Back to documentation sections](#documentation-sections)

## Parameters, API events and methods
Source code for rmp-vast is available for review in js/src/ folder. Code comments should be available at key points to better understand rmp-vast inner workings.

### Parameters when creating a rmp-vast instance
Once rmp-vast library is loaded on your page you can create a new rmp-vast instance as follows:

`new RmpVast(id: String, params: Object, debug: Boolean)`

`id: String` is the id for the player container. This is a required parameter.

`params: Object` is an optional object representing various parameters that can be passed to a rmp-vast instance and that will affect the player inner-workings. Available properties for the params object follow:

`params.ajaxTimeout: Number` timeout in ms for an AJAX request to load a VAST tag from the ad server. Default 8000.

`params.creativeLoadTimeout: Number` timeout in ms to load linear media creative from the server. Default 10000.

`params.ajaxWithCredentials: Boolean` AJAX request to load VAST tag from ad server should or should not be made with credentials. Default: false.

`params.maxNumRedirects: Number` the number of VAST wrappers the player should follow before triggering an error. Default: 4. Capped at 30 to avoid infinite wrapper loops.

`params.labels: Object` labels used to display information to the viewer. 

`params.labels.skipMessage: String` skip message. Default: 'Skip ad'.

`params.labels.closeAd: String` close ad message. Default: 'Close ad'.

`params.labels.textForClickUIOnMobile: String` on mobile devices the click-through URL for a linear ad is provided in a box located at the top right corner of the player. This setting set the text for this box. Default: 'Learn more'.

`params.outstream: Boolean` Enables outstream ad mode. Default: false.

`params.enableVpaid: Boolean` Enables VPAID support or not. Default: true.

`params.showControlsForVastPlayer: Boolean` Shows VAST player HTML5 default video controls. Only works when `debug` setting is true. Default: true.

`params.vpaidSettings: Object` information required to properly display VPAID creatives - note that it is to the parent application of rmp-vast to provide those informations - below values are default (see test/spec/vpaidSpec/ for examples):
```javascript
vpaidSettings: {
  width: 640,
  height: 360,
  viewMode: 'normal',
  desiredBitrate: 500
}
```

`debug: Boolean` display debug console logs in browser dev tools. Default: false.

[Back to documentation sections](#documentation-sections)

### Starting the rmp-vast player
It is important for the rmp-vast instance to be properly initialized to avoid playback issues. 

Playing video ads in HTML5 video is a non-immediate process that requires the overlaying of multiple video tags or changes in content source depending on the targeted environments. On mobile devices a user interaction is required to properly initialized a video tag and various restrictions are set by the OS to limit manipulation of a video tag with JavaScript.

To sum up: use the rmp-vast API `loadAds()` method to start playback. On mobile devices this should be the result of a direct user interaction. You can also use autoplay (desktop) or muted autoplay (mobiles) to start playback. Refer to the autoplay support section.

If you do not want to call `loadAds()` method directly - call `initialize()` method (as a result of a user interaction or on page 
load for autoplay) then call `loadAds()` later on when you wish to load a VAST tag.

[Back to documentation sections](#documentation-sections)

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
- `adloaded`
- `addurationchange`
- `adclick`
- `adclosed`
- `adimpression`
- `adcollapse`
- `adstarted`
- `adtagloaded`
- `adprogress`
- `adviewable`
- `adviewundetermined`
- `adinitialplayrequestfailed`
- `adinitialplayrequestsucceeded`
- `adpaused`
- `adresumed`
- `adtagstartloading`
- `advolumemuted`
- `advolumechanged`
- `adcomplete`
- `adskipped`
- `adskippablestatechanged`
- `adfirstquartile`
- `admidpoint`
- `adthirdquartile`
- `aderror`
- `addestroyed`
- `adpodcompleted`

The `adinitialplayrequestfailed` event tells if the vast (or content in case of non-linear creatives) player was able to play on first attempt. Typically this event will fire when autoplay is requested but blocked by an interference engine (macOS Safari 11+, Chrome 66+, browser extensions ...). If the initial play request was a success, the `adinitialplayrequestsucceeded` event will fire.

VPAID-related events:
- `adlinearchange`
- `adsizechange`
- `adexpandedchange`
- `adremainingtimechange`
- `adinteraction`
- `aduseracceptinvitation`
- `adcollapse`

[Back to documentation sections](#documentation-sections)

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
- `play()`: play content or vast player depending on what is on stage.
- `pause()`: pause content or vast player depending on what is on stage.
- `loadAds(vastUrl: String, regulationsInfo: Object, requireCategory: Boolean)`: load a new VAST tag and start displaying it - if rmp-vast is not initialized when loadAds is called then `initialize()` is called first. Input parameters are
  - `vastUrl: String` the URI to the VAST resource to be loaded
  - `regulationsInfo: Object` data for regulations as 
    - `regulationsInfo.regulations: String` coppa|gdpr for REGULATIONS macro
    - `regulationsInfo.limitAdTracking: String` 0|1 for LIMITADTRACKING macro
    - `regulationsInfo.gdprConsent: String` Base64-encoded Cookie Value of IAB GDPR consent info for GDPRCONSENT macro
  - `requireCategory: Boolean` for enforcement of VAST 4 Ad Categories
- `initialize()`: initialize rmp-vast - this method can be used in case of deferred use of `loadAds()` - Note that when autoplay is not wanted the call to `initialize()` must be the result of a direct user interaction.
- `getAdPaused()`: return `Boolean`, stating if the ad on stage is paused or not.
- `setVolume(volume: Number)`: set volume of (content|vast) player depending on what is on stage. Input value should be a `Number` between 0 and 1.
- `getVolume()`: return `Number`, the volume of (content|vast) player depending on what is on stage. Returned value is a number between 0 and 1. -1 is returned if this value is not available.
- `setMute(muted: Boolean)`: set mute state of (content|vast) player depending on what is on stage.
- `getMute()`: return `Boolean`, the mute state of (content|vast) player depending on what is on stage.  Returned value is a Boolean.
- `stopAds()`: stop playing the ad on stage.
- `skipAd()`: skips the creative on stage - this method only has effects if the creative on stage is a skippable ad and can be skipped (e.g. `getAdSkippableState` returns true).
- `getAdTagUrl()`: return `String`, representing the current VAST tag URL.
- `getAdOnStage()`: return `Boolean`, stating if an ad is currently on stage.
- `getInitialized()`: return `Boolean`, stating if rmp-vast has been initialized.

The following methods should be queried after the `adstarted` event has fired for accurate data:
- `getAdMediaUrl()`: return `String`, representing the selected creative URL.
- `getAdLinear()`: return `Boolean`, representing the type of the selected creative either linear (true) or non linear (false).
- `getAdSystem()`: return `Object: {value: String, version: String}|null`, representing the VAST AdSystem tag.
- `getAdUniversalAdId()`: return `Object: {idRegistry: String, value: String}|null`, representing the VAST UniversalAdId tag.
- `getAdContentType()`: return `String`, representing the MIME type for the selected creative.
- `getAdTitle()`: return `String`, representing the VAST AdTitle tag.
- `getAdDescription()`: return `String`, representing the VAST Description tag.
- `getAdAdvertiser()`: return `Object: {id: String, value: String}|null`, representing the VAST Advertiser tag.
- `getAdPricing()`: return `Object: {value: String, model: String, currency: String}|null`, representing the VAST Pricing tag.
- `getAdSurvey()`: return `String`, representing the VAST Survey tag.
- `getAdAdServingId()`: return `String`, representing the VAST AdServingId tag.
- `getAdCategories()`: return `Object: {authority: String, value: String}|null`, representing the VAST Category tag.
- `getAdBlockedAdCategories()`: return `Object: {authority: String, value: String}|null`, representing the VAST BlockedAdCategories tag.
- `getAdDuration()`: return `Number` in ms, representing the duration of the selected linear creative. -1 is returned if this value is not available.
- `getAdCurrentTime()`: return `Number` in ms, representing the current timestamp in the selected linear creative. -1 is returned if this value is not available.
- `getAdRemainingTime()`: return `Number` in ms, representing the current time remaining in the selected linear creative. -1 is returned if this value is not available.
- `getAdMediaWidth()`: return `Number`, representing the width of the selected creative. -1 is returned if this value is not available.
- `getAdMediaHeight()`: return `Number`, representing the height of the selected creative. -1 is returned if this value is not available.
- `getClickThroughUrl()`: return `String`, representing the click-through (e.g. destination) URL for the selected creative.
- `getIsSkippableAd()`: return `Boolean`, stating if the loaded linear ad is a VAST skippable ad - can be querried when adloaded event fires.
- `getSkipTimeOffset()`: return `Number` giving the skip offset when a skippable ad is displayed.
- `getAdSkippableState()`: return `Boolean`, stating if the creative on stage can be skipped or not.
- `getContentPlayerCompleted()`: return `Boolean`, stating if content player has reached end of content.
- `setContentPlayerCompleted(value: Boolean)`: sets the contentPlayerCompleted state of the player, this is used when source on content player changes and we need to explicitly reset contentPlayerCompleted internal value so that content can resume as expected on next ad load.

Additional AdPod-related methods
- `getAdPodInfo()`: return `Object: {adPodCurrentIndex: Number, adPodLength: Number}|null` giving information about the currently playing pod.

Additional VPAID-related methods
- `resizeAd(width: Number, height: Number, viewMode: String)`: resizes the VPAID creative based on `width`, `height` and `viewMode`. viewMode should be either 'normal' or 'fullscreen'.
- `expandAd()`: expands the VPAID creative on stage.
- `collapseAd()`: collapses the VPAID creative on stage.
- `getVpaidCreative()`: return `Object|null` reference to the VPAID creative.
- `getAdExpanded()`: return `Boolean`, stating if the VPAID creative on stage is expanded or not.
- `getVPAIDCompanionAds()`: return `String`, providing ad companion details in VAST 3.0 format for the `<CompanionAds>` element.

The following methods should be queried after the `aderror` event has fired for accurate data:
- `getAdErrorMessage()`: return `String`, representing the error message for the current error.
- `getAdVastErrorCode()`: return `Number`, representing the VAST error code for the current error. -1 is returned if this value is not available.
- `getAdErrorType()`: return `String`, representing the detected ad error type, possible values: 'adLoadError', 'adPlayError' or '' (if unknown error type).

The following methods provide context information for the rmp-vast instance:
- `getEnvironment()`: return `Object`, the rmp-vast environment object.
- `getFramework()`: return `Object`, the core internal rmp-vast framework.
- `getVastPlayer()`: return `HTMLVideoElement`, the VAST player video tag.
- `getContentPlayer()`: return `HTMLVideoElement`, the content player video tag.
- `getIsUsingContentPlayerForAds()`: return `Boolean`, on iOS and macOS Safari the VAST player is the content player. This is to avoid fullscreen management and autoplay issues and to provide a consistent user experience. This method will return true for iOS and macOS Safari, false otherwise.

[Back to documentation sections](#documentation-sections)

## Companion ads support
We support StaticResource, IFrameResource and HTMLResource in Companion tags.
We also support AltText, CompanionClickThrough, CompanionClickTracking, TrackingEvents tags in Companion tags. We support "required" attribute for CompanionAds tag as well as "adSlotID" attribute for Companion tag. We also support CompanionAds in wrappers/redirects (The CompanionAds nearer to the final linear creative will be selected).

See test/spec/companionSpec/ for an example of implementation.

The following methods must be querried when the `adstarted` event fires for the master linear ad.

- `getCompanionAdsList(width: Number, height: Number)`: return `Array of Object|null`. Each Object in the Array represents a companion ad. Input `width` and `height` parameters are used to select companion ads based on available width and height for display. Each companion ad Object is represented as:
```javascript
{
  adSlotID: "RMPSLOTID-1"
  altText: "Radiant Media Player logo"
  companionClickThroughUrl: "https://www.radiantmediaplayer.com"
  companionClickTrackingUrl: "https://www.radiantmediaplayer.com/vast/tags/ping.gif?creativeType=companion&type=companionClickTracking"
  height: 250
  imageUrl: "https://www.radiantmediaplayer.com/vast/mp4s/companion.jpg"
  trackingEventsUri: [
    "https://www.radiantmediaplayer.com/vast/tags/ping.gif?creativeType=companion&type=creativeView", 
    "https://www.radiantmediaplayer.com/vast/tags/ping.gif?creativeType=companion&type=creativeViewTwo"
  ]
  width: 300
}
```
Not all fields may be available, so check availability before usage.
- `getCompanionAd(index: Number)`: return `HTMLElement|null` representing the companion ad. It takes a `Number` index parameter which represents the index of the wanted companion ad in the Array returned from `getCompanionAdsList` method. This method automates the required pinging for companion ads. Usage example:
```javascript
  container.addEventListener('adstarted', function () {
    // we need to call getCompanionAdsList BEFORE calling getCompanionAd so that 
    // rmp-vast can first create a collection of available companion ads based on getCompanionAdsList 
    // input parameters
    var list = rmpVast.getCompanionAdsList(900, 750);
    if (list && list.length === 3) {
      var img = rmpVast.getCompanionAd(2);
      if (img) {
        // we get our companion ad image and we can append it to DOM now
        // VAST trackers will be called automatically when needed
        var companionId = document.getElementById('companionId');
        companionId.appendChild(img);
      }
    }
  });
```
- `getCompanionAdsRequiredAttribute()`: return a String representing the "required" attribute for CompanionAds tag. Value can be all, any, none or an empty String when this attribute is not defined. See section 2.3.3.4 of VAST 3 specification for more information.

[Back to documentation sections](#documentation-sections)

## VPAID support
It is no secret that VPAID in the industry is a jungle and we need your help to best implement it. 
Any feedback and test adTags that can improve VPAID support in rmp-vast are welcome - open an issue when needed.
Current VPAID support limitations:
- supports only linear VPAID (non-linear support may be coming later)
- no support for changes in linearity (likely to cause playback issues): we need production adTag to test this but we have not found reliable resources for it - please share if you have some available

[Back to documentation sections](#documentation-sections)

## Autoplay support
This is done by simply calling `loadAds` method on page load (after HTML5 content video player is in DOM and rmp-vast library is loaded and instantiated). For muted autoplay (iOS, Android, Desktop Chrome 66+ and Desktop Safari 11+) also add the `muted` attribute on the HTML5 content video player.

[Back to documentation sections](#documentation-sections)

## Fullscreen management
rmp-vast supports fullscreen for the global player (e.g. content + vast players) but there is an extra layer to add to your application. See the app/js/app.js file around line 25 for an example of implementation.

[Back to documentation sections](#documentation-sections)

## Pre, mid and post rolls
rmp-vast can handle pre/mid/post rolls ad breaks through the loadAds API method. See test/spec/apiSpec/pre-mid-post-roll.html for an example.

[Back to documentation sections](#documentation-sections)

## Outstream ads
rmp-vast supports displaying outstream ads when parameter `outstream` is set to true. For an implementation example see test/spec/outstreamSpec/Simple.html.

[Back to documentation sections](#documentation-sections)

## Changes from v2 to v3
- rmp-vast v3 only comes as a ES2017 class that needs to be imported into your project. We do not provide any polyfill/transpiling to ES5 or ES2015. With that beind said rmp-vast can be tested out of the box in latest version of Chrome, Firefox or Safari
- removes params.pauseOnClick (always true now) and params.skipWaitingMessage settings
- params.skipMessage, params.textForClickUIOnMobile settings are now placed under params.labels.skipMessage and params.labels.textForClickUIOnMobile settings
- removes adfollowingredirect API event
- adds adprogress, adviewable, adviewundetermined API events
- adds adcollapse and aduseracceptinvitation API event for VPAID creatives
- getAdSystem now returns an Object 
- adds getAdUniversalAdId, getAdAdvertiser, getAdPricing, getAdSurvey, getAdAdServingId, getAdCategories, getAdBlockedAdCategories, getSkipTimeOffset API methods
- support for VAST 4, 4.1 and 4.2 features including latest VAST 4.2 macros
- companion ads support is now out of BETA 
- companion ads, non-linead ads and icons now support image, iframe and HTML content

## Contributing
Contributions are welcome. Please review general code structure and stick to existing patterns.
Provide test where appropriate (see test/ folder). Tests are written with Jasmine and automated with [selenium web driver 4.0.0-alpha.7](https://www.npmjs.com/package/selenium-webdriver) and are validated in latest webdriver for Chrome and Firefox for Windows 10. Additionally we test on latest Chrome for Android and macOS Safari.

To develop rmp-vast do install it (you need to have node.js installed globally):

`git clone https://github.com/radiantmediaplayer/rmp-vast.git`

`npm install`

Make changes to code and then run:

`grunt build`

Before committing for a pull request - run test:

`grunt test` 

For testing on Android use:

`grunt testAndroid` 

For testing on macOS Safari use:

`grunt testSafari` 

Before running `grunt test` make sure to update `TEST.pathToTest` in test/helpers/test.js with your local IP address. Running test on Android requires a [runnning adb server](https://developer.android.com/studio/command-line/adb.html).

## License
rmp-vast is released under MIT.

## Radiant Media Player
If you like rmp-vast you can check out [Radiant Media Player](https://www.radiantmediaplayer.com), a modern and versatile HTML5 video player for every device. 

Radiant Media Player is a commercial HTML5 media player, not covered by the above MIT license. 

You may request a free trial for Radiant Media Player at: [https://www.radiantmediaplayer.com/free-trial.html](https://www.radiantmediaplayer.com/free-trial.html).

[Back to documentation sections](#documentation-sections)
