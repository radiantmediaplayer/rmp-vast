/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 43:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPossiblePrototype = __webpack_require__(4018);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 154:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(3930);
var anObject = __webpack_require__(6624);
var getMethod = __webpack_require__(9367);

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ }),

/***/ 160:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(3948);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ 183:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var call = __webpack_require__(3930);
var IS_PURE = __webpack_require__(7376);
var FunctionName = __webpack_require__(6833);
var isCallable = __webpack_require__(2250);
var createIteratorConstructor = __webpack_require__(7181);
var getPrototypeOf = __webpack_require__(5972);
var setPrototypeOf = __webpack_require__(9192);
var setToStringTag = __webpack_require__(4840);
var createNonEnumerableProperty = __webpack_require__(1626);
var defineBuiltIn = __webpack_require__(8055);
var wellKnownSymbol = __webpack_require__(6264);
var Iterators = __webpack_require__(3742);
var IteratorsCore = __webpack_require__(5116);

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];

    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    }

    return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};


/***/ }),

/***/ 300:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(3930);
var aCallable = __webpack_require__(2159);
var anObject = __webpack_require__(6624);
var tryToString = __webpack_require__(4640);
var getIteratorMethod = __webpack_require__(3448);

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw new $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ }),

/***/ 376:
/***/ (function(module) {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 470:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(6028);
var isSymbol = __webpack_require__(5594);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 473:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(6264);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  try {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  } catch (error) { return false; } // workaround of old WebKit + `eval` bug
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ 540:
/***/ (function(module) {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 551:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var isCallable = __webpack_require__(2250);

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 575:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toLength = __webpack_require__(3121);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 581:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(3930);
var isCallable = __webpack_require__(2250);
var isObject = __webpack_require__(6285);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 726:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(8311);
var uncurryThis = __webpack_require__(1907);
var IndexedObject = __webpack_require__(6946);
var toObject = __webpack_require__(9298);
var lengthOfArrayLike = __webpack_require__(575);
var arraySpeciesCreate = __webpack_require__(6968);

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE === 1;
  var IS_FILTER = TYPE === 2;
  var IS_SOME = TYPE === 3;
  var IS_EVERY = TYPE === 4;
  var IS_FIND_INDEX = TYPE === 6;
  var IS_FILTER_REJECT = TYPE === 7;
  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(self);
    var boundFunction = bind(callbackfn, that);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ }),

/***/ 798:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var userAgent = __webpack_require__(6794);

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 1042:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(5582);
var uncurryThis = __webpack_require__(1907);
var getOwnPropertyNamesModule = __webpack_require__(4443);
var getOwnPropertySymbolsModule = __webpack_require__(7170);
var anObject = __webpack_require__(6624);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 1086:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(2757);

module.exports = parent;


/***/ }),

/***/ 1091:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var apply = __webpack_require__(6024);
var uncurryThis = __webpack_require__(2361);
var isCallable = __webpack_require__(2250);
var getOwnPropertyDescriptor = (__webpack_require__(3846).f);
var isForced = __webpack_require__(7463);
var path = __webpack_require__(2046);
var bind = __webpack_require__(8311);
var createNonEnumerableProperty = __webpack_require__(1626);
var hasOwn = __webpack_require__(9724);
// add debugging info
__webpack_require__(6128);

var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof Wrapper) {
      switch (arguments.length) {
        case 0: return new NativeConstructor();
        case 1: return new NativeConstructor(a);
        case 2: return new NativeConstructor(a, b);
      } return new NativeConstructor(a, b, c);
    } return apply(NativeConstructor, this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;

  var nativeSource = GLOBAL ? globalThis : STATIC ? globalThis[TARGET] : globalThis[TARGET] && globalThis[TARGET].prototype;

  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
  var targetPrototype = target.prototype;

  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  for (key in source) {
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && hasOwn(nativeSource, key);

    targetProperty = target[key];

    if (USE_NATIVE) if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

    if (!FORCED && !PROTO && typeof targetProperty == typeof sourceProperty) continue;

    // bind methods to global for calling from export context
    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, globalThis);
    // wrap global constructors for prevent changes in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && isCallable(sourceProperty)) resultProperty = uncurryThis(sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }

    createNonEnumerableProperty(target, key, resultProperty);

    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!hasOwn(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      // export virtual prototype methods
      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
      // export real prototype methods
      if (options.real && targetPrototype && (FORCED || !targetPrototype[key])) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};


/***/ }),

/***/ 1113:
/***/ (function(module) {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 1127:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(5745);
var getBuiltInPrototypeMethod = __webpack_require__(1747);

module.exports = getBuiltInPrototypeMethod('Array', 'push');


/***/ }),

/***/ 1175:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(9846);

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 1176:
/***/ (function(module) {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 1182:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);
var defineBuiltIns = __webpack_require__(2802);
var getWeakData = (__webpack_require__(1548).getWeakData);
var anInstance = __webpack_require__(9596);
var anObject = __webpack_require__(6624);
var isNullOrUndefined = __webpack_require__(7136);
var isObject = __webpack_require__(6285);
var iterate = __webpack_require__(4823);
var ArrayIterationModule = __webpack_require__(726);
var hasOwn = __webpack_require__(9724);
var InternalStateModule = __webpack_require__(4932);

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;
var find = ArrayIterationModule.find;
var findIndex = ArrayIterationModule.findIndex;
var splice = uncurryThis([].splice);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (state) {
  return state.frozen || (state.frozen = new UncaughtFrozenStore());
};

var UncaughtFrozenStore = function () {
  this.entries = [];
};

var findUncaughtFrozen = function (store, key) {
  return find(store.entries, function (it) {
    return it[0] === key;
  });
};

UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.entries.push([key, value]);
  },
  'delete': function (key) {
    var index = findIndex(this.entries, function (it) {
      return it[0] === key;
    });
    if (~index) splice(this.entries, index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance(that, Prototype);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        id: id++,
        frozen: null
      });
      if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });

    var Prototype = Constructor.prototype;

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var data = getWeakData(anObject(key), true);
      if (data === true) uncaughtFrozenStore(state).set(key, value);
      else data[state.id] = value;
      return that;
    };

    defineBuiltIns(Prototype, {
      // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
      // https://tc39.es/ecma262/#sec-weakset.prototype.delete
      'delete': function (key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
        return data && hasOwn(data, state.id) && delete data[state.id];
      },
      // `{ WeakMap, WeakSet }.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-weakmap.prototype.has
      // https://tc39.es/ecma262/#sec-weakset.prototype.has
      has: function has(key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state).has(key);
        return data && hasOwn(data, state.id);
      }
    });

    defineBuiltIns(Prototype, IS_MAP ? {
      // `WeakMap.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-weakmap.prototype.get
      get: function get(key) {
        var state = getInternalState(this);
        if (isObject(key)) {
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).get(key);
          if (data) return data[state.id];
        }
      },
      // `WeakMap.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-weakmap.prototype.set
      set: function set(key, value) {
        return define(this, key, value);
      }
    } : {
      // `WeakSet.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-weakset.prototype.add
      add: function add(value) {
        return define(this, value, true);
      }
    });

    return Constructor;
  }
};


/***/ }),

/***/ 1263:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(6737);
var getBuiltInPrototypeMethod = __webpack_require__(1747);

module.exports = getBuiltInPrototypeMethod('Array', 'sort');


/***/ }),

/***/ 1354:
/***/ (function(module) {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ 1362:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(9748);
var getBuiltInPrototypeMethod = __webpack_require__(1747);

module.exports = getBuiltInPrototypeMethod('Array', 'includes');


/***/ }),

/***/ 1374:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(6535);

module.exports = parent;


/***/ }),

/***/ 1470:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);
var toIntegerOrInfinity = __webpack_require__(5482);
var toString = __webpack_require__(160);
var requireObjectCoercible = __webpack_require__(4239);

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ 1505:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(8828);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 1548:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var uncurryThis = __webpack_require__(1907);
var hiddenKeys = __webpack_require__(8530);
var isObject = __webpack_require__(6285);
var hasOwn = __webpack_require__(9724);
var defineProperty = (__webpack_require__(4284).f);
var getOwnPropertyNamesModule = __webpack_require__(4443);
var getOwnPropertyNamesExternalModule = __webpack_require__(5407);
var isExtensible = __webpack_require__(7005);
var uid = __webpack_require__(6499);
var FREEZING = __webpack_require__(5681);

var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + id++, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
  return it;
};

var enable = function () {
  meta.enable = function () { /* empty */ };
  REQUIRED = true;
  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
  var splice = uncurryThis([].splice);
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    getOwnPropertyNamesModule.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice(result, i, 1);
          break;
        }
      } return result;
    };

    $({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
    });
  }
};

var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;


/***/ }),

/***/ 1618:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(2560);
var classof = __webpack_require__(3948);
var hasOwn = __webpack_require__(9724);
var isPrototypeOf = __webpack_require__(8280);
var method = __webpack_require__(1374);

var ArrayPrototype = Array.prototype;

var DOMIterables = {
  DOMTokenList: true,
  NodeList: true
};

module.exports = function (it) {
  var own = it.keys;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.keys)
    || hasOwn(DOMIterables, classof(it)) ? method : own;
};


/***/ }),

/***/ 1626:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9447);
var definePropertyModule = __webpack_require__(4284);
var createPropertyDescriptor = __webpack_require__(5817);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 1669:
/***/ (function(module) {

"use strict";
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpi/P//PwMUNADxXyBuZsAPcoA4CIjfA/EuIJ4JFgUZBMU3/kNAMZIYNnz8PwIcgokzIdl0A0r3AHEbHhf9RGJ/hjGQDWJFYlcC8SQgZibgzf/YDEIHuUC8CIi58ahhJMYgEIgC4mVALIFNMzIgZBAI+AHxRiCWRfcOqQaBgBkQrwRiMSB+iE0BCwPxwBKIDwLxH0pcBAMPkKOcXIPmALEnED+lxKDJQJwKZUuQa1AVEOch8f+SE9hZQDydGCcjG/QPif0H6pUF+LIFriwCy1dvgTgChyEMaPmPBZuLVKA2RALxbjy+IGjQCiD+RcAQEFgF9fpHIN4GEwQIMACnXWgupdnzwwAAAABJRU5ErkJggg==";

/***/ }),

/***/ 1747:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var path = __webpack_require__(2046);

module.exports = function (CONSTRUCTOR, METHOD) {
  var Namespace = path[CONSTRUCTOR + 'Prototype'];
  var pureMethod = Namespace && Namespace[METHOD];
  if (pureMethod) return pureMethod;
  var NativeConstructor = globalThis[CONSTRUCTOR];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  return NativePrototype && NativePrototype[METHOD];
};


/***/ }),

/***/ 1759:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var NativePromiseConstructor = __webpack_require__(5463);
var isCallable = __webpack_require__(2250);
var isForced = __webpack_require__(7463);
var inspectSource = __webpack_require__(2647);
var wellKnownSymbol = __webpack_require__(6264);
var ENVIRONMENT = __webpack_require__(2832);
var IS_PURE = __webpack_require__(7376);
var V8_VERSION = __webpack_require__(798);

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var SPECIES = wellKnownSymbol('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT = isCallable(globalThis.PromiseRejectionEvent);

var FORCED_PROMISE_CONSTRUCTOR = isForced('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
  if (IS_PURE && !(NativePromisePrototype['catch'] && NativePromisePrototype['finally'])) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
    // Detect correctness of subclassing with @@species support
    var promise = new NativePromiseConstructor(function (resolve) { resolve(1); });
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  } return !GLOBAL_CORE_JS_PROMISE && (ENVIRONMENT === 'BROWSER' || ENVIRONMENT === 'DENO') && !NATIVE_PROMISE_REJECTION_EVENT;
});

module.exports = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
  SUBCLASSING: SUBCLASSING
};


/***/ }),

/***/ 1793:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(5807);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ 1829:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(6794);

// eslint-disable-next-line redos/no-vulnerable -- safe
module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);


/***/ }),

/***/ 1866:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var IS_PURE = __webpack_require__(7376);
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(1759).CONSTRUCTOR);
var NativePromiseConstructor = __webpack_require__(5463);
var getBuiltIn = __webpack_require__(5582);
var isCallable = __webpack_require__(2250);
var defineBuiltIn = __webpack_require__(8055);

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// `Promise.prototype.catch` method
// https://tc39.es/ecma262/#sec-promise.prototype.catch
$({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR, real: true }, {
  'catch': function (onRejected) {
    return this.then(undefined, onRejected);
  }
});

// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['catch'];
  if (NativePromisePrototype['catch'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'catch', method, { unsafe: true });
  }
}


/***/ }),

/***/ 1871:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);
var aCallable = __webpack_require__(2159);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 1907:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(1505);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 1921:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(4326);

module.exports = parent;


/***/ }),

/***/ 2046:
/***/ (function(module) {

"use strict";

module.exports = {};


/***/ }),

/***/ 2048:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var isPrototypeOf = __webpack_require__(8280);
var getPrototypeOf = __webpack_require__(5972);
var setPrototypeOf = __webpack_require__(9192);
var copyConstructorProperties = __webpack_require__(9595);
var create = __webpack_require__(8075);
var createNonEnumerableProperty = __webpack_require__(1626);
var createPropertyDescriptor = __webpack_require__(5817);
var installErrorCause = __webpack_require__(9259);
var installErrorStack = __webpack_require__(5884);
var iterate = __webpack_require__(4823);
var normalizeStringArgument = __webpack_require__(2096);
var wellKnownSymbol = __webpack_require__(6264);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Error = Error;
var push = [].push;

var $AggregateError = function AggregateError(errors, message /* , options */) {
  var isInstance = isPrototypeOf(AggregateErrorPrototype, this);
  var that;
  if (setPrototypeOf) {
    that = setPrototypeOf(new $Error(), isInstance ? getPrototypeOf(this) : AggregateErrorPrototype);
  } else {
    that = isInstance ? this : create(AggregateErrorPrototype);
    createNonEnumerableProperty(that, TO_STRING_TAG, 'Error');
  }
  if (message !== undefined) createNonEnumerableProperty(that, 'message', normalizeStringArgument(message));
  installErrorStack(that, $AggregateError, that.stack, 1);
  if (arguments.length > 2) installErrorCause(that, arguments[2]);
  var errorsArray = [];
  iterate(errors, push, { that: errorsArray });
  createNonEnumerableProperty(that, 'errors', errorsArray);
  return that;
};

if (setPrototypeOf) setPrototypeOf($AggregateError, $Error);
else copyConstructorProperties($AggregateError, $Error, { name: true });

var AggregateErrorPrototype = $AggregateError.prototype = create($Error.prototype, {
  constructor: createPropertyDescriptor(1, $AggregateError),
  message: createPropertyDescriptor(1, ''),
  name: createPropertyDescriptor(1, 'AggregateError')
});

// `AggregateError` constructor
// https://tc39.es/ecma262/#sec-aggregate-error-constructor
$({ global: true, constructor: true, arity: 2 }, {
  AggregateError: $AggregateError
});


/***/ }),

/***/ 2074:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isRegExp = __webpack_require__(2087);

var $TypeError = TypeError;

module.exports = function (it) {
  if (isRegExp(it)) {
    throw new $TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),

/***/ 2087:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(6285);
var classof = __webpack_require__(5807);
var wellKnownSymbol = __webpack_require__(6264);

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) === 'RegExp');
};


/***/ }),

/***/ 2096:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toString = __webpack_require__(160);

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ 2098:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var DESCRIPTORS = __webpack_require__(9447);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Avoid NodeJS experimental warning
module.exports = function (name) {
  if (!DESCRIPTORS) return globalThis[name];
  var descriptor = getOwnPropertyDescriptor(globalThis, name);
  return descriptor && descriptor.value;
};


/***/ }),

/***/ 2156:
/***/ (function(module) {

"use strict";

module.exports = function () { /* empty */ };


/***/ }),

/***/ 2159:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(2250);
var tryToString = __webpack_require__(4640);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 2193:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var $parseInt = __webpack_require__(2778);

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
$({ global: true, forced: parseInt !== $parseInt }, {
  parseInt: $parseInt
});


/***/ }),

/***/ 2220:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9447);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8661);
var definePropertyModule = __webpack_require__(4284);
var anObject = __webpack_require__(6624);
var toIndexedObject = __webpack_require__(7374);
var objectKeys = __webpack_require__(2875);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ 2235:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isConstructor = __webpack_require__(5468);
var tryToString = __webpack_require__(4640);

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a constructor');
};


/***/ }),

/***/ 2250:
/***/ (function(module) {

"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 2268:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(7961);

module.exports = parent;


/***/ }),

/***/ 2292:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var safeGetBuiltIn = __webpack_require__(2098);
var bind = __webpack_require__(8311);
var macrotask = (__webpack_require__(9472).set);
var Queue = __webpack_require__(9245);
var IS_IOS = __webpack_require__(1829);
var IS_IOS_PEBBLE = __webpack_require__(8606);
var IS_WEBOS_WEBKIT = __webpack_require__(9291);
var IS_NODE = __webpack_require__(7586);

var MutationObserver = globalThis.MutationObserver || globalThis.WebKitMutationObserver;
var document = globalThis.document;
var process = globalThis.process;
var Promise = globalThis.Promise;
var microtask = safeGetBuiltIn('queueMicrotask');
var notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!microtask) {
  var queue = new Queue();

  var flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (fn = queue.get()) try {
      fn();
    } catch (error) {
      if (queue.head) notify();
      throw error;
    }
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise;
    then = bind(promise.then, promise);
    notify = function () {
      then(flush);
    };
  // Node.js without promises
  } else if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessage
  // - onreadystatechange
  // - setTimeout
  } else {
    // `webpack` dev server bug on IE global methods - use bind(fn, global)
    macrotask = bind(macrotask, globalThis);
    notify = function () {
      macrotask(flush);
    };
  }

  microtask = function (fn) {
    if (!queue.head) notify();
    queue.add(fn);
  };
}

module.exports = microtask;


/***/ }),

/***/ 2361:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classofRaw = __webpack_require__(5807);
var uncurryThis = __webpack_require__(1907);

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ 2395:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var uncurryThis = __webpack_require__(2361);
var getOwnPropertyDescriptor = (__webpack_require__(3846).f);
var toLength = __webpack_require__(3121);
var toString = __webpack_require__(160);
var notARegExp = __webpack_require__(2074);
var requireObjectCoercible = __webpack_require__(4239);
var correctIsRegExpLogic = __webpack_require__(5735);
var IS_PURE = __webpack_require__(7376);

var stringSlice = uncurryThis(''.slice);
var min = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.startsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.startswith
$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = toString(requireObjectCoercible(this));
    notARegExp(searchString);
    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = toString(searchString);
    return stringSlice(that, index, index + search.length) === search;
  }
});


/***/ }),

/***/ 2416:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(5582);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 2522:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var shared = __webpack_require__(5816);
var uid = __webpack_require__(6499);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 2532:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};


/***/ }),

/***/ 2560:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(9363);
var DOMIterables = __webpack_require__(9287);
var globalThis = __webpack_require__(5951);
var setToStringTag = __webpack_require__(4840);
var Iterators = __webpack_require__(3742);

for (var COLLECTION_NAME in DOMIterables) {
  setToStringTag(globalThis[COLLECTION_NAME], COLLECTION_NAME);
  Iterators[COLLECTION_NAME] = Iterators.Array;
}


/***/ }),

/***/ 2574:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 2623:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(6264);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 2647:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);
var isCallable = __webpack_require__(2250);
var store = __webpack_require__(6128);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 2736:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var call = __webpack_require__(3930);
var aCallable = __webpack_require__(2159);
var newPromiseCapabilityModule = __webpack_require__(6254);
var perform = __webpack_require__(4420);
var iterate = __webpack_require__(4823);
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(3282);

// `Promise.race` method
// https://tc39.es/ecma262/#sec-promise.race
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      iterate(iterable, function (promise) {
        call($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ 2757:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(8280);
var method = __webpack_require__(1263);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.sort;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.sort) ? method : own;
};


/***/ }),

/***/ 2778:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var fails = __webpack_require__(8828);
var uncurryThis = __webpack_require__(1907);
var toString = __webpack_require__(160);
var trim = (__webpack_require__(5993).trim);
var whitespaces = __webpack_require__(6395);

var $parseInt = globalThis.parseInt;
var Symbol = globalThis.Symbol;
var ITERATOR = Symbol && Symbol.iterator;
var hex = /^[+-]?0x/i;
var exec = uncurryThis(hex.exec);
var FORCED = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22
  // MS Edge 18- broken with boxed symbols
  || (ITERATOR && !fails(function () { $parseInt(Object(ITERATOR)); }));

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
module.exports = FORCED ? function parseInt(string, radix) {
  var S = trim(toString(string));
  return $parseInt(S, (radix >>> 0) || (exec(hex, S) ? 16 : 10));
} : $parseInt;


/***/ }),

/***/ 2802:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var defineBuiltIn = __webpack_require__(8055);

module.exports = function (target, src, options) {
  for (var key in src) {
    if (options && options.unsafe && target[key]) target[key] = src[key];
    else defineBuiltIn(target, key, src[key], options);
  } return target;
};


/***/ }),

/***/ 2832:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* global Bun, Deno -- detection */
var globalThis = __webpack_require__(5951);
var userAgent = __webpack_require__(6794);
var classof = __webpack_require__(5807);

var userAgentStartsWith = function (string) {
  return userAgent.slice(0, string.length) === string;
};

module.exports = (function () {
  if (userAgentStartsWith('Bun/')) return 'BUN';
  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
  if (userAgentStartsWith('Deno/')) return 'DENO';
  if (userAgentStartsWith('Node.js/')) return 'NODE';
  if (globalThis.Bun && typeof Bun.version == 'string') return 'BUN';
  if (globalThis.Deno && typeof Deno.version == 'object') return 'DENO';
  if (classof(globalThis.process) === 'process') return 'NODE';
  if (globalThis.window && globalThis.document) return 'BROWSER';
  return 'REST';
})();


/***/ }),

/***/ 2875:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var internalObjectKeys = __webpack_require__(3045);
var enumBugKeys = __webpack_require__(376);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 3045:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);
var hasOwn = __webpack_require__(9724);
var toIndexedObject = __webpack_require__(7374);
var indexOf = (__webpack_require__(4436).indexOf);
var hiddenKeys = __webpack_require__(8530);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 3121:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(5482);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 3130:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9447);
var isArray = __webpack_require__(1793);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw new $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ 3266:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(8685);

module.exports = parent;


/***/ }),

/***/ 3282:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NativePromiseConstructor = __webpack_require__(5463);
var checkCorrectnessOfIteration = __webpack_require__(473);
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(1759).CONSTRUCTOR);

module.exports = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
  NativePromiseConstructor.all(iterable).then(undefined, function () { /* empty */ });
});


/***/ }),

/***/ 3427:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);

module.exports = uncurryThis([].slice);


/***/ }),

/***/ 3440:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(6794);

var firefox = userAgent.match(/firefox\/(\d+)/i);

module.exports = !!firefox && +firefox[1];


/***/ }),

/***/ 3448:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(3948);
var getMethod = __webpack_require__(9367);
var isNullOrUndefined = __webpack_require__(7136);
var Iterators = __webpack_require__(3742);
var wellKnownSymbol = __webpack_require__(6264);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),

/***/ 3569:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(6624);
var isObject = __webpack_require__(6285);
var newPromiseCapability = __webpack_require__(6254);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ 3643:
/***/ (function() {

// empty


/***/ }),

/***/ 3648:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9447);
var fails = __webpack_require__(8828);
var createElement = __webpack_require__(9552);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ 3742:
/***/ (function(module) {

"use strict";

module.exports = {};


/***/ }),

/***/ 3786:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(6794);

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

module.exports = !!webkit && +webkit[1];


/***/ }),

/***/ 3825:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var IS_PURE = __webpack_require__(7376);
var IS_NODE = __webpack_require__(7586);
var globalThis = __webpack_require__(5951);
var path = __webpack_require__(2046);
var call = __webpack_require__(3930);
var defineBuiltIn = __webpack_require__(8055);
var setPrototypeOf = __webpack_require__(9192);
var setToStringTag = __webpack_require__(4840);
var setSpecies = __webpack_require__(7118);
var aCallable = __webpack_require__(2159);
var isCallable = __webpack_require__(2250);
var isObject = __webpack_require__(6285);
var anInstance = __webpack_require__(9596);
var speciesConstructor = __webpack_require__(8450);
var task = (__webpack_require__(9472).set);
var microtask = __webpack_require__(2292);
var hostReportErrors = __webpack_require__(3904);
var perform = __webpack_require__(4420);
var Queue = __webpack_require__(9245);
var InternalStateModule = __webpack_require__(4932);
var NativePromiseConstructor = __webpack_require__(5463);
var PromiseConstructorDetection = __webpack_require__(1759);
var newPromiseCapabilityModule = __webpack_require__(6254);

var PROMISE = 'Promise';
var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var setInternalState = InternalStateModule.set;
var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var PromiseConstructor = NativePromiseConstructor;
var PromisePrototype = NativePromisePrototype;
var TypeError = globalThis.TypeError;
var document = globalThis.document;
var process = globalThis.process;
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;

var DISPATCH_EVENT = !!(document && document.createEvent && globalThis.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;

var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && isCallable(then = it.then) ? then : false;
};

var callReaction = function (reaction, state) {
  var value = state.value;
  var ok = state.state === FULFILLED;
  var handler = ok ? reaction.ok : reaction.fail;
  var resolve = reaction.resolve;
  var reject = reaction.reject;
  var domain = reaction.domain;
  var result, then, exited;
  try {
    if (handler) {
      if (!ok) {
        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
        state.rejection = HANDLED;
      }
      if (handler === true) result = value;
      else {
        if (domain) domain.enter();
        result = handler(value); // can throw
        if (domain) {
          domain.exit();
          exited = true;
        }
      }
      if (result === reaction.promise) {
        reject(new TypeError('Promise-chain cycle'));
      } else if (then = isThenable(result)) {
        call(then, result, resolve, reject);
      } else resolve(result);
    } else reject(value);
  } catch (error) {
    if (domain && !exited) domain.exit();
    reject(error);
  }
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  microtask(function () {
    var reactions = state.reactions;
    var reaction;
    while (reaction = reactions.get()) {
      callReaction(reaction, state);
    }
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    globalThis.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = globalThis['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  call(task, globalThis, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  call(task, globalThis, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw new TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          call(then, value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED_PROMISE_CONSTRUCTOR) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromisePrototype);
    aCallable(executor);
    call(Internal, this);
    var state = getInternalPromiseState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };

  PromisePrototype = PromiseConstructor.prototype;

  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: new Queue(),
      rejection: false,
      state: PENDING,
      value: null
    });
  };

  // `Promise.prototype.then` method
  // https://tc39.es/ecma262/#sec-promise.prototype.then
  Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
    var state = getInternalPromiseState(this);
    var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
    state.parent = true;
    reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
    reaction.fail = isCallable(onRejected) && onRejected;
    reaction.domain = IS_NODE ? process.domain : undefined;
    if (state.state === PENDING) state.reactions.add(reaction);
    else microtask(function () {
      callReaction(reaction, state);
    });
    return reaction.promise;
  });

  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalPromiseState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };

  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && isCallable(NativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;

    if (!NATIVE_PROMISE_SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      defineBuiltIn(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          call(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf) {
      setPrototypeOf(NativePromisePrototype, PromisePrototype);
    }
  }
}

// `Promise` constructor
// https://tc39.es/ecma262/#sec-promise-executor
$({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  Promise: PromiseConstructor
});

PromiseWrapper = path.Promise;

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);


/***/ }),

/***/ 3846:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9447);
var call = __webpack_require__(3930);
var propertyIsEnumerableModule = __webpack_require__(2574);
var createPropertyDescriptor = __webpack_require__(5817);
var toIndexedObject = __webpack_require__(7374);
var toPropertyKey = __webpack_require__(470);
var hasOwn = __webpack_require__(9724);
var IE8_DOM_DEFINE = __webpack_require__(3648);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 3888:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(8828);
var createPropertyDescriptor = __webpack_require__(5817);

module.exports = !fails(function () {
  var error = new Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


/***/ }),

/***/ 3904:
/***/ (function(module) {

"use strict";

module.exports = function (a, b) {
  try {
    // eslint-disable-next-line no-console -- safe
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 3930:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(1505);

var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 3948:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(2623);
var isCallable = __webpack_require__(2250);
var classofRaw = __webpack_require__(5807);
var wellKnownSymbol = __webpack_require__(6264);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ 4010:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isArray = __webpack_require__(1793);
var isConstructor = __webpack_require__(5468);
var isObject = __webpack_require__(6285);
var wellKnownSymbol = __webpack_require__(6264);

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};


/***/ }),

/***/ 4018:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(6285);

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ 4239:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isNullOrUndefined = __webpack_require__(7136);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 4284:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9447);
var IE8_DOM_DEFINE = __webpack_require__(3648);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8661);
var anObject = __webpack_require__(6624);
var toPropertyKey = __webpack_require__(470);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 4321:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arraySlice = __webpack_require__(3427);

var floor = Math.floor;

var sort = function (array, comparefn) {
  var length = array.length;

  if (length < 8) {
    // insertion sort
    var i = 1;
    var element, j;

    while (i < length) {
      j = i;
      element = array[i];
      while (j && comparefn(array[j - 1], element) > 0) {
        array[j] = array[--j];
      }
      if (j !== i++) array[j] = element;
    }
  } else {
    // merge sort
    var middle = floor(length / 2);
    var left = sort(arraySlice(array, 0, middle), comparefn);
    var right = sort(arraySlice(array, middle), comparefn);
    var llength = left.length;
    var rlength = right.length;
    var lindex = 0;
    var rindex = 0;

    while (lindex < llength || rindex < rlength) {
      array[lindex + rindex] = (lindex < llength && rindex < rlength)
        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
        : lindex < llength ? left[lindex++] : right[rindex++];
    }
  }

  return array;
};

module.exports = sort;


/***/ }),

/***/ 4326:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(2193);
var path = __webpack_require__(2046);

module.exports = path.parseInt;


/***/ }),

/***/ 4328:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var UA = __webpack_require__(6794);

module.exports = /MSIE|Trident/.test(UA);


/***/ }),

/***/ 4378:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(9770);
var getBuiltInPrototypeMethod = __webpack_require__(1747);

module.exports = getBuiltInPrototypeMethod('String', 'includes');


/***/ }),

/***/ 4417:
/***/ (function(module) {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ 4420:
/***/ (function(module) {

"use strict";

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ 4436:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(7374);
var toAbsoluteIndex = __webpack_require__(4849);
var lengthOfArrayLike = __webpack_require__(575);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 4443:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var internalObjectKeys = __webpack_require__(3045);
var enumBugKeys = __webpack_require__(376);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 4491:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(2395);
var getBuiltInPrototypeMethod = __webpack_require__(1747);

module.exports = getBuiltInPrototypeMethod('String', 'startsWith');


/***/ }),

/***/ 4502:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(2048);


/***/ }),

/***/ 4535:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var tryToString = __webpack_require__(4640);

var $TypeError = TypeError;

module.exports = function (O, P) {
  if (!delete O[P]) throw new $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
};


/***/ }),

/***/ 4640:
/***/ (function(module) {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 4787:
/***/ (function(module) {

"use strict";

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw new $TypeError('Not enough arguments');
  return passed;
};


/***/ }),

/***/ 4823:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(8311);
var call = __webpack_require__(3930);
var anObject = __webpack_require__(6624);
var tryToString = __webpack_require__(4640);
var isArrayIteratorMethod = __webpack_require__(7812);
var lengthOfArrayLike = __webpack_require__(575);
var isPrototypeOf = __webpack_require__(8280);
var getIterator = __webpack_require__(300);
var getIteratorMethod = __webpack_require__(3448);
var iteratorClose = __webpack_require__(154);

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal');
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};


/***/ }),

/***/ 4840:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(2623);
var defineProperty = (__webpack_require__(4284).f);
var createNonEnumerableProperty = __webpack_require__(1626);
var hasOwn = __webpack_require__(9724);
var toString = __webpack_require__(4878);
var wellKnownSymbol = __webpack_require__(6264);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC, SET_METHOD) {
  var target = STATIC ? it : it && it.prototype;
  if (target) {
    if (!hasOwn(target, TO_STRING_TAG)) {
      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
    }
    if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
      createNonEnumerableProperty(target, 'toString', toString);
    }
  }
};


/***/ }),

/***/ 4849:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(5482);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 4878:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(2623);
var classof = __webpack_require__(3948);

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ 4932:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(551);
var globalThis = __webpack_require__(5951);
var isObject = __webpack_require__(6285);
var createNonEnumerableProperty = __webpack_require__(1626);
var hasOwn = __webpack_require__(9724);
var shared = __webpack_require__(6128);
var sharedKey = __webpack_require__(2522);
var hiddenKeys = __webpack_require__(8530);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 5043:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(2159);
var toObject = __webpack_require__(9298);
var IndexedObject = __webpack_require__(6946);
var lengthOfArrayLike = __webpack_require__(575);

var $TypeError = TypeError;

var REDUCE_EMPTY = 'Reduce of empty array with no initial value';

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(O);
    aCallable(callbackfn);
    if (length === 0 && argumentsLength < 2) throw new $TypeError(REDUCE_EMPTY);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw new $TypeError(REDUCE_EMPTY);
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),

/***/ 5056:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 5072:
/***/ (function(module) {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 5116:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(8828);
var isCallable = __webpack_require__(2250);
var isObject = __webpack_require__(6285);
var create = __webpack_require__(8075);
var getPrototypeOf = __webpack_require__(5972);
var defineBuiltIn = __webpack_require__(8055);
var wellKnownSymbol = __webpack_require__(6264);
var IS_PURE = __webpack_require__(7376);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ 5204:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(7027);
__webpack_require__(2560);

module.exports = parent;


/***/ }),

/***/ 5407:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-object-getownpropertynames -- safe */
var classof = __webpack_require__(5807);
var toIndexedObject = __webpack_require__(7374);
var $getOwnPropertyNames = (__webpack_require__(4443).f);
var arraySlice = __webpack_require__(3427);

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && classof(it) === 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};


/***/ }),

/***/ 5463:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);

module.exports = globalThis.Promise;


/***/ }),

/***/ 5468:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);
var fails = __webpack_require__(8828);
var isCallable = __webpack_require__(2250);
var classof = __webpack_require__(3948);
var getBuiltIn = __webpack_require__(5582);
var inspectSource = __webpack_require__(2647);

var noop = function () { /* empty */ };
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, [], argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ 5482:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var trunc = __webpack_require__(1176);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 5582:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var path = __webpack_require__(2046);
var globalThis = __webpack_require__(5951);
var isCallable = __webpack_require__(2250);

var aFunction = function (variable) {
  return isCallable(variable) ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(globalThis[namespace])
    : path[namespace] && path[namespace][method] || globalThis[namespace] && globalThis[namespace][method];
};


/***/ }),

/***/ 5594:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(5582);
var isCallable = __webpack_require__(2250);
var isPrototypeOf = __webpack_require__(8280);
var USE_SYMBOL_AS_UID = __webpack_require__(1175);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 5681:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(8828);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});


/***/ }),

/***/ 5735:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(6264);

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};


/***/ }),

/***/ 5745:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var toObject = __webpack_require__(9298);
var lengthOfArrayLike = __webpack_require__(575);
var setArrayLength = __webpack_require__(3130);
var doesNotExceedSafeInteger = __webpack_require__(8024);
var fails = __webpack_require__(8828);

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 <= 121 and Safari <= 15.4; FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ }),

/***/ 5762:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String(new $Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable, sonarjs/slow-regex -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ 5807:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 5816:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var store = __webpack_require__(6128);

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


/***/ }),

/***/ 5817:
/***/ (function(module) {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 5823:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var newPromiseCapabilityModule = __webpack_require__(6254);

// `Promise.withResolvers` method
// https://tc39.es/ecma262/#sec-promise.withResolvers
$({ target: 'Promise', stat: true }, {
  withResolvers: function withResolvers() {
    var promiseCapability = newPromiseCapabilityModule.f(this);
    return {
      promise: promiseCapability.promise,
      resolve: promiseCapability.resolve,
      reject: promiseCapability.reject
    };
  }
});


/***/ }),

/***/ 5884:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var createNonEnumerableProperty = __webpack_require__(1626);
var clearErrorStack = __webpack_require__(5762);
var ERROR_STACK_INSTALLABLE = __webpack_require__(3888);

// non-standard V8
// eslint-disable-next-line es/no-nonstandard-error-properties -- safe
var captureStackTrace = Error.captureStackTrace;

module.exports = function (error, C, stack, dropEntries) {
  if (ERROR_STACK_INSTALLABLE) {
    if (captureStackTrace) captureStackTrace(error, C);
    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  }
};


/***/ }),

/***/ 5931:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(3825);
__webpack_require__(6630);
__webpack_require__(1866);
__webpack_require__(2736);
__webpack_require__(7286);
__webpack_require__(6761);


/***/ }),

/***/ 5951:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 5972:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__(9724);
var isCallable = __webpack_require__(2250);
var toObject = __webpack_require__(9298);
var sharedKey = __webpack_require__(2522);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(7382);

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ 5993:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);
var requireObjectCoercible = __webpack_require__(4239);
var toString = __webpack_require__(160);
var whitespaces = __webpack_require__(6395);

var replace = uncurryThis(''.replace);
var ltrim = RegExp('^[' + whitespaces + ']+');
var rtrim = RegExp('(^|[^' + whitespaces + '])[' + whitespaces + ']+$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = toString(requireObjectCoercible($this));
    if (TYPE & 1) string = replace(string, ltrim, '');
    if (TYPE & 2) string = replace(string, rtrim, '$1');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};


/***/ }),

/***/ 6024:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(1505);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ 6028:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(3930);
var isObject = __webpack_require__(6285);
var isSymbol = __webpack_require__(5594);
var getMethod = __webpack_require__(9367);
var ordinaryToPrimitive = __webpack_require__(581);
var wellKnownSymbol = __webpack_require__(6264);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 6063:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4417);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(1669), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(9824), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n\n/* shared CSS with Radiant Media Player */\n.rmp-container {\n  position: relative;\n  text-align: center;\n  outline: none;\n  background: #000;\n  padding: 0;\n  border: none;\n  display: block;\n  font-size: 14px;\n  max-width: none;\n  max-height: none;\n  overflow: hidden;\n  line-height: 1;\n  box-sizing: border-box;\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n.rmp-container * {\n  box-sizing: border-box;\n}\n\n.rmp-video,\n.rmp-content {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 0;\n  padding: 0;\n  outline: none;\n  display: block;\n}\n\n.rmp-ad-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  outline: none;\n  display: block;\n  text-align: initial;\n}\n\n.rmp-fullscreen-on {\n  position: fixed !important;\n  width: 100% !important;\n  height: 100% !important;\n  background: #000 !important;\n  overflow: hidden !important;\n  z-index: 9999 !important;\n  top: 0;\n  left: 0;\n}\n\n/* specific CSS to rmp-vast */\n.rmp-vpaid-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  outline: none;\n  display: block;\n  text-align: initial;\n}\n\n.rmp-ad-vast-video-player {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 0;\n  padding: 0;\n  outline: none;\n  display: block;\n  cursor: pointer;\n}\n\n.rmp-ad-container-icons {\n  position: absolute;\n  display: block;\n  cursor: pointer;\n}\n\n.rmp-ad-container-skip {\n  position: absolute;\n  right: 0;\n  bottom: 44px;\n  width: 160px;\n  height: 40px;\n  line-height: 38px;\n  text-align: center;\n  cursor: pointer;\n  background-color: #333;\n  border: 1px solid #333;\n  transition-property: border-color;\n  transition-duration: 0.4s;\n  transition-timing-function: ease-in;\n}\n\n.rmp-ad-container-skip:hover {\n  border-color: #000;\n}\n\n.rmp-ad-container-skip-waiting {\n  width: 100%;\n  position: absolute;\n  padding: 0 2px;\n  color: #cfcfcf;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.rmp-ad-container-skip-message {\n  width: 65%;\n  position: absolute;\n  left: 5%;\n  color: #FFF;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.rmp-ad-container-skip-icon {\n  position: absolute;\n  left: 75%;\n  width: 20%;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  height: 100%;\n  background-repeat: no-repeat;\n  background-position: center;\n  opacity: 0.7;\n  transition-property: opacity;\n  transition-duration: 0.4s;\n  transition-timing-function: ease-in;\n}\n\n.rmp-ad-container-skip:hover .rmp-ad-container-skip-icon {\n  opacity: 1;\n}\n\n.rmp-ad-non-linear-container {\n  position: absolute;\n  text-align: center;\n  left: 50%;\n  bottom: 0;\n  transform: translate(-50%, 0);\n}\n\n.rmp-ad-non-linear-anchor:link,\n.rmp-ad-non-linear-anchor:visited,\n.rmp-ad-non-linear-anchor:hover,\n.rmp-ad-non-linear-anchor:active {\n  text-decoration: none;\n}\n\n.rmp-ad-non-linear-creative {\n  position: relative;\n  cursor: pointer;\n  text-align: center;\n  width: 100%;\n  height: 100%;\n  bottom: 0;\n}\n\n.rmp-ad-non-linear-close { \n  right: 0;\n  top: 0;\n  position: absolute;\n  cursor: pointer;\n  width: 20px;\n  height: 20px;\n  background-color: #000;\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n  background-size: cover;\n  border: 4px solid #000;\n}\n\n.rmp-ad-click-ui-mobile {\n  border: 2px solid #fff;\n  background: rgba(0, 0, 0, 0.4);\n  color: #fff;\n  display: block;\n  position: absolute;\n  right: 8px;\n  top: 8px;\n  font-size: 18px;\n  width: 112px;\n  height: 34px;\n  text-decoration: none;\n  text-align: center;\n  line-height: 30px;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);\n}\n\n.rmp-ad-click-ui-mobile:visited,\n.rmp-ad-click-ui-mobile:hover,\n.rmp-ad-click-ui-mobile:active {\n  color: #fff;\n  text-decoration: none;\n}\n\n.rmp-linear-simid-creative {\n  position: absolute;\n  top: 0;\n  border-width: 0;\n  width: 100%;\n  height: 100%;\n}\n", "",{"version":3,"sources":["webpack://./src/css/rmp-vast.css"],"names":[],"mappings":"AAAA,gBAAgB;;AAEhB,yCAAyC;AACzC;EACE,kBAAkB;EAClB,kBAAkB;EAClB,aAAa;EACb,gBAAgB;EAChB,UAAU;EACV,YAAY;EACZ,cAAc;EACd,eAAe;EACf,eAAe;EACf,gBAAgB;EAChB,gBAAgB;EAChB,cAAc;EACd,sBAAsB;EACtB,yCAAyC;AAC3C;;AAEA;EACE,sBAAsB;AACxB;;AAEA;;EAEE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,SAAS;EACT,UAAU;EACV,aAAa;EACb,cAAc;AAChB;;AAEA;EACE,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,SAAS;EACT,UAAU;EACV,WAAW;EACX,YAAY;EACZ,aAAa;EACb,cAAc;EACd,mBAAmB;AACrB;;AAEA;EACE,0BAA0B;EAC1B,sBAAsB;EACtB,uBAAuB;EACvB,2BAA2B;EAC3B,2BAA2B;EAC3B,wBAAwB;EACxB,MAAM;EACN,OAAO;AACT;;AAEA,6BAA6B;AAC7B;EACE,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,SAAS;EACT,UAAU;EACV,WAAW;EACX,YAAY;EACZ,aAAa;EACb,cAAc;EACd,mBAAmB;AACrB;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,SAAS;EACT,UAAU;EACV,aAAa;EACb,cAAc;EACd,eAAe;AACjB;;AAEA;EACE,kBAAkB;EAClB,cAAc;EACd,eAAe;AACjB;;AAEA;EACE,kBAAkB;EAClB,QAAQ;EACR,YAAY;EACZ,YAAY;EACZ,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,eAAe;EACf,sBAAsB;EACtB,sBAAsB;EACtB,iCAAiC;EACjC,yBAAyB;EACzB,mCAAmC;AACrC;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,cAAc;EACd,cAAc;EACd,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;AACzB;;AAEA;EACE,UAAU;EACV,kBAAkB;EAClB,QAAQ;EACR,WAAW;EACX,mBAAmB;EACnB,gBAAgB;EAChB,uBAAuB;AACzB;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,UAAU;EACV,yDAAugB;EACvgB,YAAY;EACZ,4BAA4B;EAC5B,2BAA2B;EAC3B,YAAY;EACZ,4BAA4B;EAC5B,yBAAyB;EACzB,mCAAmC;AACrC;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,kBAAkB;EAClB,kBAAkB;EAClB,SAAS;EACT,SAAS;EACT,6BAA6B;AAC/B;;AAEA;;;;EAIE,qBAAqB;AACvB;;AAEA;EACE,kBAAkB;EAClB,eAAe;EACf,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,SAAS;AACX;;AAEA;EACE,QAAQ;EACR,MAAM;EACN,kBAAkB;EAClB,eAAe;EACf,WAAW;EACX,YAAY;EACZ,sBAAsB;EACtB,yDAA2U;EAC3U,sBAAsB;EACtB,sBAAsB;AACxB;;AAEA;EACE,sBAAsB;EACtB,8BAA8B;EAC9B,WAAW;EACX,cAAc;EACd,kBAAkB;EAClB,UAAU;EACV,QAAQ;EACR,eAAe;EACf,YAAY;EACZ,YAAY;EACZ,qBAAqB;EACrB,kBAAkB;EAClB,iBAAiB;EACjB,sCAAsC;AACxC;;AAEA;;;EAGE,WAAW;EACX,qBAAqB;AACvB;;AAEA;EACE,kBAAkB;EAClB,MAAM;EACN,eAAe;EACf,WAAW;EACX,YAAY;AACd","sourcesContent":["@charset \"UTF-8\";\n\n/* shared CSS with Radiant Media Player */\n.rmp-container {\n  position: relative;\n  text-align: center;\n  outline: none;\n  background: #000;\n  padding: 0;\n  border: none;\n  display: block;\n  font-size: 14px;\n  max-width: none;\n  max-height: none;\n  overflow: hidden;\n  line-height: 1;\n  box-sizing: border-box;\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n.rmp-container * {\n  box-sizing: border-box;\n}\n\n.rmp-video,\n.rmp-content {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 0;\n  padding: 0;\n  outline: none;\n  display: block;\n}\n\n.rmp-ad-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  outline: none;\n  display: block;\n  text-align: initial;\n}\n\n.rmp-fullscreen-on {\n  position: fixed !important;\n  width: 100% !important;\n  height: 100% !important;\n  background: #000 !important;\n  overflow: hidden !important;\n  z-index: 9999 !important;\n  top: 0;\n  left: 0;\n}\n\n/* specific CSS to rmp-vast */\n.rmp-vpaid-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  outline: none;\n  display: block;\n  text-align: initial;\n}\n\n.rmp-ad-vast-video-player {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 0;\n  padding: 0;\n  outline: none;\n  display: block;\n  cursor: pointer;\n}\n\n.rmp-ad-container-icons {\n  position: absolute;\n  display: block;\n  cursor: pointer;\n}\n\n.rmp-ad-container-skip {\n  position: absolute;\n  right: 0;\n  bottom: 44px;\n  width: 160px;\n  height: 40px;\n  line-height: 38px;\n  text-align: center;\n  cursor: pointer;\n  background-color: #333;\n  border: 1px solid #333;\n  transition-property: border-color;\n  transition-duration: 0.4s;\n  transition-timing-function: ease-in;\n}\n\n.rmp-ad-container-skip:hover {\n  border-color: #000;\n}\n\n.rmp-ad-container-skip-waiting {\n  width: 100%;\n  position: absolute;\n  padding: 0 2px;\n  color: #cfcfcf;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.rmp-ad-container-skip-message {\n  width: 65%;\n  position: absolute;\n  left: 5%;\n  color: #FFF;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.rmp-ad-container-skip-icon {\n  position: absolute;\n  left: 75%;\n  width: 20%;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpi/P//PwMUNADxXyBuZsAPcoA4CIjfA/EuIJ4JFgUZBMU3/kNAMZIYNnz8PwIcgokzIdl0A0r3AHEbHhf9RGJ/hjGQDWJFYlcC8SQgZibgzf/YDEIHuUC8CIi58ahhJMYgEIgC4mVALIFNMzIgZBAI+AHxRiCWRfcOqQaBgBkQrwRiMSB+iE0BCwPxwBKIDwLxH0pcBAMPkKOcXIPmALEnED+lxKDJQJwKZUuQa1AVEOch8f+SE9hZQDydGCcjG/QPif0H6pUF+LIFriwCy1dvgTgChyEMaPmPBZuLVKA2RALxbjy+IGjQCiD+RcAQEFgF9fpHIN4GEwQIMACnXWgupdnzwwAAAABJRU5ErkJggg==\");\n  height: 100%;\n  background-repeat: no-repeat;\n  background-position: center;\n  opacity: 0.7;\n  transition-property: opacity;\n  transition-duration: 0.4s;\n  transition-timing-function: ease-in;\n}\n\n.rmp-ad-container-skip:hover .rmp-ad-container-skip-icon {\n  opacity: 1;\n}\n\n.rmp-ad-non-linear-container {\n  position: absolute;\n  text-align: center;\n  left: 50%;\n  bottom: 0;\n  transform: translate(-50%, 0);\n}\n\n.rmp-ad-non-linear-anchor:link,\n.rmp-ad-non-linear-anchor:visited,\n.rmp-ad-non-linear-anchor:hover,\n.rmp-ad-non-linear-anchor:active {\n  text-decoration: none;\n}\n\n.rmp-ad-non-linear-creative {\n  position: relative;\n  cursor: pointer;\n  text-align: center;\n  width: 100%;\n  height: 100%;\n  bottom: 0;\n}\n\n.rmp-ad-non-linear-close { \n  right: 0;\n  top: 0;\n  position: absolute;\n  cursor: pointer;\n  width: 20px;\n  height: 20px;\n  background-color: #000;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHdJREFUeNqUk9EKwCAIRaX9/9MgEAZ9amsPsWVXdxV8Ec+B1Ep/o40UMuuEpK/RMvAUnEZysfAIlYRkg5/6tyGSQNgKPIkLIwGSuLAn8CSKeovgOMiaMKtKPQENjB5i1Pi7xkoMzD0kBg5PmYVnqv1MGXiT3AIMACNQPFnn5xfHAAAAAElFTkSuQmCC\");\n  background-size: cover;\n  border: 4px solid #000;\n}\n\n.rmp-ad-click-ui-mobile {\n  border: 2px solid #fff;\n  background: rgba(0, 0, 0, 0.4);\n  color: #fff;\n  display: block;\n  position: absolute;\n  right: 8px;\n  top: 8px;\n  font-size: 18px;\n  width: 112px;\n  height: 34px;\n  text-decoration: none;\n  text-align: center;\n  line-height: 30px;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);\n}\n\n.rmp-ad-click-ui-mobile:visited,\n.rmp-ad-click-ui-mobile:hover,\n.rmp-ad-click-ui-mobile:active {\n  color: #fff;\n  text-decoration: none;\n}\n\n.rmp-linear-simid-creative {\n  position: absolute;\n  top: 0;\n  border-width: 0;\n  width: 100%;\n  height: 100%;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__.A = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 6128:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IS_PURE = __webpack_require__(7376);
var globalThis = __webpack_require__(5951);
var defineGlobalProperty = __webpack_require__(2532);

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.43.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.43.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 6254:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(2159);

var $TypeError = TypeError;

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw new $TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ 6264:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var shared = __webpack_require__(5816);
var hasOwn = __webpack_require__(9724);
var uid = __webpack_require__(6499);
var NATIVE_SYMBOL = __webpack_require__(9846);
var USE_SYMBOL_AS_UID = __webpack_require__(1175);

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 6285:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(2250);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 6314:
/***/ (function(module) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 6339:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var $reduce = (__webpack_require__(5043).left);
var arrayMethodIsStrict = __webpack_require__(7623);
var CHROME_VERSION = __webpack_require__(798);
var IS_NODE = __webpack_require__(7586);

// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
var FORCED = CHROME_BUG || !arrayMethodIsStrict('reduce');

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: FORCED }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 6343:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(6880);

module.exports = parent;


/***/ }),

/***/ 6375:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
var fails = __webpack_require__(8828);

module.exports = fails(function () {
  if (typeof ArrayBuffer == 'function') {
    var buffer = new ArrayBuffer(8);
    // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
  }
});


/***/ }),

/***/ 6395:
/***/ (function(module) {

"use strict";

// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ 6415:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var call = __webpack_require__(3930);
var aCallable = __webpack_require__(2159);
var getBuiltIn = __webpack_require__(5582);
var newPromiseCapabilityModule = __webpack_require__(6254);
var perform = __webpack_require__(4420);
var iterate = __webpack_require__(4823);
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(3282);

var PROMISE_ANY_ERROR = 'No one promise resolved';

// `Promise.any` method
// https://tc39.es/ecma262/#sec-promise.any
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  any: function any(iterable) {
    var C = this;
    var AggregateError = getBuiltIn('AggregateError');
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var errors = [];
      var counter = 0;
      var remaining = 1;
      var alreadyResolved = false;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyRejected = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyResolved = true;
          resolve(value);
        }, function (error) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyRejected = true;
          errors[index] = error;
          --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
        });
      });
      --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ 6462:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(9929);

module.exports = parent;


/***/ }),

/***/ 6499:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.1.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 6535:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(9363);
__webpack_require__(3643);
var getBuiltInPrototypeMethod = __webpack_require__(1747);

module.exports = getBuiltInPrototypeMethod('Array', 'keys');


/***/ }),

/***/ 6571:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(7249);


/***/ }),

/***/ 6624:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(6285);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 6630:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var call = __webpack_require__(3930);
var aCallable = __webpack_require__(2159);
var newPromiseCapabilityModule = __webpack_require__(6254);
var perform = __webpack_require__(4420);
var iterate = __webpack_require__(4823);
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(3282);

// `Promise.all` method
// https://tc39.es/ecma262/#sec-promise.all
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ 6693:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(6339);
var getBuiltInPrototypeMethod = __webpack_require__(1747);

module.exports = getBuiltInPrototypeMethod('Array', 'reduce');


/***/ }),

/***/ 6737:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var uncurryThis = __webpack_require__(1907);
var aCallable = __webpack_require__(2159);
var toObject = __webpack_require__(9298);
var lengthOfArrayLike = __webpack_require__(575);
var deletePropertyOrThrow = __webpack_require__(4535);
var toString = __webpack_require__(160);
var fails = __webpack_require__(8828);
var internalSort = __webpack_require__(4321);
var arrayMethodIsStrict = __webpack_require__(7623);
var FF = __webpack_require__(3440);
var IE_OR_EDGE = __webpack_require__(4328);
var V8 = __webpack_require__(798);
var WEBKIT = __webpack_require__(3786);

var test = [];
var nativeSort = uncurryThis(test.sort);
var push = uncurryThis(test.push);

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var STRICT_METHOD = arrayMethodIsStrict('sort');

var STABLE_SORT = !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 70;
  if (FF && FF > 3) return;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 603;

  var result = '';
  var code, chr, value, index;

  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
  for (code = 65; code < 76; code++) {
    chr = String.fromCharCode(code);

    switch (code) {
      case 66: case 69: case 70: case 72: value = 3; break;
      case 68: case 71: value = 4; break;
      default: value = 2;
    }

    for (index = 0; index < 47; index++) {
      test.push({ k: chr + index, v: value });
    }
  }

  test.sort(function (a, b) { return b.v - a.v; });

  for (index = 0; index < test.length; index++) {
    chr = test[index].k.charAt(0);
    if (result.charAt(result.length - 1) !== chr) result += chr;
  }

  return result !== 'DGBEFHACIJK';
});

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (y === undefined) return -1;
    if (x === undefined) return 1;
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    return toString(x) > toString(y) ? 1 : -1;
  };
};

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
$({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    if (comparefn !== undefined) aCallable(comparefn);

    var array = toObject(this);

    if (STABLE_SORT) return comparefn === undefined ? nativeSort(array) : nativeSort(array, comparefn);

    var items = [];
    var arrayLength = lengthOfArrayLike(array);
    var itemsLength, index;

    for (index = 0; index < arrayLength; index++) {
      if (index in array) push(items, array[index]);
    }

    internalSort(items, getSortCompare(comparefn));

    itemsLength = lengthOfArrayLike(items);
    index = 0;

    while (index < itemsLength) array[index] = items[index++];
    while (index < arrayLength) deletePropertyOrThrow(array, index++);

    return array;
  }
});


/***/ }),

/***/ 6761:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var getBuiltIn = __webpack_require__(5582);
var IS_PURE = __webpack_require__(7376);
var NativePromiseConstructor = __webpack_require__(5463);
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(1759).CONSTRUCTOR);
var promiseResolve = __webpack_require__(3569);

var PromiseConstructorWrapper = getBuiltIn('Promise');
var CHECK_WRAPPER = IS_PURE && !FORCED_PROMISE_CONSTRUCTOR;

// `Promise.resolve` method
// https://tc39.es/ecma262/#sec-promise.resolve
$({ target: 'Promise', stat: true, forced: IS_PURE || FORCED_PROMISE_CONSTRUCTOR }, {
  resolve: function resolve(x) {
    return promiseResolve(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor : this, x);
  }
});


/***/ }),

/***/ 6794:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';


/***/ }),

/***/ 6833:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9447);
var hasOwn = __webpack_require__(9724);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 6880:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(8280);
var arrayMethod = __webpack_require__(1362);
var stringMethod = __webpack_require__(4378);

var ArrayPrototype = Array.prototype;
var StringPrototype = String.prototype;

module.exports = function (it) {
  var own = it.includes;
  if (it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.includes)) return arrayMethod;
  if (typeof it == 'string' || it === StringPrototype || (isPrototypeOf(StringPrototype, it) && own === StringPrototype.includes)) {
    return stringMethod;
  } return own;
};


/***/ }),

/***/ 6946:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);
var fails = __webpack_require__(8828);
var classof = __webpack_require__(5807);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 6968:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arraySpeciesConstructor = __webpack_require__(4010);

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),

/***/ 7005:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(8828);
var isObject = __webpack_require__(6285);
var classof = __webpack_require__(5807);
var ARRAY_BUFFER_NON_EXTENSIBLE = __webpack_require__(6375);

// eslint-disable-next-line es/no-object-isextensible -- safe
var $isExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES = fails(function () { $isExtensible(1); });

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
module.exports = (FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
  if (!isObject(it)) return false;
  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) === 'ArrayBuffer') return false;
  return $isExtensible ? $isExtensible(it) : true;
} : $isExtensible;


/***/ }),

/***/ 7027:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(4502);
__webpack_require__(9363);
__webpack_require__(3643);
__webpack_require__(5931);
__webpack_require__(7450);
__webpack_require__(6415);
__webpack_require__(7380);
__webpack_require__(5823);
__webpack_require__(7714);
__webpack_require__(7057);
var path = __webpack_require__(2046);

module.exports = path.Promise;


/***/ }),

/***/ 7057:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = (__webpack_require__(1470).charAt);
var toString = __webpack_require__(160);
var InternalStateModule = __webpack_require__(4932);
var defineIterator = __webpack_require__(183);
var createIterResultObject = __webpack_require__(9550);

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return createIterResultObject(undefined, true);
  point = charAt(string, index);
  state.index += point.length;
  return createIterResultObject(point, false);
});


/***/ }),

/***/ 7081:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var globalThis = __webpack_require__(5951);
var InternalMetadataModule = __webpack_require__(1548);
var fails = __webpack_require__(8828);
var createNonEnumerableProperty = __webpack_require__(1626);
var iterate = __webpack_require__(4823);
var anInstance = __webpack_require__(9596);
var isCallable = __webpack_require__(2250);
var isObject = __webpack_require__(6285);
var isNullOrUndefined = __webpack_require__(7136);
var setToStringTag = __webpack_require__(4840);
var defineProperty = (__webpack_require__(4284).f);
var forEach = (__webpack_require__(726).forEach);
var DESCRIPTORS = __webpack_require__(9447);
var InternalStateModule = __webpack_require__(4932);

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = globalThis[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var exported = {};
  var Constructor;

  if (!DESCRIPTORS || !isCallable(NativeConstructor)
    || !(IS_WEAK || NativePrototype.forEach && !fails(function () { new NativeConstructor().entries().next(); }))
  ) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.enable();
  } else {
    Constructor = wrapper(function (target, iterable) {
      setInternalState(anInstance(target, Prototype), {
        type: CONSTRUCTOR_NAME,
        collection: new NativeConstructor()
      });
      if (!isNullOrUndefined(iterable)) iterate(iterable, target[ADDER], { that: target, AS_ENTRIES: IS_MAP });
    });

    var Prototype = Constructor.prototype;

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    forEach(['add', 'clear', 'delete', 'forEach', 'get', 'has', 'set', 'keys', 'values', 'entries'], function (KEY) {
      var IS_ADDER = KEY === 'add' || KEY === 'set';
      if (KEY in NativePrototype && !(IS_WEAK && KEY === 'clear')) {
        createNonEnumerableProperty(Prototype, KEY, function (a, b) {
          var collection = getInternalState(this).collection;
          if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY === 'get' ? undefined : false;
          var result = collection[KEY](a === 0 ? 0 : a, b);
          return IS_ADDER ? this : result;
        });
      }
    });

    IS_WEAK || defineProperty(Prototype, 'size', {
      configurable: true,
      get: function () {
        return getInternalState(this).collection.size;
      }
    });
  }

  setToStringTag(Constructor, CONSTRUCTOR_NAME, false, true);

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, forced: true }, exported);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};


/***/ }),

/***/ 7118:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(5582);
var defineBuiltInAccessor = __webpack_require__(9251);
var wellKnownSymbol = __webpack_require__(6264);
var DESCRIPTORS = __webpack_require__(9447);

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineBuiltInAccessor(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ 7136:
/***/ (function(module) {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 7170:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 7173:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(9363);
__webpack_require__(3643);
__webpack_require__(6571);
var path = __webpack_require__(2046);

module.exports = path.WeakMap;


/***/ }),

/***/ 7181:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IteratorPrototype = (__webpack_require__(5116).IteratorPrototype);
var create = __webpack_require__(8075);
var createPropertyDescriptor = __webpack_require__(5817);
var setToStringTag = __webpack_require__(4840);
var Iterators = __webpack_require__(3742);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ 7213:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var fails = __webpack_require__(8828);
var uncurryThis = __webpack_require__(1907);
var toString = __webpack_require__(160);
var trim = (__webpack_require__(5993).trim);
var whitespaces = __webpack_require__(6395);

var charAt = uncurryThis(''.charAt);
var $parseFloat = globalThis.parseFloat;
var Symbol = globalThis.Symbol;
var ITERATOR = Symbol && Symbol.iterator;
var FORCED = 1 / $parseFloat(whitespaces + '-0') !== -Infinity
  // MS Edge 18- broken with boxed symbols
  || (ITERATOR && !fails(function () { $parseFloat(Object(ITERATOR)); }));

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
module.exports = FORCED ? function parseFloat(string) {
  var trimmedString = trim(toString(string));
  var result = $parseFloat(trimmedString);
  return result === 0 && charAt(trimmedString, 0) === '-' ? -0 : result;
} : $parseFloat;


/***/ }),

/***/ 7249:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var FREEZING = __webpack_require__(5681);
var globalThis = __webpack_require__(5951);
var uncurryThis = __webpack_require__(1907);
var defineBuiltIns = __webpack_require__(2802);
var InternalMetadataModule = __webpack_require__(1548);
var collection = __webpack_require__(7081);
var collectionWeak = __webpack_require__(1182);
var isObject = __webpack_require__(6285);
var enforceInternalState = (__webpack_require__(4932).enforce);
var fails = __webpack_require__(8828);
var NATIVE_WEAK_MAP = __webpack_require__(551);

var $Object = Object;
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray = Array.isArray;
// eslint-disable-next-line es/no-object-isextensible -- safe
var isExtensible = $Object.isExtensible;
// eslint-disable-next-line es/no-object-isfrozen -- safe
var isFrozen = $Object.isFrozen;
// eslint-disable-next-line es/no-object-issealed -- safe
var isSealed = $Object.isSealed;
// eslint-disable-next-line es/no-object-freeze -- safe
var freeze = $Object.freeze;
// eslint-disable-next-line es/no-object-seal -- safe
var seal = $Object.seal;

var IS_IE11 = !globalThis.ActiveXObject && 'ActiveXObject' in globalThis;
var InternalWeakMap;

var wrapper = function (init) {
  return function WeakMap() {
    return init(this, arguments.length ? arguments[0] : undefined);
  };
};

// `WeakMap` constructor
// https://tc39.es/ecma262/#sec-weakmap-constructor
var $WeakMap = collection('WeakMap', wrapper, collectionWeak);
var WeakMapPrototype = $WeakMap.prototype;
var nativeSet = uncurryThis(WeakMapPrototype.set);

// Chakra Edge bug: adding frozen arrays to WeakMap unfreeze them
var hasMSEdgeFreezingBug = function () {
  return FREEZING && fails(function () {
    var frozenArray = freeze([]);
    nativeSet(new $WeakMap(), frozenArray, 1);
    return !isFrozen(frozenArray);
  });
};

// IE11 WeakMap frozen keys fix
// We can't use feature detection because it crash some old IE builds
// https://github.com/zloirock/core-js/issues/485
if (NATIVE_WEAK_MAP) if (IS_IE11) {
  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
  InternalMetadataModule.enable();
  var nativeDelete = uncurryThis(WeakMapPrototype['delete']);
  var nativeHas = uncurryThis(WeakMapPrototype.has);
  var nativeGet = uncurryThis(WeakMapPrototype.get);
  defineBuiltIns(WeakMapPrototype, {
    'delete': function (key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeDelete(this, key) || state.frozen['delete'](key);
      } return nativeDelete(this, key);
    },
    has: function has(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas(this, key) || state.frozen.has(key);
      } return nativeHas(this, key);
    },
    get: function get(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas(this, key) ? nativeGet(this, key) : state.frozen.get(key);
      } return nativeGet(this, key);
    },
    set: function set(key, value) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        nativeHas(this, key) ? nativeSet(this, key, value) : state.frozen.set(key, value);
      } else nativeSet(this, key, value);
      return this;
    }
  });
// Chakra Edge frozen keys fix
} else if (hasMSEdgeFreezingBug()) {
  defineBuiltIns(WeakMapPrototype, {
    set: function set(key, value) {
      var arrayIntegrityLevel;
      if (isArray(key)) {
        if (isFrozen(key)) arrayIntegrityLevel = freeze;
        else if (isSealed(key)) arrayIntegrityLevel = seal;
      }
      nativeSet(this, key, value);
      if (arrayIntegrityLevel) arrayIntegrityLevel(key);
      return this;
    }
  });
}


/***/ }),

/***/ 7286:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var newPromiseCapabilityModule = __webpack_require__(6254);
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(1759).CONSTRUCTOR);

// `Promise.reject` method
// https://tc39.es/ecma262/#sec-promise.reject
$({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  reject: function reject(r) {
    var capability = newPromiseCapabilityModule.f(this);
    var capabilityReject = capability.reject;
    capabilityReject(r);
    return capability.promise;
  }
});


/***/ }),

/***/ 7374:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(6946);
var requireObjectCoercible = __webpack_require__(4239);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 7376:
/***/ (function(module) {

"use strict";

module.exports = true;


/***/ }),

/***/ 7380:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var globalThis = __webpack_require__(5951);
var apply = __webpack_require__(6024);
var slice = __webpack_require__(3427);
var newPromiseCapabilityModule = __webpack_require__(6254);
var aCallable = __webpack_require__(2159);
var perform = __webpack_require__(4420);

var Promise = globalThis.Promise;

var ACCEPT_ARGUMENTS = false;
// Avoiding the use of polyfills of the previous iteration of this proposal
// that does not accept arguments of the callback
var FORCED = !Promise || !Promise['try'] || perform(function () {
  Promise['try'](function (argument) {
    ACCEPT_ARGUMENTS = argument === 8;
  }, 8);
}).error || !ACCEPT_ARGUMENTS;

// `Promise.try` method
// https://tc39.es/ecma262/#sec-promise.try
$({ target: 'Promise', stat: true, forced: FORCED }, {
  'try': function (callbackfn /* , ...args */) {
    var args = arguments.length > 1 ? slice(arguments, 1) : [];
    var promiseCapability = newPromiseCapabilityModule.f(this);
    var result = perform(function () {
      return apply(aCallable(callbackfn), undefined, args);
    });
    (result.error ? promiseCapability.reject : promiseCapability.resolve)(result.value);
    return promiseCapability.promise;
  }
});


/***/ }),

/***/ 7382:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(8828);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ 7450:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var call = __webpack_require__(3930);
var aCallable = __webpack_require__(2159);
var newPromiseCapabilityModule = __webpack_require__(6254);
var perform = __webpack_require__(4420);
var iterate = __webpack_require__(4823);
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(3282);

// `Promise.allSettled` method
// https://tc39.es/ecma262/#sec-promise.allsettled
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (error) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: error };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ 7463:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(8828);
var isCallable = __webpack_require__(2250);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 7586:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ENVIRONMENT = __webpack_require__(2832);

module.exports = ENVIRONMENT === 'NODE';


/***/ }),

/***/ 7623:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(8828);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ 7659:
/***/ (function(module) {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 7714:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var IS_PURE = __webpack_require__(7376);
var NativePromiseConstructor = __webpack_require__(5463);
var fails = __webpack_require__(8828);
var getBuiltIn = __webpack_require__(5582);
var isCallable = __webpack_require__(2250);
var speciesConstructor = __webpack_require__(8450);
var promiseResolve = __webpack_require__(3569);
var defineBuiltIn = __webpack_require__(8055);

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!NativePromiseConstructor && fails(function () {
  // eslint-disable-next-line unicorn/no-thenable -- required for testing
  NativePromisePrototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = isCallable(onFinally);
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['finally'];
  if (NativePromisePrototype['finally'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'finally', method, { unsafe: true });
  }
}


/***/ }),

/***/ 7812:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(6264);
var Iterators = __webpack_require__(3742);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ 7825:
/***/ (function(module) {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 7961:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(8280);
var method = __webpack_require__(4491);

var StringPrototype = String.prototype;

module.exports = function (it) {
  var own = it.startsWith;
  return typeof it == 'string' || it === StringPrototype
    || (isPrototypeOf(StringPrototype, it) && own === StringPrototype.startsWith) ? method : own;
};


/***/ }),

/***/ 8024:
/***/ (function(module) {

"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ 8055:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var createNonEnumerableProperty = __webpack_require__(1626);

module.exports = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
  return target;
};


/***/ }),

/***/ 8075:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(6624);
var definePropertiesModule = __webpack_require__(2220);
var enumBugKeys = __webpack_require__(376);
var hiddenKeys = __webpack_require__(8530);
var html = __webpack_require__(2416);
var documentCreateElement = __webpack_require__(9552);
var sharedKey = __webpack_require__(2522);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ 8280:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 8311:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(2361);
var aCallable = __webpack_require__(2159);
var NATIVE_BIND = __webpack_require__(1505);

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 8450:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(6624);
var aConstructor = __webpack_require__(2235);
var isNullOrUndefined = __webpack_require__(7136);
var wellKnownSymbol = __webpack_require__(6264);

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
};


/***/ }),

/***/ 8530:
/***/ (function(module) {

"use strict";

module.exports = {};


/***/ }),

/***/ 8606:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(6794);

module.exports = /ipad|iphone|ipod/i.test(userAgent) && typeof Pebble != 'undefined';


/***/ }),

/***/ 8661:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9447);
var fails = __webpack_require__(8828);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ 8685:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(8280);
var method = __webpack_require__(1127);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.push;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.push) ? method : own;
};


/***/ }),

/***/ 8823:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(8280);
var method = __webpack_require__(6693);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.reduce;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.reduce) ? method : own;
};


/***/ }),

/***/ 8828:
/***/ (function(module) {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 9192:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(1871);
var isObject = __webpack_require__(6285);
var requireObjectCoercible = __webpack_require__(4239);
var aPossiblePrototype = __webpack_require__(43);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 9245:
/***/ (function(module) {

"use strict";

var Queue = function () {
  this.head = null;
  this.tail = null;
};

Queue.prototype = {
  add: function (item) {
    var entry = { item: item, next: null };
    var tail = this.tail;
    if (tail) tail.next = entry;
    else this.head = entry;
    this.tail = entry;
  },
  get: function () {
    var entry = this.head;
    if (entry) {
      var next = this.head = entry.next;
      if (next === null) this.tail = null;
      return entry.item;
    }
  }
};

module.exports = Queue;


/***/ }),

/***/ 9251:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var defineProperty = __webpack_require__(4284);

module.exports = function (target, name, descriptor) {
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ 9259:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(6285);
var createNonEnumerableProperty = __webpack_require__(1626);

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


/***/ }),

/***/ 9287:
/***/ (function(module) {

"use strict";

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ 9291:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(6794);

module.exports = /web0s(?!.*chrome)/i.test(userAgent);


/***/ }),

/***/ 9298:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var requireObjectCoercible = __webpack_require__(4239);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 9363:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(7374);
var addToUnscopables = __webpack_require__(2156);
var Iterators = __webpack_require__(3742);
var InternalStateModule = __webpack_require__(4932);
var defineProperty = (__webpack_require__(4284).f);
var defineIterator = __webpack_require__(183);
var createIterResultObject = __webpack_require__(9550);
var IS_PURE = __webpack_require__(7376);
var DESCRIPTORS = __webpack_require__(9447);

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = null;
    return createIterResultObject(undefined, true);
  }
  switch (state.kind) {
    case 'keys': return createIterResultObject(index, false);
    case 'values': return createIterResultObject(target[index], false);
  } return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }


/***/ }),

/***/ 9367:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(2159);
var isNullOrUndefined = __webpack_require__(7136);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 9428:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(7173);
__webpack_require__(2560);

module.exports = parent;


/***/ }),

/***/ 9447:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(8828);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 9472:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var apply = __webpack_require__(6024);
var bind = __webpack_require__(8311);
var isCallable = __webpack_require__(2250);
var hasOwn = __webpack_require__(9724);
var fails = __webpack_require__(8828);
var html = __webpack_require__(2416);
var arraySlice = __webpack_require__(3427);
var createElement = __webpack_require__(9552);
var validateArgumentsLength = __webpack_require__(4787);
var IS_IOS = __webpack_require__(1829);
var IS_NODE = __webpack_require__(7586);

var set = globalThis.setImmediate;
var clear = globalThis.clearImmediate;
var process = globalThis.process;
var Dispatch = globalThis.Dispatch;
var Function = globalThis.Function;
var MessageChannel = globalThis.MessageChannel;
var String = globalThis.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var $location, defer, channel, port;

fails(function () {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  $location = globalThis.location;
});

var run = function (id) {
  if (hasOwn(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var eventListener = function (event) {
  run(event.data);
};

var globalPostMessageDefer = function (id) {
  // old engines have not location.origin
  globalThis.postMessage(String(id), $location.protocol + '//' + $location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      apply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = eventListener;
    defer = bind(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    globalThis.addEventListener &&
    isCallable(globalThis.postMessage) &&
    !globalThis.importScripts &&
    $location && $location.protocol !== 'file:' &&
    !fails(globalPostMessageDefer)
  ) {
    defer = globalPostMessageDefer;
    globalThis.addEventListener('message', eventListener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),

/***/ 9502:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var $parseFloat = __webpack_require__(7213);

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
$({ global: true, forced: parseFloat !== $parseFloat }, {
  parseFloat: $parseFloat
});


/***/ }),

/***/ 9528:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(8823);

module.exports = parent;


/***/ }),

/***/ 9550:
/***/ (function(module) {

"use strict";

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ }),

/***/ 9552:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var globalThis = __webpack_require__(5951);
var isObject = __webpack_require__(6285);

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 9595:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__(9724);
var ownKeys = __webpack_require__(1042);
var getOwnPropertyDescriptorModule = __webpack_require__(3846);
var definePropertyModule = __webpack_require__(4284);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 9596:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(8280);

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw new $TypeError('Incorrect invocation');
};


/***/ }),

/***/ 9724:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1907);
var toObject = __webpack_require__(9298);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 9748:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var $includes = (__webpack_require__(4436).includes);
var fails = __webpack_require__(8828);
var addToUnscopables = __webpack_require__(2156);

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  // eslint-disable-next-line es/no-array-prototype-includes -- detection
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ 9770:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(1091);
var uncurryThis = __webpack_require__(1907);
var notARegExp = __webpack_require__(2074);
var requireObjectCoercible = __webpack_require__(4239);
var toString = __webpack_require__(160);
var correctIsRegExpLogic = __webpack_require__(5735);

var stringIndexOf = uncurryThis(''.indexOf);

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~stringIndexOf(
      toString(requireObjectCoercible(this)),
      toString(notARegExp(searchString)),
      arguments.length > 1 ? arguments[1] : undefined
    );
  }
});


/***/ }),

/***/ 9824:
/***/ (function(module) {

"use strict";
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHdJREFUeNqUk9EKwCAIRaX9/9MgEAZ9amsPsWVXdxV8Ec+B1Ep/o40UMuuEpK/RMvAUnEZysfAIlYRkg5/6tyGSQNgKPIkLIwGSuLAn8CSKeovgOMiaMKtKPQENjB5i1Pi7xkoMzD0kBg5PmYVnqv1MGXiT3AIMACNQPFnn5xfHAAAAAElFTkSuQmCC";

/***/ }),

/***/ 9846:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(798);
var fails = __webpack_require__(8828);
var globalThis = __webpack_require__(5951);

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 9929:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(9502);
var path = __webpack_require__(2046);

module.exports = path.parseFloat;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	!function() {
/******/ 		var getProto = Object.getPrototypeOf ? function(obj) { return Object.getPrototypeOf(obj); } : function(obj) { return obj.__proto__; };
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach(function(key) { def[key] = function() { return value[key]; }; });
/******/ 			}
/******/ 			def['default'] = function() { return value; };
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	!function() {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = function(chunkId) {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	!function() {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "RmpVast:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = function(url, done, key, chunkId) {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = function(prev, event) {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach(function(fn) { return fn(event); });
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			69: 0,
/******/ 			931: 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = function(chunkId, promises) {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise(function(resolve, reject) { installedChunkData = installedChunks[chunkId] = [resolve, reject]; });
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = function(event) {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkRmpVast"] = self["webpackChunkRmpVast"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	!function() {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
!function() {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ RmpVast; }
});

// EXTERNAL MODULE: ./node_modules/core-js-pure/stable/instance/push.js
var push = __webpack_require__(3266);
var push_default = /*#__PURE__*/__webpack_require__.n(push);
// EXTERNAL MODULE: ./node_modules/core-js-pure/stable/promise/index.js
var promise = __webpack_require__(5204);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise);
// EXTERNAL MODULE: ./node_modules/core-js-pure/stable/instance/reduce.js
var reduce = __webpack_require__(9528);
var reduce_default = /*#__PURE__*/__webpack_require__.n(reduce);
// EXTERNAL MODULE: ./node_modules/core-js-pure/stable/parse-float.js
var parse_float = __webpack_require__(6462);
var parse_float_default = /*#__PURE__*/__webpack_require__.n(parse_float);
;// ./src/js/framework/fw.js


class FW {
  static createSyntheticEvent(eventName, element) {
    let event;
    if (element) {
      try {
        event = new Event(eventName);
        element.dispatchEvent(event);
      } catch (error) {
        console.warn(error);
      }
    }
  }
  static setStyle(element, styleObject) {
    if (element && typeof styleObject === 'object') {
      const keys = Object.keys(styleObject);
      keys.forEach(key => {
        element.style[key] = styleObject[key];
      });
    }
  }
  static getWidth(element) {
    if (element) {
      if (FW.isNumber(element.offsetWidth) && element.offsetWidth !== 0) {
        return element.offsetWidth;
      } else {
        return _getStyleAttributeData.call(FW, element, 'width');
      }
    }
    return 0;
  }
  static getHeight(element) {
    if (element) {
      if (FW.isNumber(element.offsetHeight) && element.offsetHeight !== 0) {
        return element.offsetHeight;
      } else {
        return _getStyleAttributeData.call(FW, element, 'height');
      }
    }
    return 0;
  }
  static show(element) {
    if (element) {
      element.style.display = 'block';
    }
  }
  static hide(element) {
    if (element) {
      element.style.display = 'none';
    }
  }
  static removeElement(element) {
    if (element && element.parentNode) {
      try {
        element.parentNode.removeChild(element);
      } catch (error) {
        console.warn(error);
      }
    }
  }
  static isNumber(n) {
    if (typeof n === 'number' && Number.isFinite(n)) {
      return true;
    }
    return false;
  }
  static openWindow(link) {
    try {
      // I would like to use named window here to have better performance like 
      // window.open(link, 'rmpVastAdPageArea'); but focus is not set on updated window with such approach
      // in MS Edge and FF - so _blank it is
      window.open(link, '_blank');
    } catch (error) {
      console.warn(error);
    }
  }
  static ajax(url, timeout, withCredentials) {
    return new (promise_default())((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.timeout = timeout;
      if (withCredentials) {
        xhr.withCredentials = true;
      }
      xhr.onloadend = () => {
        if (typeof xhr.status === 'number' && xhr.status >= 200 && xhr.status < 300) {
          resolve('XMLHttpRequest request succeeded');
        } else {
          reject('XMLHttpRequest wrong status code: ' + xhr.status);
        }
      };
      xhr.ontimeout = () => {
        reject('XMLHttpRequest timeout');
      };
      xhr.send(null);
    });
  }
  static addEvents(events, domElement, callback) {
    if (events && events.length > 1 && domElement && typeof callback === 'function') {
      events.forEach(event => {
        domElement.addEventListener(event, callback);
      });
    }
  }
  static stopPreventEvent(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  static vastReadableTime(time) {
    if (FW.isNumber(time) && time >= 0) {
      let seconds = 0;
      let minutes = 0;
      let hours = 0;
      let ms = Math.floor(time % 1000);
      if (ms === 0) {
        ms = '000';
      } else if (ms < 10) {
        ms = '00' + ms;
      } else if (ms < 100) {
        ms = '0' + ms;
      } else {
        ms = ms.toString();
      }
      seconds = Math.floor(time * 1.0 / 1000);
      if (seconds > 59) {
        minutes = Math.floor(seconds * 1.0 / 60);
        seconds = seconds - minutes * 60;
      }
      if (seconds === 0) {
        seconds = '00';
      } else if (seconds < 10) {
        seconds = '0' + seconds;
      } else {
        seconds = seconds.toString();
      }
      if (minutes > 59) {
        hours = Math.floor(minutes * 1.0 / 60);
        minutes = minutes - hours * 60;
      }
      if (minutes === 0) {
        minutes = '00';
      } else if (minutes < 10) {
        minutes = '0' + minutes;
      } else {
        minutes = minutes.toString();
      }
      if (hours === 0) {
        hours = '00';
      } else if (hours < 10) {
        hours = '0' + hours;
      } else {
        if (hours > 23) {
          hours = '00';
        } else {
          hours = hours.toString();
        }
      }
      return hours + ':' + minutes + ':' + seconds + '.' + ms;
    } else {
      return '00:00:00.000';
    }
  }
  static generateCacheBusting() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  static makeButtonAccessible(element, ariaLabel) {
    // make skip button accessible
    element.tabIndex = 0;
    element.setAttribute('role', 'button');
    element.addEventListener('keyup', event => {
      const code = event.which;
      // 13 = Return, 32 = Space
      if (code === 13 || code === 32) {
        event.stopPropagation();
        event.preventDefault();
        FW.createSyntheticEvent('click', element);
      }
    });
    if (ariaLabel) {
      element.setAttribute('aria-label', ariaLabel);
    }
  }
}
function _getStyleAttributeData(element, style) {
  let styleAttributeData = 0;
  if (element && typeof window.getComputedStyle === 'function') {
    const cs = window.getComputedStyle(element, null);
    if (cs) {
      styleAttributeData = cs.getPropertyValue(style);
      styleAttributeData = styleAttributeData.toString().toLowerCase();
    }
  }
  styleAttributeData = styleAttributeData.toString();
  if (styleAttributeData.indexOf('px') > -1) {
    styleAttributeData = styleAttributeData.replace('px', '');
  }
  return parse_float_default()(styleAttributeData);
}
// EXTERNAL MODULE: ./node_modules/core-js-pure/stable/parse-int.js
var parse_int = __webpack_require__(1921);
var parse_int_default = /*#__PURE__*/__webpack_require__.n(parse_int);
;// ./src/js/framework/environment.js


class Environment {
  static get userAgent() {
    if (navigator.userAgent) {
      return navigator.userAgent;
    }
    return null;
  }
  static get devicePixelRatio() {
    let pixelRatio = 1;
    if (FW.isNumber(window.devicePixelRatio) && window.devicePixelRatio > 1) {
      pixelRatio = window.devicePixelRatio;
    }
    return pixelRatio;
  }
  static get maxTouchPoints() {
    if (typeof navigator.maxTouchPoints === 'number') {
      return navigator.maxTouchPoints;
    }
    return -1;
  }
  static get isIos() {
    const IOS_PATTERN = /(ipad|iphone|ipod)/i;
    const IOS_VERSION_PATTERN = /os\s+(\d+)_/i;
    let support = [false, -1];
    if (IOS_PATTERN.test(Environment.userAgent) && _get_hasTouchEvents(Environment)) {
      support = [true, _filterVersion.call(Environment, IOS_VERSION_PATTERN)];
    }
    return support;
  }
  static get isIpadOS() {
    const MAC_PLATFORM_PATTERN = /macintel/i;
    if (!Environment.isIos[0] && _get_hasTouchEvents(Environment) && MAC_PLATFORM_PATTERN.test(navigator.platform) && Environment.devicePixelRatio > 1 && Environment.maxTouchPoints > 1) {
      return true;
    }
    return false;
  }
  static get isMacOS() {
    const MACOS_PATTERN = /(macintosh|mac\s+os)/i;
    const MACOS_VERSION_PATTERN = /mac\s+os\s+x\s+(\d+)_(\d+)/i;
    let isMacOS = false;
    let macOSXMinorVersion = -1;
    if (!Environment.isIos[0] && !Environment.isIpadOS && MACOS_PATTERN.test(Environment.userAgent)) {
      isMacOS = true;
      macOSXMinorVersion = _filterVersion.call(Environment, MACOS_VERSION_PATTERN, true);
    }
    return [isMacOS, macOSXMinorVersion];
  }
  static get isSafari() {
    const SAFARI_PATTERN = /safari\/[.0-9]*/i;
    const SAFARI_VERSION_PATTERN = /version\/(\d+)\./i;
    const NO_SAFARI_PATTERN = /(chrome|chromium|android|crios|fxios)/i;
    let isSafari = false;
    let safariVersion = -1;
    if (SAFARI_PATTERN.test(Environment.userAgent) && !NO_SAFARI_PATTERN.test(Environment.userAgent)) {
      isSafari = true;
      safariVersion = _filterVersion.call(Environment, SAFARI_VERSION_PATTERN);
    }
    return [isSafari, safariVersion];
  }
  static get isMacOSSafari() {
    return Environment.isMacOS[0] && Environment.isSafari[0];
  }
  static get isAndroid() {
    const ANDROID_PATTERN = /android/i;
    const ANDROID_VERSION_PATTERN = /android\s*(\d+)\./i;
    let support = [false, -1];
    if (!Environment.isIos[0] && _get_hasTouchEvents(Environment) && ANDROID_PATTERN.test(Environment.userAgent)) {
      support = [true, _filterVersion.call(Environment, ANDROID_VERSION_PATTERN)];
    }
    return support;
  }
  static get isMobile() {
    if (Environment.isIos[0] || Environment.isAndroid[0] || Environment.isIpadOS) {
      return true;
    }
    return false;
  }
  static get hasNativeFullscreenSupport() {
    const doc = document.documentElement;
    const testVideo = _get_testVideo(Environment);
    if (doc) {
      if (typeof doc.requestFullscreen !== 'undefined' || typeof doc.webkitRequestFullscreen !== 'undefined' || typeof doc.mozRequestFullScreen !== 'undefined' || typeof doc.msRequestFullscreen !== 'undefined' || typeof testVideo.webkitEnterFullscreen !== 'undefined') {
        return true;
      }
    }
    return false;
  }
  static checkCanPlayType(type, codec) {
    const testVideo = _get_testVideo(Environment);
    if (testVideo.canPlayType !== 'undefined') {
      if (type && codec) {
        const canPlayType = testVideo.canPlayType(type + '; codecs="' + codec + '"');
        if (canPlayType !== '') {
          return true;
        }
      } else if (type && !codec) {
        const canPlayType = testVideo.canPlayType(type);
        if (canPlayType !== '') {
          return true;
        }
      }
    }
    return false;
  }
}
function _filterVersion(pattern) {
  if (navigator.userAgent) {
    const versionArray = navigator.userAgent.match(pattern);
    if (Array.isArray(versionArray) && typeof versionArray[1] !== 'undefined') {
      return parse_int_default()(versionArray[1], 10);
    }
  }
  return -1;
}
function _get_testVideo(_this) {
  return document.createElement('video');
}
function _get_hasTouchEvents(_this2) {
  if (typeof window.ontouchstart !== 'undefined' || window.DocumentTouch && document instanceof window.DocumentTouch) {
    return true;
  }
  return false;
}
;// ./src/js/framework/logger.js
class Logger {
  static printVideoEvents(debugRawConsoleLogs, video, type) {
    const events = ['loadstart', 'durationchange', 'playing', 'waiting', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'];
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
        _rawConsoleLogs.call(Logger, dump);
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
function _rawConsoleLogs(dump) {
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
// EXTERNAL MODULE: ./node_modules/core-js-pure/stable/weak-map/index.js
var weak_map = __webpack_require__(9428);
var weak_map_default = /*#__PURE__*/__webpack_require__.n(weak_map);
;// ./src/js/helpers/utils.js

function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }



var _rmpVast = /*#__PURE__*/new (weak_map_default())();
var _onFullscreenchangeFn = /*#__PURE__*/new (weak_map_default())();
var _Utils_brand = /*#__PURE__*/new WeakSet();
class Utils {
  constructor(rmpVast) {
    // attach fullscreen states
    // this assumes we have a polyfill for fullscreenchange event 
    // see app/js/app.js
    // we need this to handle VAST fullscreen events
    _classPrivateMethodInitSpec(this, _Utils_brand);
    _classPrivateFieldInitSpec(this, _rmpVast, void 0);
    _classPrivateFieldInitSpec(this, _onFullscreenchangeFn, null);
    _classPrivateFieldSet(_rmpVast, this, rmpVast);
  }
  filterParams(inputParams) {
    // default for input parameters
    const defaultParams = {
      ajaxTimeout: 8000,
      creativeLoadTimeout: 8000,
      ajaxWithCredentials: false,
      maxNumRedirects: 4,
      labels: {
        skipMessage: 'Skip ad',
        closeAd: 'Close ad',
        textForInteractionUIOnMobile: 'Learn more'
      },
      outstream: false,
      showControlsForAdPlayer: false,
      vastXmlInput: false,
      enableVpaid: true,
      enableSimid: true,
      vpaidSettings: {
        width: 640,
        height: 360,
        viewMode: 'normal',
        desiredBitrate: 500
      },
      useHlsJS: true,
      debugHlsJS: false,
      debugRawConsoleLogs: false,
      // OM SDK params
      omidSupport: false,
      omidAllowedVendors: [],
      omidRunValidationScript: false,
      omidAutoplay: false,
      macros: new Map(),
      partnerName: 'rmp-vast',
      partnerVersion: "17.0.0"
    };
    _classPrivateFieldGet(_rmpVast, this).params = defaultParams;
    if (inputParams && typeof inputParams === 'object') {
      const keys = Object.keys(inputParams);
      keys.forEach(key => {
        if (typeof inputParams[key] === typeof _classPrivateFieldGet(_rmpVast, this).params[key]) {
          if (FW.isNumber(inputParams[key]) && inputParams[key] > 0 || typeof inputParams[key] !== 'number') {
            if (key === 'vpaidSettings') {
              if (FW.isNumber(inputParams.vpaidSettings.width) && inputParams.vpaidSettings.width > 0) {
                _classPrivateFieldGet(_rmpVast, this).params.vpaidSettings.width = inputParams.vpaidSettings.width;
              }
              if (FW.isNumber(inputParams.vpaidSettings.height) && inputParams.vpaidSettings.height > 0) {
                _classPrivateFieldGet(_rmpVast, this).params.vpaidSettings.height = inputParams.vpaidSettings.height;
              }
              if (typeof inputParams.vpaidSettings.viewMode === 'string' && inputParams.vpaidSettings.viewMode === 'fullscreen') {
                _classPrivateFieldGet(_rmpVast, this).params.vpaidSettings.viewMode = inputParams.vpaidSettings.viewMode;
              }
              if (FW.isNumber(inputParams.vpaidSettings.desiredBitrate) && inputParams.vpaidSettings.desiredBitrate > 0) {
                _classPrivateFieldGet(_rmpVast, this).params.vpaidSettings.desiredBitrate = inputParams.vpaidSettings.desiredBitrate;
              }
            } else {
              _classPrivateFieldGet(_rmpVast, this).params[key] = inputParams[key];
            }
          }
        }
      });
    }
  }
  createApiEvent(event) {
    if (Array.isArray(event)) {
      event.forEach(currentEvent => {
        if (currentEvent) {
          Logger.print(_classPrivateFieldGet(_rmpVast, this).debugRawConsoleLogs, `API EVENT - ${event}`);
          _classPrivateFieldGet(_rmpVast, this).dispatch(currentEvent);
        }
      });
    } else if (event) {
      Logger.print(_classPrivateFieldGet(_rmpVast, this).debugRawConsoleLogs, `API EVENT - ${event}`);
      _classPrivateFieldGet(_rmpVast, this).dispatch(event);
    }
  }
  playPromise(whichPlayer, firstPlayerPlayRequest) {
    let targetPlayer;
    switch (whichPlayer) {
      case 'content':
        targetPlayer = _classPrivateFieldGet(_rmpVast, this).currentContentPlayer;
        break;
      case 'vast':
        targetPlayer = _classPrivateFieldGet(_rmpVast, this).currentAdPlayer;
        break;
      default:
        break;
    }
    if (targetPlayer) {
      const playPromise = targetPlayer.play();
      // most modern browsers support play as a Promise
      // this lets us handle autoplay rejection 
      // https://developers.google.com/web/updates/2016/03/play-returns-promise
      if (playPromise !== undefined) {
        const isLinear = _classPrivateFieldGet(_rmpVast, this).creative.isLinear;
        playPromise.then(() => {
          Logger.print(_classPrivateFieldGet(_rmpVast, this).debugRawConsoleLogs, `playPromise on ${whichPlayer} player has succeeded`);
          if (firstPlayerPlayRequest) {
            this.createApiEvent('adinitialplayrequestsucceeded');
          }
        }).catch(error => {
          console.warn(error);
          if (firstPlayerPlayRequest && whichPlayer === 'vast' && isLinear) {
            Logger.print(_classPrivateFieldGet(_rmpVast, this).debugRawConsoleLogs, `initial play promise on ad player has been rejected`);
            this.processVastErrors(400, true);
            this.createApiEvent('adinitialplayrequestfailed');
          } else if (firstPlayerPlayRequest && whichPlayer === 'content' && !isLinear) {
            Logger.print(_classPrivateFieldGet(_rmpVast, this).debugRawConsoleLogs, `initial play promise on content player has been rejected`);
            this.createApiEvent('adinitialplayrequestfailed');
          } else {
            Logger.print(_classPrivateFieldGet(_rmpVast, this).debugRawConsoleLogs, `playPromise on ${whichPlayer} player has been rejected`);
          }
        });
      }
    }
  }
  destroyFullscreen() {
    if (_classPrivateFieldGet(_rmpVast, this).currentContentPlayer) {
      _classPrivateFieldGet(_rmpVast, this).currentContentPlayer.removeEventListener('webkitbeginfullscreen', _classPrivateFieldGet(_onFullscreenchangeFn, this));
      _classPrivateFieldGet(_rmpVast, this).currentContentPlayer.removeEventListener('webkitendfullscreen', _classPrivateFieldGet(_onFullscreenchangeFn, this));
    } else {
      document.removeEventListener('fullscreenchange', _classPrivateFieldGet(_onFullscreenchangeFn, this));
    }
  }
  handleFullscreen() {
    // if we have native fullscreen support we handle fullscreen events
    if (Environment.hasNativeFullscreenSupport) {
      _classPrivateFieldSet(_onFullscreenchangeFn, this, _assertClassBrand(_Utils_brand, this, _onFullscreenchange).bind(this));
      // for iOS 
      if (Environment.isIos[0]) {
        if (_classPrivateFieldGet(_rmpVast, this).currentContentPlayer) {
          _classPrivateFieldGet(_rmpVast, this).currentContentPlayer.addEventListener('webkitbeginfullscreen', _classPrivateFieldGet(_onFullscreenchangeFn, this));
          _classPrivateFieldGet(_rmpVast, this).currentContentPlayer.addEventListener('webkitendfullscreen', _classPrivateFieldGet(_onFullscreenchangeFn, this));
        }
      } else {
        document.addEventListener('fullscreenchange', _classPrivateFieldGet(_onFullscreenchangeFn, this));
      }
    }
  }
  processVastErrors(errorCode, ping) {
    if (ping) {
      _classPrivateFieldGet(_rmpVast, this).rmpVastTracking.error(errorCode);
    }
    _assertClassBrand(_Utils_brand, this, _updateVastError).call(this, errorCode);
    this.createApiEvent('aderror');
    if (_classPrivateFieldGet(_rmpVast, this).rmpVastAdPlayer) {
      _classPrivateFieldGet(_rmpVast, this).rmpVastAdPlayer.resumeContent();
    }
  }
}
function _onFullscreenchange(event) {
  if (event && event.type) {
    Logger.print(_classPrivateFieldGet(_rmpVast, this).debugRawConsoleLogs, `event is ${event.type}`);
    const isLinear = _classPrivateFieldGet(_rmpVast, this).creative.isLinear;
    const isOnStage = _classPrivateFieldGet(_rmpVast, this).__adOnStage;
    if (event.type === 'fullscreenchange') {
      if (_classPrivateFieldGet(_rmpVast, this).isInFullscreen) {
        _classPrivateFieldGet(_rmpVast, this).isInFullscreen = false;
        if (isOnStage && isLinear) {
          _classPrivateFieldGet(_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent(['adexitfullscreen', 'adplayercollapse']);
        }
      } else {
        _classPrivateFieldGet(_rmpVast, this).isInFullscreen = true;
        if (isOnStage && isLinear) {
          _classPrivateFieldGet(_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent(['adfullscreen', 'adplayerexpand']);
        }
      }
    } else if (event.type === 'webkitbeginfullscreen') {
      // iOS uses webkitbeginfullscreen
      if (isOnStage && isLinear) {
        _classPrivateFieldGet(_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent(['adfullscreen', 'adplayerexpand']);
      }
      _classPrivateFieldGet(_rmpVast, this).isInFullscreen = true;
    } else if (event.type === 'webkitendfullscreen') {
      // iOS uses webkitendfullscreen
      if (isOnStage && isLinear) {
        _classPrivateFieldGet(_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent(['adexitfullscreen', 'adplayercollapse']);
      }
      _classPrivateFieldGet(_rmpVast, this).isInFullscreen = false;
    }
  }
}
function _updateVastError(errorCode) {
  // List of VAST errors according to specs
  const vastErrorsList = [{
    code: 201,
    description: 'Video player expecting different linearity.'
  }, {
    code: 204,
    description: 'Ad category was required but not provided.'
  }, {
    code: 205,
    description: 'Inline Category violates Wrapper BlockedAdCategories.'
  }, {
    code: 303,
    description: 'No VAST response after one or more Wrappers.'
  }, {
    code: 400,
    description: 'General Linear error. Video player is unable to display the Linear Ad.'
  }, {
    code: 401,
    description: 'File not found. Unable to find Linear/MediaFile from URI.'
  }, {
    code: 402,
    description: 'Timeout of MediaFile URI.'
  }, {
    code: 403,
    description: 'Couldn\'t find MediaFile that is supported by this video player, based on the attributes of the MediaFile element.'
  }, {
    code: 501,
    description: 'Unable to display NonLinear Ad because creative dimensions do not align with creative display area (i.e. creative dimension too large).'
  }, {
    code: 502,
    description: 'Unable to fetch NonLinearAds/NonLinear resource.'
  }, {
    code: 503,
    description: 'Couldn\'t find NonLinear resource with supported type.'
  }, {
    code: 603,
    description: 'Unable to fetch CompanionAds/Companion resource.'
  }, {
    code: 900,
    description: 'Undefined Error.'
  }, {
    code: 901,
    description: 'General VPAID error.'
  }, {
    code: 1001,
    description: 'Invalid input for loadAds method'
  }, {
    code: 1002,
    description: 'Required DOMParser API is not available'
  }, {
    code: 1100,
    description: 'SIMID error: UNSPECIFIED_CREATIVE_ERROR'
  }, {
    code: 1101,
    description: 'SIMID error: CANNOT_LOAD_RESOURCE'
  }, {
    code: 1102,
    description: 'SIMID error: PLAYBACK_AREA_UNUSABLE'
  }, {
    code: 1103,
    description: 'SIMID error: INCORRECT_VERSION'
  }, {
    code: 1104,
    description: 'SIMID error: TECHNICAL_ERROR'
  }, {
    code: 1105,
    description: 'SIMID error: EXPAND_NOT_POSSIBLE'
  }, {
    code: 1106,
    description: 'SIMID error: PAUSE_NOT_HONORED'
  }, {
    code: 1107,
    description: 'SIMID error: PLAYMODE_NOT_ADEQUATE'
  }, {
    code: 1108,
    description: 'SIMID error: CREATIVE_INTERNAL_ERROR'
  }, {
    code: 1109,
    description: 'SIMID error: DEVICE_NOT_SUPPORTED'
  }, {
    code: 1110,
    description: 'SIMID error: MESSAGES_NOT_FOLLOWING_SPEC'
  }, {
    code: 1111,
    description: 'SIMID error: PLAYER_RESPONSE_TIMEOUT'
  }, {
    code: 1200,
    description: 'SIMID error: UNSPECIFIED_PLAYER_ERROR'
  }, {
    code: 1201,
    description: 'SIMID error: WRONG_VERSION'
  }, {
    code: 1202,
    description: 'SIMID error: UNSUPPORTED_TIME'
  }, {
    code: 1203,
    description: 'SIMID error: UNSUPPORTED_FUNCTIONALITY_REQUEST'
  }, {
    code: 1204,
    description: 'SIMID error: UNSUPPORTED_ACTIONS'
  }, {
    code: 1205,
    description: 'SIMID error: POSTMESSAGE_CHANNEL_OVERLOADED'
  }, {
    code: 1206,
    description: 'SIMID error: VIDEO_COULD_NOT_LOAD'
  }, {
    code: 1207,
    description: 'SIMID error: VIDEO_TIME_OUT'
  }, {
    code: 1208,
    description: 'SIMID error: RESPONSE_TIMEOUT'
  }, {
    code: 1209,
    description: 'SIMID error: MEDIA_NOT_SUPPORTED'
  }, {
    code: 1210,
    description: 'SIMID error: SPEC_NOT_FOLLOWED_ON_INIT'
  }, {
    code: 1211,
    description: 'SIMID error: SPEC_NOT_FOLLOWED_ON_MESSAGES'
  }];

  // Indicates that the error was encountered after the ad loaded, during ad play. 
  // Possible causes: ad assets could not be loaded, etc.
  const playErrorsList = [201, 204, 205, 400, 401, 402, 403, 501, 502, 503, 603, 901, 1002];

  // Indicates that the error was encountered when the ad was being loaded. 
  // Possible causes: there was no response from the ad server, malformed ad response was returned ...
  // 300, 301, 302, 303, 304 Wrapper errors are managed in ast-client-js
  const loadErrorsList = [303, 900, 1001];
  const error = vastErrorsList.filter(value => {
    return value.code === errorCode;
  });
  if (error.length > 0) {
    _classPrivateFieldGet(_rmpVast, this).__vastErrorCode = error[0].code;
    _classPrivateFieldGet(_rmpVast, this).__adErrorMessage = error[0].description;
  } else {
    _classPrivateFieldGet(_rmpVast, this).__vastErrorCode = -1;
    _classPrivateFieldGet(_rmpVast, this).__adErrorMessage = 'Error getting VAST error';
  }
  if (_classPrivateFieldGet(_rmpVast, this).__vastErrorCode > -1) {
    if (loadErrorsList.indexOf(_classPrivateFieldGet(_rmpVast, this).__vastErrorCode) > -1) {
      _classPrivateFieldGet(_rmpVast, this).__adErrorType = 'adLoadError';
    } else if (playErrorsList.indexOf(_classPrivateFieldGet(_rmpVast, this).__vastErrorCode) > -1) {
      _classPrivateFieldGet(_rmpVast, this).__adErrorType = 'adPlayError';
    }
  }
  Logger.print(_classPrivateFieldGet(_rmpVast, this).debugRawConsoleLogs, `VAST error code is ${_classPrivateFieldGet(_rmpVast, this).__vastErrorCode} with message: ${_classPrivateFieldGet(_rmpVast, this).__adErrorMessage}`);
  Logger.print(_classPrivateFieldGet(_rmpVast, this).debugRawConsoleLogs, `Ad error type is ${_classPrivateFieldGet(_rmpVast, this).__adErrorType}`);
}
;// ./src/js/helpers/tracking.js


function tracking_classPrivateMethodInitSpec(e, a) { tracking_checkPrivateRedeclaration(e, a), a.add(e); }
function tracking_classPrivateFieldInitSpec(e, t, a) { tracking_checkPrivateRedeclaration(e, t), t.set(e, a); }
function tracking_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function tracking_classPrivateFieldGet(s, a) { return s.get(tracking_assertClassBrand(s, a)); }
function tracking_classPrivateFieldSet(s, a, r) { return s.set(tracking_assertClassBrand(s, a), r), r; }
function tracking_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }



var tracking_rmpVast = /*#__PURE__*/new (weak_map_default())();
var _trackingApiEventMap = /*#__PURE__*/new (weak_map_default())();
var _onPauseFn = /*#__PURE__*/new (weak_map_default())();
var _onPlayFn = /*#__PURE__*/new (weak_map_default())();
var _onPlayingFn = /*#__PURE__*/new (weak_map_default())();
var _onEndedFn = /*#__PURE__*/new (weak_map_default())();
var _onVolumeChangeFn = /*#__PURE__*/new (weak_map_default())();
var _onTimeupdateFn = /*#__PURE__*/new (weak_map_default())();
var _firstQuartileEventFired = /*#__PURE__*/new (weak_map_default())();
var _midpointEventFired = /*#__PURE__*/new (weak_map_default())();
var _thirdQuartileEventFired = /*#__PURE__*/new (weak_map_default())();
var _Tracking_brand = /*#__PURE__*/new WeakSet();
class Tracking {
  constructor(rmpVast) {
    tracking_classPrivateMethodInitSpec(this, _Tracking_brand);
    tracking_classPrivateFieldInitSpec(this, tracking_rmpVast, void 0);
    tracking_classPrivateFieldInitSpec(this, _trackingApiEventMap, new Map());
    tracking_classPrivateFieldInitSpec(this, _onPauseFn, null);
    tracking_classPrivateFieldInitSpec(this, _onPlayFn, null);
    tracking_classPrivateFieldInitSpec(this, _onPlayingFn, null);
    tracking_classPrivateFieldInitSpec(this, _onEndedFn, null);
    tracking_classPrivateFieldInitSpec(this, _onVolumeChangeFn, null);
    tracking_classPrivateFieldInitSpec(this, _onTimeupdateFn, null);
    tracking_classPrivateFieldInitSpec(this, _firstQuartileEventFired, false);
    tracking_classPrivateFieldInitSpec(this, _midpointEventFired, false);
    tracking_classPrivateFieldInitSpec(this, _thirdQuartileEventFired, false);
    tracking_classPrivateFieldSet(tracking_rmpVast, this, rmpVast);
    tracking_assertClassBrand(_Tracking_brand, this, _createTrackingApiEventMap).call(this);
  }
  replaceMacros(url, trackingPixels) {
    const pattern0 = /\[.+?\]/i;
    if (!pattern0.test(url)) {
      return url;
    }
    let finalString = url;

    // Macros that need to be set explicitly
    // CONTENTCAT GPPSECTIONID GPPSTRING PLAYBACKMETHODS STOREID STOREURL BREAKMAXADLENGTH BREAKMAXADS BREAKMAXDURATION
    // BREAKMINADLENGTH  PLACEMENTTYPE TRANSACTIONID CLIENTUA DEVICEIP IFA IFATYPE LATLONG SERVERUA APPBUNDLE
    // EXTENSIONS OMIDPARTNER VERIFICATIONVENDORS CONTENTID CONTENTURI INVENTORYSTATE
    if (tracking_classPrivateFieldGet(tracking_rmpVast, this).params.macros.size > 0) {
      for (let [key, value] of tracking_classPrivateFieldGet(tracking_rmpVast, this).params.macros) {
        const pattern = '\\[' + key + '\\]';
        const regex = new RegExp(pattern, 'gi');
        if (regex.test(finalString)) {
          finalString = finalString.replace(regex, value.toString());
        }
      }
    }

    // Value is known, but information can't be shared because of policy (unwilling to share)
    const patternUNWILLING = /\[CLICKPOS\]/gi;
    if (patternUNWILLING.test(finalString)) {
      finalString = finalString.replace(patternUNWILLING, '-2');
    }

    // available macros

    const patternADCOUNT = /\[ADCOUNT\]/gi;
    if (patternADCOUNT.test(finalString)) {
      let adCount = 1;
      if (tracking_classPrivateFieldGet(tracking_rmpVast, this).adPodLength > 0) {
        adCount = tracking_classPrivateFieldGet(tracking_rmpVast, this).adSequence;
      }
      finalString = finalString.replace(patternADCOUNT, adCount.toString());
    }
    const patternSERVERSIDE = /\[SERVERSIDE\]/gi;
    if (patternSERVERSIDE.test(finalString)) {
      finalString = finalString.replace(patternADCOUNT, '0');
    }
    const pattern1 = /\[TIMESTAMP\]/gi;
    const date = new Date().toISOString();
    if (pattern1.test(finalString)) {
      finalString = finalString.replace(pattern1, encodeURIComponent(date));
    }
    const pattern2 = /\[CACHEBUSTING\]/gi;
    if (pattern2.test(finalString)) {
      finalString = finalString.replace(pattern2, FW.generateCacheBusting());
    }
    const pattern3 = /\[(CONTENTPLAYHEAD|MEDIAPLAYHEAD)\]/gi;
    let currentContentTime = tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastContentPlayer.currentTime;
    if (pattern3.test(finalString) && currentContentTime > -1) {
      finalString = finalString.replace(pattern3, encodeURIComponent(FW.vastReadableTime(currentContentTime)));
    }
    const pattern5 = /\[BREAKPOSITION\]/gi;
    let adPlayerDuration = -1;
    if (tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastAdPlayer) {
      adPlayerDuration = tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastAdPlayer.duration;
    }
    if (pattern5.test(finalString)) {
      if (currentContentTime === 0) {
        finalString = finalString.replace(pattern5, '1');
      } else if (currentContentTime > 0 && currentContentTime < adPlayerDuration) {
        finalString = finalString.replace(pattern5, '2');
      } else {
        finalString = finalString.replace(pattern5, '3');
      }
    }
    const pattern9 = /\[ADTYPE\]/gi;
    if (pattern9.test(finalString) && tracking_classPrivateFieldGet(tracking_rmpVast, this).ad.adType) {
      finalString = finalString.replace(pattern9, encodeURIComponent(tracking_classPrivateFieldGet(tracking_rmpVast, this).ad.adType));
    }
    const pattern11 = /\[DEVICEUA\]/gi;
    if (pattern11.test(finalString) && Environment.userAgent) {
      finalString = finalString.replace(pattern11, encodeURIComponent(Environment.userAgent));
    }
    const pattern11bis = /\[SERVERSIDE\]/gi;
    if (pattern11bis.test(finalString) && Environment.userAgent) {
      finalString = finalString.replace(pattern11bis, '0');
    }
    const pattern13 = /\[DOMAIN\]/gi;
    if (pattern13.test(finalString) && window.location.hostname) {
      finalString = finalString.replace(pattern13, encodeURIComponent(window.location.hostname));
    }
    const pattern14 = /\[PAGEURL\]/gi;
    if (pattern14.test(finalString) && window.location.href) {
      finalString = finalString.replace(pattern14, encodeURIComponent(window.location.href));
    }
    const pattern18 = /\[PLAYERCAPABILITIES\]/gi;
    if (pattern18.test(finalString)) {
      finalString = finalString.replace(pattern18, 'skip,mute,autoplay,mautoplay,fullscreen,icon');
    }
    const pattern19 = /\[CLICKTYPE\]/gi;
    if (pattern19.test(finalString)) {
      let clickType = '1';
      if (Environment.isMobile) {
        clickType = '2';
      }
      finalString = finalString.replace(pattern19, clickType);
    }
    const pattern21 = /\[PLAYERSIZE\]/gi;
    if (pattern21.test(finalString)) {
      const width = parse_int_default()(FW.getWidth(tracking_classPrivateFieldGet(tracking_rmpVast, this).container));
      const height = parse_int_default()(FW.getHeight(tracking_classPrivateFieldGet(tracking_rmpVast, this).container));
      finalString = finalString.replace(pattern21, encodeURIComponent(width.toString() + ',' + height.toString()));
    }
    if (trackingPixels) {
      const pattern4 = /\[ADPLAYHEAD\]/gi;
      let adPlayerCurrentTime = -1;
      if (tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastAdPlayer) {
        adPlayerCurrentTime = tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastAdPlayer.currentTime;
      }
      if (pattern4.test(finalString) && adPlayerCurrentTime > -1) {
        finalString = finalString.replace(pattern4, encodeURIComponent(FW.vastReadableTime(adPlayerCurrentTime)));
      }
      const pattern10 = /\[UNIVERSALADID\]/gi;
      if (pattern10.test(finalString) && tracking_classPrivateFieldGet(tracking_rmpVast, this).creative.universalAdIds.length > 0) {
        let universalAdIdString = '';
        tracking_classPrivateFieldGet(tracking_rmpVast, this).creative.universalAdIds.forEach((universalAdId, index) => {
          if (index !== 0 || index !== tracking_classPrivateFieldGet(tracking_rmpVast, this).creative.universalAdIds.length - 1) {
            universalAdIdString += ',';
          }
          universalAdIdString += universalAdId.idRegistry + ' ' + universalAdId.value;
        });
        finalString = finalString.replace(pattern10, encodeURIComponent(universalAdIdString));
      }
      const pattern22 = /\[ASSETURI\]/gi;
      const assetUri = tracking_classPrivateFieldGet(tracking_rmpVast, this).adMediaUrl;
      if (pattern22.test(finalString) && typeof assetUri === 'string' && assetUri !== '') {
        finalString = finalString.replace(pattern22, encodeURIComponent(assetUri));
      }
      const pattern23 = /\[PODSEQUENCE\]/gi;
      if (pattern23.test(finalString) && tracking_classPrivateFieldGet(tracking_rmpVast, this).ad.sequence) {
        finalString = finalString.replace(pattern23, encodeURIComponent(tracking_classPrivateFieldGet(tracking_rmpVast, this).ad.sequence.toString()));
      }
      const pattern24 = /\[ADSERVINGID\]/gi;
      if (pattern24.test(finalString) && tracking_classPrivateFieldGet(tracking_rmpVast, this).ad.adServingId) {
        finalString = finalString.replace(pattern24, encodeURIComponent(tracking_classPrivateFieldGet(tracking_rmpVast, this).ad.adServingId));
      }
    } else {
      const pattern6 = /\[ADCATEGORIES\]/gi;
      if (pattern6.test(finalString) && tracking_classPrivateFieldGet(tracking_rmpVast, this).ad.categories.length > 0) {
        const categories = tracking_classPrivateFieldGet(tracking_rmpVast, this).ad.categories.map(categorie => categorie.value).join(',');
        finalString = finalString.replace(pattern6, encodeURIComponent(categories));
      }
      const pattern7 = /\[BLOCKEDADCATEGORIES\]/gi;
      if (pattern7.test(finalString) && tracking_classPrivateFieldGet(tracking_rmpVast, this).ad.blockedAdCategories.length > 0) {
        const blockedAdCategories = tracking_classPrivateFieldGet(tracking_rmpVast, this).ad.blockedAdCategories.map(blockedAdCategories => blockedAdCategories.value).join(',');
        finalString = finalString.replace(pattern7, encodeURIComponent(blockedAdCategories));
      }
      const pattern15 = /\[VASTVERSIONS\]/gi;
      if (pattern15.test(finalString)) {
        finalString = finalString.replace(pattern15, '2,3,5,6,7,8,11,12,13,14');
      }
      const pattern16 = /\[APIFRAMEWORKS\]/gi;
      if (pattern16.test(finalString)) {
        finalString = finalString.replace(pattern16, '2,7,8,9');
      }
      const pattern17 = /\[MEDIAMIME\]/gi;
      const mediaMime = ['video/webm', 'video/mp4', 'video/ogg', 'video/3gpp', 'application/vnd.apple.mpegurl', 'application/dash+xml'];
      if (pattern17.test(finalString)) {
        let mimeTyepString = '';
        mediaMime.forEach(value => {
          if (value === 'application/vnd.apple.mpegurl') {
            if (Environment.checkCanPlayType(value) || tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastLinearCreative.readingHlsJS) {
              mimeTyepString += value + ',';
            }
          } else if (Environment.checkCanPlayType(value)) {
            mimeTyepString += value + ',';
          }
        });
        if (mimeTyepString) {
          mimeTyepString = mimeTyepString.slice(0, -1);
          finalString = finalString.replace(pattern17, encodeURIComponent(mimeTyepString));
        }
      }
      const pattern20 = /\[PLAYERSTATE\]/gi;
      if (pattern20.test(finalString)) {
        let playerState = '';
        if (tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastContentPlayer.muted) {
          playerState += 'muted';
        }
        if (tracking_classPrivateFieldGet(tracking_rmpVast, this).isInFullscreen) {
          if (playerState) {
            playerState += ',';
          }
          playerState += 'fullscreen';
        }
        finalString = finalString.replace(pattern20, playerState);
      }
    }
    const pattern25 = /\[LIMITADTRACKING\]/gi;
    const regulationsInfo = tracking_classPrivateFieldGet(tracking_rmpVast, this).regulationsInfo;
    if (pattern25.test(finalString) && regulationsInfo.limitAdTracking) {
      finalString = finalString.replace(pattern25, encodeURIComponent(regulationsInfo.limitAdTracking));
    }
    const pattern26 = /\[REGULATIONS\]/gi;
    if (pattern26.test(finalString) && regulationsInfo.regulations) {
      finalString = finalString.replace(pattern26, encodeURIComponent(regulationsInfo.regulations));
    }
    const pattern27 = /\[GDPRCONSENT\]/gi;
    if (pattern27.test(finalString) && regulationsInfo.gdprConsent) {
      finalString = finalString.replace(pattern27, encodeURIComponent(regulationsInfo.gdprConsent));
    }
    return finalString;
  }
  pingURI(url) {
    const trackingUrl = this.replaceMacros(url, true);
    tracking_assertClassBrand(_Tracking_brand, this, _ping).call(this, trackingUrl);
  }
  error(errorCode) {
    // for each Error tag within an InLine or chain of Wrapper ping error URL
    let errorTags = tracking_classPrivateFieldGet(tracking_rmpVast, this).adErrorTags;
    if (errorCode === 303 && tracking_classPrivateFieldGet(tracking_rmpVast, this).vastErrorTags.length > 0) {
      // here we ping vastErrorTags with error code 303 according to spec
      // concat array thus
      errorTags = [...errorTags, ...tracking_classPrivateFieldGet(tracking_rmpVast, this).vastErrorTags];
    }
    if (errorTags.length > 0) {
      errorTags.forEach(errorTag => {
        if (errorTag.url) {
          let errorUrl = errorTag.url;
          const errorRegExp = /\[ERRORCODE\]/gi;
          if (errorRegExp.test(errorUrl) && FW.isNumber(errorCode) && errorCode > 0 && errorCode < 1000) {
            errorUrl = errorUrl.replace(errorRegExp, errorCode);
          }
          tracking_assertClassBrand(_Tracking_brand, this, _ping).call(this, errorUrl);
        }
      });
    }
  }
  reset() {
    tracking_classPrivateFieldSet(_onPauseFn, this, null);
    tracking_classPrivateFieldSet(_onPlayFn, this, null);
    tracking_classPrivateFieldSet(_onPlayingFn, this, null);
    tracking_classPrivateFieldSet(_onEndedFn, this, null);
    tracking_classPrivateFieldSet(_onVolumeChangeFn, this, null);
    tracking_classPrivateFieldSet(_onTimeupdateFn, this, null);
    tracking_classPrivateFieldSet(_firstQuartileEventFired, this, false);
    tracking_classPrivateFieldSet(_midpointEventFired, this, false);
    tracking_classPrivateFieldSet(_thirdQuartileEventFired, this, false);
  }
  dispatchTrackingAndApiEvent(apiEvent) {
    if (Array.isArray(apiEvent)) {
      apiEvent.forEach(currentApiEvent => {
        tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastUtils.createApiEvent(currentApiEvent);
        tracking_assertClassBrand(_Tracking_brand, this, _dispatchTracking).call(this, tracking_classPrivateFieldGet(_trackingApiEventMap, this).get(currentApiEvent));
      });
    } else {
      tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastUtils.createApiEvent(apiEvent);
      tracking_assertClassBrand(_Tracking_brand, this, _dispatchTracking).call(this, tracking_classPrivateFieldGet(_trackingApiEventMap, this).get(apiEvent));
    }
  }
  destroy() {
    if (tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer) {
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.removeEventListener('pause', tracking_classPrivateFieldGet(_onPauseFn, this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.removeEventListener('play', tracking_classPrivateFieldGet(_onPlayFn, this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.removeEventListener('playing', tracking_classPrivateFieldGet(_onPlayingFn, this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.removeEventListener('ended', tracking_classPrivateFieldGet(_onEndedFn, this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.removeEventListener('volumechange', tracking_classPrivateFieldGet(_onVolumeChangeFn, this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.removeEventListener('timeupdate', tracking_classPrivateFieldGet(_onTimeupdateFn, this));
    }
  }
  wire() {
    // we filter through all HTML5 video events and create new VAST events 
    if (tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer && tracking_classPrivateFieldGet(tracking_rmpVast, this).creative.isLinear && !tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastVpaidPlayer) {
      tracking_classPrivateFieldSet(_onPauseFn, this, tracking_assertClassBrand(_Tracking_brand, this, _onPause).bind(this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.addEventListener('pause', tracking_classPrivateFieldGet(_onPauseFn, this));
      tracking_classPrivateFieldSet(_onPlayFn, this, tracking_assertClassBrand(_Tracking_brand, this, _onPlay).bind(this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.addEventListener('play', tracking_classPrivateFieldGet(_onPlayFn, this));
      tracking_classPrivateFieldSet(_onPlayingFn, this, tracking_assertClassBrand(_Tracking_brand, this, _onPlaying).bind(this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.addEventListener('playing', tracking_classPrivateFieldGet(_onPlayingFn, this), {
        once: true
      });
      tracking_classPrivateFieldSet(_onEndedFn, this, tracking_assertClassBrand(_Tracking_brand, this, _onEnded).bind(this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.addEventListener('ended', tracking_classPrivateFieldGet(_onEndedFn, this), {
        once: true
      });
      tracking_classPrivateFieldSet(_onVolumeChangeFn, this, tracking_assertClassBrand(_Tracking_brand, this, _onVolumeChange).bind(this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.addEventListener('volumechange', tracking_classPrivateFieldGet(_onVolumeChangeFn, this));
      tracking_classPrivateFieldSet(_onTimeupdateFn, this, tracking_assertClassBrand(_Tracking_brand, this, _onTimeupdate).bind(this));
      tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.addEventListener('timeupdate', tracking_classPrivateFieldGet(_onTimeupdateFn, this));
    }
  }
}
function _createTrackingApiEventMap() {
  // ViewableImpression
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adviewable', 'viewable');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adviewundetermined', 'viewundetermined');
  // Tracking Event Elements
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('advolumemuted', 'mute');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('advolumeunmuted', 'unmute');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adpaused', 'pause');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adresumed', 'resume');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adskipped', 'skip');
  // VAST 4 events
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adplayerexpand', 'playerExpand');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adplayercollapse', 'playerCollapse');
  // VAST 3 events
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adfullscreen', 'fullscreen');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adexitfullscreen', 'exitFullscreen');
  // Linear Ad Metrics
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adloaded', 'loaded');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adstarted', 'start');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adfirstquartile', 'firstQuartile');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('admidpoint', 'midpoint');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adthirdquartile', 'thirdQuartile');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adcomplete', 'complete');
  // tracking progress event happens in #onTimeupdate
  // InLine > Impression
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adimpression', 'impression');

  // creativeView for companion ads happens in getCompanionAd (index.js)
  // creativeView tracking needs to happen for linear creative as well (support for VAST 3)
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adcreativeview', 'creativeView');

  // for non-linear and VPAID only
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adcollapse', 'adCollapse');

  // only support for VPAID - PR welcome for non-linear
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('aduseracceptinvitation', 'acceptInvitation');
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adclosed', 'close');
  // VideoClicks > ClickThrough
  tracking_classPrivateFieldGet(_trackingApiEventMap, this).set('adclick', 'clickthrough');

  // Need to investigate overlayViewDuration (non-linear) - interactiveStart (SIMID) further
}
function _dispatch(event) {
  Logger.print(tracking_classPrivateFieldGet(tracking_rmpVast, this).debugRawConsoleLogs, `ping tracking for ${event} VAST event`);
  // filter trackers - may return multiple urls for same event as allowed by VAST spec
  const trackers = tracking_classPrivateFieldGet(tracking_rmpVast, this).trackingTags.filter(value => {
    return event === value.event;
  });
  // send ping for each valid tracker
  if (trackers.length > 0) {
    trackers.forEach(element => {
      this.pingURI(element.url);
    });
  }
}
function _ping(url) {
  // we expect an image format for the tracker (generally a 1px GIF/PNG/JPG/AVIF) or JavaScript as 
  // those are the most common format in the industry 
  // other format may produce errors and the related tracker may not be requested properly
  const jsPattern = /\.js$/i;
  if (jsPattern.test(url)) {
    const script = document.createElement('script');
    script.src = url;
    try {
      document.head.appendChild(script);
    } catch (error) {
      console.warn(error);
      document.body.appendChild(script);
    }
  } else {
    FW.ajax(url, tracking_classPrivateFieldGet(tracking_rmpVast, this).params.ajaxTimeout, false, 'GET').then(() => {
      Logger.print(tracking_classPrivateFieldGet(tracking_rmpVast, this).debugRawConsoleLogs, `VAST tracker successfully loaded ${url}`);
    }).catch(error => {
      console.warn(error);
    });
  }
}
function _onVolumeChange() {
  if (tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer) {
    const muted = tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.muted;
    const volume = tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.volume;
    if (muted || volume === 0) {
      this.dispatchTrackingAndApiEvent('advolumemuted');
    } else if (!muted && volume > 0) {
      this.dispatchTrackingAndApiEvent('advolumeunmuted');
    }
    tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastUtils.createApiEvent('advolumechanged');
  }
}
function _onTimeupdate() {
  let adPlayerDuration = -1;
  let adPlayerCurrentTime = -1;
  if (tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastAdPlayer) {
    adPlayerCurrentTime = tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastAdPlayer.currentTime;
    adPlayerDuration = tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastAdPlayer.duration;
  }
  if (adPlayerCurrentTime > 0) {
    if (adPlayerDuration > 0 && adPlayerDuration > adPlayerCurrentTime) {
      if (adPlayerCurrentTime >= adPlayerDuration * 0.25 && !tracking_classPrivateFieldGet(_firstQuartileEventFired, this)) {
        tracking_classPrivateFieldSet(_firstQuartileEventFired, this, true);
        this.dispatchTrackingAndApiEvent('adfirstquartile');
      } else if (adPlayerCurrentTime >= adPlayerDuration * 0.5 && !tracking_classPrivateFieldGet(_midpointEventFired, this)) {
        tracking_classPrivateFieldSet(_midpointEventFired, this, true);
        this.dispatchTrackingAndApiEvent('admidpoint');
      } else if (adPlayerCurrentTime >= adPlayerDuration * 0.75 && !tracking_classPrivateFieldGet(_thirdQuartileEventFired, this)) {
        tracking_classPrivateFieldSet(_thirdQuartileEventFired, this, true);
        this.dispatchTrackingAndApiEvent('adthirdquartile');
      }
    }
    // progress event
    if (tracking_classPrivateFieldGet(tracking_rmpVast, this).progressEvents.length > 0) {
      if (adPlayerCurrentTime > tracking_classPrivateFieldGet(tracking_rmpVast, this).progressEvents[0].time) {
        const filterProgressEvent = tracking_classPrivateFieldGet(tracking_rmpVast, this).progressEvents.filter(progressEvent => {
          return progressEvent.time === tracking_classPrivateFieldGet(tracking_rmpVast, this).progressEvents[0].time;
        });
        filterProgressEvent.forEach(progressEvent => {
          if (progressEvent.url) {
            this.pingURI(progressEvent.url);
          }
        });
        tracking_classPrivateFieldGet(tracking_rmpVast, this).progressEvents.shift();
        tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastUtils.createApiEvent('adprogress');
      }
    }
  }
}
function _onPause() {
  if (tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer && tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.paused) {
    const currentTime = tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.currentTime;
    const currentDuration = tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.duration;
    // we have reached end of linear creative - a HTML5 video pause event may fire just before ended event
    // in this case we ignore the adpaused event as adcomplete prevails
    if (currentTime === currentDuration) {
      return;
    }
    this.dispatchTrackingAndApiEvent('adpaused');
  }
}
function _onPlay() {
  if (tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer && !tracking_classPrivateFieldGet(tracking_rmpVast, this).currentAdPlayer.paused) {
    this.dispatchTrackingAndApiEvent('adresumed');
  }
}
function _onPlaying() {
  this.dispatchTrackingAndApiEvent(['adimpression', 'adcreativeview', 'adstarted']);
}
function _onEnded() {
  this.dispatchTrackingAndApiEvent('adcomplete');
  if (tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastAdPlayer) {
    tracking_classPrivateFieldGet(tracking_rmpVast, this).rmpVastAdPlayer.resumeContent();
  }
}
function _dispatchTracking(event) {
  if (Array.isArray(event)) {
    event.forEach(currentEvent => {
      tracking_assertClassBrand(_Tracking_brand, this, _dispatch).call(this, currentEvent);
    });
  } else {
    tracking_assertClassBrand(_Tracking_brand, this, _dispatch).call(this, event);
  }
}
// EXTERNAL MODULE: ./node_modules/core-js-pure/stable/instance/sort.js
var sort = __webpack_require__(1086);
var sort_default = /*#__PURE__*/__webpack_require__.n(sort);
;// ./src/js/creatives/icons.js



function icons_classPrivateMethodInitSpec(e, a) { icons_checkPrivateRedeclaration(e, a), a.add(e); }
function icons_classPrivateFieldInitSpec(e, t, a) { icons_checkPrivateRedeclaration(e, t), t.set(e, a); }
function icons_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function icons_classPrivateFieldGet(s, a) { return s.get(icons_assertClassBrand(s, a)); }
function icons_classPrivateFieldSet(s, a, r) { return s.set(icons_assertClassBrand(s, a), r), r; }
function icons_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }


var icons_rmpVast = /*#__PURE__*/new (weak_map_default())();
var _adContainer = /*#__PURE__*/new (weak_map_default())();
var _adPlayer = /*#__PURE__*/new (weak_map_default())();
var _onPlayingAppendIconsFn = /*#__PURE__*/new (weak_map_default())();
var _iconsData = /*#__PURE__*/new (weak_map_default())();
var _Icons_brand = /*#__PURE__*/new WeakSet();
class Icons {
  constructor(rmpVast) {
    icons_classPrivateMethodInitSpec(this, _Icons_brand);
    icons_classPrivateFieldInitSpec(this, icons_rmpVast, void 0);
    icons_classPrivateFieldInitSpec(this, _adContainer, void 0);
    icons_classPrivateFieldInitSpec(this, _adPlayer, void 0);
    icons_classPrivateFieldInitSpec(this, _onPlayingAppendIconsFn, null);
    icons_classPrivateFieldInitSpec(this, _iconsData, []);
    icons_classPrivateFieldSet(icons_rmpVast, this, rmpVast);
    icons_classPrivateFieldSet(_adContainer, this, rmpVast.adContainer);
    icons_classPrivateFieldSet(_adPlayer, this, rmpVast.currentAdPlayer);
  }
  get iconsData() {
    return icons_classPrivateFieldGet(_iconsData, this);
  }
  destroy() {
    Logger.print(icons_classPrivateFieldGet(icons_rmpVast, this).debugRawConsoleLogs, `Start destroying icons`);
    const icons = icons_classPrivateFieldGet(_adContainer, this).querySelectorAll('.rmp-ad-container-icons');
    if (icons.length > 0) {
      icons.forEach(icon => {
        FW.removeElement(icon);
      });
    }
    if (icons_classPrivateFieldGet(_adPlayer, this)) {
      icons_classPrivateFieldGet(_adPlayer, this).removeEventListener('playing', icons_classPrivateFieldGet(_onPlayingAppendIconsFn, this));
    }
  }
  parse(icons) {
    Logger.print(icons_classPrivateFieldGet(icons_rmpVast, this).debugRawConsoleLogs, `Start parsing icons`);
    for (let i = 0; i < icons.length; i++) {
      var _context;
      const currentIcon = icons[i];
      const program = currentIcon.program;
      if (program === null) {
        continue;
      }
      const width = currentIcon.width;
      const height = currentIcon.height;
      const xPosition = currentIcon.xPosition;
      const yPosition = currentIcon.yPosition;
      if (width <= 0 || height <= 0 || xPosition < 0 || yPosition < 0) {
        continue;
      }
      const staticResourceUrl = currentIcon.staticResource;
      const iframeResourceUrl = currentIcon.iframeResource;
      const htmlContent = currentIcon.htmlResource;
      // we only support StaticResource (HTMLResource not supported)
      if (staticResourceUrl === null && iframeResourceUrl === null && htmlContent === null) {
        continue;
      }
      const altText = currentIcon.altText;
      const hoverText = currentIcon.hoverText;
      const iconData = {
        program,
        width,
        height,
        xPosition,
        yPosition,
        staticResourceUrl,
        iframeResourceUrl,
        htmlContent,
        altText,
        hoverText
      };
      iconData.iconViewTrackingUrl = currentIcon.iconViewTrackingURLTemplate;
      iconData.iconClickThroughUrl = currentIcon.iconClickThroughURLTemplate;
      iconData.iconClickTrackingUrls = currentIcon.iconClickTrackingURLTemplates;
      push_default()(_context = icons_classPrivateFieldGet(_iconsData, this)).call(_context, iconData);
    }
    Logger.print(icons_classPrivateFieldGet(icons_rmpVast, this).debugRawConsoleLogs, `Validated parsed icons follows`, icons_classPrivateFieldGet(_iconsData, this));
  }
  append() {
    icons_classPrivateFieldSet(_onPlayingAppendIconsFn, this, icons_assertClassBrand(_Icons_brand, this, _onPlayingAppendIcons).bind(this));
    // as per VAST 3 spec only append icon when ad starts playing
    icons_classPrivateFieldGet(_adPlayer, this).addEventListener('playing', icons_classPrivateFieldGet(_onPlayingAppendIconsFn, this), {
      once: true
    });
  }
}
function _onIconClickThrough(index, event) {
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  FW.openWindow(icons_classPrivateFieldGet(_iconsData, this)[index].iconClickThroughUrl);
  // send trackers if any for IconClickTracking
  const iconClickTrackingUrls = icons_classPrivateFieldGet(_iconsData, this)[index].iconClickTrackingUrls;
  if (iconClickTrackingUrls.length > 0) {
    iconClickTrackingUrls.forEach(tracking => {
      if (tracking.url) {
        icons_classPrivateFieldGet(icons_rmpVast, this).rmpVastTracking.pingURI(tracking.url);
      }
    });
  }
  icons_classPrivateFieldGet(icons_rmpVast, this).rmpVastUtils.createApiEvent('adiconclick');
}
function _onIconLoadPingTracking(index) {
  Logger.print(icons_classPrivateFieldGet(icons_rmpVast, this).debugRawConsoleLogs, `IconViewTracking for icon at index ${index}`);
  icons_classPrivateFieldGet(icons_rmpVast, this).rmpVastTracking.pingURI(icons_classPrivateFieldGet(_iconsData, this)[index].iconViewTrackingUrl);
}
function _onPlayingAppendIcons() {
  Logger.print(icons_classPrivateFieldGet(icons_rmpVast, this).debugRawConsoleLogs, `playing states has been reached - append icons`);
  icons_classPrivateFieldGet(_iconsData, this).forEach((iconData, index) => {
    let icon;
    let src;
    if (iconData.staticResourceUrl) {
      icon = document.createElement('img');
      if (iconData.altText) {
        icon.alt = iconData.altText;
      }
      if (iconData.hoverText) {
        icon.title = iconData.hoverText;
      }
      src = iconData.staticResourceUrl;
    } else if (iconData.iframeResourceUrl || iconData.htmlContent) {
      icon = document.createElement('iframe');
      if (iconData.hoverText) {
        icon.title = iconData.hoverText;
      }
      icon.sandbox = 'allow-scripts allow-same-origin';
      if (iconData.htmlContent) {
        src = iconData.htmlContent;
      } else {
        src = iconData.iframeResourceUrl;
      }
      FW.setStyle(icon, {
        border: 'none',
        overflow: 'hidden'
      });
      icon.setAttribute('scrolling', 'no');
      icon.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
      icon.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    }
    icon.className = 'rmp-ad-container-icons';
    FW.setStyle(icon, {
      width: parse_int_default()(iconData.width) + 'px',
      height: parse_int_default()(iconData.height) + 'px'
    });
    const xPosition = iconData.xPosition;
    if (xPosition === 'left') {
      icon.style.left = '0px';
    } else if (xPosition === 'right') {
      icon.style.right = '0px';
    } else if (parse_int_default()(xPosition) >= 0) {
      icon.style.left = xPosition + 'px';
    } else {
      icon.style.left = '0px';
    }
    const yPosition = iconData.yPosition;
    if (yPosition === 'top') {
      icon.style.top = '0px';
    } else if (xPosition === 'bottom') {
      icon.style.bottom = '0px';
    } else if (parse_int_default()(yPosition) >= 0) {
      icon.style.top = yPosition + 'px';
    } else {
      icon.style.top = '0px';
    }
    if (iconData.iconViewTrackingUrl) {
      icon.onload = icons_assertClassBrand(_Icons_brand, this, _onIconLoadPingTracking).bind(this, index);
    }
    if (iconData.iconClickThroughUrl) {
      const onIconClickThroughFn = icons_assertClassBrand(_Icons_brand, this, _onIconClickThrough).bind(this, index);
      FW.addEvents(['touchend', 'click'], icon, onIconClickThroughFn);
    }
    if (iconData.htmlContent) {
      icon.srcdoc = src;
    } else {
      icon.src = src;
    }
    Logger.print(icons_classPrivateFieldGet(icons_rmpVast, this).debugRawConsoleLogs, `Selected icon details follow`, icon);
    icons_classPrivateFieldGet(_adContainer, this).appendChild(icon);
  });
}
;// ./src/assets/rmp-connection/rmp-connection.js
/**
 * @license Copyright (c) 2015-2022 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-connection 2.1.0 | https://github.com/radiantmediaplayer/rmp-connection
 * rmp-connection is released under MIT | https://github.com/radiantmediaplayer/rmp-connection/blob/master/LICENSE
 */

/**
 * The class to instantiate RmpConnection
 * @export
 * @class RmpConnection
*/
class RmpConnection {
  /**
    * @constructor
    */
  constructor() {}

  /**
    * @private
    */
  _getConnectionType() {
    if (typeof navigator.connection.type === 'string' && navigator.connection.type !== '') {
      switch (navigator.connection.type) {
        case 'ethernet':
          return 'ethernet';
        case 'wifi':
        case 'wimax':
        case 'mixed':
        case 'other':
          return 'wifi';
        case 'bluetooth':
        case 'cellular':
          return 'cellular';
        case 'none':
          return 'none';
        default:
          break;
      }
    }
    return 'unknown';
  }

  /**
    * @private
    */
  _getBandwidthEstimate() {
    if (typeof navigator.connection.downlink === 'number' && navigator.connection.downlink > 0) {
      return navigator.connection.downlink;
    } else if (typeof navigator.connection.effectiveType === 'string' && navigator.connection.effectiveType !== '') {
      switch (navigator.connection.effectiveType) {
        case 'slow-2g':
          return 0.025;
        case '2g':
          return 0.035;
        case '3g':
          return 0.35;
        case '4g':
          return 1.4;
        case '5g':
          return 5;
        default:
          break;
      }
    } else if (typeof navigator.connection.type === 'string' && navigator.connection.type !== '') {
      switch (navigator.connection.type) {
        case 'ethernet':
        case 'wifi':
        case 'wimax':
        case 'mixed':
        case 'other':
          return 1.4;
        case 'bluetooth':
        case 'cellular':
          return 0.35;
        case 'none':
          return -1;
        default:
          break;
      }
    }
    return 0.35;
  }

  /** 
   * @typedef {object} BandwidthData
   * @property {number} estimate
   * @property {string} connectionType
   * @return {BandwidthData}
   */
  get bandwidthData() {
    // default return values
    const result = {
      estimate: -1,
      connectionType: 'none'
    };

    // we are offline - exit
    if (typeof navigator.onLine !== 'undefined' && !navigator.onLine) {
      return result;
    }

    // we do not have navigator.connection - exit
    // for support see https://caniuse.com/#feat=netinfo - works everywhere but in Safari && Firefox 
    if (typeof navigator.connection === 'undefined') {
      return {
        estimate: -1,
        connectionType: 'unknown'
      };
    }

    // we return our internal values
    return {
      estimate: this._getBandwidthEstimate(),
      connectionType: this._getConnectionType()
    };
  }
}
// EXTERNAL MODULE: ./node_modules/core-js-pure/stable/instance/includes.js
var includes = __webpack_require__(6343);
var includes_default = /*#__PURE__*/__webpack_require__.n(includes);
// EXTERNAL MODULE: ./node_modules/core-js-pure/stable/instance/starts-with.js
var starts_with = __webpack_require__(2268);
var starts_with_default = /*#__PURE__*/__webpack_require__.n(starts_with);
// EXTERNAL MODULE: ./node_modules/core-js-pure/stable/instance/keys.js
var keys = __webpack_require__(1618);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys);
;// ./src/js/players/simid/simid_protocol.js





/**
 * Contains logic for sending mesages between the SIMID creative and the player.
 * Note: Some browsers do not support promises and a more complete implementation
 *       should consider using a polyfill.
 */

/** Contains all constants common across SIMID */
const ProtocolMessage = {
  CREATE_SESSION: 'createSession',
  RESOLVE: 'resolve',
  REJECT: 'reject'
};
const MediaMessage = {
  DURATION_CHANGE: 'Media:durationchange',
  ENDED: 'Media:ended',
  ERROR: 'Media:error',
  PAUSE: 'Media:pause',
  PLAY: 'Media:play',
  PLAYING: 'Media:playing',
  SEEKED: 'Media:seeked',
  SEEKING: 'Media:seeking',
  TIME_UPDATE: 'Media:timeupdate',
  VOLUME_CHANGE: 'Media:volumechange'
};
const PlayerMessage = {
  RESIZE: 'Player:resize',
  INIT: 'Player:init',
  LOG: 'Player:log',
  START_CREATIVE: 'Player:startCreative',
  AD_SKIPPED: 'Player:adSkipped',
  AD_STOPPED: 'Player:adStopped',
  FATAL_ERROR: 'Player:fatalError'
};

/** Messages from the creative */
const CreativeMessage = {
  CLICK_THRU: 'Creative:clickThru',
  EXPAND_NONLINEAR: 'Creative:expandNonlinear',
  COLLAPSE_NONLINEAR: 'Creative:collapseNonlinear',
  FATAL_ERROR: 'Creative:fatalError',
  GET_MEDIA_STATE: 'Creative:getMediaState',
  LOG: 'Creative:log',
  REQUEST_FULL_SCREEN: 'Creative:requestFullScreen',
  REQUEST_SKIP: 'Creative:requestSkip',
  REQUEST_STOP: 'Creative:requestStop',
  REQUEST_PAUSE: 'Creative:requestPause',
  REQUEST_PLAY: 'Creative:requestPlay',
  REQUEST_RESIZE: 'Creative:requestResize',
  REQUEST_VOLUME: 'Creative:requestVolume',
  REQUEST_TRACKING: 'Creative:reportTracking',
  REQUEST_CHANGE_AD_DURATION: 'Creative:requestChangeAdDuration'
};

/**
 * These messages require a response (either resolve or reject).
 * All other messages do not require a response and are information only.
 */
const EventsThatRequireResponse = [CreativeMessage.GET_MEDIA_STATE, CreativeMessage.REQUEST_VIDEO_LOCATION, CreativeMessage.READY, CreativeMessage.CLICK_THRU, CreativeMessage.REQUEST_SKIP, CreativeMessage.REQUEST_STOP, CreativeMessage.REQUEST_PAUSE, CreativeMessage.REQUEST_PLAY, CreativeMessage.REQUEST_FULL_SCREEN, CreativeMessage.REQUEST_VOLUME, CreativeMessage.REQUEST_RESIZE, CreativeMessage.REQUEST_CHANGE_AD_DURATION, CreativeMessage.REPORT_TRACKING, PlayerMessage.INIT, PlayerMessage.START_CREATIVE, PlayerMessage.AD_SKIPPED, PlayerMessage.AD_STOPPED, PlayerMessage.FATAL_ERROR, ProtocolMessage.CREATE_SESSION];

// A list of errors the creative might send to the player.
const CreativeErrorCode = {
  UNSPECIFIED: 1100,
  CANNOT_LOAD_RESOURCE: 1101,
  PLAYBACK_AREA_UNUSABLE: 1102,
  INCORRECT_VERSION: 1103,
  TECHNICAL_ERROR: 1104,
  EXPAND_NOT_POSSIBLE: 1105,
  PAUSE_NOT_HONORED: 1106,
  PLAYMODE_NOT_ADEQUATE: 1107,
  CREATIVE_INTERNAL_ERROR: 1108,
  DEVICE_NOT_SUPPORTED: 1109,
  MESSAGES_NOT_FOLLOWING_SPEC: 1110,
  PLAYER_RESPONSE_TIMEOUT: 1111
};

// A list of errors the player might send to the creative.
const PlayerErrorCode = {
  UNSPECIFIED: 1200,
  WRONG_VERSION: 1201,
  UNSUPPORTED_TIME: 1202,
  UNSUPPORTED_FUNCTIONALITY_REQUEST: 1203,
  UNSUPPORTED_ACTIONS: 1204,
  POSTMESSAGE_CHANNEL_OVERLOADED: 1205,
  VIDEO_COULD_NOT_LOAD: 1206,
  VIDEO_TIME_OUT: 1207,
  RESPONSE_TIMEOUT: 1208,
  MEDIA_NOT_SUPPORTED: 1209,
  SPEC_NOT_FOLLOWED_ON_INIT: 1210,
  SPEC_NOT_FOLLOWED_ON_MESSAGES: 1211
};

// A list of reasons a player could stop the ad.
const StopCode = {
  UNSPECIFIED: 0,
  USER_INITIATED: 1,
  MEDIA_PLAYBACK_COMPLETE: 2,
  PLAYER_INITATED: 3,
  CREATIVE_INITIATED: 4,
  NON_LINEAR_DURATION_COMPLETE: 5
};
class SimidProtocol {
  constructor() {
    /*
     * A map of messsage type to an array of callbacks.
     * @private {Map<String, Array<Function>>}
     */
    this.listeners_ = {};

    /*
     * The session ID for this protocol.
     * @private {String}
     */
    this.sessionId_ = '';

    /**
     * The next message ID to use when sending a message.
     * @private {number}
     */
    this.nextMessageId_ = 1;

    /**
     * The window where the message should be posted to.
     * @private {!Element}
     */
    this.target_ = window.parent;
    this.resolutionListeners_ = {};
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }

  /* Reverts this protocol to its original state */
  reset() {
    this.listeners_ = {};
    this.sessionId_ = '';
    this.nextMessageId_ = 1;
    // TODO: Perhaps we should reject all associated promises.
    this.resolutionListeners_ = {};
  }

  /**
   * Sends a message using post message.  Returns a promise
   * that will resolve or reject after the message receives a response.
   * @param {string} messageType The name of the message
   * @param {?Object} messageArgs The arguments for the message, may be null.
   * @return {!Promise} Promise that will be fulfilled when client resolves or rejects.
   */
  sendMessage(messageType, messageArgs) {
    // Incrementing between messages keeps each message id unique.
    const messageId = this.nextMessageId_++;
    // Only create session does not need to be in the SIMID name space
    // because it is part of the protocol.
    const nameSpacedMessage = messageType === ProtocolMessage.CREATE_SESSION ? messageType : 'SIMID:' + messageType;
    // The message object as defined by the SIMID spec.
    const message = {
      sessionId: this.sessionId_,
      messageId,
      type: nameSpacedMessage,
      timestamp: Date.now(),
      args: messageArgs
    };
    if (includes_default()(EventsThatRequireResponse).call(EventsThatRequireResponse, messageType)) {
      // If the message requires a callback this code will set
      // up a promise that will call resolve or reject with its parameters.
      return new (promise_default())((resolve, reject) => {
        this.addResolveRejectListener_(messageId, resolve, reject);
        this.target_.postMessage(JSON.stringify(message), '*');
      });
    }
    // A default promise will just resolve immediately.
    // It is assumed no one would listen to these promises, but if they do
    // it will "just work".
    return new (promise_default())(resolve => {
      this.target_.postMessage(JSON.stringify(message), '*');
      resolve();
    });
  }

  /**
   * Adds a listener for a given message.
   */
  addListener(messageType, callback) {
    if (!this.listeners_[messageType]) {
      this.listeners_[messageType] = [callback];
    } else {
      var _context;
      push_default()(_context = this.listeners_[messageType]).call(_context, callback);
    }
  }

  /**
   * Sets up a listener for resolve/reject messages.
   * @private
   */
  addResolveRejectListener_(messageId, resolve, reject) {
    const listener = data => {
      const type = data.type;
      const args = data.args.value;
      if (type === 'resolve') {
        resolve(args);
      } else if (type === 'reject') {
        reject(args);
      }
    };
    this.resolutionListeners_[messageId] = listener.bind(this);
  }

  /**
   * Recieves messages from either the player or creative.
   */
  receiveMessage(event) {
    var _context2;
    if (!event || !event.data) {
      return;
    }
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (error) {
      console.warn(error);
      return;
    }
    if (!data) {
      // If there is no data in the event this is not a SIMID message.
      return;
    }
    const sessionId = data.sessionId;
    const type = data.type;
    // A sessionId is valid in one of two cases:
    // 1. It is not set and the message type is createSession.
    // 2. The session ids match exactly.
    const isCreatingSession = this.sessionId_ === '' && type === ProtocolMessage.CREATE_SESSION;
    const isSessionIdMatch = this.sessionId_ === sessionId;
    const validSessionId = isCreatingSession || isSessionIdMatch;
    if (!validSessionId || type === null) {
      // Ignore invalid messages.
      return;
    }

    // There are 2 types of messages to handle:
    // 1. Protocol messages (like resolve, reject and createSession)
    // 2. Messages starting with SIMID:
    // All other messages are ignored.
    if (includes_default()(_context2 = Object.values(ProtocolMessage)).call(_context2, type)) {
      this.handleProtocolMessage_(data);
    } else if (starts_with_default()(type).call(type, 'SIMID:')) {
      // Remove SIMID: from the front of the message so we can compare them with the map.
      const specificType = type.substr(6);
      const listeners = this.listeners_[specificType];
      if (listeners) {
        listeners.forEach(listener => listener(data));
      }
    }
  }

  /**
   * Handles incoming messages specifically for the protocol
   * @param {!Object} data Data passed back from the message
   * @private
   */
  handleProtocolMessage_(data) {
    const type = data.type;
    let listeners, args, correlatingId, resolutionFunction;
    switch (type) {
      case ProtocolMessage.CREATE_SESSION:
        this.sessionId_ = data.sessionId;
        this.resolve(data);
        listeners = this.listeners_[type];
        if (listeners) {
          // calls each of the listeners with the data.
          listeners.forEach(listener => listener(data));
        }
        break;
      case ProtocolMessage.RESOLVE:
      // intentional fallthrough
      case ProtocolMessage.REJECT:
        args = data.args;
        correlatingId = args.messageId;
        resolutionFunction = this.resolutionListeners_[correlatingId];
        if (resolutionFunction) {
          // If the listener exists call it once only.
          resolutionFunction(data);
          delete this.resolutionListeners_[correlatingId];
        }
        break;
    }
  }

  /**
   * Resolves an incoming message.
   * @param {!Object} incomingMessage the message that is being resolved.
   * @param {!Object} outgoingArgs Any arguments that are part of the resolution.
   */
  resolve(incomingMessage, outgoingArgs) {
    const messageId = this.nextMessageId_++;
    const resolveMessageArgs = {
      messageId: incomingMessage.messageId,
      value: outgoingArgs
    };
    const message = {
      sessionId: this.sessionId_,
      messageId,
      type: ProtocolMessage.RESOLVE,
      timestamp: Date.now(),
      args: resolveMessageArgs
    };
    this.target_.postMessage(JSON.stringify(message), '*');
  }

  /**
   * Rejects an incoming message.
   * @param {!Object} incomingMessage the message that is being resolved.
   * @param {!Object} outgoingArgs Any arguments that are part of the resolution.
   */
  reject(incomingMessage, outgoingArgs) {
    const messageId = this.nextMessageId_++;
    const rejectMessageArgs = {
      messageId: incomingMessage.messageId,
      value: outgoingArgs
    };
    const message = {
      sessionId: this.sessionId_,
      messageId,
      type: ProtocolMessage.REJECT,
      timestamp: Date.now(),
      args: rejectMessageArgs
    };
    this.target_.postMessage(JSON.stringify(message), '*');
  }

  /**
   * Creates a new session.
   * @param {String} sessionId
   * @return {!Promise} The promise from the create session message.
   */
  createSession() {
    const sessionCreationResolved = () => {
      console.log(`SIMID: Session created`);
    };
    const sessionCreationRejected = () => {
      // If this ever happens, it may be impossible for the ad
      // to ever communicate with the player.
      console.log(`SIMID: Session creation was rejected`);
    };
    this.generateSessionId_();
    this.sendMessage(ProtocolMessage.CREATE_SESSION).then(sessionCreationResolved, sessionCreationRejected);
  }

  /**
   * Sets the session ID, this should only be used on session creation.
   * @private
   */
  generateSessionId_() {
    var _context3;
    // This function generates a random v4 UUID. In a v4 UUID, of the format
    // xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx, all bits are selected randomly,
    // except the bits of 'M', which must be equal to 4, and 'N', whose first 2
    // most significant bits must be set to 10b. So in total only 122 of the 128
    // bits are random. See
    // https://en.wikipedia.org/wiki/Universally_unique_identifier for more.

    // crypto.getRandomValues is preferred over crypto.randomUUID since it
    // supports much older browsers including IE, and doesn't require a secure
    // context.

    // Create 128 random bits (8-bit * 16).
    const random16Uint8s = new Uint8Array(16);
    window.crypto.getRandomValues(random16Uint8s);
    // Split each 8-bit int into two 4-bit ints (4-bit * 32).
    const random32Uint4s = Array.from(keys_default()(_context3 = Array(32)).call(_context3)).map(index => {
      const isEven = index % 2 === 0;
      const randomUint8 = random16Uint8s[Math.floor(index / 2)];
      // Pick the high 4 bits for even indices, the low 4 bits for odd.
      return isEven ? randomUint8 >> 4 : randomUint8 & 15;
    });

    // Fix the 12th digit to 4 for the UUID version.
    random32Uint4s[12] = 4;
    // Fix the 16th digit's 2 high bits to 10b for UUID variant 1.
    random32Uint4s[16] = 0b1000 | random32Uint4s[16] & 0b0011;
    const hexDigits = random32Uint4s.map(v => v.toString(16));
    const uuidComponents = [hexDigits.slice(0, 8).join(''), hexDigits.slice(8, 12).join(''), hexDigits.slice(12, 16).join(''), hexDigits.slice(16, 20).join(''), hexDigits.slice(20).join('')];
    const uuid = uuidComponents.join('-');
    this.sessionId_ = uuid;
  }
  setMessageTarget(target) {
    this.target_ = target;
  }
}

;// ./src/js/players/simid/simid_player.js


// TODO
// Check fullscreen management
// Check common error and error code reporting
// Add non-linear support
// Check mid-post-roll/adpod support
// Evalaute iOS support



const NO_REQUESTED_DURATION = 0;
const UNLIMITED_DURATION = -2;

/** 
 * All the logic for a simple SIMID player
 */
class SimidPlayer {
  /**
   * Sets up the creative iframe and starts listening for messages
   * from the creative.
   */
  constructor(url, rmpVast) {
    /**
     * The protocol for sending and receiving messages.
     * @protected {!SimidProtocol}
     */
    this.simidProtocol = new SimidProtocol();
    this.addListeners_();
    this.rmpVast_ = rmpVast;
    this.simidData_ = rmpVast.creative.simid;
    this.adContainer_ = rmpVast.adContainer;
    this.playerDiv_ = rmpVast.contentWrapper;
    this.adPlayerUrl_ = url;
    this.adParameters_ = rmpVast.creative.simid.adParameters;
    this.adId_ = rmpVast.creative.adId;
    this.creativeId_ = rmpVast.creative.id;
    this.adServingId_ = rmpVast.ad.adServingId;
    this.clickThroughUrl_ = rmpVast.creative.clickThroughUrl;

    /**
     * A reference to the video player on the players main page
     * @private {!Element}
     */
    this.contentVideoElement_ = rmpVast.currentContentPlayer;

    /**
     * A reference to a video player for playing ads.
     * @private {!Element}
     */
    this.adVideoElement_ = rmpVast.currentAdPlayer;

    /**
     * A reference to the iframe holding the SIMID creative.
     * @private {?Element}
     */
    this.simidIframe_ = null;

    /**
     * A reference to the promise returned when initialization was called.
     * @private {?Promise}
     */
    this.initializationPromise_ = null;

    /**
     * A map of events tracked on the ad video element.
     * @private {!Map}
     */
    this.adVideoTrackingEvents_ = new Map();

    /**
     * A map of events tracked on the content video element.
     * @private {!Map}
     */
    this.contentVideoTrackingEvents_ = new Map();

    /**
     * A boolean indicating what type of creative ad is.
     * @const @private {boolean}
     */
    this.isLinearAd_ = rmpVast.creative.isLinear;

    /**
     * A number indicating when the non linear ad started.
     * @private {?number}
     */
    this.nonLinearStartTime_ = null;

    /**
     * The duration requested by the ad.
     * @private {number}
     */
    this.requestedDuration_ = NO_REQUESTED_DURATION;

    /**
     * Resolution function for the session created message
     * @private {?Function}
     */
    this.resolveSessionCreatedPromise_ = null;

    /**
     * A promise that resolves once the creative creates a session.
     * @private {!Promise}
     */
    this.sessionCreatedPromise_ = new (promise_default())(resolve => {
      this.resolveSessionCreatedPromise_ = resolve;
    });

    /**
     * Resolution function for the ad being initialized.
     * @private {?Function}
     */
    this.resolveInitializationPromise_ = null;

    /**
     * Reject function for the ad being initialized.
     * @private {?Function}
     */
    this.rejectInitializationPromise_ = null;

    /**
     * An object containing the resized nonlinear creative's dimensions.
     * @private {?Object}
     */
    this.nonLinearDimensions_ = null;

    /** The unique ID for the interval used to compares the requested change 
     *  duration and the current ad time.
     * @private {number}
     */
    this.durationInterval_ = null;

    /**
     * A promise that resolves once the creative responds to initialization with resolve.
     * @private {!Promise}
     */
    this.initializationPromise_ = new (promise_default())((resolve, reject) => {
      this.resolveInitializationPromise_ = resolve;
      this.rejectInitializationPromise_ = reject;
    });
    this.trackEventsOnAdVideoElement_();
    this.trackEventsOnContentVideoElement_();
    this.hideAdPlayer_();
    Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: player created`);
  }

  /**
   * Initializes an ad. This should be called before an ad plays.
   * Creates an iframe with the creative in it, then uses a promise
   * to call init on the creative as soon as the creative initializes
   * a session.
   */
  initializeAd() {
    if (!this.isLinearAd_ && !this.isValidDimensions_(this.getNonlinearDimensions_())) {
      Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: Unable to play a non-linear ad with dimensions bigger than the player. Please modify dimensions to a smaller size.`);
      return;
    }

    // After the iframe is created the player will wait until the ad
    // initializes the communication channel. Then it will call
    // sendInitMessage.
    this.simidIframe_ = this.createSimidIframe_();
    if (!this.isLinearAd_) {
      this.displayNonlinearCreative_();
    }
    this.requestDuration_ = NO_REQUESTED_DURATION;

    // Prepare for the case that init fails before sending
    // the init message. Initialization failing means abandoning
    // the ad.
    this.initializationPromise_.catch(error => {
      this.onAdInitializedFailed_(error);
    });

    // Using a promise means that the init message will
    // send as soon as the session is created. If the session
    // is already created this will send the init message immediately.
    this.sessionCreatedPromise_.then(() => {
      this.sendInitMessage_();
    });
    Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: initializeAd`);
  }

  /**
   * Plays a SIMID  creative once it has responded to the initialize ad message.
   */
  playAd() {
    // This example waits for the ad to be initialized, before playing video.
    // NOTE: Not all players will wait for session creation and initialization
    // before they start playback.
    this.initializationPromise_.then(() => {
      this.startCreativePlayback_();
    }).catch(error => {
      console.warn(error);
    });
  }

  /** Plays the video ad element. */
  playAdVideo() {
    this.adVideoElement_.play();
  }

  /**
   * Sets up an iframe for holding the simid element.
   *
   * @return {!Element} The iframe where the simid element lives.
   * @private
   */
  createSimidIframe_() {
    const simidIframe = document.createElement('iframe');
    simidIframe.style.display = 'none';
    // The target of the player to send messages to is the newly
    // created iframe.
    this.playerDiv_.appendChild(simidIframe);
    if (this.isLinearAd_) {
      // Set up css to overlay the SIMID iframe over the entire video creative
      // only if linear. Non-linear ads will have dimension inputs for placement
      simidIframe.classList.add('rmp-linear-simid-creative');
    }
    this.simidProtocol.setMessageTarget(simidIframe.contentWindow);
    simidIframe.setAttribute('allowFullScreen', '');
    simidIframe.setAttribute('allow', 'geolocation');
    simidIframe.src = this.simidData_.fileURL;
    return simidIframe;
  }

  /**
   * Listens to all relevant messages from the SIMID add.
   * @private
   */
  addListeners_() {
    this.simidProtocol.addListener(ProtocolMessage.CREATE_SESSION, this.onSessionCreated_.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_FULL_SCREEN, this.onRequestFullScreen.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_PLAY, this.onRequestPlay.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_PAUSE, this.onRequestPause.bind(this));
    this.simidProtocol.addListener(CreativeMessage.FATAL_ERROR, this.onCreativeFatalError.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_SKIP, this.onRequestSkip.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_STOP, this.onRequestStop.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_CHANGE_AD_DURATION, this.onRequestChangeAdDuration.bind(this));
    this.simidProtocol.addListener(CreativeMessage.GET_MEDIA_STATE, this.onGetMediaState.bind(this));
    this.simidProtocol.addListener(CreativeMessage.LOG, this.onReceiveCreativeLog.bind(this));
    this.simidProtocol.addListener(CreativeMessage.EXPAND_NONLINEAR, this.onExpandResize.bind(this));
    this.simidProtocol.addListener(CreativeMessage.COLLAPSE_NONLINEAR, this.onCollapse.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_RESIZE, this.onRequestResize.bind(this));
  }

  /**
   * Resolves the session created promise.
   * @private
   */
  onSessionCreated_() {
    // Anything that must happen after the session is created can now happen
    // since this promise is resolved.
    this.resolveSessionCreatedPromise_();
  }

  /**
   * Destroys the existing simid iframe.
   * @private
   */
  destroySimidIframe_() {
    if (this.simidIframe_) {
      this.simidIframe_.remove();
      this.simidIframe_ = null;
      this.simidProtocol.reset();
    }
    for (let [key, func] of this.adVideoTrackingEvents_) {
      this.adVideoElement_.removeEventListener(key, func, true);
    }
    for (let [key, func] of this.contentVideoTrackingEvents_) {
      this.contentVideoElement_.removeEventListener(key, func, true);
    }
    this.adVideoTrackingEvents_.clear();
    this.contentVideoTrackingEvents_.clear();
  }

  /**
   * Returns the full dimensions of an element within the player div.
   * @private
   * @return {!Object}
   */
  // eslint-disable-next-line
  getFullDimensions_(elem) {
    const videoRect = elem.getBoundingClientRect();
    return {
      x: 0,
      y: 0,
      width: videoRect.width,
      height: videoRect.height
    };
  }

  /**
   * Checks whether the input dimensions are valid and fit in the player window.
   * @private
   * @param {!Object} dimensions A dimension that contains x, y, width & height fields.
   * @return {boolean}
   */
  isValidDimensions_(dimensions) {
    const playerRect = this.playerDiv_.getBoundingClientRect();
    const heightFits = parse_int_default()(dimensions.y) + parse_int_default()(dimensions.height) <= parse_int_default()(playerRect.height);
    const widthFits = parse_int_default()(dimensions.x) + parse_int_default()(dimensions.width) <= parse_int_default()(playerRect.width);
    return heightFits && widthFits;
  }

  /**
   * Returns the specified dimensions of the non-linear creative.
   * @private
   * @return {!Object}
   */
  getNonlinearDimensions_() {
    if (this.nonLinearDimensions_) {
      return this.nonLinearDimensions_;
    }
    let newDimensions = {};
    newDimensions.x = document.getElementById('x_val').value;
    newDimensions.y = document.getElementById('y_val').value;
    newDimensions.width = document.getElementById('width').value;
    newDimensions.height = document.getElementById('height').value;
    return newDimensions;
  }

  /** 
   * Validates and displays the non-linear creative.
   * @private
   */
  displayNonlinearCreative_() {
    const newDimensions = this.getNonlinearDimensions_();
    if (!this.isValidDimensions_(newDimensions)) {
      Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: Unable to play a non-linear ad with dimensions bigger than the player. Please modify dimensions to a smaller size.`);
      return;
    } else {
      this.setSimidIframeDimensions_(newDimensions);
      this.simidIframe_.style.position = 'absolute';
      this.contentVideoElement_.play();
      const nonLinearDuration = document.getElementById('duration').value;
      this.requestedDuration_ = nonLinearDuration;
    }
  }

  /**
   * Changes the simid iframe dimensions to the given dimensions.
   * @private
   * @param {!Object} resizeDimensions A dimension that contains an x,y,width & height fields.
   */
  setSimidIframeDimensions_(resizeDimensions) {
    this.simidIframe_.style.height = resizeDimensions.height;
    this.simidIframe_.style.width = resizeDimensions.width;
    this.simidIframe_.style.left = `${resizeDimensions.x}px`;
    this.simidIframe_.style.top = `${resizeDimensions.y}px`;
  }

  /** 
   * The creative wants to expand the ad.
   * @param {!Object} incomingMessage Message sent from the creative to the player
   */
  onExpandResize(incomingMessage) {
    if (this.isLinearAd_) {
      const errorMessage = {
        errorCode: CreativeErrorCode.EXPAND_NOT_POSSIBLE,
        message: 'Linear resize not yet supported.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
      Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: ${errorMessage.message}`);
    } else {
      const fullDimensions = this.getFullDimensions_(this.contentVideoElement_);
      this.setSimidIframeDimensions_(fullDimensions);
      this.contentVideoElement_.pause();
      this.simidProtocol.resolve(incomingMessage);
    }
  }

  /** 
   * The creative wants to collapse the ad. 
   * @param {!Object} incomingMessage Message sent from the creative to the player
   */
  onCollapse(incomingMessage) {
    const newDimensions = this.getNonlinearDimensions_();
    if (this.isLinearAd_) {
      const errorMessage = {
        message: 'Cannot collapse linear ads.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
      Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: ${errorMessage.message}`);
    } else if (!this.isValidDimensions_(newDimensions)) {
      const errorMessage = {
        message: 'Unable to collapse to dimensions bigger than the player. Please modify dimensions to a smaller size.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
      Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: ${errorMessage.message}`);
    } else {
      this.setSimidIframeDimensions_(newDimensions);
      this.simidIframe_.style.position = 'absolute';
      this.contentVideoElement_.play();
      this.simidProtocol.resolve(incomingMessage);
    }
  }

  /**
   * The creative wants to resize the ad.
   * @param {!Object} incomingMessage Message sent from the creative to the player.
   */
  onRequestResize(incomingMessage) {
    if (this.isLinearAd_) {
      const errorMessage = {
        errorCode: CreativeErrorCode.EXPAND_NOT_POSSIBLE,
        message: 'Linear resize not yet supported.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
      Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: ${errorMessage.message}`);
    } else if (!this.isValidDimensions_(incomingMessage.args.creativeDimensions)) {
      const errorMessage = {
        errorCode: CreativeErrorCode.EXPAND_NOT_POSSIBLE,
        message: 'Unable to resize a non-linear ad with dimensions bigger than the player. Please modify dimensions to a smaller size.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
      Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: ${errorMessage.message}`);
    } else {
      this.nonLinearDimensions_ = incomingMessage.args.creativeDimensions;
      this.setSimidIframeDimensions_(incomingMessage.args.creativeDimensions);
      this.simidProtocol.resolve(incomingMessage);
    }
  }

  /**
   * Initializes the SIMID creative with all data it needs.
   * @private
   */
  sendInitMessage_() {
    const videoDimensions = this.getFullDimensions_(this.contentVideoElement_);
    // Since the creative starts as hidden it will take on the
    // video element dimensions, so tell the ad about those dimensions.
    const creativeDimensions = this.isLinearAd_ ? this.getFullDimensions_(this.contentVideoElement_) : this.getNonlinearDimensions_();
    const environmentData = {
      videoDimensions,
      creativeDimensions,
      fullscreen: false,
      fullscreenAllowed: true,
      variableDurationAllowed: true,
      skippableState: 'adHandles',
      // This player does not render a skip button.
      siteUrl: document.location.host,
      appId: '',
      // This is not relevant on desktop
      useragent: window.navigator.userAgent,
      // This should be filled in for sdks and players
      deviceId: '',
      // This should be filled in on mobile
      muted: this.adVideoElement_.muted,
      volume: this.adVideoElement_.volume
    };
    const creativeData = {
      adParameters: this.adParameters_,
      // These values should be populated from the VAST response.
      adId: this.adId_,
      creativeId: this.creativeId_,
      adServingId: this.adServingId_,
      clickThroughUrl: this.clickThroughUrl_
    };
    if (!this.isLinearAd_) {
      creativeData.duration = document.getElementById('duration').value;
    }
    const initMessage = {
      environmentData,
      creativeData
    };
    const initPromise = this.simidProtocol.sendMessage(PlayerMessage.INIT, initMessage);
    initPromise.then(args => {
      this.resolveInitializationPromise_(args);
    }).catch(args => {
      this.rejectInitializationPromise_(args);
    });
  }

  /**
   * Called once the creative responds positively to being initialized.
   * @private
   */
  startCreativePlayback_() {
    // Once the ad is successfully initialized it can start.
    // If the ad is not visible it must be made visible here.
    this.showSimidIFrame_();
    if (this.isLinearAd_) {
      this.playLinearVideoAd_();
    } else {
      this.nonLinearStartTime_ = this.contentVideoElement_.currentTime;
      this.contentVideoElement_.play();
    }
    this.simidProtocol.sendMessage(PlayerMessage.START_CREATIVE);
    // TODO: handle creative rejecting startCreative message.
  }

  /** 
   * Pauses content video and plays linear ad.
   * @private 
   */
  playLinearVideoAd_() {
    this.contentVideoElement_.pause();
    this.showAdPlayer_();
    this.adVideoElement_.src = this.adPlayerUrl_;
    // we need this extra load for Chrome data saver mode in mobile or desktop
    this.adVideoElement_.load();
    this.adVideoElement_.play();
  }

  /**
   * Called if the creative responds with reject after the player
   * initializes the ad.
   * @param {!Object} data
   * @private
   */
  onAdInitializedFailed_(data) {
    const errorData = JSON.stringify(data);
    Logger.print(this.rmpVast_.debugRawConsoleLogs, ` SIMID: Ad init failed. ${errorData}`);
    this.destroyIframeAndResumeContent_(true, errorData.errorCode);
  }

  /** @private */
  hideSimidIFrame_() {
    this.simidIframe_.style.display = 'none';
  }

  /** @private */
  showSimidIFrame_() {
    this.simidIframe_.style.display = 'block';
  }

  /** @private */
  showAdPlayer_() {
    // show the ad video element
    this.adVideoElement_.style.display = 'block';
    this.adContainer_.style.display = 'block';
  }

  /** @private */
  hideAdPlayer_() {
    // Unload the video
    this.adVideoElement_.style.display = 'none';
    this.adContainer_.style.display = 'none';
  }

  /**
   * Tracks the events on the ad video element specified by the simid spec
   * @private
   */
  trackEventsOnAdVideoElement_() {
    this.adVideoTrackingEvents_.set('durationchange', () => {
      this.simidProtocol.sendMessage(MediaMessage.DURATION_CHANGE, {
        duration: this.adVideoElement_.duration
      });
    });
    this.adVideoTrackingEvents_.set('ended', this.videoComplete.bind(this));
    this.adVideoTrackingEvents_.set('error', () => {
      this.simidProtocol.sendMessage(MediaMessage.ERROR, {
        error: '',
        // TODO fill in these values correctly
        message: ''
      });
    });
    this.adVideoTrackingEvents_.set('pause', () => {
      this.simidProtocol.sendMessage(MediaMessage.PAUSE);
    });
    this.adVideoTrackingEvents_.set('play', () => {
      this.simidProtocol.sendMessage(MediaMessage.PLAY);
    });
    this.adVideoTrackingEvents_.set('playing', () => {
      this.simidProtocol.sendMessage(MediaMessage.PLAYING);
    });
    this.adVideoTrackingEvents_.set('seeked', () => {
      this.simidProtocol.sendMessage(MediaMessage.SEEKED);
    });
    this.adVideoTrackingEvents_.set('seeking', () => {
      this.simidProtocol.sendMessage(MediaMessage.SEEKING);
    });
    this.adVideoTrackingEvents_.set('timeupdate', () => {
      this.simidProtocol.sendMessage(MediaMessage.TIME_UPDATE, {
        currentTime: this.adVideoElement_.currentTime
      });
      this.compareAdAndRequestedDurations_();
    });
    this.adVideoTrackingEvents_.set('volumechange', () => {
      this.simidProtocol.sendMessage(MediaMessage.VOLUME_CHANGE, {
        volume: this.adVideoElement_.volume
      });
    });
    for (let [key, func] of this.adVideoTrackingEvents_) {
      this.adVideoElement_.addEventListener(key, func, true);
    }
  }

  /**
   * Tracks the events on the content video element.
   * @private
   */
  trackEventsOnContentVideoElement_() {
    this.contentVideoTrackingEvents_.set('timeupdate', () => {
      if (this.nonLinearStartTime_ !== null && this.contentVideoElement_.currentTime - this.nonLinearStartTime_ > this.requestedDuration_) {
        this.stopAd(StopCode.NON_LINEAR_DURATION_COMPLETE);
      }
    });
    for (let [key, func] of this.contentVideoTrackingEvents_) {
      this.contentVideoElement_.addEventListener(key, func, true);
    }
  }

  /**
   * Stops the ad and destroys the ad iframe.
   * @param {StopCode} reason The reason the ad will stop.
   */
  stopAd(reason = StopCode.PLAYER_INITATED, error, errorCode) {
    // The iframe is only hidden on ad stoppage. The ad might still request
    // tracking pixels before it is cleaned up.
    if (this.simidIframe_) {
      this.hideSimidIFrame_();
      /*const closeMessage = {
        'code': reason,
      };*/
      // Wait for the SIMID creative to acknowledge stop and then clean
      // up the iframe.
      Logger.print(this.rmpVast_.debugRawConsoleLogs, ` SIMID: stopAd ${reason}`);
      this.simidProtocol.sendMessage(PlayerMessage.AD_STOPPED).then(() => this.destroyIframeAndResumeContent_(error, errorCode));
    }
  }

  /**
   * Skips the ad and destroys the ad iframe.
   */
  skipAd() {
    // The iframe is only hidden on ad skipped. The ad might still request
    // tracking pixels before it is cleaned up.
    this.hideSimidIFrame_();
    // Wait for the SIMID creative to acknowledge skip and then clean
    // up the iframe.
    this.simidProtocol.sendMessage(PlayerMessage.AD_SKIPPED).then(() => this.destroyIframeAndResumeContent_());
  }

  /**
   * Removes the simid ad entirely and resumes video playback.
   * @private
   */
  destroyIframeAndResumeContent_(error, errorCode) {
    //this.hideAdPlayer_();
    //this.adVideoElement_.src = '';
    this.destroySimidIframe_();
    //this.contentVideoElement_.play();
    if (error) {
      this.rmpVast_.rmpVastUtils.processVastErrors(errorCode, true);
    } else if (this.rmpVast_.rmpVastAdPlayer) {
      this.rmpVast_.rmpVastAdPlayer.resumeContent();
    }
  }

  /** The creative wants to go full screen. */
  onRequestFullScreen(incomingMessage) {
    // The spec currently says to only request fullscreen for the iframe.
    let promise = null;
    if (this.simidIframe_.requestFullscreen) {
      promise = this.simidIframe_.requestFullscreen();
    } else if (this.simidIframe_.mozRequestFullScreen) {
      // Our tests indicate firefox will probably not respect the request.
      promise = this.simidIframe_.mozRequestFullScreen();
    } else if (this.simidIframe_.webkitRequestFullscreen) {
      promise = this.simidIframe_.webkitRequestFullscreen();
    } else if (this.simidIframe_.msRequestFullscreen) {
      // Our tests indicate IE will probably not respect the request.
      promise = this.simidIframe_.msRequestFullscreen();
    }
    if (promise) {
      promise.then(() => this.simidProtocol.resolve(incomingMessage));
    } else {
      // TODO: Many browsers are not returning promises but are still
      // going full screen. Assuming resolve (bad).
      this.simidProtocol.resolve(incomingMessage);
    }
  }

  /** The creative wants to play video. */
  onRequestPlay(incomingMessage) {
    if (this.isLinearAd_) {
      this.adVideoElement_.play().then(() => this.simidProtocol.resolve(incomingMessage)).catch(() => {
        const errorMessage = {
          errorCode: PlayerErrorCode.VIDEO_COULD_NOT_LOAD,
          message: 'The SIMID media could not be loaded.'
        };
        this.simidProtocol.reject(incomingMessage, errorMessage);
      });
    } else {
      const errorMessage = {
        errorCode: CreativeErrorCode.PLAYBACK_AREA_UNUSABLE,
        message: 'Non linear ads do not play video.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
    }
  }

  /** The creative wants to pause video. */
  onRequestPause(incomingMessage) {
    this.adVideoElement_.pause();
    this.simidProtocol.resolve(incomingMessage);
  }

  /** Pauses the video ad element. */
  pauseAd() {
    this.adVideoElement_.pause();
  }

  /** The creative wants to stop with a fatal error. */
  onCreativeFatalError(incomingMessage) {
    this.simidProtocol.resolve(incomingMessage);
    this.stopAd(StopCode.CREATIVE_INITIATED, true, 1100);
  }

  /** The creative wants to skip this ad. */
  onRequestSkip(incomingMessage) {
    this.simidProtocol.resolve(incomingMessage);
    this.skipAd();
  }

  /** The creative wants to stop the ad early. */
  onRequestStop(incomingMessage) {
    this.simidProtocol.resolve(incomingMessage);
    this.stopAd(StopCode.CREATIVE_INITIATED);
  }

  /**
   * The player must implement sending tracking pixels from the creative.
   * This sample implementation does not show how to send tracking pixels or
   * replace macros. That should be done using the players standard workflow.
   */
  onReportTracking(incomingMessage) {
    const requestedUrlArray = incomingMessage.args.trackingUrls;
    requestedUrlArray.forEach(url => {
      this.rmpVast_.rmpVastTracking.pingURI(url);
    });
    Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: The creative has asked for the player to ping ${requestedUrlArray}`);
  }

  /**
   * Called when video playback is complete.
   * @private
   */
  videoComplete() {
    this.simidProtocol.sendMessage(MediaMessage.ENDED);
    if (this.requestedDuration_ === NO_REQUESTED_DURATION) {
      this.stopAd(StopCode.MEDIA_PLAYBACK_COMPLETE);
    } else if (this.requestedDuration_ !== UNLIMITED_DURATION) {
      //If the request duration is longer than the ad duration, the ad extends for the requested amount of time
      const durationChangeMs = (this.requestedDuration_ - this.adVideoElement_.duration) * 1000;
      window.setTimeout(() => {
        this.stopAd(StopCode.CREATIVE_INITIATED);
      }, durationChangeMs);
    }
  }

  /**
   * Called when creative requests a change in duration of ad.
   * @private
   */
  onRequestChangeAdDuration(incomingMessage) {
    const newRequestedDuration = incomingMessage.args.duration;
    if (newRequestedDuration !== UNLIMITED_DURATION && newRequestedDuration < 0) {
      const durationErrorMessage = {
        errorCode: PlayerErrorCode.UNSUPPORTED_TIME,
        message: 'A negative duration is not valid.'
      };
      this.simidProtocol.reject(incomingMessage, durationErrorMessage);
    } else {
      this.requestedDuration_ = newRequestedDuration;
      //If requested duration is any other acceptable value
      this.compareAdAndRequestedDurations_();
      this.simidProtocol.resolve(incomingMessage);
    }
  }

  /**
   * Compares the duration of the ad with the requested change duration.
   * If request duration is the same as the ad duration, ad ends as normal.
   * If request duration is unlimited, ad stays on screen until user closes ad.
   * If request duration is shorter, the ad stops early. 
   * @private
   */
  compareAdAndRequestedDurations_() {
    if (this.requestedDuration_ === NO_REQUESTED_DURATION || this.requestedDuration_ === UNLIMITED_DURATION) {
      //Note: Users can end the ad with unlimited duration with
      // the close ad button on the player
      return;
    } else if (this.adVideoElement_.currentTime >= this.requestedDuration_) {
      //Creative requested a duration shorter than the ad
      this.stopAd(StopCode.CREATIVE_INITATED);
    }
  }
  onGetMediaState(incomingMessage) {
    const mediaState = {
      currentSrc: this.adVideoElement_.currentSrc,
      currentTime: this.adVideoElement_.currentTime,
      duration: this.adVideoElement_.duration,
      ended: this.adVideoElement_.ended,
      muted: this.adVideoElement_.muted,
      paused: this.adVideoElement_.paused,
      volume: this.adVideoElement_.volume,
      fullscreen: this.adVideoElement_.fullscreen
    };
    this.simidProtocol.resolve(incomingMessage, mediaState);
  }
  onReceiveCreativeLog(incomingMessage) {
    const logMessage = incomingMessage.args.message;
    Logger.print(this.rmpVast_.debugRawConsoleLogs, `SIMID: Received message from creative: ${logMessage}`);
  }
  sendLog(outgoingMessage) {
    const logMessage = {
      message: outgoingMessage
    };
    this.simidProtocol.sendMessage(PlayerMessage.LOG, logMessage);
  }
}
;// ./src/js/players/vpaid-player.js


function vpaid_player_classPrivateMethodInitSpec(e, a) { vpaid_player_checkPrivateRedeclaration(e, a), a.add(e); }
function vpaid_player_classPrivateFieldInitSpec(e, t, a) { vpaid_player_checkPrivateRedeclaration(e, t), t.set(e, a); }
function vpaid_player_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function vpaid_player_classPrivateFieldGet(s, a) { return s.get(vpaid_player_assertClassBrand(s, a)); }
function vpaid_player_classPrivateFieldSet(s, a, r) { return s.set(vpaid_player_assertClassBrand(s, a), r), r; }
function vpaid_player_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }


var vpaid_player_rmpVast = /*#__PURE__*/new (weak_map_default())();
var vpaid_player_adContainer = /*#__PURE__*/new (weak_map_default())();
var vpaid_player_adPlayer = /*#__PURE__*/new (weak_map_default())();
var _params = /*#__PURE__*/new (weak_map_default())();
var _adParametersData = /*#__PURE__*/new (weak_map_default())();
var _initialWidth = /*#__PURE__*/new (weak_map_default())();
var _initialHeight = /*#__PURE__*/new (weak_map_default())();
var _initialViewMode = /*#__PURE__*/new (weak_map_default())();
var _desiredBitrate = /*#__PURE__*/new (weak_map_default())();
var _vpaidCreativeUrl = /*#__PURE__*/new (weak_map_default())();
var _vpaidCreative = /*#__PURE__*/new (weak_map_default())();
var _vpaidScript = /*#__PURE__*/new (weak_map_default())();
var _vpaidIframe = /*#__PURE__*/new (weak_map_default())();
var _vpaidAdLoaded = /*#__PURE__*/new (weak_map_default())();
var _initAdTimeout = /*#__PURE__*/new (weak_map_default())();
var _vpaidCallbacks = /*#__PURE__*/new (weak_map_default())();
var _startAdTimeout = /*#__PURE__*/new (weak_map_default())();
var _vpaidAdStarted = /*#__PURE__*/new (weak_map_default())();
var _vpaidVersion = /*#__PURE__*/new (weak_map_default())();
var _vpaid1AdDuration = /*#__PURE__*/new (weak_map_default())();
var _adStoppedTimeout = /*#__PURE__*/new (weak_map_default())();
var _adSkippedTimeout = /*#__PURE__*/new (weak_map_default())();
var _vpaidAdRemainingTimeInterval = /*#__PURE__*/new (weak_map_default())();
var _vpaidRemainingTime = /*#__PURE__*/new (weak_map_default())();
var _vpaidCurrentVolume = /*#__PURE__*/new (weak_map_default())();
var _vpaidPaused = /*#__PURE__*/new (weak_map_default())();
var _vpaidLoadTimeout = /*#__PURE__*/new (weak_map_default())();
var _vpaidAvailableInterval = /*#__PURE__*/new (weak_map_default())();
var _vpaidSlot = /*#__PURE__*/new (weak_map_default())();
var _VpaidPlayer_brand = /*#__PURE__*/new WeakSet();
class VpaidPlayer {
  constructor(rmpVast) {
    // VPAID creative events
    vpaid_player_classPrivateMethodInitSpec(this, _VpaidPlayer_brand);
    vpaid_player_classPrivateFieldInitSpec(this, vpaid_player_rmpVast, void 0);
    vpaid_player_classPrivateFieldInitSpec(this, vpaid_player_adContainer, void 0);
    vpaid_player_classPrivateFieldInitSpec(this, vpaid_player_adPlayer, void 0);
    vpaid_player_classPrivateFieldInitSpec(this, _params, void 0);
    vpaid_player_classPrivateFieldInitSpec(this, _adParametersData, void 0);
    vpaid_player_classPrivateFieldInitSpec(this, _initialWidth, 640);
    vpaid_player_classPrivateFieldInitSpec(this, _initialHeight, 360);
    vpaid_player_classPrivateFieldInitSpec(this, _initialViewMode, 'normal');
    vpaid_player_classPrivateFieldInitSpec(this, _desiredBitrate, 500);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidCreativeUrl, '');
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidCreative, null);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidScript, null);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidIframe, null);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidAdLoaded, false);
    vpaid_player_classPrivateFieldInitSpec(this, _initAdTimeout, null);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidCallbacks, {});
    vpaid_player_classPrivateFieldInitSpec(this, _startAdTimeout, null);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidAdStarted, false);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidVersion, -1);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaid1AdDuration, -1);
    vpaid_player_classPrivateFieldInitSpec(this, _adStoppedTimeout, null);
    vpaid_player_classPrivateFieldInitSpec(this, _adSkippedTimeout, null);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidAdRemainingTimeInterval, null);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidRemainingTime, -1);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidCurrentVolume, 1);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidPaused, true);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidLoadTimeout, null);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidAvailableInterval, null);
    vpaid_player_classPrivateFieldInitSpec(this, _vpaidSlot, null);
    vpaid_player_classPrivateFieldSet(vpaid_player_rmpVast, this, rmpVast);
    vpaid_player_classPrivateFieldSet(vpaid_player_adContainer, this, rmpVast.adContainer);
    vpaid_player_classPrivateFieldSet(vpaid_player_adPlayer, this, rmpVast.currentAdPlayer);
    vpaid_player_classPrivateFieldSet(_params, this, rmpVast.params);
    vpaid_player_classPrivateFieldSet(_adParametersData, this, rmpVast.adParametersData);
  }
  // #vpaidCreative getters

  getAdWidth() {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdWidth === 'function') {
      return vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdWidth();
    }
    return -1;
  }
  getAdHeight() {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdHeight === 'function') {
      return vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdHeight();
    }
    return -1;
  }
  getAdDuration() {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
      if (typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdDuration === 'function') {
        return vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdDuration();
      } else if (vpaid_player_classPrivateFieldGet(_vpaid1AdDuration, this) > -1) {
        return vpaid_player_classPrivateFieldGet(_vpaid1AdDuration, this);
      }
    }
    return -1;
  }
  getAdRemainingTime() {
    if (vpaid_player_classPrivateFieldGet(_vpaidRemainingTime, this) >= 0) {
      return vpaid_player_classPrivateFieldGet(_vpaidRemainingTime, this);
    }
    return -1;
  }
  getCreativeUrl() {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreativeUrl, this)) {
      return vpaid_player_classPrivateFieldGet(_vpaidCreativeUrl, this);
    }
    return '';
  }
  getAdVolume() {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdVolume === 'function') {
      return vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdVolume();
    }
    return -1;
  }
  getAdPaused() {
    return vpaid_player_classPrivateFieldGet(_vpaidPaused, this);
  }
  getAdExpanded() {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdExpanded === 'function') {
      return vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdExpanded();
    }
    return false;
  }
  getAdSkippableState() {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdSkippableState === 'function') {
      return vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdSkippableState();
    }
    return false;
  }
  getAdCompanions() {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdCompanions === 'function') {
      return vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdCompanions();
    }
    return '';
  }

  // #vpaidCreative methods
  resizeAd(width, height, viewMode) {
    if (!vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
      return;
    }
    if (!FW.isNumber(width) || !FW.isNumber(height) || typeof viewMode !== 'string') {
      return;
    }
    if (width <= 0 || height <= 0) {
      return;
    }
    let validViewMode = 'normal';
    if (viewMode === 'fullscreen') {
      validViewMode = viewMode;
    }
    Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `VPAID resizeAd with width ${width}, height ${height}, viewMode ${viewMode}`);
    vpaid_player_classPrivateFieldGet(_vpaidCreative, this).resizeAd(width, height, validViewMode);
  }
  stopAd() {
    if (!vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
      return;
    }
    Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `stopAd`);
    // when stopAd is called we need to check a 
    // AdStopped event follows
    vpaid_player_classPrivateFieldSet(_adStoppedTimeout, this, window.setTimeout(() => {
      vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdStopped).call(this);
    }, vpaid_player_classPrivateFieldGet(_params, this).creativeLoadTimeout));
    vpaid_player_classPrivateFieldGet(_vpaidCreative, this).stopAd();
  }
  pauseAd() {
    Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `pauseAd`);
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && !vpaid_player_classPrivateFieldGet(_vpaidPaused, this)) {
      vpaid_player_classPrivateFieldGet(_vpaidCreative, this).pauseAd();
    }
  }
  resumeAd() {
    Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `resumeAd`);
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && vpaid_player_classPrivateFieldGet(_vpaidPaused, this)) {
      vpaid_player_classPrivateFieldGet(_vpaidCreative, this).resumeAd();
    }
  }
  expandAd() {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
      vpaid_player_classPrivateFieldGet(_vpaidCreative, this).expandAd();
    }
  }
  collapseAd() {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
      vpaid_player_classPrivateFieldGet(_vpaidCreative, this).collapseAd();
    }
  }
  skipAd() {
    if (!vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
      return;
    }
    // when skipAd is called we need to check a 
    // AdSkipped event follows
    vpaid_player_classPrivateFieldSet(_adSkippedTimeout, this, window.setTimeout(() => {
      vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdStopped).call(this);
    }, vpaid_player_classPrivateFieldGet(_params, this).creativeLoadTimeout));
    vpaid_player_classPrivateFieldGet(_vpaidCreative, this).skipAd();
  }
  setAdVolume(volume) {
    if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && FW.isNumber(volume) && volume >= 0 && volume <= 1 && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).setAdVolume === 'function') {
      vpaid_player_classPrivateFieldGet(_vpaidCreative, this).setAdVolume(volume);
    }
  }
  init(creativeUrl, vpaidSettings) {
    vpaid_player_classPrivateFieldSet(_initialWidth, this, vpaidSettings.width);
    vpaid_player_classPrivateFieldSet(_initialHeight, this, vpaidSettings.height);
    vpaid_player_classPrivateFieldSet(_initialViewMode, this, vpaidSettings.viewMode);
    vpaid_player_classPrivateFieldSet(_desiredBitrate, this, vpaidSettings.desiredBitrate);
    vpaid_player_classPrivateFieldSet(_vpaidCreativeUrl, this, creativeUrl);
    if (!vpaid_player_classPrivateFieldGet(vpaid_player_adPlayer, this)) {
      // we use existing ad player as it is already 
      // available and initialized (no need for user interaction)
      let existingAdPlayer = null;
      if (vpaid_player_classPrivateFieldGet(vpaid_player_adContainer, this)) {
        existingAdPlayer = vpaid_player_classPrivateFieldGet(vpaid_player_adContainer, this).querySelector('.rmp-ad-vast-video-player');
      }
      if (existingAdPlayer === null) {
        vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.processVastErrors(900, true);
        return;
      }
      vpaid_player_classPrivateFieldSet(vpaid_player_adPlayer, this, existingAdPlayer);
    }
    // pause content player
    vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastContentPlayer.pause();
    // create FiF 
    vpaid_player_classPrivateFieldSet(_vpaidIframe, this, document.createElement('iframe'));
    vpaid_player_classPrivateFieldGet(_vpaidIframe, this).sandbox = 'allow-scripts allow-same-origin';
    vpaid_player_classPrivateFieldGet(_vpaidIframe, this).id = 'vpaid-frame';
    // do not use display: none;
    // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    FW.setStyle(vpaid_player_classPrivateFieldGet(_vpaidIframe, this), {
      visibility: 'hidden',
      width: '0px',
      height: '0px',
      border: 'none'
    });
    // this is to adhere to Best Practices for Rich Media Ads 
    // in Asynchronous Ad Environments  http://www.iab.net/media/file/rich_media_ajax_best_practices.pdf
    const src = 'about:blank';
    vpaid_player_classPrivateFieldGet(_vpaidIframe, this).onload = () => {
      Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `#vpaidIframe.onload`);
      if (!vpaid_player_classPrivateFieldGet(_vpaidIframe, this).contentWindow || !vpaid_player_classPrivateFieldGet(_vpaidIframe, this).contentWindow.document || !vpaid_player_classPrivateFieldGet(_vpaidIframe, this).contentWindow.document.body) {
        // PING error and resume content

        vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.processVastErrors(901, true);
        return;
      }
      const iframeWindow = vpaid_player_classPrivateFieldGet(_vpaidIframe, this).contentWindow;
      const iframeDocument = iframeWindow.document;
      const iframeBody = iframeDocument.body;
      vpaid_player_classPrivateFieldSet(_vpaidScript, this, iframeDocument.createElement('script'));
      vpaid_player_classPrivateFieldSet(_vpaidLoadTimeout, this, window.setTimeout(() => {
        Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `could not load VPAID JS Creative or getVPAIDAd in iframeWindow - resume content`);
        vpaid_player_classPrivateFieldGet(_vpaidScript, this).onload = null;
        vpaid_player_classPrivateFieldGet(_vpaidScript, this).onerror = null;
        if (vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastAdPlayer) {
          vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastAdPlayer.resumeContent();
        }
      }, vpaid_player_classPrivateFieldGet(_params, this).creativeLoadTimeout));
      vpaid_player_classPrivateFieldGet(_vpaidScript, this).onload = vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onJSVPAIDLoaded).bind(this);
      vpaid_player_classPrivateFieldGet(_vpaidScript, this).onerror = vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onJSVPAIDError).bind(this);
      iframeBody.appendChild(vpaid_player_classPrivateFieldGet(_vpaidScript, this));
      vpaid_player_classPrivateFieldGet(_vpaidScript, this).src = vpaid_player_classPrivateFieldGet(_vpaidCreativeUrl, this);
    };
    vpaid_player_classPrivateFieldGet(_vpaidIframe, this).src = src;
    vpaid_player_classPrivateFieldGet(vpaid_player_adContainer, this).appendChild(vpaid_player_classPrivateFieldGet(_vpaidIframe, this));
  }
  destroy() {
    Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `destroy VPAID dependencies`);
    window.clearInterval(vpaid_player_classPrivateFieldGet(_vpaidAvailableInterval, this));
    window.clearInterval(vpaid_player_classPrivateFieldGet(_vpaidAdRemainingTimeInterval, this));
    window.clearTimeout(vpaid_player_classPrivateFieldGet(_vpaidLoadTimeout, this));
    window.clearTimeout(vpaid_player_classPrivateFieldGet(_initAdTimeout, this));
    window.clearTimeout(vpaid_player_classPrivateFieldGet(_startAdTimeout, this));
    vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _unsetCallbacksForCreative).call(this);
    if (vpaid_player_classPrivateFieldGet(_vpaidScript, this)) {
      vpaid_player_classPrivateFieldGet(_vpaidScript, this).onload = null;
      vpaid_player_classPrivateFieldGet(_vpaidScript, this).onerror = null;
    }
    if (vpaid_player_classPrivateFieldGet(_vpaidSlot, this)) {
      FW.removeElement(vpaid_player_classPrivateFieldGet(_vpaidSlot, this));
    }
    if (vpaid_player_classPrivateFieldGet(_vpaidIframe, this)) {
      FW.removeElement(vpaid_player_classPrivateFieldGet(_vpaidIframe, this));
    }
  }
}
function _onAdLoaded() {
  vpaid_player_classPrivateFieldSet(_vpaidAdLoaded, this, true);
  if (!vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
    return;
  }
  window.clearTimeout(vpaid_player_classPrivateFieldGet(_initAdTimeout, this));
  if (vpaid_player_classPrivateFieldGet(_vpaidCallbacks, this).AdLoaded) {
    vpaid_player_classPrivateFieldGet(_vpaidCreative, this).unsubscribe(vpaid_player_classPrivateFieldGet(_vpaidCallbacks, this).AdLoaded, 'AdLoaded');
  }
  // when we call startAd we expect AdStarted event to follow closely
  // otherwise we need to resume content
  vpaid_player_classPrivateFieldSet(_startAdTimeout, this, window.setTimeout(() => {
    if (!vpaid_player_classPrivateFieldGet(_vpaidAdStarted, this) && vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastAdPlayer) {
      vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastAdPlayer.resumeContent();
    }
    vpaid_player_classPrivateFieldSet(_vpaidAdStarted, this, false);
  }, vpaid_player_classPrivateFieldGet(_params, this).creativeLoadTimeout));
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).__adOnStage = true;
  vpaid_player_classPrivateFieldGet(_vpaidCreative, this).startAd();
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adloaded');
}
function _onAdStarted() {
  vpaid_player_classPrivateFieldSet(_vpaidAdStarted, this, true);
  if (!vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
    return;
  }
  window.clearTimeout(vpaid_player_classPrivateFieldGet(_startAdTimeout, this));
  if (vpaid_player_classPrivateFieldGet(_vpaidCallbacks, this).AdStarted) {
    vpaid_player_classPrivateFieldGet(_vpaidCreative, this).unsubscribe(vpaid_player_classPrivateFieldGet(_vpaidCallbacks, this).AdStarted, 'AdStarted');
  }
  // update duration for VPAID 1.*
  if (vpaid_player_classPrivateFieldGet(_vpaidVersion, this) === 1) {
    vpaid_player_classPrivateFieldSet(_vpaid1AdDuration, this, vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdRemainingTime());
  }
  // append icons - if VPAID does not handle them
  const adIcons = vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdIcons();
  if (!adIcons && vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastIcons) {
    const iconsData = vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastIcons.iconsData;
    if (iconsData.length > 0) {
      vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastIcons.append();
    }
  }
  if (typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdLinear === 'function') {
    vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).creative.isLinear = vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdLinear();
  }
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adcreativeview');
}
function _onAdStopped() {
  Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `VPAID AdStopped event`);
  window.clearTimeout(vpaid_player_classPrivateFieldGet(_adStoppedTimeout, this));
  if (vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastAdPlayer) {
    vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastAdPlayer.resumeContent();
  }
}
function _onAdSkipped() {
  window.clearTimeout(vpaid_player_classPrivateFieldGet(_adSkippedTimeout, this));
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adskipped');
}
function _onAdSkippableStateChange() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.createApiEvent('adskippablestatechanged');
}
function _onAdDurationChange() {
  if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdRemainingTime === 'function') {
    const remainingTime = vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdRemainingTime();
    if (remainingTime >= 0) {
      vpaid_player_classPrivateFieldSet(_vpaidRemainingTime, this, remainingTime);
    }
    // AdRemainingTimeChange is deprecated in VPAID 2
    // instead we use setInterval
    window.clearInterval(vpaid_player_classPrivateFieldGet(_vpaidAdRemainingTimeInterval, this));
    vpaid_player_classPrivateFieldSet(_vpaidAdRemainingTimeInterval, this, window.setInterval(() => {
      const remainingTime = vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdRemainingTime();
      if (remainingTime >= 0) {
        vpaid_player_classPrivateFieldSet(_vpaidRemainingTime, this, remainingTime);
      }
    }, 200));
    vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.createApiEvent('addurationchange');
  }
}
function _onAdVolumeChange() {
  let newVolume = -1;
  if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
    newVolume = vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdVolume();
  }
  if (typeof newVolume === 'number' && newVolume >= 0) {
    if (vpaid_player_classPrivateFieldGet(_vpaidCurrentVolume, this) > 0 && newVolume === 0) {
      vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('advolumemuted');
    } else if (vpaid_player_classPrivateFieldGet(_vpaidCurrentVolume, this) === 0 && newVolume > 0) {
      vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('advolumeunmuted');
    }
    vpaid_player_classPrivateFieldSet(_vpaidCurrentVolume, this, newVolume);
    vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.createApiEvent('advolumechanged');
  }
}
function _onAdImpression() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adimpression');
}
function _onAdVideoStart() {
  vpaid_player_classPrivateFieldSet(_vpaidPaused, this, false);
  let newVolume = -1;
  if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
    newVolume = vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdVolume();
  }
  if (typeof newVolume === 'number' && newVolume >= 0) {
    vpaid_player_classPrivateFieldSet(_vpaidCurrentVolume, this, newVolume);
    vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adstarted');
  }
}
function _onAdVideoFirstQuartile() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adfirstquartile');
}
function _onAdVideoMidpoint() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('admidpoint');
}
function _onAdVideoThirdQuartile() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adthirdquartile');
}
function _onAdVideoComplete() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adcomplete');
}
function _onAdClickThru(url, id, playerHandles) {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adclick');
  if (typeof playerHandles !== 'boolean') {
    return;
  }
  if (!playerHandles) {
    return;
  } else {
    let destUrl;
    if (url) {
      destUrl = url;
    } else if (vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).creative.clickThroughUrl) {
      destUrl = vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).creative.clickThroughUrl;
    }
    if (destUrl) {
      vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).creative.clickThroughUrl = destUrl;
      FW.openWindow(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).creative.clickThroughUrl);
    }
  }
}
function _onAdPaused() {
  vpaid_player_classPrivateFieldSet(_vpaidPaused, this, true);
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adpaused');
}
function _onAdPlaying() {
  vpaid_player_classPrivateFieldSet(_vpaidPaused, this, false);
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adresumed');
}
function _onAdLog(message) {
  Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `VPAID AdLog event ${message}`);
}
function _onAdError(message) {
  Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `VPAID AdError event ${message}`);
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.processVastErrors(901, true);
}
function _onAdInteraction() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.createApiEvent('adinteraction');
}
function _onAdUserAcceptInvitation() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('aduseracceptinvitation');
}
function _onAdUserMinimize() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adcollapse');
}
function _onAdUserClose() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adclosed');
}
function _onAdSizeChange() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.createApiEvent('adsizechange');
}
function _onAdLinearChange() {
  if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdLinear === 'function') {
    vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).creative.isLinear = vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdLinear();
    vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.createApiEvent('adlinearchange');
  }
}
function _onAdExpandedChange() {
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.createApiEvent('adexpandedchange');
}
function _onAdRemainingTimeChange() {
  if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdRemainingTime === 'function') {
    const remainingTime = vpaid_player_classPrivateFieldGet(_vpaidCreative, this).getAdRemainingTime();
    if (remainingTime >= 0) {
      vpaid_player_classPrivateFieldSet(_vpaidRemainingTime, this, remainingTime);
    }
    vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.createApiEvent('adremainingtimechange');
  }
}
function _setCallbacksForCreative() {
  if (!vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
    return;
  }
  vpaid_player_classPrivateFieldSet(_vpaidCallbacks, this, {
    AdLoaded: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdLoaded).bind(this),
    AdStarted: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdStarted).bind(this),
    AdStopped: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdStopped).bind(this),
    AdSkipped: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdSkipped).bind(this),
    AdSkippableStateChange: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdSkippableStateChange).bind(this),
    AdDurationChange: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdDurationChange).bind(this),
    AdVolumeChange: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdVolumeChange).bind(this),
    AdImpression: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdImpression).bind(this),
    AdVideoStart: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdVideoStart).bind(this),
    AdVideoFirstQuartile: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdVideoFirstQuartile).bind(this),
    AdVideoMidpoint: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdVideoMidpoint).bind(this),
    AdVideoThirdQuartile: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdVideoThirdQuartile).bind(this),
    AdVideoComplete: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdVideoComplete).bind(this),
    AdClickThru: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdClickThru).bind(this),
    AdPaused: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdPaused).bind(this),
    AdPlaying: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdPlaying).bind(this),
    AdLog: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdLog).bind(this),
    AdError: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdError).bind(this),
    AdInteraction: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdInteraction).bind(this),
    AdUserAcceptInvitation: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdUserAcceptInvitation).bind(this),
    AdUserMinimize: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdUserMinimize).bind(this),
    AdUserClose: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdUserClose).bind(this),
    AdSizeChange: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdSizeChange).bind(this),
    AdLinearChange: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdLinearChange).bind(this),
    AdExpandedChange: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdExpandedChange).bind(this),
    AdRemainingTimeChange: vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onAdRemainingTimeChange).bind(this)
  });
  // Looping through the object and registering each of the callbacks with the creative
  const callbacksKeys = Object.keys(vpaid_player_classPrivateFieldGet(_vpaidCallbacks, this));
  callbacksKeys.forEach(key => {
    vpaid_player_classPrivateFieldGet(_vpaidCreative, this).subscribe(vpaid_player_classPrivateFieldGet(_vpaidCallbacks, this)[key], key);
  });
}
function _unsetCallbacksForCreative() {
  if (!vpaid_player_classPrivateFieldGet(_vpaidCreative, this)) {
    return;
  }
  // Looping through the object and registering each of the callbacks with the creative
  const callbacksKeys = Object.keys(vpaid_player_classPrivateFieldGet(_vpaidCallbacks, this));
  callbacksKeys.forEach(key => {
    vpaid_player_classPrivateFieldGet(_vpaidCreative, this).unsubscribe(vpaid_player_classPrivateFieldGet(_vpaidCallbacks, this)[key], key);
  });
}
// eslint-disable-next-line
function _isValidVPAID(creative) {
  if (typeof creative.initAd === 'function' && typeof creative.startAd === 'function' && typeof creative.stopAd === 'function' && typeof creative.skipAd === 'function' && typeof creative.resizeAd === 'function' && typeof creative.pauseAd === 'function' && typeof creative.resumeAd === 'function' && typeof creative.expandAd === 'function' && typeof creative.collapseAd === 'function' && typeof creative.subscribe === 'function' && typeof creative.unsubscribe === 'function') {
    return true;
  }
  return false;
}
function _onVPAIDAvailable() {
  window.clearInterval(vpaid_player_classPrivateFieldGet(_vpaidAvailableInterval, this));
  window.clearTimeout(vpaid_player_classPrivateFieldGet(_vpaidLoadTimeout, this));
  vpaid_player_classPrivateFieldSet(_vpaidCreative, this, vpaid_player_classPrivateFieldGet(_vpaidIframe, this).contentWindow.getVPAIDAd());
  if (vpaid_player_classPrivateFieldGet(_vpaidCreative, this) && typeof vpaid_player_classPrivateFieldGet(_vpaidCreative, this).handshakeVersion === 'function') {
    // we need to insure handshakeVersion return
    let vpaidVersion;
    try {
      vpaidVersion = vpaid_player_classPrivateFieldGet(_vpaidCreative, this).handshakeVersion('2.0');
    } catch (error) {
      console.warn(error);
      Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `could not validate VPAID ad unit handshakeVersion`);
      vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.processVastErrors(901, true);
      return;
    }
    vpaid_player_classPrivateFieldSet(_vpaidVersion, this, parse_int_default()(vpaidVersion));
    if (vpaid_player_classPrivateFieldGet(_vpaidVersion, this) < 1) {
      Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `unsupported VPAID version - exit`);
      vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.processVastErrors(901, true);
      return;
    }
    if (!vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _isValidVPAID).call(this, vpaid_player_classPrivateFieldGet(_vpaidCreative, this))) {
      //The VPAID creative doesn't conform to the VPAID spec
      Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `VPAID creative does not conform to VPAID spec - exit`);
      vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.processVastErrors(901, true);
      return;
    }
    // wire callback for VPAID events
    vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _setCallbacksForCreative).call(this);
    // wire tracking events for VAST pings
    vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastTracking.wire();
    const creativeData = {};
    creativeData.AdParameters = vpaid_player_classPrivateFieldGet(_adParametersData, this);
    Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `VPAID AdParameters follow`, vpaid_player_classPrivateFieldGet(_adParametersData, this));
    FW.show(vpaid_player_classPrivateFieldGet(vpaid_player_adContainer, this));
    FW.show(vpaid_player_classPrivateFieldGet(vpaid_player_adPlayer, this));
    const environmentVars = {};
    // we create a new slot for VPAID creative - using adContainer can cause some VPAID to ill-render
    // from spec:
    // The 'environmentVars' object contains a reference, 'slot', to the HTML element
    // on the page in which the ad is to be rendered. The ad unit essentially gets
    // control of that element. 
    vpaid_player_classPrivateFieldSet(_vpaidSlot, this, document.createElement('div'));
    vpaid_player_classPrivateFieldGet(_vpaidSlot, this).className = 'rmp-vpaid-container';
    vpaid_player_classPrivateFieldGet(vpaid_player_adContainer, this).appendChild(vpaid_player_classPrivateFieldGet(_vpaidSlot, this));
    environmentVars.slot = vpaid_player_classPrivateFieldGet(_vpaidSlot, this);
    environmentVars.videoSlot = vpaid_player_classPrivateFieldGet(vpaid_player_adPlayer, this);
    // we assume we can autoplay (or at least muted autoplay) because this.#rmpVast.currentAdPlayer 
    // has been init
    environmentVars.videoSlotCanAutoPlay = true;
    // when we call initAd we expect AdLoaded event to follow closely
    // if not we need to resume content
    vpaid_player_classPrivateFieldSet(_initAdTimeout, this, window.setTimeout(() => {
      if (!vpaid_player_classPrivateFieldGet(_vpaidAdLoaded, this)) {
        Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `#initAdTimeout`);
        if (vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastAdPlayer) {
          vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastAdPlayer.resumeContent();
        }
      }
      vpaid_player_classPrivateFieldSet(_vpaidAdLoaded, this, false);
    }, vpaid_player_classPrivateFieldGet(_params, this).creativeLoadTimeout * 10));
    Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `calling initAd on VPAID creative now`);
    vpaid_player_classPrivateFieldGet(_vpaidCreative, this).initAd(vpaid_player_classPrivateFieldGet(_initialWidth, this), vpaid_player_classPrivateFieldGet(_initialHeight, this), vpaid_player_classPrivateFieldGet(_initialViewMode, this), vpaid_player_classPrivateFieldGet(_desiredBitrate, this), creativeData, environmentVars);
  }
}
function _onJSVPAIDLoaded() {
  Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `VPAID JS loaded`);
  const iframeWindow = vpaid_player_classPrivateFieldGet(_vpaidIframe, this).contentWindow;
  if (typeof iframeWindow.getVPAIDAd === 'function') {
    vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onVPAIDAvailable).call(this);
  } else {
    vpaid_player_classPrivateFieldSet(_vpaidAvailableInterval, this, window.setInterval(() => {
      if (typeof iframeWindow.getVPAIDAd === 'function') {
        vpaid_player_assertClassBrand(_VpaidPlayer_brand, this, _onVPAIDAvailable).call(this);
      }
    }, 100));
  }
  vpaid_player_classPrivateFieldGet(_vpaidScript, this).onload = null;
  vpaid_player_classPrivateFieldGet(_vpaidScript, this).onerror = null;
}
function _onJSVPAIDError() {
  Logger.print(vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).debugRawConsoleLogs, `VPAID JS error loading`);
  vpaid_player_classPrivateFieldGet(vpaid_player_rmpVast, this).rmpVastUtils.processVastErrors(901, true);
  vpaid_player_classPrivateFieldGet(_vpaidScript, this).onload = null;
  vpaid_player_classPrivateFieldGet(_vpaidScript, this).onerror = null;
}
;// ./src/js/creatives/linear.js




function linear_classPrivateMethodInitSpec(e, a) { linear_checkPrivateRedeclaration(e, a), a.add(e); }
function linear_classPrivateFieldInitSpec(e, t, a) { linear_checkPrivateRedeclaration(e, t), t.set(e, a); }
function linear_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function linear_classPrivateFieldGet(s, a) { return s.get(linear_assertClassBrand(s, a)); }
function linear_classPrivateFieldSet(s, a, r) { return s.set(linear_assertClassBrand(s, a), r), r; }
function linear_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }







var linear_rmpVast = /*#__PURE__*/new (weak_map_default())();
var linear_params = /*#__PURE__*/new (weak_map_default())();
var linear_adContainer = /*#__PURE__*/new (weak_map_default())();
var linear_adPlayer = /*#__PURE__*/new (weak_map_default())();
var _contentPlayer = /*#__PURE__*/new (weak_map_default())();
var _firstAdPlayerPlayRequest = /*#__PURE__*/new (weak_map_default())();
var _interactionMobileUI = /*#__PURE__*/new (weak_map_default())();
var _skipWaitingUI = /*#__PURE__*/new (weak_map_default())();
var _skipMessageUI = /*#__PURE__*/new (weak_map_default())();
var _skipIconUI = /*#__PURE__*/new (weak_map_default())();
var _skipButtonUI = /*#__PURE__*/new (weak_map_default())();
var _skippableAdCanBeSkipped = /*#__PURE__*/new (weak_map_default())();
var _onTimeupdateCheckSkipFn = /*#__PURE__*/new (weak_map_default())();
var _onDurationChangeFn = /*#__PURE__*/new (weak_map_default())();
var _onLoadedmetadataPlayFn = /*#__PURE__*/new (weak_map_default())();
var _onContextMenuFn = /*#__PURE__*/new (weak_map_default())();
var _onPlaybackErrorFn = /*#__PURE__*/new (weak_map_default())();
var _onInteractionOpenClickThroughUrlFn = /*#__PURE__*/new (weak_map_default())();
var _creativeLoadTimeoutCallback = /*#__PURE__*/new (weak_map_default())();
var _hlsJS = /*#__PURE__*/new (weak_map_default())();
var _hlsJSIndex = /*#__PURE__*/new (weak_map_default())();
var _readingHlsJS = /*#__PURE__*/new (weak_map_default())();
var _LinearCreative_brand = /*#__PURE__*/new WeakSet();
class LinearCreative {
  constructor(rmpVast) {
    linear_classPrivateMethodInitSpec(this, _LinearCreative_brand);
    linear_classPrivateFieldInitSpec(this, linear_rmpVast, void 0);
    linear_classPrivateFieldInitSpec(this, linear_params, void 0);
    linear_classPrivateFieldInitSpec(this, linear_adContainer, void 0);
    linear_classPrivateFieldInitSpec(this, linear_adPlayer, void 0);
    linear_classPrivateFieldInitSpec(this, _contentPlayer, void 0);
    linear_classPrivateFieldInitSpec(this, _firstAdPlayerPlayRequest, true);
    linear_classPrivateFieldInitSpec(this, _interactionMobileUI, null);
    linear_classPrivateFieldInitSpec(this, _skipWaitingUI, null);
    linear_classPrivateFieldInitSpec(this, _skipMessageUI, null);
    linear_classPrivateFieldInitSpec(this, _skipIconUI, null);
    linear_classPrivateFieldInitSpec(this, _skipButtonUI, null);
    linear_classPrivateFieldInitSpec(this, _skippableAdCanBeSkipped, false);
    linear_classPrivateFieldInitSpec(this, _onTimeupdateCheckSkipFn, null);
    linear_classPrivateFieldInitSpec(this, _onDurationChangeFn, null);
    linear_classPrivateFieldInitSpec(this, _onLoadedmetadataPlayFn, null);
    linear_classPrivateFieldInitSpec(this, _onContextMenuFn, null);
    linear_classPrivateFieldInitSpec(this, _onPlaybackErrorFn, null);
    linear_classPrivateFieldInitSpec(this, _onInteractionOpenClickThroughUrlFn, null);
    linear_classPrivateFieldInitSpec(this, _creativeLoadTimeoutCallback, null);
    linear_classPrivateFieldInitSpec(this, _hlsJS, []);
    linear_classPrivateFieldInitSpec(this, _hlsJSIndex, 0);
    linear_classPrivateFieldInitSpec(this, _readingHlsJS, false);
    linear_classPrivateFieldSet(linear_rmpVast, this, rmpVast);
    linear_classPrivateFieldSet(linear_params, this, rmpVast.params);
    linear_classPrivateFieldSet(linear_adContainer, this, rmpVast.adContainer);
    linear_classPrivateFieldSet(linear_adPlayer, this, rmpVast.currentAdPlayer);
    linear_classPrivateFieldSet(_contentPlayer, this, rmpVast.currentContentPlayer);
  }
  get hlsJSInstances() {
    return linear_classPrivateFieldGet(_hlsJS, this);
  }
  get hlsJSIndex() {
    return linear_classPrivateFieldGet(_hlsJSIndex, this);
  }
  set hlsJSIndex(value) {
    linear_classPrivateFieldSet(_hlsJSIndex, this, value);
  }
  get readingHlsJS() {
    return linear_classPrivateFieldGet(_readingHlsJS, this);
  }
  set readingHlsJS(value) {
    linear_classPrivateFieldSet(_readingHlsJS, this, value);
  }
  get skippableAdCanBeSkipped() {
    return linear_classPrivateFieldGet(_skippableAdCanBeSkipped, this);
  }
  destroy() {
    if (linear_classPrivateFieldGet(_interactionMobileUI, this)) {
      linear_classPrivateFieldGet(_interactionMobileUI, this).removeEventListener('touchend', linear_classPrivateFieldGet(_onInteractionOpenClickThroughUrlFn, this));
      FW.removeElement(linear_classPrivateFieldGet(_interactionMobileUI, this));
    }
    window.clearTimeout(linear_classPrivateFieldGet(_creativeLoadTimeoutCallback, this));
    FW.removeElement(linear_classPrivateFieldGet(_skipButtonUI, this));
    if (linear_classPrivateFieldGet(linear_adPlayer, this)) {
      linear_classPrivateFieldGet(linear_adPlayer, this).removeEventListener('click', linear_classPrivateFieldGet(_onInteractionOpenClickThroughUrlFn, this));
      linear_classPrivateFieldGet(linear_adPlayer, this).removeEventListener('timeupdate', linear_classPrivateFieldGet(_onTimeupdateCheckSkipFn, this));
      linear_classPrivateFieldGet(linear_adPlayer, this).removeEventListener('durationchange', linear_classPrivateFieldGet(_onDurationChangeFn, this));
      linear_classPrivateFieldGet(linear_adPlayer, this).removeEventListener('loadedmetadata', linear_classPrivateFieldGet(_onLoadedmetadataPlayFn, this));
      linear_classPrivateFieldGet(linear_adPlayer, this).removeEventListener('contextmenu', linear_classPrivateFieldGet(_onContextMenuFn, this));
      linear_classPrivateFieldGet(linear_adPlayer, this).removeEventListener('error', linear_classPrivateFieldGet(_onPlaybackErrorFn, this));
    }
    linear_classPrivateFieldGet(_contentPlayer, this).removeEventListener('error', linear_classPrivateFieldGet(_onPlaybackErrorFn, this));
  }
  update(url, type) {
    Logger.print(linear_classPrivateFieldGet(linear_rmpVast, this).debugRawConsoleLogs, `update ad player for linear creative of type ${type} located at ${url}`);
    linear_classPrivateFieldSet(_onDurationChangeFn, this, linear_assertClassBrand(_LinearCreative_brand, this, _onDurationChange).bind(this));
    linear_classPrivateFieldGet(linear_adPlayer, this).addEventListener('durationchange', linear_classPrivateFieldGet(_onDurationChangeFn, this), {
      once: true
    });

    // when creative is loaded play it 
    linear_classPrivateFieldSet(_onLoadedmetadataPlayFn, this, linear_assertClassBrand(_LinearCreative_brand, this, _onLoadedmetadataPlay).bind(this));
    linear_classPrivateFieldGet(linear_adPlayer, this).addEventListener('loadedmetadata', linear_classPrivateFieldGet(_onLoadedmetadataPlayFn, this), {
      once: true
    });

    // prevent built in menu to show on right click
    linear_classPrivateFieldSet(_onContextMenuFn, this, FW.stopPreventEvent);
    linear_classPrivateFieldGet(linear_adPlayer, this).addEventListener('contextmenu', linear_classPrivateFieldGet(_onContextMenuFn, this));
    linear_classPrivateFieldSet(_onPlaybackErrorFn, this, linear_assertClassBrand(_LinearCreative_brand, this, _onPlaybackError).bind(this));

    // start creativeLoadTimeout
    linear_classPrivateFieldSet(_creativeLoadTimeoutCallback, this, window.setTimeout(() => {
      linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastUtils.processVastErrors(402, true);
    }, linear_classPrivateFieldGet(linear_params, this).creativeLoadTimeout));
    if (linear_classPrivateFieldGet(linear_params, this).useHlsJS && type === 'application/vnd.apple.mpegurl' && typeof window.Hls !== 'undefined' && Hls.isSupported()) {
      linear_classPrivateFieldSet(_readingHlsJS, this, true);
      const hlsJSConfig = {
        debug: linear_classPrivateFieldGet(linear_params, this).debugHlsJS,
        capLevelToPlayerSize: true,
        testBandwidth: true,
        startLevel: -1,
        lowLatencyMode: false
      };
      linear_classPrivateFieldGet(_hlsJS, this)[linear_classPrivateFieldGet(_hlsJSIndex, this)] = new Hls(hlsJSConfig);
      linear_classPrivateFieldGet(_hlsJS, this)[linear_classPrivateFieldGet(_hlsJSIndex, this)].on(Hls.Events.ERROR, linear_assertClassBrand(_LinearCreative_brand, this, _onHlsJSError).bind(this));
      linear_classPrivateFieldGet(_hlsJS, this)[linear_classPrivateFieldGet(_hlsJSIndex, this)].loadSource(url);
      linear_classPrivateFieldGet(_hlsJS, this)[linear_classPrivateFieldGet(_hlsJSIndex, this)].attachMedia(linear_classPrivateFieldGet(linear_adPlayer, this));
    } else {
      if (typeof linear_classPrivateFieldGet(linear_rmpVast, this).creative.simid === 'undefined' || linear_classPrivateFieldGet(linear_rmpVast, this).creative.simid && !linear_classPrivateFieldGet(linear_params, this).enableSimid) {
        linear_classPrivateFieldGet(linear_adPlayer, this).addEventListener('error', linear_classPrivateFieldGet(_onPlaybackErrorFn, this));
        linear_classPrivateFieldGet(linear_adPlayer, this).src = url;
        // we need this extra load for Chrome data saver mode in mobile or desktop
        linear_classPrivateFieldGet(linear_adPlayer, this).load();
      } else {
        if (linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastSimidPlayer) {
          linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastSimidPlayer.stopAd();
        }
        linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastSimidPlayer = new SimidPlayer(url, linear_classPrivateFieldGet(linear_rmpVast, this));
        linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastSimidPlayer.initializeAd();
        linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastSimidPlayer.playAd();
      }
    }

    // clickthrough interaction
    linear_classPrivateFieldSet(_onInteractionOpenClickThroughUrlFn, this, linear_assertClassBrand(_LinearCreative_brand, this, _onInteractionOpenClickThroughUrl).bind(this));
    if (linear_classPrivateFieldGet(linear_rmpVast, this).creative.clickThroughUrl) {
      if (Environment.isMobile) {
        // we create a <a> tag rather than using window.open 
        // because it works better in standalone mode and WebView
        linear_classPrivateFieldSet(_interactionMobileUI, this, document.createElement('a'));
        linear_classPrivateFieldGet(_interactionMobileUI, this).className = 'rmp-ad-click-ui-mobile';
        linear_classPrivateFieldGet(_interactionMobileUI, this).textContent = linear_classPrivateFieldGet(linear_params, this).labels.textForInteractionUIOnMobile;
        linear_classPrivateFieldGet(_interactionMobileUI, this).addEventListener('touchend', linear_classPrivateFieldGet(_onInteractionOpenClickThroughUrlFn, this));
        linear_classPrivateFieldGet(_interactionMobileUI, this).href = linear_classPrivateFieldGet(linear_rmpVast, this).creative.clickThroughUrl;
        linear_classPrivateFieldGet(_interactionMobileUI, this).target = '_blank';
        linear_classPrivateFieldGet(linear_adContainer, this).appendChild(linear_classPrivateFieldGet(_interactionMobileUI, this));
      } else {
        linear_classPrivateFieldGet(linear_adPlayer, this).addEventListener('click', linear_classPrivateFieldGet(_onInteractionOpenClickThroughUrlFn, this));
      }
    }

    // skippable - only where ad player is different from 
    // content player
    if (linear_classPrivateFieldGet(linear_rmpVast, this).creative.isSkippableAd) {
      linear_assertClassBrand(_LinearCreative_brand, this, _appendSkipUI).call(this);
    }
  }
  parse(creative) {
    const icons = creative.icons;
    const adParameters = creative.adParameters;
    const mediaFiles = creative.mediaFiles;
    // some linear tags may pass till here but have empty MediaFiles
    // this is against specification so we return
    if (mediaFiles.length === 0) {
      return;
    }
    if (icons.length > 0) {
      linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastIcons = new Icons(linear_classPrivateFieldGet(linear_rmpVast, this));
      linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastIcons.parse(icons);
    }
    // check for AdParameters tag in case we have a VPAID creative
    linear_classPrivateFieldGet(linear_rmpVast, this).adParametersData = '';
    if (adParameters && adParameters.value) {
      linear_classPrivateFieldGet(linear_rmpVast, this).adParametersData = adParameters.value;
    }
    let mediaFileItems = [];
    let isVpaid = false;
    for (let i = 0; i < mediaFiles.length; i++) {
      const currentMediaFile = mediaFiles[i];
      const mediaFileValue = currentMediaFile.fileURL;
      const type = currentMediaFile.mimeType;
      if (mediaFileValue === null || type === null) {
        continue;
      }
      const newMediaFileItem = {};
      newMediaFileItem.url = mediaFileValue;
      newMediaFileItem.type = type;
      if (currentMediaFile.codec !== null) {
        newMediaFileItem.codec = currentMediaFile.codec;
      }
      // check for potential VPAID - we have a VPAID JS - we break
      // for VPAID we may not have a width, height or delivery
      const vpaidPattern = /vpaid/i;
      const jsPattern = /\/javascript/i;
      if (linear_classPrivateFieldGet(linear_params, this).enableVpaid && currentMediaFile.apiFramework && vpaidPattern.test(currentMediaFile.apiFramework) && jsPattern.test(type)) {
        Logger.print(linear_classPrivateFieldGet(linear_rmpVast, this).debugRawConsoleLogs, `VPAID creative detected`);
        mediaFileItems = [newMediaFileItem];
        isVpaid = true;
        break;
      }
      newMediaFileItem.width = currentMediaFile.width;
      newMediaFileItem.height = currentMediaFile.height;
      newMediaFileItem.bitrate = currentMediaFile.bitrate;
      push_default()(mediaFileItems).call(mediaFileItems, newMediaFileItem);
    }
    // we support HLS; MP4; WebM: VPAID so let us fecth for those
    const creatives = [];
    for (let j = 0; j < mediaFileItems.length; j++) {
      const currentMediaFileItem = mediaFileItems[j];
      const type = currentMediaFileItem.type;
      const url = currentMediaFileItem.url;
      if (isVpaid && url) {
        linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastVpaidPlayer = new VpaidPlayer(linear_classPrivateFieldGet(linear_rmpVast, this));
        linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastVpaidPlayer.init(url, linear_classPrivateFieldGet(linear_params, this).vpaidSettings);
        linear_classPrivateFieldGet(linear_rmpVast, this).creative.type = type;
        return;
      }
      // we have HLS > use hls.js where no native support for HLS is available or native HLS otherwise (Apple devices mainly)
      if (linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer) {
        if (type === 'application/vnd.apple.mpegurl' && (Environment.checkCanPlayType(type) || typeof window.Hls !== 'undefined' && Hls.isSupported())) {
          linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer.append(url, type);
          linear_classPrivateFieldGet(linear_rmpVast, this).creative.type = type;
          return;
        }
        // we have DASH and DASH is natively supported > use DASH
        if (Environment.checkCanPlayType('application/dash+xml')) {
          linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer.append(url, type);
          linear_classPrivateFieldGet(linear_rmpVast, this).creative.type = type;
          return;
        }
      }
      // we gather MP4, WebM, OGG and remaining files
      push_default()(creatives).call(creatives, currentMediaFileItem);
    }
    if (isVpaid) {
      return;
    }
    let retainedCreatives = [];
    const commonVideoFormats = ['video/webm', 'video/mp4', 'video/ogg', 'video/3gpp'];
    // first we check for the common formats below ... 
    const __filterCommonCreatives = (i, creative) => {
      if (creative.codec && creative.type === commonVideoFormats[i]) {
        return Environment.checkCanPlayType(creative.type, creative.codec);
      } else if (creative.type === commonVideoFormats[i]) {
        return Environment.checkCanPlayType(creative.type);
      }
      return false;
    };
    for (let k = 0; k < commonVideoFormats.length; k++) {
      retainedCreatives = creatives.filter(__filterCommonCreatives.bind(null, k));
      if (retainedCreatives.length > 0) {
        break;
      }
    }
    // ... if none of the common format work, then we check for exotic format
    // first we check for those with codec information as it provides more accurate support indication ...
    if (retainedCreatives.length === 0) {
      const __filterCodecCreatives = (codec, type, creative) => {
        return creative.codec === codec && creative.type === type;
      };
      creatives.forEach(creative => {
        if (creative.codec && creative.type && Environment.checkCanPlayType(creative.type, creative.codec)) {
          retainedCreatives = creatives.filter(__filterCodecCreatives.bind(null, creative.codec, creative.type));
        }
      });
    }
    // ... if codec information are not available then we go first type matching
    if (retainedCreatives.length === 0) {
      const __filterTypeCreatives = (type, creative) => {
        return creative.type === type;
      };
      creatives.forEach(creative => {
        if (creative.type && Environment.checkCanPlayType(creative.type)) {
          retainedCreatives = creatives.filter(__filterTypeCreatives.bind(null, creative.type));
        }
      });
    }

    // still no match for supported format - we exit
    if (retainedCreatives.length === 0) {
      // None of the MediaFile provided are supported by the player
      linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastUtils.processVastErrors(403, true);
      return;
    }

    // sort supported creatives by width
    sort_default()(retainedCreatives).call(retainedCreatives, (a, b) => {
      return a.width - b.width;
    });
    Logger.print(linear_classPrivateFieldGet(linear_rmpVast, this).debugRawConsoleLogs, `Vavailable linear creative follows`, retainedCreatives);

    // we have files matching device capabilities
    // select the best one based on player current width
    let finalCreative;
    let validCreativesByWidth = [];
    let validCreativesByBitrate = [];
    if (retainedCreatives.length > 1) {
      const containerWidth = FW.getWidth(linear_classPrivateFieldGet(linear_rmpVast, this).container) * Environment.devicePixelRatio;
      const containerHeight = FW.getHeight(linear_classPrivateFieldGet(linear_rmpVast, this).container) * Environment.devicePixelRatio;
      if (containerWidth > 0 && containerHeight > 0) {
        validCreativesByWidth = retainedCreatives.filter(creative => {
          return containerWidth >= creative.width && containerHeight >= creative.height;
        });
      }
      Logger.print(linear_classPrivateFieldGet(linear_rmpVast, this).debugRawConsoleLogs, `validCreativesByWidth follow`, validCreativesByWidth);

      // if no match by size 
      if (validCreativesByWidth.length === 0) {
        validCreativesByWidth = [retainedCreatives[0]];
      }

      // filter by bitrate to provide best quality
      const rmpConnection = new RmpConnection();
      let availableBandwidth = rmpConnection.bandwidthData.estimate;
      Logger.print(linear_classPrivateFieldGet(linear_rmpVast, this).debugRawConsoleLogs, `availableBandwidth is ${availableBandwidth} Mbps`);
      if (availableBandwidth > -1 && validCreativesByWidth.length > 1) {
        // sort supported creatives by bitrates
        sort_default()(validCreativesByWidth).call(validCreativesByWidth, (a, b) => {
          return a.bitrate - b.bitrate;
        });
        // convert to kbps
        availableBandwidth = Math.round(availableBandwidth * 1000);
        validCreativesByBitrate = validCreativesByWidth.filter(creative => {
          return availableBandwidth >= creative.bitrate;
        });
        Logger.print(linear_classPrivateFieldGet(linear_rmpVast, this).debugRawConsoleLogs, `validCreativesByBitrate follow`, validCreativesByBitrate);

        // pick max available bitrate
        finalCreative = validCreativesByBitrate[validCreativesByBitrate.length - 1];
      }
    }

    // if no match by bitrate 
    if (!finalCreative) {
      if (validCreativesByWidth.length > 0) {
        finalCreative = validCreativesByWidth[validCreativesByWidth.length - 1];
      } else {
        sort_default()(retainedCreatives).call(retainedCreatives, (a, b) => {
          return a.bitrate - b.bitrate;
        });
        finalCreative = retainedCreatives[retainedCreatives.length - 1];
      }
    }
    Logger.print(linear_classPrivateFieldGet(linear_rmpVast, this).debugRawConsoleLogs, `selected linear creative follows`, finalCreative);
    linear_classPrivateFieldGet(linear_rmpVast, this).creative.mediaUrl = finalCreative.url;
    linear_classPrivateFieldGet(linear_rmpVast, this).creative.height = finalCreative.height;
    linear_classPrivateFieldGet(linear_rmpVast, this).creative.width = finalCreative.width;
    linear_classPrivateFieldGet(linear_rmpVast, this).creative.type = finalCreative.type;
    if (linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer) {
      linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer.append(finalCreative.url, finalCreative.type);
    }
  }
}
function _onDurationChange() {
  let adPlayerDuration = -1;
  if (linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer) {
    adPlayerDuration = linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer.duration;
  }
  linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastUtils.createApiEvent('addurationchange');
  // progress event
  if (adPlayerDuration === -1) {
    return;
  }
  const keys = Object.keys(linear_classPrivateFieldGet(linear_rmpVast, this).creative.trackingEvents);
  keys.forEach(eventName => {
    if (/progress-/i.test(eventName)) {
      const time = eventName.split('-');
      const time_2 = time[1];
      if (/%/i.test(time_2)) {
        let timePerCent = time_2.slice(0, -1);
        timePerCent = adPlayerDuration * parse_float_default()(timePerCent) / 100;
        const trackingUrls = linear_classPrivateFieldGet(linear_rmpVast, this).creative.trackingEvents[eventName];
        trackingUrls.forEach(url => {
          var _context;
          push_default()(_context = linear_classPrivateFieldGet(linear_rmpVast, this).progressEvents).call(_context, {
            time: timePerCent,
            url
          });
        });
      } else {
        const trackingUrls = linear_classPrivateFieldGet(linear_rmpVast, this).creative.trackingEvents[eventName];
        trackingUrls.forEach(url => {
          var _context2;
          push_default()(_context2 = linear_classPrivateFieldGet(linear_rmpVast, this).progressEvents).call(_context2, {
            time: parse_float_default()(time_2) * 1000,
            url
          });
        });
      }
    }
  });
  // sort progress time ascending
  if (linear_classPrivateFieldGet(linear_rmpVast, this).progressEvents.length > 0) {
    var _context3;
    sort_default()(_context3 = linear_classPrivateFieldGet(linear_rmpVast, this).progressEvents).call(_context3, (a, b) => {
      return a.time - b.time;
    });
  }
}
function _onLoadedmetadataPlay() {
  window.clearTimeout(linear_classPrivateFieldGet(_creativeLoadTimeoutCallback, this));
  // adjust volume to make sure content player volume matches ad player volume
  if (linear_classPrivateFieldGet(linear_adPlayer, this)) {
    if (linear_classPrivateFieldGet(linear_adPlayer, this).volume !== linear_classPrivateFieldGet(_contentPlayer, this).volume) {
      linear_classPrivateFieldGet(linear_adPlayer, this).volume = linear_classPrivateFieldGet(_contentPlayer, this).volume;
    }
    if (linear_classPrivateFieldGet(_contentPlayer, this).muted) {
      linear_classPrivateFieldGet(linear_adPlayer, this).muted = true;
    } else {
      linear_classPrivateFieldGet(linear_adPlayer, this).muted = false;
    }
  }
  // show ad container holding ad player
  FW.show(linear_classPrivateFieldGet(linear_adContainer, this));
  FW.show(linear_classPrivateFieldGet(linear_adPlayer, this));
  linear_classPrivateFieldGet(linear_rmpVast, this).__adOnStage = true;
  // play ad player
  if (linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer) {
    linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer.play(linear_classPrivateFieldGet(_firstAdPlayerPlayRequest, this));
    linear_classPrivateFieldSet(_firstAdPlayerPlayRequest, this, false);
  }
  linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adloaded');
}
function _onInteractionOpenClickThroughUrl(event) {
  if (event) {
    event.stopPropagation();
  }
  if (!Environment.isMobile) {
    FW.openWindow(linear_classPrivateFieldGet(linear_rmpVast, this).creative.clickThroughUrl);
  }
  linear_classPrivateFieldGet(linear_rmpVast, this).pause();
  linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adclick');
}
function _onPlaybackError(event) {
  // https://www.w3.org/TR/html50/embedded-content-0.html#mediaerror
  // MEDIA_ERR_SRC_NOT_SUPPORTED is sign of fatal error
  // other errors may produce non-fatal error in the browser so we do not 
  // act upon them
  if (event && event.target) {
    const videoElement = event.target;
    if (videoElement.error && FW.isNumber(videoElement.error.code)) {
      const errorCode = videoElement.error.code;
      let errorMessage = '';
      if (typeof videoElement.error.message === 'string') {
        errorMessage = videoElement.error.message;
      }
      const htmlMediaErrorTypes = ['MEDIA_ERR_CUSTOM', 'MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED', 'MEDIA_ERR_ENCRYPTED'];
      console.error(`Error on video element with code ${errorCode.toString()} and message ${errorMessage}`);
      Logger.print(linear_classPrivateFieldGet(linear_rmpVast, this).debugRawConsoleLogs, `error type is ${htmlMediaErrorTypes[errorCode] ? htmlMediaErrorTypes[errorCode] : 'unknown type'}`);

      // MEDIA_ERR_SRC_NOT_SUPPORTED (numeric value 4)
      if (errorCode === 4) {
        linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastUtils.processVastErrors(401, true);
      }
    }
  }
}
function _updateWaitingForCanBeSkippedUI(delta) {
  if (Math.round(delta) > 0) {
    linear_classPrivateFieldGet(_skipWaitingUI, this).textContent = linear_classPrivateFieldGet(linear_params, this).labels.skipMessage + ' ' + Math.round(delta) + 's';
  }
}
function _onTimeupdateCheckSkip() {
  if (linear_classPrivateFieldGet(_skipButtonUI, this).style.display === 'none') {
    FW.setStyle(linear_classPrivateFieldGet(_skipButtonUI, this), {
      display: 'block'
    });
  }
  const adPlayerCurrentTime = linear_classPrivateFieldGet(linear_adPlayer, this).currentTime;
  if (FW.isNumber(adPlayerCurrentTime) && adPlayerCurrentTime > 0) {
    if (adPlayerCurrentTime >= linear_classPrivateFieldGet(linear_rmpVast, this).creative.skipoffset) {
      linear_classPrivateFieldGet(linear_adPlayer, this).removeEventListener('timeupdate', linear_classPrivateFieldGet(_onTimeupdateCheckSkipFn, this));
      FW.setStyle(linear_classPrivateFieldGet(_skipWaitingUI, this), {
        display: 'none'
      });
      FW.setStyle(linear_classPrivateFieldGet(_skipMessageUI, this), {
        display: 'block'
      });
      FW.setStyle(linear_classPrivateFieldGet(_skipIconUI, this), {
        display: 'block'
      });
      linear_classPrivateFieldSet(_skippableAdCanBeSkipped, this, true);
      linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastUtils.createApiEvent('adskippablestatechanged');
    } else if (linear_classPrivateFieldGet(linear_rmpVast, this).creative.skipoffset - adPlayerCurrentTime > 0) {
      linear_assertClassBrand(_LinearCreative_brand, this, _updateWaitingForCanBeSkippedUI).call(this, linear_classPrivateFieldGet(linear_rmpVast, this).creative.skipoffset - adPlayerCurrentTime);
    }
  }
}
function _onSkipInteraction(event) {
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  if (linear_classPrivateFieldGet(_skippableAdCanBeSkipped, this)) {
    linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adskipped');
    // resume content
    if (linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer) {
      linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastAdPlayer.resumeContent();
    }
  }
}
function _appendSkipUI() {
  const skipMessage = linear_classPrivateFieldGet(linear_params, this).labels.skipMessage;
  linear_classPrivateFieldSet(_skipButtonUI, this, document.createElement('div'));
  linear_classPrivateFieldGet(_skipButtonUI, this).className = 'rmp-ad-container-skip';
  FW.setStyle(linear_classPrivateFieldGet(_skipButtonUI, this), {
    display: 'none'
  });
  FW.makeButtonAccessible(linear_classPrivateFieldGet(_skipButtonUI, this), skipMessage);
  linear_classPrivateFieldSet(_skipWaitingUI, this, document.createElement('div'));
  linear_classPrivateFieldGet(_skipWaitingUI, this).className = 'rmp-ad-container-skip-waiting';
  linear_assertClassBrand(_LinearCreative_brand, this, _updateWaitingForCanBeSkippedUI).call(this, linear_classPrivateFieldGet(linear_rmpVast, this).creative.skipoffset);
  FW.setStyle(linear_classPrivateFieldGet(_skipWaitingUI, this), {
    display: 'block'
  });
  linear_classPrivateFieldSet(_skipMessageUI, this, document.createElement('div'));
  linear_classPrivateFieldGet(_skipMessageUI, this).className = 'rmp-ad-container-skip-message';
  linear_classPrivateFieldGet(_skipMessageUI, this).textContent = skipMessage;
  FW.setStyle(linear_classPrivateFieldGet(_skipMessageUI, this), {
    display: 'none'
  });
  linear_classPrivateFieldSet(_skipIconUI, this, document.createElement('div'));
  linear_classPrivateFieldGet(_skipIconUI, this).className = 'rmp-ad-container-skip-icon';
  FW.setStyle(linear_classPrivateFieldGet(_skipIconUI, this), {
    display: 'none'
  });
  const onSkipInteractionFn = linear_assertClassBrand(_LinearCreative_brand, this, _onSkipInteraction).bind(this);
  FW.addEvents(['click', 'touchend'], linear_classPrivateFieldGet(_skipButtonUI, this), onSkipInteractionFn);
  linear_classPrivateFieldGet(_skipButtonUI, this).appendChild(linear_classPrivateFieldGet(_skipWaitingUI, this));
  linear_classPrivateFieldGet(_skipButtonUI, this).appendChild(linear_classPrivateFieldGet(_skipMessageUI, this));
  linear_classPrivateFieldGet(_skipButtonUI, this).appendChild(linear_classPrivateFieldGet(_skipIconUI, this));
  linear_classPrivateFieldGet(linear_adContainer, this).appendChild(linear_classPrivateFieldGet(_skipButtonUI, this));
  linear_classPrivateFieldSet(_onTimeupdateCheckSkipFn, this, linear_assertClassBrand(_LinearCreative_brand, this, _onTimeupdateCheckSkip).bind(this));
  linear_classPrivateFieldGet(linear_adPlayer, this).addEventListener('timeupdate', linear_classPrivateFieldGet(_onTimeupdateCheckSkipFn, this));
}
function _onHlsJSError(event, data) {
  if (data.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        // try to recover network error
        linear_classPrivateFieldGet(_hlsJS, this)[linear_classPrivateFieldGet(_hlsJSIndex, this)].startLoad();
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        linear_classPrivateFieldGet(_hlsJS, this)[linear_classPrivateFieldGet(_hlsJSIndex, this)].recoverMediaError();
        break;
      default:
        linear_classPrivateFieldGet(linear_rmpVast, this).rmpVastUtils.processVastErrors(900, true);
        break;
    }
  }
}
;// ./src/js/creatives/non-linear.js


function non_linear_classPrivateMethodInitSpec(e, a) { non_linear_checkPrivateRedeclaration(e, a), a.add(e); }
function non_linear_classPrivateFieldInitSpec(e, t, a) { non_linear_checkPrivateRedeclaration(e, t), t.set(e, a); }
function non_linear_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function non_linear_classPrivateFieldGet(s, a) { return s.get(non_linear_assertClassBrand(s, a)); }
function non_linear_classPrivateFieldSet(s, a, r) { return s.set(non_linear_assertClassBrand(s, a), r), r; }
function non_linear_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }


var non_linear_rmpVast = /*#__PURE__*/new (weak_map_default())();
var non_linear_params = /*#__PURE__*/new (weak_map_default())();
var non_linear_adContainer = /*#__PURE__*/new (weak_map_default())();
var _container = /*#__PURE__*/new (weak_map_default())();
var _nonLinearMinSuggestedDuration = /*#__PURE__*/new (weak_map_default())();
var _firstContentPlayerPlayRequest = /*#__PURE__*/new (weak_map_default())();
var _nonLinearCloseElement = /*#__PURE__*/new (weak_map_default())();
var _nonLinearAElement = /*#__PURE__*/new (weak_map_default())();
var _nonLinearInnerElement = /*#__PURE__*/new (weak_map_default())();
var _nonLinearContainerElement = /*#__PURE__*/new (weak_map_default())();
var _closeButtonTimeoutFn = /*#__PURE__*/new (weak_map_default())();
var _NonLinearCreative_brand = /*#__PURE__*/new WeakSet();
class NonLinearCreative {
  constructor(rmpVast) {
    non_linear_classPrivateMethodInitSpec(this, _NonLinearCreative_brand);
    non_linear_classPrivateFieldInitSpec(this, non_linear_rmpVast, void 0);
    non_linear_classPrivateFieldInitSpec(this, non_linear_params, void 0);
    non_linear_classPrivateFieldInitSpec(this, non_linear_adContainer, void 0);
    non_linear_classPrivateFieldInitSpec(this, _container, void 0);
    non_linear_classPrivateFieldInitSpec(this, _nonLinearMinSuggestedDuration, 0);
    non_linear_classPrivateFieldInitSpec(this, _firstContentPlayerPlayRequest, true);
    non_linear_classPrivateFieldInitSpec(this, _nonLinearCloseElement, null);
    non_linear_classPrivateFieldInitSpec(this, _nonLinearAElement, null);
    non_linear_classPrivateFieldInitSpec(this, _nonLinearInnerElement, null);
    non_linear_classPrivateFieldInitSpec(this, _nonLinearContainerElement, null);
    non_linear_classPrivateFieldInitSpec(this, _closeButtonTimeoutFn, null);
    non_linear_classPrivateFieldSet(non_linear_rmpVast, this, rmpVast);
    non_linear_classPrivateFieldSet(non_linear_params, this, rmpVast.params);
    non_linear_classPrivateFieldSet(non_linear_adContainer, this, rmpVast.adContainer);
    non_linear_classPrivateFieldSet(_container, this, rmpVast.container);
  }
  destroy() {
    window.clearTimeout(non_linear_classPrivateFieldGet(_closeButtonTimeoutFn, this));
    try {
      FW.removeElement(non_linear_classPrivateFieldGet(_nonLinearContainerElement, this));
    } catch (error) {
      console.warn(error);
    }
  }
  update() {
    // non-linear ad container
    non_linear_classPrivateFieldSet(_nonLinearContainerElement, this, document.createElement('div'));
    non_linear_classPrivateFieldGet(_nonLinearContainerElement, this).className = 'rmp-ad-non-linear-container';
    FW.setStyle(non_linear_classPrivateFieldGet(_nonLinearContainerElement, this), {
      width: non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.width.toString() + 'px',
      height: non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.height.toString() + 'px'
    });

    // a tag to handle click - a tag is best for WebView support
    non_linear_classPrivateFieldSet(_nonLinearAElement, this, document.createElement('a'));
    non_linear_classPrivateFieldGet(_nonLinearAElement, this).className = 'rmp-ad-non-linear-anchor';
    if (non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.clickThroughUrl) {
      non_linear_classPrivateFieldGet(_nonLinearAElement, this).href = non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.clickThroughUrl;
      non_linear_classPrivateFieldGet(_nonLinearAElement, this).target = '_blank';
      const onNonLinearClickThroughFn = non_linear_assertClassBrand(_NonLinearCreative_brand, this, _onNonLinearClickThrough).bind(this);
      FW.addEvents(['touchend', 'click'], non_linear_classPrivateFieldGet(_nonLinearAElement, this), onNonLinearClickThroughFn);
    }

    // non-linear creative image
    if (non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.nonLinearType === 'image') {
      non_linear_classPrivateFieldSet(_nonLinearInnerElement, this, document.createElement('img'));
    } else {
      non_linear_classPrivateFieldSet(_nonLinearInnerElement, this, document.createElement('iframe'));
      non_linear_classPrivateFieldGet(_nonLinearInnerElement, this).sandbox = 'allow-scripts allow-same-origin';
      FW.setStyle(non_linear_classPrivateFieldGet(_nonLinearInnerElement, this), {
        border: 'none',
        overflow: 'hidden'
      });
      non_linear_classPrivateFieldGet(_nonLinearInnerElement, this).setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
      non_linear_classPrivateFieldGet(_nonLinearInnerElement, this).setAttribute('scrolling', 'no');
      non_linear_classPrivateFieldGet(_nonLinearInnerElement, this).setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    }
    non_linear_classPrivateFieldGet(_nonLinearInnerElement, this).className = 'rmp-ad-non-linear-creative';
    const onNonLinearLoadErrorFn = non_linear_assertClassBrand(_NonLinearCreative_brand, this, _onNonLinearLoadError).bind(this);
    non_linear_classPrivateFieldGet(_nonLinearInnerElement, this).addEventListener('error', onNonLinearLoadErrorFn);
    const onNonLinearLoadSuccessFn = non_linear_assertClassBrand(_NonLinearCreative_brand, this, _onNonLinearLoadSuccess).bind(this);
    non_linear_classPrivateFieldGet(_nonLinearInnerElement, this).addEventListener('load', onNonLinearLoadSuccessFn);
    if (non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.nonLinearType === 'html') {
      non_linear_classPrivateFieldGet(_nonLinearInnerElement, this).srcdoc = non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.mediaUrl;
    } else {
      non_linear_classPrivateFieldGet(_nonLinearInnerElement, this).src = non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.mediaUrl;
    }

    // append to adContainer
    non_linear_classPrivateFieldGet(_nonLinearAElement, this).appendChild(non_linear_classPrivateFieldGet(_nonLinearInnerElement, this));
    non_linear_classPrivateFieldGet(_nonLinearContainerElement, this).appendChild(non_linear_classPrivateFieldGet(_nonLinearAElement, this));
    non_linear_classPrivateFieldGet(non_linear_adContainer, this).appendChild(non_linear_classPrivateFieldGet(_nonLinearContainerElement, this));

    // display a close button when non-linear ad has reached minSuggestedDuration
    non_linear_assertClassBrand(_NonLinearCreative_brand, this, _appendCloseButton).call(this);
    FW.show(non_linear_classPrivateFieldGet(non_linear_adContainer, this));
    non_linear_classPrivateFieldGet(non_linear_rmpVast, this).rmpVastContentPlayer.play(non_linear_classPrivateFieldGet(_firstContentPlayerPlayRequest, this));
    non_linear_classPrivateFieldSet(_firstContentPlayerPlayRequest, this, false);
  }
  parse(variations) {
    Logger.print(non_linear_classPrivateFieldGet(non_linear_rmpVast, this).debugRawConsoleLogs, `non-linear creatives follow`, variations);
    let isDimensionError = false;
    let currentVariation;
    // The video player should poll each <NonLinear> element to determine 
    // which creative is offered in a format the video player can support.
    for (let i = 0; i < variations.length; i++) {
      isDimensionError = false;
      currentVariation = variations[i];
      let width = currentVariation.width;
      let height = currentVariation.height;
      // width/height attribute is required
      if (width <= 0) {
        width = 300;
      }
      if (height <= 0) {
        height = 44;
      }
      // if width of non-linear creative does not fit within current player container width 
      // we should skip this creative
      if (width > FW.getWidth(non_linear_classPrivateFieldGet(_container, this)) || height > FW.getHeight(non_linear_classPrivateFieldGet(_container, this))) {
        isDimensionError = true;
        continue;
      }
      // get minSuggestedDuration (optional)
      non_linear_classPrivateFieldSet(_nonLinearMinSuggestedDuration, this, currentVariation.minSuggestedDuration);
      const staticResource = currentVariation.staticResource;
      const iframeResource = currentVariation.iframeResource;
      const htmlResource = currentVariation.htmlResource;
      // we have a valid NonLinear/StaticResource with supported creativeType - we break
      if (staticResource !== null || iframeResource !== null || htmlResource !== null) {
        if (staticResource) {
          non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.mediaUrl = staticResource;
          non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.nonLinearType = 'image';
        } else if (iframeResource) {
          non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.mediaUrl = iframeResource;
          non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.nonLinearType = 'iframe';
        } else if (htmlResource) {
          non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.mediaUrl = htmlResource;
          non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.nonLinearType = 'html';
        }
        non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.width = width;
        non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.height = height;
        non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.type = currentVariation.type;
        Logger.print(non_linear_classPrivateFieldGet(non_linear_rmpVast, this).debugRawConsoleLogs, `selected non-linear creative`, non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative);
        break;
      }
    }
    // if not supported NonLinear type ping for error
    if (!non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.mediaUrl || isDimensionError) {
      let vastErrorCode = 503;
      if (isDimensionError) {
        vastErrorCode = 501;
      }
      non_linear_classPrivateFieldGet(non_linear_rmpVast, this).rmpVastUtils.processVastErrors(vastErrorCode, true);
      return;
    }
    non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.clickThroughUrl = currentVariation.nonlinearClickThroughURLTemplate;
    if (currentVariation.nonlinearClickTrackingURLTemplates.length > 0) {
      currentVariation.nonlinearClickTrackingURLTemplates.forEach(nonlinearClickTrackingURLTemplate => {
        if (nonlinearClickTrackingURLTemplate.url) {
          var _context;
          push_default()(_context = non_linear_classPrivateFieldGet(non_linear_rmpVast, this).trackingTags).call(_context, {
            event: 'clickthrough',
            url: nonlinearClickTrackingURLTemplate.url
          });
        }
      });
    }
    if (non_linear_classPrivateFieldGet(non_linear_rmpVast, this).rmpVastAdPlayer) {
      non_linear_classPrivateFieldGet(non_linear_rmpVast, this).rmpVastAdPlayer.append();
    }
  }
}
function _onNonLinearLoadError() {
  non_linear_classPrivateFieldGet(non_linear_rmpVast, this).rmpVastUtils.processVastErrors(502, true);
}
function _onNonLinearLoadSuccess() {
  Logger.print(non_linear_classPrivateFieldGet(non_linear_rmpVast, this).debugRawConsoleLogs, `success loading non-linear creative at ${non_linear_classPrivateFieldGet(non_linear_rmpVast, this).creative.mediaUrl}`);
  non_linear_classPrivateFieldGet(non_linear_rmpVast, this).__adOnStage = true;
  non_linear_classPrivateFieldGet(non_linear_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent(['adloaded', 'adimpression', 'adstarted', 'adcreativeview']);
}
function _onNonLinearClickThrough(event) {
  try {
    if (event) {
      event.stopPropagation();
    }
    non_linear_classPrivateFieldGet(non_linear_rmpVast, this).pause();
    non_linear_classPrivateFieldGet(non_linear_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adclick');
  } catch (error) {
    console.warn(error);
  }
}
function _onClickCloseNonLinear(event) {
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  FW.setStyle(non_linear_classPrivateFieldGet(_nonLinearContainerElement, this), {
    display: 'none'
  });
  non_linear_classPrivateFieldGet(non_linear_rmpVast, this).rmpVastTracking.dispatchTrackingAndApiEvent('adclosed');
}
function _appendCloseButton() {
  non_linear_classPrivateFieldSet(_nonLinearCloseElement, this, document.createElement('div'));
  non_linear_classPrivateFieldGet(_nonLinearCloseElement, this).className = 'rmp-ad-non-linear-close';
  FW.makeButtonAccessible(non_linear_classPrivateFieldGet(_nonLinearCloseElement, this), non_linear_classPrivateFieldGet(non_linear_params, this).labels.closeAd);
  if (non_linear_classPrivateFieldGet(_nonLinearMinSuggestedDuration, this) > 0) {
    FW.setStyle(non_linear_classPrivateFieldGet(_nonLinearCloseElement, this), {
      display: 'none'
    });
    window.clearTimeout(non_linear_classPrivateFieldGet(_closeButtonTimeoutFn, this));
    non_linear_classPrivateFieldSet(_closeButtonTimeoutFn, this, window.setTimeout(() => {
      FW.setStyle(non_linear_classPrivateFieldGet(_nonLinearCloseElement, this), {
        display: 'block'
      });
    }, non_linear_classPrivateFieldGet(_nonLinearMinSuggestedDuration, this) * 1000));
  } else {
    FW.setStyle(non_linear_classPrivateFieldGet(_nonLinearCloseElement, this), {
      display: 'block'
    });
  }
  const onClickCloseNonLinearFn = non_linear_assertClassBrand(_NonLinearCreative_brand, this, _onClickCloseNonLinear).bind(this);
  FW.addEvents(['touchend', 'click'], non_linear_classPrivateFieldGet(_nonLinearCloseElement, this), onClickCloseNonLinearFn);
  non_linear_classPrivateFieldGet(_nonLinearContainerElement, this).appendChild(non_linear_classPrivateFieldGet(_nonLinearCloseElement, this));
}
;// ./src/js/creatives/companion.js


function companion_classPrivateMethodInitSpec(e, a) { companion_checkPrivateRedeclaration(e, a), a.add(e); }
function companion_classPrivateFieldInitSpec(e, t, a) { companion_checkPrivateRedeclaration(e, t), t.set(e, a); }
function companion_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function companion_classPrivateFieldGet(s, a) { return s.get(companion_assertClassBrand(s, a)); }
function companion_classPrivateFieldSet(s, a, r) { return s.set(companion_assertClassBrand(s, a), r), r; }
function companion_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }


var companion_rmpVast = /*#__PURE__*/new (weak_map_default())();
var _requiredAttribute = /*#__PURE__*/new (weak_map_default())();
var _validCompanionAds = /*#__PURE__*/new (weak_map_default())();
var _companionAdsList = /*#__PURE__*/new (weak_map_default())();
var _CompanionCreative_brand = /*#__PURE__*/new WeakSet();
class CompanionCreative {
  constructor(rmpVast) {
    companion_classPrivateMethodInitSpec(this, _CompanionCreative_brand);
    companion_classPrivateFieldInitSpec(this, companion_rmpVast, void 0);
    companion_classPrivateFieldInitSpec(this, _requiredAttribute, '');
    companion_classPrivateFieldInitSpec(this, _validCompanionAds, []);
    companion_classPrivateFieldInitSpec(this, _companionAdsList, []);
    companion_classPrivateFieldSet(companion_rmpVast, this, rmpVast);
  }
  get requiredAttribute() {
    return companion_classPrivateFieldGet(_requiredAttribute, this);
  }
  reset() {
    companion_classPrivateFieldSet(_requiredAttribute, this, '');
    companion_classPrivateFieldSet(_validCompanionAds, this, []);
    companion_classPrivateFieldSet(_companionAdsList, this, []);
  }
  parse(creative) {
    // reset variables in case wrapper
    companion_classPrivateFieldSet(_validCompanionAds, this, []);
    companion_classPrivateFieldSet(_requiredAttribute, this, '');
    if (creative.required) {
      companion_classPrivateFieldSet(_requiredAttribute, this, creative.required);
    }
    const companions = creative.variations;
    // at least 1 Companion is expected to continue
    if (companions.length > 0) {
      for (let i = 0; i < companions.length; i++) {
        var _context2;
        const companion = companions[i];
        const newCompanionAds = {
          width: companion.width,
          height: companion.height
        };
        const staticResourceFound = companion.staticResources.find(staticResource => {
          if (staticResource.url) {
            return true;
          }
          return false;
        });
        const iframeResourceFound = companion.iframeResources.find(iframeResource => {
          if (iframeResource) {
            return true;
          }
          return false;
        });
        const htmlResourceFound = companion.htmlResources.find(htmlResource => {
          if (htmlResource) {
            return true;
          }
          return false;
        });
        if (staticResourceFound && staticResourceFound.url) {
          newCompanionAds.imageUrl = staticResourceFound.url;
        }
        if (iframeResourceFound && iframeResourceFound.length > 0) {
          newCompanionAds.iframeUrl = iframeResourceFound;
        }
        if (htmlResourceFound && htmlResourceFound.length > 0) {
          newCompanionAds.htmlContent = htmlResourceFound;
        }
        // if no companion content for this <Companion> then move on to the next
        if (typeof staticResourceFound === 'undefined' && typeof iframeResourceFound === 'undefined' && typeof htmlResourceFound === 'undefined') {
          continue;
        }
        if (companion.companionClickThroughURLTemplate) {
          newCompanionAds.companionClickThroughUrl = companion.companionClickThroughURLTemplate;
        }
        if (companion.companionClickTrackingURLTemplates.length > 0) {
          newCompanionAds.companionClickTrackingUrls = companion.companionClickTrackingURLTemplates;
        }
        if (companion.altText) {
          newCompanionAds.altText = companion.altText;
        }
        if (companion.adSlotId) {
          newCompanionAds.adSlotId = companion.adSlotId;
        }
        newCompanionAds.trackingEventsUrls = [];
        if (companion.trackingEvents && companion.trackingEvents.creativeView) {
          companion.trackingEvents.creativeView.forEach(creativeView => {
            var _context;
            push_default()(_context = newCompanionAds.trackingEventsUrls).call(_context, creativeView);
          });
        }
        push_default()(_context2 = companion_classPrivateFieldGet(_validCompanionAds, this)).call(_context2, newCompanionAds);
      }
    }
    Logger.print(companion_classPrivateFieldGet(companion_rmpVast, this).debugRawConsoleLogs, `Parse companion ads follow`, companion_classPrivateFieldGet(_validCompanionAds, this));
  }
  getList(inputWidth, inputHeight) {
    if (companion_classPrivateFieldGet(_validCompanionAds, this).length > 0) {
      let availableCompanionAds;
      if (typeof inputWidth === 'number' && inputWidth > 0 && typeof inputHeight === 'number' && inputHeight > 0) {
        availableCompanionAds = companion_classPrivateFieldGet(_validCompanionAds, this).filter(companionAds => {
          return inputWidth >= companionAds.width && inputHeight >= companionAds.height;
        });
      } else {
        availableCompanionAds = companion_classPrivateFieldGet(_validCompanionAds, this);
      }
      if (availableCompanionAds.length > 0) {
        companion_classPrivateFieldSet(_companionAdsList, this, availableCompanionAds);
        return companion_classPrivateFieldGet(_companionAdsList, this);
      }
    }
    return [];
  }
  getItem(index) {
    if (typeof companion_classPrivateFieldGet(_companionAdsList, this)[index] === 'undefined') {
      return null;
    }
    const companionAd = companion_classPrivateFieldGet(_companionAdsList, this)[index];
    let html;
    if (companionAd.imageUrl || companionAd.iframeUrl) {
      if (companionAd.imageUrl) {
        html = document.createElement('img');
        if (companionAd.altText) {
          html.alt = companionAd.altText;
        }
      } else {
        html = document.createElement('iframe');
        html.sandbox = 'allow-scripts allow-same-origin';
      }
      html.width = companionAd.width;
      html.height = companionAd.height;
      html.style.cursor = 'pointer';
    } else if (companionAd.htmlContent) {
      html = companionAd.htmlContent;
    }
    if (companionAd.imageUrl || companionAd.iframeUrl) {
      const trackingEventsUrls = companionAd.trackingEventsUrls;
      if (trackingEventsUrls.length > 0) {
        html.onload = () => {
          trackingEventsUrls.forEach(trackingEventsUrl => {
            companion_classPrivateFieldGet(companion_rmpVast, this).rmpVastTracking.pingURI(trackingEventsUrl);
          });
        };
        html.onerror = () => {
          companion_classPrivateFieldGet(companion_rmpVast, this).rmpVastTracking.error(603);
        };
      }
      let companionClickTrackingUrls = null;
      if (companionAd.companionClickTrackingUrls) {
        Logger.print(companion_classPrivateFieldGet(companion_rmpVast, this).debugRawConsoleLogs, `Companion click tracking URIs`, companionClickTrackingUrls);
        companionClickTrackingUrls = companionAd.companionClickTrackingUrls;
      }
      if (companionAd.companionClickThroughUrl) {
        const onImgClickThroughFn = companion_assertClassBrand(_CompanionCreative_brand, this, _onImgClickThrough).bind(this, companionAd.companionClickThroughUrl, companionClickTrackingUrls);
        FW.addEvents(['touchend', 'click'], html, onImgClickThroughFn);
      }
    }
    if (companionAd.imageUrl) {
      html.src = companionAd.imageUrl;
    } else if (companionAd.iframeUrl) {
      html.src = companionAd.iframeUrl;
    } else if (companionAd.htmlContent) {
      try {
        const parser = new DOMParser();
        html = parser.parseFromString(companionAd.htmlContent, 'text/html');
        html = html.documentElement;
      } catch (error) {
        console.warn(error);
        return null;
      }
    }
    return html;
  }
}
function _onImgClickThrough(companionClickThroughUrl, companionClickTrackingUrls, event) {
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  if (companionClickTrackingUrls) {
    companionClickTrackingUrls.forEach(companionClickTrackingUrl => {
      if (companionClickTrackingUrl.url) {
        companion_classPrivateFieldGet(companion_rmpVast, this).rmpVastTracking.pingURI(companionClickTrackingUrl.url);
      }
    });
  }
  FW.openWindow(companionClickThroughUrl);
}
;// ./src/js/players/ad-player.js

function ad_player_classPrivateFieldInitSpec(e, t, a) { ad_player_checkPrivateRedeclaration(e, t), t.set(e, a); }
function ad_player_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function ad_player_classPrivateFieldGet(s, a) { return s.get(ad_player_assertClassBrand(s, a)); }
function ad_player_classPrivateFieldSet(s, a, r) { return s.set(ad_player_assertClassBrand(s, a), r), r; }
function ad_player_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }



var ad_player_rmpVast = /*#__PURE__*/new (weak_map_default())();
var ad_player_params = /*#__PURE__*/new (weak_map_default())();
var ad_player_contentPlayer = /*#__PURE__*/new (weak_map_default())();
var ad_player_adContainer = /*#__PURE__*/new (weak_map_default())();
var _contentWrapper = /*#__PURE__*/new (weak_map_default())();
var ad_player_adPlayer = /*#__PURE__*/new (weak_map_default())();
class AdPlayer {
  constructor(rmpVast) {
    ad_player_classPrivateFieldInitSpec(this, ad_player_rmpVast, void 0);
    ad_player_classPrivateFieldInitSpec(this, ad_player_params, void 0);
    ad_player_classPrivateFieldInitSpec(this, ad_player_contentPlayer, void 0);
    ad_player_classPrivateFieldInitSpec(this, ad_player_adContainer, void 0);
    ad_player_classPrivateFieldInitSpec(this, _contentWrapper, void 0);
    ad_player_classPrivateFieldInitSpec(this, ad_player_adPlayer, null);
    ad_player_classPrivateFieldSet(ad_player_rmpVast, this, rmpVast);
    ad_player_classPrivateFieldSet(ad_player_params, this, rmpVast.params);
    ad_player_classPrivateFieldSet(ad_player_contentPlayer, this, rmpVast.currentContentPlayer);
    ad_player_classPrivateFieldSet(ad_player_adContainer, this, rmpVast.adContainer);
    ad_player_classPrivateFieldSet(_contentWrapper, this, rmpVast.contentWrapper);
  }
  set volume(level) {
    if (ad_player_classPrivateFieldGet(ad_player_adPlayer, this)) {
      ad_player_classPrivateFieldGet(ad_player_adPlayer, this).volume = level;
    }
  }
  get volume() {
    if (ad_player_classPrivateFieldGet(ad_player_adPlayer, this)) {
      return ad_player_classPrivateFieldGet(ad_player_adPlayer, this).volume;
    }
    return -1;
  }
  set muted(muted) {
    if (ad_player_classPrivateFieldGet(ad_player_adPlayer, this)) {
      if (muted && !ad_player_classPrivateFieldGet(ad_player_adPlayer, this).muted) {
        ad_player_classPrivateFieldGet(ad_player_adPlayer, this).muted = true;
      } else if (!muted && ad_player_classPrivateFieldGet(ad_player_adPlayer, this).muted) {
        ad_player_classPrivateFieldGet(ad_player_adPlayer, this).muted = false;
      }
    }
  }
  get muted() {
    if (ad_player_classPrivateFieldGet(ad_player_adPlayer, this)) {
      return ad_player_classPrivateFieldGet(ad_player_adPlayer, this).muted;
    }
    return false;
  }
  get duration() {
    if (ad_player_classPrivateFieldGet(ad_player_adPlayer, this) && FW.isNumber(ad_player_classPrivateFieldGet(ad_player_adPlayer, this).duration)) {
      return ad_player_classPrivateFieldGet(ad_player_adPlayer, this).duration * 1000;
    }
    return -1;
  }
  get currentTime() {
    if (ad_player_classPrivateFieldGet(ad_player_adPlayer, this) && FW.isNumber(ad_player_classPrivateFieldGet(ad_player_adPlayer, this).currentTime)) {
      return ad_player_classPrivateFieldGet(ad_player_adPlayer, this).currentTime * 1000;
    }
    return -1;
  }
  destroy() {
    Logger.print(ad_player_classPrivateFieldGet(ad_player_rmpVast, this).debugRawConsoleLogs, `start destroying ad player`);

    // destroy icons if any 
    if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastIcons) {
      ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastIcons.destroy();
    }
    if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastVpaidPlayer) {
      ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastVpaidPlayer.destroy();
    }

    // reset non-linear creative
    if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastNonLinearCreative) {
      ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastNonLinearCreative.destroy();
    }

    // reset linear creative
    if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative) {
      ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative.destroy();
    }

    // unwire events
    ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastTracking.destroy();

    // hide rmp-ad-container
    FW.hide(ad_player_classPrivateFieldGet(ad_player_adContainer, this));

    // unwire anti-seek logic (iOS)
    if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastContentPlayer) {
      ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastContentPlayer.destroy();
    }
    // flush currentAdPlayer
    try {
      if (ad_player_classPrivateFieldGet(ad_player_adPlayer, this)) {
        ad_player_classPrivateFieldGet(ad_player_adPlayer, this).pause();
        if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative && ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative.readingHlsJS) {
          ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative.readingHlsJS = false;
          ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative.hlsJSInstances[ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative.hlsJSIndex].destroy();
          ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative.hlsJSIndex = ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative.hlsJSIndex++;
        } else {
          // empty buffer
          ad_player_classPrivateFieldGet(ad_player_adPlayer, this).removeAttribute('src');
          ad_player_classPrivateFieldGet(ad_player_adPlayer, this).load();
        }
        FW.hide(ad_player_classPrivateFieldGet(ad_player_adPlayer, this));
        Logger.print(ad_player_classPrivateFieldGet(ad_player_rmpVast, this).debugRawConsoleLogs, `flushing currentAdPlayer buffer after ad`);
      }
      if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastNonLinearCreative) {
        ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastNonLinearCreative.destroy();
      }
    } catch (error) {
      console.warn(error);
    }
    ad_player_classPrivateFieldGet(ad_player_rmpVast, this).resetVariablesForNewLoadAds();
    ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastUtils.createApiEvent('addestroyed');
  }
  init() {
    ad_player_classPrivateFieldGet(ad_player_rmpVast, this).adContainer = ad_player_classPrivateFieldSet(ad_player_adContainer, this, document.createElement('div'));
    ad_player_classPrivateFieldGet(ad_player_adContainer, this).className = 'rmp-ad-container';
    ad_player_classPrivateFieldGet(_contentWrapper, this).appendChild(ad_player_classPrivateFieldGet(ad_player_adContainer, this));
    FW.hide(ad_player_classPrivateFieldGet(ad_player_adContainer, this));
    ad_player_classPrivateFieldGet(ad_player_rmpVast, this).currentAdPlayer = ad_player_classPrivateFieldSet(ad_player_adPlayer, this, document.createElement('video'));
    Logger.printVideoEvents(ad_player_classPrivateFieldGet(ad_player_rmpVast, this).debugRawConsoleLogs, ad_player_classPrivateFieldGet(ad_player_adPlayer, this), 'ad');
    // disable native UI cast/PiP for ad player 
    // DEPRECATED - this is no longer necessary 
    //this.#adPlayer.disableRemotePlayback = true;
    //this.#adPlayer.disablePictureInPicture = true;
    ad_player_classPrivateFieldGet(ad_player_adPlayer, this).className = 'rmp-ad-vast-video-player';
    if (ad_player_classPrivateFieldGet(ad_player_params, this).showControlsForAdPlayer) {
      ad_player_classPrivateFieldGet(ad_player_adPlayer, this).controls = true;
    } else {
      ad_player_classPrivateFieldGet(ad_player_adPlayer, this).controls = false;
    }

    // this.currentContentPlayer.muted may not be set because of a bug in some version of Chromium
    if (ad_player_classPrivateFieldGet(ad_player_contentPlayer, this).hasAttribute('muted')) {
      ad_player_classPrivateFieldGet(ad_player_contentPlayer, this).muted = true;
    }
    if (ad_player_classPrivateFieldGet(ad_player_contentPlayer, this).muted) {
      ad_player_classPrivateFieldGet(ad_player_adPlayer, this).muted = true;
    }
    // black poster based 64 png
    ad_player_classPrivateFieldGet(ad_player_adPlayer, this).poster = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    // note to myself: we use setAttribute for non-standard attribute (instead of . notation)
    ad_player_classPrivateFieldGet(ad_player_adPlayer, this).setAttribute('x-webkit-airplay', 'allow');
    if (typeof ad_player_classPrivateFieldGet(ad_player_contentPlayer, this).playsInline === 'boolean' && ad_player_classPrivateFieldGet(ad_player_contentPlayer, this).playsInline) {
      ad_player_classPrivateFieldGet(ad_player_adPlayer, this).playsInline = true;
    }
    // append to rmp-ad-container
    FW.hide(ad_player_classPrivateFieldGet(ad_player_adPlayer, this));
    ad_player_classPrivateFieldGet(ad_player_adContainer, this).appendChild(ad_player_classPrivateFieldGet(ad_player_adPlayer, this));

    // we track ended state for content player
    ad_player_classPrivateFieldGet(ad_player_contentPlayer, this).addEventListener('ended', () => {
      if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).__adOnStage) {
        return;
      }
      ad_player_classPrivateFieldGet(ad_player_rmpVast, this).contentCompleted = true;
    });
    // we need to preload as much creative data as possible
    // also on macOS and iOS Safari we need to force preload to avoid 
    // playback issues
    ad_player_classPrivateFieldGet(ad_player_adPlayer, this).preload = 'auto';
    // we need to init the ad player video tag
    // according to https://developers.google.com/interactive-media-ads/docs/sdks/html5/mobile_video
    // to initialize the content element, a call to the load() method is sufficient.
    if (Environment.isMobile) {
      // on Android both this.currentContentPlayer (to resume content)
      // and this.currentAdPlayer (to start ads) needs to be init
      // on iOS only init this.currentAdPlayer (as same as this.currentContentPlayer)
      ad_player_classPrivateFieldGet(ad_player_contentPlayer, this).load();
      ad_player_classPrivateFieldGet(ad_player_adPlayer, this).load();
    }
    ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastInitialized = true;
  }
  append(url, type) {
    // in case loadAds is called several times - rmpVastInitialized is already true
    // but we still need to locate the currentAdPlayer
    if (!ad_player_classPrivateFieldGet(ad_player_adPlayer, this)) {
      // we use existing ad player as it is already 
      // available and initialized (no need for user interaction)
      let existingAdPlayer = null;
      if (ad_player_classPrivateFieldGet(ad_player_adContainer, this)) {
        existingAdPlayer = ad_player_classPrivateFieldGet(ad_player_adContainer, this).querySelector('.rmp-ad-vast-video-player');
      }
      if (existingAdPlayer === null) {
        ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastUtils.processVastErrors(900, true);
        return;
      }
      ad_player_classPrivateFieldSet(ad_player_adPlayer, this, existingAdPlayer);
    }
    ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastContentPlayer.pause();
    if (!ad_player_classPrivateFieldGet(ad_player_rmpVast, this).creative.isLinear) {
      // we do not display non-linear ads with outstream ad 
      // they won't fit the format
      if (ad_player_classPrivateFieldGet(ad_player_params, this).outstream) {
        Logger.print(ad_player_classPrivateFieldGet(ad_player_rmpVast, this).debugRawConsoleLogs, `non-linear creative detected for outstream ad mode - discarding creative`);
        ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastUtils.processVastErrors(201, true);
        return;
      } else {
        if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastNonLinearCreative) {
          ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastNonLinearCreative.update();
        }
      }
    } else {
      if (url && type && ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative) {
        ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative.update(url, type);
      }
    }
    // wire tracking events
    ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastTracking.wire();

    // append icons - only where ad player is different from 
    // content player
    if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastIcons) {
      const iconsData = ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastIcons.iconsData;
      if (iconsData.length > 0) {
        ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastIcons.append();
      }
    }
  }
  play(firstAdPlayerPlayRequest) {
    if (ad_player_classPrivateFieldGet(ad_player_adPlayer, this) && ad_player_classPrivateFieldGet(ad_player_adPlayer, this).paused) {
      ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastUtils.playPromise('vast', firstAdPlayerPlayRequest);
    }
  }
  pause() {
    if (ad_player_classPrivateFieldGet(ad_player_adPlayer, this) && !ad_player_classPrivateFieldGet(ad_player_adPlayer, this).paused) {
      ad_player_classPrivateFieldGet(ad_player_adPlayer, this).pause();
    }
  }
  resumeContent() {
    Logger.print(ad_player_classPrivateFieldGet(ad_player_rmpVast, this).debugRawConsoleLogs, `AdPlayer resumeContent requested`);
    if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastAdPlayer) {
      ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastAdPlayer.destroy();
    }
    if (ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative) {
      ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastLinearCreative.readingHlsJS = false;
    }
    // if contentPlayerCompleted = true - we are in a post-roll situation
    // in that case we must not resume content once the post-roll has completed
    // you can use contentPlayerCompleted to support 
    // custom use-cases when dynamically changing source for content
    // no need to resume content for outstream ads
    if (!ad_player_classPrivateFieldGet(ad_player_rmpVast, this).contentCompleted && !ad_player_classPrivateFieldGet(ad_player_params, this).outstream) {
      Logger.print(ad_player_classPrivateFieldGet(ad_player_rmpVast, this).debugRawConsoleLogs, `content player play requested after ad player resumeContent`);
      ad_player_classPrivateFieldGet(ad_player_rmpVast, this).rmpVastContentPlayer.play();
    }
    ad_player_classPrivateFieldGet(ad_player_rmpVast, this).contentCompleted = false;
  }
}
;// ./src/js/verification/omsdk.js



function omsdk_classPrivateMethodInitSpec(e, a) { omsdk_checkPrivateRedeclaration(e, a), a.add(e); }
function omsdk_classPrivateFieldInitSpec(e, t, a) { omsdk_checkPrivateRedeclaration(e, t), t.set(e, a); }
function omsdk_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function omsdk_classPrivateFieldGet(s, a) { return s.get(omsdk_assertClassBrand(s, a)); }
function omsdk_classPrivateFieldSet(s, a, r) { return s.set(omsdk_assertClassBrand(s, a), r), r; }
function omsdk_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }

var omsdk_rmpVast = /*#__PURE__*/new (weak_map_default())();
var omsdk_contentPlayer = /*#__PURE__*/new (weak_map_default())();
var omsdk_adPlayer = /*#__PURE__*/new (weak_map_default())();
var omsdk_params = /*#__PURE__*/new (weak_map_default())();
var _isSkippableAd = /*#__PURE__*/new (weak_map_default())();
var _skipTimeOffset = /*#__PURE__*/new (weak_map_default())();
var _adVerifications = /*#__PURE__*/new (weak_map_default())();
var _VastProperties = /*#__PURE__*/new (weak_map_default())();
var _adEvents = /*#__PURE__*/new (weak_map_default())();
var _mediaEvents = /*#__PURE__*/new (weak_map_default())();
var _adSession = /*#__PURE__*/new (weak_map_default())();
var _lastVideoTime = /*#__PURE__*/new (weak_map_default())();
var _onFullscreenChangeFn = /*#__PURE__*/new (weak_map_default())();
var _OmSdkManager_brand = /*#__PURE__*/new WeakSet();
class OmSdkManager {
  constructor(adVerifications, rmpVast) {
    omsdk_classPrivateMethodInitSpec(this, _OmSdkManager_brand);
    omsdk_classPrivateFieldInitSpec(this, omsdk_rmpVast, void 0);
    omsdk_classPrivateFieldInitSpec(this, omsdk_contentPlayer, void 0);
    omsdk_classPrivateFieldInitSpec(this, omsdk_adPlayer, void 0);
    omsdk_classPrivateFieldInitSpec(this, omsdk_params, void 0);
    omsdk_classPrivateFieldInitSpec(this, _isSkippableAd, void 0);
    omsdk_classPrivateFieldInitSpec(this, _skipTimeOffset, void 0);
    omsdk_classPrivateFieldInitSpec(this, _adVerifications, void 0);
    omsdk_classPrivateFieldInitSpec(this, _VastProperties, null);
    omsdk_classPrivateFieldInitSpec(this, _adEvents, null);
    omsdk_classPrivateFieldInitSpec(this, _mediaEvents, null);
    omsdk_classPrivateFieldInitSpec(this, _adSession, null);
    omsdk_classPrivateFieldInitSpec(this, _lastVideoTime, -1);
    omsdk_classPrivateFieldInitSpec(this, _onFullscreenChangeFn, null);
    omsdk_classPrivateFieldSet(omsdk_rmpVast, this, rmpVast);
    omsdk_classPrivateFieldSet(omsdk_contentPlayer, this, rmpVast.currentContentPlayer);
    omsdk_classPrivateFieldSet(omsdk_adPlayer, this, rmpVast.currentAdPlayer);
    omsdk_classPrivateFieldSet(omsdk_params, this, rmpVast.params);
    omsdk_classPrivateFieldSet(_isSkippableAd, this, rmpVast.isSkippableAd);
    omsdk_classPrivateFieldSet(_skipTimeOffset, this, rmpVast.skipTimeOffset);
    omsdk_classPrivateFieldSet(_adVerifications, this, adVerifications);
  }
  init() {
    const videoEventTypes = ['error', 'loadeddata', 'pause', 'play', 'timeupdate', 'volumechange', 'click'];

    // handle ad player events
    videoEventTypes.forEach(eventType => {
      omsdk_classPrivateFieldGet(omsdk_adPlayer, this).addEventListener(eventType, event => omsdk_assertClassBrand(_OmSdkManager_brand, this, _adPlayerDidDispatchEvent).call(this, event));
    });
    // handle fullscreenchange 
    omsdk_classPrivateFieldSet(_onFullscreenChangeFn, this, omsdk_assertClassBrand(_OmSdkManager_brand, this, _onFullscreenChange).bind(this));
    document.addEventListener('fullscreenchange', omsdk_classPrivateFieldGet(_onFullscreenChangeFn, this));
    // Service Script To incorporate omweb-v1.js, use a <script> tag - we are assuming it is there
    omsdk_assertClassBrand(_OmSdkManager_brand, this, _onOMWebLoaded).call(this);
  }
}
function _destroy() {
  document.removeEventListener('fullscreenchange', omsdk_classPrivateFieldGet(_onFullscreenChangeFn, this));
  omsdk_classPrivateFieldGet(_adSession, this).finish();
}
function _onFullscreenChange() {
  const isFullscreen = document.fullscreenElement !== null;
  const playerState = isFullscreen ? 'fullscreen' : 'normal';
  omsdk_classPrivateFieldGet(_mediaEvents, this).playerStateChange(playerState);
}
function _pingVerificationNotExecuted(verification, reasonCode) {
  if (typeof verification.trackingEvents !== 'undefined' && Array.isArray(verification.trackingEvents.verificationNotExecuted) && verification.trackingEvents.verificationNotExecuted.length > 0) {
    verification.trackingEvents.verificationNotExecuted.forEach(verificationNotExecutedURI => {
      let validatedURI = verificationNotExecutedURI;
      const reasonPattern = /\[REASON\]/gi;
      if (reasonPattern.test(validatedURI)) {
        validatedURI = validatedURI.replace(reasonPattern, reasonCode);
      }
      omsdk_classPrivateFieldGet(omsdk_rmpVast, this).rmpVastTracking.pingURI(validatedURI);
    });
  }
}
function _adPlayerDidDispatchTimeUpdate() {
  if (!omsdk_classPrivateFieldGet(_adEvents, this) || !omsdk_classPrivateFieldGet(_mediaEvents, this) || !omsdk_classPrivateFieldGet(omsdk_adPlayer, this) || omsdk_classPrivateFieldGet(omsdk_adPlayer, this).playbackRate === 0) {
    return;
  }
  // Check if playback has crossed a quartile threshold, and report that to
  // the OMSDK.
  const adPlayerCurrentTime = omsdk_classPrivateFieldGet(omsdk_adPlayer, this).currentTime;
  const adPlayerDuration = omsdk_classPrivateFieldGet(omsdk_adPlayer, this).duration;
  if (adPlayerCurrentTime > -1 && adPlayerDuration > 0) {
    const currentVideoTimePerCent = adPlayerCurrentTime / adPlayerDuration;
    if (omsdk_classPrivateFieldGet(_lastVideoTime, this) < 0 && currentVideoTimePerCent >= 0) {
      omsdk_classPrivateFieldGet(_adEvents, this).impressionOccurred();
      omsdk_classPrivateFieldGet(_mediaEvents, this).start(adPlayerDuration, omsdk_classPrivateFieldGet(omsdk_adPlayer, this).volume);
    } else if (omsdk_classPrivateFieldGet(_lastVideoTime, this) < 0.25 && currentVideoTimePerCent >= 0.25) {
      omsdk_classPrivateFieldGet(_mediaEvents, this).firstQuartile();
    } else if (omsdk_classPrivateFieldGet(_lastVideoTime, this) < 0.5 && currentVideoTimePerCent >= 0.5) {
      omsdk_classPrivateFieldGet(_mediaEvents, this).midpoint();
    } else if (omsdk_classPrivateFieldGet(_lastVideoTime, this) < 0.75 && currentVideoTimePerCent >= 0.75) {
      omsdk_classPrivateFieldGet(_mediaEvents, this).thirdQuartile();
    } else if (omsdk_classPrivateFieldGet(_lastVideoTime, this) < 1 && currentVideoTimePerCent >= 1) {
      omsdk_classPrivateFieldGet(_mediaEvents, this).complete();
      // to prevent ad pod to fire verification events
      omsdk_classPrivateFieldSet(_adEvents, this, null);
      omsdk_classPrivateFieldSet(_mediaEvents, this, null);
      // Wait 300 ms, then finish the session.
      window.setTimeout(() => {
        omsdk_assertClassBrand(_OmSdkManager_brand, this, _destroy).call(this);
      }, 300);
    }
    omsdk_classPrivateFieldSet(_lastVideoTime, this, currentVideoTimePerCent);
  }
}
function _adPlayerDidDispatchEvent(event) {
  if (!omsdk_classPrivateFieldGet(_adSession, this) || !omsdk_classPrivateFieldGet(_adEvents, this) || !omsdk_classPrivateFieldGet(_mediaEvents, this) || !omsdk_classPrivateFieldGet(_VastProperties, this)) {
    return;
  }
  let vastProperties, volume;
  let videoPosition = 'preroll';
  switch (event.type) {
    case 'error':
      omsdk_classPrivateFieldGet(_adSession, this).error('video', omsdk_classPrivateFieldGet(omsdk_adPlayer, this).error.message);
      break;
    case 'loadeddata':
      if (omsdk_classPrivateFieldGet(_skipTimeOffset, this) < 0) {
        omsdk_classPrivateFieldSet(_skipTimeOffset, this, 0);
      }
      if (omsdk_classPrivateFieldGet(omsdk_params, this).outstream) {
        videoPosition = 'standalone';
      } else {
        const contentPlayerCurrentTime = omsdk_classPrivateFieldGet(omsdk_contentPlayer, this).currentTime;
        const contentPlayerDuration = omsdk_classPrivateFieldGet(omsdk_contentPlayer, this).duration;
        if (contentPlayerCurrentTime > 0 && contentPlayerCurrentTime < contentPlayerDuration) {
          videoPosition === 'midroll';
        } else if (contentPlayerCurrentTime >= contentPlayerDuration) {
          videoPosition = 'postroll';
        }
      }
      vastProperties = new (omsdk_classPrivateFieldGet(_VastProperties, this))(omsdk_classPrivateFieldGet(_isSkippableAd, this), omsdk_classPrivateFieldGet(_skipTimeOffset, this), omsdk_classPrivateFieldGet(omsdk_params, this).omidAutoplay, videoPosition);
      omsdk_classPrivateFieldGet(_adEvents, this).loaded(vastProperties);
      break;
    case 'pause':
      omsdk_classPrivateFieldGet(_mediaEvents, this).pause();
      break;
    case 'play':
      if (omsdk_classPrivateFieldGet(omsdk_adPlayer, this).currentTime > 0) {
        omsdk_classPrivateFieldGet(_mediaEvents, this).resume();
      }
      break;
    case 'timeupdate':
      omsdk_assertClassBrand(_OmSdkManager_brand, this, _adPlayerDidDispatchTimeUpdate).call(this);
      break;
    case 'volumechange':
      volume = omsdk_classPrivateFieldGet(omsdk_adPlayer, this).muted ? 0 : omsdk_classPrivateFieldGet(omsdk_adPlayer, this).volume;
      omsdk_classPrivateFieldGet(_mediaEvents, this).volumeChange(volume);
      break;
    case 'click':
      omsdk_classPrivateFieldGet(_mediaEvents, this).adUserInteraction('click');
      break;
    default:
      break;
  }
}
function _onOMWebLoaded() {
  // remove executable to only have JavaScriptResource
  const validatedVerificationArray = [];
  // we only execute browserOptional="false" unless there are none 
  // in which case we will look for browserOptional="true"
  let browserOptional = [];
  for (let i = 0; i < omsdk_classPrivateFieldGet(_adVerifications, this).length; i++) {
    const verification = omsdk_classPrivateFieldGet(_adVerifications, this)[i];
    if (typeof verification.resource !== 'string' || verification.resource === '') {
      continue;
    }
    // Ping rejection code 2
    // Verification not supported. The API framework or language type of
    // verification resources provided are not implemented or supported by
    // the player/SDK
    if (typeof verification.type !== 'undefined' && verification.type === 'executable') {
      omsdk_assertClassBrand(_OmSdkManager_brand, this, _pingVerificationNotExecuted).call(this, verification, '2');
      continue;
    }
    // if not OMID, we reject
    if (typeof verification.apiFramework !== 'undefined' && verification.apiFramework !== 'omid') {
      omsdk_assertClassBrand(_OmSdkManager_brand, this, _pingVerificationNotExecuted).call(this, verification, '2');
      continue;
    }
    // reject vendors not in omidAllowedVendors if omidAllowedVendors is not empty
    if (omsdk_classPrivateFieldGet(omsdk_params, this).omidAllowedVendors.length > 0 && typeof verification.vendor !== 'undefined') {
      var _context;
      if (!includes_default()(_context = omsdk_classPrivateFieldGet(omsdk_params, this).omidAllowedVendors).call(_context, verification.vendor)) {
        continue;
      }
    }
    if (typeof verification.browserOptional !== 'undefined' && verification.browserOptional === true) {
      push_default()(browserOptional).call(browserOptional, i);
      continue;
    }
    push_default()(validatedVerificationArray).call(validatedVerificationArray, verification);
  }
  if (validatedVerificationArray.length === 0 && browserOptional.length > 0) {
    browserOptional.forEach(browserOptionalItem => {
      push_default()(validatedVerificationArray).call(validatedVerificationArray, omsdk_classPrivateFieldGet(_adVerifications, this)[browserOptionalItem]);
    });
  }
  omsdk_classPrivateFieldSet(_adVerifications, this, validatedVerificationArray);
  let sessionClient;
  try {
    sessionClient = OmidSessionClient.default;
  } catch (error) {
    console.warn(error);
    return;
  }
  const AdSession = sessionClient.AdSession;
  const Partner = sessionClient.Partner;
  const Context = sessionClient.Context;
  const VerificationScriptResource = sessionClient.VerificationScriptResource;
  const AdEvents = sessionClient.AdEvents;
  const MediaEvents = sessionClient.MediaEvents;
  omsdk_classPrivateFieldSet(_VastProperties, this, sessionClient.VastProperties);
  const partner = new Partner(omsdk_classPrivateFieldGet(omsdk_params, this).partnerName, omsdk_classPrivateFieldGet(omsdk_params, this).partnerVersion);
  let resources = [];
  if (omsdk_classPrivateFieldGet(omsdk_params, this).omidRunValidationScript) {
    // https://interactiveadvertisingbureau.github.io/Open-Measurement-SDKJS/validation.html
    const VALIDATION_SCRIPT_URL = 'https://cdn.radiantmediatechs.com/rmp/omsdk/1.5.5/omid-validation-verification-script-v1.js';
    const VENDOR_KEY = 'dummyVendor'; // you must use this value as is
    const PARAMS = JSON.stringify({
      k: 'v'
    });
    push_default()(resources).call(resources, new VerificationScriptResource(VALIDATION_SCRIPT_URL, VENDOR_KEY, PARAMS));
  } else {
    // we support Access Modes Creative Access a.k.a full
    const accessMode = 'full';
    resources = omsdk_classPrivateFieldGet(_adVerifications, this).map(verification => {
      return new VerificationScriptResource(verification.resource, verification.vendor, verification.parameters, accessMode);
    });
  }
  const contentUrl = document.location.href;
  const context = new Context(partner, resources, contentUrl);
  Logger.print(omsdk_classPrivateFieldGet(omsdk_rmpVast, this).debugRawConsoleLogs, ``, resources);
  context.underEvaluation = true;
  const omdSdkServiceWindow = window.top;
  if (!omdSdkServiceWindow) {
    Logger.print(omsdk_classPrivateFieldGet(omsdk_rmpVast, this).debugRawConsoleLogs, `OMSDK: invalid serviceWindow - return`);
    return;
  }
  context.setServiceWindow(omdSdkServiceWindow);
  context.setVideoElement(omsdk_classPrivateFieldGet(omsdk_adPlayer, this));
  Logger.print(omsdk_classPrivateFieldGet(omsdk_rmpVast, this).debugRawConsoleLogs, ``, context);
  omsdk_classPrivateFieldSet(_adSession, this, new AdSession(context));
  omsdk_classPrivateFieldGet(_adSession, this).setCreativeType('video');
  omsdk_classPrivateFieldGet(_adSession, this).setImpressionType('beginToRender');
  if (!omsdk_classPrivateFieldGet(_adSession, this).isSupported()) {
    Logger.print(omsdk_classPrivateFieldGet(omsdk_rmpVast, this).debugRawConsoleLogs, `OMSDK: invalid serviceWindow - return`);
    return;
  }
  omsdk_classPrivateFieldSet(_adEvents, this, new AdEvents(omsdk_classPrivateFieldGet(_adSession, this)));
  omsdk_classPrivateFieldSet(_mediaEvents, this, new MediaEvents(omsdk_classPrivateFieldGet(_adSession, this)));
  omsdk_classPrivateFieldGet(_adSession, this).start();
}
;// ./src/js/framework/dispatcher.js

class Dispatcher {
  constructor(eventName) {
    this.eventName = eventName;
    this.callbacks = [];
  }
  registerCallback(callback) {
    var _context;
    push_default()(_context = this.callbacks).call(_context, callback);
  }
  unregisterCallback(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }
  fire(data) {
    const callbacks = this.callbacks.slice(0);
    callbacks.forEach(callback => {
      callback(data);
    });
  }
}
;// ./src/js/players/content-player.js

function content_player_classPrivateFieldInitSpec(e, t, a) { content_player_checkPrivateRedeclaration(e, t), t.set(e, a); }
function content_player_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function content_player_classPrivateFieldGet(s, a) { return s.get(content_player_assertClassBrand(s, a)); }
function content_player_classPrivateFieldSet(s, a, r) { return s.set(content_player_assertClassBrand(s, a), r), r; }
function content_player_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }

var content_player_rmpVast = /*#__PURE__*/new (weak_map_default())();
var content_player_contentPlayer = /*#__PURE__*/new (weak_map_default())();
var _customPlaybackCurrentTime = /*#__PURE__*/new (weak_map_default())();
var _antiSeekLogicInterval = /*#__PURE__*/new (weak_map_default())();
class ContentPlayer {
  constructor(rmpVast) {
    content_player_classPrivateFieldInitSpec(this, content_player_rmpVast, void 0);
    content_player_classPrivateFieldInitSpec(this, content_player_contentPlayer, void 0);
    content_player_classPrivateFieldInitSpec(this, _customPlaybackCurrentTime, 0);
    content_player_classPrivateFieldInitSpec(this, _antiSeekLogicInterval, null);
    content_player_classPrivateFieldSet(content_player_rmpVast, this, rmpVast);
    content_player_classPrivateFieldSet(content_player_contentPlayer, this, rmpVast.currentContentPlayer);
  }
  set volume(level) {
    if (content_player_classPrivateFieldGet(content_player_contentPlayer, this)) {
      content_player_classPrivateFieldGet(content_player_contentPlayer, this).volume = level;
    }
  }
  get volume() {
    if (content_player_classPrivateFieldGet(content_player_contentPlayer, this)) {
      return content_player_classPrivateFieldGet(content_player_contentPlayer, this).volume;
    }
    return -1;
  }
  get muted() {
    if (content_player_classPrivateFieldGet(content_player_contentPlayer, this)) {
      return content_player_classPrivateFieldGet(content_player_contentPlayer, this).muted;
    }
    return false;
  }
  set muted(muted) {
    if (content_player_classPrivateFieldGet(content_player_contentPlayer, this)) {
      if (muted && !content_player_classPrivateFieldGet(content_player_contentPlayer, this).muted) {
        content_player_classPrivateFieldGet(content_player_contentPlayer, this).muted = true;
      } else if (!muted && content_player_classPrivateFieldGet(content_player_contentPlayer, this).muted) {
        content_player_classPrivateFieldGet(content_player_contentPlayer, this).muted = false;
      }
    }
  }
  get currentTime() {
    if (content_player_classPrivateFieldGet(content_player_contentPlayer, this) && FW.isNumber(content_player_classPrivateFieldGet(content_player_contentPlayer, this).currentTime)) {
      return content_player_classPrivateFieldGet(content_player_contentPlayer, this).currentTime * 1000;
    }
    return -1;
  }
  destroy() {
    window.clearInterval(content_player_classPrivateFieldGet(_antiSeekLogicInterval, this));
  }
  play(firstContentPlayerPlayRequest) {
    if (content_player_classPrivateFieldGet(content_player_contentPlayer, this) && content_player_classPrivateFieldGet(content_player_contentPlayer, this).paused) {
      content_player_classPrivateFieldGet(content_player_rmpVast, this).rmpVastUtils.playPromise('content', firstContentPlayerPlayRequest);
    }
  }
  pause() {
    if (content_player_classPrivateFieldGet(content_player_contentPlayer, this) && !content_player_classPrivateFieldGet(content_player_contentPlayer, this).paused) {
      content_player_classPrivateFieldGet(content_player_contentPlayer, this).pause();
    }
  }
  seekTo(msSeek) {
    if (!FW.isNumber(msSeek)) {
      return;
    }
    if (msSeek >= 0 && content_player_classPrivateFieldGet(content_player_contentPlayer, this)) {
      content_player_classPrivateFieldGet(content_player_contentPlayer, this).currentTime = msSeek / 1000;
    }
  }
  preventSeekingForCustomPlayback() {
    // after much poking it appears we cannot rely on seek events for iOS to 
    // set this up reliably - so interval it is
    if (content_player_classPrivateFieldGet(content_player_contentPlayer, this)) {
      content_player_classPrivateFieldSet(_antiSeekLogicInterval, this, window.setInterval(() => {
        if (content_player_classPrivateFieldGet(content_player_rmpVast, this).creative.isLinear && content_player_classPrivateFieldGet(content_player_rmpVast, this).__adOnStage) {
          const diff = Math.abs(content_player_classPrivateFieldGet(_customPlaybackCurrentTime, this) - content_player_classPrivateFieldGet(content_player_contentPlayer, this).currentTime);
          if (diff > 1) {
            content_player_classPrivateFieldGet(content_player_contentPlayer, this).currentTime = content_player_classPrivateFieldGet(_customPlaybackCurrentTime, this);
          }
          content_player_classPrivateFieldSet(_customPlaybackCurrentTime, this, content_player_classPrivateFieldGet(content_player_contentPlayer, this).currentTime);
        }
      }, 200));
    }
  }
}
;// ./node_modules/@dailymotion/vast-client/dist/vast-client.min.js
function e(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{id:e.id||null,adId:e.adId||null,sequence:e.sequence||null,apiFramework:e.apiFramework||null,universalAdIds:[],creativeExtensions:[]}}const t=["ADCATEGORIES","ADCOUNT","ADPLAYHEAD","ADSERVINGID","ADTYPE","APIFRAMEWORKS","APPBUNDLE","ASSETURI","BLOCKEDADCATEGORIES","BREAKMAXADLENGTH","BREAKMAXADS","BREAKMAXDURATION","BREAKMINADLENGTH","BREAKMINDURATION","BREAKPOSITION","CLICKPOS","CLICKTYPE","CLIENTUA","CONTENTID","CONTENTPLAYHEAD","CONTENTURI","DEVICEIP","DEVICEUA","DOMAIN","EXTENSIONS","GDPRCONSENT","IFA","IFATYPE","INVENTORYSTATE","LATLONG","LIMITADTRACKING","MEDIAMIME","MEDIAPLAYHEAD","OMIDPARTNER","PAGEURL","PLACEMENTTYPE","PLAYERCAPABILITIES","PLAYERSIZE","PLAYERSTATE","PODSEQUENCE","REGULATIONS","SERVERSIDE","SERVERUA","TRANSACTIONID","UNIVERSALADID","VASTVERSIONS","VERIFICATIONVENDORS"];function r(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const a=[],n=s(e);!t.ERRORCODE||r.isCustomCode||/^[0-9]{3}$/.test(t.ERRORCODE)||(t.ERRORCODE=900),t.CACHEBUSTING=d(Math.round(1e8*Math.random())),t.TIMESTAMP=(new Date).toISOString(),t.RANDOM=t.random=t.CACHEBUSTING;for(const e in t)t[e]=c(t[e]);for(const e in n){const r=n[e];"string"==typeof r&&a.push(i(r,t))}return a}function i(e,r){const i=(e=a(e,r)).match(/[^[\]]+(?=])/g);if(!i)return e;let s=i.filter((e=>t.indexOf(e)>-1));return 0===s.length?e:(s=s.reduce(((e,t)=>(e[t]=-1,e)),{}),a(e,s))}function a(e,t){let r=e;for(const e in t){const i=t[e];r=r.replace(new RegExp("(?:\\[|%%)(".concat(e,")(?:\\]|%%)"),"g"),i)}return r}function s(e){return Array.isArray(e)?e.map((e=>e&&e.hasOwnProperty("url")?e.url:e)):e}function n(e){return/^(https?:\/\/|\/\/)/.test(e)}function o(e,t){for(let r=0;r<t.length;r++)if(l(t[r],e))return!0;return!1}function l(e,t){if(e&&t){const r=Object.getOwnPropertyNames(e),i=Object.getOwnPropertyNames(t);return r.length===i.length&&(e.id===t.id&&e.url===t.url)}return!1}function c(e){return encodeURIComponent(e).replace(/[!'()*]/g,(e=>"%".concat(e.charCodeAt(0).toString(16))))}function d(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8;return e.toString().padStart(t,"0")}const u={track:function(e,t,i){r(e,t,i).forEach((e=>{if("undefined"!=typeof window&&null!==window){(new Image).src=e}}))},resolveURLTemplates:r,extractURLsFromTemplates:s,filterUrlTemplates:function(e){return e.reduce(((e,t)=>{const r=t.url||t;return n(r)?e.validUrls.push(r):e.invalidUrls.push(r),e}),{validUrls:[],invalidUrls:[]})},containsTemplateObject:o,isTemplateObjectEqual:l,encodeURIComponentRFC3986:c,replaceUrlMacros:i,isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},flatten:function e(t){return t.reduce(((t,r)=>t.concat(Array.isArray(r)?e(r):r)),[])},joinArrayOfUniqueTemplateObjs:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];const r=Array.isArray(e)?e:[],i=Array.isArray(t)?t:[];return r.concat(i).reduce(((e,t)=>(o(t,e)||e.push(t),e)),[])},isValidTimeValue:function(e){return Number.isFinite(e)&&e>=-2},addLeadingZeros:d,isValidUrl:n,isBrowserEnvironment:function(){return"undefined"!=typeof window},formatMacrosValues:function(e){return"object"!=typeof e?e:JSON.stringify(e)}};function h(e){return["true","TRUE","True","1"].includes(e)}function p(e){if(null==e)return-1;if(u.isNumeric(e))return parseInt(e);const t=e.split(":");if(3!==t.length)return-1;const r=t[2].split(".");let i=parseInt(r[0]);2===r.length&&(i+=parseFloat("0.".concat(r[1])));const a=parseInt(60*t[1]),s=parseInt(60*t[0]*60);return isNaN(s)||isNaN(a)||isNaN(i)||a>3600||i>60?-1:s+a+i}const m={childByName:function(e,t){return Array.from(e.childNodes).find((e=>e.nodeName===t))},childrenByName:function(e,t){return Array.from(e.childNodes).filter((e=>e.nodeName===t))},resolveVastAdTagURI:function(e,t){if(!t)return e;if(e.startsWith("//")){const{protocol:t}=location;return"".concat(t).concat(e)}if(!e.includes("://")){const r=t.slice(0,t.lastIndexOf("/"));return"".concat(r,"/").concat(e)}return e},parseBoolean:h,parseNodeText:function(e){return e&&(e.textContent||e.text||"").trim()},copyNodeAttribute:function(e,t,r){const i=t.getAttribute(e);i&&r.setAttribute(e,i)},parseAttributes:function(e){return Array.from(e.attributes).reduce(((e,t)=>(e[t.nodeName]=t.nodeValue,e)),{})},parseDuration:p,getStandAloneAds:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:[]).filter((e=>!parseInt(e.sequence,10)))},getSortedAdPods:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:[]).filter((e=>parseInt(e.sequence,10))).sort(((e,t)=>e.sequence-t.sequence))},assignAttributes:function(e,t){e&&Array.from(e).forEach((e=>{let{nodeName:r,nodeValue:i}=e;if(r&&i&&t.hasOwnProperty(r)){let e=i;"boolean"==typeof t[r]&&(e=h(e)),t[r]=e}}))},mergeWrapperAdData:function(e,t){var r;e.errorURLTemplates=t.errorURLTemplates.concat(e.errorURLTemplates),e.impressionURLTemplates=t.impressionURLTemplates.concat(e.impressionURLTemplates),e.extensions=t.extensions.concat(e.extensions),t.viewableImpression.length>0&&(e.viewableImpression=[...e.viewableImpression,...t.viewableImpression]),e.followAdditionalWrappers=t.followAdditionalWrappers,e.allowMultipleAds=t.allowMultipleAds,e.fallbackOnNoAd=t.fallbackOnNoAd;const i=(t.creatives||[]).filter((e=>e&&"companion"===e.type)),a=i.reduce(((e,t)=>((t.variations||[]).forEach((t=>{(t.companionClickTrackingURLTemplates||[]).forEach((t=>{u.containsTemplateObject(t,e)||e.push(t)}))})),e)),[]);e.creatives=i.concat(e.creatives);const s=t.videoClickTrackingURLTemplates&&t.videoClickTrackingURLTemplates.length,n=t.videoCustomClickURLTemplates&&t.videoCustomClickURLTemplates.length;if(e.creatives.forEach((e=>{if(t.trackingEvents&&t.trackingEvents[e.type])for(const r in t.trackingEvents[e.type]){const i=t.trackingEvents[e.type][r];Array.isArray(e.trackingEvents[r])||(e.trackingEvents[r]=[]),e.trackingEvents[r]=e.trackingEvents[r].concat(i)}"linear"===e.type&&(s&&(e.videoClickTrackingURLTemplates=e.videoClickTrackingURLTemplates.concat(t.videoClickTrackingURLTemplates)),n&&(e.videoCustomClickURLTemplates=e.videoCustomClickURLTemplates.concat(t.videoCustomClickURLTemplates)),!t.videoClickThroughURLTemplate||null!==e.videoClickThroughURLTemplate&&void 0!==e.videoClickThroughURLTemplate||(e.videoClickThroughURLTemplate=t.videoClickThroughURLTemplate)),"companion"===e.type&&a.length&&(e.variations||[]).forEach((e=>{e.companionClickTrackingURLTemplates=u.joinArrayOfUniqueTemplateObjs(e.companionClickTrackingURLTemplates,a)}))})),t.adVerifications&&(e.adVerifications=e.adVerifications.concat(t.adVerifications)),t.blockedAdCategories&&(e.blockedAdCategories=e.blockedAdCategories.concat(t.blockedAdCategories)),null!==(r=t.creatives)&&void 0!==r&&r.length){const r=t.creatives.filter((e=>{var t;return(null===(t=e.icons)||void 0===t?void 0:t.length)&&!e.mediaFiles.length}));r.length&&(e.creatives=e.creatives.concat(r))}}};function g(t,r){const i=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{id:r,adId:i,sequence:a,apiFramework:s}=e(t);return{id:r,adId:i,sequence:a,apiFramework:s,type:"companion",required:null,variations:[]}}(r);return i.required=t.getAttribute("required")||null,i.variations=m.childrenByName(t,"Companion").map((e=>{const t=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{id:e.id||null,adType:"companionAd",width:e.width||0,height:e.height||0,assetWidth:e.assetWidth||null,assetHeight:e.assetHeight||null,expandedWidth:e.expandedWidth||null,expandedHeight:e.expandedHeight||null,apiFramework:e.apiFramework||null,adSlotId:e.adSlotId||null,pxratio:e.pxratio||"1",renderingMode:e.renderingMode||"default",staticResources:[],htmlResources:[],iframeResources:[],adParameters:null,altText:null,companionClickThroughURLTemplate:null,companionClickTrackingURLTemplates:[],trackingEvents:{}}}(m.parseAttributes(e));t.htmlResources=m.childrenByName(e,"HTMLResource").reduce(((e,t)=>{const r=m.parseNodeText(t);return r?e.concat(r):e}),[]),t.iframeResources=m.childrenByName(e,"IFrameResource").reduce(((e,t)=>{const r=m.parseNodeText(t);return r?e.concat(r):e}),[]),t.staticResources=m.childrenByName(e,"StaticResource").reduce(((e,t)=>{const r=m.parseNodeText(t);return r?e.concat({url:r,creativeType:t.getAttribute("creativeType")||null}):e}),[]),t.altText=m.parseNodeText(m.childByName(e,"AltText"))||null;const r=m.childByName(e,"TrackingEvents");r&&m.childrenByName(r,"Tracking").forEach((e=>{const r=e.getAttribute("event"),i=m.parseNodeText(e);r&&i&&(Array.isArray(t.trackingEvents[r])||(t.trackingEvents[r]=[]),t.trackingEvents[r].push(i))})),t.companionClickTrackingURLTemplates=m.childrenByName(e,"CompanionClickTracking").map((e=>({id:e.getAttribute("id")||null,url:m.parseNodeText(e)}))),t.companionClickThroughURLTemplate=m.parseNodeText(m.childByName(e,"CompanionClickThrough"))||null;const i=m.childByName(e,"AdParameters");return i&&(t.adParameters={value:m.parseNodeText(i),xmlEncoded:i.getAttribute("xmlEncoded")||null}),t})),i}function v(t,r){let i;const a=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{id:r,adId:i,sequence:a,apiFramework:s}=e(t);return{id:r,adId:i,sequence:a,apiFramework:s,type:"linear",duration:0,skipDelay:null,mediaFiles:[],mezzanine:null,interactiveCreativeFile:null,closedCaptionFiles:[],videoClickThroughURLTemplate:null,videoClickTrackingURLTemplates:[],videoCustomClickURLTemplates:[],adParameters:null,icons:[],trackingEvents:{}}}(r);a.duration=m.parseDuration(m.parseNodeText(m.childByName(t,"Duration")));const s=t.getAttribute("skipoffset");if(null==s)a.skipDelay=null;else if("%"===s.charAt(s.length-1)&&-1!==a.duration){const e=parseInt(s,10);a.skipDelay=a.duration*(e/100)}else a.skipDelay=m.parseDuration(s);const n=m.childByName(t,"VideoClicks");if(n){const e=m.childByName(n,"ClickThrough");a.videoClickThroughURLTemplate=e?{id:e.getAttribute("id")||null,url:m.parseNodeText(e)}:null,m.childrenByName(n,"ClickTracking").forEach((e=>{a.videoClickTrackingURLTemplates.push({id:e.getAttribute("id")||null,url:m.parseNodeText(e)})})),m.childrenByName(n,"CustomClick").forEach((e=>{a.videoCustomClickURLTemplates.push({id:e.getAttribute("id")||null,url:m.parseNodeText(e)})}))}const o=m.childByName(t,"AdParameters");o&&(a.adParameters={value:m.parseNodeText(o),xmlEncoded:o.getAttribute("xmlEncoded")||null}),m.childrenByName(t,"TrackingEvents").forEach((e=>{m.childrenByName(e,"Tracking").forEach((e=>{let t=e.getAttribute("event");const r=m.parseNodeText(e);if(t&&r){if("progress"===t){if(i=e.getAttribute("offset"),!i)return;t="%"===i.charAt(i.length-1)?"progress-".concat(i):"progress-".concat(m.parseDuration(i))}Array.isArray(a.trackingEvents[t])||(a.trackingEvents[t]=[]),a.trackingEvents[t].push(r)}}))})),m.childrenByName(t,"MediaFiles").forEach((e=>{m.childrenByName(e,"MediaFile").forEach((e=>{a.mediaFiles.push(function(e){const t={id:null,fileURL:null,fileSize:0,deliveryType:"progressive",mimeType:null,mediaType:null,codec:null,bitrate:0,minBitrate:0,maxBitrate:0,width:0,height:0,apiFramework:null,scalable:null,maintainAspectRatio:null};t.id=e.getAttribute("id"),t.fileURL=m.parseNodeText(e),t.deliveryType=e.getAttribute("delivery"),t.codec=e.getAttribute("codec"),t.mimeType=e.getAttribute("type"),t.mediaType=e.getAttribute("mediaType")||"2D",t.apiFramework=e.getAttribute("apiFramework"),t.fileSize=parseInt(e.getAttribute("fileSize")||0),t.bitrate=parseInt(e.getAttribute("bitrate")||0),t.minBitrate=parseInt(e.getAttribute("minBitrate")||0),t.maxBitrate=parseInt(e.getAttribute("maxBitrate")||0),t.width=parseInt(e.getAttribute("width")||0),t.height=parseInt(e.getAttribute("height")||0);const r=e.getAttribute("scalable");r&&"string"==typeof r&&(t.scalable=m.parseBoolean(r));const i=e.getAttribute("maintainAspectRatio");i&&"string"==typeof i&&(t.maintainAspectRatio=m.parseBoolean(i));return t}(e))}));const t=m.childByName(e,"InteractiveCreativeFile");t&&(a.interactiveCreativeFile=function(e){const t=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{type:e.type||null,apiFramework:e.apiFramework||null,variableDuration:m.parseBoolean(e.variableDuration),fileURL:null}}(m.parseAttributes(e));return t.fileURL=m.parseNodeText(e),t}(t));const r=m.childByName(e,"ClosedCaptionFiles");r&&m.childrenByName(r,"ClosedCaptionFile").forEach((e=>{const t=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{type:e.type||null,language:e.language||null,fileURL:null}}(m.parseAttributes(e));t.fileURL=m.parseNodeText(e),a.closedCaptionFiles.push(t)}));const i=m.childByName(e,"Mezzanine"),s=function(e,t){const r={};let i=!1;return t.forEach((t=>{e&&e.getAttribute(t)?r[t]=e.getAttribute(t):i=!0})),i?null:r}(i,["delivery","type","width","height"]);if(s){const e={id:null,fileURL:null,delivery:null,codec:null,type:null,width:0,height:0,fileSize:0,mediaType:"2D"};e.id=i.getAttribute("id"),e.fileURL=m.parseNodeText(i),e.delivery=s.delivery,e.codec=i.getAttribute("codec"),e.type=s.type,e.width=parseInt(s.width,10),e.height=parseInt(s.height,10),e.fileSize=parseInt(i.getAttribute("fileSize"),10),e.mediaType=i.getAttribute("mediaType")||"2D",a.mezzanine=e}}));const l=m.childByName(t,"Icons");return l&&m.childrenByName(l,"Icon").forEach((e=>{a.icons.push(function(e){const t={program:null,height:0,width:0,xPosition:0,yPosition:0,apiFramework:null,offset:null,duration:0,type:null,staticResource:null,htmlResource:null,iframeResource:null,pxratio:"1",iconClickThroughURLTemplate:null,iconClickTrackingURLTemplates:[],iconViewTrackingURLTemplate:null,iconClickFallbackImages:[],altText:null,hoverText:null};t.program=e.getAttribute("program"),t.height=parseInt(e.getAttribute("height")||0),t.width=parseInt(e.getAttribute("width")||0),t.xPosition=function(e){if(-1!==["left","right"].indexOf(e))return e;return parseInt(e||0)}(e.getAttribute("xPosition")),t.yPosition=function(e){if(-1!==["top","bottom"].indexOf(e))return e;return parseInt(e||0)}(e.getAttribute("yPosition")),t.apiFramework=e.getAttribute("apiFramework"),t.pxratio=e.getAttribute("pxratio")||"1",t.offset=m.parseDuration(e.getAttribute("offset")),t.duration=m.parseDuration(e.getAttribute("duration")),t.altText=e.getAttribute("altText"),t.hoverText=e.getAttribute("hoverText"),m.childrenByName(e,"HTMLResource").forEach((e=>{t.type=e.getAttribute("creativeType")||"text/html",t.htmlResource=m.parseNodeText(e)})),m.childrenByName(e,"IFrameResource").forEach((e=>{t.type=e.getAttribute("creativeType")||0,t.iframeResource=m.parseNodeText(e)})),m.childrenByName(e,"StaticResource").forEach((e=>{t.type=e.getAttribute("creativeType")||0,t.staticResource=m.parseNodeText(e)}));const r=m.childByName(e,"IconClicks");if(r){t.iconClickThroughURLTemplate=m.parseNodeText(m.childByName(r,"IconClickThrough")),m.childrenByName(r,"IconClickTracking").forEach((e=>{t.iconClickTrackingURLTemplates.push({id:e.getAttribute("id")||null,url:m.parseNodeText(e)})}));const e=m.childByName(r,"IconClickFallbackImages");e&&m.childrenByName(e,"IconClickFallbackImage").forEach((e=>{t.iconClickFallbackImages.push({url:m.parseNodeText(e)||null,width:e.getAttribute("width")||null,height:e.getAttribute("height")||null})}))}return t.iconViewTrackingURLTemplate=m.parseNodeText(m.childByName(e,"IconViewTracking")),t}(e))})),a}function f(t,r){const i=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{id:r,adId:i,sequence:a,apiFramework:s}=e(t);return{id:r,adId:i,sequence:a,apiFramework:s,type:"nonlinear",variations:[],trackingEvents:{}}}(r);return m.childrenByName(t,"TrackingEvents").forEach((e=>{let t,r;m.childrenByName(e,"Tracking").forEach((e=>{t=e.getAttribute("event"),r=m.parseNodeText(e),t&&r&&(Array.isArray(i.trackingEvents[t])||(i.trackingEvents[t]=[]),i.trackingEvents[t].push(r))}))})),m.childrenByName(t,"NonLinear").forEach((e=>{const t={id:null,width:0,height:0,expandedWidth:0,expandedHeight:0,scalable:!0,maintainAspectRatio:!0,minSuggestedDuration:0,apiFramework:"static",adType:"nonLinearAd",type:null,staticResource:null,htmlResource:null,iframeResource:null,nonlinearClickThroughURLTemplate:null,nonlinearClickTrackingURLTemplates:[],adParameters:null};t.id=e.getAttribute("id")||null,t.width=e.getAttribute("width"),t.height=e.getAttribute("height"),t.expandedWidth=e.getAttribute("expandedWidth"),t.expandedHeight=e.getAttribute("expandedHeight"),t.scalable=m.parseBoolean(e.getAttribute("scalable")),t.maintainAspectRatio=m.parseBoolean(e.getAttribute("maintainAspectRatio")),t.minSuggestedDuration=m.parseDuration(e.getAttribute("minSuggestedDuration")),t.apiFramework=e.getAttribute("apiFramework"),m.childrenByName(e,"HTMLResource").forEach((e=>{t.type=e.getAttribute("creativeType")||"text/html",t.htmlResource=m.parseNodeText(e)})),m.childrenByName(e,"IFrameResource").forEach((e=>{t.type=e.getAttribute("creativeType")||0,t.iframeResource=m.parseNodeText(e)})),m.childrenByName(e,"StaticResource").forEach((e=>{t.type=e.getAttribute("creativeType")||0,t.staticResource=m.parseNodeText(e)}));const r=m.childByName(e,"AdParameters");r&&(t.adParameters={value:m.parseNodeText(r),xmlEncoded:r.getAttribute("xmlEncoded")||null}),t.nonlinearClickThroughURLTemplate=m.parseNodeText(m.childByName(e,"NonLinearClickThrough")),m.childrenByName(e,"NonLinearClickTracking").forEach((e=>{t.nonlinearClickTrackingURLTemplates.push({id:e.getAttribute("id")||null,url:m.parseNodeText(e)})})),i.variations.push(t)})),i}function T(e){const t=[];return e.forEach((e=>{const r=A(e);r&&t.push(r)})),t}function A(e){if("#comment"===e.nodeName)return null;const t={name:null,value:null,attributes:{},children:[]},r=e.attributes,i=e.childNodes;if(t.name=e.nodeName,e.attributes)for(const e in r)if(r.hasOwnProperty(e)){const i=r[e];i.nodeName&&i.nodeValue&&(t.attributes[i.nodeName]=i.nodeValue)}for(const e in i)if(i.hasOwnProperty(e)){const r=A(i[e]);r&&t.children.push(r)}if(0===t.children.length||1===t.children.length&&["#cdata-section","#text"].indexOf(t.children[0].name)>=0){const r=m.parseNodeText(e);""!==r&&(t.value=r),t.children=[]}return null===(a=t).value&&0===Object.keys(a.attributes).length&&0===a.children.length?null:t;// removed by dead control flow
{ var a; }}function R(e){return e.getAttribute("AdID")||e.getAttribute("adID")||e.getAttribute("adId")||null}const y={Wrapper:{subElements:["VASTAdTagURI","Impression"]},BlockedAdCategories:{attributes:["authority"]},InLine:{subElements:["AdSystem","AdTitle","Impression","AdServingId","Creatives"]},Category:{attributes:["authority"]},Pricing:{attributes:["model","currency"]},Verification:{oneOfinLineResources:["JavaScriptResource","ExecutableResource"],attributes:["vendor"]},UniversalAdId:{attributes:["idRegistry"]},JavaScriptResource:{attributes:["apiFramework","browserOptional"]},ExecutableResource:{attributes:["apiFramework","type"]},Tracking:{attributes:["event"]},Creatives:{subElements:["Creative"]},Creative:{subElements:["UniversalAdId"]},Linear:{subElements:["MediaFiles","Duration"]},MediaFiles:{subElements:["MediaFile"]},MediaFile:{attributes:["delivery","type","width","height"]},Mezzanine:{attributes:["delivery","type","width","height"]},NonLinear:{oneOfinLineResources:["StaticResource","IFrameResource","HTMLResource"],attributes:["width","height"]},Companion:{oneOfinLineResources:["StaticResource","IFrameResource","HTMLResource"],attributes:["width","height"]},StaticResource:{attributes:["creativeType"]},Icons:{subElements:["Icon"]},Icon:{oneOfinLineResources:["StaticResource","IFrameResource","HTMLResource"]}};function k(e,t){if(!y[e.nodeName]||!y[e.nodeName].attributes)return;const r=y[e.nodeName].attributes.filter((t=>!e.getAttribute(t)));r.length>0&&N({name:e.nodeName,parentName:e.parentNode.nodeName,attributes:r},t)}function E(e,t,r){const i=y[e.nodeName],a=!r&&"Wrapper"!==e.nodeName;if(!i||a)return;if(i.subElements){const r=i.subElements.filter((t=>!m.childByName(e,t)));r.length>0&&N({name:e.nodeName,parentName:e.parentNode.nodeName,subElements:r},t)}if(!r||!i.oneOfinLineResources)return;i.oneOfinLineResources.some((t=>m.childByName(e,t)))||N({name:e.nodeName,parentName:e.parentNode.nodeName,oneOfResources:i.oneOfinLineResources},t)}function b(e){return e.children&&0!==e.children.length}function N(e,t){let{name:r,parentName:i,attributes:a,subElements:s,oneOfResources:n}=e,o="Element '".concat(r,"'");o+=a?" missing required attribute(s) '".concat(a.join(", "),"' "):s?" missing required sub element(s) '".concat(s.join(", "),"' "):n?" must provide one of the following '".concat(n.join(", "),"' "):" is empty",t("VAST-warning",{message:o,parentElement:i,specVersion:4.1})}const w={verifyRequiredValues:function e(t,r,i){if(t&&t.nodeName)if("InLine"===t.nodeName&&(i=!0),k(t,r),b(t)){E(t,r,i);for(let a=0;a<t.children.length;a++)e(t.children[a],r,i)}else 0===m.parseNodeText(t).length&&N({name:t.nodeName,parentName:t.parentNode.nodeName},r)},hasSubElements:b,emitMissingValueWarning:N,verifyRequiredAttributes:k,verifyRequiredSubElements:E};function L(e,t){let{allowMultipleAds:r,followAdditionalWrappers:i}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const a=Array.from(e.childNodes).filter((e=>{const t=e.nodeName.toLowerCase();return"inline"===t||!1!==i&&"wrapper"===t}));for(const i of a){if(m.copyNodeAttribute("id",e,i),m.copyNodeAttribute("sequence",e,i),m.copyNodeAttribute("adType",e,i),"Wrapper"===i.nodeName)return{ad:I(i,t),type:"WRAPPER"};if("InLine"===i.nodeName)return{ad:C(i,t,{allowMultipleAds:r}),type:"INLINE"};const a=i.nodeName.toLowerCase();t("VAST-warning",{message:"<".concat(i.nodeName,"inline"===a?"> must be written <InLine>":"> must be written <Wrapper>"),wrongNode:i})}}function C(e,t){let{allowMultipleAds:r}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return!1===r&&e.getAttribute("sequence")?null:U(e,t)}function U(e,t){let r=[];t&&w.verifyRequiredValues(e,t);const i=Array.from(e.childNodes),a=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{id:e.id||null,sequence:e.sequence||null,adType:e.adType||null,adServingId:null,categories:[],expires:null,viewableImpression:[],system:null,title:null,description:null,advertiser:null,pricing:null,survey:null,errorURLTemplates:[],impressionURLTemplates:[],creatives:[],extensions:[],adVerifications:[],blockedAdCategories:[],followAdditionalWrappers:!0,allowMultipleAds:!1,fallbackOnNoAd:null}}(m.parseAttributes(e));return i.forEach((e=>{switch(e.nodeName){case"Error":a.errorURLTemplates.push(m.parseNodeText(e));break;case"Impression":a.impressionURLTemplates.push({id:e.getAttribute("id")||null,url:m.parseNodeText(e)});break;case"Creatives":a.creatives=function(e){const t=[];return e.forEach((e=>{const r={id:e.getAttribute("id")||null,adId:R(e),sequence:e.getAttribute("sequence")||null,apiFramework:e.getAttribute("apiFramework")||null},i=[];let a;m.childrenByName(e,"UniversalAdId").forEach((e=>{const t={idRegistry:e.getAttribute("idRegistry")||"unknown",value:m.parseNodeText(e)};i.push(t)}));const s=m.childByName(e,"CreativeExtensions");s&&(a=T(m.childrenByName(s,"CreativeExtension")));for(const s in e.childNodes){const n=e.childNodes[s];let o;switch(n.nodeName){case"Linear":o=v(n,r);break;case"NonLinearAds":o=f(n,r);break;case"CompanionAds":o=g(n,r)}o&&(i&&(o.universalAdIds=i),a&&(o.creativeExtensions=a),t.push(o))}})),t}(m.childrenByName(e,"Creative"));break;case"Extensions":{const t=m.childrenByName(e,"Extension");a.extensions=T(t),a.adVerifications.length||(r=function(e){let t=null,r=[];e.some((e=>t=m.childByName(e,"AdVerifications"))),t&&(r=x(m.childrenByName(t,"Verification")));return r}(t));break}case"AdVerifications":a.adVerifications=x(m.childrenByName(e,"Verification"));break;case"AdSystem":a.system={value:m.parseNodeText(e),version:e.getAttribute("version")||null};break;case"AdTitle":a.title=m.parseNodeText(e);break;case"AdServingId":a.adServingId=m.parseNodeText(e);break;case"Category":a.categories.push({authority:e.getAttribute("authority")||null,value:m.parseNodeText(e)});break;case"Expires":a.expires=parseInt(m.parseNodeText(e),10);break;case"ViewableImpression":a.viewableImpression.push(function(e){const t=(e,t)=>{const r=m.parseNodeText(t);return r&&e.push(r),e};return{id:e.getAttribute("id")||null,viewable:m.childrenByName(e,"Viewable").reduce(t,[]),notViewable:m.childrenByName(e,"NotViewable").reduce(t,[]),viewUndetermined:m.childrenByName(e,"ViewUndetermined").reduce(t,[])}}(e));break;case"Description":a.description=m.parseNodeText(e);break;case"Advertiser":a.advertiser={id:e.getAttribute("id")||null,value:m.parseNodeText(e)};break;case"Pricing":a.pricing={value:m.parseNodeText(e),model:e.getAttribute("model")||null,currency:e.getAttribute("currency")||null};break;case"Survey":a.survey={value:m.parseNodeText(e),type:e.getAttribute("type")||null};break;case"BlockedAdCategories":a.blockedAdCategories.push({authority:e.getAttribute("authority")||null,value:m.parseNodeText(e)})}})),r.length&&(a.adVerifications=a.adVerifications.concat(r)),a}function I(e,t){const r=U(e,t),i=e.getAttribute("followAdditionalWrappers"),a=e.getAttribute("allowMultipleAds"),s=e.getAttribute("fallbackOnNoAd");r.followAdditionalWrappers=!i||m.parseBoolean(i),r.allowMultipleAds=!!a&&m.parseBoolean(a),r.fallbackOnNoAd=s?m.parseBoolean(s):null;let n=m.childByName(e,"VASTAdTagURI");if(n?r.nextWrapperURL=m.parseNodeText(n):(n=m.childByName(e,"VASTAdTagURL"),n&&(r.nextWrapperURL=m.parseNodeText(m.childByName(n,"URL")))),r.creatives.forEach((e=>{if(["linear","nonlinear"].includes(e.type)){if(e.trackingEvents){r.trackingEvents||(r.trackingEvents={}),r.trackingEvents[e.type]||(r.trackingEvents[e.type]={});for(const t in e.trackingEvents){const i=e.trackingEvents[t];Array.isArray(r.trackingEvents[e.type][t])||(r.trackingEvents[e.type][t]=[]),i.forEach((i=>{r.trackingEvents[e.type][t].push(i)}))}}e.videoClickTrackingURLTemplates&&(Array.isArray(r.videoClickTrackingURLTemplates)||(r.videoClickTrackingURLTemplates=[]),e.videoClickTrackingURLTemplates.forEach((e=>{r.videoClickTrackingURLTemplates.push(e)}))),e.videoClickThroughURLTemplate&&(r.videoClickThroughURLTemplate=e.videoClickThroughURLTemplate),e.videoCustomClickURLTemplates&&(Array.isArray(r.videoCustomClickURLTemplates)||(r.videoCustomClickURLTemplates=[]),e.videoCustomClickURLTemplates.forEach((e=>{r.videoCustomClickURLTemplates.push(e)})))}})),r.nextWrapperURL)return r}function x(e){const t=[];return e.forEach((e=>{const r={resource:null,vendor:null,browserOptional:!1,apiFramework:null,type:null,parameters:null,trackingEvents:{}},i=Array.from(e.childNodes);m.assignAttributes(e.attributes,r),i.forEach((e=>{let{nodeName:t,textContent:i,attributes:a}=e;switch(t){case"JavaScriptResource":case"ExecutableResource":r.resource=i.trim(),m.assignAttributes(a,r);break;case"VerificationParameters":r.parameters=i.trim()}}));const a=m.childByName(e,"TrackingEvents");a&&m.childrenByName(a,"Tracking").forEach((e=>{const t=e.getAttribute("event"),i=m.parseNodeText(e);t&&i&&(Array.isArray(r.trackingEvents[t])||(r.trackingEvents[t]=[]),r.trackingEvents[t].push(i))})),t.push(r)})),t}class S{constructor(){this._handlers=[]}on(e,t){if("function"!=typeof t)throw new TypeError("The handler argument must be of type Function. Received type ".concat(typeof t));if(!e)throw new TypeError("The event argument must be of type String. Received type ".concat(typeof e));return this._handlers.push({event:e,handler:t}),this}once(e,t){return this.on(e,function(e,t,r){const i={fired:!1,wrapFn:void 0};function a(){i.fired||(e.off(t,i.wrapFn),i.fired=!0,r.bind(e)(...arguments))}return i.wrapFn=a,a}(this,e,t))}off(e,t){return this._handlers=this._handlers.filter((r=>r.event!==e||r.handler!==t)),this}emit(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),i=1;i<t;i++)r[i-1]=arguments[i];let a=!1;return this._handlers.forEach((t=>{"*"===t.event&&(a=!0,t.handler(e,...r)),t.event===e&&(a=!0,t.handler(...r))})),a}removeAllListeners(e){return e?(this._handlers=this._handlers.filter((t=>t.event!==e)),this):(this._handlers=[],this)}listenerCount(e){return this._handlers.filter((t=>t.event===e)).length}listeners(e){return this._handlers.reduce(((t,r)=>(r.event===e&&t.push(r.handler),t)),[])}eventNames(){return this._handlers.map((e=>e.event))}}let V=0,D=0;const O=(e,t)=>{if(!e||!t||e<=0||t<=0)return;D=(D*V+8*e/t)/++V},F={ERRORCODE:900,extensions:[]},P="VAST response version not supported";class B extends S{constructor(){let{fetcher:e}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};super(),this.maxWrapperDepth=null,this.rootErrorURLTemplates=[],this.errorURLTemplates=[],this.remainingAds=[],this.parsingOptions={},this.fetcher=e||null}trackVastError(e,t){for(var r=arguments.length,i=new Array(r>2?r-2:0),a=2;a<r;a++)i[a-2]=arguments[a];this.emit("VAST-error",Object.assign({},F,t,...i)),u.track(e,t)}getErrorURLTemplates(){return this.rootErrorURLTemplates.concat(this.errorURLTemplates)}getEstimatedBitrate(){return D}initParsingStatus(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.maxWrapperDepth=e.wrapperLimit||10,this.parsingOptions={allowMultipleAds:e.allowMultipleAds},this.rootURL="",this.resetParsingStatus(),O(e.byteLength,e.requestDuration)}resetParsingStatus(){this.errorURLTemplates=[],this.rootErrorURLTemplates=[],this.vastVersion=null}getRemainingAds(e){if(0===this.remainingAds.length)return Promise.reject(new Error("No more ads are available for the given VAST"));const t=e?this.remainingAds:[this.remainingAds.shift()];return this.errorURLTemplates=[],this.resolveAds(t,{wrapperDepth:0,url:this.rootURL}).then((e=>this.buildVASTResponse(e)))}parseVAST(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.initParsingStatus(t),t.isRootVAST=!0,this.parse(e,t).then((e=>this.buildVASTResponse(e)))}buildVASTResponse(e){const t=function(e){let{ads:t,errorURLTemplates:r,version:i}=e;return{ads:t||[],errorURLTemplates:r||[],version:i||null}}({ads:e,errorURLTemplates:this.getErrorURLTemplates(),version:this.vastVersion});return this.completeWrapperResolving(t),t}parseVastXml(e,t){let{isRootVAST:r=!1,url:i=null,wrapperDepth:a=0,allowMultipleAds:s,followAdditionalWrappers:n}=t;if(!e||!e.documentElement||"VAST"!==e.documentElement.nodeName){var o;this.emit("VAST-ad-parsed",{type:"ERROR",url:i,wrapperDepth:a});const t="VideoAdServingTemplate"===(null==e||null===(o=e.documentElement)||void 0===o?void 0:o.nodeName);throw new Error(t?P:"Invalid VAST XMLDocument")}const l=[],c=e.documentElement.childNodes,d=e.documentElement.getAttribute("version");r&&d&&(this.vastVersion=d);for(const e in c){const t=c[e];if("Error"===t.nodeName){const e=m.parseNodeText(t);r?this.rootErrorURLTemplates.push(e):this.errorURLTemplates.push(e)}else if("Ad"===t.nodeName){if(this.vastVersion&&parseFloat(this.vastVersion)<3)s=!0;else if(!1===s&&l.length>1)break;const e=L(t,this.emit.bind(this),{allowMultipleAds:s,followAdditionalWrappers:n});e.ad?(l.push(e.ad),this.emit("VAST-ad-parsed",{type:e.type,url:i,wrapperDepth:a,adIndex:l.length-1,vastVersion:d})):this.trackVastError(this.getErrorURLTemplates(),{ERRORCODE:101})}}return l}parse(e){let{url:t=null,resolveAll:r=!0,wrapperSequence:i=null,previousUrl:a=null,wrapperDepth:s=0,isRootVAST:n=!1,followAdditionalWrappers:o,allowMultipleAds:l}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},c=[];this.vastVersion&&parseFloat(this.vastVersion)<3&&n&&(l=!0);try{c=this.parseVastXml(e,{isRootVAST:n,url:t,wrapperDepth:s,allowMultipleAds:l,followAdditionalWrappers:o})}catch(e){return Promise.reject(e)}if(1===c.length&&null!=i&&(c[0].sequence=i),!1===r){const e=m.getSortedAdPods(c),t=m.getStandAloneAds(c);e.length?c=e:t.length&&(c=[t.shift()]),this.remainingAds=t}return this.resolveAds(c,{wrapperDepth:s,previousUrl:a,url:t})}resolveAds(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],{wrapperDepth:t,previousUrl:r,url:i}=arguments.length>1?arguments[1]:void 0;const a=[];return r=i,e.forEach((e=>{const i=this.resolveWrappers(e,t,r);a.push(i)})),Promise.all(a).then((e=>u.flatten(e)))}resolveWrappers(e,t,r){const i={...e};return new Promise((e=>{var a;if(t++,!i.nextWrapperURL)return delete i.nextWrapperURL,e(i);if(!this.fetcher)return i.VASTAdTagURI=i.nextWrapperURL,delete i.nextWrapperURL,e(i);if(t>=this.maxWrapperDepth)return i.errorCode=302,delete i.nextWrapperURL,e(i);i.nextWrapperURL=m.resolveVastAdTagURI(i.nextWrapperURL,r);const s=null!==(a=this.parsingOptions.allowMultipleAds)&&void 0!==a?a:i.allowMultipleAds,n=i.sequence;this.fetcher.fetchVAST({url:i.nextWrapperURL,emitter:this.emit.bind(this),maxWrapperDepth:this.maxWrapperDepth}).then((a=>this.parse(a,{url:i.nextWrapperURL,previousUrl:r,wrapperSequence:n,wrapperDepth:t,followAdditionalWrappers:i.followAdditionalWrappers,allowMultipleAds:s}).then((t=>{if(delete i.nextWrapperURL,0===t.length)return i.creatives=[],e(i);t.forEach((e=>{e&&m.mergeWrapperAdData(e,i)})),e(t)})))).catch((t=>{i.errorCode=t.message===P?102:301,i.errorMessage=t.message,e(i)}))}))}completeWrapperResolving(e){if(0===e.ads.length)this.trackVastError(e.errorURLTemplates,{ERRORCODE:303});else for(let t=e.ads.length-1;t>=0;t--){const r=e.ads[t],i=!r.creatives.some((e=>{var t,r;return(null===(t=e.mediaFiles)||void 0===t?void 0:t.length)>0||(null===(r=e.variations)||void 0===r?void 0:r.length)>0}));!r.errorCode&&!i||r.VASTAdTagURI||(this.trackVastError(r.errorURLTemplates.concat(e.errorURLTemplates),{ERRORCODE:r.errorCode||303},{ERRORMESSAGE:r.errorMessage||""},{extensions:r.extensions},{system:r.system}),e.ads.splice(t,1))}}}let M=null;const W={data:{},length:0,getItem(e){return this.data[e]},setItem(e,t){this.data[e]=t,this.length=Object.keys(this.data).length},removeItem(e){delete this.data[e],this.length=Object.keys(this.data).length},clear(){this.data={},this.length=0}};class j{constructor(){this.storage=this.initStorage()}initStorage(){if(M)return M;try{M="undefined"!=typeof window&&null!==window?window.localStorage||window.sessionStorage:null}catch(e){M=null}return M&&!this.isStorageDisabled(M)||(M=W,M.clear()),M}isStorageDisabled(e){const t="__VASTStorage__";try{if(e.setItem(t,t),e.getItem(t)!==t)return e.removeItem(t),!0}catch(e){return!0}return e.removeItem(t),!1}getItem(e){return this.storage.getItem(e)}setItem(e,t){return this.storage.setItem(e,t)}removeItem(e){return this.storage.removeItem(e)}clear(){return this.storage.clear()}}const q=12e4;const K={get:async function(e,t){try{const r=new AbortController,i=setTimeout((()=>{throw r.abort(),new Error("URLHandler: Request timed out after ".concat(t.timeout||q," ms (408)"))}),t.timeout||q),a=await fetch(e,{...t,signal:r.signal,credentials:t.withCredentials?"include":"omit"}).finally((()=>{clearTimeout(i)})),s=function(e){return u.isBrowserEnvironment()&&"https:"===window.location.protocol&&e.url.includes("http://")?"URLHandler: Cannot go from HTTPS to HTTP.":200===e.status&&e.ok?null:"URLHandler: ".concat(e.statusText," (").concat(e.status,")")}(a);return s?{error:new Error(s),statusCode:a.status}:async function(e){const t=await e.text();let r;r=u.isBrowserEnvironment()?new DOMParser:new((await __webpack_require__.e(/* import() */ 312).then(__webpack_require__.t.bind(__webpack_require__, 8312, 19))).DOMParser);return{xml:r.parseFromString(t,"text/xml"),details:{byteLength:t.length,statusCode:e.status,rawXml:t}}}(a)}catch(e){return{error:e,statusCode:"AbortError"===e.name?408:null}}}};class H{constructor(){this.URLTemplateFilters=[]}setOptions(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.urlHandler=e.urlHandler||e.urlhandler||K,this.fetchingOptions={...e.fetchOptions,timeout:e.timeout||q,withCredentials:Boolean(e.withCredentials)}}addURLTemplateFilter(e){"function"==typeof e&&this.URLTemplateFilters.push(e)}removeLastURLTemplateFilter(){this.URLTemplateFilters.pop()}countURLTemplateFilters(){return this.URLTemplateFilters.length}clearURLTemplateFilters(){this.URLTemplateFilters=[]}async fetchVAST(e){var t;let{url:r,maxWrapperDepth:i,emitter:a,wrapperDepth:s=0,previousUrl:n=null,wrapperAd:o=null}=e;const l=Date.now();this.URLTemplateFilters.forEach((e=>{r=e(r)})),a("VAST-resolving",{url:r,previousUrl:n,wrapperDepth:s,maxWrapperDepth:i,timeout:this.fetchingOptions.timeout,wrapperAd:o});const c=await this.urlHandler.get(r,this.fetchingOptions),d=Math.round(Date.now()-l);if(a("VAST-resolved",{url:r,previousUrl:n,wrapperDepth:s,error:(null==c?void 0:c.error)||null,duration:d,statusCode:(null==c?void 0:c.statusCode)||null,...null==c?void 0:c.details}),O(null==c||null===(t=c.details)||void 0===t?void 0:t.byteLength,d),c.error)throw new Error(c.error);return c.xml}}class _{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new j;this.cappingFreeLunch=e,this.cappingMinimumTimeInterval=t,this.fetcher=new H,this.vastParser=new B({fetcher:this.fetcher}),this.storage=r,void 0===this.lastSuccessfulAd&&(this.lastSuccessfulAd=0),void 0===this.totalCalls&&(this.totalCalls=0),void 0===this.totalCallsTimeout&&(this.totalCallsTimeout=0)}addURLTemplateFilter(e){this.fetcher.addURLTemplateFilter(e)}removeLastURLTemplateFilter(){this.fetcher.removeLastURLTemplateFilter()}countURLTemplateFilters(){return this.fetcher.countURLTemplateFilters()}clearURLTemplateFilters(){this.fetcher.clearURLTemplateFilters()}getParser(){return this.vastParser}get lastSuccessfulAd(){return this.storage.getItem("vast-client-last-successful-ad")}set lastSuccessfulAd(e){this.storage.setItem("vast-client-last-successful-ad",e)}get totalCalls(){return this.storage.getItem("vast-client-total-calls")}set totalCalls(e){this.storage.setItem("vast-client-total-calls",e)}get totalCallsTimeout(){return this.storage.getItem("vast-client-total-calls-timeout")}set totalCallsTimeout(e){this.storage.setItem("vast-client-total-calls-timeout",e)}hasRemainingAds(){return this.vastParser.remainingAds.length>0}getNextAds(e){return this.vastParser.getRemainingAds(e)}parseVAST(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.fetcher.setOptions(t),this.vastParser.parseVAST(e,t)}get(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const r=Date.now();return t.hasOwnProperty("resolveAll")||(t.resolveAll=!1),this.totalCallsTimeout<r?(this.totalCalls=1,this.totalCallsTimeout=r+36e5):this.totalCalls++,new Promise(((i,a)=>{if(this.cappingFreeLunch>=this.totalCalls)return a(new Error("VAST call canceled – FreeLunch capping not reached yet ".concat(this.totalCalls,"/").concat(this.cappingFreeLunch)));const s=r-this.lastSuccessfulAd;if(s<0)this.lastSuccessfulAd=0;else if(s<this.cappingMinimumTimeInterval)return a(new Error("VAST call canceled – (".concat(this.cappingMinimumTimeInterval,")ms minimum interval reached")));this.vastParser.initParsingStatus(t),this.fetcher.setOptions(t),this.vastParser.rootURL=e,this.fetcher.fetchVAST({url:e,emitter:this.vastParser.emit.bind(this.vastParser),maxWrapperDepth:this.vastParser.maxWrapperDepth}).then((r=>(t.previousUrl=e,t.isRootVAST=!0,t.url=e,this.vastParser.parse(r,t).then((e=>{const t=this.vastParser.buildVASTResponse(e);i(t)}))))).catch((e=>a(e)))}))}}class z extends S{constructor(e,t,r){var i;let a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,s=arguments.length>4&&void 0!==arguments[4]&&arguments[4];super(),this.ad=t,this.creative=r,this.variation=a,this.muted=s,this.impressed=!1,this.skippable=!1,this.trackingEvents={},this.trackedProgressEvents=[],this.lastPercentage=0,this._alreadyTriggeredQuartiles={},this.emitAlwaysEvents=["creativeView","start","firstQuartile","midpoint","thirdQuartile","complete","resume","pause","rewind","skip","closeLinear","close"];for(const e in this.creative.trackingEvents){const t=this.creative.trackingEvents[e];this.trackingEvents[e]=t.slice(0)}this.viewableImpressionTrackers=(null===(i=this.ad.viewableImpression)||void 0===i?void 0:i.reduce(((e,t)=>(e.notViewable.push(...t.notViewable),e.viewUndetermined.push(...t.viewUndetermined),e.viewable.push(...t.viewable),e)),{notViewable:[],viewUndetermined:[],viewable:[]}))||{},Object.entries(this.viewableImpressionTrackers).forEach((e=>{let[t,r]=e;r.length&&(this.trackingEvents[t]=r)})),!function(e){return"linear"===e.type}(this.creative)?this._initVariationTracking():this._initLinearTracking(),e&&this.on("start",(()=>{e.lastSuccessfulAd=Date.now()}))}_initLinearTracking(){this.linear=!0,this.skipDelay=this.creative.skipDelay,this.setDuration(this.creative.duration),this.clickThroughURLTemplate=this.creative.videoClickThroughURLTemplate,this.clickTrackingURLTemplates=this.creative.videoClickTrackingURLTemplates}_initVariationTracking(){if(this.linear=!1,this.skipDelay=-1,this.variation){for(const e in this.variation.trackingEvents){const t=this.variation.trackingEvents[e];this.trackingEvents[e]?this.trackingEvents[e]=this.trackingEvents[e].concat(t.slice(0)):this.trackingEvents[e]=t.slice(0)}"nonLinearAd"===this.variation.adType?(this.clickThroughURLTemplate=this.variation.nonlinearClickThroughURLTemplate,this.clickTrackingURLTemplates=this.variation.nonlinearClickTrackingURLTemplates,this.setDuration(this.variation.minSuggestedDuration)):function(e){return"companionAd"===e.adType}(this.variation)&&(this.clickThroughURLTemplate=this.variation.companionClickThroughURLTemplate,this.clickTrackingURLTemplates=this.variation.companionClickTrackingURLTemplates)}}setDuration(e){u.isValidTimeValue(e)?(this.assetDuration=e,this.quartiles={firstQuartile:Math.round(25*this.assetDuration)/100,midpoint:Math.round(50*this.assetDuration)/100,thirdQuartile:Math.round(75*this.assetDuration)/100}):this.emit("TRACKER-error",{message:"the duration provided is not valid. duration: ".concat(e)})}setProgress(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(!u.isValidTimeValue(e)||"object"!=typeof t)return void this.emit("TRACKER-error",{message:"One given setProgress parameter has the wrong type. progress: ".concat(e,", macros: ").concat(u.formatMacrosValues(t))});const i=this.skipDelay||-1;if(-1===i||this.skippable||(i>e?this.emit("skip-countdown",i-e):(this.skippable=!0,this.emit("skip-countdown",0))),this.assetDuration>0){const i=Math.round(e/this.assetDuration*100),a=[];if(e>0){a.push("start");for(let e=this.lastPercentage;e<i;e++)a.push("progress-".concat(e+1,"%"));a.push("progress-".concat(e));for(const t in this.quartiles)this.isQuartileReached(t,this.quartiles[t],e)&&(a.push(t),this._alreadyTriggeredQuartiles[t]=!0);this.lastPercentage=i}a.forEach((e=>{this.track(e,{macros:t,once:r})})),e<this.progress&&(this.track("rewind",{macros:t}),this.trackedProgressEvents&&this.trackedProgressEvents.splice(0))}this.progress=e}isQuartileReached(e,t,r){let i=!1;return t<=r&&!this._alreadyTriggeredQuartiles[e]&&(i=!0),i}setMuted(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"boolean"==typeof e&&"object"==typeof t?(this.muted!==e&&this.track(e?"mute":"unmute",{macros:t}),this.muted=e):this.emit("TRACKER-error",{message:"One given setMuted parameter has the wrong type. muted: ".concat(e,", macros: ").concat(u.formatMacrosValues(t))})}setPaused(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"boolean"==typeof e&&"object"==typeof t?(this.paused!==e&&this.track(e?"pause":"resume",{macros:t}),this.paused=e):this.emit("TRACKER-error",{message:"One given setPaused parameter has the wrong type. paused: ".concat(e,", macros: ").concat(u.formatMacrosValues(t))})}setFullscreen(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"boolean"==typeof e&&"object"==typeof t?(this.fullscreen!==e&&this.track(e?"fullscreen":"exitFullscreen",{macros:t}),this.fullscreen=e):this.emit("TRACKER-error",{message:"One given setFullScreen parameter has the wrong type. fullscreen: ".concat(e,", macros: ").concat(u.formatMacrosValues(t))})}setExpand(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"boolean"==typeof e&&"object"==typeof t?(this.expanded!==e&&(this.track(e?"expand":"collapse",{macros:t}),this.track(e?"playerExpand":"playerCollapse",{macros:t})),this.expanded=e):this.emit("TRACKER-error",{message:"One given setExpand parameter has the wrong type. expanded: ".concat(e,", macros: ").concat(u.formatMacrosValues(t))})}setSkipDelay(e){u.isValidTimeValue(e)?this.skipDelay=e:this.emit("TRACKER-error",{message:"setSkipDelay parameter does not have a valid value. duration: ".concat(e)})}trackImpression(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?this.impressed||(this.impressed=!0,this.trackURLs(this.ad.impressionURLTemplates,e),this.track("creativeView",{macros:e})):this.emit("TRACKER-error",{message:"trackImpression parameter has the wrong type. macros: ".concat(e)})}trackViewableImpression(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];"object"==typeof e?this.track("viewable",{macros:e,once:t}):this.emit("TRACKER-error",{message:"trackViewableImpression given macros has the wrong type. macros: ".concat(e)})}trackNotViewableImpression(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];"object"==typeof e?this.track("notViewable",{macros:e,once:t}):this.emit("TRACKER-error",{message:"trackNotViewableImpression given macros has the wrong type. macros: ".concat(e)})}trackUndeterminedImpression(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];"object"==typeof e?this.track("viewUndetermined",{macros:e,once:t}):this.emit("TRACKER-error",{message:"trackUndeterminedImpression given macros has the wrong type. macros: ".concat(e)})}error(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];"object"==typeof e&&"boolean"==typeof t?this.trackURLs(this.ad.errorURLTemplates,e,{isCustomCode:t}):this.emit("TRACKER-error",{message:"One given error parameter has the wrong type. macros: ".concat(u.formatMacrosValues(e),", isCustomCode: ").concat(t)})}errorWithCode(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];"string"==typeof e&&"boolean"==typeof t?(this.error({ERRORCODE:e},t),console.log("The method errorWithCode is deprecated, please use vast tracker error method instead")):this.emit("TRACKER-error",{message:"One given errorWithCode parameter has the wrong type. errorCode: ".concat(e,", isCustomCode: ").concat(t)})}complete(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?this.track("complete",{macros:e}):this.emit("TRACKER-error",{message:"complete given macros has the wrong type. macros: ".concat(e)})}notUsed(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?(this.track("notUsed",{macros:e}),this.trackingEvents=[]):this.emit("TRACKER-error",{message:"notUsed given macros has the wrong type. macros: ".concat(e)})}otherAdInteraction(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?this.track("otherAdInteraction",{macros:e}):this.emit("TRACKER-error",{message:"otherAdInteraction given macros has the wrong type. macros: ".concat(e)})}acceptInvitation(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?this.track("acceptInvitation",{macros:e}):this.emit("TRACKER-error",{message:"acceptInvitation given macros has the wrong type. macros: ".concat(e)})}adExpand(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?this.track("adExpand",{macros:e}):this.emit("TRACKER-error",{message:"adExpand given macros has the wrong type. macros: ".concat(e)})}adCollapse(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?this.track("adCollapse",{macros:e}):this.emit("TRACKER-error",{message:"adCollapse given macros has the wrong type. macros: ".concat(e)})}minimize(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?this.track("minimize",{macros:e}):this.emit("TRACKER-error",{message:"minimize given macros has the wrong type. macros: ".concat(e)})}verificationNotExecuted(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("string"!=typeof e||"object"!=typeof t)return void this.emit("TRACKER-error",{message:"One given verificationNotExecuted parameter has to wrong type. vendor: ".concat(e,", macros: ").concat(u.formatMacrosValues(t))});if(!this.ad||!this.ad.adVerifications||!this.ad.adVerifications.length)throw new Error("No adVerifications provided");if(!e)throw new Error("No vendor provided, unable to find associated verificationNotExecuted");const r=this.ad.adVerifications.find((t=>t.vendor===e));if(!r)throw new Error("No associated verification element found for vendor: ".concat(e));const i=r.trackingEvents;if(i&&i.verificationNotExecuted){const e=i.verificationNotExecuted;this.trackURLs(e,t),this.emit("verificationNotExecuted",{trackingURLTemplates:e})}}overlayViewDuration(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"string"==typeof e&&"object"==typeof t?(t.ADPLAYHEAD=e,this.track("overlayViewDuration",{macros:t})):this.emit("TRACKER-error",{message:"One given overlayViewDuration parameters has the wrong type. formattedDuration: ".concat(e,", macros: ").concat(u.formatMacrosValues(t))})}close(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?this.track(this.linear?"closeLinear":"close",{macros:e}):this.emit("TRACKER-error",{message:"close given macros has the wrong type. macros: ".concat(e)})}skip(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?this.track("skip",{macros:e}):this.emit("TRACKER-error",{message:"skip given macros has the wrong type. macros: ".concat(e)})}load(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};"object"==typeof e?this.track("loaded",{macros:e}):this.emit("TRACKER-error",{message:"load given macros has the wrong type. macros: ".concat(e)})}click(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(null!==e&&"string"!=typeof e||"object"!=typeof t)return void this.emit("TRACKER-error",{message:"One given click parameter has the wrong type. fallbackClickThroughURL: ".concat(e,", macros: ").concat(u.formatMacrosValues(t))});this.clickTrackingURLTemplates&&this.clickTrackingURLTemplates.length&&this.trackURLs(this.clickTrackingURLTemplates,t);const r=this.clickThroughURLTemplate||e,i={...t};if(r){this.progress&&(i.ADPLAYHEAD=this.progressFormatted());const e=u.resolveURLTemplates([r],i)[0];this.emit("clickthrough",e)}}trackProgressEvents(e,t,r){const i=parseFloat(e.split("-")[1]);Object.entries(this.trackingEvents).filter((e=>{let[t]=e;return t.startsWith("progress-")})).map((e=>{let[t,r]=e;return{name:t,time:parseFloat(t.split("-")[1]),urls:r}})).filter((e=>{let{time:t}=e;return t<=i&&t>this.progress})).forEach((e=>{let{name:i,urls:a}=e;!r&&this.trackedProgressEvents.includes(i)||(this.emit(i,{trackingURLTemplates:a}),this.trackURLs(a,t),r?delete this.trackingEvents[i]:this.trackedProgressEvents.push(i))}))}track(e){let{macros:t={},once:r=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("object"!=typeof t)return void this.emit("TRACKER-error",{message:"track given macros has the wrong type. macros: ".concat(t)});"closeLinear"===e&&!this.trackingEvents[e]&&this.trackingEvents.close&&(e="close"),e.startsWith("progress-")&&!e.endsWith("%")&&this.trackProgressEvents(e,t,r);const i=this.trackingEvents[e],a=this.emitAlwaysEvents.indexOf(e)>-1;i?(this.emit(e,{trackingURLTemplates:i}),this.trackURLs(i,t)):a&&this.emit(e,null),r&&(delete this.trackingEvents[e],a&&this.emitAlwaysEvents.splice(this.emitAlwaysEvents.indexOf(e),1))}trackURLs(e){var t;let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const{validUrls:a,invalidUrls:s}=u.filterUrlTemplates(e);s.length&&this.emit("TRACKER-error",{message:"Provided urls are malformed. url: ".concat(s)});const n={...r};this.linear&&(this.creative&&this.creative.mediaFiles&&this.creative.mediaFiles[0]&&this.creative.mediaFiles[0].fileURL&&(n.ASSETURI=this.creative.mediaFiles[0].fileURL),this.progress&&(n.ADPLAYHEAD=this.progressFormatted())),null!==(t=this.creative)&&void 0!==t&&null!==(t=t.universalAdIds)&&void 0!==t&&t.length&&(n.UNIVERSALADID=this.creative.universalAdIds.map((e=>e.idRegistry.concat(" ",e.value))).join(",")),this.ad&&(this.ad.sequence&&(n.PODSEQUENCE=this.ad.sequence),this.ad.adType&&(n.ADTYPE=this.ad.adType),this.ad.adServingId&&(n.ADSERVINGID=this.ad.adServingId),this.ad.categories&&this.ad.categories.length&&(n.ADCATEGORIES=this.ad.categories.map((e=>e.value)).join(",")),this.ad.blockedAdCategories&&this.ad.blockedAdCategories.length&&(n.BLOCKEDADCATEGORIES=this.ad.blockedAdCategories.map((e=>e.value)).join(","))),u.track(a,n,i)}convertToTimecode(e){if(!u.isValidTimeValue(e))return"";const t=1e3*e,r=Math.floor(t/36e5),i=Math.floor(t/6e4%60),a=Math.floor(t/1e3%60),s=Math.floor(t%1e3);return"".concat(u.addLeadingZeros(r,2),":").concat(u.addLeadingZeros(i,2),":").concat(u.addLeadingZeros(a,2),".").concat(u.addLeadingZeros(s,3))}progressFormatted(){return this.convertToTimecode(this.progress)}}

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(5072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(7825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(7659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(5056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(1113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/css/rmp-vast.css
var rmp_vast = __webpack_require__(6063);
;// ./src/css/rmp-vast.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(rmp_vast/* default */.A, options);




       /* harmony default export */ var css_rmp_vast = (rmp_vast/* default */.A && rmp_vast/* default */.A.locals ? rmp_vast/* default */.A.locals : undefined);

;// ./src/js/index.js



function js_classPrivateMethodInitSpec(e, a) { js_checkPrivateRedeclaration(e, a), a.add(e); }
function js_checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function js_assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }















/**
 * The class to instantiate RmpVast
 * @export
 * @class RmpVast
*/
var _RmpVast_brand = /*#__PURE__*/new WeakSet();
class RmpVast {
  /**
   * @constructor
   * @param {string|HTMLElement}  idOrElement - the id or element for the player container. Required parameter.
   * @typedef {object} VpaidSettings
   * @property {number} [width]
   * @property {number} [height]
   * @property {string} [viewMode]
   * @property {number} [desiredBitrate]
   * @typedef {object} Labels
   * @property {string} [skipMessage]
   * @property {string} [closeAd]
   * @property {string} [textForInteractionUIOnMobile] 
   * @typedef {object} RmpVastParams
   * @property {number} [ajaxTimeout] - timeout in ms for an AJAX request to load a VAST tag from the ad server.
   *  Default 8000.
   * @property {number} [creativeLoadTimeout] - timeout in ms to load linear media creative from the server. 
   *  Default 10000.
   * @property {boolean} [ajaxWithCredentials] - AJAX request to load VAST tag from ad server should or should not be 
   *  made with credentials. Default: false.
   * @property {number} [maxNumRedirects] - the number of VAST wrappers the player should follow before triggering an
   *  error. Default: 4. Capped at 30 to avoid infinite wrapper loops.
   * @property {boolean} [outstream] - Enables outstream ad mode. Default: false.
   * @property {boolean} [showControlsForAdPlayer] - Shows Ad player HTML5 default video controls. Default: false.
   * @property {boolean} [vastXmlInput] - Instead of a VAST URI, we provide directly to rmp-vast VAST XML. Default: false.
   * @property {boolean} [enableVpaid] - Enables VPAID support or not. Default: true.
   * @property {VpaidSettings} [vpaidSettings] - Information required to display VPAID creatives - note that it is up 
   *  to the parent application of rmp-vast to provide those informations
   * @property {boolean} [useHlsJS] - Enables hls.js usage to display creatives delivered in HLS format on all devices. Include hls.js library (./externals/hls/hls.min.js) in your page before usage. Default: true.
   * @property {boolean} [debugHlsJS] - Enables debug log when hls.js is used to stream creatives. Default: false.
   * @property {boolean} [debugRawConsoleLogs] - Enables raw debug console log for Flutter apps and legacy platforms. Default: false.
  * @property {boolean} [omidSupport] - Enables OMID (OM Web SDK) support in rmp-vast. Default: false.
   * @property {string[]} [omidAllowedVendors] - List of allowed vendors for ad verification. Vendors not listed will 
   *  be rejected. Default: [].
   * @property {boolean} [omidAutoplay] - The content player will autoplay or not. The possibility of autoplay is not 
   *  determined by rmp-vast, this information needs to be passed to rmp-vast (see this 
   *  script for example). Default: false (means a click to play is required).
   * @property {string} [partnerName] - partnerName for OMID. Default: 'rmp-vast'.
   * @property {string} [partnerVersion] - partnerVersion for OMID. Default: current rmp-vast version 'x.x.x'.
   * @property {Labels} [labels] - Information required to properly display VPAID creatives - note that it is up to the 
   *  parent application of rmp-vast to provide those informations
   * @property {object} [macros] - 
   * @param {RmpVastParams} [params] - An object representing various parameters that can be passed to a rmp-vast 
   *  instance and that will affect the player inner-workings. Optional parameter.
   */
  constructor(idOrElement, params) {
    js_classPrivateMethodInitSpec(this, _RmpVast_brand);
    // reset instance variables - once per session
    js_assertClassBrand(_RmpVast_brand, this, _initInstanceVariables).call(this);
    if (typeof idOrElement === 'string' && idOrElement !== '') {
      this.container = document.getElementById(idOrElement);
    } else if (typeof idOrElement !== 'undefined' && idOrElement instanceof HTMLElement) {
      this.container = idOrElement;
    } else {
      console.error(`Invalid idOrElement to create new instance - exit`);
      return;
    }
    this.contentWrapper = this.container.querySelector('.rmp-content');
    this.currentContentPlayer = this.container.querySelector('.rmp-video');
    if (this.container === null || this.contentWrapper === null || this.currentContentPlayer === null) {
      console.error(`Invalid DOM layout - missing container or content wrapper or content player - exit`);
      return;
    }

    // filter input params
    this.rmpVastUtils = new Utils(this);
    this.rmpVastUtils.filterParams(params);
    if (this.params.debugRawConsoleLogs) {
      this.debugRawConsoleLogs = true;
    }
    Logger.print(this.debugRawConsoleLogs, `Filtered params follow`, this.params);
    Logger.print(this.debugRawConsoleLogs, `Creating new RmpVast instance`);
    this.rmpVastContentPlayer = new ContentPlayer(this);
    this.rmpVastTracking = new Tracking(this);
    this.rmpVastCompanionCreative = new CompanionCreative(this);
    this.environmentData = Environment;
    Logger.printVideoEvents(this.debugRawConsoleLogs, this.currentContentPlayer, 'content');
    // reset loadAds variables - this is reset at addestroyed 
    // so that next loadAds is cleared
    this.resetVariablesForNewLoadAds();
    // handle fullscreen events
    this.rmpVastUtils.handleFullscreen();
  }
  resetVariablesForNewLoadAds() {
    if (this.attachViewableObserverFn) {
      this.off('adstarted', this.attachViewableObserverFn);
    }
    this.rmpVastTracking.reset();
    this.rmpVastCompanionCreative.reset();
    this.trackingTags = [];
    this.vastErrorTags = [];
    this.adErrorTags = [];
    this.needsSeekAdjust = false;
    this.seekAdjustAttached = false;
    this.ad = {};
    this.creative = {};
    this.attachViewableObserverFn = null;
    this.viewableObserver = null;
    this.viewablePreviousRatio = 0.5;
    this.regulationsInfo = {};
    this.requireCategory = false;
    this.progressEvents = [];
    this.rmpVastLinearCreative = null;
    this.rmpVastNonLinearCreative = null;
    this.rmpVastVpaidPlayer = null;
    this.adParametersData = '';
    this.rmpVastSimidPlayer = null;
    this.rmpVastIcons = null;
    // for public getters
    this.__adTagUrl = '';
    this.__vastErrorCode = -1;
    this.__adErrorType = '';
    this.__adErrorMessage = '';
    this.__adOnStage = false;
  }

  /** 
   * Dispatch an event to the custom event system
   * @type {(eventName: string, data: object) => void} 
   */
  dispatch(eventName, data) {
    const event = this.events[eventName];
    if (event) {
      const validatedData = {
        type: eventName
      };
      if (data) {
        validatedData.data = data;
      }
      event.fire(validatedData);
    }
  }

  /** 
   * @private
   */

  /** 
   * Listen to an event from the custom event system
   * @type {(eventName: string, callback: function) => void} 
   */
  on(eventName, callback) {
    if (typeof eventName !== 'string' || eventName === '' || typeof callback !== 'function') {
      return;
    }
    const split = eventName.split(' ');
    split.forEach(eventItem => {
      js_assertClassBrand(_RmpVast_brand, this, _on).call(this, eventItem, callback);
    });
  }

  /** 
   * @private
   */

  /** 
   * Listen once to an event from the custom event system
   * @type {(eventName: string, callback: function) => void} 
   */
  one(eventName, callback) {
    if (typeof eventName !== 'string' || eventName === '' || typeof callback !== 'function') {
      return;
    }
    const split = eventName.split(' ');
    split.forEach(eventItem => {
      js_assertClassBrand(_RmpVast_brand, this, _one).call(this, eventItem, callback);
    });
  }

  /** 
   * @private
   */

  /** 
   * Unregister an event from the custom event system
   * @type {(eventName: string, callback: function) => void} 
   */
  off(eventName, callback) {
    if (typeof eventName !== 'string' || eventName === '' || typeof callback !== 'function') {
      return;
    }
    const split = eventName.split(' ');
    split.forEach(eventItem => {
      js_assertClassBrand(_RmpVast_brand, this, _off).call(this, eventItem, callback);
    });
  }

  /** 
   * @private
   */

  /** 
   * @param {string} vastData - the URI to the VAST resource to be loaded - or raw VAST XML if params.vastXmlInput is true
   * @param {object} [regulationsInfo] - data for regulations as
   * @param {string} [regulationsInfo.regulations] - coppa|gdpr for REGULATIONS macro
   * @param {string} [regulationsInfo.limitAdTracking] - 0|1 for LIMITADTRACKING macro
   * @param {string} [regulationsInfo.gdprConsent] - Base64-encoded Cookie Value of IAB GDPR consent info for 
   *  GDPRCONSENT macro
   * @param {boolean} [requireCategory] - for enforcement of VAST 4 Ad Categories
   * @return {void}
   */
  loadAds(vastData, regulationsInfo, requireCategory) {
    Logger.print(this.debugRawConsoleLogs, `loadAds method starts`);

    // if player is not initialized - this must be done now
    if (!this.rmpVastInitialized) {
      this.initialize();
    }
    if (typeof regulationsInfo === 'object') {
      const regulationRegExp = /coppa|gdpr/ig;
      if (regulationsInfo.regulations && regulationRegExp.test(regulationsInfo.regulations)) {
        this.regulationsInfo.regulations = regulationsInfo.regulations;
      }
      const limitAdTrackingRegExp = /0|1/ig;
      if (regulationsInfo.limitAdTracking && limitAdTrackingRegExp.test(regulationsInfo.limitAdTracking)) {
        this.regulationsInfo.limitAdTracking = regulationsInfo.limitAdTracking;
      }
      // Base64-encoded Cookie Value of IAB GDPR consent info
      if (regulationsInfo.gdprConsent) {
        this.regulationsInfo.gdprConsent = regulationsInfo.gdprConsent;
      }
    }
    if (requireCategory) {
      this.requireCategory = true;
    }
    let finalVastData = vastData;
    if (!this.params.vastXmlInput) {
      // we have a VAST URI replaceMacros
      finalVastData = this.rmpVastTracking.replaceMacros(vastData, false);
    }

    // if an ad is already on stage we need to clear it first before we can accept another ad request
    if (this.__adOnStage) {
      Logger.print(this.debugRawConsoleLogs, `Creative already on stage calling stopAds before loading new ad`);
      this.one('addestroyed', this.loadAds.bind(this, finalVastData));
      this.stopAds();
      return;
    }
    js_assertClassBrand(_RmpVast_brand, this, _getVastTag).call(this, finalVastData);
  }

  /** 
   * @type {() => void} 
   */
  play() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        this.rmpVastVpaidPlayer.resumeAd();
      } else if (this.rmpVastAdPlayer) {
        this.rmpVastAdPlayer.play();
      }
    } else {
      this.rmpVastContentPlayer.play();
    }
  }

  /** 
   * @type {() => void} 
   */
  pause() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        this.rmpVastVpaidPlayer.pauseAd();
      } else if (this.rmpVastAdPlayer) {
        this.rmpVastAdPlayer.pause();
      }
    } else {
      this.rmpVastContentPlayer.pause();
    }
  }

  /** 
   * @type {() => void} 
   */
  stopAds() {
    if (this.__adOnStage) {
      if (this.rmpVastVpaidPlayer) {
        this.rmpVastVpaidPlayer.stopAd();
      } else if (this.rmpVastSimidPlayer) {
        this.rmpVastSimidPlayer.stopAd();
      } else if (this.rmpVastAdPlayer) {
        // this will destroy ad
        this.rmpVastAdPlayer.resumeContent();
      }
    }
  }

  /** 
   * The difference between stopAds and destroy is that after calling destroy you may not call loadAds again
   * You will need to create a new RmpVast instance. 
   * @type {() => void} 
   */
  destroy() {
    this.rmpVastUtils.destroyFullscreen();
    if (this.rmpVastAdPlayer) {
      this.rmpVastAdPlayer.destroy();
    }
    js_assertClassBrand(_RmpVast_brand, this, _initInstanceVariables).call(this);
  }

  /** 
   * @type {() => void} 
   */
  skipAd() {
    if (this.__adOnStage && this.adSkippableState) {
      if (this.rmpVastVpaidPlayer) {
        this.rmpVastVpaidPlayer.skipAd();
      } else if (this.rmpVastSimidPlayer) {
        this.rmpVastSimidPlayer.skipAd();
      } else if (this.rmpVastAdPlayer) {
        // this will destroy ad
        this.rmpVastAdPlayer.resumeContent();
      }
    }
  }

  /** 
  * @typedef {object} Environment
  * @property {number} devicePixelRatio
  * @property {number} maxTouchPoints
  * @property {boolean} isIpadOS
  * @property {array} isIos
  * @property {array} isAndroid
  * @property {boolean} isMacOSSafari
  * @property {boolean} isFirefox
  * @property {boolean} isMobile
  * @property {boolean} hasNativeFullscreenSupport
  * @return {Environment}
  */
  get environment() {
    return this.environmentData;
  }

  /** 
   * @type {() => boolean} 
   */
  get adPaused() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdPaused();
      } else if (this.currentAdPlayer) {
        return this.currentAdPlayer.paused;
      }
    }
    return false;
  }

  /** 
   * @type {(level: number) => void} 
   */
  set volume(level) {
    if (!FW.isNumber(level)) {
      return;
    }
    let validatedLevel = 0;
    if (level < 0) {
      validatedLevel = 0;
    } else if (level > 1) {
      validatedLevel = 1;
    } else {
      validatedLevel = level;
    }
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        this.rmpVastVpaidPlayer.setAdVolume(validatedLevel);
      }
      if (this.rmpVastAdPlayer) {
        this.rmpVastAdPlayer.volume = validatedLevel;
      }
    }
    this.rmpVastContentPlayer.volume = validatedLevel;
  }

  /** 
   * @type {() => number} 
   */
  get volume() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdVolume();
      } else if (this.rmpVastAdPlayer) {
        return this.rmpVastAdPlayer.volume;
      }
    }
    return this.rmpVastContentPlayer.volume;
  }

  /** 
   * @type {(muted: boolean) => void} 
   */
  set muted(muted) {
    if (typeof muted !== 'boolean') {
      return;
    }
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        if (muted) {
          this.rmpVastVpaidPlayer.setAdVolume(0);
        } else {
          this.rmpVastVpaidPlayer.setAdVolume(1);
        }
      } else if (this.rmpVastAdPlayer) {
        this.rmpVastAdPlayer.muted = muted;
      }
    }
    this.rmpVastContentPlayer.muted = muted;
  }

  /** 
   * @type {() => boolean} 
   */
  get muted() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        if (this.rmpVastVpaidPlayer.getAdVolume() === 0) {
          return true;
        }
        return false;
      } else if (this.rmpVastAdPlayer) {
        return this.rmpVastAdPlayer.muted;
      }
    }
    return this.rmpVastContentPlayer.muted;
  }

  /** 
   * @type {() => string} 
   */
  get adTagUrl() {
    return this.__adTagUrl;
  }

  /** 
   * @type {() => string} 
   */
  get adMediaUrl() {
    if (this.__adOnStage) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getCreativeUrl();
      } else {
        if (this.creative && this.creative.mediaUrl) {
          return this.creative.mediaUrl;
        }
      }
    }
    return '';
  }

  /** 
   * @type {() => boolean} 
   */
  get adLinear() {
    if (this.creative && this.creative.isLinear) {
      return true;
    }
    return false;
  }

  /** 
   * @typedef {object} AdSystem
   * @property {string} value
   * @property {string} version
   * @return {AdSystem}
   */
  get adSystem() {
    // <AdSystem version="2.0" ><![CDATA[AdServer]]></AdSystem>
    // {value: String, version: String}
    if (this.ad && this.ad.system) {
      return {
        value: this.ad.system.value || '',
        version: this.ad.system.version || ''
      };
    }
    return {
      value: '',
      version: ''
    };
  }

  /** 
   * @typedef {object} universalAdId
   * @property {string} idRegistry
   * @property {string} value
   * @return {universalAdId[]}
   */
  get adUniversalAdIds() {
    // <UniversalAdId idRegistry="daily-motion-L">Linear-12345</UniversalAdId>
    // [{idRegistry: String, value: String}]
    if (this.creative && this.creative.universalAdIds) {
      return this.creative.universalAdIds;
    }
    return [];
  }

  /** 
   * @type {() => string} 
   */
  get adContentType() {
    if (this.creative && this.creative.type) {
      return this.creative.type;
    }
    return '';
  }

  /** 
   * @type {() => string} 
   */
  get adTitle() {
    if (this.ad && this.ad.title) {
      return this.ad.title;
    }
    return '';
  }

  /** 
   * @type {() => string} 
   */
  get adDescription() {
    if (this.ad && this.ad.description) {
      return this.ad.description;
    }
    return '';
  }

  /** 
   * @typedef {object} Advertiser
   * @property {string} id
   * @property {string} value
   * @return {Advertiser}
   */
  get adAdvertiser() {
    // <Advertiser id='advertiser-desc'><![CDATA[Advertiser name]]></Advertiser>
    // {id: String, value: String}
    if (this.ad && this.ad.advertiser && this.ad.advertiser !== null) {
      return this.ad.advertiser;
    }
    return {
      id: '',
      value: ''
    };
  }

  /** 
   * @typedef {object} Pricing
   * @property {string} value
   * @property {string} model
   * @property {string} currency
   * @return {Pricing}
   */
  get adPricing() {
    // <Pricing model="CPM" currency="USD" ><![CDATA[1.09]]></Pricing>
    // {value: String, model: String, currency: String}
    if (this.ad && this.ad.pricing && this.ad.pricing !== null) {
      return this.ad.pricing;
    }
    return {
      value: '',
      model: '',
      currency: ''
    };
  }

  /** 
   * @type {() => string} 
   */
  get adSurvey() {
    if (this.ad && this.ad.survey) {
      return this.ad.survey;
    }
    return {
      value: '',
      type: ''
    };
  }

  /** 
   * @type {() => string} 
   */
  get adAdServingId() {
    if (this.ad && this.ad.adServingId) {
      return this.ad.adServingId;
    }
    return '';
  }

  /** 
   * @typedef {object} Category
   * @property {string} authority
   * @property {string} value
   * @return {Category[]}
   */
  get adCategories() {
    // <Category authority=”iabtechlab.com”>232</Category> 
    if (this.ad && this.ad.categories && this.ad.categories.length > 0) {
      return this.ad.categories;
    }
    return [];
  }

  /** 
   * @typedef {object} BlockedAdCategory
   * @property {string} authority
   * @property {string} value
   * @return {BlockedAdCategory[]}
   */
  get adBlockedAdCategories() {
    // <BlockedAdCategories authority=”iabtechlab.com”>232</BlockedAdCategories> 
    if (this.ad && this.ad.blockedAdCategories && this.ad.blockedAdCategories.length > 0) {
      return this.ad.blockedAdCategories;
    }
    return [];
  }

  /** 
   * @type {() => number} 
   */
  get adDuration() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        let duration = this.rmpVastVpaidPlayer.getAdDuration();
        if (duration > 0) {
          duration = duration * 1000;
        }
        return duration;
      } else if (this.rmpVastAdPlayer) {
        return this.rmpVastAdPlayer.duration;
      }
    }
    return -1;
  }

  /** 
   * @type {() => number} 
   */
  get adCurrentTime() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        const remainingTime = this.rmpVastVpaidPlayer.getAdRemainingTime();
        const duration = this.rmpVastVpaidPlayer.getAdDuration();
        if (remainingTime === -1 || duration === -1 || remainingTime > duration) {
          return -1;
        }
        return (duration - remainingTime) * 1000;
      } else if (this.rmpVastAdPlayer) {
        return this.rmpVastAdPlayer.currentTime;
      }
    }
    return -1;
  }

  /** 
   * @type {() => number} 
   */
  get adRemainingTime() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        let adRemainingTime = this.rmpVastVpaidPlayer.getAdRemainingTime();
        if (adRemainingTime > 0) {
          adRemainingTime = adRemainingTime * 1000;
        }
        return adRemainingTime;
      } else if (this.rmpVastAdPlayer) {
        const currentTime = this.rmpVastAdPlayer.currentTime;
        const duration = this.rmpVastAdPlayer.duration;
        if (currentTime === -1 || duration === -1 || currentTime > duration) {
          return -1;
        }
        return duration - currentTime;
      }
    }
    return -1;
  }

  /** 
   * @type {() => boolean} 
   */
  get adOnStage() {
    return this.__adOnStage;
  }

  /** 
   * @type {() => number} 
   */
  get adMediaWidth() {
    if (this.__adOnStage) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdWidth();
      } else if (this.creative && this.creative.width) {
        return this.creative.width;
      }
    }
    return -1;
  }

  /** 
   * @type {() => number} 
   */
  get adMediaHeight() {
    if (this.__adOnStage) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdHeight();
      } else if (this.creative && this.creative.height) {
        return this.creative.height;
      }
    }
    return -1;
  }

  /** 
   * @type {() => string} 
   */
  get clickThroughUrl() {
    if (this.creative && this.creative.clickThroughUrl) {
      return this.creative.clickThroughUrl;
    }
    return '';
  }

  /** 
   * @type {() => number} 
   */
  get skipTimeOffset() {
    if (this.creative && this.creative.skipoffset) {
      return this.creative.skipoffset;
    }
    return -1;
  }

  /** 
   * @type {() => boolean} 
   */
  get isSkippableAd() {
    if (this.creative && this.creative.isSkippableAd) {
      return true;
    }
    return false;
  }

  /** 
   * @type {() => boolean} 
   */
  get contentPlayerCompleted() {
    return this.contentCompleted;
  }

  /** 
   * @param {boolean} value
   * @return {void}
   */
  set contentPlayerCompleted(value) {
    if (typeof value === 'boolean') {
      this.contentCompleted = value;
    }
  }

  /** 
   * @type {() => string} 
   */
  get adErrorMessage() {
    return this.__adErrorMessage;
  }

  /** 
   * @type {() => number} 
   */
  get adVastErrorCode() {
    return this.__vastErrorCode;
  }

  /** 
   * @type {() => string} 
   */
  get adErrorType() {
    return this.__adErrorType;
  }

  /** 
   * @type {() => boolean} 
   */
  get adSkippableState() {
    if (this.__adOnStage) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdSkippableState();
      } else if (this.rmpVastSimidPlayer) {
        return true;
      } else {
        if (this.isSkippableAd && this.rmpVastLinearCreative) {
          return this.rmpVastLinearCreative.skippableAdCanBeSkipped;
        }
      }
    }
    return false;
  }

  /** 
   * @return {HTMLMediaElement|null}
   */
  get adPlayer() {
    return this.currentAdPlayer;
  }

  /** 
   * @return {HTMLMediaElement|null}
   */
  get contentPlayer() {
    return this.currentContentPlayer;
  }

  /** 
   * @type {() => boolean} 
   */
  get initialized() {
    return this.rmpVastInitialized;
  }

  /** 
   * @typedef {object} AdPod
   * @property {number} adPodCurrentIndex
   * @property {number} adPodLength
   * @return {AdPod}
   */
  get adPodInfo() {
    if (this.adPod && this.adPodLength) {
      const result = {};
      result.adPodCurrentIndex = this.adSequence;
      result.adPodLength = this.adPodLength;
      return result;
    }
    return {
      adPodCurrentIndex: -1,
      adPodLength: 0
    };
  }

  /** 
   * @type {() => string} 
   */
  get companionAdsRequiredAttribute() {
    return this.rmpVastCompanionCreative.requiredAttribute;
  }

  /** 
   * @param {number} inputWidth
   * @param {number} inputHeight
   * @typedef {object} Companion
   * @property {string} adSlotId
   * @property {string} altText
   * @property {string} companionClickThroughUrl
   * @property {string} companionClickTrackingUrl
   * @property {number} height
   * @property {number} width
   * @property {string} imageUrl
   * @property {string[]} trackingEventsUri
   * @return {Companion[]}
   */
  getCompanionAdsList(inputWidth, inputHeight) {
    return this.rmpVastCompanionCreative.getList(inputWidth, inputHeight);
  }

  /** 
   * @param {number} index
   * @return {HTMLElement|null}
   */
  getCompanionAd(index) {
    return this.rmpVastCompanionCreative.getItem(index);
  }

  /** 
   * @type {() => void} 
   */
  initialize() {
    if (!this.rmpVastInitialized) {
      Logger.print(this.debugRawConsoleLogs, `Upon user interaction - player needs to be initialized`);
      this.rmpVastAdPlayer = new AdPlayer(this);
      this.rmpVastAdPlayer.init();
    }
  }

  // VPAID methods
  /** 
   * @type {(width: number, height: number, viewMode: string) => void} 
   */
  resizeAd(width, height, viewMode) {
    if (this.rmpVastVpaidPlayer) {
      this.rmpVastVpaidPlayer.resizeAd(width, height, viewMode);
    }
  }

  /** 
   * @type {() => void} 
   */
  expandAd() {
    if (this.rmpVastVpaidPlayer) {
      this.rmpVastVpaidPlayer.expandAd();
    }
  }

  /** 
   * @type {() => void} 
   */
  collapseAd() {
    if (this.rmpVastVpaidPlayer) {
      this.rmpVastVpaidPlayer.collapseAd();
    }
  }

  /** 
   * @type {() => boolean} 
   */
  get adExpanded() {
    if (this.rmpVastVpaidPlayer) {
      this.rmpVastVpaidPlayer.getAdExpanded();
    }
    return false;
  }

  /** 
   * @type {() => string} 
   */
  get vpaidCompanionAds() {
    if (this.rmpVastVpaidPlayer) {
      this.rmpVastVpaidPlayer.getAdCompanions();
    }
    return '';
  }
}
function _initInstanceVariables() {
  this.adContainer = null;
  this.contentWrapper = null;
  this.container = null;
  this.rmpVastContentPlayer = null;
  this.rmpVastAdPlayer = null;
  this.rmpVastUtils = null;
  this.rmpVastTracking = null;
  this.rmpVastCompanionCreative = null;
  this.environmentData = null;
  this.currentContentSrc = '';
  this.currentContentCurrentTime = -1;
  this.params = {};
  this.events = {};
  this.isInFullscreen = false;
  this.contentCompleted = false;
  this.currentContentPlayer = null;
  this.currentAdPlayer = null;
  this.rmpVastInitialized = false;
  this.debugRawConsoleLogs = false;
  // adpod
  this.adPod = false;
  this.adPodLength = 0;
  this.adSequence = 0;
}
function _on(eventName, callback) {
  // First we grab the event from this.events
  let event = this.events[eventName];
  // If the event does not exist then we should create it!
  if (!event) {
    event = new Dispatcher(eventName);
    this.events[eventName] = event;
  }
  // Now we add the callback to the event
  event.registerCallback(callback);
}
function _one(eventName, callback) {
  const newCallback = e => {
    this.off(eventName, newCallback);
    callback(e);
  };
  this.on(eventName, newCallback);
}
function _off(eventName, callback) {
  // First get the correct event
  const event = this.events[eventName];
  // Check that the event exists and it has the callback registered
  if (event && event.callbacks.indexOf(callback) > -1) {
    // if it is registered then unregister it!
    event.unregisterCallback(callback);
    // if the event has no callbacks left, delete the event
    if (event.callbacks.length === 0) {
      delete this.events[eventName];
    }
  }
}
function _addTrackingEvents(trackingEvents) {
  const keys = Object.keys(trackingEvents);
  keys.forEach(key => {
    trackingEvents[key].forEach(url => {
      var _context;
      push_default()(_context = this.trackingTags).call(_context, {
        event: key,
        url
      });
    });
  });
}
/** 
 * @private
 */
function _handleIntersect(entries) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > this.viewablePreviousRatio) {
      this.viewableObserver.unobserve(this.container);
      this.rmpVastTracking.dispatchTrackingAndApiEvent('adviewable');
    }
    this.viewablePreviousRatio = entry.intersectionRatio;
  });
}
/** 
 * @private
 */
function _attachViewableObserver() {
  this.off('adstarted', this.attachViewableObserverFn);
  if (typeof window.IntersectionObserver !== 'undefined') {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.5]
    };
    this.viewableObserver = new IntersectionObserver(js_assertClassBrand(_RmpVast_brand, this, _handleIntersect).bind(this), options);
    this.viewableObserver.observe(this.container);
  } else {
    this.rmpVastTracking.dispatchTrackingAndApiEvent('adviewundetermined');
  }
}
/** 
 * @private
 */
function _initViewableImpression() {
  if (this.viewableObserver) {
    this.viewableObserver.unobserve(this.container);
  }
  this.ad.viewableImpression.forEach(viewableImpression => {
    if (viewableImpression.viewable.length > 0) {
      viewableImpression.viewable.forEach(url => {
        var _context2;
        push_default()(_context2 = this.trackingTags).call(_context2, {
          event: 'viewable',
          url
        });
      });
    }
    if (viewableImpression.notViewable.length > 0) {
      viewableImpression.notViewable.forEach(url => {
        var _context3;
        push_default()(_context3 = this.trackingTags).call(_context3, {
          event: 'notviewable',
          url
        });
      });
    }
    if (viewableImpression.viewUndetermined.length > 0) {
      viewableImpression.viewUndetermined.forEach(url => {
        var _context4;
        push_default()(_context4 = this.trackingTags).call(_context4, {
          event: 'viewundetermined',
          url
        });
      });
    }
  });
  this.attachViewableObserverFn = js_assertClassBrand(_RmpVast_brand, this, _attachViewableObserver).bind(this);
  this.on('adstarted', this.attachViewableObserverFn);
}
/** 
 * @private
 */
async function _loopAds(ads) {
  for (let i = 0; i < ads.length; i++) {
    await new (promise_default())(resolve => {
      const currentAd = ads[i];
      Logger.print(this.debugRawConsoleLogs, `currentAd follows`, currentAd);
      this.ad.id = currentAd.id;
      this.ad.adServingId = currentAd.adServingId;
      this.ad.categories = currentAd.categories;
      if (this.requireCategory) {
        if (this.ad.categories.length === 0 || !this.ad.categories[0].authority) {
          this.rmpVastUtils.processVastErrors(204, true);
          resolve();
        }
      }
      this.ad.blockedAdCategories = currentAd.blockedAdCategories;
      if (this.requireCategory) {
        let haltDueToBlockedAdCategories = false;
        this.ad.blockedAdCategories.forEach(blockedAdCategory => {
          const blockedAdCategoryAuthority = blockedAdCategory.authority;
          const blockedAdCategoryValue = blockedAdCategory.value;
          this.ad.categories.forEach(category => {
            const categoriesAuthority = category.authority;
            const categoriesValue = category.value;
            if (blockedAdCategoryAuthority === categoriesAuthority && blockedAdCategoryValue === categoriesValue) {
              this.rmpVastUtils.processVastErrors(205, true);
              haltDueToBlockedAdCategories = true;
            }
          });
        });
        if (haltDueToBlockedAdCategories) {
          resolve();
        }
      }
      this.ad.adType = currentAd.adType;
      this.ad.title = currentAd.title;
      this.ad.description = currentAd.description;
      this.ad.system = currentAd.system;
      this.ad.advertiser = currentAd.advertiser;
      this.ad.pricing = currentAd.pricing;
      this.ad.survey = currentAd.survey;
      this.ad.sequence = currentAd.sequence;
      ads.find(ad => {
        this.adPod = false;
        if (ad.sequence && ad.sequence > 1) {
          this.adPod = true;
          return true;
        }
        return false;
      });
      // this is to fix a weird bug in vast-client-js - sometimes it returns sequence === null for some items when
      // adpod is made of redirects
      if (this.adPod) {
        let max = reduce_default()(ads).call(ads, (prev, current) => {
          return prev.sequence > current.sequence ? prev : current;
        }).sequence;
        ads.forEach(ad => {
          if (ad.sequence === null) {
            ad.sequence = max + 1;
            max++;
          }
        });
        this.adSequence++;
        if (this.adPodLength === 0) {
          let adPodLength = 0;
          ads.forEach(ad => {
            if (ad.sequence) {
              adPodLength++;
            }
          });
          this.adPodLength = adPodLength;
          Logger.print(this.debugRawConsoleLogs, `AdPod detected with length ${this.adPodLength}`, currentAd);
        }
        this.one('addestroyed', () => {
          if (this.adSequence === this.adPodLength) {
            this.adPodLength = 0;
            this.adSequence = 0;
            this.adPod = false;
            this.rmpVastUtils.createApiEvent('adpodcompleted');
          }
          resolve();
        });
      }
      this.ad.viewableImpression = currentAd.viewableImpression;
      if (this.ad.viewableImpression.length > 0) {
        js_assertClassBrand(_RmpVast_brand, this, _initViewableImpression).call(this);
      }
      currentAd.errorURLTemplates.forEach(errorURLTemplate => {
        var _context5;
        push_default()(_context5 = this.adErrorTags).call(_context5, {
          event: 'error',
          url: errorURLTemplate
        });
      });
      currentAd.impressionURLTemplates.forEach(impression => {
        if (impression.url) {
          var _context6;
          push_default()(_context6 = this.trackingTags).call(_context6, {
            event: 'impression',
            url: impression.url
          });
        }
      });

      // parse companion
      const creatives = currentAd.creatives;
      Logger.print(this.debugRawConsoleLogs, `Parsed creatives follow`, creatives);
      creatives.find(creative => {
        if (creative.type === 'companion') {
          Logger.print(this.debugRawConsoleLogs, `Creative type companion detected`);
          this.rmpVastCompanionCreative.parse(creative);
          return true;
        }
        return false;
      });
      for (let k = 0; k < creatives.length; k++) {
        const creative = creatives[k];
        // companion >> continue
        if (creative.type === 'companion') {
          continue;
        }
        this.creative.id = creative.id;
        this.creative.universalAdIds = creative.universalAdIds;
        this.creative.adId = creative.adId;
        this.creative.trackingEvents = creative.trackingEvents;
        switch (creative.type) {
          case 'linear':
            this.creative.duration = creative.duration;
            this.creative.skipDelay = creative.skipDelay;
            if (this.creative.skipDelay) {
              this.creative.skipoffset = creative.skipDelay;
              this.creative.isSkippableAd = true;
            }
            if (creative.videoClickThroughURLTemplate && creative.videoClickThroughURLTemplate.url) {
              this.creative.clickThroughUrl = creative.videoClickThroughURLTemplate.url;
            }
            if (creative.videoClickTrackingURLTemplates.length > 0) {
              creative.videoClickTrackingURLTemplates.forEach(videoClickTrackingURLTemplate => {
                if (videoClickTrackingURLTemplate.url) {
                  var _context7;
                  push_default()(_context7 = this.trackingTags).call(_context7, {
                    event: 'clickthrough',
                    url: videoClickTrackingURLTemplate.url
                  });
                }
              });
            }
            this.creative.isLinear = true;
            if (creative.interactiveCreativeFile && /simid/i.test(creative.interactiveCreativeFile.apiFramework) && /text\/html/i.test(creative.interactiveCreativeFile.type)) {
              this.creative.simid = {
                fileURL: creative.interactiveCreativeFile.fileURL,
                variableDuration: creative.interactiveCreativeFile.variableDuration
              };
              if (creative.adParameters && creative.adParameters.value) {
                this.creative.simid.adParameters = creative.adParameters.value;
              }
            }
            js_assertClassBrand(_RmpVast_brand, this, _addTrackingEvents).call(this, creative.trackingEvents);
            this.rmpVastLinearCreative = new LinearCreative(this);
            this.rmpVastLinearCreative.parse(creative);
            if (this.params.omidSupport && currentAd.adVerifications.length > 0) {
              const omSdkManager = new OmSdkManager(currentAd.adVerifications, this);
              omSdkManager.init();
            }
            break;
          case 'nonlinear':
            this.creative.isLinear = false;
            js_assertClassBrand(_RmpVast_brand, this, _addTrackingEvents).call(this, creative.trackingEvents);
            this.rmpVastNonLinearCreative = new NonLinearCreative(this);
            this.rmpVastNonLinearCreative.parse(creative.variations);
            break;
          default:
            break;
        }
      }
    });
  }
}
/** 
 * @private
 */
function _handleParsedVast(response) {
  Logger.print(this.debugRawConsoleLogs, `VAST response follows`, response);

  // error at VAST/Error level
  if (response.errorURLTemplates.length > 0) {
    response.errorURLTemplates.forEach(errorURLTemplate => {
      var _context8;
      push_default()(_context8 = this.vastErrorTags).call(_context8, {
        event: 'error',
        url: errorURLTemplate
      });
    });
  }
  // VAST/Ad 
  if (response.ads.length === 0) {
    this.rmpVastUtils.processVastErrors(303, true);
    return;
  } else {
    js_assertClassBrand(_RmpVast_brand, this, _loopAds).call(this, response.ads);
  }
}
/** 
 * @private
 */
function _getVastTag(vastData) {
  // we check for required VAST input and API here
  // as we need to have this.currentContentSrc available for iOS
  if (typeof vastData !== 'string' || vastData === '') {
    this.rmpVastUtils.processVastErrors(1001, false);
    return;
  }
  if (typeof DOMParser === 'undefined') {
    this.rmpVastUtils.processVastErrors(1002, false);
    return;
  }
  this.rmpVastUtils.createApiEvent('adtagstartloading');
  if (!this.params.vastXmlInput) {
    const vastClient = new _();
    const options = {
      timeout: this.params.ajaxTimeout,
      withCredentials: this.params.ajaxWithCredentials,
      wrapperLimit: this.params.maxNumRedirects,
      resolveAll: false,
      allowMultipleAds: true
    };
    this.__adTagUrl = vastData;
    Logger.print(this.debugRawConsoleLogs, `Try to load VAST tag at: ${this.__adTagUrl}`);
    vastClient.get(this.__adTagUrl, options).then(response => {
      this.rmpVastUtils.createApiEvent('adtagloaded');
      js_assertClassBrand(_RmpVast_brand, this, _handleParsedVast).call(this, response);
    }).catch(error => {
      console.warn(error);
      // PING 900 Undefined Error.
      this.rmpVastUtils.processVastErrors(900, true);
    });
  } else {
    // input is not a VAST URI but raw VAST XML -> we parse it and proceed
    let vastXml;
    try {
      vastXml = new DOMParser().parseFromString(vastData, 'text/xml');
    } catch (error) {
      console.warn(error);
      // PING 900 Undefined Error.
      this.rmpVastUtils.processVastErrors(900, true);
      return;
    }
    const vastParser = new _();
    vastParser.parseVAST(vastXml).then(response => {
      this.rmpVastUtils.createApiEvent('adtagloaded');
      js_assertClassBrand(_RmpVast_brand, this, _handleParsedVast).call(this, response);
    }).catch(error => {
      console.warn(error);
      // PING 900 Undefined Error.
      this.rmpVastUtils.processVastErrors(900, true);
    });
  }
}
}();
window.RmpVast = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=rmp-vast.js.map