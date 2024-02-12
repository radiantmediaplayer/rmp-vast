;(function(omidGlobal, factory, exports) {
  // CommonJS support
  if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(omidGlobal, exports);

  // If neither AMD nor CommonJS are used, export to a versioned name in the
  // global context.
  } else {
    var exports = {};
    var versions = ['1.4.12-iab4299'];
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
  for (var l = 0; l < e.length - 1; l++) {
    var m = e[l];
    if (!(m in d)) {
      return;
    }
    d = d[m];
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
$jscomp.initSymbol = function() {
};
$jscomp.polyfill("Symbol", function(a) {
  if (a) {
    return a;
  }
  var b = function(l, m) {
    this.$jscomp$symbol$id_ = l;
    $jscomp.defineProperty(this, "description", {configurable:!0, writable:!0, value:m});
  };
  b.prototype.toString = function() {
    return this.$jscomp$symbol$id_;
  };
  var c = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_", d = 0, e = function(l) {
    if (this instanceof e) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new b(c + (l || "") + "_" + d++, l);
  };
  return e;
}, "es6", "es3");
$jscomp.polyfill("Symbol.iterator", function(a) {
  if (a) {
    return a;
  }
  a = Symbol("Symbol.iterator");
  for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
    var d = $jscomp.global[b[c]];
    "function" === typeof d && "function" != typeof d.prototype[a] && $jscomp.defineProperty(d.prototype, a, {configurable:!0, writable:!0, value:function() {
      return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
    }});
  }
  return a;
}, "es6", "es3");
$jscomp.iteratorPrototype = function(a) {
  a = {next:a};
  a[Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.iteratorFromArray = function(a, b) {
  a instanceof String && (a += "");
  var c = 0, d = !1, e = {next:function() {
    if (!d && c < a.length) {
      var l = c++;
      return {value:b(l, a[l]), done:!1};
    }
    d = !0;
    return {done:!0, value:void 0};
  }};
  e[Symbol.iterator] = function() {
    return e;
  };
  return e;
};
$jscomp.polyfill("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return $jscomp.iteratorFromArray(this, function(b) {
      return b;
    });
  };
}, "es6", "es3");
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
$jscomp.checkEs6ConformanceViaProxy = function() {
  try {
    var a = {}, b = Object.create(new $jscomp.global.Proxy(a, {get:function(c, d, e) {
      return c == a && "q" == d && e == b;
    }}));
    return !0 === b.q;
  } catch (c) {
    return !1;
  }
};
$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
$jscomp.ES6_CONFORMANCE = $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && $jscomp.checkEs6ConformanceViaProxy();
$jscomp.polyfill("WeakMap", function(a) {
  function b() {
    if (!a || !Object.seal) {
      return !1;
    }
    try {
      var f = Object.seal({}), h = Object.seal({}), k = new a([[f, 2], [h, 3]]);
      if (2 != k.get(f) || 3 != k.get(h)) {
        return !1;
      }
      k.delete(f);
      k.set(h, 4);
      return !k.has(f) && 4 == k.get(h);
    } catch (n) {
      return !1;
    }
  }
  function c() {
  }
  function d(f) {
    var h = typeof f;
    return "object" === h && null !== f || "function" === h;
  }
  function e(f) {
    if (!$jscomp.owns(f, m)) {
      var h = new c();
      $jscomp.defineProperty(f, m, {value:h});
    }
  }
  function l(f) {
    if (!$jscomp.ISOLATE_POLYFILLS) {
      var h = Object[f];
      h && (Object[f] = function(k) {
        if (k instanceof c) {
          return k;
        }
        Object.isExtensible(k) && e(k);
        return h(k);
      });
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (a && $jscomp.ES6_CONFORMANCE) {
      return a;
    }
  } else {
    if (b()) {
      return a;
    }
  }
  var m = "$jscomp_hidden_" + Math.random();
  l("freeze");
  l("preventExtensions");
  l("seal");
  var p = 0, g = function(f) {
    this.id_ = (p += Math.random() + 1).toString();
    if (f) {
      f = $jscomp.makeIterator(f);
      for (var h; !(h = f.next()).done;) {
        h = h.value, this.set(h[0], h[1]);
      }
    }
  };
  g.prototype.set = function(f, h) {
    if (!d(f)) {
      throw Error("Invalid WeakMap key");
    }
    e(f);
    if (!$jscomp.owns(f, m)) {
      throw Error("WeakMap key fail: " + f);
    }
    f[m][this.id_] = h;
    return this;
  };
  g.prototype.get = function(f) {
    return d(f) && $jscomp.owns(f, m) ? f[m][this.id_] : void 0;
  };
  g.prototype.has = function(f) {
    return d(f) && $jscomp.owns(f, m) && $jscomp.owns(f[m], this.id_);
  };
  g.prototype.delete = function(f) {
    return d(f) && $jscomp.owns(f, m) && $jscomp.owns(f[m], this.id_) ? delete f[m][this.id_] : !1;
  };
  return g;
}, "es6", "es3");
$jscomp.MapEntry = function() {
};
$jscomp.polyfill("Map", function(a) {
  function b() {
    if ($jscomp.ASSUME_NO_NATIVE_MAP || !a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) {
      return !1;
    }
    try {
      var g = Object.seal({x:4}), f = new a($jscomp.makeIterator([[g, "s"]]));
      if ("s" != f.get(g) || 1 != f.size || f.get({x:4}) || f.set({x:4}, "t") != f || 2 != f.size) {
        return !1;
      }
      var h = f.entries(), k = h.next();
      if (k.done || k.value[0] != g || "s" != k.value[1]) {
        return !1;
      }
      k = h.next();
      return k.done || 4 != k.value[0].x || "t" != k.value[1] || !h.next().done ? !1 : !0;
    } catch (n) {
      return !1;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (a && $jscomp.ES6_CONFORMANCE) {
      return a;
    }
  } else {
    if (b()) {
      return a;
    }
  }
  var c = new WeakMap(), d = function(g) {
    this.data_ = {};
    this.head_ = m();
    this.size = 0;
    if (g) {
      g = $jscomp.makeIterator(g);
      for (var f; !(f = g.next()).done;) {
        f = f.value, this.set(f[0], f[1]);
      }
    }
  };
  d.prototype.set = function(g, f) {
    g = 0 === g ? 0 : g;
    var h = e(this, g);
    h.list || (h.list = this.data_[h.id] = []);
    h.entry ? h.entry.value = f : (h.entry = {next:this.head_, previous:this.head_.previous, head:this.head_, key:g, value:f,}, h.list.push(h.entry), this.head_.previous.next = h.entry, this.head_.previous = h.entry, this.size++);
    return this;
  };
  d.prototype.delete = function(g) {
    g = e(this, g);
    return g.entry && g.list ? (g.list.splice(g.index, 1), g.list.length || delete this.data_[g.id], g.entry.previous.next = g.entry.next, g.entry.next.previous = g.entry.previous, g.entry.head = null, this.size--, !0) : !1;
  };
  d.prototype.clear = function() {
    this.data_ = {};
    this.head_ = this.head_.previous = m();
    this.size = 0;
  };
  d.prototype.has = function(g) {
    return !!e(this, g).entry;
  };
  d.prototype.get = function(g) {
    return (g = e(this, g).entry) && g.value;
  };
  d.prototype.entries = function() {
    return l(this, function(g) {
      return [g.key, g.value];
    });
  };
  d.prototype.keys = function() {
    return l(this, function(g) {
      return g.key;
    });
  };
  d.prototype.values = function() {
    return l(this, function(g) {
      return g.value;
    });
  };
  d.prototype.forEach = function(g, f) {
    for (var h = this.entries(), k; !(k = h.next()).done;) {
      k = k.value, g.call(f, k[1], k[0], this);
    }
  };
  d.prototype[Symbol.iterator] = d.prototype.entries;
  var e = function(g, f) {
    var h = f && typeof f;
    "object" == h || "function" == h ? c.has(f) ? h = c.get(f) : (h = "" + ++p, c.set(f, h)) : h = "p_" + f;
    var k = g.data_[h];
    if (k && $jscomp.owns(g.data_, h)) {
      for (g = 0; g < k.length; g++) {
        var n = k[g];
        if (f !== f && n.key !== n.key || f === n.key) {
          return {id:h, list:k, index:g, entry:n};
        }
      }
    }
    return {id:h, list:k, index:-1, entry:void 0};
  }, l = function(g, f) {
    var h = g.head_;
    return $jscomp.iteratorPrototype(function() {
      if (h) {
        for (; h.head != g.head_;) {
          h = h.previous;
        }
        for (; h.next != h.head;) {
          return h = h.next, {done:!1, value:f(h)};
        }
        h = null;
      }
      return {done:!0, value:void 0};
    });
  }, m = function() {
    var g = {};
    return g.previous = g.next = g.head = g;
  }, p = 0;
  return d;
}, "es6", "es3");
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
var module$exports$omid$sessionClient$Partner = function(a, b) {
  module$contents$omid$common$argsChecker_assertTruthyString("Partner.name", a);
  module$contents$omid$common$argsChecker_assertTruthyString("Partner.version", b);
  this.name = a;
  this.version = b;
};
module$contents$omid$common$exporter_packageExport("OmidSessionClient.Partner", module$exports$omid$sessionClient$Partner);
var module$exports$omid$sessionClient$VerificationScriptResource = function(a, b, c, d) {
  d = void 0 === d ? module$exports$omid$common$constants.AccessMode.FULL : d;
  module$contents$omid$common$argsChecker_assertTruthyString("VerificationScriptResource.resourceUrl", a);
  this.resourceUrl = a;
  this.vendorKey = b;
  this.verificationParameters = c;
  this.accessMode = d;
};
module$exports$omid$sessionClient$VerificationScriptResource.prototype.toJSON = function() {
  return {accessMode:this.accessMode, resourceUrl:this.resourceUrl, vendorKey:this.vendorKey, verificationParameters:this.verificationParameters,};
};
module$contents$omid$common$exporter_packageExport("OmidSessionClient.VerificationScriptResource", module$exports$omid$sessionClient$VerificationScriptResource);
var module$exports$omid$sessionClient$Context = function(a, b, c, d) {
  c = void 0 === c ? null : c;
  d = void 0 === d ? null : d;
  module$contents$omid$common$argsChecker_assertNotNullObject("Context.partner", a);
  this.partner = a;
  this.verificationScriptResources = b;
  this.videoElement = this.slotElement = null;
  this.contentUrl = c;
  this.customReferenceData = d;
  this.underEvaluation = !1;
  this.serviceWindow = null;
};
module$exports$omid$sessionClient$Context.prototype.setVideoElement = function(a) {
  module$contents$omid$common$argsChecker_assertNotNullObject("Context.videoElement", a);
  this.videoElement = a;
};
module$exports$omid$sessionClient$Context.prototype.setSlotElement = function(a) {
  module$contents$omid$common$argsChecker_assertNotNullObject("Context.slotElement", a);
  this.slotElement = a;
};
module$exports$omid$sessionClient$Context.prototype.setServiceWindow = function(a) {
  module$contents$omid$common$argsChecker_assertNotNullObject("Context.serviceWindow", a);
  this.serviceWindow = a;
};
module$contents$omid$common$exporter_packageExport("OmidSessionClient.Context", module$exports$omid$sessionClient$Context);
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
var module$contents$omid$sessionClient$OmidJsSessionInterface_ExportedNodeKeys = {ROOT:"omidSessionInterface", AD_EVENTS:"adEvents", MEDIA_EVENTS:"mediaEvents",}, module$contents$omid$sessionClient$OmidJsSessionInterface_MethodNameMap = {sessionError:"reportError",}, module$contents$omid$sessionClient$OmidJsSessionInterface_MediaEventMethodNames = Object.keys(module$exports$omid$common$constants.MediaEventType).map(function(a) {
  return module$exports$omid$common$constants.MediaEventType[a];
}), module$contents$omid$sessionClient$OmidJsSessionInterface_AdEventMethodNames = ["impressionOccurred",], module$exports$omid$sessionClient$OmidJsSessionInterface = function(a) {
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
var module$exports$omid$common$guid = {};
function module$contents$omid$common$guid_generateGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
    var b = 16 * Math.random() | 0;
    a = "y" === a ? (b & 3 | 8).toString(16) : b.toString(16);
    return a;
  });
}
module$exports$omid$common$guid.generateGuid = module$contents$omid$common$guid_generateGuid;
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
    } catch (l) {
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
var module$contents$omid$sessionClient$AdSession_SESSION_CLIENT_VERSION = module$exports$omid$common$version.Version, module$exports$omid$sessionClient$AdSession = function(a, b, c) {
  module$contents$omid$common$argsChecker_assertNotNullObject("AdSession.context", a);
  this.adSessionId_ = module$contents$omid$common$guid_generateGuid();
  this.context_ = a;
  this.impressionOccurred_ = !1;
  var d = this.context_.serviceWindow || void 0;
  this.communication_ = b || module$contents$omid$common$serviceCommunication_startSessionServiceCommunication(module$contents$omid$common$windowUtils_resolveGlobalContext(), d);
  this.sessionInterface_ = c || new module$exports$omid$sessionClient$OmidJsSessionInterface();
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
module$exports$omid$sessionClient$AdSession.prototype.getAdSessionId = function() {
  return this.adSessionId_;
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
  this.sendOneWayMessage("setCreativeType", a, this.adSessionId_);
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
  this.sendOneWayMessage("setImpressionType", a, this.adSessionId_);
  this.impressionType_ = a;
};
module$exports$omid$sessionClient$AdSession.prototype.isSupported = function() {
  return !!this.communication_ || this.sessionInterface_.isSupported();
};
module$exports$omid$sessionClient$AdSession.prototype.isSendingElementsSupported_ = function() {
  return this.communication_ ? this.communication_.isDirectCommunication() : this.sessionInterface_.isSupported();
};
module$exports$omid$sessionClient$AdSession.prototype.registerSessionObserver = function(a) {
  this.sendMessage("registerSessionObserver", a, this.adSessionId_);
};
module$exports$omid$sessionClient$AdSession.prototype.start = function() {
  this.sendOneWayMessage("startSession", {customReferenceData:this.context_.customReferenceData, underEvaluation:this.context_.underEvaluation,}, this.adSessionId_);
};
module$exports$omid$sessionClient$AdSession.prototype.finish = function() {
  this.sendOneWayMessage("finishSession", this.adSessionId_);
};
module$exports$omid$sessionClient$AdSession.prototype.error = function(a, b) {
  this.sendOneWayMessage("sessionError", a, b, this.adSessionId_);
};
module$exports$omid$sessionClient$AdSession.prototype.registerAdEvents = function() {
  if (this.hasAdEvents_) {
    throw Error("AdEvents already registered.");
  }
  this.hasAdEvents_ = !0;
  this.sendOneWayMessage("registerAdEvents", this.adSessionId_);
};
module$exports$omid$sessionClient$AdSession.prototype.registerMediaEvents = function() {
  if (this.hasMediaEvents_) {
    throw Error("MediaEvents already registered.");
  }
  this.hasMediaEvents_ = !0;
  this.sendOneWayMessage("registerMediaEvents", this.adSessionId_);
};
module$exports$omid$sessionClient$AdSession.prototype.sendOneWayMessage = function(a) {
  var b = $jscomp.getRestArguments.apply(1, arguments);
  this.sendMessage.apply(this, [a, null].concat($jscomp.arrayFromIterable(b)));
};
module$exports$omid$sessionClient$AdSession.prototype.sendMessage = function(a, b) {
  var c = $jscomp.getRestArguments.apply(2, arguments);
  this.communication_ ? this.sendInternalMessage_(a, b, c) : this.sessionInterface_.isSupported() && this.sendInterfaceMessage_(a, b, c);
};
module$exports$omid$sessionClient$AdSession.prototype.sendInternalMessage_ = function(a, b, c) {
  var d = module$contents$omid$common$guid_generateGuid();
  b && (this.callbackMap_[d] = b);
  a = new module$exports$omid$common$InternalMessage(d, module$contents$omid$common$serviceMethodUtils_getPrefixedSessionServiceMethod(a), module$exports$omid$common$version.Version, module$contents$omid$common$ArgsSerDe_serializeMessageArgs(module$exports$omid$common$version.Version, c));
  this.communication_.sendMessage(a);
};
module$exports$omid$sessionClient$AdSession.prototype.handleInternalMessage_ = function(a, b) {
  b = a.method;
  var c = a.guid;
  a = a.args;
  if ("response" === b && this.callbackMap_[c]) {
    var d = module$contents$omid$common$ArgsSerDe_deserializeMessageArgs(module$exports$omid$common$version.Version, a);
    this.callbackMap_[c].apply(this, d);
  }
  "error" === b && window.console && module$contents$omid$common$logger_error(a);
};
module$exports$omid$sessionClient$AdSession.prototype.sendInterfaceMessage_ = function(a, b, c) {
  try {
    this.sessionInterface_.sendMessage(a, b, c);
  } catch (d) {
    module$contents$omid$common$logger_error("Failed to communicate with SessionInterface with error:"), module$contents$omid$common$logger_error(d);
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
  this.sendOneWayMessage("setClientInfo", module$exports$omid$common$version.Version, this.context_.partner.name, this.context_.partner.version, this.adSessionId_);
};
module$exports$omid$sessionClient$AdSession.prototype.injectVerificationScripts_ = function(a) {
  a && (a = a.map(function(b) {
    return b.toJSON();
  }), this.sendOneWayMessage("injectVerificationScriptResources", a, this.adSessionId_));
};
module$exports$omid$sessionClient$AdSession.prototype.sendSlotElement_ = function(a) {
  this.sendElement_(a, "setSlotElement");
};
module$exports$omid$sessionClient$AdSession.prototype.sendVideoElement_ = function(a) {
  this.sendElement_(a, "setVideoElement");
};
module$exports$omid$sessionClient$AdSession.prototype.sendElement_ = function(a, b) {
  a && (this.isSendingElementsSupported_() ? this.sendOneWayMessage(b, a, this.adSessionId_) : this.error(module$exports$omid$common$constants.ErrorType.GENERIC, "Session Client " + b + " called when communication is cross-origin"));
};
module$exports$omid$sessionClient$AdSession.prototype.sendContentUrl_ = function(a) {
  a && this.sendOneWayMessage("setContentUrl", a, this.adSessionId_);
};
module$exports$omid$sessionClient$AdSession.prototype.setElementBounds = function(a) {
  module$contents$omid$common$argsChecker_assertNotNullObject("AdSession.elementBounds", a);
  this.sendOneWayMessage("setElementBounds", a, this.adSessionId_);
};
module$exports$omid$sessionClient$AdSession.prototype.watchSessionEvents_ = function() {
  var a = this;
  this.registerSessionObserver(function(b) {
    b.type === module$exports$omid$common$constants.AdEventType.SESSION_START && (a.isSessionRunning_ = !0, a.creativeType_ = b.data.creativeType, a.impressionType_ = b.data.impressionType);
    b.type === module$exports$omid$common$constants.AdEventType.SESSION_FINISH && (a.isSessionRunning_ = !1);
  });
};
module$contents$omid$common$exporter_packageExport("OmidSessionClient.AdSession", module$exports$omid$sessionClient$AdSession);
var module$exports$omid$common$VastProperties = function(a, b, c, d) {
  this.isSkippable = a;
  this.skipOffset = b;
  this.isAutoPlay = c;
  this.position = d;
};
module$exports$omid$common$VastProperties.prototype.toJSON = function() {
  return {isSkippable:this.isSkippable, skipOffset:this.skipOffset, isAutoPlay:this.isAutoPlay, position:this.position,};
};
var module$exports$omid$sessionClient$AdEvents = function(a) {
  module$contents$omid$common$argsChecker_assertNotNullObject("AdEvents.adSession", a);
  this.adSessionId_ = a.getAdSessionId();
  try {
    a.registerAdEvents(), this.adSession = a;
  } catch (b) {
    throw Error("AdSession already has an ad events instance registered");
  }
};
module$exports$omid$sessionClient$AdEvents.prototype.impressionOccurred = function() {
  this.adSession.assertSessionRunning();
  this.adSession.impressionOccurred();
  this.adSession.sendOneWayMessage("impressionOccurred", this.adSessionId_);
};
module$exports$omid$sessionClient$AdEvents.prototype.loaded = function(a) {
  a = void 0 === a ? null : a;
  this.adSession.creativeLoaded();
  a = a ? a.toJSON() : null;
  this.adSession.sendOneWayMessage("loaded", a, this.adSessionId_);
};
module$contents$omid$common$exporter_packageExport("OmidSessionClient.AdEvents", module$exports$omid$sessionClient$AdEvents);
var module$exports$omid$sessionClient$MediaEvents = function(a) {
  module$contents$omid$common$argsChecker_assertNotNullObject("MediaEvents.adSession", a);
  this.adSessionId_ = a.getAdSessionId();
  try {
    a.registerMediaEvents(), this.adSession = a;
  } catch (b) {
    throw Error("AdSession already has a media events instance registered");
  }
};
module$exports$omid$sessionClient$MediaEvents.prototype.start = function(a, b) {
  module$contents$omid$common$argsChecker_assertNumber("MediaEvents.start.duration", a);
  module$contents$omid$common$argsChecker_assertNumberBetween("MediaEvents.start.mediaPlayerVolume", b, 0, 1);
  this.adSession.sendOneWayMessage("start", a, b, this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.firstQuartile = function() {
  this.adSession.sendOneWayMessage("firstQuartile", this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.midpoint = function() {
  this.adSession.sendOneWayMessage("midpoint", this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.thirdQuartile = function() {
  this.adSession.sendOneWayMessage("thirdQuartile", this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.complete = function() {
  this.adSession.sendOneWayMessage("complete", this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.pause = function() {
  this.adSession.sendOneWayMessage("pause", this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.resume = function() {
  this.adSession.sendOneWayMessage("resume", this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.bufferStart = function() {
  this.adSession.sendOneWayMessage("bufferStart", this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.bufferFinish = function() {
  this.adSession.sendOneWayMessage("bufferFinish", this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.skipped = function() {
  this.adSession.sendOneWayMessage("skipped", this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.volumeChange = function(a) {
  module$contents$omid$common$argsChecker_assertNumberBetween("MediaEvents.volumeChange.mediaPlayerVolume", a, 0, 1);
  this.adSession.sendOneWayMessage("volumeChange", a, this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.playerStateChange = function(a) {
  module$contents$omid$common$argsChecker_assertNotNullObject("MediaEvents.playerStateChange.playerState", a);
  this.adSession.sendOneWayMessage("playerStateChange", a, this.adSessionId_);
};
module$exports$omid$sessionClient$MediaEvents.prototype.adUserInteraction = function(a) {
  module$contents$omid$common$argsChecker_assertNotNullObject("MediaEvents.adUserInteraction.interactionType", a);
  this.adSession.sendOneWayMessage("adUserInteraction", a, this.adSessionId_);
};
module$contents$omid$common$exporter_packageExport("OmidSessionClient.MediaEvents", module$exports$omid$sessionClient$MediaEvents);
var module$exports$omid$sessionClient$OmidVersion = function(a, b) {
  module$contents$omid$common$argsChecker_assertTruthyString("OmidVersion.semanticVersion", a);
  module$contents$omid$common$argsChecker_assertTruthyString("OmidVersion.apiLevel", b);
};
module$contents$omid$common$exporter_packageExport("OmidSessionClient.OmidVersion", module$exports$omid$sessionClient$OmidVersion);
var module$exports$omid$sessionClient$ServiceCommunication = {};
function module$contents$omid$sessionClient$ServiceCommunication_listenForServiceWindow(a) {
  var b = module$contents$omid$common$windowUtils_resolveGlobalContext();
  (new module$exports$omid$common$PostMessageCommunication(b)).onMessage = function(c, d) {
    c.method === module$exports$omid$common$constants.MessageMethod.IDENTIFY_SERVICE_WINDOW && a(d);
  };
}
module$contents$omid$common$exporter_packageExport("OmidSessionClient.listenForServiceWindow", module$contents$omid$sessionClient$ServiceCommunication_listenForServiceWindow);
module$exports$omid$sessionClient$ServiceCommunication.listenForServiceWindow = module$contents$omid$sessionClient$ServiceCommunication_listenForServiceWindow;
var module$exports$omid$sessionClient$VastPropertiesExports = {};
module$contents$omid$common$exporter_packageExport("OmidSessionClient.VastProperties", module$exports$omid$common$VastProperties);
var module$exports$omid$sessionClient$VerificationVendor = {VerificationVendorId:{OTHER:1, MOAT:2, DOUBLEVERIFY:3, INTEGRAL_AD_SCIENCE:4, PIXELATE:5, NIELSEN:6, COMSCORE:7, MEETRICS:8, GOOGLE:9,}};
function module$contents$omid$sessionClient$VerificationVendor_verificationVendorIdForScriptUrl(a) {
  for (var b = $jscomp.makeIterator(module$contents$omid$sessionClient$VerificationVendor_VERIFICATION_VENDORS.keys()), c = b.next(); !c.done; c = b.next()) {
    c = c.value;
    for (var d = $jscomp.makeIterator(module$contents$omid$sessionClient$VerificationVendor_VERIFICATION_VENDORS.get(c)), e = d.next(); !e.done; e = d.next()) {
      if (e.value.test(a)) {
        return c;
      }
    }
  }
  return module$exports$omid$sessionClient$VerificationVendor.VerificationVendorId.OTHER;
}
var module$contents$omid$sessionClient$VerificationVendor_VERIFICATION_VENDORS = new Map([[module$exports$omid$sessionClient$VerificationVendor.VerificationVendorId.MOAT, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.moatads\.com\/.*$/,],], [module$exports$omid$sessionClient$VerificationVendor.VerificationVendorId.DOUBLEVERIFY, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.doubleverify\.com\/.*$/, /^(https?:\/\/|\/\/)?c\.[\w\-]+\.com\/vfw\/dv\/.*$/, /^(https?:\/\/|\/\/)?(www\.)?[\w]+\.tv\/r\/s\/d\/.*$/, /^(https?:\/\/|\/\/)?(\w\.?)+\.dv\.tech\/.*$/,
],], [module$exports$omid$sessionClient$VerificationVendor.VerificationVendorId.INTEGRAL_AD_SCIENCE, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.adsafeprotected\.com\/.*$/,],], [module$exports$omid$sessionClient$VerificationVendor.VerificationVendorId.PIXELATE, [/^https?:\/\/(q|cdn)\.adrta\.com\/s\/.*\/(aa|aanf)\.js.*$/, /^https:\/\/cdn\.rta247\.com\/s\/.*\/(aa|aanf)\.js.*$/,],], [module$exports$omid$sessionClient$VerificationVendor.VerificationVendorId.NIELSEN, [],], [module$exports$omid$sessionClient$VerificationVendor.VerificationVendorId.COMSCORE, 
[/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.voicefive\.com\/.*$/, /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.measuread\.com\/.*$/, /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.scorecardresearch\.com\/.*$/,],], [module$exports$omid$sessionClient$VerificationVendor.VerificationVendorId.MEETRICS, [/^(https?:\/\/|\/\/)?s418\.mxcdn\.net\/bb-serve\/omid-meetrics.*\.js$/,],], [module$exports$omid$sessionClient$VerificationVendor.VerificationVendorId.GOOGLE, [/^(https?:\/\/|\/\/)?pagead2\.googlesyndication\.com\/.*$/, /^(https?:\/\/|\/\/)?www\.googletagservices\.com\/.*$/,
],],]);
module$contents$omid$common$exporter_packageExport("OmidSessionClient.verificationVendorIdForScriptUrl", module$contents$omid$sessionClient$VerificationVendor_verificationVendorIdForScriptUrl);
module$contents$omid$common$exporter_packageExport("OmidSessionClient.VerificationVendorId", module$exports$omid$sessionClient$VerificationVendor.VerificationVendorId);
module$exports$omid$sessionClient$VerificationVendor.verificationVendorIdForScriptUrl = module$contents$omid$sessionClient$VerificationVendor_verificationVendorIdForScriptUrl;
var module$exports$omid$common$FloatComparer = {}, module$contents$omid$common$FloatComparer_FLOAT_ROUGH_DIFF_TOLERANCE = 0.01;
function module$contents$omid$common$FloatComparer_roughlyEqual(a, b) {
  return Math.abs(a - b) < module$contents$omid$common$FloatComparer_FLOAT_ROUGH_DIFF_TOLERANCE;
}
function module$contents$omid$common$FloatComparer_roughlyLessThan(a, b) {
  return b - a > module$contents$omid$common$FloatComparer_FLOAT_ROUGH_DIFF_TOLERANCE;
}
function module$contents$omid$common$FloatComparer_lessThanOrRoughlyEqual(a, b) {
  return a < b || module$contents$omid$common$FloatComparer_roughlyEqual(a, b);
}
function module$contents$omid$common$FloatComparer_greaterThanOrRoughlyEqual(a, b) {
  return a > b || module$contents$omid$common$FloatComparer_roughlyEqual(a, b);
}
module$exports$omid$common$FloatComparer.roughlyLessThan = module$contents$omid$common$FloatComparer_roughlyLessThan;
module$exports$omid$common$FloatComparer.lessThanOrRoughlyEqual = module$contents$omid$common$FloatComparer_lessThanOrRoughlyEqual;
module$exports$omid$common$FloatComparer.greaterThanOrRoughlyEqual = module$contents$omid$common$FloatComparer_greaterThanOrRoughlyEqual;

}, typeof exports === 'undefined' ? undefined : exports));

