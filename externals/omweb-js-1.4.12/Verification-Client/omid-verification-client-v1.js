;(function(omidGlobal, factory, exports) {
  // CommonJS support
  if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(omidGlobal, exports);

  // If neither AMD nor CommonJS are used, export to a versioned name in the
  // global context.
  } else {
    var exports = {};
    var versions = ['1.4.12-iab4299'];
    var additionalVersionString = '';
    if (!!additionalVersionString) {
       versions.push(additionalVersionString);
    }

    factory(omidGlobal, exports);

    function deepFreeze(object) {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          object[key] = deepFreeze(object[key]);
        }
      }
      return Object.freeze(object);
    }

    // Inject and freeze the exported components of omid.
    for (var key in exports) {
      if (exports.hasOwnProperty(key)) {
        if (Object.getOwnPropertyDescriptor(omidGlobal, key) == null) {
          // Define the top level property in the global scope
          Object.defineProperty(omidGlobal, key, {
            value: {},
          });
        }
        versions.forEach(function(version) {
          if (Object.getOwnPropertyDescriptor(omidGlobal[key], version) == null) {
            var frozenObject = deepFreeze(exports[key]);
            // Define the object exports keyed-off versions
            Object.defineProperty(omidGlobal[key], version, {
              get: function () {
                return frozenObject;
              },
              enumerable: true,
            });
          }
        });
      }
    }
  }
}(typeof global === 'undefined' ? this : global, function(omidGlobal, omidExports) {
  var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function(a) {
  return a.raw = a;
};
$jscomp.createTemplateTagFirstArgWithRaw = function(a, b) {
  a.raw = b;
  return a;
};
$jscomp.arrayIteratorImpl = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++],} : {done:!0};
  };
};
$jscomp.arrayIterator = function(a) {
  return {next:$jscomp.arrayIteratorImpl(a)};
};
$jscomp.makeIterator = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (b) {
    return b.call(a);
  }
  if ("number" == typeof a.length) {
    return $jscomp.arrayIterator(a);
  }
  throw Error(String(a) + " is not an iterable or ArrayLike");
};
$jscomp.arrayFromIterator = function(a) {
  for (var b, c = []; !(b = a.next()).done;) {
    c.push(b.value);
  }
  return c;
};
$jscomp.arrayFromIterable = function(a) {
  return a instanceof Array ? a : $jscomp.arrayFromIterator($jscomp.makeIterator(a));
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function(a) {
  var b = function() {
  };
  b.prototype = a;
  return new b();
};
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  if (a == Array.prototype || a == Object.prototype) {
    return a;
  }
  a[b] = c.value;
  return a;
};
$jscomp.getGlobal = function(a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global,];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) {
      return c;
    }
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function(a, b, c) {
  if (!c || null != a) {
    c = $jscomp.propertyToPolyfillSymbol[b];
    if (null == c) {
      return a[b];
    }
    c = a[c];
    return void 0 !== c ? c : a[b];
  }
};
$jscomp.polyfill = function(a, b, c, d) {
  b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, c, d) : $jscomp.polyfillUnisolated(a, b, c, d));
};
$jscomp.polyfillUnisolated = function(a, b, c, d) {
  c = $jscomp.global;
  a = a.split(".");
  for (d = 0; d < a.length - 1; d++) {
    var e = a[d];
    if (!(e in c)) {
      return;
    }
    c = c[e];
  }
  a = a[a.length - 1];
  d = c[a];
  b = b(d);
  b != d && null != b && $jscomp.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
};
$jscomp.polyfillIsolated = function(a, b, c, d) {
  var e = a.split(".");
  a = 1 === e.length;
  d = e[0];
  d = !a && d in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var f = 0; f < e.length - 1; f++) {
    var g = e[f];
    if (!(g in d)) {
      return;
    }
    d = d[g];
  }
  e = e[e.length - 1];
  c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? d[e] : null;
  b = b(c);
  null != b && (a ? $jscomp.defineProperty($jscomp.polyfills, e, {configurable:!0, writable:!0, value:b}) : b !== c && (void 0 === $jscomp.propertyToPolyfillSymbol[e] && (c = 1E9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[e] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(e) : $jscomp.POLYFILL_PREFIX + c + "$" + e), $jscomp.defineProperty(d, $jscomp.propertyToPolyfillSymbol[e], {configurable:!0, writable:!0, value:b})));
};
$jscomp.getConstructImplementation = function() {
  function a() {
    function c() {
    }
    new c();
    Reflect.construct(c, [], function() {
    });
    return new c() instanceof c;
  }
  if ($jscomp.TRUST_ES6_POLYFILLS && "undefined" != typeof Reflect && Reflect.construct) {
    if (a()) {
      return Reflect.construct;
    }
    var b = Reflect.construct;
    return function(c, d, e) {
      c = b(c, d);
      e && Reflect.setPrototypeOf(c, e.prototype);
      return c;
    };
  }
  return function(c, d, e) {
    void 0 === e && (e = c);
    e = $jscomp.objectCreate(e.prototype || Object.prototype);
    return Function.prototype.apply.call(c, e, d) || e;
  };
};
$jscomp.construct = {valueOf:$jscomp.getConstructImplementation}.valueOf();
$jscomp.underscoreProtoCanBeSet = function() {
  var a = {a:!0}, b = {};
  try {
    return b.__proto__ = a, b.a;
  } catch (c) {
  }
  return !1;
};
$jscomp.setPrototypeOf = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(a, b) {
  a.__proto__ = b;
  if (a.__proto__ !== b) {
    throw new TypeError(a + " is not extensible");
  }
  return a;
} : null;
$jscomp.inherits = function(a, b) {
  a.prototype = $jscomp.objectCreate(b.prototype);
  a.prototype.constructor = a;
  if ($jscomp.setPrototypeOf) {
    var c = $jscomp.setPrototypeOf;
    c(a, b);
  } else {
    for (c in b) {
      if ("prototype" != c) {
        if (Object.defineProperties) {
          var d = Object.getOwnPropertyDescriptor(b, c);
          d && Object.defineProperty(a, c, d);
        } else {
          a[c] = b[c];
        }
      }
    }
  }
  a.superClass_ = b.prototype;
};
$jscomp.getRestArguments = function() {
  for (var a = Number(this), b = [], c = a; c < arguments.length; c++) {
    b[c - a] = arguments[c];
  }
  return b;
};
$jscomp.polyfill("Reflect", function(a) {
  return a ? a : {};
}, "es6", "es3");
$jscomp.polyfill("Reflect.construct", function(a) {
  return $jscomp.construct;
}, "es6", "es3");
$jscomp.polyfill("Reflect.setPrototypeOf", function(a) {
  if (a) {
    return a;
  }
  if ($jscomp.setPrototypeOf) {
    var b = $jscomp.setPrototypeOf;
    return function(c, d) {
      try {
        return b(c, d), !0;
      } catch (e) {
        return !1;
      }
    };
  }
  return null;
}, "es6", "es5");
$jscomp.owns = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
$jscomp.polyfill("Object.values", function(a) {
  return a ? a : function(b) {
    var c = [], d;
    for (d in b) {
      $jscomp.owns(b, d) && c.push(b[d]);
    }
    return c;
  };
}, "es8", "es3");
var module$exports$omid$common$constants = {AdEventType:{IMPRESSION:"impression", LOADED:"loaded", GEOMETRY_CHANGE:"geometryChange", SESSION_START:"sessionStart", SESSION_ERROR:"sessionError", SESSION_FINISH:"sessionFinish", MEDIA:"media", VIDEO:"video", START:"start", FIRST_QUARTILE:"firstQuartile", MIDPOINT:"midpoint", THIRD_QUARTILE:"thirdQuartile", COMPLETE:"complete", PAUSE:"pause", RESUME:"resume", BUFFER_START:"bufferStart", BUFFER_FINISH:"bufferFinish", SKIPPED:"skipped", VOLUME_CHANGE:"volumeChange", 
PLAYER_STATE_CHANGE:"playerStateChange", AD_USER_INTERACTION:"adUserInteraction", STATE_CHANGE:"stateChange",}, MediaEventType:{LOADED:"loaded", START:"start", FIRST_QUARTILE:"firstQuartile", MIDPOINT:"midpoint", THIRD_QUARTILE:"thirdQuartile", COMPLETE:"complete", PAUSE:"pause", RESUME:"resume", BUFFER_START:"bufferStart", BUFFER_FINISH:"bufferFinish", SKIPPED:"skipped", VOLUME_CHANGE:"volumeChange", PLAYER_STATE_CHANGE:"playerStateChange", AD_USER_INTERACTION:"adUserInteraction",}, ImpressionType:{DEFINED_BY_JAVASCRIPT:"definedByJavaScript", 
UNSPECIFIED:"unspecified", LOADED:"loaded", BEGIN_TO_RENDER:"beginToRender", ONE_PIXEL:"onePixel", VIEWABLE:"viewable", AUDIBLE:"audible", OTHER:"other",}, ErrorType:{GENERIC:"generic", VIDEO:"video", MEDIA:"media",}, AdSessionType:{NATIVE:"native", HTML:"html", JAVASCRIPT:"javascript",}, EventOwner:{NATIVE:"native", JAVASCRIPT:"javascript", NONE:"none",}, AccessMode:{FULL:"full", DOMAIN:"domain", LIMITED:"limited",}, AppState:{BACKGROUNDED:"backgrounded", FOREGROUNDED:"foregrounded",}, Environment:{APP:"app", 
WEB:"web",}, DeviceCategory:{CTV:"ctv", DESKTOP:"desktop", MOBILE:"mobile", OTHER:"other",}, InteractionType:{CLICK:"click", INVITATION_ACCEPT:"invitationAccept",}, CreativeType:{DEFINED_BY_JAVASCRIPT:"definedByJavaScript", HTML_DISPLAY:"htmlDisplay", NATIVE_DISPLAY:"nativeDisplay", VIDEO:"video", AUDIO:"audio",}, MediaType:{DISPLAY:"display", VIDEO:"video",}, Reason:{NOT_FOUND:"notFound", HIDDEN:"hidden", BACKGROUNDED:"backgrounded", VIEWPORT:"viewport", OBSTRUCTED:"obstructed", CLIPPED:"clipped", 
UNMEASURABLE:"unmeasurable", NO_WINDOW_FOCUS:"noWindowFocus", NO_OUTPUT_DEVICE:"noOutputDevice",}, SupportedFeatures:{CONTAINER:"clid", VIDEO:"vlid",}, VideoPosition:{PREROLL:"preroll", MIDROLL:"midroll", POSTROLL:"postroll", STANDALONE:"standalone",}, VideoPlayerState:{MINIMIZED:"minimized", COLLAPSED:"collapsed", NORMAL:"normal", EXPANDED:"expanded", FULLSCREEN:"fullscreen",}, NativeViewKeys:{X:"x", LEFT:"left", Y:"y", TOP:"top", WIDTH:"width", HEIGHT:"height", AD_SESSION_ID:"adSessionId", IS_FRIENDLY_OBSTRUCTION_FOR:"isFriendlyObstructionFor", 
CLIPS_TO_BOUNDS:"clipsToBounds", CHILD_VIEWS:"childViews", END_X:"endX", END_Y:"endY", OBSTRUCTIONS:"obstructions", OBSTRUCTION_CLASS:"obstructionClass", OBSTRUCTION_PURPOSE:"obstructionPurpose", OBSTRUCTION_REASON:"obstructionReason", PIXELS:"pixels", HAS_WINDOW_FOCUS:"hasWindowFocus",}, MeasurementStateChangeSource:{CONTAINER:"container", CREATIVE:"creative",}, ElementMarkup:{OMID_ELEMENT_CLASS_NAME:"omid-element",}, CommunicationType:{NONE:"NONE", DIRECT:"DIRECT", POST_MESSAGE:"POST_MESSAGE",}, 
OmidImplementer:{OMSDK:"omsdk",}, MessageMethod:{IDENTIFY_SERVICE_WINDOW:"identifyServiceWindow",}};
var module$contents$omid$common$InternalMessage_GUID_KEY = "omid_message_guid", module$contents$omid$common$InternalMessage_METHOD_KEY = "omid_message_method", module$contents$omid$common$InternalMessage_VERSION_KEY = "omid_message_version", module$contents$omid$common$InternalMessage_ARGS_KEY = "omid_message_args", module$exports$omid$common$InternalMessage = function(a, b, c, d) {
  this.guid = a;
  this.method = b;
  this.version = c;
  this.args = d;
};
module$exports$omid$common$InternalMessage.isValidSerializedMessage = function(a) {
  return !!a && void 0 !== a[module$contents$omid$common$InternalMessage_GUID_KEY] && void 0 !== a[module$contents$omid$common$InternalMessage_METHOD_KEY] && void 0 !== a[module$contents$omid$common$InternalMessage_VERSION_KEY] && "string" === typeof a[module$contents$omid$common$InternalMessage_GUID_KEY] && "string" === typeof a[module$contents$omid$common$InternalMessage_METHOD_KEY] && "string" === typeof a[module$contents$omid$common$InternalMessage_VERSION_KEY] && (void 0 === a[module$contents$omid$common$InternalMessage_ARGS_KEY] || 
  void 0 !== a[module$contents$omid$common$InternalMessage_ARGS_KEY]);
};
module$exports$omid$common$InternalMessage.deserialize = function(a) {
  return new module$exports$omid$common$InternalMessage(a[module$contents$omid$common$InternalMessage_GUID_KEY], a[module$contents$omid$common$InternalMessage_METHOD_KEY], a[module$contents$omid$common$InternalMessage_VERSION_KEY], a[module$contents$omid$common$InternalMessage_ARGS_KEY]);
};
module$exports$omid$common$InternalMessage.prototype.serialize = function() {
  var a = {};
  a = (a[module$contents$omid$common$InternalMessage_GUID_KEY] = this.guid, a[module$contents$omid$common$InternalMessage_METHOD_KEY] = this.method, a[module$contents$omid$common$InternalMessage_VERSION_KEY] = this.version, a);
  void 0 !== this.args && (a[module$contents$omid$common$InternalMessage_ARGS_KEY] = this.args);
  return a;
};
var module$exports$omid$common$Communication = function(a) {
  this.to = a;
  this.communicationType_ = module$exports$omid$common$constants.CommunicationType.NONE;
};
module$exports$omid$common$Communication.prototype.sendMessage = function(a, b) {
};
module$exports$omid$common$Communication.prototype.handleMessage = function(a, b) {
  if (this.onMessage) {
    this.onMessage(a, b);
  }
};
module$exports$omid$common$Communication.prototype.serialize = function(a) {
  return JSON.stringify(a);
};
module$exports$omid$common$Communication.prototype.deserialize = function(a) {
  return JSON.parse(a);
};
module$exports$omid$common$Communication.prototype.isDirectCommunication = function() {
  return this.communicationType_ === module$exports$omid$common$constants.CommunicationType.DIRECT;
};
module$exports$omid$common$Communication.prototype.isCrossOrigin = function() {
};
var module$exports$omid$common$logger = {};
function module$contents$omid$common$logger_error() {
  var a = $jscomp.getRestArguments.apply(0, arguments);
  module$contents$omid$common$logger_executeLog(function() {
    throw new (Function.prototype.bind.apply(Error, [null, "Could not complete the test successfully - "].concat($jscomp.arrayFromIterable(a))))();
  }, function() {
    return console.error.apply(console, $jscomp.arrayFromIterable(a));
  });
}
function module$contents$omid$common$logger_debug() {
  var a = $jscomp.getRestArguments.apply(0, arguments);
  module$contents$omid$common$logger_executeLog(function() {
  }, function() {
    return console.error.apply(console, $jscomp.arrayFromIterable(a));
  });
}
function module$contents$omid$common$logger_executeLog(a, b) {
  "undefined" !== typeof jasmine && jasmine ? a() : "undefined" !== typeof console && console && console.error && b();
}
module$exports$omid$common$logger.error = module$contents$omid$common$logger_error;
module$exports$omid$common$logger.debug = module$contents$omid$common$logger_debug;
var module$exports$omid$common$eventTypedefs = {};
var module$exports$omid$common$version = {ApiVersion:"1.0", Version:"1.4.12-iab4299"};
var module$exports$omid$common$argsChecker = {};
function module$contents$omid$common$argsChecker_assertTruthyString(a, b) {
  if (!b) {
    throw Error("Value for " + a + " is undefined, null or blank.");
  }
  if ("string" !== typeof b && !(b instanceof String)) {
    throw Error("Value for " + a + " is not a string.");
  }
  if ("" === b.trim()) {
    throw Error("Value for " + a + " is empty string.");
  }
}
function module$contents$omid$common$argsChecker_assertNotNullObject(a, b) {
  if (null == b) {
    throw Error("Value for " + a + " is undefined or null");
  }
}
function module$contents$omid$common$argsChecker_assertNumber(a, b) {
  if (null == b) {
    throw Error(a + " must not be null or undefined.");
  }
  if ("number" !== typeof b || isNaN(b)) {
    throw Error("Value for " + a + " is not a number");
  }
}
function module$contents$omid$common$argsChecker_assertNumberBetween(a, b, c, d) {
  module$contents$omid$common$argsChecker_assertNumber(a, b);
  if (b < c || b > d) {
    throw Error("Value for " + a + " is outside the range [" + c + "," + d + "]");
  }
}
function module$contents$omid$common$argsChecker_assertFunction(a, b) {
  if (!b) {
    throw Error(a + " must not be truthy.");
  }
}
function module$contents$omid$common$argsChecker_assertPositiveNumber(a, b) {
  module$contents$omid$common$argsChecker_assertNumber(a, b);
  if (0 > b) {
    throw Error(a + " must be a positive number.");
  }
}
module$exports$omid$common$argsChecker.assertTruthyString = module$contents$omid$common$argsChecker_assertTruthyString;
module$exports$omid$common$argsChecker.assertNotNullObject = module$contents$omid$common$argsChecker_assertNotNullObject;
module$exports$omid$common$argsChecker.assertNumber = module$contents$omid$common$argsChecker_assertNumber;
module$exports$omid$common$argsChecker.assertNumberBetween = module$contents$omid$common$argsChecker_assertNumberBetween;
module$exports$omid$common$argsChecker.assertFunction = module$contents$omid$common$argsChecker_assertFunction;
module$exports$omid$common$argsChecker.assertPositiveNumber = module$contents$omid$common$argsChecker_assertPositiveNumber;
var module$exports$omid$common$VersionUtils = {}, module$contents$omid$common$VersionUtils_SEMVER_DIGITS_NUMBER = 3;
function module$contents$omid$common$VersionUtils_isValidVersion(a) {
  return /\d+\.\d+\.\d+(-.*)?/.test(a);
}
function module$contents$omid$common$VersionUtils_versionGreaterOrEqual(a, b) {
  a = a.split("-")[0].split(".");
  b = b.split("-")[0].split(".");
  for (var c = 0; c < module$contents$omid$common$VersionUtils_SEMVER_DIGITS_NUMBER; c++) {
    var d = parseInt(a[c], 10), e = parseInt(b[c], 10);
    if (d > e) {
      break;
    } else if (d < e) {
      return !1;
    }
  }
  return !0;
}
module$exports$omid$common$VersionUtils.isValidVersion = module$contents$omid$common$VersionUtils_isValidVersion;
module$exports$omid$common$VersionUtils.versionGreaterOrEqual = module$contents$omid$common$VersionUtils_versionGreaterOrEqual;
var module$exports$omid$common$ArgsSerDe = {}, module$contents$omid$common$ArgsSerDe_ARGS_NOT_SERIALIZED_VERSION = "1.0.3";
function module$contents$omid$common$ArgsSerDe_serializeMessageArgs(a, b) {
  return module$contents$omid$common$VersionUtils_isValidVersion(a) && module$contents$omid$common$VersionUtils_versionGreaterOrEqual(a, module$contents$omid$common$ArgsSerDe_ARGS_NOT_SERIALIZED_VERSION) ? b : JSON.stringify(b);
}
function module$contents$omid$common$ArgsSerDe_deserializeMessageArgs(a, b) {
  return module$contents$omid$common$VersionUtils_isValidVersion(a) && module$contents$omid$common$VersionUtils_versionGreaterOrEqual(a, module$contents$omid$common$ArgsSerDe_ARGS_NOT_SERIALIZED_VERSION) ? b ? b : [] : b && "string" === typeof b ? JSON.parse(b) : [];
}
module$exports$omid$common$ArgsSerDe.serializeMessageArgs = module$contents$omid$common$ArgsSerDe_serializeMessageArgs;
module$exports$omid$common$ArgsSerDe.deserializeMessageArgs = module$contents$omid$common$ArgsSerDe_deserializeMessageArgs;
var module$exports$omid$common$guid = {};
function module$contents$omid$common$guid_generateGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
    var b = 16 * Math.random() | 0;
    a = "y" === a ? (b & 3 | 8).toString(16) : b.toString(16);
    return a;
  });
}
module$exports$omid$common$guid.generateGuid = module$contents$omid$common$guid_generateGuid;
var module$exports$omid$common$DetectOmid = {OMID_PRESENT_FRAME_NAME:"omid_v1_present", OMID_PRESENT_FRAME_NAME_WEB:"omid_v1_present_web", OMID_PRESENT_FRAME_NAME_APP:"omid_v1_present_app", getEnvironmentIframeName:function(a) {
  var b = {};
  return (b[module$exports$omid$common$constants.Environment.APP] = module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME_APP, b[module$exports$omid$common$constants.Environment.WEB] = module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME_WEB, b)[a];
}};
function module$contents$omid$common$DetectOmid_isIframePresent(a, b) {
  try {
    return a.frames && !!a.frames[b];
  } catch (c) {
    return !1;
  }
}
module$exports$omid$common$DetectOmid.isOmidPresent = function(a) {
  return [module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME, module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME_WEB, module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME_APP,].some(function(b) {
    return module$contents$omid$common$DetectOmid_isIframePresent(a, b);
  });
};
module$exports$omid$common$DetectOmid.getOmidEnvironment = function(a) {
  for (var b = $jscomp.makeIterator(Object.values(module$exports$omid$common$constants.Environment)), c = b.next(); !c.done; c = b.next()) {
    c = c.value;
    var d = module$exports$omid$common$DetectOmid.getEnvironmentIframeName(c);
    if (module$contents$omid$common$DetectOmid_isIframePresent(a, d)) {
      return c;
    }
  }
  return null;
};
function module$contents$omid$common$DetectOmid_writePresenceIframe_(a, b) {
  a.document.write('<iframe style="display:none" id="' + (b + '" name="' + b + '" sandbox></iframe>'));
}
module$exports$omid$common$DetectOmid.declareOmidPresence = function(a, b) {
  a.frames && a.document && ![module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME, module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME_WEB, module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME_APP,].some(function(c) {
    return !!a.frames[c];
  }) && (null == a.document.body && module$exports$omid$common$DetectOmid.isMutationObserverAvailable_(a) ? module$exports$omid$common$DetectOmid.registerMutationObserver_(a, b) : (b = module$exports$omid$common$DetectOmid.getEnvironmentIframeName(b), a.document.body ? (module$exports$omid$common$DetectOmid.appendPresenceIframe_(a, module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME), module$exports$omid$common$DetectOmid.appendPresenceIframe_(a, b)) : (module$contents$omid$common$DetectOmid_writePresenceIframe_(a, 
  module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME), module$contents$omid$common$DetectOmid_writePresenceIframe_(a, b))));
};
module$exports$omid$common$DetectOmid.appendPresenceIframe_ = function(a, b) {
  var c = a.document.createElement("iframe");
  c.id = b;
  c.name = b;
  c.style.display = "none";
  c.sandbox = "";
  a.document.body.appendChild(c);
};
module$exports$omid$common$DetectOmid.isMutationObserverAvailable_ = function(a) {
  return "MutationObserver" in a;
};
module$exports$omid$common$DetectOmid.registerMutationObserver_ = function(a, b) {
  var c = new MutationObserver(function(d) {
    d.forEach(function(e) {
      "BODY" === e.addedNodes[0].nodeName && (e = module$exports$omid$common$DetectOmid.getEnvironmentIframeName(b), module$exports$omid$common$DetectOmid.appendPresenceIframe_(a, module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME), module$exports$omid$common$DetectOmid.appendPresenceIframe_(a, e), c.disconnect());
    });
  });
  c.observe(a.document.documentElement, {childList:!0});
};
var module$exports$omid$common$serviceMethodUtils = {}, module$contents$omid$common$serviceMethodUtils_ServiceMethodPrefix = {SESSION_SERVICE:"SessionService.", VERIFICATION_SERVICE:"VerificationService.",};
function module$contents$omid$common$serviceMethodUtils_getPrefixedSessionServiceMethod(a) {
  return module$contents$omid$common$serviceMethodUtils_getPrefixedMethod(a, module$contents$omid$common$serviceMethodUtils_ServiceMethodPrefix.SESSION_SERVICE);
}
function module$contents$omid$common$serviceMethodUtils_getUnprefixedSessionServiceMethod(a) {
  return module$contents$omid$common$serviceMethodUtils_getUnprefixedMethod(a, module$contents$omid$common$serviceMethodUtils_ServiceMethodPrefix.SESSION_SERVICE);
}
function module$contents$omid$common$serviceMethodUtils_isPrefixedSessionServiceMethod(a) {
  return null != module$contents$omid$common$serviceMethodUtils_getUnprefixedSessionServiceMethod(a);
}
function module$contents$omid$common$serviceMethodUtils_getPrefixedVerificationServiceMethod(a) {
  return module$contents$omid$common$serviceMethodUtils_getPrefixedMethod(a, module$contents$omid$common$serviceMethodUtils_ServiceMethodPrefix.VERIFICATION_SERVICE);
}
function module$contents$omid$common$serviceMethodUtils_getUnprefixedVerificationServiceMethod(a) {
  return module$contents$omid$common$serviceMethodUtils_getUnprefixedMethod(a, module$contents$omid$common$serviceMethodUtils_ServiceMethodPrefix.VERIFICATION_SERVICE);
}
function module$contents$omid$common$serviceMethodUtils_isPrefixedVerificationServiceMethod(a) {
  return null != module$contents$omid$common$serviceMethodUtils_getUnprefixedVerificationServiceMethod(a);
}
function module$contents$omid$common$serviceMethodUtils_getPrefixedMethod(a, b) {
  return b + a;
}
function module$contents$omid$common$serviceMethodUtils_getUnprefixedMethod(a, b) {
  return (a = a.match(new RegExp("^" + b + "(.*)"))) && a[1];
}
module$exports$omid$common$serviceMethodUtils.getPrefixedSessionServiceMethod = module$contents$omid$common$serviceMethodUtils_getPrefixedSessionServiceMethod;
module$exports$omid$common$serviceMethodUtils.getPrefixedVerificationServiceMethod = module$contents$omid$common$serviceMethodUtils_getPrefixedVerificationServiceMethod;
module$exports$omid$common$serviceMethodUtils.getUnprefixedSessionServiceMethod = module$contents$omid$common$serviceMethodUtils_getUnprefixedSessionServiceMethod;
module$exports$omid$common$serviceMethodUtils.getUnprefixedVerificationServiceMethod = module$contents$omid$common$serviceMethodUtils_getUnprefixedVerificationServiceMethod;
module$exports$omid$common$serviceMethodUtils.isPrefixedSessionServiceMethod = module$contents$omid$common$serviceMethodUtils_isPrefixedSessionServiceMethod;
module$exports$omid$common$serviceMethodUtils.isPrefixedVerificationServiceMethod = module$contents$omid$common$serviceMethodUtils_isPrefixedVerificationServiceMethod;
var module$exports$omid$common$OmidGlobalProvider = {};
function module$contents$omid$common$OmidGlobalProvider_getOmidGlobal() {
  if ("undefined" !== typeof omidGlobal && omidGlobal) {
    return omidGlobal;
  }
  if ("undefined" !== typeof global && global) {
    return global;
  }
  if ("undefined" !== typeof window && window) {
    return window;
  }
  if ("undefined" !== typeof globalThis && globalThis) {
    return globalThis;
  }
  var a = Function("return this")();
  if (a) {
    return a;
  }
  throw Error("Could not determine global object context.");
}
module$exports$omid$common$OmidGlobalProvider.omidGlobal = module$contents$omid$common$OmidGlobalProvider_getOmidGlobal();
var module$exports$omid$common$exporter = {};
function module$contents$omid$common$exporter_getOmidExports() {
  return "undefined" === typeof omidExports ? null : omidExports;
}
function module$contents$omid$common$exporter_getOrCreateName(a, b) {
  return a && (a[b] || (a[b] = {}));
}
function module$contents$omid$common$exporter_packageExport(a, b, c) {
  if (c = void 0 === c ? module$contents$omid$common$exporter_getOmidExports() : c) {
    a = a.split("."), a.slice(0, a.length - 1).reduce(module$contents$omid$common$exporter_getOrCreateName, c)[a[a.length - 1]] = b;
  }
}
module$exports$omid$common$exporter.packageExport = module$contents$omid$common$exporter_packageExport;
var module$exports$omid$common$windowUtils = {};
function module$contents$omid$common$windowUtils_isValidWindow(a) {
  return null != a && "undefined" !== typeof a.top && null != a.top;
}
function module$contents$omid$common$windowUtils_isCrossOrigin(a) {
  if (a === module$exports$omid$common$OmidGlobalProvider.omidGlobal) {
    return !1;
  }
  try {
    if ("undefined" === typeof a.location.hostname) {
      return !0;
    }
    module$contents$omid$common$windowUtils_isSameOriginForIE(a);
  } catch (b) {
    return !0;
  }
  return !1;
}
function module$contents$omid$common$windowUtils_isSameOriginForIE(a) {
  return "" === a.x || "" !== a.x;
}
function module$contents$omid$common$windowUtils_resolveGlobalContext(a) {
  "undefined" === typeof a && "undefined" !== typeof window && window && (a = window);
  return module$contents$omid$common$windowUtils_isValidWindow(a) ? a : module$exports$omid$common$OmidGlobalProvider.omidGlobal;
}
function module$contents$omid$common$windowUtils_resolveTopWindowContext(a) {
  return module$contents$omid$common$windowUtils_isValidWindow(a) ? a.top : module$exports$omid$common$OmidGlobalProvider.omidGlobal;
}
function module$contents$omid$common$windowUtils_isTopWindowAccessible(a) {
  try {
    return a.top.location.href ? !0 : !1;
  } catch (b) {
    return !1;
  }
}
function module$contents$omid$common$windowUtils_removeDomElements(a) {
  a.type === module$exports$omid$common$constants.AdEventType.SESSION_START && ("undefined" !== typeof a.data.context.videoElement && (a.data.context.videoElement = "DOM Video Element - Present but not parsed to avoid parse error"), "undefined" !== typeof a.data.context.slotElement && (a.data.context.slotElement = "DOM Slot Element - Present but not parsed to avoid parse error"));
  return a;
}
function module$contents$omid$common$windowUtils_evaluatePageUrl(a) {
  if (!module$contents$omid$common$windowUtils_isValidWindow(a)) {
    return null;
  }
  try {
    var b = a.top;
    return module$contents$omid$common$windowUtils_isCrossOrigin(b) ? null : b.location.href;
  } catch (c) {
    return null;
  }
}
module$exports$omid$common$windowUtils.evaluatePageUrl = module$contents$omid$common$windowUtils_evaluatePageUrl;
module$exports$omid$common$windowUtils.isCrossOrigin = module$contents$omid$common$windowUtils_isCrossOrigin;
module$exports$omid$common$windowUtils.removeDomElements = module$contents$omid$common$windowUtils_removeDomElements;
module$exports$omid$common$windowUtils.resolveGlobalContext = module$contents$omid$common$windowUtils_resolveGlobalContext;
module$exports$omid$common$windowUtils.resolveTopWindowContext = module$contents$omid$common$windowUtils_resolveTopWindowContext;
module$exports$omid$common$windowUtils.isTopWindowAccessible = module$contents$omid$common$windowUtils_isTopWindowAccessible;
var module$exports$omid$common$DirectCommunication = function(a) {
  module$exports$omid$common$Communication.call(this, a);
  this.communicationType_ = module$exports$omid$common$constants.CommunicationType.DIRECT;
  this.handleExportedMessage = module$exports$omid$common$DirectCommunication.prototype.handleExportedMessage.bind(this);
};
$jscomp.inherits(module$exports$omid$common$DirectCommunication, module$exports$omid$common$Communication);
module$exports$omid$common$DirectCommunication.prototype.sendMessage = function(a, b) {
  b = void 0 === b ? this.to : b;
  if (!b) {
    throw Error("Message destination must be defined at construction time or when sending the message.");
  }
  b.handleExportedMessage(a.serialize(), this);
};
module$exports$omid$common$DirectCommunication.prototype.handleExportedMessage = function(a, b) {
  module$exports$omid$common$InternalMessage.isValidSerializedMessage(a) && this.handleMessage(module$exports$omid$common$InternalMessage.deserialize(a), b);
};
module$exports$omid$common$DirectCommunication.prototype.isCrossOrigin = function() {
  return !1;
};
var module$exports$omid$common$PostMessageCommunication = function(a, b) {
  b = void 0 === b ? module$exports$omid$common$OmidGlobalProvider.omidGlobal : b;
  module$exports$omid$common$Communication.call(this, b);
  var c = this;
  this.communicationType_ = module$exports$omid$common$constants.CommunicationType.POST_MESSAGE;
  a.addEventListener("message", function(d) {
    if ("object" === typeof d.data) {
      var e = d.data;
      module$exports$omid$common$InternalMessage.isValidSerializedMessage(e) && (e = module$exports$omid$common$InternalMessage.deserialize(e), d.source && c.handleMessage(e, d.source));
    }
  });
};
$jscomp.inherits(module$exports$omid$common$PostMessageCommunication, module$exports$omid$common$Communication);
module$exports$omid$common$PostMessageCommunication.isCompatibleContext = function(a) {
  return !!(a && a.addEventListener && a.postMessage);
};
module$exports$omid$common$PostMessageCommunication.prototype.sendMessage = function(a, b) {
  b = void 0 === b ? this.to : b;
  if (!b) {
    throw Error("Message destination must be defined at construction time or when sending the message.");
  }
  b.postMessage(a.serialize(), "*");
};
module$exports$omid$common$PostMessageCommunication.prototype.isCrossOrigin = function() {
  return this.to ? module$contents$omid$common$windowUtils_isCrossOrigin(this.to) : !0;
};
var module$exports$omid$common$serviceCommunication = {}, module$contents$omid$common$serviceCommunication_EXPORTED_SESSION_COMMUNICATION_NAME = ["omid", "v1_SessionServiceCommunication"], module$contents$omid$common$serviceCommunication_EXPORTED_VERIFICATION_COMMUNICATION_NAME = ["omid", "v1_VerificationServiceCommunication"], module$contents$omid$common$serviceCommunication_EXPORTED_SERVICE_WINDOW_NAME = ["omidVerificationProperties", "serviceWindow"];
function module$contents$omid$common$serviceCommunication_getValueForKeypath(a, b) {
  return b.reduce(function(c, d) {
    return c && c[d];
  }, a);
}
function module$contents$omid$common$serviceCommunication_startServiceCommunication(a, b, c, d) {
  if (!module$contents$omid$common$windowUtils_isCrossOrigin(b)) {
    try {
      var e = module$contents$omid$common$serviceCommunication_getValueForKeypath(b, c);
      if (e) {
        return new module$exports$omid$common$DirectCommunication(e);
      }
    } catch (f) {
    }
  }
  return d(b) ? new module$exports$omid$common$PostMessageCommunication(a, b) : null;
}
function module$contents$omid$common$serviceCommunication_startServiceCommunicationFromCandidates(a, b, c, d) {
  b = $jscomp.makeIterator(b);
  for (var e = b.next(); !e.done; e = b.next()) {
    if (e = module$contents$omid$common$serviceCommunication_startServiceCommunication(a, e.value, c, d)) {
      return e;
    }
  }
  return null;
}
function module$contents$omid$common$serviceCommunication_startSessionServiceCommunication(a, b, c) {
  c = void 0 === c ? module$exports$omid$common$DetectOmid.isOmidPresent : c;
  var d = [a, module$contents$omid$common$windowUtils_resolveTopWindowContext(a)];
  b && d.unshift(b);
  return module$contents$omid$common$serviceCommunication_startServiceCommunicationFromCandidates(a, d, module$contents$omid$common$serviceCommunication_EXPORTED_SESSION_COMMUNICATION_NAME, c);
}
function module$contents$omid$common$serviceCommunication_startVerificationServiceCommunication(a, b) {
  b = void 0 === b ? module$exports$omid$common$DetectOmid.isOmidPresent : b;
  var c = [], d = module$contents$omid$common$serviceCommunication_getValueForKeypath(a, module$contents$omid$common$serviceCommunication_EXPORTED_SERVICE_WINDOW_NAME);
  d && c.push(d);
  c.push(module$contents$omid$common$windowUtils_resolveTopWindowContext(a));
  return module$contents$omid$common$serviceCommunication_startServiceCommunicationFromCandidates(a, c, module$contents$omid$common$serviceCommunication_EXPORTED_VERIFICATION_COMMUNICATION_NAME, b);
}
module$exports$omid$common$serviceCommunication.startSessionServiceCommunication = module$contents$omid$common$serviceCommunication_startSessionServiceCommunication;
module$exports$omid$common$serviceCommunication.startVerificationServiceCommunication = module$contents$omid$common$serviceCommunication_startVerificationServiceCommunication;
var module$contents$omid$verificationClient$VerificationClient_VERIFICATION_CLIENT_VERSION = module$exports$omid$common$version.Version, module$contents$omid$verificationClient$VerificationClient_EventCallback;
function module$contents$omid$verificationClient$VerificationClient_getThirdPartyOmid() {
  var a = module$exports$omid$common$OmidGlobalProvider.omidGlobal.omid3p;
  return a && "function" === typeof a.registerSessionObserver && "function" === typeof a.addEventListener ? a : null;
}
var module$exports$omid$verificationClient$VerificationClient = function(a) {
  if (this.communication = a || module$contents$omid$common$serviceCommunication_startVerificationServiceCommunication(module$contents$omid$common$windowUtils_resolveGlobalContext())) {
    this.communication.onMessage = this.handleMessage_.bind(this);
  } else {
    if (a = module$contents$omid$verificationClient$VerificationClient_getThirdPartyOmid()) {
      this.omid3p = a;
    }
  }
  this.remoteIntervals_ = this.remoteTimeouts_ = 0;
  this.callbackMap_ = {};
  this.imgCache_ = [];
  this.injectionId_ = (a = module$exports$omid$common$OmidGlobalProvider.omidGlobal.omidVerificationProperties) ? a.injectionId : void 0;
};
module$exports$omid$verificationClient$VerificationClient.prototype.isSupported = function() {
  return this.getEnvironment() !== module$exports$omid$common$constants.Environment.WEB || this.injectionId_ ? !(!this.communication && !this.omid3p) : !1;
};
module$exports$omid$verificationClient$VerificationClient.prototype.getEnvironment = function() {
  var a = module$contents$omid$common$windowUtils_resolveGlobalContext();
  return this.injectionSource() || (0,module$exports$omid$common$DetectOmid.getOmidEnvironment)(a) || (0,module$exports$omid$common$DetectOmid.getOmidEnvironment)(module$contents$omid$common$windowUtils_resolveTopWindowContext(a));
};
module$exports$omid$verificationClient$VerificationClient.prototype.injectionSource = function() {
  var a = module$exports$omid$common$OmidGlobalProvider.omidGlobal.omidVerificationProperties;
  if (a && a.injectionSource) {
    return a.injectionSource;
  }
};
module$exports$omid$verificationClient$VerificationClient.prototype.registerSessionObserver = function(a, b) {
  module$contents$omid$common$argsChecker_assertFunction("functionToExecute", a);
  this.omid3p ? this.omid3p.registerSessionObserver(a, b, this.injectionId_) : this.sendMessage_("addSessionListener", a, b, this.injectionId_);
};
module$exports$omid$verificationClient$VerificationClient.prototype.addEventListener = function(a, b) {
  module$contents$omid$common$argsChecker_assertTruthyString("eventType", a);
  module$contents$omid$common$argsChecker_assertFunction("functionToExecute", b);
  this.omid3p ? this.omid3p.addEventListener(a, b, this.injectionId_) : this.sendMessage_("addEventListener", b, a, this.injectionId_);
};
module$exports$omid$verificationClient$VerificationClient.prototype.sendUrl = function(a, b, c) {
  module$contents$omid$common$argsChecker_assertTruthyString("url", a);
  module$exports$omid$common$OmidGlobalProvider.omidGlobal.document && module$exports$omid$common$OmidGlobalProvider.omidGlobal.document.createElement ? this.sendUrlWithImg_(a, b, c) : this.sendMessage_("sendUrl", function(d) {
    d && b ? b() : !d && c && c();
  }, a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.sendUrlWithImg_ = function(a, b, c) {
  var d = this, e = module$exports$omid$common$OmidGlobalProvider.omidGlobal.document.createElement("img");
  this.imgCache_.push(e);
  var f = function(g) {
    var h = d.imgCache_.indexOf(e);
    0 <= h && d.imgCache_.splice(h, 1);
    g && g();
  };
  e.addEventListener("load", f.bind(this, b));
  e.addEventListener("error", f.bind(this, c));
  e.src = a;
};
module$exports$omid$verificationClient$VerificationClient.prototype.injectJavaScriptResource = function(a, b, c) {
  var d = this;
  module$contents$omid$common$argsChecker_assertTruthyString("url", a);
  module$exports$omid$common$OmidGlobalProvider.omidGlobal.document ? this.injectJavascriptResourceUrlInDom_(a, b, c) : this.sendMessage_("injectJavaScriptResource", function(e, f) {
    e ? (d.evaluateJavaScript_(f, a), b()) : (module$contents$omid$common$logger_error("Service failed to load JavaScript resource."), c());
  }, a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.injectJavascriptResourceUrlInDom_ = function(a, b, c) {
  var d = module$exports$omid$common$OmidGlobalProvider.omidGlobal.document, e = d.body;
  d = d.createElement("script");
  d.onload = b;
  d.onerror = c;
  d.src = a;
  d.type = "application/javascript";
  e.appendChild(d);
};
module$exports$omid$verificationClient$VerificationClient.prototype.evaluateJavaScript_ = function(a, b) {
  try {
    eval(a);
  } catch (c) {
    module$contents$omid$common$logger_error('Error evaluating the JavaScript resource from "' + b + '".');
  }
};
module$exports$omid$verificationClient$VerificationClient.prototype.setTimeout = function(a, b) {
  module$contents$omid$common$argsChecker_assertFunction("functionToExecute", a);
  module$contents$omid$common$argsChecker_assertPositiveNumber("timeInMillis", b);
  if (this.hasTimeoutMethods_()) {
    return module$exports$omid$common$OmidGlobalProvider.omidGlobal.setTimeout(a, b);
  }
  var c = this.remoteTimeouts_++;
  this.sendMessage_("setTimeout", a, c, b);
  return c;
};
module$exports$omid$verificationClient$VerificationClient.prototype.clearTimeout = function(a) {
  module$contents$omid$common$argsChecker_assertPositiveNumber("timeoutId", a);
  this.hasTimeoutMethods_() ? module$exports$omid$common$OmidGlobalProvider.omidGlobal.clearTimeout(a) : this.sendOneWayMessage_("clearTimeout", a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.setInterval = function(a, b) {
  module$contents$omid$common$argsChecker_assertFunction("functionToExecute", a);
  module$contents$omid$common$argsChecker_assertPositiveNumber("timeInMillis", b);
  if (this.hasIntervalMethods_()) {
    return module$exports$omid$common$OmidGlobalProvider.omidGlobal.setInterval(a, b);
  }
  var c = this.remoteIntervals_++;
  this.sendMessage_("setInterval", a, c, b);
  return c;
};
module$exports$omid$verificationClient$VerificationClient.prototype.clearInterval = function(a) {
  module$contents$omid$common$argsChecker_assertPositiveNumber("intervalId", a);
  this.hasIntervalMethods_() ? module$exports$omid$common$OmidGlobalProvider.omidGlobal.clearInterval(a) : this.sendOneWayMessage_("clearInterval", a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.hasTimeoutMethods_ = function() {
  return "function" === typeof module$exports$omid$common$OmidGlobalProvider.omidGlobal.setTimeout && "function" === typeof module$exports$omid$common$OmidGlobalProvider.omidGlobal.clearTimeout;
};
module$exports$omid$verificationClient$VerificationClient.prototype.hasIntervalMethods_ = function() {
  return "function" === typeof module$exports$omid$common$OmidGlobalProvider.omidGlobal.setInterval && "function" === typeof module$exports$omid$common$OmidGlobalProvider.omidGlobal.clearInterval;
};
module$exports$omid$verificationClient$VerificationClient.prototype.handleMessage_ = function(a, b) {
  b = a.method;
  var c = a.guid;
  a = a.args;
  if ("response" === b && this.callbackMap_[c]) {
    var d = module$contents$omid$common$ArgsSerDe_deserializeMessageArgs(module$exports$omid$common$version.Version, a);
    this.callbackMap_[c].apply(this, d);
  }
  "error" === b && window.console && module$contents$omid$common$logger_error(a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.sendOneWayMessage_ = function(a) {
  var b = $jscomp.getRestArguments.apply(1, arguments);
  this.sendMessage_.apply(this, [a, null].concat($jscomp.arrayFromIterable(b)));
};
module$exports$omid$verificationClient$VerificationClient.prototype.sendMessage_ = function(a, b) {
  var c = $jscomp.getRestArguments.apply(2, arguments);
  if (this.communication) {
    var d = module$contents$omid$common$guid_generateGuid();
    b && (this.callbackMap_[d] = b);
    c = new module$exports$omid$common$InternalMessage(d, module$contents$omid$common$serviceMethodUtils_getPrefixedVerificationServiceMethod(a), module$exports$omid$common$version.Version, module$contents$omid$common$ArgsSerDe_serializeMessageArgs(module$exports$omid$common$version.Version, c));
    this.communication.sendMessage(c);
  }
};
module$contents$omid$common$exporter_packageExport("OmidVerificationClient", module$exports$omid$verificationClient$VerificationClient);

}, typeof exports === 'undefined' ? undefined : exports));

