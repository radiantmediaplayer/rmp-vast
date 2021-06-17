/**
 * @license Copyright (c) 2015-2021 Radiant Media Player 
 * omid-session-client-v1 - 1.3.20
 */
(function(omidGlobal, factory, exports) {
  // CommonJS support
  if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(omidGlobal, exports);

  // If neither AMD nor CommonJS are used, export to a versioned name in the
  // global context.
  } else {
    var exports = {};
    var versions = ['1.3.20-iab2822'];
    var additionalVersionString = 'default';
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
  'use strict';
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
};
$jscomp.arrayIterator = function(a) {
  return {next:$jscomp.arrayIteratorImpl(a)};
};
$jscomp.makeIterator = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : $jscomp.arrayIterator(a);
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
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function(a) {
  var b = function() {
  };
  b.prototype = a;
  return new b;
};
$jscomp.underscoreProtoCanBeSet = function() {
  var a = {a:!0}, b = {};
  try {
    return b.__proto__ = a, b.a;
  } catch (c) {
  }
  return !1;
};
$jscomp.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(a, b) {
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
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
$jscomp.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.SymbolClass = function(a, b) {
  this.$jscomp$symbol$id_ = a;
  $jscomp.defineProperty(this, "description", {configurable:!0, writable:!0, value:b});
};
$jscomp.SymbolClass.prototype.toString = function() {
  return this.$jscomp$symbol$id_;
};
$jscomp.Symbol = function() {
  function a(c) {
    if (this instanceof a) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new $jscomp.SymbolClass($jscomp.SYMBOL_PREFIX + (c || "") + "_" + b++, c);
  }
  var b = 0;
  return a;
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.iterator;
  a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("Symbol.iterator"));
  "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
  }});
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.initSymbolAsyncIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.asyncIterator;
  a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("Symbol.asyncIterator"));
  $jscomp.initSymbolAsyncIterator = function() {
  };
};
$jscomp.iteratorPrototype = function(a) {
  $jscomp.initSymbolIterator();
  a = {next:a};
  a[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.iteratorFromArray = function(a, b) {
  $jscomp.initSymbolIterator();
  a instanceof String && (a += "");
  var c = 0, d = {next:function() {
    if (c < a.length) {
      var e = c++;
      return {value:b(e, a[e]), done:!1};
    }
    d.next = function() {
      return {done:!0, value:void 0};
    };
    return d.next();
  }};
  d[Symbol.iterator] = function() {
    return d;
  };
  return d;
};
$jscomp.polyfill = function(a, b, c, d) {
  if (b) {
    c = $jscomp.global;
    a = a.split(".");
    for (d = 0; d < a.length - 1; d++) {
      var e = a[d];
      e in c || (c[e] = {});
      c = c[e];
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d && null != b && $jscomp.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
  }
};
var module$exports$omid$common$constants = {AdEventType:{IMPRESSION:"impression", LOADED:"loaded", GEOMETRY_CHANGE:"geometryChange", SESSION_START:"sessionStart", SESSION_ERROR:"sessionError", SESSION_FINISH:"sessionFinish", MEDIA:"media", VIDEO:"video", START:"start", FIRST_QUARTILE:"firstQuartile", MIDPOINT:"midpoint", THIRD_QUARTILE:"thirdQuartile", COMPLETE:"complete", PAUSE:"pause", RESUME:"resume", BUFFER_START:"bufferStart", BUFFER_FINISH:"bufferFinish", SKIPPED:"skipped", VOLUME_CHANGE:"volumeChange", 
PLAYER_STATE_CHANGE:"playerStateChange", AD_USER_INTERACTION:"adUserInteraction", STATE_CHANGE:"stateChange"}, MediaEventType:{LOADED:"loaded", START:"start", FIRST_QUARTILE:"firstQuartile", MIDPOINT:"midpoint", THIRD_QUARTILE:"thirdQuartile", COMPLETE:"complete", PAUSE:"pause", RESUME:"resume", BUFFER_START:"bufferStart", BUFFER_FINISH:"bufferFinish", SKIPPED:"skipped", VOLUME_CHANGE:"volumeChange", PLAYER_STATE_CHANGE:"playerStateChange", AD_USER_INTERACTION:"adUserInteraction"}, ImpressionType:{DEFINED_BY_JAVASCRIPT:"definedByJavaScript", 
UNSPECIFIED:"unspecified", LOADED:"loaded", BEGIN_TO_RENDER:"beginToRender", ONE_PIXEL:"onePixel", VIEWABLE:"viewable", AUDIBLE:"audible", OTHER:"other"}, ErrorType:{GENERIC:"generic", VIDEO:"video", MEDIA:"media"}, AdSessionType:{NATIVE:"native", HTML:"html", JAVASCRIPT:"javascript"}, EventOwner:{NATIVE:"native", JAVASCRIPT:"javascript", NONE:"none"}, AccessMode:{FULL:"full", DOMAIN:"domain", LIMITED:"limited"}, AppState:{BACKGROUNDED:"backgrounded", FOREGROUNDED:"foregrounded"}, Environment:{APP:"app", 
WEB:"web"}, InteractionType:{CLICK:"click", INVITATION_ACCEPT:"invitationAccept"}, CreativeType:{DEFINED_BY_JAVASCRIPT:"definedByJavaScript", HTML_DISPLAY:"htmlDisplay", NATIVE_DISPLAY:"nativeDisplay", VIDEO:"video", AUDIO:"audio"}, MediaType:{DISPLAY:"display", VIDEO:"video"}, Reason:{NOT_FOUND:"notFound", HIDDEN:"hidden", BACKGROUNDED:"backgrounded", VIEWPORT:"viewport", OBSTRUCTED:"obstructed", CLIPPED:"clipped", UNMEASURABLE:"unmeasurable"}, SupportedFeatures:{CONTAINER:"clid", VIDEO:"vlid"}, 
VideoPosition:{PREROLL:"preroll", MIDROLL:"midroll", POSTROLL:"postroll", STANDALONE:"standalone"}, VideoPlayerState:{MINIMIZED:"minimized", COLLAPSED:"collapsed", NORMAL:"normal", EXPANDED:"expanded", FULLSCREEN:"fullscreen"}, NativeViewKeys:{X:"x", LEFT:"left", Y:"y", TOP:"top", WIDTH:"width", HEIGHT:"height", AD_SESSION_ID:"adSessionId", IS_FRIENDLY_OBSTRUCTION_FOR:"isFriendlyObstructionFor", CLIPS_TO_BOUNDS:"clipsToBounds", CHILD_VIEWS:"childViews", END_X:"endX", END_Y:"endY", OBSTRUCTIONS:"obstructions", 
OBSTRUCTION_CLASS:"obstructionClass", OBSTRUCTION_PURPOSE:"obstructionPurpose", OBSTRUCTION_REASON:"obstructionReason", PIXELS:"pixels"}, MeasurementStateChangeSource:{CONTAINER:"container", CREATIVE:"creative"}, ElementMarkup:{OMID_ELEMENT_CLASS_NAME:"omid-element"}, CommunicationType:{NONE:"NONE", DIRECT:"DIRECT", POST_MESSAGE:"POST_MESSAGE"}, OmidImplementer:{OMSDK:"omsdk"}};
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
var module$exports$omid$common$argsChecker = {assertTruthyString:function(a, b) {
  if (!b) {
    throw Error("Value for " + a + " is undefined, null or blank.");
  }
  if ("string" !== typeof b && !(b instanceof String)) {
    throw Error("Value for " + a + " is not a string.");
  }
  if ("" === b.trim()) {
    throw Error("Value for " + a + " is empty string.");
  }
}, assertNotNullObject:function(a, b) {
  if (null == b) {
    throw Error("Value for " + a + " is undefined or null");
  }
}, assertNumber:function(a, b) {
  if (null == b) {
    throw Error(a + " must not be null or undefined.");
  }
  if ("number" !== typeof b || isNaN(b)) {
    throw Error("Value for " + a + " is not a number");
  }
}, assertNumberBetween:function(a, b, c, d) {
  (0,module$exports$omid$common$argsChecker.assertNumber)(a, b);
  if (b < c || b > d) {
    throw Error("Value for " + a + " is outside the range [" + c + "," + d + "]");
  }
}, assertFunction:function(a, b) {
  if (!b) {
    throw Error(a + " must not be truthy.");
  }
}, assertPositiveNumber:function(a, b) {
  (0,module$exports$omid$common$argsChecker.assertNumber)(a, b);
  if (0 > b) {
    throw Error(a + " must be a positive number.");
  }
}};
var module$exports$omid$common$exporter = {};
function module$contents$omid$common$exporter_getOmidExports() {
  return "undefined" === typeof omidExports ? null : omidExports;
}
function module$contents$omid$common$exporter_getOrCreateName(a, b) {
  return a && (a[b] || (a[b] = {}));
}
module$exports$omid$common$exporter.packageExport = function(a, b, c) {
  if (c = void 0 === c ? module$contents$omid$common$exporter_getOmidExports() : c) {
    a = a.split("."), a.slice(0, a.length - 1).reduce(module$contents$omid$common$exporter_getOrCreateName, c)[a[a.length - 1]] = b;
  }
};
var module$exports$omid$sessionClient$Partner = function(a, b) {
  module$exports$omid$common$argsChecker.assertTruthyString("Partner.name", a);
  module$exports$omid$common$argsChecker.assertTruthyString("Partner.version", b);
  this.name = a;
  this.version = b;
};
(0,module$exports$omid$common$exporter.packageExport)("OmidSessionClient.Partner", module$exports$omid$sessionClient$Partner);
var module$exports$omid$sessionClient$VerificationScriptResource = function(a, b, c, d) {
  d = void 0 === d ? module$exports$omid$common$constants.AccessMode.FULL : d;
  module$exports$omid$common$argsChecker.assertTruthyString("VerificationScriptResource.resourceUrl", a);
  this.resourceUrl = a;
  this.vendorKey = b;
  this.verificationParameters = c;
  this.accessMode = d;
};
module$exports$omid$sessionClient$VerificationScriptResource.prototype.toJSON = function() {
  return {accessMode:this.accessMode, resourceUrl:this.resourceUrl, vendorKey:this.vendorKey, verificationParameters:this.verificationParameters};
};
(0,module$exports$omid$common$exporter.packageExport)("OmidSessionClient.VerificationScriptResource", module$exports$omid$sessionClient$VerificationScriptResource);
var module$exports$omid$sessionClient$Context = function(a, b, c, d) {
  c = void 0 === c ? null : c;
  d = void 0 === d ? null : d;
  module$exports$omid$common$argsChecker.assertNotNullObject("Context.partner", a);
  this.partner = a;
  this.verificationScriptResources = b;
  this.videoElement = this.slotElement = null;
  this.contentUrl = c;
  this.customReferenceData = d;
  this.underEvaluation = !1;
  this.serviceWindow = null;
};
module$exports$omid$sessionClient$Context.prototype.setVideoElement = function(a) {
  module$exports$omid$common$argsChecker.assertNotNullObject("Context.videoElement", a);
  this.videoElement = a;
};
module$exports$omid$sessionClient$Context.prototype.setSlotElement = function(a) {
  module$exports$omid$common$argsChecker.assertNotNullObject("Context.slotElement", a);
  this.slotElement = a;
};
module$exports$omid$sessionClient$Context.prototype.setServiceWindow = function(a) {
  module$exports$omid$common$argsChecker.assertNotNullObject("Context.serviceWindow", a);
  this.serviceWindow = a;
};
(0,module$exports$omid$common$exporter.packageExport)("OmidSessionClient.Context", module$exports$omid$sessionClient$Context);
var module$exports$omid$common$OmidGlobalProvider = {}, module$contents$omid$common$OmidGlobalProvider_globalThis = eval("this");
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
  if ("undefined" !== typeof module$contents$omid$common$OmidGlobalProvider_globalThis && module$contents$omid$common$OmidGlobalProvider_globalThis) {
    return module$contents$omid$common$OmidGlobalProvider_globalThis;
  }
  throw Error("Could not determine global object context.");
}
module$exports$omid$common$OmidGlobalProvider.omidGlobal = module$contents$omid$common$OmidGlobalProvider_getOmidGlobal();
var module$contents$omid$sessionClient$OmidJsSessionInterface_ExportedNodeKeys = {ROOT:"omidSessionInterface", AD_EVENTS:"adEvents", MEDIA_EVENTS:"mediaEvents"}, module$contents$omid$sessionClient$OmidJsSessionInterface_MethodNameMap = {sessionError:"reportError"}, module$contents$omid$sessionClient$OmidJsSessionInterface_MediaEventMethodNames = Object.keys(module$exports$omid$common$constants.MediaEventType).map(function(a) {
  return module$exports$omid$common$constants.MediaEventType[a];
}), module$contents$omid$sessionClient$OmidJsSessionInterface_AdEventMethodNames = ["impressionOccurred"], module$exports$omid$sessionClient$OmidJsSessionInterface = function(a) {
  a = void 0 === a ? module$exports$omid$common$OmidGlobalProvider.omidGlobal : a;
  this.interfaceRoot_ = a[module$contents$omid$sessionClient$OmidJsSessionInterface_ExportedNodeKeys.ROOT];
};
module$exports$omid$sessionClient$OmidJsSessionInterface.prototype.isSupported = function() {
  return null != this.interfaceRoot_;
};
module$exports$omid$sessionClient$OmidJsSessionInterface.prototype.sendMessage = function(a, b, c) {
  "registerSessionObserver" == a && (c = [b]);
  module$contents$omid$sessionClient$OmidJsSessionInterface_MethodNameMap[a] && (a = module$contents$omid$sessionClient$OmidJsSessionInterface_MethodNameMap[a]);
  b = this.interfaceRoot_;
  0 <= module$contents$omid$sessionClient$OmidJsSessionInterface_AdEventMethodNames.indexOf(a) && (b = b[module$contents$omid$sessionClient$OmidJsSessionInterface_ExportedNodeKeys.AD_EVENTS]);
  0 <= module$contents$omid$sessionClient$OmidJsSessionInterface_MediaEventMethodNames.indexOf(a) && (b = b[module$contents$omid$sessionClient$OmidJsSessionInterface_ExportedNodeKeys.MEDIA_EVENTS]);
  b = b[a];
  if (!b) {
    throw Error("Unrecognized method name: " + a + ".");
  }
  b.apply(null, $jscomp.arrayFromIterable(c));
};
var module$exports$omid$common$Rectangle = function(a, b, c, d) {
  this.x = a;
  this.y = b;
  this.width = c;
  this.height = d;
};
var module$exports$omid$common$logger = {error:function(a) {
  for (var b = [], c = 0; c < arguments.length; ++c) {
    b[c - 0] = arguments[c];
  }
  module$contents$omid$common$logger_executeLog(function() {
    throw new (Function.prototype.bind.apply(Error, [null, "Could not complete the test successfully - "].concat($jscomp.arrayFromIterable(b))));
  }, function() {
    return console.error.apply(console, $jscomp.arrayFromIterable(b));
  });
}, debug:function(a) {
  for (var b = [], c = 0; c < arguments.length; ++c) {
    b[c - 0] = arguments[c];
  }
  module$contents$omid$common$logger_executeLog(function() {
  }, function() {
    return console.error.apply(console, $jscomp.arrayFromIterable(b));
  });
}};
function module$contents$omid$common$logger_executeLog(a, b) {
  "undefined" !== typeof jasmine && jasmine ? a() : "undefined" !== typeof console && console && console.error && b();
}
;var module$exports$omid$common$eventTypedefs = {};
var module$exports$omid$common$version = {ApiVersion:"1.0", Version:"1.3.20-iab2822"};
var module$exports$omid$common$VersionUtils = {}, module$contents$omid$common$VersionUtils_SEMVER_DIGITS_NUMBER = 3;
module$exports$omid$common$VersionUtils.isValidVersion = function(a) {
  return /\d+\.\d+\.\d+(-.*)?/.test(a);
};
module$exports$omid$common$VersionUtils.versionGreaterOrEqual = function(a, b) {
  a = a.split("-")[0].split(".");
  b = b.split("-")[0].split(".");
  for (var c = 0; c < module$contents$omid$common$VersionUtils_SEMVER_DIGITS_NUMBER; c++) {
    var d = parseInt(a[c], 10), e = parseInt(b[c], 10);
    if (d > e) {
      break;
    } else {
      if (d < e) {
        return !1;
      }
    }
  }
  return !0;
};
var module$exports$omid$common$ArgsSerDe = {}, module$contents$omid$common$ArgsSerDe_ARGS_NOT_SERIALIZED_VERSION = "1.0.3";
module$exports$omid$common$ArgsSerDe.serializeMessageArgs = function(a, b) {
  return (0,module$exports$omid$common$VersionUtils.isValidVersion)(a) && (0,module$exports$omid$common$VersionUtils.versionGreaterOrEqual)(a, module$contents$omid$common$ArgsSerDe_ARGS_NOT_SERIALIZED_VERSION) ? b : JSON.stringify(b);
};
module$exports$omid$common$ArgsSerDe.deserializeMessageArgs = function(a, b) {
  return (0,module$exports$omid$common$VersionUtils.isValidVersion)(a) && (0,module$exports$omid$common$VersionUtils.versionGreaterOrEqual)(a, module$contents$omid$common$ArgsSerDe_ARGS_NOT_SERIALIZED_VERSION) ? b ? b : [] : b && "string" === typeof b ? JSON.parse(b) : [];
};
var module$exports$omid$common$guid = {generateGuid:function() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
    var b = 16 * Math.random() | 0;
    a = "y" === a ? (b & 3 | 8).toString(16) : b.toString(16);
    return a;
  });
}};
var module$exports$omid$common$windowUtils = {};
function module$contents$omid$common$windowUtils_isValidWindow(a) {
  return null != a && "undefined" !== typeof a.top && null != a.top;
}
module$exports$omid$common$windowUtils.isCrossOrigin = function(a) {
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
};
function module$contents$omid$common$windowUtils_isSameOriginForIE(a) {
  return "" === a.x || "" !== a.x;
}
module$exports$omid$common$windowUtils.resolveGlobalContext = function(a) {
  "undefined" === typeof a && "undefined" !== typeof window && window && (a = window);
  return module$contents$omid$common$windowUtils_isValidWindow(a) ? a : module$exports$omid$common$OmidGlobalProvider.omidGlobal;
};
module$exports$omid$common$windowUtils.resolveTopWindowContext = function(a) {
  return module$contents$omid$common$windowUtils_isValidWindow(a) ? a.top : module$exports$omid$common$OmidGlobalProvider.omidGlobal;
};
module$exports$omid$common$windowUtils.evaluatePageUrl = function(a) {
  if (!module$contents$omid$common$windowUtils_isValidWindow(a)) {
    return null;
  }
  try {
    var b = a.top;
    return (0,module$exports$omid$common$windowUtils.isCrossOrigin)(b) ? null : b.location.href;
  } catch (c) {
    return null;
  }
};
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
  a.addEventListener("message", function(a) {
    if ("object" === typeof a.data) {
      var b = a.data;
      module$exports$omid$common$InternalMessage.isValidSerializedMessage(b) && (b = module$exports$omid$common$InternalMessage.deserialize(b), a.source && c.handleMessage(b, a.source));
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
  return this.to ? (0,module$exports$omid$common$windowUtils.isCrossOrigin)(this.to) : !0;
};
var module$exports$omid$common$DetectOmid = {OMID_PRESENT_FRAME_NAME:"omid_v1_present", isOmidPresent:function(a) {
  try {
    return a.frames ? !!a.frames[module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME] : !1;
  } catch (b) {
    return !1;
  }
}, declareOmidPresence:function(a) {
  a.frames && a.document && (module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME in a.frames || (null == a.document.body && module$exports$omid$common$DetectOmid.isMutationObserverAvailable_(a) ? module$exports$omid$common$DetectOmid.registerMutationObserver_(a) : a.document.body ? module$exports$omid$common$DetectOmid.appendPresenceIframe_(a) : a.document.write('<iframe style="display:none" id="' + (module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME + '" name="') + (module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME + 
  '"></iframe>'))));
}, appendPresenceIframe_:function(a) {
  var b = a.document.createElement("iframe");
  b.id = module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME;
  b.name = module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME;
  b.style.display = "none";
  a.document.body.appendChild(b);
}, isMutationObserverAvailable_:function(a) {
  return "MutationObserver" in a;
}, registerMutationObserver_:function(a) {
  var b = new MutationObserver(function(c) {
    c.forEach(function(c) {
      "BODY" === c.addedNodes[0].nodeName && (module$exports$omid$common$DetectOmid.appendPresenceIframe_(a), b.disconnect());
    });
  });
  b.observe(a.document.documentElement, {childList:!0});
}};
var module$exports$omid$common$serviceCommunication = {}, module$contents$omid$common$serviceCommunication_EXPORTED_SESSION_COMMUNICATION_NAME = ["omid", "v1_SessionServiceCommunication"], module$contents$omid$common$serviceCommunication_EXPORTED_VERIFICATION_COMMUNICATION_NAME = ["omid", "v1_VerificationServiceCommunication"], module$contents$omid$common$serviceCommunication_EXPORTED_SERVICE_WINDOW_NAME = ["omidVerificationProperties", "serviceWindow"];
function module$contents$omid$common$serviceCommunication_getValueForKeypath(a, b) {
  return b.reduce(function(a, b) {
    return a && a[b];
  }, a);
}
function module$contents$omid$common$serviceCommunication_startServiceCommunication(a, b, c, d) {
  if (!(0,module$exports$omid$common$windowUtils.isCrossOrigin)(b)) {
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
module$exports$omid$common$serviceCommunication.startSessionServiceCommunication = function(a, b, c) {
  c = void 0 === c ? module$exports$omid$common$DetectOmid.isOmidPresent : c;
  var d = [a, (0,module$exports$omid$common$windowUtils.resolveTopWindowContext)(a)];
  b && d.unshift(b);
  return module$contents$omid$common$serviceCommunication_startServiceCommunicationFromCandidates(a, d, module$contents$omid$common$serviceCommunication_EXPORTED_SESSION_COMMUNICATION_NAME, c);
};
module$exports$omid$common$serviceCommunication.startVerificationServiceCommunication = function(a, b) {
  b = void 0 === b ? module$exports$omid$common$DetectOmid.isOmidPresent : b;
  var c = [], d = module$contents$omid$common$serviceCommunication_getValueForKeypath(a, module$contents$omid$common$serviceCommunication_EXPORTED_SERVICE_WINDOW_NAME);
  d && c.push(d);
  c.push((0,module$exports$omid$common$windowUtils.resolveTopWindowContext)(a));
  return module$contents$omid$common$serviceCommunication_startServiceCommunicationFromCandidates(a, c, module$contents$omid$common$serviceCommunication_EXPORTED_VERIFICATION_COMMUNICATION_NAME, b);
};
var module$contents$omid$sessionClient$AdSession_SESSION_CLIENT_VERSION = module$exports$omid$common$version.Version, module$exports$omid$sessionClient$AdSession = function(a, b, c) {
  module$exports$omid$common$argsChecker.assertNotNullObject("AdSession.context", a);
  this.context_ = a;
  this.impressionOccurred_ = !1;
  var d = this.context_.serviceWindow || void 0;
  this.communication_ = b || (0,module$exports$omid$common$serviceCommunication.startSessionServiceCommunication)((0,module$exports$omid$common$windowUtils.resolveGlobalContext)(), d);
  this.sessionInterface_ = c || new module$exports$omid$sessionClient$OmidJsSessionInterface;
  this.isSessionRunning_ = this.hasMediaEvents_ = this.hasAdEvents_ = !1;
  this.impressionType_ = this.creativeType_ = null;
  this.creativeLoaded_ = !1;
  this.callbackMap_ = {};
  this.communication_ && (this.communication_.onMessage = this.handleInternalMessage_.bind(this));
  this.setClientInfo_();
  this.injectVerificationScripts_(a.verificationScriptResources);
  this.sendSlotElement_(a.slotElement);
  this.sendVideoElement_(a.videoElement);
  this.sendContentUrl_(a.contentUrl);
  this.watchSessionEvents_();
};
module$exports$omid$sessionClient$AdSession.prototype.setCreativeType = function(a) {
  if (a === module$exports$omid$common$constants.CreativeType.DEFINED_BY_JAVASCRIPT) {
    throw Error("Creative type cannot be redefined with value " + module$exports$omid$common$constants.CreativeType.DEFINED_BY_JAVASCRIPT);
  }
  if (this.impressionOccurred_) {
    throw Error("Impression has already occurred");
  }
  if (this.creativeLoaded_) {
    throw Error("Creative has already loaded");
  }
  if (this.creativeType_ && this.creativeType_ !== module$exports$omid$common$constants.CreativeType.DEFINED_BY_JAVASCRIPT) {
    throw Error("Creative type cannot be redefined");
  }
  if (void 0 === this.creativeType_) {
    throw Error("Native integration is using OMID 1.2 or earlier");
  }
  this.sendOneWayMessage("setCreativeType", a);
  this.creativeType_ = a;
};
module$exports$omid$sessionClient$AdSession.prototype.setImpressionType = function(a) {
  if (a === module$exports$omid$common$constants.ImpressionType.DEFINED_BY_JAVASCRIPT) {
    throw Error("Impression type cannot be redefined with value " + module$exports$omid$common$constants.ImpressionType.DEFINED_BY_JAVASCRIPT);
  }
  if (this.impressionOccurred_) {
    throw Error("Impression has already occurred");
  }
  if (this.creativeLoaded_) {
    throw Error("Creative has already loaded");
  }
  if (this.impressionType_ && this.impressionType_ !== module$exports$omid$common$constants.ImpressionType.DEFINED_BY_JAVASCRIPT) {
    throw Error("Impression type cannot be redefined");
  }
  if (void 0 === this.impressionType_) {
    throw Error("Native integration is using OMID 1.2 or earlier");
  }
  this.sendOneWayMessage("setImpressionType", a);
  this.impressionType_ = a;
};
module$exports$omid$sessionClient$AdSession.prototype.isSupported = function() {
  return !!this.communication_ || this.sessionInterface_.isSupported();
};
module$exports$omid$sessionClient$AdSession.prototype.isSendingElementsSupported_ = function() {
  return this.communication_ ? this.communication_.isDirectCommunication() : this.sessionInterface_.isSupported();
};
module$exports$omid$sessionClient$AdSession.prototype.registerSessionObserver = function(a) {
  this.sendMessage("registerSessionObserver", a);
};
module$exports$omid$sessionClient$AdSession.prototype.start = function() {
  this.sendOneWayMessage("startSession", {customReferenceData:this.context_.customReferenceData, underEvaluation:this.context_.underEvaluation});
};
module$exports$omid$sessionClient$AdSession.prototype.finish = function() {
  this.sendOneWayMessage("finishSession");
};
module$exports$omid$sessionClient$AdSession.prototype.error = function(a, b) {
  this.sendOneWayMessage("sessionError", a, b);
};
module$exports$omid$sessionClient$AdSession.prototype.registerAdEvents = function() {
  if (this.hasAdEvents_) {
    throw Error("AdEvents already registered.");
  }
  this.hasAdEvents_ = !0;
  this.sendOneWayMessage("registerAdEvents");
};
module$exports$omid$sessionClient$AdSession.prototype.registerMediaEvents = function() {
  if (this.hasMediaEvents_) {
    throw Error("MediaEvents already registered.");
  }
  this.hasMediaEvents_ = !0;
  this.sendOneWayMessage("registerMediaEvents");
};
module$exports$omid$sessionClient$AdSession.prototype.sendOneWayMessage = function(a, b) {
  for (var c = [], d = 1; d < arguments.length; ++d) {
    c[d - 1] = arguments[d];
  }
  this.sendMessage.apply(this, [a, null].concat($jscomp.arrayFromIterable(c)));
};
module$exports$omid$sessionClient$AdSession.prototype.sendMessage = function(a, b, c) {
  for (var d = [], e = 2; e < arguments.length; ++e) {
    d[e - 2] = arguments[e];
  }
  this.communication_ ? this.sendInternalMessage_(a, b, d) : this.sessionInterface_.isSupported() && this.sendInterfaceMessage_(a, b, d);
};
module$exports$omid$sessionClient$AdSession.prototype.sendInternalMessage_ = function(a, b, c) {
  var d = (0,module$exports$omid$common$guid.generateGuid)();
  b && (this.callbackMap_[d] = b);
  a = new module$exports$omid$common$InternalMessage(d, "SessionService." + a, module$contents$omid$sessionClient$AdSession_SESSION_CLIENT_VERSION, (0,module$exports$omid$common$ArgsSerDe.serializeMessageArgs)(module$contents$omid$sessionClient$AdSession_SESSION_CLIENT_VERSION, c));
  this.communication_.sendMessage(a);
};
module$exports$omid$sessionClient$AdSession.prototype.handleInternalMessage_ = function(a, b) {
  b = a.method;
  var c = a.guid;
  a = a.args;
  if ("response" === b && this.callbackMap_[c]) {
    var d = (0,module$exports$omid$common$ArgsSerDe.deserializeMessageArgs)(module$contents$omid$sessionClient$AdSession_SESSION_CLIENT_VERSION, a);
    this.callbackMap_[c].apply(this, d);
  }
  "error" === b && window.console && module$exports$omid$common$logger.error(a);
};
module$exports$omid$sessionClient$AdSession.prototype.sendInterfaceMessage_ = function(a, b, c) {
  try {
    this.sessionInterface_.sendMessage(a, b, c);
  } catch (d) {
    module$exports$omid$common$logger.error("Failed to communicate with SessionInterface with error:"), module$exports$omid$common$logger.error(d);
  }
};
module$exports$omid$sessionClient$AdSession.prototype.assertSessionRunning = function() {
  if (!this.isSessionRunning_) {
    throw Error("Session not started.");
  }
};
module$exports$omid$sessionClient$AdSession.prototype.impressionOccurred = function() {
  if (this.creativeType_ === module$exports$omid$common$constants.CreativeType.DEFINED_BY_JAVASCRIPT) {
    throw Error("Creative type has not been redefined");
  }
  if (this.impressionType_ === module$exports$omid$common$constants.ImpressionType.DEFINED_BY_JAVASCRIPT) {
    throw Error("Impression type has not been redefined");
  }
  this.impressionOccurred_ = !0;
};
module$exports$omid$sessionClient$AdSession.prototype.creativeLoaded = function() {
  if (this.creativeType_ === module$exports$omid$common$constants.CreativeType.DEFINED_BY_JAVASCRIPT) {
    throw Error("Creative type has not been redefined");
  }
  if (this.impressionType_ === module$exports$omid$common$constants.ImpressionType.DEFINED_BY_JAVASCRIPT) {
    throw Error("Impression type has not been redefined");
  }
  this.creativeLoaded_ = !0;
};
module$exports$omid$sessionClient$AdSession.prototype.setClientInfo_ = function() {
  this.sendOneWayMessage("setClientInfo", module$contents$omid$sessionClient$AdSession_SESSION_CLIENT_VERSION, this.context_.partner.name, this.context_.partner.version);
};
module$exports$omid$sessionClient$AdSession.prototype.injectVerificationScripts_ = function(a) {
  a && (a = a.map(function(a) {
    return a.toJSON();
  }), this.sendOneWayMessage("injectVerificationScriptResources", a));
};
module$exports$omid$sessionClient$AdSession.prototype.sendSlotElement_ = function(a) {
  this.sendElement_(a, "setSlotElement");
};
module$exports$omid$sessionClient$AdSession.prototype.sendVideoElement_ = function(a) {
  this.sendElement_(a, "setVideoElement");
};
module$exports$omid$sessionClient$AdSession.prototype.sendElement_ = function(a, b) {
  a && (this.isSendingElementsSupported_() ? this.sendOneWayMessage(b, a) : this.error(module$exports$omid$common$constants.ErrorType.GENERIC, "Session Client " + b + " called when communication is cross-origin"));
};
module$exports$omid$sessionClient$AdSession.prototype.sendContentUrl_ = function(a) {
  a && this.sendOneWayMessage("setContentUrl", a);
};
module$exports$omid$sessionClient$AdSession.prototype.setElementBounds = function(a) {
  module$exports$omid$common$argsChecker.assertNotNullObject("AdSession.elementBounds", a);
  this.sendOneWayMessage("setElementBounds", a);
};
module$exports$omid$sessionClient$AdSession.prototype.watchSessionEvents_ = function() {
  var a = this;
  this.registerSessionObserver(function(b) {
    b.type === module$exports$omid$common$constants.AdEventType.SESSION_START && (a.isSessionRunning_ = !0, a.creativeType_ = b.data.creativeType, a.impressionType_ = b.data.impressionType);
    b.type === module$exports$omid$common$constants.AdEventType.SESSION_FINISH && (a.isSessionRunning_ = !1);
  });
};
(0,module$exports$omid$common$exporter.packageExport)("OmidSessionClient.AdSession", module$exports$omid$sessionClient$AdSession);
var module$exports$omid$common$VastProperties = function(a, b, c, d) {
  this.isSkippable = a;
  this.skipOffset = b;
  this.isAutoPlay = c;
  this.position = d;
};
module$exports$omid$common$VastProperties.prototype.toJSON = function() {
  return {isSkippable:this.isSkippable, skipOffset:this.skipOffset, isAutoPlay:this.isAutoPlay, position:this.position};
};
var module$exports$omid$sessionClient$AdEvents = function(a) {
  module$exports$omid$common$argsChecker.assertNotNullObject("AdEvents.adSession", a);
  try {
    a.registerAdEvents(), this.adSession = a;
  } catch (b) {
    throw Error("AdSession already has an ad events instance registered");
  }
};
module$exports$omid$sessionClient$AdEvents.prototype.impressionOccurred = function() {
  this.adSession.assertSessionRunning();
  this.adSession.impressionOccurred();
  this.adSession.sendOneWayMessage("impressionOccurred");
};
module$exports$omid$sessionClient$AdEvents.prototype.loaded = function(a) {
  a = void 0 === a ? null : a;
  this.adSession.creativeLoaded();
  a ? this.adSession.sendOneWayMessage("loaded", a.toJSON()) : this.adSession.sendOneWayMessage("loaded");
};
(0,module$exports$omid$common$exporter.packageExport)("OmidSessionClient.AdEvents", module$exports$omid$sessionClient$AdEvents);
var module$exports$omid$sessionClient$MediaEvents = function(a) {
  module$exports$omid$common$argsChecker.assertNotNullObject("MediaEvents.adSession", a);
  try {
    a.registerMediaEvents(), this.adSession = a;
  } catch (b) {
    throw Error("AdSession already has a media events instance registered");
  }
};
module$exports$omid$sessionClient$MediaEvents.prototype.start = function(a, b) {
  module$exports$omid$common$argsChecker.assertNumber("MediaEvents.start.duration", a);
  module$exports$omid$common$argsChecker.assertNumberBetween("MediaEvents.start.mediaPlayerVolume", b, 0, 1);
  this.adSession.sendOneWayMessage("start", a, b);
};
module$exports$omid$sessionClient$MediaEvents.prototype.firstQuartile = function() {
  this.adSession.sendOneWayMessage("firstQuartile");
};
module$exports$omid$sessionClient$MediaEvents.prototype.midpoint = function() {
  this.adSession.sendOneWayMessage("midpoint");
};
module$exports$omid$sessionClient$MediaEvents.prototype.thirdQuartile = function() {
  this.adSession.sendOneWayMessage("thirdQuartile");
};
module$exports$omid$sessionClient$MediaEvents.prototype.complete = function() {
  this.adSession.sendOneWayMessage("complete");
};
module$exports$omid$sessionClient$MediaEvents.prototype.pause = function() {
  this.adSession.sendOneWayMessage("pause");
};
module$exports$omid$sessionClient$MediaEvents.prototype.resume = function() {
  this.adSession.sendOneWayMessage("resume");
};
module$exports$omid$sessionClient$MediaEvents.prototype.bufferStart = function() {
  this.adSession.sendOneWayMessage("bufferStart");
};
module$exports$omid$sessionClient$MediaEvents.prototype.bufferFinish = function() {
  this.adSession.sendOneWayMessage("bufferFinish");
};
module$exports$omid$sessionClient$MediaEvents.prototype.skipped = function() {
  this.adSession.sendOneWayMessage("skipped");
};
module$exports$omid$sessionClient$MediaEvents.prototype.volumeChange = function(a) {
  module$exports$omid$common$argsChecker.assertNumberBetween("MediaEvents.volumeChange.mediaPlayerVolume", a, 0, 1);
  this.adSession.sendOneWayMessage("volumeChange", a);
};
module$exports$omid$sessionClient$MediaEvents.prototype.playerStateChange = function(a) {
  module$exports$omid$common$argsChecker.assertNotNullObject("MediaEvents.playerStateChange.playerState", a);
  this.adSession.sendOneWayMessage("playerStateChange", a);
};
module$exports$omid$sessionClient$MediaEvents.prototype.adUserInteraction = function(a) {
  module$exports$omid$common$argsChecker.assertNotNullObject("MediaEvents.adUserInteraction.interactionType", a);
  this.adSession.sendOneWayMessage("adUserInteraction", a);
};
(0,module$exports$omid$common$exporter.packageExport)("OmidSessionClient.MediaEvents", module$exports$omid$sessionClient$MediaEvents);
var module$exports$omid$sessionClient$OmidVersion = function(a, b) {
  module$exports$omid$common$argsChecker.assertTruthyString("OmidVersion.semanticVersion", a);
  module$exports$omid$common$argsChecker.assertTruthyString("OmidVersion.apiLevel", b);
};
(0,module$exports$omid$common$exporter.packageExport)("OmidSessionClient.OmidVersion", module$exports$omid$sessionClient$OmidVersion);
var module$exports$omid$sessionClient$VastPropertiesExports = {};
(0,module$exports$omid$common$exporter.packageExport)("OmidSessionClient.VastProperties", module$exports$omid$common$VastProperties);

}, typeof exports === 'undefined' ? undefined : exports));

