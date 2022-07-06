/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9662:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var tryToString = __webpack_require__(6330);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 9483:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isConstructor = __webpack_require__(4411);
var tryToString = __webpack_require__(6330);

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a constructor');
};


/***/ }),

/***/ 6077:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 1223:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);
var create = __webpack_require__(30);
var defineProperty = (__webpack_require__(3070).f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 1530:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = (__webpack_require__(8710).charAt);

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ 5787:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isPrototypeOf = __webpack_require__(7976);

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw $TypeError('Incorrect invocation');
};


/***/ }),

/***/ 9670:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 8533:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $forEach = (__webpack_require__(2092).forEach);
var arrayMethodIsStrict = __webpack_require__(9341);

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
} : [].forEach;


/***/ }),

/***/ 8457:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(9974);
var call = __webpack_require__(6916);
var toObject = __webpack_require__(7908);
var callWithSafeIterationClosing = __webpack_require__(3411);
var isArrayIteratorMethod = __webpack_require__(7659);
var isConstructor = __webpack_require__(4411);
var lengthOfArrayLike = __webpack_require__(6244);
var createProperty = __webpack_require__(6135);
var getIterator = __webpack_require__(8554);
var getIteratorMethod = __webpack_require__(1246);

var $Array = Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    result = IS_CONSTRUCTOR ? new this() : [];
    for (;!(step = call(next, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ 1318:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(5656);
var toAbsoluteIndex = __webpack_require__(1400);
var lengthOfArrayLike = __webpack_require__(6244);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
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

/***/ 2092:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var bind = __webpack_require__(9974);
var uncurryThis = __webpack_require__(1702);
var IndexedObject = __webpack_require__(8361);
var toObject = __webpack_require__(7908);
var lengthOfArrayLike = __webpack_require__(6244);
var arraySpeciesCreate = __webpack_require__(5417);

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
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

/***/ 6583:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es-x/no-array-prototype-lastindexof -- safe */
var apply = __webpack_require__(2104);
var toIndexedObject = __webpack_require__(5656);
var toIntegerOrInfinity = __webpack_require__(9303);
var lengthOfArrayLike = __webpack_require__(6244);
var arrayMethodIsStrict = __webpack_require__(9341);

var min = Math.min;
var $lastIndexOf = [].lastIndexOf;
var NEGATIVE_ZERO = !!$lastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('lastIndexOf');
var FORCED = NEGATIVE_ZERO || !STRICT_METHOD;

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
module.exports = FORCED ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO) return apply($lastIndexOf, this, arguments) || 0;
  var O = toIndexedObject(this);
  var length = lengthOfArrayLike(O);
  var index = length - 1;
  if (arguments.length > 1) index = min(index, toIntegerOrInfinity(arguments[1]));
  if (index < 0) index = length + index;
  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
  return -1;
} : $lastIndexOf;


/***/ }),

/***/ 1194:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var wellKnownSymbol = __webpack_require__(5112);
var V8_VERSION = __webpack_require__(7392);

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ 9341:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(7293);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ 3671:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(9662);
var toObject = __webpack_require__(7908);
var IndexedObject = __webpack_require__(8361);
var lengthOfArrayLike = __webpack_require__(6244);

var $TypeError = TypeError;

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aCallable(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(O);
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
        throw $TypeError('Reduce of empty array with no initial value');
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

/***/ 1589:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toAbsoluteIndex = __webpack_require__(1400);
var lengthOfArrayLike = __webpack_require__(6244);
var createProperty = __webpack_require__(6135);

var $Array = Array;
var max = Math.max;

module.exports = function (O, start, end) {
  var length = lengthOfArrayLike(O);
  var k = toAbsoluteIndex(start, length);
  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
  var result = $Array(max(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
  result.length = n;
  return result;
};


/***/ }),

/***/ 206:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

module.exports = uncurryThis([].slice);


/***/ }),

/***/ 4362:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var arraySlice = __webpack_require__(1589);

var floor = Math.floor;

var mergeSort = function (array, comparefn) {
  var length = array.length;
  var middle = floor(length / 2);
  return length < 8 ? insertionSort(array, comparefn) : merge(
    array,
    mergeSort(arraySlice(array, 0, middle), comparefn),
    mergeSort(arraySlice(array, middle), comparefn),
    comparefn
  );
};

var insertionSort = function (array, comparefn) {
  var length = array.length;
  var i = 1;
  var element, j;

  while (i < length) {
    j = i;
    element = array[i];
    while (j && comparefn(array[j - 1], element) > 0) {
      array[j] = array[--j];
    }
    if (j !== i++) array[j] = element;
  } return array;
};

var merge = function (array, left, right, comparefn) {
  var llength = left.length;
  var rlength = right.length;
  var lindex = 0;
  var rindex = 0;

  while (lindex < llength || rindex < rlength) {
    array[lindex + rindex] = (lindex < llength && rindex < rlength)
      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
      : lindex < llength ? left[lindex++] : right[rindex++];
  } return array;
};

module.exports = mergeSort;


/***/ }),

/***/ 7475:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isArray = __webpack_require__(3157);
var isConstructor = __webpack_require__(4411);
var isObject = __webpack_require__(111);
var wellKnownSymbol = __webpack_require__(5112);

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

/***/ 5417:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var arraySpeciesConstructor = __webpack_require__(7475);

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),

/***/ 3411:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(9670);
var iteratorClose = __webpack_require__(9212);

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};


/***/ }),

/***/ 7072:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);

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
  // eslint-disable-next-line es-x/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
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

/***/ 4326:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 648:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var isCallable = __webpack_require__(614);
var classofRaw = __webpack_require__(4326);
var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

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
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ 9920:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(2597);
var ownKeys = __webpack_require__(3887);
var getOwnPropertyDescriptorModule = __webpack_require__(1236);
var definePropertyModule = __webpack_require__(3070);

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

/***/ 4964:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);

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

/***/ 8544:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es-x/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ 4994:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IteratorPrototype = (__webpack_require__(3383).IteratorPrototype);
var create = __webpack_require__(30);
var createPropertyDescriptor = __webpack_require__(9114);
var setToStringTag = __webpack_require__(8003);
var Iterators = __webpack_require__(7497);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ 8880:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var definePropertyModule = __webpack_require__(3070);
var createPropertyDescriptor = __webpack_require__(9114);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 9114:
/***/ (function(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 6135:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPropertyKey = __webpack_require__(4948);
var definePropertyModule = __webpack_require__(3070);
var createPropertyDescriptor = __webpack_require__(9114);

module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ 8052:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var definePropertyModule = __webpack_require__(3070);
var makeBuiltIn = __webpack_require__(6339);
var defineGlobalProperty = __webpack_require__(3072);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 3072:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);

// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 654:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var call = __webpack_require__(6916);
var IS_PURE = __webpack_require__(1913);
var FunctionName = __webpack_require__(6530);
var isCallable = __webpack_require__(614);
var createIteratorConstructor = __webpack_require__(4994);
var getPrototypeOf = __webpack_require__(9518);
var setPrototypeOf = __webpack_require__(7674);
var setToStringTag = __webpack_require__(8003);
var createNonEnumerableProperty = __webpack_require__(8880);
var defineBuiltIn = __webpack_require__(8052);
var wellKnownSymbol = __webpack_require__(5112);
var Iterators = __webpack_require__(7497);
var IteratorsCore = __webpack_require__(3383);

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
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
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
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
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

/***/ 7235:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var path = __webpack_require__(857);
var hasOwn = __webpack_require__(2597);
var wrappedWellKnownSymbolModule = __webpack_require__(6061);
var defineProperty = (__webpack_require__(3070).f);

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),

/***/ 5117:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var tryToString = __webpack_require__(6330);

var $TypeError = TypeError;

module.exports = function (O, P) {
  if (!delete O[P]) throw $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
};


/***/ }),

/***/ 9781:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ 317:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 7207:
/***/ (function(module) {

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ 8324:
/***/ (function(module) {

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

/***/ 8509:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = __webpack_require__(317);

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;


/***/ }),

/***/ 8886:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var userAgent = __webpack_require__(8113);

var firefox = userAgent.match(/firefox\/(\d+)/i);

module.exports = !!firefox && +firefox[1];


/***/ }),

/***/ 7871:
/***/ (function(module) {

module.exports = typeof window == 'object' && typeof Deno != 'object';


/***/ }),

/***/ 256:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var UA = __webpack_require__(8113);

module.exports = /MSIE|Trident/.test(UA);


/***/ }),

/***/ 1528:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var userAgent = __webpack_require__(8113);
var global = __webpack_require__(7854);

module.exports = /ipad|iphone|ipod/i.test(userAgent) && global.Pebble !== undefined;


/***/ }),

/***/ 6833:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var userAgent = __webpack_require__(8113);

module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);


/***/ }),

/***/ 5268:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(4326);
var global = __webpack_require__(7854);

module.exports = classof(global.process) == 'process';


/***/ }),

/***/ 1036:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var userAgent = __webpack_require__(8113);

module.exports = /web0s(?!.*chrome)/i.test(userAgent);


/***/ }),

/***/ 8113:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ 7392:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var userAgent = __webpack_require__(8113);

var process = global.process;
var Deno = global.Deno;
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

/***/ 8008:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var userAgent = __webpack_require__(8113);

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

module.exports = !!webkit && +webkit[1];


/***/ }),

/***/ 748:
/***/ (function(module) {

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

/***/ 2109:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var getOwnPropertyDescriptor = (__webpack_require__(1236).f);
var createNonEnumerableProperty = __webpack_require__(8880);
var defineBuiltIn = __webpack_require__(8052);
var defineGlobalProperty = __webpack_require__(3072);
var copyConstructorProperties = __webpack_require__(9920);
var isForced = __webpack_require__(4705);

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
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 7293:
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 7007:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__(4916);
var uncurryThis = __webpack_require__(1702);
var defineBuiltIn = __webpack_require__(8052);
var regexpExec = __webpack_require__(2261);
var fails = __webpack_require__(7293);
var wellKnownSymbol = __webpack_require__(5112);
var createNonEnumerableProperty = __webpack_require__(8880);

var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

module.exports = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var uncurriedNativeRegExpMethod = uncurryThis(/./[SYMBOL]);
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var uncurriedNativeMethod = uncurryThis(nativeMethod);
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
        }
        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
      }
      return { done: false };
    });

    defineBuiltIn(String.prototype, KEY, methods[0]);
    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};


/***/ }),

/***/ 2104:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(4374);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es-x/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ 9974:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var aCallable = __webpack_require__(9662);
var NATIVE_BIND = __webpack_require__(4374);

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 4374:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 7065:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(1702);
var aCallable = __webpack_require__(9662);
var isObject = __webpack_require__(111);
var hasOwn = __webpack_require__(2597);
var arraySlice = __webpack_require__(206);
var NATIVE_BIND = __webpack_require__(4374);

var $Function = Function;
var concat = uncurryThis([].concat);
var join = uncurryThis([].join);
var factories = {};

var construct = function (C, argsLength, args) {
  if (!hasOwn(factories, argsLength)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    factories[argsLength] = $Function('C,a', 'return new C(' + join(list, ',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
module.exports = NATIVE_BIND ? $Function.bind : function bind(that /* , ...args */) {
  var F = aCallable(this);
  var Prototype = F.prototype;
  var partArgs = arraySlice(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = concat(partArgs, arraySlice(arguments));
    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
  };
  if (isObject(Prototype)) boundFunction.prototype = Prototype;
  return boundFunction;
};


/***/ }),

/***/ 6916:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(4374);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 6530:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var hasOwn = __webpack_require__(2597);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
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

/***/ 1702:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(4374);

var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var uncurryThis = NATIVE_BIND && bind.bind(call, call);

module.exports = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 5005:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 1246:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(648);
var getMethod = __webpack_require__(8173);
var Iterators = __webpack_require__(7497);
var wellKnownSymbol = __webpack_require__(5112);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),

/***/ 8554:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var aCallable = __webpack_require__(9662);
var anObject = __webpack_require__(9670);
var tryToString = __webpack_require__(6330);
var getIteratorMethod = __webpack_require__(1246);

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ }),

/***/ 8173:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(9662);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};


/***/ }),

/***/ 647:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var toObject = __webpack_require__(7908);

var floor = Math.floor;
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt(ch, 0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return stringSlice(str, 0, position);
      case "'": return stringSlice(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice(ch, 1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};


/***/ }),

/***/ 7854:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 2597:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var toObject = __webpack_require__(7908);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es-x/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 3501:
/***/ (function(module) {

module.exports = {};


/***/ }),

/***/ 842:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length == 1 ? console.error(a) : console.error(a, b);
  }
};


/***/ }),

/***/ 490:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 4664:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);
var createElement = __webpack_require__(317);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ 8361:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var fails = __webpack_require__(7293);
var classof = __webpack_require__(4326);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 9587:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);
var setPrototypeOf = __webpack_require__(7674);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ 2788:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var isCallable = __webpack_require__(614);
var store = __webpack_require__(5465);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 9909:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(8536);
var global = __webpack_require__(7854);
var uncurryThis = __webpack_require__(1702);
var isObject = __webpack_require__(111);
var createNonEnumerableProperty = __webpack_require__(8880);
var hasOwn = __webpack_require__(2597);
var shared = __webpack_require__(5465);
var sharedKey = __webpack_require__(6200);
var hiddenKeys = __webpack_require__(3501);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
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

/***/ 7659:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);
var Iterators = __webpack_require__(7497);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ 3157:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(4326);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es-x/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ }),

/***/ 614:
/***/ (function(module) {

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 4411:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);
var classof = __webpack_require__(648);
var getBuiltIn = __webpack_require__(5005);
var inspectSource = __webpack_require__(2788);

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
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

/***/ 4705:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
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

/***/ 111:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 1913:
/***/ (function(module) {

module.exports = false;


/***/ }),

/***/ 7850:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);
var classof = __webpack_require__(4326);
var wellKnownSymbol = __webpack_require__(5112);

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),

/***/ 2190:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);
var isCallable = __webpack_require__(614);
var isPrototypeOf = __webpack_require__(7976);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 408:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var bind = __webpack_require__(9974);
var call = __webpack_require__(6916);
var anObject = __webpack_require__(9670);
var tryToString = __webpack_require__(6330);
var isArrayIteratorMethod = __webpack_require__(7659);
var lengthOfArrayLike = __webpack_require__(6244);
var isPrototypeOf = __webpack_require__(7976);
var getIterator = __webpack_require__(8554);
var getIteratorMethod = __webpack_require__(1246);
var iteratorClose = __webpack_require__(9212);

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = iterator.next;
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

/***/ 9212:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var anObject = __webpack_require__(9670);
var getMethod = __webpack_require__(8173);

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

/***/ 3383:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);
var create = __webpack_require__(30);
var getPrototypeOf = __webpack_require__(9518);
var defineBuiltIn = __webpack_require__(8052);
var wellKnownSymbol = __webpack_require__(5112);
var IS_PURE = __webpack_require__(1913);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es-x/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
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

/***/ 7497:
/***/ (function(module) {

module.exports = {};


/***/ }),

/***/ 6244:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toLength = __webpack_require__(7466);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 6339:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);
var hasOwn = __webpack_require__(2597);
var DESCRIPTORS = __webpack_require__(9781);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(6530).CONFIGURABLE);
var inspectSource = __webpack_require__(2788);
var InternalStateModule = __webpack_require__(9909);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 4758:
/***/ (function(module) {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es-x/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 5948:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var bind = __webpack_require__(9974);
var getOwnPropertyDescriptor = (__webpack_require__(1236).f);
var macrotask = (__webpack_require__(261).set);
var IS_IOS = __webpack_require__(6833);
var IS_IOS_PEBBLE = __webpack_require__(1528);
var IS_WEBOS_WEBKIT = __webpack_require__(1036);
var IS_NODE = __webpack_require__(5268);

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
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
    // strange IE + webpack dev server bug - use .bind(global)
    macrotask = bind(macrotask, global);
    notify = function () {
      macrotask(flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};


/***/ }),

/***/ 735:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__(133);

/* eslint-disable es-x/no-symbol -- safe */
module.exports = NATIVE_SYMBOL && !!Symbol['for'] && !!Symbol.keyFor;


/***/ }),

/***/ 133:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es-x/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(7392);
var fails = __webpack_require__(7293);

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 8536:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);
var inspectSource = __webpack_require__(2788);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));


/***/ }),

/***/ 8523:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(9662);

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
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

/***/ 3929:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isRegExp = __webpack_require__(7850);

var $TypeError = TypeError;

module.exports = function (it) {
  if (isRegExp(it)) {
    throw $TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),

/***/ 7023:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);

var globalIsFinite = global.isFinite;

// `Number.isFinite` method
// https://tc39.es/ecma262/#sec-number.isfinite
// eslint-disable-next-line es-x/no-number-isfinite -- safe
module.exports = Number.isFinite || function isFinite(it) {
  return typeof it == 'number' && globalIsFinite(it);
};


/***/ }),

/***/ 2814:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var fails = __webpack_require__(7293);
var uncurryThis = __webpack_require__(1702);
var toString = __webpack_require__(1340);
var trim = (__webpack_require__(3111).trim);
var whitespaces = __webpack_require__(1361);

var charAt = uncurryThis(''.charAt);
var n$ParseFloat = global.parseFloat;
var Symbol = global.Symbol;
var ITERATOR = Symbol && Symbol.iterator;
var FORCED = 1 / n$ParseFloat(whitespaces + '-0') !== -Infinity
  // MS Edge 18- broken with boxed symbols
  || (ITERATOR && !fails(function () { n$ParseFloat(Object(ITERATOR)); }));

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
module.exports = FORCED ? function parseFloat(string) {
  var trimmedString = trim(toString(string));
  var result = n$ParseFloat(trimmedString);
  return result === 0 && charAt(trimmedString, 0) == '-' ? -0 : result;
} : n$ParseFloat;


/***/ }),

/***/ 3009:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var fails = __webpack_require__(7293);
var uncurryThis = __webpack_require__(1702);
var toString = __webpack_require__(1340);
var trim = (__webpack_require__(3111).trim);
var whitespaces = __webpack_require__(1361);

var $parseInt = global.parseInt;
var Symbol = global.Symbol;
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

/***/ 1574:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9781);
var uncurryThis = __webpack_require__(1702);
var call = __webpack_require__(6916);
var fails = __webpack_require__(7293);
var objectKeys = __webpack_require__(1956);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var propertyIsEnumerableModule = __webpack_require__(5296);
var toObject = __webpack_require__(7908);
var IndexedObject = __webpack_require__(8361);

// eslint-disable-next-line es-x/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es-x/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ 30:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(9670);
var definePropertiesModule = __webpack_require__(6048);
var enumBugKeys = __webpack_require__(748);
var hiddenKeys = __webpack_require__(3501);
var html = __webpack_require__(490);
var documentCreateElement = __webpack_require__(317);
var sharedKey = __webpack_require__(6200);

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
  activeXDocument = null; // avoid memory leak
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
// eslint-disable-next-line es-x/no-object-create -- safe
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

/***/ 6048:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(3353);
var definePropertyModule = __webpack_require__(3070);
var anObject = __webpack_require__(9670);
var toIndexedObject = __webpack_require__(5656);
var objectKeys = __webpack_require__(1956);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es-x/no-object-defineproperties -- safe
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

/***/ 3070:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var IE8_DOM_DEFINE = __webpack_require__(4664);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(3353);
var anObject = __webpack_require__(9670);
var toPropertyKey = __webpack_require__(4948);

var $TypeError = TypeError;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
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
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 1236:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var call = __webpack_require__(6916);
var propertyIsEnumerableModule = __webpack_require__(5296);
var createPropertyDescriptor = __webpack_require__(9114);
var toIndexedObject = __webpack_require__(5656);
var toPropertyKey = __webpack_require__(4948);
var hasOwn = __webpack_require__(2597);
var IE8_DOM_DEFINE = __webpack_require__(4664);

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
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

/***/ 1156:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es-x/no-object-getownpropertynames -- safe */
var classof = __webpack_require__(4326);
var toIndexedObject = __webpack_require__(5656);
var $getOwnPropertyNames = (__webpack_require__(8006).f);
var arraySlice = __webpack_require__(1589);

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
  return windowNames && classof(it) == 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};


/***/ }),

/***/ 8006:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 5181:
/***/ (function(__unused_webpack_module, exports) {

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 9518:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(2597);
var isCallable = __webpack_require__(614);
var toObject = __webpack_require__(7908);
var sharedKey = __webpack_require__(6200);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(8544);

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es-x/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ 7976:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 6324:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var hasOwn = __webpack_require__(2597);
var toIndexedObject = __webpack_require__(5656);
var indexOf = (__webpack_require__(1318).indexOf);
var hiddenKeys = __webpack_require__(3501);

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

/***/ 1956:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es-x/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 5296:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
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

/***/ 7674:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var uncurryThis = __webpack_require__(1702);
var anObject = __webpack_require__(9670);
var aPossiblePrototype = __webpack_require__(6077);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 288:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var classof = __webpack_require__(648);

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ 2140:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 3887:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);
var uncurryThis = __webpack_require__(1702);
var getOwnPropertyNamesModule = __webpack_require__(8006);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var anObject = __webpack_require__(9670);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 857:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);

module.exports = global;


/***/ }),

/***/ 2534:
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ 3702:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var NativePromiseConstructor = __webpack_require__(2492);
var isCallable = __webpack_require__(614);
var isForced = __webpack_require__(4705);
var inspectSource = __webpack_require__(2788);
var wellKnownSymbol = __webpack_require__(5112);
var IS_BROWSER = __webpack_require__(7871);
var IS_PURE = __webpack_require__(1913);
var V8_VERSION = __webpack_require__(7392);

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var SPECIES = wellKnownSymbol('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT = isCallable(global.PromiseRejectionEvent);

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
  if (V8_VERSION >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
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
  return !GLOBAL_CORE_JS_PROMISE && IS_BROWSER && !NATIVE_PROMISE_REJECTION_EVENT;
});

module.exports = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
  SUBCLASSING: SUBCLASSING
};


/***/ }),

/***/ 2492:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);

module.exports = global.Promise;


/***/ }),

/***/ 9478:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(9670);
var isObject = __webpack_require__(111);
var newPromiseCapability = __webpack_require__(8523);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ 612:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NativePromiseConstructor = __webpack_require__(2492);
var checkCorrectnessOfIteration = __webpack_require__(7072);
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(3702).CONSTRUCTOR);

module.exports = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
  NativePromiseConstructor.all(iterable).then(undefined, function () { /* empty */ });
});


/***/ }),

/***/ 2626:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var defineProperty = (__webpack_require__(3070).f);

module.exports = function (Target, Source, key) {
  key in Target || defineProperty(Target, key, {
    configurable: true,
    get: function () { return Source[key]; },
    set: function (it) { Source[key] = it; }
  });
};


/***/ }),

/***/ 8572:
/***/ (function(module) {

var Queue = function () {
  this.head = null;
  this.tail = null;
};

Queue.prototype = {
  add: function (item) {
    var entry = { item: item, next: null };
    if (this.head) this.tail.next = entry;
    else this.head = entry;
    this.tail = entry;
  },
  get: function () {
    var entry = this.head;
    if (entry) {
      this.head = entry.next;
      if (this.tail === entry) this.tail = null;
      return entry.item;
    }
  }
};

module.exports = Queue;


/***/ }),

/***/ 7651:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var anObject = __webpack_require__(9670);
var isCallable = __webpack_require__(614);
var classof = __webpack_require__(4326);
var regexpExec = __webpack_require__(2261);

var $TypeError = TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = call(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
  throw $TypeError('RegExp#exec called on incompatible receiver');
};


/***/ }),

/***/ 2261:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = __webpack_require__(6916);
var uncurryThis = __webpack_require__(1702);
var toString = __webpack_require__(1340);
var regexpFlags = __webpack_require__(7066);
var stickyHelpers = __webpack_require__(2999);
var shared = __webpack_require__(2309);
var create = __webpack_require__(30);
var getInternalState = (__webpack_require__(9909).get);
var UNSUPPORTED_DOT_ALL = __webpack_require__(9441);
var UNSUPPORTED_NCG = __webpack_require__(7168);

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = call(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ 7066:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(9670);

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ 4706:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var hasOwn = __webpack_require__(2597);
var isPrototypeOf = __webpack_require__(7976);
var regExpFlags = __webpack_require__(7066);

var RegExpPrototype = RegExp.prototype;

module.exports = function (R) {
  var flags = R.flags;
  return flags === undefined && !('flags' in RegExpPrototype) && !hasOwn(R, 'flags') && isPrototypeOf(RegExpPrototype, R)
    ? call(regExpFlags, R) : flags;
};


/***/ }),

/***/ 2999:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var global = __webpack_require__(7854);

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

module.exports = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
};


/***/ }),

/***/ 9441:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var global = __webpack_require__(7854);

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});


/***/ }),

/***/ 7168:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var global = __webpack_require__(7854);

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});


/***/ }),

/***/ 4488:
/***/ (function(module) {

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 6340:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(5005);
var definePropertyModule = __webpack_require__(3070);
var wellKnownSymbol = __webpack_require__(5112);
var DESCRIPTORS = __webpack_require__(9781);

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ 8003:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var defineProperty = (__webpack_require__(3070).f);
var hasOwn = __webpack_require__(2597);
var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ 6200:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(2309);
var uid = __webpack_require__(9711);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 5465:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var defineGlobalProperty = __webpack_require__(3072);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ 2309:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var IS_PURE = __webpack_require__(1913);
var store = __webpack_require__(5465);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.23.3',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.23.3/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 6707:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var anObject = __webpack_require__(9670);
var aConstructor = __webpack_require__(9483);
var wellKnownSymbol = __webpack_require__(5112);

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aConstructor(S);
};


/***/ }),

/***/ 8710:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var toIntegerOrInfinity = __webpack_require__(9303);
var toString = __webpack_require__(1340);
var requireObjectCoercible = __webpack_require__(4488);

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

/***/ 6091:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var PROPER_FUNCTION_NAME = (__webpack_require__(6530).PROPER);
var fails = __webpack_require__(7293);
var whitespaces = __webpack_require__(1361);

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]()
      || non[METHOD_NAME]() !== non
      || (PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME);
  });
};


/***/ }),

/***/ 3111:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var requireObjectCoercible = __webpack_require__(4488);
var toString = __webpack_require__(1340);
var whitespaces = __webpack_require__(1361);

var replace = uncurryThis(''.replace);
var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = toString(requireObjectCoercible($this));
    if (TYPE & 1) string = replace(string, ltrim, '');
    if (TYPE & 2) string = replace(string, rtrim, '');
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

/***/ 6532:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var getBuiltIn = __webpack_require__(5005);
var wellKnownSymbol = __webpack_require__(5112);
var defineBuiltIn = __webpack_require__(8052);

module.exports = function () {
  var Symbol = getBuiltIn('Symbol');
  var SymbolPrototype = Symbol && Symbol.prototype;
  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    // eslint-disable-next-line no-unused-vars -- required for .length
    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
      return call(valueOf, this);
    }, { arity: 1 });
  }
};


/***/ }),

/***/ 261:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var apply = __webpack_require__(2104);
var bind = __webpack_require__(9974);
var isCallable = __webpack_require__(614);
var hasOwn = __webpack_require__(2597);
var fails = __webpack_require__(7293);
var html = __webpack_require__(490);
var arraySlice = __webpack_require__(206);
var createElement = __webpack_require__(317);
var validateArgumentsLength = __webpack_require__(8053);
var IS_IOS = __webpack_require__(6833);
var IS_NODE = __webpack_require__(5268);

var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var Dispatch = global.Dispatch;
var Function = global.Function;
var MessageChannel = global.MessageChannel;
var String = global.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var location, defer, channel, port;

try {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  location = global.location;
} catch (error) { /* empty */ }

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

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(String(id), location.protocol + '//' + location.host);
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
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    isCallable(global.postMessage) &&
    !global.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global.addEventListener('message', listener, false);
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

/***/ 863:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

// `thisNumberValue` abstract operation
// https://tc39.es/ecma262/#sec-thisnumbervalue
module.exports = uncurryThis(1.0.valueOf);


/***/ }),

/***/ 1400:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(9303);

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

/***/ 5656:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(8361);
var requireObjectCoercible = __webpack_require__(4488);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 9303:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var trunc = __webpack_require__(4758);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 7466:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(9303);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 7908:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(4488);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 7593:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var isObject = __webpack_require__(111);
var isSymbol = __webpack_require__(2190);
var getMethod = __webpack_require__(8173);
var ordinaryToPrimitive = __webpack_require__(2140);
var wellKnownSymbol = __webpack_require__(5112);

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
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 4948:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(7593);
var isSymbol = __webpack_require__(2190);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 1694:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 1340:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(648);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ 6330:
/***/ (function(module) {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 9711:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 3307:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es-x/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(133);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 3353:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ 8053:
/***/ (function(module) {

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw $TypeError('Not enough arguments');
  return passed;
};


/***/ }),

/***/ 6061:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);

exports.f = wellKnownSymbol;


/***/ }),

/***/ 5112:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var shared = __webpack_require__(2309);
var hasOwn = __webpack_require__(2597);
var uid = __webpack_require__(9711);
var NATIVE_SYMBOL = __webpack_require__(133);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 1361:
/***/ (function(module) {

// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ 2222:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var fails = __webpack_require__(7293);
var isArray = __webpack_require__(3157);
var isObject = __webpack_require__(111);
var toObject = __webpack_require__(7908);
var lengthOfArrayLike = __webpack_require__(6244);
var doesNotExceedSafeInteger = __webpack_require__(7207);
var createProperty = __webpack_require__(6135);
var arraySpeciesCreate = __webpack_require__(5417);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);
var wellKnownSymbol = __webpack_require__(5112);
var V8_VERSION = __webpack_require__(7392);

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike(E);
        doesNotExceedSafeInteger(n + len);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        doesNotExceedSafeInteger(n + 1);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ 7327:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $filter = (__webpack_require__(2092).filter);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 9826:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $find = (__webpack_require__(2092).find);
var addToUnscopables = __webpack_require__(1223);

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);


/***/ }),

/***/ 1038:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var from = __webpack_require__(8457);
var checkCorrectnessOfIteration = __webpack_require__(7072);

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es-x/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),

/***/ 6699:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $includes = (__webpack_require__(1318).includes);
var fails = __webpack_require__(7293);
var addToUnscopables = __webpack_require__(1223);

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
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

/***/ 2772:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es-x/no-array-prototype-indexof -- required for testing */
var $ = __webpack_require__(2109);
var uncurryThis = __webpack_require__(1702);
var $IndexOf = (__webpack_require__(1318).indexOf);
var arrayMethodIsStrict = __webpack_require__(9341);

var un$IndexOf = uncurryThis([].indexOf);

var NEGATIVE_ZERO = !!un$IndexOf && 1 / un$IndexOf([1], 1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? un$IndexOf(this, searchElement, fromIndex) || 0
      : $IndexOf(this, searchElement, fromIndex);
  }
});


/***/ }),

/***/ 6992:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(5656);
var addToUnscopables = __webpack_require__(1223);
var Iterators = __webpack_require__(7497);
var InternalStateModule = __webpack_require__(9909);
var defineProperty = (__webpack_require__(3070).f);
var defineIterator = __webpack_require__(654);
var IS_PURE = __webpack_require__(1913);
var DESCRIPTORS = __webpack_require__(9781);

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
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
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

/***/ 9600:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var uncurryThis = __webpack_require__(1702);
var IndexedObject = __webpack_require__(8361);
var toIndexedObject = __webpack_require__(5656);
var arrayMethodIsStrict = __webpack_require__(9341);

var un$Join = uncurryThis([].join);

var ES3_STRINGS = IndexedObject != Object;
var STRICT_METHOD = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
  join: function join(separator) {
    return un$Join(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),

/***/ 4986:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var lastIndexOf = __webpack_require__(6583);

// `Array.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
// eslint-disable-next-line es-x/no-array-prototype-lastindexof -- required for testing
$({ target: 'Array', proto: true, forced: lastIndexOf !== [].lastIndexOf }, {
  lastIndexOf: lastIndexOf
});


/***/ }),

/***/ 1249:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $map = (__webpack_require__(2092).map);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 5827:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $reduce = (__webpack_require__(3671).left);
var arrayMethodIsStrict = __webpack_require__(9341);
var CHROME_VERSION = __webpack_require__(7392);
var IS_NODE = __webpack_require__(5268);

var STRICT_METHOD = arrayMethodIsStrict('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 5069:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var uncurryThis = __webpack_require__(1702);
var isArray = __webpack_require__(3157);

var un$Reverse = uncurryThis([].reverse);
var test = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.es/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign -- dirty hack
    if (isArray(this)) this.length = this.length;
    return un$Reverse(this);
  }
});


/***/ }),

/***/ 7042:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var isArray = __webpack_require__(3157);
var isConstructor = __webpack_require__(4411);
var isObject = __webpack_require__(111);
var toAbsoluteIndex = __webpack_require__(1400);
var lengthOfArrayLike = __webpack_require__(6244);
var toIndexedObject = __webpack_require__(5656);
var createProperty = __webpack_require__(6135);
var wellKnownSymbol = __webpack_require__(5112);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);
var un$Slice = __webpack_require__(206);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var $Array = Array;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === $Array || Constructor === undefined) {
        return un$Slice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? $Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),

/***/ 2707:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var uncurryThis = __webpack_require__(1702);
var aCallable = __webpack_require__(9662);
var toObject = __webpack_require__(7908);
var lengthOfArrayLike = __webpack_require__(6244);
var deletePropertyOrThrow = __webpack_require__(5117);
var toString = __webpack_require__(1340);
var fails = __webpack_require__(7293);
var internalSort = __webpack_require__(4362);
var arrayMethodIsStrict = __webpack_require__(9341);
var FF = __webpack_require__(8886);
var IE_OR_EDGE = __webpack_require__(256);
var V8 = __webpack_require__(7392);
var WEBKIT = __webpack_require__(8008);

var test = [];
var un$Sort = uncurryThis(test.sort);
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

    if (STABLE_SORT) return comparefn === undefined ? un$Sort(array) : un$Sort(array, comparefn);

    var items = [];
    var arrayLength = lengthOfArrayLike(array);
    var itemsLength, index;

    for (index = 0; index < arrayLength; index++) {
      if (index in array) push(items, array[index]);
    }

    internalSort(items, getSortCompare(comparefn));

    itemsLength = items.length;
    index = 0;

    while (index < itemsLength) array[index] = items[index++];
    while (index < arrayLength) deletePropertyOrThrow(array, index++);

    return array;
  }
});


/***/ }),

/***/ 561:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var toObject = __webpack_require__(7908);
var toAbsoluteIndex = __webpack_require__(1400);
var toIntegerOrInfinity = __webpack_require__(9303);
var lengthOfArrayLike = __webpack_require__(6244);
var doesNotExceedSafeInteger = __webpack_require__(7207);
var arraySpeciesCreate = __webpack_require__(5417);
var createProperty = __webpack_require__(6135);
var deletePropertyOrThrow = __webpack_require__(5117);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var max = Math.max;
var min = Math.min;

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
    }
    doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else deletePropertyOrThrow(O, to);
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow(O, k - 1);
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else deletePropertyOrThrow(O, to);
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),

/***/ 8309:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var FUNCTION_NAME_EXISTS = (__webpack_require__(6530).EXISTS);
var uncurryThis = __webpack_require__(1702);
var defineProperty = (__webpack_require__(3070).f);

var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis(FunctionPrototype.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec = uncurryThis(nameRE.exec);
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),

/***/ 8862:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var getBuiltIn = __webpack_require__(5005);
var apply = __webpack_require__(2104);
var call = __webpack_require__(6916);
var uncurryThis = __webpack_require__(1702);
var fails = __webpack_require__(7293);
var isArray = __webpack_require__(3157);
var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);
var isSymbol = __webpack_require__(2190);
var arraySlice = __webpack_require__(206);
var NATIVE_SYMBOL = __webpack_require__(133);

var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')();
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) != '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = replacer;
  if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
  if (!isArray(replacer)) replacer = function (key, value) {
    if (isCallable($replacer)) value = call($replacer, this, key, value);
    if (!isSymbol(value)) return value;
  };
  args[1] = replacer;
  return apply($stringify, null, args);
};

var fixIllFormed = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  } return match;
};

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}


/***/ }),

/***/ 3706:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var setToStringTag = __webpack_require__(8003);

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON, 'JSON', true);


/***/ }),

/***/ 2703:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var setToStringTag = __webpack_require__(8003);

// Math[@@toStringTag] property
// https://tc39.es/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);


/***/ }),

/***/ 9653:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9781);
var global = __webpack_require__(7854);
var uncurryThis = __webpack_require__(1702);
var isForced = __webpack_require__(4705);
var defineBuiltIn = __webpack_require__(8052);
var hasOwn = __webpack_require__(2597);
var inheritIfRequired = __webpack_require__(9587);
var isPrototypeOf = __webpack_require__(7976);
var isSymbol = __webpack_require__(2190);
var toPrimitive = __webpack_require__(7593);
var fails = __webpack_require__(7293);
var getOwnPropertyNames = (__webpack_require__(8006).f);
var getOwnPropertyDescriptor = (__webpack_require__(1236).f);
var defineProperty = (__webpack_require__(3070).f);
var thisNumberValue = __webpack_require__(863);
var trim = (__webpack_require__(3111).trim);

var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var NumberPrototype = NativeNumber.prototype;
var TypeError = global.TypeError;
var arraySlice = uncurryThis(''.slice);
var charCodeAt = uncurryThis(''.charCodeAt);

// `ToNumeric` abstract operation
// https://tc39.es/ecma262/#sec-tonumeric
var toNumeric = function (value) {
  var primValue = toPrimitive(value, 'number');
  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
};

// `ToNumber` abstract operation
// https://tc39.es/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, 'number');
  var first, third, radix, maxCode, digits, length, index, code;
  if (isSymbol(it)) throw TypeError('Cannot convert a Symbol value to a number');
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = charCodeAt(it, 0);
    if (first === 43 || first === 45) {
      third = charCodeAt(it, 2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (charCodeAt(it, 1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = arraySlice(it, 2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = charCodeAt(digits, index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.es/ecma262/#sec-number-constructor
if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
    var dummy = this;
    // check on 1..constructor(foo) case
    return isPrototypeOf(NumberPrototype, dummy) && fails(function () { thisNumberValue(dummy); })
      ? inheritIfRequired(Object(n), dummy, NumberWrapper) : n;
  };
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
    // ESNext
    'fromString,range'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (hasOwn(NativeNumber, key = keys[j]) && !hasOwn(NumberWrapper, key)) {
      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  defineBuiltIn(global, NUMBER, NumberWrapper, { constructor: true });
}


/***/ }),

/***/ 5192:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var numberIsFinite = __webpack_require__(7023);

// `Number.isFinite` method
// https://tc39.es/ecma262/#sec-number.isfinite
$({ target: 'Number', stat: true }, { isFinite: numberIsFinite });


/***/ }),

/***/ 9601:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var assign = __webpack_require__(1574);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es-x/no-object-assign -- required for testing
$({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),

/***/ 6210:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var fails = __webpack_require__(7293);
var getOwnPropertyNames = (__webpack_require__(1156).f);

// eslint-disable-next-line es-x/no-object-getownpropertynames -- required for testing
var FAILS_ON_PRIMITIVES = fails(function () { return !Object.getOwnPropertyNames(1); });

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  getOwnPropertyNames: getOwnPropertyNames
});


/***/ }),

/***/ 9660:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var NATIVE_SYMBOL = __webpack_require__(133);
var fails = __webpack_require__(7293);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var toObject = __webpack_require__(7908);

// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FORCED = !NATIVE_SYMBOL || fails(function () { getOwnPropertySymbolsModule.f(1); });

// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
$({ target: 'Object', stat: true, forced: FORCED }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
  }
});


/***/ }),

/***/ 489:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var fails = __webpack_require__(7293);
var toObject = __webpack_require__(7908);
var nativeGetPrototypeOf = __webpack_require__(9518);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(8544);

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});



/***/ }),

/***/ 7941:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var toObject = __webpack_require__(7908);
var nativeKeys = __webpack_require__(1956);
var fails = __webpack_require__(7293);

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),

/***/ 1539:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var defineBuiltIn = __webpack_require__(8052);
var toString = __webpack_require__(288);

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),

/***/ 4678:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var $parseFloat = __webpack_require__(2814);

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
$({ global: true, forced: parseFloat != $parseFloat }, {
  parseFloat: $parseFloat
});


/***/ }),

/***/ 1058:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var $parseInt = __webpack_require__(3009);

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
$({ global: true, forced: parseInt != $parseInt }, {
  parseInt: $parseInt
});


/***/ }),

/***/ 821:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var call = __webpack_require__(6916);
var aCallable = __webpack_require__(9662);
var newPromiseCapabilityModule = __webpack_require__(8523);
var perform = __webpack_require__(2534);
var iterate = __webpack_require__(408);
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(612);

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

/***/ 4164:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var IS_PURE = __webpack_require__(1913);
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(3702).CONSTRUCTOR);
var NativePromiseConstructor = __webpack_require__(2492);
var getBuiltIn = __webpack_require__(5005);
var isCallable = __webpack_require__(614);
var defineBuiltIn = __webpack_require__(8052);

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

/***/ 3401:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var IS_PURE = __webpack_require__(1913);
var IS_NODE = __webpack_require__(5268);
var global = __webpack_require__(7854);
var call = __webpack_require__(6916);
var defineBuiltIn = __webpack_require__(8052);
var setPrototypeOf = __webpack_require__(7674);
var setToStringTag = __webpack_require__(8003);
var setSpecies = __webpack_require__(6340);
var aCallable = __webpack_require__(9662);
var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);
var anInstance = __webpack_require__(5787);
var speciesConstructor = __webpack_require__(6707);
var task = (__webpack_require__(261).set);
var microtask = __webpack_require__(5948);
var hostReportErrors = __webpack_require__(842);
var perform = __webpack_require__(2534);
var Queue = __webpack_require__(8572);
var InternalStateModule = __webpack_require__(9909);
var NativePromiseConstructor = __webpack_require__(2492);
var PromiseConstructorDetection = __webpack_require__(3702);
var newPromiseCapabilityModule = __webpack_require__(8523);

var PROMISE = 'Promise';
var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var setInternalState = InternalStateModule.set;
var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var PromiseConstructor = NativePromiseConstructor;
var PromisePrototype = NativePromisePrototype;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;

var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
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
  var ok = state.state == FULFILLED;
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
        reject(TypeError('Promise-chain cycle'));
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
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  call(task, global, function () {
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
  call(task, global, function () {
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
    if (state.facade === value) throw TypeError("Promise can't be resolved itself");
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
      value: undefined
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
    if (state.state == PENDING) state.reactions.add(reaction);
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

$({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);


/***/ }),

/***/ 8674:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(3401);
__webpack_require__(821);
__webpack_require__(4164);
__webpack_require__(6027);
__webpack_require__(683);
__webpack_require__(6294);


/***/ }),

/***/ 6027:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var call = __webpack_require__(6916);
var aCallable = __webpack_require__(9662);
var newPromiseCapabilityModule = __webpack_require__(8523);
var perform = __webpack_require__(2534);
var iterate = __webpack_require__(408);
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(612);

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

/***/ 683:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var call = __webpack_require__(6916);
var newPromiseCapabilityModule = __webpack_require__(8523);
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(3702).CONSTRUCTOR);

// `Promise.reject` method
// https://tc39.es/ecma262/#sec-promise.reject
$({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  reject: function reject(r) {
    var capability = newPromiseCapabilityModule.f(this);
    call(capability.reject, undefined, r);
    return capability.promise;
  }
});


/***/ }),

/***/ 6294:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var getBuiltIn = __webpack_require__(5005);
var IS_PURE = __webpack_require__(1913);
var NativePromiseConstructor = __webpack_require__(2492);
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(3702).CONSTRUCTOR);
var promiseResolve = __webpack_require__(9478);

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

/***/ 2419:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var getBuiltIn = __webpack_require__(5005);
var apply = __webpack_require__(2104);
var bind = __webpack_require__(7065);
var aConstructor = __webpack_require__(9483);
var anObject = __webpack_require__(9670);
var isObject = __webpack_require__(111);
var create = __webpack_require__(30);
var fails = __webpack_require__(7293);

var nativeConstruct = getBuiltIn('Reflect', 'construct');
var ObjectPrototype = Object.prototype;
var push = [].push;

// `Reflect.construct` method
// https://tc39.es/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});

var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});

var FORCED = NEW_TARGET_BUG || ARGS_BUG;

$({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
  construct: function construct(Target, args /* , newTarget */) {
    aConstructor(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aConstructor(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      apply(push, $args, args);
      return new (apply(bind, Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : ObjectPrototype);
    var result = apply(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});


/***/ }),

/***/ 4603:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var global = __webpack_require__(7854);
var uncurryThis = __webpack_require__(1702);
var isForced = __webpack_require__(4705);
var inheritIfRequired = __webpack_require__(9587);
var createNonEnumerableProperty = __webpack_require__(8880);
var getOwnPropertyNames = (__webpack_require__(8006).f);
var isPrototypeOf = __webpack_require__(7976);
var isRegExp = __webpack_require__(7850);
var toString = __webpack_require__(1340);
var getRegExpFlags = __webpack_require__(4706);
var stickyHelpers = __webpack_require__(2999);
var proxyAccessor = __webpack_require__(2626);
var defineBuiltIn = __webpack_require__(8052);
var fails = __webpack_require__(7293);
var hasOwn = __webpack_require__(2597);
var enforceInternalState = (__webpack_require__(9909).enforce);
var setSpecies = __webpack_require__(6340);
var wellKnownSymbol = __webpack_require__(5112);
var UNSUPPORTED_DOT_ALL = __webpack_require__(9441);
var UNSUPPORTED_NCG = __webpack_require__(7168);

var MATCH = wellKnownSymbol('match');
var NativeRegExp = global.RegExp;
var RegExpPrototype = NativeRegExp.prototype;
var SyntaxError = global.SyntaxError;
var exec = uncurryThis(RegExpPrototype.exec);
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);
// TODO: Use only propper RegExpIdentifierName
var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var MISSED_STICKY = stickyHelpers.MISSED_STICKY;
var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;

var BASE_FORCED = DESCRIPTORS &&
  (!CORRECT_NEW || MISSED_STICKY || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails(function () {
    re2[MATCH] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  }));

var handleDotAll = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var brackets = false;
  var chr;
  for (; index <= length; index++) {
    chr = charAt(string, index);
    if (chr === '\\') {
      result += chr + charAt(string, ++index);
      continue;
    }
    if (!brackets && chr === '.') {
      result += '[\\s\\S]';
    } else {
      if (chr === '[') {
        brackets = true;
      } else if (chr === ']') {
        brackets = false;
      } result += chr;
    }
  } return result;
};

var handleNCG = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var named = [];
  var names = {};
  var brackets = false;
  var ncg = false;
  var groupid = 0;
  var groupname = '';
  var chr;
  for (; index <= length; index++) {
    chr = charAt(string, index);
    if (chr === '\\') {
      chr = chr + charAt(string, ++index);
    } else if (chr === ']') {
      brackets = false;
    } else if (!brackets) switch (true) {
      case chr === '[':
        brackets = true;
        break;
      case chr === '(':
        if (exec(IS_NCG, stringSlice(string, index + 1))) {
          index += 2;
          ncg = true;
        }
        result += chr;
        groupid++;
        continue;
      case chr === '>' && ncg:
        if (groupname === '' || hasOwn(names, groupname)) {
          throw new SyntaxError('Invalid capture group name');
        }
        names[groupname] = true;
        named[named.length] = [groupname, groupid];
        ncg = false;
        groupname = '';
        continue;
    }
    if (ncg) groupname += chr;
    else result += chr;
  } return [result, named];
};

// `RegExp` constructor
// https://tc39.es/ecma262/#sec-regexp-constructor
if (isForced('RegExp', BASE_FORCED)) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = isPrototypeOf(RegExpPrototype, this);
    var patternIsRegExp = isRegExp(pattern);
    var flagsAreUndefined = flags === undefined;
    var groups = [];
    var rawPattern = pattern;
    var rawFlags, dotAll, sticky, handled, result, state;

    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
      return pattern;
    }

    if (patternIsRegExp || isPrototypeOf(RegExpPrototype, pattern)) {
      pattern = pattern.source;
      if (flagsAreUndefined) flags = getRegExpFlags(rawPattern);
    }

    pattern = pattern === undefined ? '' : toString(pattern);
    flags = flags === undefined ? '' : toString(flags);
    rawPattern = pattern;

    if (UNSUPPORTED_DOT_ALL && 'dotAll' in re1) {
      dotAll = !!flags && stringIndexOf(flags, 's') > -1;
      if (dotAll) flags = replace(flags, /s/g, '');
    }

    rawFlags = flags;

    if (MISSED_STICKY && 'sticky' in re1) {
      sticky = !!flags && stringIndexOf(flags, 'y') > -1;
      if (sticky && UNSUPPORTED_Y) flags = replace(flags, /y/g, '');
    }

    if (UNSUPPORTED_NCG) {
      handled = handleNCG(pattern);
      pattern = handled[0];
      groups = handled[1];
    }

    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);

    if (dotAll || sticky || groups.length) {
      state = enforceInternalState(result);
      if (dotAll) {
        state.dotAll = true;
        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
      }
      if (sticky) state.sticky = true;
      if (groups.length) state.groups = groups;
    }

    if (pattern !== rawPattern) try {
      // fails in old engines, but we have no alternatives for unsupported regex syntax
      createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
    } catch (error) { /* empty */ }

    return result;
  };

  for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
    proxyAccessor(RegExpWrapper, NativeRegExp, keys[index++]);
  }

  RegExpPrototype.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype;
  defineBuiltIn(global, 'RegExp', RegExpWrapper, { constructor: true });
}

// https://tc39.es/ecma262/#sec-get-regexp-@@species
setSpecies('RegExp');


/***/ }),

/***/ 4916:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var exec = __webpack_require__(2261);

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),

/***/ 9714:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var PROPER_FUNCTION_NAME = (__webpack_require__(6530).PROPER);
var defineBuiltIn = __webpack_require__(8052);
var anObject = __webpack_require__(9670);
var $toString = __webpack_require__(1340);
var fails = __webpack_require__(7293);
var getRegExpFlags = __webpack_require__(4706);

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var n$ToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return n$ToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = PROPER_FUNCTION_NAME && n$ToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  defineBuiltIn(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var pattern = $toString(R.source);
    var flags = $toString(getRegExpFlags(R));
    return '/' + pattern + '/' + flags;
  }, { unsafe: true });
}


/***/ }),

/***/ 2023:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var uncurryThis = __webpack_require__(1702);
var notARegExp = __webpack_require__(3929);
var requireObjectCoercible = __webpack_require__(4488);
var toString = __webpack_require__(1340);
var correctIsRegExpLogic = __webpack_require__(4964);

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

/***/ 8783:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = (__webpack_require__(8710).charAt);
var toString = __webpack_require__(1340);
var InternalStateModule = __webpack_require__(9909);
var defineIterator = __webpack_require__(654);

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
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ 4723:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(6916);
var fixRegExpWellKnownSymbolLogic = __webpack_require__(7007);
var anObject = __webpack_require__(9670);
var toLength = __webpack_require__(7466);
var toString = __webpack_require__(1340);
var requireObjectCoercible = __webpack_require__(4488);
var getMethod = __webpack_require__(8173);
var advanceStringIndex = __webpack_require__(1530);
var regExpExec = __webpack_require__(7651);

// @@match logic
fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : getMethod(regexp, MATCH);
      return matcher ? call(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject(this);
      var S = toString(string);
      var res = maybeCallNative(nativeMatch, rx, S);

      if (res.done) return res.value;

      if (!rx.global) return regExpExec(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = toString(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),

/***/ 5306:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var apply = __webpack_require__(2104);
var call = __webpack_require__(6916);
var uncurryThis = __webpack_require__(1702);
var fixRegExpWellKnownSymbolLogic = __webpack_require__(7007);
var fails = __webpack_require__(7293);
var anObject = __webpack_require__(9670);
var isCallable = __webpack_require__(614);
var toIntegerOrInfinity = __webpack_require__(9303);
var toLength = __webpack_require__(7466);
var toString = __webpack_require__(1340);
var requireObjectCoercible = __webpack_require__(4488);
var advanceStringIndex = __webpack_require__(1530);
var getMethod = __webpack_require__(8173);
var getSubstitution = __webpack_require__(647);
var regExpExec = __webpack_require__(7651);
var wellKnownSymbol = __webpack_require__(5112);

var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min = Math.min;
var concat = uncurryThis([].concat);
var push = uncurryThis([].push);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : getMethod(searchValue, REPLACE);
      return replacer
        ? call(replacer, searchValue, O, replaceValue)
        : call(nativeReplace, toString(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString(string);

      if (
        typeof replaceValue == 'string' &&
        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
        stringIndexOf(replaceValue, '$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = isCallable(replaceValue);
      if (!functionalReplace) replaceValue = toString(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        push(results, result);
        if (!global) break;

        var matchStr = toString(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString(result[0]);
        var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat([matched], captures, position, S);
          if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
          var replacement = toString(apply(replaceValue, undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + stringSlice(S, nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);


/***/ }),

/***/ 3123:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var apply = __webpack_require__(2104);
var call = __webpack_require__(6916);
var uncurryThis = __webpack_require__(1702);
var fixRegExpWellKnownSymbolLogic = __webpack_require__(7007);
var isRegExp = __webpack_require__(7850);
var anObject = __webpack_require__(9670);
var requireObjectCoercible = __webpack_require__(4488);
var speciesConstructor = __webpack_require__(6707);
var advanceStringIndex = __webpack_require__(1530);
var toLength = __webpack_require__(7466);
var toString = __webpack_require__(1340);
var getMethod = __webpack_require__(8173);
var arraySlice = __webpack_require__(1589);
var callRegExpExec = __webpack_require__(7651);
var regexpExec = __webpack_require__(2261);
var stickyHelpers = __webpack_require__(2999);
var fails = __webpack_require__(7293);

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
var MAX_UINT32 = 0xFFFFFFFF;
var min = Math.min;
var $push = [].push;
var exec = uncurryThis(/./.exec);
var push = uncurryThis($push);
var stringSlice = uncurryThis(''.slice);

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

// @@split logic
fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = toString(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return call(nativeSplit, string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = call(regexpExec, separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          push(output, stringSlice(string, lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) apply($push, output, arraySlice(match, 1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !exec(separatorCopy, '')) push(output, '');
      } else push(output, stringSlice(string, lastLastIndex));
      return output.length > lim ? arraySlice(output, 0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : call(nativeSplit, this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : getMethod(separator, SPLIT);
      return splitter
        ? call(splitter, separator, O, limit)
        : call(internalSplit, toString(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (string, limit) {
      var rx = anObject(this);
      var S = toString(string);
      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

      if (res.done) return res.value;

      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (UNSUPPORTED_Y ? 'g' : 'y');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
        var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          push(A, stringSlice(S, p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            push(A, z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      push(A, stringSlice(S, p));
      return A;
    }
  ];
}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);


/***/ }),

/***/ 3210:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $trim = (__webpack_require__(3111).trim);
var forcedStringTrimMethod = __webpack_require__(6091);

// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});


/***/ }),

/***/ 2443:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(7235);

// `Symbol.asyncIterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');


/***/ }),

/***/ 4032:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var global = __webpack_require__(7854);
var call = __webpack_require__(6916);
var uncurryThis = __webpack_require__(1702);
var IS_PURE = __webpack_require__(1913);
var DESCRIPTORS = __webpack_require__(9781);
var NATIVE_SYMBOL = __webpack_require__(133);
var fails = __webpack_require__(7293);
var hasOwn = __webpack_require__(2597);
var isPrototypeOf = __webpack_require__(7976);
var anObject = __webpack_require__(9670);
var toIndexedObject = __webpack_require__(5656);
var toPropertyKey = __webpack_require__(4948);
var $toString = __webpack_require__(1340);
var createPropertyDescriptor = __webpack_require__(9114);
var nativeObjectCreate = __webpack_require__(30);
var objectKeys = __webpack_require__(1956);
var getOwnPropertyNamesModule = __webpack_require__(8006);
var getOwnPropertyNamesExternal = __webpack_require__(1156);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var getOwnPropertyDescriptorModule = __webpack_require__(1236);
var definePropertyModule = __webpack_require__(3070);
var definePropertiesModule = __webpack_require__(6048);
var propertyIsEnumerableModule = __webpack_require__(5296);
var defineBuiltIn = __webpack_require__(8052);
var shared = __webpack_require__(2309);
var sharedKey = __webpack_require__(6200);
var hiddenKeys = __webpack_require__(3501);
var uid = __webpack_require__(9711);
var wellKnownSymbol = __webpack_require__(5112);
var wrappedWellKnownSymbolModule = __webpack_require__(6061);
var defineWellKnownSymbol = __webpack_require__(7235);
var defineSymbolToPrimitive = __webpack_require__(6532);
var setToStringTag = __webpack_require__(8003);
var InternalStateModule = __webpack_require__(9909);
var $forEach = (__webpack_require__(2092).forEach);

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';

var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);

var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
var TypeError = global.TypeError;
var QObject = global.QObject;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var push = uncurryThis([].push);

var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (hasOwn(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = call(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P]
    ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
  });
  return result;
};

var $getOwnPropertySymbols = function (O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
      push(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (isPrototypeOf(SymbolPrototype, this)) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
      if (hasOwn(this, HIDDEN) && hasOwn(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  SymbolPrototype = $Symbol[PROTOTYPE];

  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
    return getInternalState(this).tag;
  });

  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  definePropertiesModule.f = $defineProperties;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      defineBuiltIn(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),

/***/ 1817:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__(2109);
var DESCRIPTORS = __webpack_require__(9781);
var global = __webpack_require__(7854);
var uncurryThis = __webpack_require__(1702);
var hasOwn = __webpack_require__(2597);
var isCallable = __webpack_require__(614);
var isPrototypeOf = __webpack_require__(7976);
var toString = __webpack_require__(1340);
var defineProperty = (__webpack_require__(3070).f);
var copyConstructorProperties = __webpack_require__(9920);

var NativeSymbol = global.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this)
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
  var symbolToString = uncurryThis(SymbolPrototype.toString);
  var symbolValueOf = uncurryThis(SymbolPrototype.valueOf);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace = uncurryThis(''.replace);
  var stringSlice = uncurryThis(''.slice);

  defineProperty(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = symbolValueOf(this);
      var string = symbolToString(symbol);
      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, constructor: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),

/***/ 763:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var getBuiltIn = __webpack_require__(5005);
var hasOwn = __webpack_require__(2597);
var toString = __webpack_require__(1340);
var shared = __webpack_require__(2309);
var NATIVE_SYMBOL_REGISTRY = __webpack_require__(735);

var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  'for': function (key) {
    var string = toString(key);
    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = getBuiltIn('Symbol')(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  }
});


/***/ }),

/***/ 2165:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(7235);

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),

/***/ 2526:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(4032);
__webpack_require__(763);
__webpack_require__(6620);
__webpack_require__(8862);
__webpack_require__(9660);


/***/ }),

/***/ 6620:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(2109);
var hasOwn = __webpack_require__(2597);
var isSymbol = __webpack_require__(2190);
var tryToString = __webpack_require__(6330);
var shared = __webpack_require__(2309);
var NATIVE_SYMBOL_REGISTRY = __webpack_require__(735);

var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(tryToString(sym) + ' is not a symbol');
    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  }
});


/***/ }),

/***/ 3680:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);
var defineWellKnownSymbol = __webpack_require__(7235);
var setToStringTag = __webpack_require__(8003);

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag(getBuiltIn('Symbol'), 'Symbol');


/***/ }),

/***/ 4747:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var DOMIterables = __webpack_require__(8324);
var DOMTokenListPrototype = __webpack_require__(8509);
var forEach = __webpack_require__(8533);
var createNonEnumerableProperty = __webpack_require__(8880);

var handlePrototype = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype);
  }
}

handlePrototype(DOMTokenListPrototype);


/***/ }),

/***/ 3948:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var DOMIterables = __webpack_require__(8324);
var DOMTokenListPrototype = __webpack_require__(8509);
var ArrayIteratorMethods = __webpack_require__(6992);
var createNonEnumerableProperty = __webpack_require__(8880);
var wellKnownSymbol = __webpack_require__(5112);

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');


/***/ }),

/***/ 5131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7537);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n.rmp-container {\n  position: relative;\n  text-align: center;\n  outline: none;\n  background: #000000;\n  padding: 0;\n  border: none;\n  display: block;\n  font-size: 14px;\n  max-width: none;\n  max-height: none;\n  overflow: hidden;\n  line-height: 1;\n  box-sizing: border-box;\n  font-family: Arial, Helvetica, sans-serif;\n}\n.rmp-container * {\n  box-sizing: border-box;\n}\n.rmp-video,\n.rmp-content {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 0;\n  padding: 0;\n  outline: none;\n  display: block;\n}\n.rmp-ad-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  outline: none;\n  display: block;\n  text-align: initial;\n}\n.rmp-fullscreen-on {\n  position: fixed !important;\n  width: 100% !important;\n  height: 100% !important;\n  background: #000000 !important;\n  overflow: hidden !important;\n  z-index: 9999 !important;\n  top: 0;\n  left: 0;\n}\n.rmp-vpaid-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  outline: none;\n  display: block;\n  text-align: initial;\n}\n.rmp-ad-vast-video-player {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 0;\n  padding: 0;\n  outline: none;\n  display: block;\n  cursor: pointer;\n}\n.rmp-ad-container-icons {\n  position: absolute;\n  display: block;\n  cursor: pointer;\n}\n.rmp-ad-container-skip {\n  position: absolute;\n  right: 0;\n  bottom: 44px;\n  width: 160px;\n  height: 40px;\n  line-height: 38px;\n  text-align: center;\n  cursor: pointer;\n  background-color: #333;\n  border: 1px solid #333;\n  transition-property: border-color;\n  transition-duration: 0.4s;\n  transition-timing-function: ease-in;\n}\n.rmp-ad-container-skip:hover {\n  border-color: #000000;\n}\n.rmp-ad-container-skip-waiting {\n  width: 100%;\n  position: absolute;\n  padding: 0 2px;\n  color: #cfcfcf;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.rmp-ad-container-skip-message {\n  width: 65%;\n  position: absolute;\n  left: 5%;\n  color: #ffffff;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.rmp-ad-container-skip-icon {\n  position: absolute;\n  left: 75%;\n  width: 20%;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpi/P//PwMUNADxXyBuZsAPcoA4CIjfA/EuIJ4JFgUZBMU3/kNAMZIYNnz8PwIcgokzIdl0A0r3AHEbHhf9RGJ/hjGQDWJFYlcC8SQgZibgzf/YDEIHuUC8CIi58ahhJMYgEIgC4mVALIFNMzIgZBAI+AHxRiCWRfcOqQaBgBkQrwRiMSB+iE0BCwPxwBKIDwLxH0pcBAMPkKOcXIPmALEnED+lxKDJQJwKZUuQa1AVEOch8f+SE9hZQDydGCcjG/QPif0H6pUF+LIFriwCy1dvgTgChyEMaPmPBZuLVKA2RALxbjy+IGjQCiD+RcAQEFgF9fpHIN4GEwQIMACnXWgupdnzwwAAAABJRU5ErkJggg==\");\n  height: 100%;\n  background-repeat: no-repeat;\n  background-position: center;\n  opacity: 0.7;\n  transition-property: opacity;\n  transition-duration: 0.4s;\n  transition-timing-function: ease-in;\n}\n.rmp-ad-container-skip:hover .rmp-ad-container-skip-icon {\n  opacity: 1;\n}\n.rmp-ad-non-linear-container {\n  position: absolute;\n  text-align: center;\n  left: 50%;\n  bottom: 0;\n  transform: translate(-50%, 0);\n}\n.rmp-ad-non-linear-anchor:link,\n.rmp-ad-non-linear-anchor:visited,\n.rmp-ad-non-linear-anchor:hover,\n.rmp-ad-non-linear-anchor:active {\n  text-decoration: none;\n}\n.rmp-ad-non-linear-creative {\n  position: relative;\n  cursor: pointer;\n  text-align: center;\n  width: 100%;\n  height: 100%;\n  bottom: 0;\n}\n.rmp-ad-non-linear-close {\n  right: 0;\n  top: 0;\n  position: absolute;\n  cursor: pointer;\n  width: 20px;\n  height: 20px;\n  background-color: #000000;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHdJREFUeNqUk9EKwCAIRaX9/9MgEAZ9amsPsWVXdxV8Ec+B1Ep/o40UMuuEpK/RMvAUnEZysfAIlYRkg5/6tyGSQNgKPIkLIwGSuLAn8CSKeovgOMiaMKtKPQENjB5i1Pi7xkoMzD0kBg5PmYVnqv1MGXiT3AIMACNQPFnn5xfHAAAAAElFTkSuQmCC\");\n  background-size: cover;\n  border: 4px solid #000000;\n}\n.rmp-ad-click-ui-mobile {\n  border: 2px solid #ffffff;\n  background: rgba(0, 0, 0, 0.4);\n  color: #ffffff;\n  display: block;\n  position: absolute;\n  right: 8px;\n  top: 8px;\n  font-size: 18px;\n  width: 112px;\n  height: 34px;\n  text-decoration: none;\n  text-align: center;\n  line-height: 30px;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);\n}\n.rmp-ad-click-ui-mobile:visited,\n.rmp-ad-click-ui-mobile:hover,\n.rmp-ad-click-ui-mobile:active {\n  color: #ffffff;\n  text-decoration: none;\n}\n", "",{"version":3,"sources":["webpack://./src/less/rmp-vast.less"],"names":[],"mappings":"AAAA,gBAAS;AA0BT;EACE,kBAAA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,UAAA;EACA,YAAA;EACA,cAAA;EACA,eAAA;EACA,eAAA;EACA,gBAAA;EACA,gBAAA;EACA,cAAA;EACA,sBAAA;EACA,yCAAA;AAxBF;AA2BA;EACE,sBAAA;AAzBF;AA4BA;;EAEE,WAAA;EACA,YAAA;EACA,kBAAA;EACA,OAAA;EACA,MAAA;EACA,SAAA;EACA,UAAA;EACA,aAAA;EACA,cAAA;AA1BF;AA6BA;EACE,kBAAA;EACA,MAAA;EACA,OAAA;EACA,SAAA;EACA,UAAA;EACA,WAAA;EACA,YAAA;EACA,aAAA;EACA,cAAA;EACA,mBAAA;AA3BF;AA8BA;EACE,0BAAA;EACA,sBAAA;EACA,uBAAA;EACA,8BAAA;EACA,2BAAA;EACA,wBAAA;EACA,MAAA;EACA,OAAA;AA5BF;AAgCA;EACE,kBAAA;EACA,MAAA;EACA,OAAA;EACA,SAAA;EACA,UAAA;EACA,WAAA;EACA,YAAA;EACA,aAAA;EACA,cAAA;EACA,mBAAA;AA9BF;AAiCA;EACE,WAAA;EACA,YAAA;EACA,kBAAA;EACA,OAAA;EACA,MAAA;EACA,SAAA;EACA,UAAA;EACA,aAAA;EACA,cAAA;EACA,eAAA;AA/BF;AAkCA;EACE,kBAAA;EACA,cAAA;EACA,eAAA;AAhCF;AAmCA;EACE,kBAAA;EACA,QAAA;EACA,YAAA;EACA,YAAA;EACA,YAAA;EACA,iBAAA;EACA,kBAAA;EACA,eAAA;EACA,sBAAA;EACA,sBAAA;EAjHA,iCAAA;EACA,yBAAA;EACA,mCAAA;AAiFF;AAkCA;EACE,qBAAA;AAhCF;AAmCA;EACE,WAAA;EACA,kBAAA;EACA,cAAA;EACA,cAAA;EAvHA,mBAAA;EACA,gBAAA;EACA,uBAAA;AAuFF;AAkCA;EACE,UAAA;EACA,kBAAA;EACA,QAAA;EACA,cAAA;EA/HA,mBAAA;EACA,gBAAA;EACA,uBAAA;AAgGF;AAiCA;EACE,kBAAA;EACA,SAAA;EACA,UAAA;EACA,ugBAAA;EACA,YAAA;EACA,4BAAA;EACA,2BAAA;EACA,YAAA;EAjJA,4BAAA;EACA,yBAAA;EACA,mCAAA;AAmHF;AAgCA;EACE,UAAA;AA9BF;AAiCA;EACE,kBAAA;EACA,kBAAA;EACA,SAAA;EACA,SAAA;EACA,6BAAA;AA/BF;AAkCA;;;;EAIE,qBAAA;AAhCF;AAmCA;EACE,kBAAA;EACA,eAAA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,SAAA;AAjCF;AAoCA;EACE,QAAA;EACA,MAAA;EACA,kBAAA;EACA,eAAA;EACA,WAAA;EACA,YAAA;EACA,yBAAA;EACA,2UAAA;EACA,sBAAA;EACA,yBAAA;AAlCF;AAqCA;EACE,yBAAA;EACA,8BAAA;EACA,cAAA;EACA,cAAA;EACA,kBAAA;EACA,UAAA;EACA,QAAA;EACA,eAAA;EACA,YAAA;EACA,YAAA;EACA,qBAAA;EACA,kBAAA;EACA,iBAAA;EACA,sCAAA;AAnCF;AAsCA;;;EAGE,cAAA;EACA,qBAAA;AApCF","sourcesContent":["@charset \"UTF-8\";\n\n// colors\n@black: rgba(0, 0, 0, 1);\n@grey: #333;\n@light-grey: #cfcfcf;\n@white: rgba(255, 255, 255, 1);\n@shadow-1: rgba(0, 0, 0, 0.8);\n@shadow-2: rgba(0, 0, 0, 0.6);\n@shadow-3: rgba(0, 0, 0, 0.5);\n@shadow-4: rgba(0, 0, 0, 0.4);\n\n// mixins\n.transition(@property: background; @duration: 0.4s; @timing: ease-in) {\n  transition-property: @property;\n  transition-duration: @duration;\n  transition-timing-function: @timing;\n}\n\n.text-ellipsis() {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n// shared CSS with RMP\n.rmp-container {\n  position: relative;\n  text-align: center;\n  outline: none;\n  background: @black;\n  padding: 0;\n  border: none;\n  display: block;\n  font-size: 14px;\n  max-width: none;\n  max-height: none;\n  overflow: hidden;\n  line-height: 1;\n  box-sizing: border-box;\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n.rmp-container * {\n  box-sizing: border-box;\n}\n\n.rmp-video,\n.rmp-content {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 0;\n  padding: 0;\n  outline: none;\n  display: block;\n}\n\n.rmp-ad-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  outline: none;\n  display: block;\n  text-align: initial;\n}\n\n.rmp-fullscreen-on {\n  position: fixed !important;\n  width: 100% !important;\n  height: 100% !important;\n  background: @black !important;\n  overflow: hidden !important;\n  z-index: 9999 !important;\n  top: 0;\n  left: 0;\n}\n\n// specific CSS to rmp-vast\n.rmp-vpaid-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  outline: none;\n  display: block;\n  text-align: initial;\n}\n\n.rmp-ad-vast-video-player {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 0;\n  padding: 0;\n  outline: none;\n  display: block;\n  cursor: pointer;\n}\n\n.rmp-ad-container-icons {\n  position: absolute;\n  display: block;\n  cursor: pointer;\n}\n\n.rmp-ad-container-skip {\n  position: absolute;\n  right: 0;\n  bottom: 44px;\n  width: 160px;\n  height: 40px;\n  line-height: 38px;\n  text-align: center;\n  cursor: pointer;\n  background-color: @grey;\n  border: 1px solid @grey;\n  .transition(border-color, 0.4s);\n}\n\n.rmp-ad-container-skip:hover {\n  border-color: @black;\n}\n\n.rmp-ad-container-skip-waiting {\n  width: 100%;\n  position: absolute;\n  padding: 0 2px;\n  color: @light-grey;\n  .text-ellipsis();\n}\n\n.rmp-ad-container-skip-message {\n  width: 65%;\n  position: absolute;\n  left: 5%;\n  color: @white;\n  .text-ellipsis();\n}\n\n.rmp-ad-container-skip-icon {\n  position: absolute;\n  left: 75%;\n  width: 20%;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpi/P//PwMUNADxXyBuZsAPcoA4CIjfA/EuIJ4JFgUZBMU3/kNAMZIYNnz8PwIcgokzIdl0A0r3AHEbHhf9RGJ/hjGQDWJFYlcC8SQgZibgzf/YDEIHuUC8CIi58ahhJMYgEIgC4mVALIFNMzIgZBAI+AHxRiCWRfcOqQaBgBkQrwRiMSB+iE0BCwPxwBKIDwLxH0pcBAMPkKOcXIPmALEnED+lxKDJQJwKZUuQa1AVEOch8f+SE9hZQDydGCcjG/QPif0H6pUF+LIFriwCy1dvgTgChyEMaPmPBZuLVKA2RALxbjy+IGjQCiD+RcAQEFgF9fpHIN4GEwQIMACnXWgupdnzwwAAAABJRU5ErkJggg==\");\n  height: 100%;\n  background-repeat: no-repeat;\n  background-position: center;\n  opacity: 0.7;\n  .transition(opacity, 0.4s);\n}\n\n.rmp-ad-container-skip:hover .rmp-ad-container-skip-icon {\n  opacity: 1;\n}\n\n.rmp-ad-non-linear-container {\n  position: absolute;\n  text-align: center;\n  left: 50%;\n  bottom: 0;\n  transform: translate(-50%, 0);\n}\n\n.rmp-ad-non-linear-anchor:link,\n.rmp-ad-non-linear-anchor:visited,\n.rmp-ad-non-linear-anchor:hover,\n.rmp-ad-non-linear-anchor:active {\n  text-decoration: none;\n}\n\n.rmp-ad-non-linear-creative {\n  position: relative;\n  cursor: pointer;\n  text-align: center;\n  width: 100%;\n  height: 100%;\n  bottom: 0;\n}\n\n.rmp-ad-non-linear-close {\n  right: 0;\n  top: 0;\n  position: absolute;\n  cursor: pointer;\n  width: 20px;\n  height: 20px;\n  background-color: @black;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHdJREFUeNqUk9EKwCAIRaX9/9MgEAZ9amsPsWVXdxV8Ec+B1Ep/o40UMuuEpK/RMvAUnEZysfAIlYRkg5/6tyGSQNgKPIkLIwGSuLAn8CSKeovgOMiaMKtKPQENjB5i1Pi7xkoMzD0kBg5PmYVnqv1MGXiT3AIMACNQPFnn5xfHAAAAAElFTkSuQmCC\");\n  background-size: cover;\n  border: 4px solid @black;\n}\n\n.rmp-ad-click-ui-mobile {\n  border: 2px solid @white;\n  background: @shadow-4;\n  color: @white;\n  display: block;\n  position: absolute;\n  right: 8px;\n  top: 8px;\n  font-size: 18px;\n  width: 112px;\n  height: 34px;\n  text-decoration: none;\n  text-align: center;\n  line-height: 30px;\n  box-shadow: 0 0 2px @shadow-2;\n}\n\n.rmp-ad-click-ui-mobile:visited,\n.rmp-ad-click-ui-mobile:hover,\n.rmp-ad-click-ui-mobile:active {\n  color: @white;\n  text-decoration: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["Z"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 3645:
/***/ (function(module) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

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
  }; // import a list of modules into the list


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

/***/ 7537:
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
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ 3379:
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

/***/ 569:
/***/ (function(module) {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

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

/***/ 9216:
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

/***/ 3565:
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

/***/ 7795:
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
  } // For old IE

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

/***/ 4589:
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	!function() {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
var __webpack_exports__ = {};
/* unused harmony exports Headers, Request, Response, DOMException, fetch */
var global =
  (typeof globalThis !== 'undefined' && globalThis) ||
  (typeof self !== 'undefined' && self) ||
  (typeof global !== 'undefined' && global)

var support = {
  searchParams: 'URLSearchParams' in global,
  iterable: 'Symbol' in global && 'iterator' in Symbol,
  blob:
    'FileReader' in global &&
    'Blob' in global &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in global,
  arrayBuffer: 'ArrayBuffer' in global
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name: "' + name + '"')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsText(blob)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    /*
      fetch-mock wraps the Response object in an ES6 Proxy to
      provide useful test harness features such as flush. However, on
      ES5 browsers without fetch or Proxy support pollyfills must be used;
      the proxy-pollyfill is unable to proxy an attribute unless it exists
      on the object before the Proxy is created. This change ensures
      Response.bodyUsed exists on the instance, while maintaining the
      semantic of setting Request.bodyUsed in the constructor before
      _initBody is called.
    */
    this.bodyUsed = this.bodyUsed
    this._bodyInit = body
    if (!body) {
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this)
        if (isConsumed) {
          return isConsumed
        }
        if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(
            this._bodyArrayBuffer.buffer.slice(
              this._bodyArrayBuffer.byteOffset,
              this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
            )
          )
        } else {
          return Promise.resolve(this._bodyArrayBuffer)
        }
      } else {
        return this.blob().then(readBlobAsArrayBuffer)
      }
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }

  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)

  if (this.method === 'GET' || this.method === 'HEAD') {
    if (options.cache === 'no-store' || options.cache === 'no-cache') {
      // Search for a '_' parameter in the query string
      var reParamSearch = /([?&])_=[^&]*/
      if (reParamSearch.test(this.url)) {
        // If it already exists then set the value with the current time
        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime())
      } else {
        // Otherwise add a new '_' parameter to the end with the current time
        var reQueryString = /\?/
        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime()
      }
    }
  }
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
  // https://github.com/github/fetch/issues/748
  // https://github.com/zloirock/core-js/issues/751
  preProcessedHeaders
    .split('\r')
    .map(function(header) {
      return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
    })
    .forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = options.statusText === undefined ? '' : '' + options.statusText
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 0, statusText: ''})
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = global.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      setTimeout(function() {
        resolve(new Response(body, options))
      }, 0)
    }

    xhr.onerror = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.ontimeout = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.onabort = function() {
      setTimeout(function() {
        reject(new DOMException('Aborted', 'AbortError'))
      }, 0)
    }

    function fixUrl(url) {
      try {
        return url === '' && global.location.href ? global.location.href : url
      } catch (e) {
        return url
      }
    }

    xhr.open(request.method, fixUrl(request.url), true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob'
      } else if (
        support.arrayBuffer &&
        request.headers.get('Content-Type') &&
        request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
      ) {
        xhr.responseType = 'arraybuffer'
      }
    }

    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
      Object.getOwnPropertyNames(init.headers).forEach(function(name) {
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]))
      })
    } else {
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch.polyfill = true

if (!global.fetch) {
  global.fetch = fetch
  global.Headers = Headers
  global.Request = Request
  global.Response = Response
}

}();
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

;// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/finally.js
/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        // @ts-ignore
        return constructor.reject(reason);
      });
    }
  );
}

/* harmony default export */ var src_finally = (finallyConstructor);

;// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/allSettled.js
function allSettled(arr) {
  var P = this;
  return new P(function(resolve, reject) {
    if (!(arr && typeof arr.length !== 'undefined')) {
      return reject(
        new TypeError(
          typeof arr +
            ' ' +
            arr +
            ' is not iterable(cannot read property Symbol(Symbol.iterator))'
        )
      );
    }
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        var then = val.then;
        if (typeof then === 'function') {
          then.call(
            val,
            function(val) {
              res(i, val);
            },
            function(e) {
              args[i] = { status: 'rejected', reason: e };
              if (--remaining === 0) {
                resolve(args);
              }
            }
          );
          return;
        }
      }
      args[i] = { status: 'fulfilled', value: val };
      if (--remaining === 0) {
        resolve(args);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
}

/* harmony default export */ var src_allSettled = (allSettled);

;// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/index.js



// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function isArray(x) {
  return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = src_finally;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.all accepts an array'));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.allSettled = src_allSettled;

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.race accepts an array'));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  // @ts-ignore
  (typeof setImmediate === 'function' &&
    function(fn) {
      // @ts-ignore
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/* harmony default export */ var src = (Promise);

;// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/polyfill.js




/** @suppress {undefinedVars} */
var globalNS = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof __webpack_require__.g !== 'undefined') {
    return __webpack_require__.g;
  }
  throw new Error('unable to locate global object');
})();

// Expose the polyfill if Promise is undefined or set to a
// non-function value. The latter can be due to a named HTMLElement
// being exposed by browsers for legacy reasons.
// https://github.com/taylorhakes/promise-polyfill/issues/114
if (typeof globalNS['Promise'] !== 'function') {
  globalNS['Promise'] = src;
} else {
  if (!globalNS.Promise.prototype['finally']) {
    globalNS.Promise.prototype['finally'] = src_finally;
  } 
  if (!globalNS.Promise.allSettled) {
    globalNS.Promise.allSettled = src_allSettled;
  }
}

}();
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ RmpVast; }
});

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.keys.js
var es_object_keys = __webpack_require__(7941);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__(1539);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.for-each.js
var web_dom_collections_for_each = __webpack_require__(4747);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.find.js
var es_array_find = __webpack_require__(9826);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.iterator.js
var es_string_iterator = __webpack_require__(8783);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.iterator.js
var es_array_iterator = __webpack_require__(6992);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js
var web_dom_collections_iterator = __webpack_require__(3948);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.promise.js
var es_promise = __webpack_require__(8674);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.js
var es_symbol = __webpack_require__(2526);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js
var es_symbol_description = __webpack_require__(1817);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.concat.js
var es_array_concat = __webpack_require__(2222);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js
var es_regexp_exec = __webpack_require__(4916);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.filter.js
var es_array_filter = __webpack_require__(7327);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.iterator.js
var es_symbol_iterator = __webpack_require__(2165);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.async-iterator.js
var es_symbol_async_iterator = __webpack_require__(2443);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.to-string-tag.js
var es_symbol_to_string_tag = __webpack_require__(3680);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.json.to-string-tag.js
var es_json_to_string_tag = __webpack_require__(3706);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.math.to-string-tag.js
var es_math_to_string_tag = __webpack_require__(2703);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-prototype-of.js
var es_object_get_prototype_of = __webpack_require__(489);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name = __webpack_require__(8309);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.reverse.js
var es_array_reverse = __webpack_require__(5069);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.slice.js
var es_array_slice = __webpack_require__(7042);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.to-string.js
var es_regexp_to_string = __webpack_require__(9714);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.index-of.js
var es_array_index_of = __webpack_require__(2772);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.replace.js
var es_string_replace = __webpack_require__(5306);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.parse-float.js
var es_parse_float = __webpack_require__(4678);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.is-finite.js
var es_number_is_finite = __webpack_require__(5192);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.constructor.js
var es_number_constructor = __webpack_require__(9653);
;// CONCATENATED MODULE: ./src/js/framework/fw.js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }



















function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var FW = /*#__PURE__*/function () {
  function FW() {
    _classCallCheck(this, FW);
  }

  _createClass(FW, null, [{
    key: "_getStyleAttributeData",
    value: function _getStyleAttributeData(element, style) {
      var styleAttributeData = 0;

      if (element && typeof window.getComputedStyle === 'function') {
        var cs = window.getComputedStyle(element, null);

        if (cs) {
          styleAttributeData = cs.getPropertyValue(style);
          styleAttributeData = styleAttributeData.toString().toLowerCase();
        }
      }

      styleAttributeData = styleAttributeData.toString();

      if (styleAttributeData.indexOf('px') > -1) {
        styleAttributeData = styleAttributeData.replace('px', '');
      }

      return parseFloat(styleAttributeData);
    }
  }, {
    key: "nullFn",
    value: function nullFn() {
      return null;
    }
  }, {
    key: "createStdEvent",
    value: function createStdEvent(eventName, element) {
      var event;

      if (element) {
        try {
          event = new Event(eventName);
          element.dispatchEvent(event);
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }, {
    key: "setStyle",
    value: function setStyle(element, styleObject) {
      if (element && _typeof(styleObject) === 'object') {
        var keys = Object.keys(styleObject);
        keys.forEach(function (key) {
          element.style[key] = styleObject[key];
        });
      }
    }
  }, {
    key: "getWidth",
    value: function getWidth(element) {
      if (element) {
        if (FW.isNumber(element.offsetWidth) && element.offsetWidth !== 0) {
          return element.offsetWidth;
        } else {
          return FW._getStyleAttributeData(element, 'width');
        }
      }

      return 0;
    }
  }, {
    key: "getHeight",
    value: function getHeight(element) {
      if (element) {
        if (FW.isNumber(element.offsetHeight) && element.offsetHeight !== 0) {
          return element.offsetHeight;
        } else {
          return FW._getStyleAttributeData(element, 'height');
        }
      }

      return 0;
    }
  }, {
    key: "show",
    value: function show(element) {
      if (element) {
        element.style.display = 'block';
      }
    }
  }, {
    key: "hide",
    value: function hide(element) {
      if (element) {
        element.style.display = 'none';
      }
    }
  }, {
    key: "removeElement",
    value: function removeElement(element) {
      if (element && element.parentNode) {
        try {
          element.parentNode.removeChild(element);
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }, {
    key: "isEmptyObject",
    value: function isEmptyObject(obj) {
      if (obj && _typeof(obj) === 'object' && Object.keys(obj).length === 0) {
        return true;
      }

      return false;
    }
  }, {
    key: "consoleStyle",
    get: function get() {
      return 'color: white; background-color: #00ACC1; padding:1px 3px; border-radius: 3px; margin-right: 7px';
    }
  }, {
    key: "consoleStyle2",
    get: function get() {
      return 'color: white; background-color: #FB8C00; padding:1px 3px; border-radius: 3px; margin-right: 7px';
    }
  }, {
    key: "consolePrepend2",
    get: function get() {
      var CLASSIC_LOG_PATTERN = /(edge|xbox|msie|trident)/i;

      if (navigator && navigator.userAgent && CLASSIC_LOG_PATTERN.test(navigator.userAgent)) {
        // browsers with no console log styling capabilities
        return 'om-sdk-manager:';
      }

      return 'om-sdk-manager%c';
    }
  }, {
    key: "consolePrepend",
    get: function get() {
      var CLASSIC_LOG_PATTERN = /(edge|xbox|msie|trident)/i;

      if (navigator && navigator.userAgent && CLASSIC_LOG_PATTERN.test(navigator.userAgent)) {
        // browsers with no console log styling capabilities
        return 'RMP-VAST:';
      }

      return '%crmp-vast%c';
    }
  }, {
    key: "logVideoEvents",
    value: function logVideoEvents(video, type) {
      var events = ['loadstart', 'durationchange', 'playing', 'waiting', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'];
      events.forEach(function (value) {
        video.addEventListener(value, function (e) {
          if (e && e.type) {
            console.log("".concat(FW.consolePrepend, " ").concat(type, " player event ").concat(e.type), FW.consoleStyle, '');
          }
        });
      });
    }
  }, {
    key: "isNumber",
    value: function isNumber(n) {
      if (typeof n === 'number' && Number.isFinite(n)) {
        return true;
      }

      return false;
    }
  }, {
    key: "openWindow",
    value: function openWindow(link) {
      try {
        // I would like to use named window here to have better performance like 
        // window.open(link, 'rmpVastAdPageArea'); but focus is not set on updated window with such approach
        // in MS Edge and FF - so _blank it is
        window.open(link, '_blank');
      } catch (e) {
        console.warn(e);
      }
    }
  }]);

  return FW;
}();


// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.match.js
var es_string_match = __webpack_require__(4723);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.parse-int.js
var es_parse_int = __webpack_require__(1058);
;// CONCATENATED MODULE: ./src/js/framework/env.js




function env_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function env_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function env_createClass(Constructor, protoProps, staticProps) { if (protoProps) env_defineProperties(Constructor.prototype, protoProps); if (staticProps) env_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var TEST_VIDEO = document.createElement('video');
var IOS_PATTERN = /(ipad|iphone|ipod)/i;
var IOS_VERSION_PATTERN = /os\s+(\d+)_/i;
var MACOS_PATTERN = /(macintosh|mac\s+os)/i;
var MACOS_VERSION_PATTERN = /mac\s+os\s+x\s+(\d+)_(\d+)/i;
var SAFARI_PATTERN = /safari\/[.0-9]*/i;
var SAFARI_VERSION_PATTERN = /version\/(\d+)\./i;
var NO_SAFARI_PATTERN = /(chrome|chromium|android|crios|fxios)/i;
var MAC_PLATFORM_PATTERN = /macintel/i;
var ANDROID_PATTERN = /android/i;
var ANDROID_VERSION_PATTERN = /android\s*(\d+)\./i;
/*const FIREFOX_PATTERN = /firefox\//i;
const SEAMONKEY_PATTERN = /seamonkey\//i;*/

var ENV = /*#__PURE__*/function () {
  function ENV() {
    env_classCallCheck(this, ENV);
  }

  env_createClass(ENV, null, [{
    key: "_filterVersion",
    value: function _filterVersion(pattern) {
      if (navigator.userAgent) {
        var versionArray = navigator.userAgent.match(pattern);

        if (Array.isArray(versionArray) && typeof versionArray[1] !== 'undefined') {
          return parseInt(versionArray[1], 10);
        }
      }

      return -1;
    }
  }, {
    key: "hasTouchEvents",
    get: function get() {
      if (typeof window.ontouchstart !== 'undefined' || window.DocumentTouch && document instanceof window.DocumentTouch) {
        return true;
      }

      return false;
    }
  }, {
    key: "userAgent",
    get: function get() {
      if (navigator.userAgent) {
        return navigator.userAgent;
      }

      return null;
    }
  }, {
    key: "devicePixelRatio",
    get: function get() {
      var pixelRatio = 1;

      if (FW.isNumber(window.devicePixelRatio) && window.devicePixelRatio > 1) {
        pixelRatio = window.devicePixelRatio;
      }

      return pixelRatio;
    }
  }, {
    key: "maxTouchPoints",
    get: function get() {
      if (typeof navigator.maxTouchPoints === 'number') {
        return navigator.maxTouchPoints;
      }

      return -1;
    }
  }, {
    key: "isIos",
    get: function get() {
      var support = [false, -1];

      if (IOS_PATTERN.test(ENV.userAgent) && ENV.hasTouchEvents) {
        support = [true, ENV._filterVersion(IOS_VERSION_PATTERN)];
      }

      return support;
    }
  }, {
    key: "isIpadOS",
    get: function get() {
      if (!ENV.isIos[0] && ENV.hasTouchEvents && MAC_PLATFORM_PATTERN.test(navigator.platform) && ENV.devicePixelRatio > 1 && ENV.maxTouchPoints > 1) {
        return true;
      }

      return false;
    }
  }, {
    key: "isMacOS",
    get: function get() {
      var isMacOS = false;
      var macOSXMinorVersion = -1;

      if (!ENV.isIos[0] && !ENV.isIpadOS && MACOS_PATTERN.test(ENV.userAgent)) {
        isMacOS = true;
        macOSXMinorVersion = ENV._filterVersion(MACOS_VERSION_PATTERN, true);
      }

      return [isMacOS, macOSXMinorVersion];
    }
  }, {
    key: "isSafari",
    get: function get() {
      var isSafari = false;
      var safariVersion = -1;

      if (SAFARI_PATTERN.test(ENV.userAgent) && !NO_SAFARI_PATTERN.test(ENV.userAgent)) {
        isSafari = true;
        safariVersion = ENV._filterVersion(SAFARI_VERSION_PATTERN);
      }

      return [isSafari, safariVersion];
    }
  }, {
    key: "isMacOSSafari",
    get: function get() {
      return ENV.isMacOS[0] && ENV.isSafari[0];
    }
  }, {
    key: "isAndroid",
    get: function get() {
      var support = [false, -1];

      if (!ENV.isIos[0] && ENV.hasTouchEvents && ANDROID_PATTERN.test(ENV.userAgent)) {
        support = [true, ENV._filterVersion(ANDROID_VERSION_PATTERN)];
      }

      return support;
    }
    /*// from https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
    static get isFirefox() {
      if (FIREFOX_PATTERN.test(ENV.userAgent) && !SEAMONKEY_PATTERN.test(ENV.userAgent)) {
        return true;
      }
      return false;
    }*/

  }, {
    key: "isMobile",
    get: function get() {
      if (ENV.isIos[0] || ENV.isAndroid[0] || ENV.isIpadOS) {
        return true;
      }

      return false;
    }
  }, {
    key: "hasNativeFullscreenSupport",
    get: function get() {
      var doc = document.documentElement;

      if (doc) {
        if (typeof doc.requestFullscreen !== 'undefined' || typeof doc.webkitRequestFullscreen !== 'undefined' || typeof doc.mozRequestFullScreen !== 'undefined' || typeof doc.msRequestFullscreen !== 'undefined' || typeof TEST_VIDEO.webkitEnterFullscreen !== 'undefined') {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "checkCanPlayType",
    value: function checkCanPlayType(type, codec) {
      if (TEST_VIDEO.canPlayType !== 'undefined') {
        if (type && codec) {
          var canPlayType = TEST_VIDEO.canPlayType(type + '; codecs="' + codec + '"');

          if (canPlayType !== '') {
            return true;
          }
        } else if (type && !codec) {
          var _canPlayType = TEST_VIDEO.canPlayType(type);

          if (_canPlayType !== '') {
            return true;
          }
        }
      }

      return false;
    }
  }]);

  return ENV;
}();


;// CONCATENATED MODULE: ./src/js/players/content-player.js


var CONTENT_PLAYER = {};

CONTENT_PLAYER.play = function (firstContentPlayerPlayRequest) {
  if (this.contentPlayer && this.contentPlayer.paused) {
    Utils.playPromise.call(this, 'content', firstContentPlayerPlayRequest);
  }
};

CONTENT_PLAYER.pause = function () {
  if (this.contentPlayer && !this.contentPlayer.paused) {
    this.contentPlayer.pause();
  }
};

CONTENT_PLAYER.setVolume = function (level) {
  if (this.contentPlayer) {
    this.contentPlayer.volume = level;
  }
};

CONTENT_PLAYER.getVolume = function () {
  if (this.contentPlayer) {
    return this.contentPlayer.volume;
  }

  return -1;
};

CONTENT_PLAYER.getMute = function () {
  if (this.contentPlayer) {
    return this.contentPlayer.muted;
  }

  return false;
};

CONTENT_PLAYER.setMute = function (muted) {
  if (this.contentPlayer) {
    if (muted && !this.contentPlayer.muted) {
      this.contentPlayer.muted = true;
    } else if (!muted && this.contentPlayer.muted) {
      this.contentPlayer.muted = false;
    }
  }
};

CONTENT_PLAYER.getDuration = function () {
  if (this.contentPlayer) {
    var duration = this.contentPlayer.duration;

    if (FW.isNumber(duration)) {
      return Math.round(duration * 1000);
    }
  }

  return -1;
};

CONTENT_PLAYER.getCurrentTime = function () {
  if (this.contentPlayer) {
    var currentTime = this.contentPlayer.currentTime;

    if (FW.isNumber(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }

  return -1;
};

CONTENT_PLAYER.seekTo = function (msSeek) {
  if (!FW.isNumber(msSeek)) {
    return;
  }

  if (msSeek >= 0 && this.contentPlayer) {
    var seekValue = Math.round(msSeek / 1000 * 100) / 100;
    this.contentPlayer.currentTime = seekValue;
  }
};

CONTENT_PLAYER.preventSeekingForCustomPlayback = function () {
  var _this = this;

  // after much poking it appears we cannot rely on seek events for iOS to 
  // set this up reliably - so interval it is
  if (this.contentPlayer) {
    this.antiSeekLogicInterval = setInterval(function () {
      if (_this.creative.isLinear && _this.adOnStage) {
        var diff = Math.abs(_this.customPlaybackCurrentTime - _this.contentPlayer.currentTime);

        if (diff > 1) {
          _this.contentPlayer.currentTime = _this.customPlaybackCurrentTime;
        }

        _this.customPlaybackCurrentTime = _this.contentPlayer.currentTime;
      }
    }, 200);
  }
};

/* harmony default export */ var content_player = (CONTENT_PLAYER);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.join.js
var es_array_join = __webpack_require__(9600);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.map.js
var es_array_map = __webpack_require__(1249);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.from.js
var es_array_from = __webpack_require__(1038);
;// CONCATENATED MODULE: ./src/js/tracking/tracking-events.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

























var TRACKING_EVENTS = {};
var MEDIA_MIME = ['video/webm', 'video/mp4', 'video/ogg', 'video/3gpp', 'application/vnd.apple.mpegurl', 'application/dash+xml'];

var _dispatch = function _dispatch(event) {
  var _this = this;

  console.log("".concat(FW.consolePrepend, " ping tracking for ").concat(event, " VAST event"), FW.consoleStyle, ''); // filter trackers - may return multiple urls for same event as allowed by VAST spec

  var trackers = this.trackingTags.filter(function (value) {
    return event === value.event;
  }); // send ping for each valid tracker

  if (trackers.length > 0) {
    trackers.forEach(function (element) {
      TRACKING_EVENTS.pingURI.call(_this, element.url);
    });
  }
};

TRACKING_EVENTS.dispatch = function (event) {
  var _this2 = this;

  if (Array.isArray(event)) {
    event.forEach(function (currentEvent) {
      _dispatch.call(_this2, currentEvent);
    });
  } else {
    _dispatch.call(this, event);
  }
};

var _vastReadableTime = function _vastReadableTime(time) {
  if (FW.isNumber(time) && time >= 0) {
    var seconds = 0;
    var minutes = 0;
    var hours = 0;
    var ms = Math.floor(time % 1000);

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
};

var _generateCacheBusting = function _generateCacheBusting() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

TRACKING_EVENTS.replaceMacros = function (url, trackingPixels) {
  var _this3 = this;

  var pattern0 = /\[.+?\]/i;

  if (!pattern0.test(url)) {
    return url;
  }

  var finalString = url; // Marking Macro Values as Unknown or Unavailable 

  var pattern8 = /\[(ADCOUNT|TRANSACTIONID|PLACEMENTTYPE|BREAKMAXDURATION|BREAKMINDURATION|BREAKMAXADS|BREAKMINADLENGTH|BREAKMAXADLENGTH|IFA|IFATYPE|CLIENTUA|SERVERUA|DEVICEIP|APPBUNDLE|EXTENSIONS|VERIFICATIONVENDORS|OMIDPARTNER|INVENTORYSTATE|CONTENTID|LATLONG)\]/gi;

  if (pattern8.test(finalString)) {
    finalString = finalString.replace(pattern8, '-1');
  }

  var pattern8bis = /\[(CONTENTURI|CLICKPOS)\]/gi;

  if (pattern8bis.test(finalString)) {
    finalString = finalString.replace(pattern8bis, '-2');
  } // available macros


  var pattern1 = /\[TIMESTAMP\]/gi;
  var date = new Date().toISOString();

  if (pattern1.test(finalString)) {
    finalString = finalString.replace(pattern1, encodeURIComponent(date));
  }

  var pattern2 = /\[CACHEBUSTING\]/gi;

  if (pattern2.test(finalString)) {
    finalString = finalString.replace(pattern2, _generateCacheBusting());
  }

  var pattern3 = /\[(CONTENTPLAYHEAD|MEDIAPLAYHEAD)\]/gi;
  var currentContentTime = content_player.getCurrentTime.call(this);

  if (pattern3.test(finalString) && currentContentTime > -1) {
    finalString = finalString.replace(pattern3, encodeURIComponent(_vastReadableTime(currentContentTime)));
  }

  var pattern5 = /\[BREAKPOSITION\]/gi;
  var duration = vast_player.getDuration.call(this);

  if (pattern5.test(finalString)) {
    if (currentContentTime === 0) {
      finalString = finalString.replace(pattern5, '1');
    } else if (currentContentTime > 0 && currentContentTime < duration) {
      finalString = finalString.replace(pattern5, '2');
    } else {
      finalString = finalString.replace(pattern5, '3');
    }
  }

  var pattern9 = /\[ADTYPE\]/gi;

  if (pattern9.test(finalString) && this.ad.adType) {
    finalString = finalString.replace(pattern9, encodeURIComponent(this.ad.adType));
  }

  var pattern11 = /\[DEVICEUA\]/gi;

  if (pattern11.test(finalString) && ENV.userAgent) {
    finalString = finalString.replace(pattern11, encodeURIComponent(ENV.userAgent));
  }

  var pattern11bis = /\[SERVERSIDE\]/gi;

  if (pattern11bis.test(finalString) && ENV.userAgent) {
    finalString = finalString.replace(pattern11bis, '0');
  }

  var pattern13 = /\[DOMAIN\]/gi;

  if (pattern13.test(finalString) && window.location.hostname) {
    finalString = finalString.replace(pattern13, encodeURIComponent(window.location.hostname));
  }

  var pattern14 = /\[PAGEURL\]/gi;

  if (pattern14.test(finalString) && window.location.href) {
    finalString = finalString.replace(pattern14, encodeURIComponent(window.location.href));
  }

  var pattern18 = /\[PLAYERCAPABILITIES\]/gi;

  if (pattern18.test(finalString)) {
    finalString = finalString.replace(pattern18, 'skip,mute,autoplay,mautoplay,fullscreen,icon');
  }

  var pattern19 = /\[CLICKTYPE\]/gi;

  if (pattern19.test(finalString)) {
    var clickType = '1';

    if (ENV.isMobile) {
      clickType = '2';
    }

    finalString = finalString.replace(pattern19, clickType);
  }

  var pattern21 = /\[PLAYERSIZE\]/gi;

  if (pattern21.test(finalString)) {
    var width = parseInt(FW.getWidth(this.container));
    var height = parseInt(FW.getHeight(this.container));
    finalString = finalString.replace(pattern21, encodeURIComponent(width.toString() + ',' + height.toString()));
  }

  if (trackingPixels) {
    var pattern4 = /\[ADPLAYHEAD\]/gi;
    var currentVastTime = vast_player.getCurrentTime.call(this);

    if (pattern4.test(finalString) && currentVastTime > -1) {
      finalString = finalString.replace(pattern4, encodeURIComponent(_vastReadableTime(currentVastTime)));
    }

    var pattern10 = /\[UNIVERSALADID\]/gi;

    if (pattern10.test(finalString) && this.creative.universalAdIds.length > 0) {
      var universalAdIdString = '';
      this.creative.universalAdIds.forEach(function (universalAdId, index) {
        if (index !== 0 || index !== _this3.creative.universalAdIds.length - 1) {
          universalAdIdString += ',';
        }

        universalAdIdString += universalAdId.idRegistry + ' ' + universalAdId.value;
      });
      finalString = finalString.replace(pattern10, encodeURIComponent(universalAdIdString));
    }

    var pattern22 = /\[ASSETURI\]/gi;
    var assetUri = this.getAdMediaUrl();

    if (pattern22.test(finalString) && typeof assetUri === 'string' && assetUri !== '') {
      finalString = finalString.replace(pattern22, encodeURIComponent(assetUri));
    }

    var pattern23 = /\[PODSEQUENCE\]/gi;

    if (pattern23.test(finalString) && this.ad.sequence) {
      finalString = finalString.replace(pattern23, encodeURIComponent(this.ad.sequence.toString()));
    }

    var pattern24 = /\[ADSERVINGID\]/gi;

    if (pattern24.test(finalString) && this.ad.adServingId) {
      finalString = finalString.replace(pattern24, encodeURIComponent(this.ad.adServingId));
    }
  } else {
    var pattern6 = /\[ADCATEGORIES\]/gi;

    if (pattern6.test(finalString) && this.ad.categories.length > 0) {
      var categories = this.ad.categories.map(function (categorie) {
        return categorie.value;
      }).join(',');
      finalString = finalString.replace(pattern6, encodeURIComponent(categories));
    }

    var pattern7 = /\[BLOCKEDADCATEGORIES\]/gi;

    if (pattern7.test(finalString) && this.ad.blockedAdCategories.length > 0) {
      var blockedAdCategories = this.ad.blockedAdCategories.map(function (blockedAdCategories) {
        return blockedAdCategories.value;
      }).join(',');
      finalString = finalString.replace(pattern7, encodeURIComponent(blockedAdCategories));
    }

    var pattern15 = /\[VASTVERSIONS\]/gi;

    if (pattern15.test(finalString)) {
      finalString = finalString.replace(pattern15, '2,3,5,6,7,8,11,12,13,14');
    }

    var pattern16 = /\[APIFRAMEWORKS\]/gi;

    if (pattern16.test(finalString)) {
      finalString = finalString.replace(pattern16, '2');
    }

    var pattern17 = /\[MEDIAMIME\]/gi;

    if (pattern17.test(finalString)) {
      var mimeTyepString = '';
      MEDIA_MIME.forEach(function (value) {
        if (ENV.checkCanPlayType(value)) {
          mimeTyepString += value + ',';
        }
      });

      if (mimeTyepString) {
        mimeTyepString = mimeTyepString.slice(0, -1);
        finalString = finalString.replace(pattern17, encodeURIComponent(mimeTyepString));
      }
    }

    var pattern20 = /\[PLAYERSTATE\]/gi;

    if (pattern20.test(finalString)) {
      var playerState = '';
      var muted = content_player.getMute();

      if (muted) {
        playerState += 'muted';
      }

      var fullscreen = this.getFullscreen();

      if (fullscreen) {
        if (playerState) {
          playerState += ',';
        }

        playerState += 'fullscreen';
      }

      finalString = finalString.replace(pattern20, playerState);
    }
  }

  var pattern25 = /\[LIMITADTRACKING\]/gi;

  if (pattern25.test(finalString) && this.regulationsInfo.limitAdTracking) {
    finalString = finalString.replace(pattern25, encodeURIComponent(this.regulationsInfo.limitAdTracking));
  }

  var pattern26 = /\[REGULATIONS\]/gi;

  if (pattern26.test(finalString) && this.regulationsInfo.regulations) {
    finalString = finalString.replace(pattern26, encodeURIComponent(this.regulationsInfo.regulations));
  }

  var pattern27 = /\[GDPRCONSENT\]/gi;

  if (pattern27.test(finalString) && this.regulationsInfo.gdprConsent) {
    finalString = finalString.replace(pattern27, encodeURIComponent(this.regulationsInfo.gdprConsent));
  }

  return finalString;
};

var _ping = function _ping(url) {
  // we expect an image format for the tracker (generally a 1px GIF/PNG/JPG) or JavaScript as 
  // those are the most common format in the industry 
  // other format may produce errors and the related tracker may not be requested properly
  var jsPattern = /\.js$/i;

  if (jsPattern.test(url)) {
    var script = document.createElement('script');
    script.src = url;

    try {
      document.head.appendChild(script);
    } catch (error) {
      console.warn(error);
      document.body.appendChild(script);
    }
  } else {
    var img = new Image();
    img.addEventListener('load', function () {
      console.log("".concat(FW.consolePrepend, " VAST tracker successfully loaded ").concat(url), FW.consoleStyle, '');
      img = null;
    });
    img.addEventListener('error', function () {
      console.log("".concat(FW.consolePrepend, " VAST tracker failed loading ").concat(url), FW.consoleStyle, '');
      img = null;
    });
    img.src = url;
  }
};

TRACKING_EVENTS.pingURI = function (url) {
  var trackingUrl = TRACKING_EVENTS.replaceMacros.call(this, url, true);

  _ping.call(this, trackingUrl);
};

TRACKING_EVENTS.error = function (errorCode) {
  var _this4 = this;

  // for each Error tag within an InLine or chain of Wrapper ping error URL
  var errorTags = this.adErrorTags;

  if (errorCode === 303 && this.vastErrorTags.length > 0) {
    // here we ping vastErrorTags with error code 303 according to spec
    // concat array thus
    errorTags = [].concat(_toConsumableArray(errorTags), _toConsumableArray(this.vastErrorTags));
  }

  if (errorTags.length > 0) {
    errorTags.forEach(function (errorTag) {
      if (errorTag.url) {
        var errorUrl = errorTag.url;
        var errorRegExp = /\[ERRORCODE\]/gi;

        if (errorRegExp.test(errorUrl) && FW.isNumber(errorCode) && errorCode > 0 && errorCode < 1000) {
          errorUrl = errorUrl.replace(errorRegExp, errorCode);
        }

        _ping.call(_this4, errorUrl);
      }
    });
  }
};

var _onVolumeChange = function _onVolumeChange() {
  if (this.vastPlayer.muted || this.vastPlayer.volume === 0) {
    Utils.createApiEvent.call(this, 'advolumemuted');
    TRACKING_EVENTS.dispatch.call(this, 'mute');
    this.vastPlayerMuted = true;
  } else {
    if (this.vastPlayerMuted) {
      TRACKING_EVENTS.dispatch.call(this, 'unmute');
      this.vastPlayerMuted = false;
    }
  }

  Utils.createApiEvent.call(this, 'advolumechanged');
};

var _onTimeupdate = function _onTimeupdate() {
  var _this5 = this;

  this.vastPlayerCurrentTime = vast_player.getCurrentTime.call(this);

  if (this.vastPlayerCurrentTime > 0) {
    if (this.vastPlayerDuration > 0 && this.vastPlayerDuration > this.vastPlayerCurrentTime) {
      if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.25 && !this.firstQuartileEventFired) {
        this.firstQuartileEventFired = true;
        Utils.createApiEvent.call(this, 'adfirstquartile');
        TRACKING_EVENTS.dispatch.call(this, 'firstQuartile');
      } else if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.5 && !this.midpointEventFired) {
        this.midpointEventFired = true;
        Utils.createApiEvent.call(this, 'admidpoint');
        TRACKING_EVENTS.dispatch.call(this, 'midpoint');
      } else if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.75 && !this.thirdQuartileEventFired) {
        this.thirdQuartileEventFired = true;
        Utils.createApiEvent.call(this, 'adthirdquartile');
        TRACKING_EVENTS.dispatch.call(this, 'thirdQuartile');
      }
    } // progress event


    if (this.progressEvents.length > 0) {
      if (this.vastPlayerCurrentTime > this.progressEvents[0].time) {
        var filterProgressEvent = this.progressEvents.filter(function (progressEvent) {
          return progressEvent.time === _this5.progressEvents[0].time;
        });
        filterProgressEvent.forEach(function (progressEvent) {
          if (progressEvent.url) {
            TRACKING_EVENTS.pingURI.call(_this5, progressEvent.url);
          }
        });
        this.progressEvents.shift();
        Utils.createApiEvent.call(this, 'adprogress');
      }
    }
  }
};

var _onPause = function _onPause() {
  if (!this.vastPlayerPaused) {
    this.vastPlayerPaused = true;
    Utils.createApiEvent.call(this, 'adpaused'); // do not dispatchPingEvent for pause event here if it is already in this.trackingTags

    for (var i = 0; i < this.trackingTags.length; i++) {
      if (this.trackingTags[i].event === 'pause') {
        return;
      }
    }

    TRACKING_EVENTS.dispatch.call(this, 'pause');
  }
};

var _onPlay = function _onPlay() {
  if (this.vastPlayerPaused) {
    this.vastPlayerPaused = false;
    Utils.createApiEvent.call(this, 'adresumed');
    TRACKING_EVENTS.dispatch.call(this, 'resume');
  }
};

var _onPlaying = function _onPlaying() {
  this.vastPlayer.removeEventListener('playing', this.onPlaying);
  Utils.createApiEvent.call(this, ['adimpression', 'adstarted']);
  TRACKING_EVENTS.dispatch.call(this, ['impression', 'creativeView', 'start']);
};

var _onEnded = function _onEnded() {
  this.vastPlayer.removeEventListener('ended', this.onEnded);
  Utils.createApiEvent.call(this, 'adcomplete');
  TRACKING_EVENTS.dispatch.call(this, 'complete');
  vast_player.resumeContent.call(this);
};

TRACKING_EVENTS.wire = function () {
  // we filter through all HTML5 video events and create new VAST events 
  if (this.vastPlayer && this.creative.isLinear && !this.isVPAID) {
    this.onPause = _onPause.bind(this);
    this.vastPlayer.addEventListener('pause', this.onPause);
    this.onPlay = _onPlay.bind(this);
    this.vastPlayer.addEventListener('play', this.onPlay);
    this.onPlaying = _onPlaying.bind(this);
    this.vastPlayer.addEventListener('playing', this.onPlaying);
    this.onEnded = _onEnded.bind(this);
    this.vastPlayer.addEventListener('ended', this.onEnded);
    this.onVolumeChange = _onVolumeChange.bind(this);
    this.vastPlayer.addEventListener('volumechange', this.onVolumeChange);
    this.onTimeupdate = _onTimeupdate.bind(this);
    this.vastPlayer.addEventListener('timeupdate', this.onTimeupdate);
  }
};

/* harmony default export */ var tracking_events = (TRACKING_EVENTS);
;// CONCATENATED MODULE: ./src/js/creatives/icons.js






var ICONS = {};

ICONS.destroy = function () {
  console.log("".concat(FW.consolePrepend, " Start destroying icons"), FW.consoleStyle, '');
  var icons = this.adContainer.querySelectorAll('.rmp-ad-container-icons');

  if (icons.length > 0) {
    icons.forEach(function (icon) {
      FW.removeElement(icon);
    });
  }
};

ICONS.parse = function (icons) {
  console.log("".concat(FW.consolePrepend, " Start parsing for icons"), FW.consoleStyle, '');

  for (var i = 0; i < icons.length; i++) {
    var currentIcon = icons[i];
    var program = currentIcon.program;

    if (program === null) {
      continue;
    }

    var width = currentIcon.width;
    var height = currentIcon.height;
    var xPosition = currentIcon.xPosition;
    var yPosition = currentIcon.yPosition;

    if (width <= 0 || height <= 0 || xPosition < 0 || yPosition < 0) {
      continue;
    }

    var staticResourceUrl = currentIcon.staticResource;
    var iframeResourceUrl = currentIcon.iframeResource;
    var htmlResource = currentIcon.htmlResource; // we only support StaticResource (HTMLResource not supported)

    if (staticResourceUrl === null && iframeResourceUrl === null && htmlResource === null) {
      continue;
    }

    var iconData = {
      program: program,
      width: width,
      height: height,
      xPosition: xPosition,
      yPosition: yPosition,
      staticResourceUrl: staticResourceUrl,
      iframeResourceUrl: iframeResourceUrl,
      htmlContent: htmlResource
    };
    iconData.iconViewTrackingUrl = currentIcon.iconViewTrackingURLTemplate;
    iconData.iconClickThroughUrl = currentIcon.iconClickThroughURLTemplate;
    iconData.iconClickTrackingUrls = currentIcon.iconClickTrackingURLTemplates;
    this.iconsData.push(iconData);
  }

  console.log("".concat(FW.consolePrepend, " Validated parsed icons follows"), FW.consoleStyle, '');
  console.dir(this.iconsData);
};

var _onIconClickThrough = function _onIconClickThrough(index, event) {
  var _this = this;

  if (event) {
    event.stopPropagation();

    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }

  FW.openWindow(this.iconsData[index].iconClickThroughUrl); // send trackers if any for IconClickTracking

  var iconClickTrackingUrls = this.iconsData[index].iconClickTrackingUrls;

  if (iconClickTrackingUrls.length > 0) {
    iconClickTrackingUrls.forEach(function (tracking) {
      if (tracking.url) {
        tracking_events.pingURI.call(_this, tracking.url);
      }
    });
  }
};

var _onIconLoadPingTracking = function _onIconLoadPingTracking(index) {
  console.log("".concat(FW.consolePrepend, " IconViewTracking for icon at index ").concat(index), FW.consoleStyle, '');
  tracking_events.pingURI.call(this, this.iconsData[index].iconViewTrackingUrl);
};

var _onPlayingAppendIcons = function _onPlayingAppendIcons() {
  var _this2 = this;

  console.log("".concat(FW.consolePrepend, " playing states has been reached - append icons"), FW.consoleStyle, '');
  this.vastPlayer.removeEventListener('playing', this.onPlayingAppendIcons);
  this.iconsData.forEach(function (iconData, index) {
    var icon;
    var src;

    if (iconData.staticResourceUrl) {
      icon = document.createElement('img');
      src = iconData.staticResourceUrl;
    } else if (iconData.iframeResourceUrl || iconData.htmlContent) {
      icon = document.createElement('iframe');
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
      icon.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media');
      icon.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    }

    icon.className = 'rmp-ad-container-icons';
    FW.setStyle(icon, {
      width: parseInt(iconData.width) + 'px',
      height: parseInt(iconData.height) + 'px'
    });
    var xPosition = iconData.xPosition;

    if (xPosition === 'left') {
      icon.style.left = '0px';
    } else if (xPosition === 'right') {
      icon.style.right = '0px';
    } else if (parseInt(xPosition) >= 0) {
      icon.style.left = xPosition + 'px';
    } else {
      icon.style.left = '0px';
    }

    var yPosition = iconData.yPosition;

    if (yPosition === 'top') {
      icon.style.top = '0px';
    } else if (xPosition === 'bottom') {
      icon.style.bottom = '0px';
    } else if (parseInt(yPosition) >= 0) {
      icon.style.top = yPosition + 'px';
    } else {
      icon.style.top = '0px';
    }

    if (iconData.iconViewTrackingUrl) {
      icon.onload = _onIconLoadPingTracking.bind(_this2, index);
    }

    if (iconData.iconClickThroughUrl) {
      icon.addEventListener('touchend', _onIconClickThrough.bind(_this2, index));
      icon.addEventListener('click', _onIconClickThrough.bind(_this2, index));
    }

    if (iconData.htmlContent) {
      icon.srcdoc = src;
    } else {
      icon.src = src;
    }

    console.log("".concat(FW.consolePrepend, " Selected icon details follow"), FW.consoleStyle, '');
    console.dir(icon);

    _this2.adContainer.appendChild(icon);
  });
};

ICONS.append = function () {
  this.onPlayingAppendIcons = _onPlayingAppendIcons.bind(this); // as per VAST 3 spec only append icon when ad starts playing

  this.vastPlayer.addEventListener('playing', this.onPlayingAppendIcons);
};

/* harmony default export */ var creatives_icons = (ICONS);
;// CONCATENATED MODULE: ./src/js/players/vpaid.js











var VPAID = {}; // vpaidCreative getters

VPAID.getAdWidth = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdWidth === 'function') {
    return this.vpaidCreative.getAdWidth();
  }

  return -1;
};

VPAID.getAdHeight = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdHeight === 'function') {
    return this.vpaidCreative.getAdHeight();
  }

  return -1;
};

VPAID.getAdDuration = function () {
  if (this.vpaidCreative) {
    if (typeof this.vpaidCreative.getAdDuration === 'function') {
      return this.vpaidCreative.getAdDuration();
    } else if (this.vpaid1AdDuration > -1) {
      return this.vpaid1AdDuration;
    }
  }

  return -1;
};

VPAID.getAdRemainingTime = function () {
  if (this.vpaidRemainingTime >= 0) {
    return this.vpaidRemainingTime;
  }

  return -1;
};

VPAID.getCreativeUrl = function () {
  if (this.vpaidCreativeUrl) {
    return this.vpaidCreativeUrl;
  }

  return '';
};

VPAID.getVpaidCreative = function () {
  return this.vpaidCreative;
};

VPAID.getAdVolume = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdVolume === 'function') {
    return this.vpaidCreative.getAdVolume();
  }

  return null;
};

VPAID.getAdPaused = function () {
  return this.vpaidPaused;
};

VPAID.getAdExpanded = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdExpanded === 'function') {
    return this.vpaidCreative.getAdExpanded();
  }

  return false;
};

VPAID.getAdSkippableState = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdSkippableState === 'function') {
    return this.vpaidCreative.getAdSkippableState();
  }

  return false;
};

VPAID.getAdIcons = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdIcons === 'function') {
    return this.vpaidCreative.getAdIcons();
  }

  return null;
};

VPAID.getAdCompanions = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdCompanions === 'function') {
    return this.vpaidCreative.getAdCompanions();
  }

  return '';
}; // VPAID creative events


var _onAdLoaded = function _onAdLoaded() {
  var _this = this;

  this.vpaidAdLoaded = true;

  if (!this.vpaidCreative) {
    return;
  }

  if (this.initAdTimeout) {
    clearTimeout(this.initAdTimeout);
  }

  if (this.vpaidCallbacks.AdLoaded) {
    this.vpaidCreative.unsubscribe(this.vpaidCallbacks.AdLoaded, 'AdLoaded');
  } // when we call startAd we expect AdStarted event to follow closely
  // otherwise we need to resume content


  this.startAdTimeout = setTimeout(function () {
    if (!_this.vpaidAdStarted) {
      vast_player.resumeContent.call(_this);
    }

    _this.vpaidAdStarted = false;
  }, this.params.creativeLoadTimeout); // pause content player

  content_player.pause.call(this);
  this.adOnStage = true;
  this.vpaidCreative.startAd();
  Utils.createApiEvent.call(this, 'adloaded');
  tracking_events.dispatch.call(this, 'loaded');
};

var _onAdStarted = function _onAdStarted() {
  this.vpaidAdStarted = true;

  if (!this.vpaidCreative) {
    return;
  }

  if (this.startAdTimeout) {
    clearTimeout(this.startAdTimeout);
  }

  if (this.vpaidCallbacks.AdStarted) {
    this.vpaidCreative.unsubscribe(this.vpaidCallbacks.AdStarted, 'AdStarted');
  } // update duration for VPAID 1.*


  if (this.vpaidVersion === 1) {
    this.vpaid1AdDuration = VPAID.getAdRemainingTime.call(this);
  } // append icons - if VPAID does not handle them


  if (!VPAID.getAdIcons.call(this) && !this.useContentPlayerForAds && this.iconsData.length > 0) {
    creatives_icons.append.call(this);
  }

  if (typeof this.vpaidCreative.getAdLinear === 'function') {
    this.creative.isLinear = this.vpaidCreative.getAdLinear();
  }

  tracking_events.dispatch.call(this, 'creativeView');
};

var _onAdStopped = function _onAdStopped() {
  console.log("".concat(FW.consolePrepend, " VPAID AdStopped event"), FW.consoleStyle, '');

  if (this.adStoppedTimeout) {
    clearTimeout(this.adStoppedTimeout);
  }

  vast_player.resumeContent.call(this);
};

var _onAdSkipped = function _onAdSkipped() {
  if (this.adSkippedTimeout) {
    clearTimeout(this.adSkippedTimeout);
  }

  Utils.createApiEvent.call(this, 'adskipped');
  tracking_events.dispatch.call(this, 'skip');
};

var _onAdSkippableStateChange = function _onAdSkippableStateChange() {
  Utils.createApiEvent.call(this, 'adskippablestatechanged');
};

var _onAdDurationChange = function _onAdDurationChange() {
  if (!this.vpaidCreative) {
    return;
  }

  if (typeof this.vpaidCreative.getAdRemainingTime === 'function') {
    var remainingTime = this.vpaidCreative.getAdRemainingTime();

    if (remainingTime >= 0) {
      this.vpaidRemainingTime = remainingTime;
    }
  }

  Utils.createApiEvent.call(this, 'addurationchange');
};

var _onAdVolumeChange = function _onAdVolumeChange() {
  var newVolume = VPAID.getAdVolume.call(this);

  if (newVolume === null) {
    return;
  }

  if (this.vpaidCurrentVolume > 0 && newVolume === 0) {
    tracking_events.dispatch.call(this, 'mute');
  } else if (this.vpaidCurrentVolume === 0 && newVolume > 0) {
    tracking_events.dispatch.call(this, 'unmute');
  }

  this.vpaidCurrentVolume = newVolume;
  Utils.createApiEvent.call(this, 'advolumechanged');
};

var _onAdImpression = function _onAdImpression() {
  Utils.createApiEvent.call(this, 'adimpression');
  tracking_events.dispatch.call(this, 'impression');
};

var _onAdVideoStart = function _onAdVideoStart() {
  this.vpaidPaused = false;
  var newVolume = VPAID.getAdVolume.call(this);

  if (newVolume === null) {
    newVolume = 1;
  }

  this.vpaidCurrentVolume = newVolume;
  Utils.createApiEvent.call(this, 'adstarted');
  tracking_events.dispatch.call(this, 'start');
};

var _onAdVideoFirstQuartile = function _onAdVideoFirstQuartile() {
  Utils.createApiEvent.call(this, 'adfirstquartile');
  tracking_events.dispatch.call(this, 'firstQuartile');
};

var _onAdVideoMidpoint = function _onAdVideoMidpoint() {
  Utils.createApiEvent.call(this, 'admidpoint');
  tracking_events.dispatch.call(this, 'midpoint');
};

var _onAdVideoThirdQuartile = function _onAdVideoThirdQuartile() {
  Utils.createApiEvent.call(this, 'adthirdquartile');
  tracking_events.dispatch.call(this, 'thirdQuartile');
};

var _onAdVideoComplete = function _onAdVideoComplete() {
  Utils.createApiEvent.call(this, 'adcomplete');
  tracking_events.dispatch.call(this, 'complete');
};

var _onAdClickThru = function _onAdClickThru(url, id, playerHandles) {
  Utils.createApiEvent.call(this, 'adclick');
  tracking_events.dispatch.call(this, 'clickthrough');

  if (typeof playerHandles !== 'boolean') {
    return;
  }

  if (!playerHandles) {
    return;
  } else {
    var destUrl;

    if (url) {
      destUrl = url;
    } else if (this.creative.clickThroughUrl) {
      destUrl = this.creative.clickThroughUrl;
    }

    if (destUrl) {
      // for getClickThroughUrl API method
      this.creative.clickThroughUrl = destUrl;
      FW.openWindow(this.creative.clickThroughUrl);
    }
  }
};

var _onAdPaused = function _onAdPaused() {
  this.vpaidPaused = true;
  Utils.createApiEvent.call(this, 'adpaused');
  tracking_events.dispatch.call(this, 'pause');
};

var _onAdPlaying = function _onAdPlaying() {
  this.vpaidPaused = false;
  Utils.createApiEvent.call(this, 'adresumed');
  tracking_events.dispatch.call(this, 'resume');
};

var _onAdLog = function _onAdLog(message) {
  console.log("".concat(FW.consolePrepend, " VPAID AdLog event ").concat(message), FW.consoleStyle, '');
};

var _onAdError = function _onAdError(message) {
  console.log("".concat(FW.consolePrepend, " VPAID AdError event ").concat(message), FW.consoleStyle, '');
  Utils.processVastErrors.call(this, 901, true);
};

var _onAdInteraction = function _onAdInteraction() {
  Utils.createApiEvent.call(this, 'adinteraction');
};

var _onAdUserAcceptInvitation = function _onAdUserAcceptInvitation() {
  Utils.createApiEvent.call(this, 'aduseracceptinvitation');
  tracking_events.dispatch.call(this, 'acceptInvitation');
};

var _onAdUserMinimize = function _onAdUserMinimize() {
  Utils.createApiEvent.call(this, 'adcollapse');
  tracking_events.dispatch.call(this, ['collapse', 'adCollapse']);
};

var _onAdUserClose = function _onAdUserClose() {
  Utils.createApiEvent.call(this, 'adclosed');
  tracking_events.dispatch.call(this, 'close');
};

var _onAdSizeChange = function _onAdSizeChange() {
  Utils.createApiEvent.call(this, 'adsizechange');
};

var _onAdLinearChange = function _onAdLinearChange() {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdLinear === 'function') {
    this.creative.isLinear = this.vpaidCreative.getAdLinear();
    Utils.createApiEvent.call(this, 'adlinearchange');
  }
};

var _onAdExpandedChange = function _onAdExpandedChange() {
  Utils.createApiEvent.call(this, 'adexpandedchange');
};

var _onAdRemainingTimeChange = function _onAdRemainingTimeChange() {
  if (!this.vpaidCreative && typeof this.vpaidCreative.getAdRemainingTime === 'function') {
    var remainingTime = this.vpaidCreative.getAdRemainingTime();

    if (remainingTime >= 0) {
      this.vpaidRemainingTime = remainingTime;
    }
  }

  Utils.createApiEvent.call(this, 'adremainingtimechange');
}; // vpaidCreative methods


VPAID.resizeAd = function (width, height, viewMode) {
  if (!this.vpaidCreative) {
    return;
  }

  if (!FW.isNumber(width) || !FW.isNumber(height) || typeof viewMode !== 'string') {
    return;
  }

  if (width <= 0 || height <= 0) {
    return;
  }

  var validViewMode = 'normal';

  if (viewMode === 'fullscreen') {
    validViewMode = viewMode;
  }

  console.log("".concat(FW.consolePrepend, " VPAID resizeAd with width ").concat(width, ", height ").concat(height, ", viewMode ").concat(viewMode), FW.consoleStyle, '');
  this.vpaidCreative.resizeAd(width, height, validViewMode);
};

VPAID.stopAd = function () {
  var _this2 = this;

  if (!this.vpaidCreative) {
    return;
  }

  console.log("".concat(FW.consolePrepend, " stopAd"), FW.consoleStyle, ''); // when stopAd is called we need to check a 
  // AdStopped event follows

  this.adStoppedTimeout = setTimeout(function () {
    _onAdStopped.call(_this2);
  }, this.params.creativeLoadTimeout);
  this.vpaidCreative.stopAd();
};

VPAID.pauseAd = function () {
  console.log("".concat(FW.consolePrepend, " pauseAd"), FW.consoleStyle, '');

  if (this.vpaidCreative && !this.vpaidPaused) {
    this.vpaidCreative.pauseAd();
  }
};

VPAID.resumeAd = function () {
  console.log("".concat(FW.consolePrepend, " resumeAd"), FW.consoleStyle, '');

  if (this.vpaidCreative && this.vpaidPaused) {
    this.vpaidCreative.resumeAd();
  }
};

VPAID.expandAd = function () {
  if (this.vpaidCreative) {
    this.vpaidCreative.expandAd();
  }
};

VPAID.collapseAd = function () {
  if (this.vpaidCreative) {
    this.vpaidCreative.collapseAd();
  }
};

VPAID.skipAd = function () {
  var _this3 = this;

  if (!this.vpaidCreative) {
    return;
  } // when skipAd is called we need to check a 
  // AdSkipped event follows


  this.adSkippedTimeout = setTimeout(function () {
    _onAdStopped.call(_this3);
  }, this.params.creativeLoadTimeout);
  this.vpaidCreative.skipAd();
};

VPAID.setAdVolume = function (volume) {
  if (this.vpaidCreative && FW.isNumber(volume) && volume >= 0 && volume <= 1 && typeof this.vpaidCreative.setAdVolume === 'function') {
    this.vpaidCreative.setAdVolume(volume);
  }
};

var _setCallbacksForCreative = function _setCallbacksForCreative() {
  var _this4 = this;

  if (!this.vpaidCreative) {
    return;
  }

  this.vpaidCallbacks = {
    AdLoaded: _onAdLoaded.bind(this),
    AdStarted: _onAdStarted.bind(this),
    AdStopped: _onAdStopped.bind(this),
    AdSkipped: _onAdSkipped.bind(this),
    AdSkippableStateChange: _onAdSkippableStateChange.bind(this),
    AdDurationChange: _onAdDurationChange.bind(this),
    AdVolumeChange: _onAdVolumeChange.bind(this),
    AdImpression: _onAdImpression.bind(this),
    AdVideoStart: _onAdVideoStart.bind(this),
    AdVideoFirstQuartile: _onAdVideoFirstQuartile.bind(this),
    AdVideoMidpoint: _onAdVideoMidpoint.bind(this),
    AdVideoThirdQuartile: _onAdVideoThirdQuartile.bind(this),
    AdVideoComplete: _onAdVideoComplete.bind(this),
    AdClickThru: _onAdClickThru.bind(this),
    AdPaused: _onAdPaused.bind(this),
    AdPlaying: _onAdPlaying.bind(this),
    AdLog: _onAdLog.bind(this),
    AdError: _onAdError.bind(this),
    AdInteraction: _onAdInteraction.bind(this),
    AdUserAcceptInvitation: _onAdUserAcceptInvitation.bind(this),
    AdUserMinimize: _onAdUserMinimize.bind(this),
    AdUserClose: _onAdUserClose.bind(this),
    AdSizeChange: _onAdSizeChange.bind(this),
    AdLinearChange: _onAdLinearChange.bind(this),
    AdExpandedChange: _onAdExpandedChange.bind(this),
    AdRemainingTimeChange: _onAdRemainingTimeChange.bind(this)
  }; // Looping through the object and registering each of the callbacks with the creative

  var callbacksKeys = Object.keys(this.vpaidCallbacks);
  callbacksKeys.forEach(function (key) {
    _this4.vpaidCreative.subscribe(_this4.vpaidCallbacks[key], key);
  });
};

var _unsetCallbacksForCreative = function _unsetCallbacksForCreative() {
  var _this5 = this;

  if (!this.vpaidCreative) {
    return;
  } // Looping through the object and registering each of the callbacks with the creative


  var callbacksKeys = Object.keys(this.vpaidCallbacks);
  callbacksKeys.forEach(function (key) {
    _this5.vpaidCreative.unsubscribe(_this5.vpaidCallbacks[key], key);
  });
};

var _isValidVPAID = function _isValidVPAID(creative) {
  if (typeof creative.initAd === 'function' && typeof creative.startAd === 'function' && typeof creative.stopAd === 'function' && typeof creative.skipAd === 'function' && typeof creative.resizeAd === 'function' && typeof creative.pauseAd === 'function' && typeof creative.resumeAd === 'function' && typeof creative.expandAd === 'function' && typeof creative.collapseAd === 'function' && typeof creative.subscribe === 'function' && typeof creative.unsubscribe === 'function') {
    return true;
  }

  return false;
};

var _onVPAIDAvailable = function _onVPAIDAvailable() {
  var _this6 = this;

  if (this.vpaidAvailableInterval) {
    clearInterval(this.vpaidAvailableInterval);
  }

  if (this.vpaidLoadTimeout) {
    clearTimeout(this.vpaidLoadTimeout);
  }

  this.vpaidCreative = this.vpaidIframe.contentWindow.getVPAIDAd();

  if (this.vpaidCreative && typeof this.vpaidCreative.handshakeVersion === 'function') {
    // we need to insure handshakeVersion return
    var vpaidVersion;

    try {
      vpaidVersion = this.vpaidCreative.handshakeVersion('2.0');
    } catch (error) {
      console.warn(error);
      console.log("".concat(FW.consolePrepend, " could not validate VPAID ad unit handshakeVersion"), FW.consoleStyle, '');
      Utils.processVastErrors.call(this, 901, true);
      return;
    }

    this.vpaidVersion = parseInt(vpaidVersion);

    if (this.vpaidVersion < 1) {
      console.log("".concat(FW.consolePrepend, " unsupported VPAID version - exit"), FW.consoleStyle, '');
      Utils.processVastErrors.call(this, 901, true);
      return;
    }

    if (!_isValidVPAID(this.vpaidCreative)) {
      //The VPAID creative doesn't conform to the VPAID spec
      console.log("".concat(FW.consolePrepend, " VPAID creative does not conform to VPAID spec - exit"), FW.consoleStyle, '');
      Utils.processVastErrors.call(this, 901, true);
      return;
    } // wire callback for VPAID events


    _setCallbacksForCreative.call(this); // wire tracking events for VAST pings


    tracking_events.wire.call(this);
    var creativeData = {};
    creativeData.AdParameters = this.adParametersData;
    console.log("".concat(FW.consolePrepend, " VPAID AdParameters follow"), FW.consoleStyle, '');
    console.dir(this.adParametersData);
    FW.show(this.adContainer);
    FW.show(this.vastPlayer);
    var environmentVars = {}; // we create a new slot for VPAID creative - using adContainer can cause some VPAID to ill-render
    // from spec:
    // The 'environmentVars' object contains a reference, 'slot', to the HTML element
    // on the page in which the ad is to be rendered. The ad unit essentially gets
    // control of that element. 

    this.vpaidSlot = document.createElement('div');
    this.vpaidSlot.className = 'rmp-vpaid-container';
    this.adContainer.appendChild(this.vpaidSlot);
    environmentVars.slot = this.vpaidSlot;
    environmentVars.videoSlot = this.vastPlayer; // we assume we can autoplay (or at least muted autoplay) because this.vastPlayer 
    // has been init

    environmentVars.videoSlotCanAutoPlay = true; // when we call initAd we expect AdLoaded event to follow closely
    // if not we need to resume content

    this.initAdTimeout = setTimeout(function () {
      if (!_this6.vpaidAdLoaded) {
        console.log("".concat(FW.consolePrepend, " initAdTimeout"), FW.consoleStyle, '');
        vast_player.resumeContent.call(_this6);
      }

      _this6.vpaidAdLoaded = false;
    }, this.params.creativeLoadTimeout * 10);
    console.log("".concat(FW.consolePrepend, " calling initAd on VPAID creative now"), FW.consoleStyle, '');
    this.vpaidCreative.initAd(this.initialWidth, this.initialHeight, this.initialViewMode, this.desiredBitrate, creativeData, environmentVars);
  }
};

var _onJSVPAIDLoaded = function _onJSVPAIDLoaded() {
  var _this7 = this;

  console.log("".concat(FW.consolePrepend, " VPAID JS loaded"), FW.consoleStyle, '');
  var iframeWindow = this.vpaidIframe.contentWindow;

  if (typeof iframeWindow.getVPAIDAd === 'function') {
    _onVPAIDAvailable.call(this);
  } else {
    this.vpaidAvailableInterval = setInterval(function () {
      if (typeof iframeWindow.getVPAIDAd === 'function') {
        _onVPAIDAvailable.call(_this7);
      }
    }, 100);
  }

  this.vpaidScript.onload = null;
  this.vpaidScript.onerror = null;
};

var _onJSVPAIDError = function _onJSVPAIDError() {
  console.log("".concat(FW.consolePrepend, " VPAID JS error loading"), FW.consoleStyle, '');
  Utils.processVastErrors.call(this, 901, true);
  this.vpaidScript.onload = null;
  this.vpaidScript.onerror = null;
};

VPAID.loadCreative = function (creativeUrl, vpaidSettings) {
  this.initialWidth = vpaidSettings.width;
  this.initialHeight = vpaidSettings.height;
  this.initialViewMode = vpaidSettings.viewMode;
  this.desiredBitrate = vpaidSettings.desiredBitrate;
  this.vpaidCreativeUrl = creativeUrl;

  if (!this.vastPlayer) {
    if (this.useContentPlayerForAds) {
      this.vastPlayer = this.contentPlayer;
    } else {
      // we use existing rmp-ad-vast-video-player as it is already 
      // available and initialized (no need for user interaction)
      var existingVastPlayer = this.adContainer.querySelector('.rmp-ad-vast-video-player');

      if (existingVastPlayer === null) {
        Utils.processVastErrors.call(this, 900, true);
        return;
      }

      this.vastPlayer = existingVastPlayer;
    }
  } // create FiF 


  this.vpaidIframe = document.createElement('iframe');
  this.vpaidIframe.sandbox = 'allow-scripts allow-same-origin';
  this.vpaidIframe.id = 'vpaid-frame'; // do not use display: none;
  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397

  FW.setStyle(this.vpaidIframe, {
    visibility: 'hidden',
    width: '0px',
    height: '0px',
    border: 'none'
  }); // this is to adhere to Best Practices for Rich Media Ads 
  // in Asynchronous Ad Environments  http://www.iab.net/media/file/rich_media_ajax_best_practices.pdf

  var src = 'about:blank'; // ... however this does not work in Firefox (onload is never reached)
  // https://bugzilla.mozilla.org/show_bug.cgi?id=444165
  // about:self also causes protocol mis-match issues with iframes in iOS/macOS Safari
  // ... TL;DR iframes are troubles
  //let src = 'about:self';

  /*if (ENV.isFirefox || this.useContentPlayerForAds) {
    src = '';
  }*/
  // see https://bugs.chromium.org/p/chromium/issues/detail?id=1220186 about:self no longer works
  // we use about:blank instead but this is still under review
  // since about:blank seems to work in our testing cross browsers and is what is 
  // recommended on the web 
  // (see https://stackoverflow.com/questions/5946607/is-an-empty-iframe-src-valid/5946631) we now use about:blank

  this.vpaidIframe.onload = function () {
    var _this8 = this;

    console.log("".concat(FW.consolePrepend, " vpaidIframe.onload"), FW.consoleStyle, ''); // we unwire listeners

    this.vpaidIframe.onload = this.vpaidIframe.onerror = FW.nullFn;

    if (!this.vpaidIframe.contentWindow || !this.vpaidIframe.contentWindow.document || !this.vpaidIframe.contentWindow.document.body) {
      // PING error and resume content
      Utils.processVastErrors.call(this, 901, true);
      return;
    }

    var iframeWindow = this.vpaidIframe.contentWindow;
    var iframeDocument = iframeWindow.document;
    var iframeBody = iframeDocument.body;
    this.vpaidScript = iframeDocument.createElement('script');
    this.vpaidLoadTimeout = setTimeout(function () {
      console.log("".concat(FW.consolePrepend, " could not load VPAID JS Creative or getVPAIDAd in iframeWindow - resume content"), FW.consoleStyle, '');
      _this8.vpaidScript.onload = null;
      _this8.vpaidScript.onerror = null;
      vast_player.resumeContent.call(_this8);
    }, this.params.creativeLoadTimeout);
    this.vpaidScript.onload = _onJSVPAIDLoaded.bind(this);
    this.vpaidScript.onerror = _onJSVPAIDError.bind(this);
    iframeBody.appendChild(this.vpaidScript);
    this.vpaidScript.src = this.vpaidCreativeUrl;
  }.bind(this);

  this.vpaidIframe.onerror = function () {
    console.log("".concat(FW.consolePrepend, " vpaidIframe.onerror"), FW.consoleStyle, ''); // we unwire listeners

    this.vpaidIframe.onload = this.vpaidIframe.onerror = FW.nullFn; // PING error and resume content

    Utils.processVastErrors.call(this, 901, true);
  }.bind(this);

  this.vpaidIframe.src = src;
  this.adContainer.appendChild(this.vpaidIframe);
};

VPAID.destroy = function () {
  console.log("".concat(FW.consolePrepend, " destroy VPAID dependencies"), FW.consoleStyle, '');

  if (this.vpaidAvailableInterval) {
    clearInterval(this.vpaidAvailableInterval);
  }

  if (this.vpaidLoadTimeout) {
    clearTimeout(this.vpaidLoadTimeout);
  }

  if (this.initAdTimeout) {
    clearTimeout(this.initAdTimeout);
  }

  if (this.startAdTimeout) {
    clearTimeout(this.startAdTimeout);
  }

  _unsetCallbacksForCreative.call(this);

  if (this.vpaidScript) {
    this.vpaidScript.onload = null;
    this.vpaidScript.onerror = null;
  }

  if (this.vpaidSlot) {
    FW.removeElement(this.vpaidSlot);
  }

  if (this.vpaidIframe) {
    FW.removeElement(this.vpaidIframe);
  }
};

/* harmony default export */ var vpaid = (VPAID);
;// CONCATENATED MODULE: ./src/js/creatives/non-linear.js










var NON_LINEAR = {};

var _onNonLinearLoadError = function _onNonLinearLoadError() {
  Utils.processVastErrors.call(this, 502, true);
};

var _onNonLinearLoadSuccess = function _onNonLinearLoadSuccess() {
  console.log("".concat(FW.consolePrepend, " success loading non-linear creative at ").concat(this.creative.mediaUrl), FW.consoleStyle, '');
  this.adOnStage = true;
  Utils.createApiEvent.call(this, ['adloaded', 'adimpression', 'adstarted']);
  tracking_events.dispatch.call(this, ['impression', 'creativeView', 'start', 'loaded']);
};

var _onNonLinearClickThrough = function _onNonLinearClickThrough(event) {
  try {
    if (event) {
      event.stopPropagation();
    }

    this.pause();
    Utils.createApiEvent.call(this, 'adclick');
    tracking_events.dispatch.call(this, 'clickthrough');
  } catch (e) {
    console.warn(e);
  }
};

var _onClickCloseNonLinear = function _onClickCloseNonLinear(event) {
  if (event) {
    event.stopPropagation();

    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }

  FW.setStyle(this.nonLinearContainer, {
    display: 'none'
  });
  Utils.createApiEvent.call(this, 'adclosed');
  tracking_events.dispatch.call(this, 'close');
};

var _appendCloseButton = function _appendCloseButton() {
  var _this = this;

  this.nonLinearClose = document.createElement('div');
  this.nonLinearClose.className = 'rmp-ad-non-linear-close';
  Utils.makeButtonAccessible(this.nonLinearClose, this.params.labels.closeAd);

  if (this.nonLinearMinSuggestedDuration > 0) {
    FW.setStyle(this.nonLinearClose, {
      display: 'none'
    });
    setTimeout(function () {
      FW.setStyle(_this.nonLinearClose, {
        display: 'block'
      });
    }, this.nonLinearMinSuggestedDuration * 1000);
  } else {
    FW.setStyle(this.nonLinearClose, {
      display: 'block'
    });
  }

  this.onClickCloseNonLinear = _onClickCloseNonLinear.bind(this);
  this.nonLinearClose.addEventListener('touchend', this.onClickCloseNonLinear);
  this.nonLinearClose.addEventListener('click', this.onClickCloseNonLinear);
  this.nonLinearContainer.appendChild(this.nonLinearClose);
};

NON_LINEAR.update = function () {
  // non-linear ad container
  this.nonLinearContainer = document.createElement('div');
  this.nonLinearContainer.className = 'rmp-ad-non-linear-container';
  FW.setStyle(this.nonLinearContainer, {
    width: this.creative.width.toString() + 'px',
    height: this.creative.height.toString() + 'px'
  }); // a tag to handle click - a tag is best for WebView support

  this.nonLinearATag = document.createElement('a');
  this.nonLinearATag.className = 'rmp-ad-non-linear-anchor';

  if (this.creative.clickThroughUrl) {
    this.nonLinearATag.href = this.creative.clickThroughUrl;
    this.nonLinearATag.target = '_blank';
    this.onNonLinearClickThrough = _onNonLinearClickThrough.bind(this);

    if (ENV.isMobile) {
      this.nonLinearATag.addEventListener('touchend', this.onNonLinearClickThrough);
    } else {
      this.nonLinearATag.addEventListener('click', this.onNonLinearClickThrough);
    }
  } // non-linear creative image


  if (this.creative.nonLinearType === 'image') {
    this.nonLinearInnerElement = document.createElement('img');
  } else {
    this.nonLinearInnerElement = document.createElement('iframe');
    this.nonLinearInnerElement.sandbox = 'allow-scripts allow-same-origin';
    FW.setStyle(this.nonLinearInnerElement, {
      border: 'none',
      overflow: 'hidden'
    });
    this.nonLinearInnerElement.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; xr-spatial-tracking; encrypted-media');
    this.nonLinearInnerElement.setAttribute('scrolling', 'no');
    this.nonLinearInnerElement.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
  }

  this.nonLinearInnerElement.className = 'rmp-ad-non-linear-creative';
  this.onNonLinearLoadError = _onNonLinearLoadError.bind(this);
  this.nonLinearInnerElement.addEventListener('error', this.onNonLinearLoadError);
  this.onNonLinearLoadSuccess = _onNonLinearLoadSuccess.bind(this);
  this.nonLinearInnerElement.addEventListener('load', this.onNonLinearLoadSuccess);

  if (this.creative.nonLinearType === 'html') {
    this.nonLinearInnerElement.srcdoc = this.creative.mediaUrl;
  } else {
    this.nonLinearInnerElement.src = this.creative.mediaUrl;
  } // append to adContainer


  this.nonLinearATag.appendChild(this.nonLinearInnerElement);
  this.nonLinearContainer.appendChild(this.nonLinearATag);
  this.adContainer.appendChild(this.nonLinearContainer); // display a close button when non-linear ad has reached minSuggestedDuration

  _appendCloseButton.call(this);

  FW.show(this.adContainer);
  content_player.play.call(this, this.firstContentPlayerPlayRequest);

  if (this.firstContentPlayerPlayRequest) {
    this.firstContentPlayerPlayRequest = false;
  }
};

NON_LINEAR.parse = function (variations) {
  var _this2 = this;

  console.log("".concat(FW.consolePrepend, " non-linear creatives follow"), FW.consoleStyle, '');
  console.dir(variations);
  var isDimensionError = false;
  var currentVariation; // The video player should poll each <NonLinear> element to determine 
  // which creative is offered in a format the video player can support.

  for (var i = 0; i < variations.length; i++) {
    isDimensionError = false;
    currentVariation = variations[i];
    var width = currentVariation.width;
    var height = currentVariation.height; // width/height attribute is required

    if (width <= 0) {
      width = 300;
    }

    if (height <= 0) {
      height = 44;
    } // if width of non-linear creative does not fit within current player container width 
    // we should skip this creative


    if (width > FW.getWidth(this.container) || height > FW.getHeight(this.container)) {
      isDimensionError = true;
      continue;
    } // get minSuggestedDuration (optional)


    this.nonLinearMinSuggestedDuration = currentVariation.minSuggestedDuration;
    var staticResource = currentVariation.staticResource;
    var iframeResource = currentVariation.iframeResource;
    var htmlResource = currentVariation.htmlResource; // we have a valid NonLinear/StaticResource with supported creativeType - we break

    if (staticResource !== null || iframeResource !== null || htmlResource !== null) {
      if (staticResource) {
        this.creative.mediaUrl = staticResource;
        this.creative.nonLinearType = 'image';
      } else if (iframeResource) {
        this.creative.mediaUrl = iframeResource;
        this.creative.nonLinearType = 'iframe';
      } else if (htmlResource) {
        this.creative.mediaUrl = htmlResource;
        this.creative.nonLinearType = 'html';
      }

      this.creative.width = width;
      this.creative.height = height;
      this.creative.type = currentVariation.type;
      console.log("".concat(FW.consolePrepend, " selected non-linear creative"), FW.consoleStyle, '');
      console.dir(this.creative);
      break;
    }
  } // if not supported NonLinear type ping for error


  if (!this.creative.mediaUrl || isDimensionError) {
    var vastErrorCode = 503;

    if (isDimensionError) {
      vastErrorCode = 501;
    }

    Utils.processVastErrors.call(this, vastErrorCode, true);
    return;
  }

  this.creative.clickThroughUrl = currentVariation.nonlinearClickThroughURLTemplate;

  if (currentVariation.nonlinearClickTrackingURLTemplates.length > 0) {
    currentVariation.nonlinearClickTrackingURLTemplates.forEach(function (nonlinearClickTrackingURLTemplate) {
      if (nonlinearClickTrackingURLTemplate.url) {
        _this2.trackingTags.push({
          event: 'clickthrough',
          url: nonlinearClickTrackingURLTemplate.url
        });
      }
    });
  }

  vast_player.append.call(this);
};

/* harmony default export */ var non_linear = (NON_LINEAR);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.split.js
var es_string_split = __webpack_require__(3123);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.sort.js
var es_array_sort = __webpack_require__(2707);
;// CONCATENATED MODULE: ./src/assets/rmp-connection/rmp-connection.js
function rmp_connection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function rmp_connection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function rmp_connection_createClass(Constructor, protoProps, staticProps) { if (protoProps) rmp_connection_defineProperties(Constructor.prototype, protoProps); if (staticProps) rmp_connection_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * @license Copyright (c) 2015-2021 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-connection 1.0.0 | https://github.com/radiantmediaplayer/rmp-connection
 * rmp-connection is released under MIT | https://github.com/radiantmediaplayer/rmp-connection/blob/master/LICENSE
 */

/**
 * The class to instantiate RmpConnection
 * @export
 * @class RmpConnection
*/
var RmpConnection = /*#__PURE__*/function () {
  /**
    * @constructor
    */
  function RmpConnection() {
    rmp_connection_classCallCheck(this, RmpConnection);

    this.connectionType = '';
  }
  /** 
    * @private
    */


  rmp_connection_createClass(RmpConnection, [{
    key: "_getConnectionType",
    value: function _getConnectionType() {
      if (typeof navigator.connection.type === 'string' && navigator.connection.type !== '') {
        return navigator.connection.type;
      }

      return '';
    }
    /** 
     * @return {number}
     */

  }, {
    key: "getBandwidthEstimate",
    value: function getBandwidthEstimate() {
      // we are not in a supported environment - exit
      if (typeof window === 'undefined') {
        return -1;
      } // we are offline - exit


      if (typeof navigator.onLine !== 'undefined' && !navigator.onLine) {
        return -1;
      } // we do not have navigator.connection - exit
      // for support see https://caniuse.com/#feat=netinfo


      if (typeof navigator.connection === 'undefined') {
        return -1;
      }

      this.connectionType = this._getConnectionType(); // we do have navigator.connection.type but it reports no connection - exit

      if (this.connectionType && this.connectionType === 'none') {
        return -1;
      } // we have navigator.connection.downlink - this is our best estimate
      // Returns the effective bandwidth estimate in megabits per second, rounded to the nearest multiple of 25 kilobits per seconds.


      if (typeof navigator.connection.downlink === 'number' && navigator.connection.downlink > 0) {
        return navigator.connection.downlink;
      } // we have navigator.connection.effectiveType - this is our second best estimate
      // we actually have indication here: http://wicg.github.io/netinfo/#effective-connection-types


      if (typeof navigator.connection.effectiveType === 'string' && navigator.connection.effectiveType !== '') {
        switch (navigator.connection.effectiveType) {
          case 'slow-2g':
            return 0.025;

          case '2g':
            return 0.035;

          case '3g':
            return 0.35;

          case '4g':
            return 0.7;

          case '5g':
            return 1.05;

          default:
            break;
        }
      } // finally we have navigator.connection.type - this won't help much 


      if (this.connectionType) {
        switch (this.connectionType) {
          case 'ethernet':
            return 1.05;

          case 'wifi':
          case 'wimax':
            return 0.7;

          case 'bluetooth':
            return 0.35;

          default:
            break;
        } // there is no point in guessing bandwidth when navigator.connection.type is cellular this can vary from 0 to 100 Mbps 
        // better to admit we do not know and find another way to detect bandwidth, this could include:
        // - context guess: user-agent detection (mobile vs desktop), device width or pixel ratio 
        // - AJAX/Fetch timing: this is outside rmp-connection scope

      } // nothing worked - exit


      return -1;
    }
  }]);

  return RmpConnection;
}();


;// CONCATENATED MODULE: ./src/js/creatives/linear.js




















var LINEAR = {};
var VPAID_PATTERN = /vpaid/i;
var JS_PATTERN = /\/javascript/i;
var HTML5_MEDIA_ERROR_TYPES = ['MEDIA_ERR_CUSTOM', 'MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED', 'MEDIA_ERR_ENCRYPTED'];
var COMMON_VIDEO_FORMATS = ['video/webm', 'video/mp4', 'video/ogg', 'video/3gpp'];

var _onDurationChange = function _onDurationChange() {
  var _this = this;

  this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
  this.vastPlayerDuration = vast_player.getDuration.call(this);
  Utils.createApiEvent.call(this, 'addurationchange'); // progress event

  if (this.vastPlayerDuration === -1) {
    return;
  }

  var keys = Object.keys(this.creative.trackingEvents);
  keys.forEach(function (eventName) {
    if (/progress-/i.test(eventName)) {
      var time = eventName.split('-');
      var time_2 = time[1];

      if (/%/i.test(time_2)) {
        var timePerCent = time_2.slice(0, -1);
        timePerCent = _this.vastPlayerDuration * parseFloat(timePerCent) / 100;
        var trackingUrls = _this.creative.trackingEvents[eventName];
        trackingUrls.forEach(function (url) {
          _this.progressEvents.push({
            time: timePerCent,
            url: url
          });
        });
      } else {
        var _trackingUrls = _this.creative.trackingEvents[eventName];

        _trackingUrls.forEach(function (url) {
          _this.progressEvents.push({
            time: parseFloat(time_2) * 1000,
            url: url
          });
        });
      }
    }
  }); // sort progress time ascending

  if (this.progressEvents.length > 0) {
    this.progressEvents.sort(function (a, b) {
      return a.time - b.time;
    });
  }
};

var _onLoadedmetadataPlay = function _onLoadedmetadataPlay() {
  this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
  clearTimeout(this.creativeLoadTimeoutCallback);
  Utils.createApiEvent.call(this, 'adloaded');
  tracking_events.dispatch.call(this, 'loaded');
  content_player.pause.call(this); // adjust volume to make sure content player volume matches vast player volume

  if (this.vastPlayer.volume !== this.contentPlayer.volume) {
    this.vastPlayer.volume = this.contentPlayer.volume;
  }

  if (this.contentPlayer.muted) {
    this.vastPlayer.muted = true;
  } else {
    this.vastPlayer.muted = false;
  } // show ad container holding vast player


  FW.show(this.adContainer);
  FW.show(this.vastPlayer);
  this.adOnStage = true; // play VAST player

  vast_player.play.call(this, this.firstVastPlayerPlayRequest);

  if (this.firstVastPlayerPlayRequest) {
    this.firstVastPlayerPlayRequest = false;
  }
};

var _onClickThrough = function _onClickThrough(event) {
  if (event) {
    event.stopPropagation();
  }

  if (!ENV.isMobile) {
    console.log("".concat(FW.consolePrepend, " Opening clickthrough URL at ").concat(this.creative.clickThroughUrl), FW.consoleStyle, '');
    FW.openWindow(this.creative.clickThroughUrl);
  }

  this.pause();
  Utils.createApiEvent.call(this, 'adclick');
  tracking_events.dispatch.call(this, 'clickthrough');
};

var _onPlaybackError = function _onPlaybackError(event) {
  // https://www.w3.org/TR/html50/embedded-content-0.html#mediaerror
  // MEDIA_ERR_SRC_NOT_SUPPORTED is sign of fatal error
  // other errors may produce non-fatal error in the browser so we do not 
  // act upon them
  if (event && event.target) {
    var videoElement = event.target;

    if (videoElement.error && FW.isNumber(videoElement.error.code)) {
      var errorCode = videoElement.error.code;
      var errorMessage = '';

      if (typeof videoElement.error.message === 'string') {
        errorMessage = videoElement.error.message;
      }

      console.log("".concat(FW.consolePrepend, " Error on video element with code ").concat(errorCode.toString(), " and message ").concat(errorMessage), FW.consoleStyle, '');
      console.log("".concat(FW.consolePrepend, " error type is ").concat(HTML5_MEDIA_ERROR_TYPES[errorCode] ? HTML5_MEDIA_ERROR_TYPES[errorCode] : 'unknown type'), FW.consoleStyle, ''); // EDIA_ERR_SRC_NOT_SUPPORTED (numeric value 4)

      if (errorCode === 4) {
        Utils.processVastErrors.call(this, 401, true);
      }
    }
  }
};

var _appendClickUIOnMobile = function _appendClickUIOnMobile() {
  // we create a <a> tag rather than using window.open 
  // because it works better in standalone mode and WebView
  this.clickUIOnMobile = document.createElement('a');
  this.clickUIOnMobile.className = 'rmp-ad-click-ui-mobile';
  this.clickUIOnMobile.textContent = this.params.labels.textForClickUIOnMobile;
  this.clickUIOnMobile.addEventListener('touchend', this.onClickThrough);
  this.clickUIOnMobile.href = this.creative.clickThroughUrl;
  this.clickUIOnMobile.target = '_blank';
  this.adContainer.appendChild(this.clickUIOnMobile);
};

var _onContextMenu = function _onContextMenu(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
};

var _setCanBeSkippedUI = function _setCanBeSkippedUI() {
  FW.setStyle(this.skipWaiting, {
    display: 'none'
  });
  FW.setStyle(this.skipMessage, {
    display: 'block'
  });
  FW.setStyle(this.skipIcon, {
    display: 'block'
  });
};

var _updateWaitingForCanBeSkippedUI = function _updateWaitingForCanBeSkippedUI(delta) {
  if (Math.round(delta) > 0) {
    this.skipWaiting.textContent = this.params.labels.skipMessage + ' ' + Math.round(delta) + 's';
  }
};

var _onTimeupdateCheckSkip = function _onTimeupdateCheckSkip() {
  if (this.skipButton.style.display === 'none') {
    FW.setStyle(this.skipButton, {
      display: 'block'
    });
  }

  this.vastPlayerCurrentTime = this.vastPlayer.currentTime;

  if (FW.isNumber(this.vastPlayerCurrentTime) && this.vastPlayerCurrentTime > 0) {
    if (this.vastPlayerCurrentTime >= this.creative.skipoffset) {
      this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);

      _setCanBeSkippedUI.call(this);

      this.skippableAdCanBeSkipped = true;
      Utils.createApiEvent.call(this, 'adskippablestatechanged');
    } else if (this.creative.skipoffset - this.vastPlayerCurrentTime > 0) {
      _updateWaitingForCanBeSkippedUI.call(this, this.creative.skipoffset - this.vastPlayerCurrentTime);
    }
  }
};

var _onClickSkip = function _onClickSkip(event) {
  if (event) {
    event.stopPropagation();

    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }

  if (this.skippableAdCanBeSkipped) {
    // create API event 
    Utils.createApiEvent.call(this, 'adskipped'); // request ping for skip event

    tracking_events.dispatch.call(this, 'skip'); // resume content

    vast_player.resumeContent.call(this);
  }
};

var _appendSkip = function _appendSkip() {
  this.skipButton = document.createElement('div');
  this.skipButton.className = 'rmp-ad-container-skip';
  FW.setStyle(this.skipButton, {
    display: 'none'
  });
  Utils.makeButtonAccessible(this.skipButton, this.params.labels.skipMessage);
  this.skipWaiting = document.createElement('div');
  this.skipWaiting.className = 'rmp-ad-container-skip-waiting';

  _updateWaitingForCanBeSkippedUI.call(this, this.creative.skipoffset);

  FW.setStyle(this.skipWaiting, {
    display: 'block'
  });
  this.skipMessage = document.createElement('div');
  this.skipMessage.className = 'rmp-ad-container-skip-message';
  this.skipMessage.textContent = this.params.labels.skipMessage;
  FW.setStyle(this.skipMessage, {
    display: 'none'
  });
  this.skipIcon = document.createElement('div');
  this.skipIcon.className = 'rmp-ad-container-skip-icon';
  FW.setStyle(this.skipIcon, {
    display: 'none'
  });
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

var _onHlsJSError = function _onHlsJSError(event, data) {
  if (data.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        // try to recover network error
        this.hlsJS[this.hlsJSIndex].startLoad();
        break;

      case Hls.ErrorTypes.MEDIA_ERROR:
        this.hlsJS[this.hlsJSIndex].recoverMediaError();
        break;

      default:
        Utils.processVastErrors.call(this, 900, true);
        break;
    }
  }
};

LINEAR.update = function (url, type) {
  var _this2 = this;

  console.log("".concat(FW.consolePrepend, " update vast player for linear creative of type ").concat(type, " located at ").concat(url), FW.consoleStyle, '');
  this.onDurationChange = _onDurationChange.bind(this);
  this.vastPlayer.addEventListener('durationchange', this.onDurationChange); // when creative is loaded play it 

  this.onLoadedmetadataPlay = _onLoadedmetadataPlay.bind(this);
  this.vastPlayer.addEventListener('loadedmetadata', this.onLoadedmetadataPlay); // prevent built in menu to show on right click

  this.onContextMenu = _onContextMenu.bind(this);
  this.vastPlayer.addEventListener('contextmenu', this.onContextMenu);
  this.onPlaybackError = _onPlaybackError.bind(this); // start creativeLoadTimeout

  this.creativeLoadTimeoutCallback = setTimeout(function () {
    Utils.processVastErrors.call(_this2, 402, true);
  }, this.params.creativeLoadTimeout); // load ad asset

  if (this.useContentPlayerForAds) {
    this.contentPlayer.addEventListener('error', this.onPlaybackError);
    this.contentPlayer.src = url;
  } else {
    if (this.params.useHlsJS && type === 'application/vnd.apple.mpegurl' && typeof window.Hls !== 'undefined' && Hls.isSupported()) {
      this.readingHlsJS = true;
      var hlsJSConfig = {
        autoStartLoad: true,
        debug: this.params.debugHlsJS,
        capLevelToPlayerSize: true,
        testBandwidth: true,
        progressive: false,
        lowLatencyMode: false,
        enableWebVTT: false,
        enableIMSC1: false,
        enableCEA708Captions: false
      };
      this.hlsJS[this.hlsJSIndex] = new Hls(hlsJSConfig);
      this.hlsJS[this.hlsJSIndex].on(Hls.Events.ERROR, _onHlsJSError.bind(this));
      this.hlsJS[this.hlsJSIndex].loadSource(url);
      this.hlsJS[this.hlsJSIndex].attachMedia(this.vastPlayer);
    } else {
      this.vastPlayer.addEventListener('error', this.onPlaybackError);
      this.vastPlayer.src = url; // we need this extra load for Chrome data saver mode in mobile or desktop

      this.vastPlayer.load();
    }
  } // clickthrough interaction


  this.onClickThrough = _onClickThrough.bind(this);

  if (this.creative.clickThroughUrl) {
    if (ENV.isMobile) {
      _appendClickUIOnMobile.call(this);
    } else {
      this.vastPlayer.addEventListener('click', this.onClickThrough);
    }
  } // skippable - only where vast player is different from 
  // content player


  if (this.creative.isSkippableAd) {
    _appendSkip.call(this);
  }
};

LINEAR.parse = function (icons, adParameters, mediaFiles) {
  if (icons.length > 0) {
    creatives_icons.parse.call(this, icons);
  } // check for AdParameters tag in case we have a VPAID creative


  this.adParametersData = '';

  if (adParameters !== null) {
    this.adParametersData = adParameters;
  }

  var mediaFileItems = [];

  for (var i = 0; i < mediaFiles.length; i++) {
    var currentMediaFile = mediaFiles[i];
    var mediaFileValue = currentMediaFile.fileURL;
    var type = currentMediaFile.mimeType;

    if (mediaFileValue === null || type === null) {
      continue;
    }

    var newMediaFileItem = {};
    newMediaFileItem.url = mediaFileValue;
    newMediaFileItem.type = type;

    if (currentMediaFile.codec !== null) {
      newMediaFileItem.codec = currentMediaFile.codec;
    } // check for potential VPAID - we have a VPAID JS - we break
    // for VPAID we may not have a width, height or delivery


    if (this.params.enableVpaid && currentMediaFile.apiFramework && VPAID_PATTERN.test(currentMediaFile.apiFramework) && JS_PATTERN.test(type)) {
      console.log("".concat(FW.consolePrepend, " VPAID creative detected"), FW.consoleStyle, '');
      mediaFileItems = [newMediaFileItem];
      this.isVPAID = true;
      break;
    }

    newMediaFileItem.width = currentMediaFile.width;
    newMediaFileItem.height = currentMediaFile.height;
    newMediaFileItem.bitrate = currentMediaFile.bitrate;
    mediaFileItems.push(newMediaFileItem);
  } // we support HLS; MP4; WebM: VPAID so let us fecth for those


  var creatives = [];

  for (var j = 0; j < mediaFileItems.length; j++) {
    var currentMediaFileItem = mediaFileItems[j];
    var _type = currentMediaFileItem.type;
    var url = currentMediaFileItem.url;

    if (this.isVPAID && url) {
      vpaid.loadCreative.call(this, url, this.params.vpaidSettings);
      this.creative.type = _type;
      return;
    } // we have HLS > use hls.js where no native support for HLS is available or native HLS otherwise (Apple devices mainly)


    if (_type === 'application/vnd.apple.mpegurl' && (ENV.checkCanPlayType(_type) || typeof window.Hls !== 'undefined' && Hls.isSupported())) {
      vast_player.append.call(this, url, _type);
      this.creative.type = _type;
      return;
    } // we have DASH and DASH is natively supported > use DASH


    if (ENV.checkCanPlayType('application/dash+xml')) {
      vast_player.append.call(this, url, _type);
      this.creative.type = _type;
      return;
    } // we gather MP4, WebM, OGG and remaining files


    creatives.push(currentMediaFileItem);
  }

  var retainedCreatives = []; // first we check for the common formats below ... 

  var __filterCommonCreatives = function __filterCommonCreatives(i, creative) {
    if (creative.codec && creative.type === COMMON_VIDEO_FORMATS[i]) {
      return ENV.checkCanPlayType(creative.type, creative.codec);
    } else if (creative.type === COMMON_VIDEO_FORMATS[i]) {
      return ENV.checkCanPlayType(creative.type);
    }

    return false;
  };

  for (var k = 0; k < COMMON_VIDEO_FORMATS.length; k++) {
    retainedCreatives = creatives.filter(__filterCommonCreatives.bind(null, k));

    if (retainedCreatives.length > 0) {
      break;
    }
  } // ... if none of the common format work, then we check for exotic format
  // first we check for those with codec information as it provides more accurate support indication ...


  if (retainedCreatives.length === 0) {
    var __filterCodecCreatives = function __filterCodecCreatives(codec, type, creative) {
      return creative.codec === codec && creative.type === type;
    };

    creatives.forEach(function (creative) {
      if (creative.codec && creative.type && ENV.checkCanPlayType(creative.type, creative.codec)) {
        retainedCreatives = creatives.filter(__filterCodecCreatives.bind(null, creative.codec, creative.type));
      }
    });
  } // ... if codec information are not available then we go first type matching


  if (retainedCreatives.length === 0) {
    var __filterTypeCreatives = function __filterTypeCreatives(type, creative) {
      return creative.type === type;
    };

    creatives.forEach(function (creative) {
      if (creative.type && ENV.checkCanPlayType(creative.type)) {
        retainedCreatives = creatives.filter(__filterTypeCreatives.bind(null, creative.type));
      }
    });
  } // still no match for supported format - we exit


  if (retainedCreatives.length === 0) {
    // None of the MediaFile provided are supported by the player
    Utils.processVastErrors.call(this, 403, true);
    return;
  } // sort supported creatives by width


  retainedCreatives.sort(function (a, b) {
    return a.width - b.width;
  });
  console.log("".concat(FW.consolePrepend, " available linear creative follows"), FW.consoleStyle, '');
  console.dir(retainedCreatives); // we have files matching device capabilities
  // select the best one based on player current width

  var finalCreative;
  var validCreativesByWidth = [];
  var validCreativesByBitrate = [];

  if (retainedCreatives.length > 1) {
    var containerWidth = FW.getWidth(this.container) * ENV.devicePixelRatio;
    var containerHeight = FW.getHeight(this.container) * ENV.devicePixelRatio;

    if (containerWidth > 0 && containerHeight > 0) {
      validCreativesByWidth = retainedCreatives.filter(function (creative) {
        return containerWidth >= creative.width && containerHeight >= creative.height;
      });
    }

    console.log("".concat(FW.consolePrepend, " validCreativesByWidth follow"), FW.consoleStyle, '');
    console.dir(validCreativesByWidth); // if no match by size 

    if (validCreativesByWidth.length === 0) {
      validCreativesByWidth = [retainedCreatives[0]];
    } // filter by bitrate to provide best quality


    var rmpConnection = new RmpConnection();
    var availableBandwidth = rmpConnection.getBandwidthEstimate();
    console.log("".concat(FW.consolePrepend, " availableBandwidth is ").concat(availableBandwidth, " Mbps"), FW.consoleStyle, '');

    if (availableBandwidth > -1 && validCreativesByWidth.length > 1) {
      // sort supported creatives by bitrates
      validCreativesByWidth.sort(function (a, b) {
        return a.bitrate - b.bitrate;
      }); // convert to kbps

      availableBandwidth = Math.round(availableBandwidth * 1000);
      validCreativesByBitrate = validCreativesByWidth.filter(function (creative) {
        return availableBandwidth >= creative.bitrate;
      });
      console.log("".concat(FW.consolePrepend, " validCreativesByBitrate follow"), FW.consoleStyle, '');
      console.dir(validCreativesByBitrate); // pick max available bitrate

      finalCreative = validCreativesByBitrate[validCreativesByBitrate.length - 1];
    }
  } // if no match by bitrate 


  if (!finalCreative) {
    if (validCreativesByWidth.length > 0) {
      finalCreative = validCreativesByWidth[validCreativesByWidth.length - 1];
    } else {
      retainedCreatives.sort(function (a, b) {
        return a.bitrate - b.bitrate;
      });
      finalCreative = retainedCreatives[retainedCreatives.length - 1];
    }
  }

  console.log("".concat(FW.consolePrepend, " selected linear creative follows"), FW.consoleStyle, '');
  console.dir(finalCreative);
  this.creative.mediaUrl = finalCreative.url;
  this.creative.height = finalCreative.height;
  this.creative.width = finalCreative.width;
  this.creative.type = finalCreative.type;
  vast_player.append.call(this, finalCreative.url, finalCreative.type);
};

/* harmony default export */ var linear = (LINEAR);
;// CONCATENATED MODULE: ./src/js/players/vast-player.js












var VAST_PLAYER = {};

var _unwireVastPlayerEvents = function _unwireVastPlayerEvents() {
  var _this = this;

  console.log("".concat(FW.consolePrepend, " reset - unwireVastPlayerEvents"), FW.consoleStyle, '');

  if (this.nonLinearContainer) {
    this.nonLinearInnerElement.removeEventListener('load', this.onNonLinearLoadSuccess);
    this.nonLinearInnerElement.removeEventListener('error', this.onNonLinearLoadError);
    this.nonLinearATag.removeEventListener('click', this.onNonLinearClickThrough);
    this.nonLinearATag.removeEventListener('touchend', this.onNonLinearClickThrough);
    this.nonLinearClose.removeEventListener('click', this.onClickCloseNonLinear);
    this.nonLinearClose.removeEventListener('touchend', this.onClickCloseNonLinear);
    this.trackingTags.forEach(function (trackingTag) {
      _this.nonLinearContainer.removeEventListener(trackingTag.event, _this.onEventPingTracking);
    });
  }

  if (this.vastPlayer) {
    this.vastPlayer.removeEventListener('error', this.onPlaybackError); // vastPlayer content pause/resume events

    this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
    this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
    this.vastPlayer.removeEventListener('contextmenu', this.onContextMenu); // unwire HTML5 video events

    this.vastPlayer.removeEventListener('pause', this.onPause);
    this.vastPlayer.removeEventListener('play', this.onPlay);
    this.vastPlayer.removeEventListener('playing', this.onPlaying);
    this.vastPlayer.removeEventListener('ended', this.onEnded);
    this.vastPlayer.removeEventListener('volumechange', this.onVolumeChange);
    this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdate); // unwire HTML5 VAST events

    this.trackingTags.forEach(function (trackingTag) {
      _this.vastPlayer.removeEventListener(trackingTag.event, _this.onEventPingTracking);
    }); // remove clicktrough handling

    this.vastPlayer.removeEventListener('click', this.onClickThrough);
    this.vastPlayer.removeEventListener('playing', this.onPlayingAppendIcons); // skip

    this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
  }

  if (this.skipButton) {
    this.skipButton.removeEventListener('click', this.onClickSkip);
    this.skipButton.removeEventListener('touchend', this.onClickSkip);
  } // click UI on mobile


  if (this.clickUIOnMobile) {
    this.clickUIOnMobile.removeEventListener('touchend', this.onClickThrough);
  }

  if (this.contentPlayer) {
    this.contentPlayer.removeEventListener('error', this.onPlaybackError);
  }
};

VAST_PLAYER.destroy = function () {
  var _this2 = this;

  console.log("".concat(FW.consolePrepend, " start destroying vast player"), FW.consoleStyle, ''); // destroy icons if any 

  if (this.iconsData.length > 0) {
    creatives_icons.destroy.call(this);
  }

  if (this.isVPAID) {
    vpaid.destroy.call(this);
  } // unwire events


  _unwireVastPlayerEvents.call(this); // remove clickUI on mobile


  if (this.clickUIOnMobile) {
    FW.removeElement(this.clickUIOnMobile);
  }

  if (this.creative.isSkippableAd) {
    FW.removeElement(this.skipButton);
  } // hide rmp-ad-container


  FW.hide(this.adContainer); // unwire anti-seek logic (iOS)

  clearInterval(this.antiSeekLogicInterval); // reset creativeLoadTimeout

  clearTimeout(this.creativeLoadTimeoutCallback);

  if (this.useContentPlayerForAds) {
    if (!this.params.outstream) {
      if (this.nonLinearContainer) {
        FW.removeElement(this.nonLinearContainer);
      } else {
        // when content is restored we need to seek to previously known currentTime
        // this must happen on playing event
        // the below is some hack I come up with because Safari is confused with 
        // what it is asked to do when post roll come into play
        if (this.currentContentCurrentTime > 4000) {
          this.needsSeekAdjust = true;

          if (this.contentPlayerCompleted) {
            this.needsSeekAdjust = false;
          }

          if (!this.seekAdjustAttached) {
            this.seekAdjustAttached = true;
            this.contentPlayer.addEventListener('playing', function () {
              if (_this2.needsSeekAdjust) {
                _this2.needsSeekAdjust = false;
                content_player.seekTo.call(_this2, _this2.currentContentCurrentTime);
              }
            });
          }
        }

        console.log("".concat(FW.consolePrepend, " recovering content ").concat(this.currentContentSrc, " at time ").concat(this.currentContentCurrentTime), FW.consoleStyle, '');
        this.contentPlayer.src = this.currentContentSrc;
      }
    } else {
      // specific handling for outstream ad === flush buffer and do not attempt to resume content
      try {
        if (this.contentPlayer) {
          this.contentPlayer.pause(); // empty buffer

          this.contentPlayer.removeAttribute('src');
          this.contentPlayer.load();
          console.log("".concat(FW.consolePrepend, " flushing contentPlayer buffer after outstream ad"), FW.consoleStyle, '');
        }
      } catch (error) {
        console.warn(error);
      }
    }
  } else {
    // flush vastPlayer
    try {
      if (this.vastPlayer) {
        this.vastPlayer.pause();

        if (this.readingHlsJS) {
          this.readingHlsJS = false;
          this.hlsJS[this.hlsJSIndex].destroy();
          this.hlsJSIndex++;
        } else {
          // empty buffer
          this.vastPlayer.removeAttribute('src');
          this.vastPlayer.load();
        }

        FW.hide(this.vastPlayer);
        console.log("".concat(FW.consolePrepend, " flushing vastPlayer buffer after ad"), FW.consoleStyle, '');
      }

      if (this.nonLinearContainer) {
        FW.removeElement(this.nonLinearContainer);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  Utils.resetVariablesForNewLoadAds.call(this);
  Utils.createApiEvent.call(this, 'addestroyed');
};

VAST_PLAYER.init = function () {
  var _this3 = this;

  this.adContainer = document.createElement('div');
  this.adContainer.className = 'rmp-ad-container';
  this.contentWrapper.appendChild(this.adContainer);
  FW.hide(this.adContainer);

  if (!this.useContentPlayerForAds) {
    this.vastPlayer = document.createElement('video');
    FW.logVideoEvents(this.vastPlayer, 'vast'); // disable casting of video ads for Android

    if (ENV.isAndroid[0] && typeof this.vastPlayer.disableRemotePlayback !== 'undefined') {
      this.vastPlayer.disableRemotePlayback = true;
    }

    this.vastPlayer.className = 'rmp-ad-vast-video-player';

    if (this.params.showControlsForVastPlayer) {
      this.vastPlayer.controls = true;
    } else {
      this.vastPlayer.controls = false;
    } // this.contentPlayer.muted may not be set because of a bug in some version of Chromium


    if (this.contentPlayer.hasAttribute('muted')) {
      this.contentPlayer.muted = true;
    }

    if (this.contentPlayer.muted) {
      this.vastPlayer.muted = true;
    } // black poster based 64 png


    this.vastPlayer.poster = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='; // note to myself: we use setAttribute for non-standard attribute (instead of . notation)

    this.vastPlayer.setAttribute('x-webkit-airplay', 'allow');

    if (typeof this.contentPlayer.playsInline === 'boolean' && this.contentPlayer.playsInline) {
      this.vastPlayer.playsInline = true;
    }

    this.vastPlayer.defaultPlaybackRate = 1; // append to rmp-ad-container

    FW.hide(this.vastPlayer);
    this.adContainer.appendChild(this.vastPlayer);
  } else {
    this.vastPlayer = this.contentPlayer;
  } // we track ended state for content player


  this.contentPlayer.addEventListener('ended', function () {
    if (_this3.adOnStage) {
      return;
    }

    _this3.contentPlayerCompleted = true;
  }); // we need to preload as much creative data as possible
  // also on macOS and iOS Safari we need to force preload to avoid 
  // playback issues

  this.vastPlayer.preload = 'auto'; // we need to init the vast player video tag
  // according to https://developers.google.com/interactive-media-ads/docs/sdks/html5/mobile_video
  // to initialize the content element, a call to the load() method is sufficient.

  if (ENV.isMobile) {
    // on Android both this.contentPlayer (to resume content)
    // and this.vastPlayer (to start ads) needs to be init
    // on iOS only init this.vastPlayer (as same as this.contentPlayer)
    if (!this.useContentPlayerForAds) {
      this.contentPlayer.load();
    }

    this.vastPlayer.load();
  } else {
    // due to autoplay being blocked on macOS Safari 11+
    // we also need to init player on this browser
    // this also work on previous version of Safari
    if (this.useContentPlayerForAds) {
      this.vastPlayer.load();
    }
  }

  this.rmpVastInitialized = true;
};

VAST_PLAYER.append = function (url, type) {
  // in case loadAds is called several times - rmpVastInitialized is already true
  // but we still need to locate the vastPlayer
  if (!this.vastPlayer) {
    if (this.useContentPlayerForAds) {
      this.vastPlayer = this.contentPlayer;
    } else {
      // we use existing rmp-ad-vast-video-player as it is already 
      // available and initialized (no need for user interaction)
      var existingVastPlayer = this.adContainer.querySelector('.rmp-ad-vast-video-player');

      if (existingVastPlayer === null) {
        Utils.processVastErrors.call(this, 900, true);
        return;
      }

      this.vastPlayer = existingVastPlayer;
    }
  }

  if (!this.creative.isLinear) {
    // we do not display non-linear ads with outstream ad 
    // they won't fit the format
    if (this.params.outstream) {
      console.log("".concat(FW.consolePrepend, " non-linear creative detected for outstream ad mode - discarding creative"), FW.consoleStyle, '');
      Utils.processVastErrors.call(this, 201, true);
      return;
    } else {
      non_linear.update.call(this);
    }
  } else {
    if (url && type) {
      linear.update.call(this, url, type);
    }
  } // wire tracking events


  tracking_events.wire.call(this); // append icons - only where vast player is different from 
  // content player

  if (!this.useContentPlayerForAds && this.iconsData.length > 0) {
    creatives_icons.append.call(this);
  }
};

VAST_PLAYER.setVolume = function (level) {
  if (this.vastPlayer) {
    this.vastPlayer.volume = level;
  }
};

VAST_PLAYER.getVolume = function () {
  if (this.vastPlayer) {
    return this.vastPlayer.volume;
  }

  return -1;
};

VAST_PLAYER.setMute = function (muted) {
  if (this.vastPlayer) {
    if (muted && !this.vastPlayer.muted) {
      this.vastPlayer.muted = true;
    } else if (!muted && this.vastPlayer.muted) {
      this.vastPlayer.muted = false;
    }
  }
};

VAST_PLAYER.getMute = function () {
  if (this.vastPlayer) {
    return this.vastPlayer.muted;
  }

  return false;
};

VAST_PLAYER.play = function (firstVastPlayerPlayRequest) {
  if (this.vastPlayer && this.vastPlayer.paused) {
    Utils.playPromise.call(this, 'vast', firstVastPlayerPlayRequest);
  }
};

VAST_PLAYER.pause = function () {
  if (this.vastPlayer && !this.vastPlayer.paused) {
    this.vastPlayer.pause();
  }
};

VAST_PLAYER.getDuration = function () {
  if (this.vastPlayer) {
    var duration = this.vastPlayer.duration;

    if (FW.isNumber(duration)) {
      return Math.round(duration * 1000);
    }
  }

  return -1;
};

VAST_PLAYER.getCurrentTime = function () {
  if (this.vastPlayer) {
    var currentTime = this.vastPlayer.currentTime;

    if (FW.isNumber(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }

  return -1;
};

VAST_PLAYER.resumeContent = function () {
  VAST_PLAYER.destroy.call(this);
  this.readingHlsJS = false; // if this.contentPlayerCompleted = true - we are in a post-roll situation
  // in that case we must not resume content once the post-roll has completed
  // you can use setContentPlayerCompleted/getContentPlayerCompleted to support 
  // custom use-cases when dynamically changing source for content
  // no need to resume content for outstream ads

  if (!this.contentPlayerCompleted && !this.params.outstream) {
    content_player.play.call(this);
  }

  this.contentPlayerCompleted = false;
};

/* harmony default export */ var vast_player = (VAST_PLAYER);
;// CONCATENATED MODULE: ./src/js/framework/utils.js













function utils_typeof(obj) { "@babel/helpers - typeof"; return utils_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, utils_typeof(obj); }

function utils_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function utils_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function utils_createClass(Constructor, protoProps, staticProps) { if (protoProps) utils_defineProperties(Constructor.prototype, protoProps); if (staticProps) utils_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }




 // Indicates that the error was encountered when the ad was being loaded. 
// Possible causes: there was no response from the ad server, malformed ad response was returned ...
// 300, 301, 302, 303, 304 Wrapper errors are managed in ast-client-js

var LOAD_ERROR_LIST = [303, 900, 1001]; // Indicates that the error was encountered after the ad loaded, during ad play. 
// Possible causes: ad assets could not be loaded, etc.

var PLAY_ERROR_LIST = [201, 204, 205, 400, 401, 402, 403, 501, 502, 503, 603, 901, 1002];
var VAST_ERRORS_LIST = [{
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
}];

var Utils = /*#__PURE__*/function () {
  function Utils() {
    utils_classCallCheck(this, Utils);
  }

  utils_createClass(Utils, null, [{
    key: "filterParams",
    value: function filterParams(inputParams) {
      var _this = this;

      var defaultParams = {
        ajaxTimeout: 5000,
        creativeLoadTimeout: 8000,
        ajaxWithCredentials: false,
        maxNumRedirects: 4,
        labels: {
          skipMessage: 'Skip ad',
          closeAd: 'Close ad',
          textForClickUIOnMobile: 'Learn more'
        },
        outstream: false,
        showControlsForVastPlayer: false,
        enableVpaid: true,
        vpaidSettings: {
          width: 640,
          height: 360,
          viewMode: 'normal',
          desiredBitrate: 500
        },
        useHlsJS: false,
        debugHlsJS: false,
        // OM SDK params
        omidSupport: false,
        omidAllowedVendors: [],
        omidPathTo: '../externals/omweb-v1.js',
        omidUnderEvaluation: false,
        omidAutoplay: false,
        partnerName: 'rmp-vast',
        partnerVersion: "7.0.0"
      };
      this.params = defaultParams;

      if (inputParams && utils_typeof(inputParams) === 'object') {
        var keys = Object.keys(inputParams);
        keys.forEach(function (key) {
          if (utils_typeof(inputParams[key]) === utils_typeof(_this.params[key])) {
            if (FW.isNumber(inputParams[key]) && inputParams[key] > 0 || typeof inputParams[key] !== 'number') {
              if (key === 'vpaidSettings') {
                if (FW.isNumber(inputParams.vpaidSettings.width) && inputParams.vpaidSettings.width > 0) {
                  _this.params.vpaidSettings.width = inputParams.vpaidSettings.width;
                }

                if (FW.isNumber(inputParams.vpaidSettings.height) && inputParams.vpaidSettings.height > 0) {
                  _this.params.vpaidSettings.height = inputParams.vpaidSettings.height;
                }

                if (typeof inputParams.vpaidSettings.viewMode === 'string' && inputParams.vpaidSettings.viewMode === 'fullscreen') {
                  _this.params.vpaidSettings.viewMode = inputParams.vpaidSettings.viewMode;
                }

                if (FW.isNumber(inputParams.vpaidSettings.desiredBitrate) && inputParams.vpaidSettings.desiredBitrate > 0) {
                  _this.params.vpaidSettings.desiredBitrate = inputParams.vpaidSettings.desiredBitrate;
                }
              } else {
                _this.params[key] = inputParams[key];
              }
            }
          }
        });
      }
    }
  }, {
    key: "createApiEvent",
    value: function createApiEvent(event) {
      var _this2 = this;

      // adloaded, addurationchange, adclick, adimpression, adstarted, 
      // adtagloaded, adtagstartloading, adpaused, adresumed 
      // advolumemuted, advolumechanged, adcomplete, adskipped, 
      // adskippablestatechanged, adclosed
      // adfirstquartile, admidpoint, adthirdquartile, aderror, 
      // addestroyed
      // adlinearchange, adexpandedchange, adremainingtimechange 
      // adinteraction, adsizechange
      if (Array.isArray(event)) {
        event.forEach(function (currentEvent) {
          if (currentEvent) {
            console.dir(currentEvent);
            FW.createStdEvent(currentEvent, _this2.container);
          }
        });
      } else if (event) {
        console.dir(event);
        FW.createStdEvent(event, this.container);
      }
    }
  }, {
    key: "playPromise",
    value: function playPromise(whichPlayer, firstPlayerPlayRequest) {
      var _this3 = this;

      var targetPlayer;

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
        var playPromise = targetPlayer.play(); // most modern browsers support play as a Promise
        // this lets us handle autoplay rejection 
        // https://developers.google.com/web/updates/2016/03/play-returns-promise

        if (playPromise !== undefined) {
          playPromise.then(function () {
            if (firstPlayerPlayRequest) {
              console.log("".concat(FW.consolePrepend, " initial play promise on ").concat(whichPlayer, " player has succeeded"), FW.consoleStyle, '');
              Utils.createApiEvent.call(_this3, 'adinitialplayrequestsucceeded');
            }
          }).catch(function (error) {
            console.warn(error);

            if (firstPlayerPlayRequest && whichPlayer === 'vast' && _this3.creative.isLinear) {
              console.log("".concat(FW.consolePrepend, " initial play promise on VAST player has been rejected"), FW.consoleStyle, '');
              Utils.processVastErrors.call(_this3, 400, true);
              Utils.createApiEvent.call(_this3, 'adinitialplayrequestfailed');
            } else if (firstPlayerPlayRequest && whichPlayer === 'content' && !_this3.creative.isLinear) {
              console.log("".concat(FW.consolePrepend, " initial play promise on content player has been rejected"), FW.consoleStyle, '');
              Utils.createApiEvent.call(_this3, 'adinitialplayrequestfailed');
            } else {
              console.log("".concat(FW.consolePrepend, " playPromise on ").concat(whichPlayer, " player has been rejected"), FW.consoleStyle, '');
            }
          });
        }
      }
    }
  }, {
    key: "makeButtonAccessible",
    value: function makeButtonAccessible(element, ariaLabel) {
      // make skip button accessible
      element.tabIndex = 0;
      element.setAttribute('role', 'button');
      element.addEventListener('keyup', function (event) {
        var code = event.which; // 13 = Return, 32 = Space

        if (code === 13 || code === 32) {
          event.stopPropagation();
          event.preventDefault();
          FW.createStdEvent('click', element);
        }
      });

      if (ariaLabel) {
        element.setAttribute('aria-label', ariaLabel);
      }
    }
  }, {
    key: "initInstanceVariables",
    value: function initInstanceVariables() {
      this.adContainer = null;
      this.debug = false;
      this.rmpVastInitialized = false;
      this.useContentPlayerForAds = false;
      this.contentPlayerCompleted = false;
      this.currentContentSrc = '';
      this.currentContentCurrentTime = -1;
      this.needsSeekAdjust = false;
      this.seekAdjustAttached = false;
      this.firstVastPlayerPlayRequest = true;
      this.firstContentPlayerPlayRequest = true;
      this.params = {};
      this.onFullscreenchange = FW.nullFn;
      this.contentWrapper = null;
      this.contentPlayer = null;
      this.id = null;
      this.container = null;
      this.isInFullscreen = false; // adpod

      this.adPod = false;
      this.adPodLength = 0;
      this.adSequence = 0; // on iOS and macOS Safari we use content player to play ads
      // to avoid issues related to fullscreen management and autoplay
      // as fullscreen on iOS is handled by the default OS player

      if (ENV.isIos[0] || ENV.isMacOSSafari || ENV.isIpadOS) {
        this.useContentPlayerForAds = true;
        console.log("".concat(FW.consolePrepend, " vast player will be content player"), FW.consoleStyle, '');
      }
    }
  }, {
    key: "resetVariablesForNewLoadAds",
    value: function resetVariablesForNewLoadAds() {
      this.container.removeEventListener('adstarted', this.attachViewableObserver); // init internal methods 

      this.onLoadedmetadataPlay = FW.nullFn;
      this.onPlaybackError = FW.nullFn; // init internal tracking events methods

      this.onPause = FW.nullFn;
      this.onPlay = FW.nullFn;
      this.onPlaying = FW.nullFn;
      this.onEnded = FW.nullFn;
      this.onVolumeChange = FW.nullFn;
      this.onTimeupdate = FW.nullFn;
      this.onEventPingTracking = FW.nullFn;
      this.onClickThrough = FW.nullFn;
      this.onPlayingAppendIcons = FW.nullFn;
      this.onDurationChange = FW.nullFn;
      this.onTimeupdateCheckSkip = FW.nullFn;
      this.onClickSkip = FW.nullFn;
      this.onNonLinearLoadSuccess = FW.nullFn;
      this.onNonLinearLoadError = FW.nullFn;
      this.onNonLinearClickThrough = FW.nullFn;
      this.onContextMenu = FW.nullFn; // init internal variables

      this.adTagUrl = '';
      this.vastPlayer = null;
      this.vpaidSlot = null;
      this.trackingTags = [];
      this.vastErrorTags = [];
      this.adErrorTags = [];
      this.vastPlayerMuted = false;
      this.vastPlayerDuration = -1;
      this.vastPlayerCurrentTime = -1;
      this.firstQuartileEventFired = false;
      this.midpointEventFired = false;
      this.thirdQuartileEventFired = false;
      this.vastPlayerPaused = false;
      this.vastErrorCode = -1;
      this.adErrorType = '';
      this.vastErrorMessage = '';
      this.adOnStage = false; // hls.js

      this.hlsJS = [];
      this.hlsJSIndex = 0;
      this.readingHlsJS = false; // VAST ICONS

      this.iconsData = []; // players

      this.clickUIOnMobile = null;
      this.customPlaybackCurrentTime = 0;
      this.antiSeekLogicInterval = null;
      this.creativeLoadTimeoutCallback = null; // VAST 4

      this.ad = {};
      this.creative = {};
      this.attachViewableObserver = null;
      this.viewableObserver = null;
      this.viewablePreviousRatio = 0.5;
      this.regulationsInfo = {};
      this.requireCategory = false; // skip

      this.progressEvents = [];
      this.skipButton = null;
      this.skipWaiting = null;
      this.skipMessage = null;
      this.skipIcon = null;
      this.skippableAdCanBeSkipped = false; // non linear

      this.nonLinearContainer = null;
      this.nonLinearATag = null;
      this.nonLinearInnerElement = null;
      this.onClickCloseNonLinear = FW.nullFn;
      this.nonLinearMinSuggestedDuration = 0; // companion ads

      this.validCompanionAds = [];
      this.companionAdsRequiredAttribute = '';
      this.companionAdsList = []; // VPAID

      this.isVPAID = false;
      this.vpaidCreative = null;
      this.vpaidScript = null;
      this.vpaidIframe = null;
      this.vpaidLoadTimeout = null;
      this.initAdTimeout = null;
      this.startAdTimeout = null;
      this.vpaidAvailableInterval = null;
      this.adStoppedTimeout = null;
      this.adSkippedTimeout = null;
      this.adParametersData = '';
      this.vpaidCurrentVolume = 1;
      this.vpaidPaused = true;
      this.vpaidCreativeUrl = '';
      this.vpaidRemainingTime = -1;
      this.vpaidVersion = -1;
      this.vpaid1AdDuration = -1;
      this.initialWidth = 640;
      this.initialHeight = 360;
      this.initialViewMode = 'normal';
      this.desiredBitrate = 500;
      this.vpaidAdLoaded = false;
      this.vpaidAdStarted = false;
      this.vpaidCallbacks = {};
    } // attach fullscreen states
    // this assumes we have a polyfill for fullscreenchange event 
    // see app/js/app.js
    // we need this to handle VAST fullscreen events

  }, {
    key: "_onFullscreenchange",
    value: function _onFullscreenchange(event) {
      if (event && event.type) {
        console.log("".concat(FW.consolePrepend, " event is ").concat(event.type), FW.consoleStyle, '');

        if (event.type === 'fullscreenchange') {
          if (this.isInFullscreen) {
            this.isInFullscreen = false;

            if (this.adOnStage && this.creative.isLinear) {
              tracking_events.dispatch.call(this, ['exitFullscreen', 'playerCollapse']);
            }
          } else {
            this.isInFullscreen = true;

            if (this.adOnStage && this.creative.isLinear) {
              tracking_events.dispatch.call(this, ['fullscreen', 'playerExpand']);
            }
          }
        } else if (event.type === 'webkitbeginfullscreen') {
          // iOS uses webkitbeginfullscreen
          if (this.adOnStage && this.creative.isLinear) {
            tracking_events.dispatch.call(this, ['fullscreen', 'playerExpand']);
          }

          this.isInFullscreen = true;
        } else if (event.type === 'webkitendfullscreen') {
          // iOS uses webkitendfullscreen
          if (this.adOnStage && this.creative.isLinear) {
            tracking_events.dispatch.call(this, ['exitFullscreen', 'playerCollapse']);
          }

          this.isInFullscreen = false;
        }
      }
    }
  }, {
    key: "handleFullscreen",
    value: function handleFullscreen() {
      // if we have native fullscreen support we handle fullscreen events
      if (ENV.hasNativeFullscreenSupport) {
        this.onFullscreenchange = Utils._onFullscreenchange.bind(this); // for our beloved iOS 

        if (ENV.isIos[0]) {
          this.contentPlayer.addEventListener('webkitbeginfullscreen', this.onFullscreenchange);
          this.contentPlayer.addEventListener('webkitendfullscreen', this.onFullscreenchange);
        } else {
          document.addEventListener('fullscreenchange', this.onFullscreenchange);
        }
      }
    }
  }, {
    key: "_updateVastError",
    value: function _updateVastError(errorCode) {
      var error = VAST_ERRORS_LIST.filter(function (value) {
        return value.code === errorCode;
      });

      if (error.length > 0) {
        this.vastErrorCode = error[0].code;
        this.vastErrorMessage = error[0].description;
      } else {
        this.vastErrorCode = -1;
        this.vastErrorMessage = 'Error getting VAST error';
      }

      if (this.vastErrorCode > -1) {
        if (LOAD_ERROR_LIST.indexOf(this.vastErrorCode) > -1) {
          this.adErrorType = 'adLoadError';
        } else if (PLAY_ERROR_LIST.indexOf(this.vastErrorCode) > -1) {
          this.adErrorType = 'adPlayError';
        }
      }

      console.log("".concat(FW.consolePrepend, " VAST error code is ").concat(this.vastErrorCode), FW.consoleStyle, '');
      console.log("".concat(FW.consolePrepend, " VAST error message is ").concat(this.vastErrorMessage), FW.consoleStyle, '');
      console.log("".concat(FW.consolePrepend, " Ad error type is ").concat(this.adErrorType), FW.consoleStyle, '');
    }
  }, {
    key: "processVastErrors",
    value: function processVastErrors(errorCode, ping) {
      if (ping) {
        tracking_events.error.call(this, errorCode);
      }

      Utils._updateVastError.call(this, errorCode);

      Utils.createApiEvent.call(this, 'aderror');
      vast_player.resumeContent.call(this);
    }
  }]);

  return Utils;
}();


// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__(6699);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.includes.js
var es_string_includes = __webpack_require__(2023);
;// CONCATENATED MODULE: ./src/js/verification/omsdk.js









function omsdk_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function omsdk_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function omsdk_createClass(Constructor, protoProps, staticProps) { if (protoProps) omsdk_defineProperties(Constructor.prototype, protoProps); if (staticProps) omsdk_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var VIDEO_EVENT_TYPES = ['error', 'loadeddata', 'pause', 'play', 'timeupdate', 'volumechange'];
var CONTENT_URL = document.location.href;
var ACCESS_MODE = 'full';

var OmSdkManager = /*#__PURE__*/function () {
  function OmSdkManager(adVerifications, videoElement, params, isSkippableAd, skipTimeOffset) {
    omsdk_classCallCheck(this, OmSdkManager);

    this.adEvents = null;
    this.mediaEvents = null;
    this.adSession = null;
    this.OMIframe = null;
    this.VastProperties = null;
    this.lastVideoTime = -1;
    this.videoElement = videoElement;
    this.adVerifications = adVerifications;
    this.params = params;
    this.isSkippableAd = isSkippableAd;
    this.skipTimeOffset = skipTimeOffset;
    this.videoPosition = 'preroll';
    console.log("".concat(FW.consolePrepend).concat(FW.consolePrepend2, " create new class Instance"), FW.consoleStyle, FW.consoleStyle2, '');
  }

  omsdk_createClass(OmSdkManager, [{
    key: "init",
    value: function init() {
      var _this = this;

      // load omweb script
      this.OMIframe = this._createOMIframe();
      this.OMIframe.onload = this._onOMWebIframeLoaded.bind(this);

      try {
        document.body.appendChild(this.OMIframe);
      } catch (error) {
        console.warn(error);
        document.head.appendChild(this.OMIframe);
      }

      VIDEO_EVENT_TYPES.forEach(function (eventType) {
        _this.videoElement.addEventListener(eventType, function (event) {
          return _this._vastPlayerDidDispatchEvent(event);
        });
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.adSession.finish();
      FW.removeElement(this.OMIframe);
    }
  }, {
    key: "_pingVerificationNotExecuted",
    value: function _pingVerificationNotExecuted(verification, reasonCode) {
      if (typeof verification.trackingEvents !== 'undefined' && Array.isArray(verification.trackingEvents.verificationNotExecuted) && verification.trackingEvents.verificationNotExecuted.length > 0) {
        verification.trackingEvents.verificationNotExecuted.forEach(function (verificationNotExecutedURI) {
          var validatedURI = verificationNotExecutedURI;
          var reasonPattern = /\[REASON\]/gi;

          if (reasonPattern.test(validatedURI)) {
            validatedURI = validatedURI.replace(reasonPattern, reasonCode);
          }

          console.log("".concat(FW.consolePrepend).concat(FW.consolePrepend2, " ping VerificationNotExecuted at URI ").concat(validatedURI), FW.consoleStyle, FW.consoleStyle2, '');
          tracking_events.pingURI(validatedURI);
        });
      }
    }
  }, {
    key: "_createOMIframe",
    value: function _createOMIframe() {
      var iframe = document.createElement('iframe');
      iframe.sandbox = 'allow-scripts allow-same-origin';
      iframe.style.display = 'none';
      iframe.srcdoc = "<script src=".concat(this.params.omidPathTo, "></script>");
      console.log("".concat(FW.consolePrepend).concat(FW.consolePrepend2, " load omweb-v1.js at URI ").concat(this.params.omidPathTo), FW.consoleStyle, FW.consoleStyle2, '');
      return iframe;
    }
  }, {
    key: "_vastPlayerDidDispatchTimeUpdate",
    value: function _vastPlayerDidDispatchTimeUpdate() {
      var _this2 = this;

      if (!this.adEvents || !this.mediaEvents || this.videoElement.playbackRate === 0) {
        return;
      } // Check if playback has crossed a quartile threshold, and report that to
      // the OMSDK.


      var vastPlayerCurrentTime = this.videoElement.currentTime;
      var vastPlayerDuration = this.videoElement.duration;

      if (vastPlayerCurrentTime > -1 && vastPlayerDuration > 0) {
        if (vastPlayerCurrentTime >= 1 && this.videoPosition === 'preroll') {
          this.videoPosition === 'midroll';
        }

        var currentVideoTimePerCent = vastPlayerCurrentTime / vastPlayerDuration;

        if (this.lastVideoTime < 0 && currentVideoTimePerCent >= 0) {
          this.adEvents.impressionOccurred();
          this.mediaEvents.start(vastPlayerDuration, this.videoElement.volume);
        } else if (this.lastVideoTime < 0.25 && currentVideoTimePerCent >= 0.25) {
          this.mediaEvents.firstQuartile();
        } else if (this.lastVideoTime < 0.5 && currentVideoTimePerCent >= 0.5) {
          this.mediaEvents.midpoint();
        } else if (this.lastVideoTime < 0.75 && currentVideoTimePerCent >= 0.75) {
          this.mediaEvents.thirdQuartile();
        } else if (this.lastVideoTime < 1 && currentVideoTimePerCent >= 1) {
          this.videoPosition = 'postroll';
          this.mediaEvents.complete(); // to prevent ad pod to fire verification events

          this.adEvents = null;
          this.mediaEvents = null; // Wait 3s, then finish the session.

          setTimeout(function () {
            _this2.destroy();
          }, 300);
        }

        this.lastVideoTime = currentVideoTimePerCent;
      }
    }
  }, {
    key: "_vastPlayerDidDispatchEvent",
    value: function _vastPlayerDidDispatchEvent(event) {
      if (!this.adSession || !this.adEvents || !this.mediaEvents || !this.VastProperties) {
        return;
      }

      var vastProperties, volume;

      switch (event.type) {
        case 'error':
          this.adSession.error('video', this.videoElement.error.message);
          break;

        case 'loadeddata':
          if (this.skipTimeOffset < 0) {
            this.skipTimeOffset = 0;
          }

          if (this.params.outstream) {
            this.videoPosition = 'standalone';
          }

          vastProperties = new this.VastProperties(this.isSkippableAd, this.skipTimeOffset, this.params.omidAutoplay, this.videoPosition);
          this.adEvents.loaded(vastProperties);
          break;

        case 'pause':
          this.mediaEvents.pause();
          break;

        case 'play':
          if (this.videoElement.currentTime > 0) {
            this.mediaEvents.resume();
          }

          break;

        case 'timeupdate':
          this._vastPlayerDidDispatchTimeUpdate();

          break;

        case 'volumechange':
          volume = this.videoElement.muted ? 0 : this.videoElement.volume;
          this.mediaEvents.volumeChange(volume);
          break;

        default:
          break;
      }
    }
  }, {
    key: "_onOMWebIframeLoaded",
    value: function _onOMWebIframeLoaded() {
      var _this3 = this;

      console.log("".concat(FW.consolePrepend).concat(FW.consolePrepend2, " iframe content loaded"), FW.consoleStyle, FW.consoleStyle2, ''); // remove executable to only have JavaScriptResource

      var validatedVerificationArray = []; // we only execute browserOptional="false" unless there are none 
      // in which case we will look for browserOptional="true"

      var browserOptional = [];

      for (var i = 0; i < this.adVerifications.length; i++) {
        var verification = this.adVerifications[i];

        if (typeof verification.resource !== 'string' || verification.resource === '') {
          continue;
        } // Ping rejection code 2
        // Verification not supported. The API framework or language type of
        // verification resources provided are not implemented or supported by
        // the player/SDK


        if (typeof verification.type !== 'undefined' && verification.type === 'executable') {
          this._pingVerificationNotExecuted(verification, '2');

          continue;
        } // if not OMID, we reject


        if (typeof verification.apiFramework !== 'undefined' && verification.apiFramework !== 'omid') {
          this._pingVerificationNotExecuted(verification, '2');

          continue;
        } // reject vendors not in omidAllowedVendors if omidAllowedVendors is not empty


        if (this.params.omidAllowedVendors.length > 0 && typeof verification.vendor !== 'undefined') {
          if (!this.params.omidAllowedVendors.includes(verification.vendor)) {
            continue;
          }
        }

        if (typeof verification.browserOptional !== 'undefined' && verification.browserOptional === true) {
          browserOptional.push(i);
          continue;
        }

        validatedVerificationArray.push(verification);
      }

      if (validatedVerificationArray.length === 0 && browserOptional.length > 0) {
        browserOptional.forEach(function (browserOptionalItem) {
          validatedVerificationArray.push(_this3.adVerifications[browserOptionalItem]);
        });
      }

      this.adVerifications = validatedVerificationArray;
      var sessionClient;

      try {
        sessionClient = OmidSessionClient['default'];
      } catch (error) {
        console.warn(error);
        return;
      }

      var AdSession = sessionClient.AdSession;
      var Partner = sessionClient.Partner;
      var Context = sessionClient.Context;
      var VerificationScriptResource = sessionClient.VerificationScriptResource;
      var AdEvents = sessionClient.AdEvents;
      var MediaEvents = sessionClient.MediaEvents;
      this.VastProperties = sessionClient.VastProperties;
      var partner = new Partner(this.params.partnerName, this.params.partnerVersion);
      var resources = this.adVerifications.map(function (verification) {
        return new VerificationScriptResource(verification.resource, verification.vendor, verification.verificationParameters, ACCESS_MODE);
      });
      console.dir(resources);
      var context = new Context(partner, resources, CONTENT_URL);

      if (this.params.omidUnderEvaluation) {
        context.underEvaluation = true;
      }

      var serviceWindow = this.OMIframe.contentWindow;

      if (!serviceWindow) {
        console.log("".concat(FW.consolePrepend).concat(FW.consolePrepend2, " invalid serviceWindow - return"), FW.consoleStyle, FW.consoleStyle2, '');
        return;
      }

      context.setServiceWindow(serviceWindow);
      context.setVideoElement(this.videoElement);
      this.adSession = new AdSession(context);
      this.adSession.setCreativeType('video');
      this.adSession.setImpressionType('beginToRender');

      if (!this.adSession.isSupported()) {
        console.log("".concat(FW.consolePrepend).concat(FW.consolePrepend2, " invalid serviceWindow - return"), FW.consoleStyle, FW.consoleStyle2, '');
        return;
      }

      this.adEvents = new AdEvents(this.adSession);
      this.mediaEvents = new MediaEvents(this.adSession);
      this.adSession.start();
    }
  }]);

  return OmSdkManager;
}();

/* harmony default export */ var omsdk = (OmSdkManager);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.assign.js
var es_object_assign = __webpack_require__(9601);
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/util/storage.js
function storage_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function storage_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function storage_createClass(Constructor, protoProps, staticProps) { if (protoProps) storage_defineProperties(Constructor.prototype, protoProps); if (staticProps) storage_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }


var storage = null;
/**
 * This Object represents a default storage to be used in case no other storage is available.
 * @constant
 * @type {Object}
 */

var DEFAULT_STORAGE = {
  data: {},
  length: 0,
  getItem: function getItem(key) {
    return this.data[key];
  },
  setItem: function setItem(key, value) {
    this.data[key] = value;
    this.length = Object.keys(this.data).length;
  },
  removeItem: function removeItem(key) {
    delete this.data[key];
    this.length = Object.keys(this.data).length;
  },
  clear: function clear() {
    this.data = {};
    this.length = 0;
  }
};
/**
 * This class provides an wrapper interface to the a key-value storage.
 * It uses localStorage, sessionStorage or a custom storage if none of the two is available.
 * @export
 * @class Storage
 */

var Storage = /*#__PURE__*/function () {
  /**
   * Creates an instance of Storage.
   * @constructor
   */
  function Storage() {
    storage_classCallCheck(this, Storage);

    this.storage = this.initStorage();
  }
  /**
   * Provides a singleton instance of the wrapped storage.
   * @return {Object}
   */


  storage_createClass(Storage, [{
    key: "initStorage",
    value: function initStorage() {
      if (storage) {
        return storage;
      }

      try {
        storage = typeof window !== 'undefined' && window !== null ? window.localStorage || window.sessionStorage : null;
      } catch (storageError) {
        storage = null;
      }

      if (!storage || this.isStorageDisabled(storage)) {
        storage = DEFAULT_STORAGE;
        storage.clear();
      }

      return storage;
    }
    /**
     * Check if storage is disabled (like in certain cases with private browsing).
     * In Safari (Mac + iOS) when private browsing is ON, localStorage is read only
     * http://spin.atomicobject.com/2013/01/23/ios-private-browsing-localstorage/
     * @param {Object} testStorage - The storage to check.
     * @return {Boolean}
     */

  }, {
    key: "isStorageDisabled",
    value: function isStorageDisabled(testStorage) {
      var testValue = '__VASTStorage__';

      try {
        testStorage.setItem(testValue, testValue);

        if (testStorage.getItem(testValue) !== testValue) {
          testStorage.removeItem(testValue);
          return true;
        }
      } catch (e) {
        return true;
      }

      testStorage.removeItem(testValue);
      return false;
    }
    /**
     * Returns the value for the given key. If the key does not exist, null is returned.
     * @param  {String} key - The key to retrieve the value.
     * @return {any}
     */

  }, {
    key: "getItem",
    value: function getItem(key) {
      return this.storage.getItem(key);
    }
    /**
     * Adds or updates the value for the given key.
     * @param  {String} key - The key to modify the value.
     * @param  {any} value - The value to be associated with the key.
     * @return {any}
     */

  }, {
    key: "setItem",
    value: function setItem(key, value) {
      return this.storage.setItem(key, value);
    }
    /**
     * Removes an item for the given key.
     * @param  {String} key - The key to remove the value.
     * @return {any}
     */

  }, {
    key: "removeItem",
    value: function removeItem(key) {
      return this.storage.removeItem(key);
    }
    /**
     * Removes all the items from the storage.
     */

  }, {
    key: "clear",
    value: function clear() {
      return this.storage.clear();
    }
  }]);

  return Storage;
}();
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.splice.js
var es_array_splice = __webpack_require__(561);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.reflect.construct.js
var es_reflect_construct = __webpack_require__(2419);
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/ad.js
function createAd() {
  var adAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    id: adAttributes.id || null,
    sequence: adAttributes.sequence || null,
    adType: adAttributes.adType || null,
    adServingId: null,
    categories: [],
    expires: null,
    viewableImpression: [],
    system: null,
    title: null,
    description: null,
    advertiser: null,
    pricing: null,
    survey: null,
    // @deprecated in VAST 4.1
    errorURLTemplates: [],
    impressionURLTemplates: [],
    creatives: [],
    extensions: [],
    adVerifications: [],
    blockedAdCategories: [],
    followAdditionalWrappers: true,
    allowMultipleAds: false,
    fallbackOnNoAd: null
  };
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/ad_verification.js
function createAdVerification() {
  return {
    resource: null,
    vendor: null,
    browserOptional: false,
    apiFramework: null,
    type: null,
    parameters: null,
    trackingEvents: {}
  };
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.reduce.js
var es_array_reduce = __webpack_require__(5827);
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/companion_ad.js
function createCompanionAd() {
  var creativeAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    id: creativeAttributes.id || null,
    adType: 'companionAd',
    width: creativeAttributes.width || 0,
    height: creativeAttributes.height || 0,
    assetWidth: creativeAttributes.assetWidth || null,
    assetHeight: creativeAttributes.assetHeight || null,
    expandedWidth: creativeAttributes.expandedWidth || null,
    expandedHeight: creativeAttributes.expandedHeight || null,
    apiFramework: creativeAttributes.apiFramework || null,
    adSlotID: creativeAttributes.adSlotID || null,
    pxratio: creativeAttributes.pxratio || '1',
    renderingMode: creativeAttributes.renderingMode || 'default',
    staticResources: [],
    htmlResources: [],
    iframeResources: [],
    adParameters: null,
    xmlEncoded: null,
    altText: null,
    companionClickThroughURLTemplate: null,
    companionClickTrackingURLTemplates: [],
    trackingEvents: {}
  };
}
function isCompanionAd(ad) {
  return ad.adType === 'companionAd';
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/creative/creative.js
function createCreative() {
  var creativeAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    id: creativeAttributes.id || null,
    adId: creativeAttributes.adId || null,
    sequence: creativeAttributes.sequence || null,
    apiFramework: creativeAttributes.apiFramework || null,
    universalAdIds: [],
    creativeExtensions: []
  };
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/creative/creative_companion.js

function createCreativeCompanion() {
  var creativeAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _createCreative = createCreative(creativeAttributes),
      id = _createCreative.id,
      adId = _createCreative.adId,
      sequence = _createCreative.sequence,
      apiFramework = _createCreative.apiFramework;

  return {
    id: id,
    adId: adId,
    sequence: sequence,
    apiFramework: apiFramework,
    type: 'companion',
    required: null,
    variations: []
  };
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.last-index-of.js
var es_array_last_index_of = __webpack_require__(4986);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.trim.js
var es_string_trim = __webpack_require__(3210);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.constructor.js
var es_regexp_constructor = __webpack_require__(4603);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-own-property-names.js
var es_object_get_own_property_names = __webpack_require__(6210);
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/util/macros.js
var supportedMacros = ['ADCATEGORIES', 'ADCOUNT', 'ADPLAYHEAD', 'ADSERVINGID', 'ADTYPE', 'APIFRAMEWORKS', 'APPBUNDLE', 'ASSETURI', 'BLOCKEDADCATEGORIES', 'BREAKMAXADLENGTH', 'BREAKMAXADS', 'BREAKMAXDURATION', 'BREAKMINADLENGTH', 'BREAKMINDURATION', 'BREAKPOSITION', 'CLICKPOS', 'CLICKTYPE', 'CLIENTUA', 'CONTENTID', 'CONTENTPLAYHEAD', // @deprecated VAST 4.1
'CONTENTURI', 'DEVICEIP', 'DEVICEUA', 'DOMAIN', 'EXTENSIONS', 'GDPRCONSENT', 'IFA', 'IFATYPE', 'INVENTORYSTATE', 'LATLONG', 'LIMITADTRACKING', 'MEDIAMIME', 'MEDIAPLAYHEAD', 'OMIDPARTNER', 'PAGEURL', 'PLACEMENTTYPE', 'PLAYERCAPABILITIES', 'PLAYERSIZE', 'PLAYERSTATE', 'PODSEQUENCE', 'REGULATIONS', 'SERVERSIDE', 'SERVERUA', 'TRANSACTIONID', 'UNIVERSALADID', 'VASTVERSIONS', 'VERIFICATIONVENDORS'];
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/util/util.js

















function track(URLTemplates, macros, options) {
  var URLs = resolveURLTemplates(URLTemplates, macros, options);
  URLs.forEach(function (URL) {
    if (typeof window !== 'undefined' && window !== null) {
      var i = new Image();
      i.src = URL;
    }
  });
}
/**
 * Replace the provided URLTemplates with the given values
 *
 * @param {Array} URLTemplates - An array of tracking url templates.
 * @param {Object} [macros={}] - An optional Object of parameters to be used in the tracking calls.
 * @param {Object} [options={}] - An optional Object of options to be used in the tracking calls.
 */


function resolveURLTemplates(URLTemplates) {
  var macros = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var resolvedURLs = [];
  var URLArray = extractURLsFromTemplates(URLTemplates); // Set default value for invalid ERRORCODE

  if (macros['ERRORCODE'] && !options.isCustomCode && !/^[0-9]{3}$/.test(macros['ERRORCODE'])) {
    macros['ERRORCODE'] = 900;
  } // Calc random/time based macros


  macros['CACHEBUSTING'] = leftpad(Math.round(Math.random() * 1.0e8).toString());
  macros['TIMESTAMP'] = new Date().toISOString(); // RANDOM/random is not defined in VAST 3/4 as a valid macro tho it's used by some adServer (Auditude)

  macros['RANDOM'] = macros['random'] = macros['CACHEBUSTING'];

  for (var macro in macros) {
    macros[macro] = encodeURIComponentRFC3986(macros[macro]);
  }

  for (var URLTemplateKey in URLArray) {
    var resolveURL = URLArray[URLTemplateKey];

    if (typeof resolveURL !== 'string') {
      continue;
    }

    resolvedURLs.push(replaceUrlMacros(resolveURL, macros));
  }

  return resolvedURLs;
}
/**
 * Replace the macros tracking url with their value.
 * If no value is provided for a supported macro and it exists in the url,
 * it will be replaced by -1 as described by the VAST 4.1 iab specifications
 *
 * @param {String} url - Tracking url.
 * @param {Object} macros - Object of macros to be replaced in the tracking calls
 */


function replaceUrlMacros(url, macros) {
  url = replaceMacrosValues(url, macros); // match any macros from the url that was not replaced

  var remainingMacros = url.match(/[^[\]]+(?=])/g);

  if (!remainingMacros) {
    return url;
  }

  var supportedRemainingMacros = remainingMacros.filter(function (macro) {
    return supportedMacros.indexOf(macro) > -1;
  });

  if (supportedRemainingMacros.length === 0) {
    return url;
  }

  supportedRemainingMacros = supportedRemainingMacros.reduce(function (accumulator, macro) {
    accumulator[macro] = -1;
    return accumulator;
  }, {});
  return replaceMacrosValues(url, supportedRemainingMacros);
}
/**
 * Replace the macros tracking url with their value.
 *
 * @param {String} url - Tracking url.
 * @param {Object} macros - Object of macros to be replaced in the tracking calls
 */


function replaceMacrosValues(url, macros) {
  var replacedMacrosUrl = url;

  for (var key in macros) {
    var value = macros[key]; // this will match [${key}] and %%${key}%% and replace it

    replacedMacrosUrl = replacedMacrosUrl.replace(new RegExp("(?:\\[|%%)(".concat(key, ")(?:\\]|%%)"), 'g'), value);
  }

  return replacedMacrosUrl;
}
/**
 * Extract the url/s from the URLTemplates.
 *   If the URLTemplates is an array of urls
 *   If the URLTemplates object has a url property
 *   If the URLTemplates is a single string
 *
 * @param {Array|String} URLTemplates - An array|string of url templates.
 */


function extractURLsFromTemplates(URLTemplates) {
  if (Array.isArray(URLTemplates)) {
    return URLTemplates.map(function (URLTemplate) {
      return URLTemplate && URLTemplate.hasOwnProperty('url') ? URLTemplate.url : URLTemplate;
    });
  }

  return URLTemplates;
}
/**
 * Returns a boolean after checking if the object exists in the array.
 *   true - if the object exists, false otherwise
 *
 * @param {Object} obj - The object who existence is to be checked.
 * @param {Array} list - List of objects.
 */


function containsTemplateObject(obj, list) {
  for (var i = 0; i < list.length; i++) {
    if (isTemplateObjectEqual(list[i], obj)) {
      return true;
    }
  }

  return false;
}
/**
 * Returns a boolean after comparing two Template objects.
 *   true - if the objects are equivalent, false otherwise
 *
 * @param {Object} obj1
 * @param {Object} obj2
 */


function isTemplateObjectEqual(obj1, obj2) {
  if (obj1 && obj2) {
    var obj1Properties = Object.getOwnPropertyNames(obj1);
    var obj2Properties = Object.getOwnPropertyNames(obj2); // If number of properties is different, objects are not equivalent

    if (obj1Properties.length !== obj2Properties.length) {
      return false;
    }

    if (obj1.id !== obj2.id || obj1.url !== obj2.url) {
      return false;
    }

    return true;
  }

  return false;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent


function encodeURIComponentRFC3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%".concat(c.charCodeAt(0).toString(16));
  });
}

function leftpad(input) {
  var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  var str = String(input);

  if (str.length < len) {
    return range(0, len - str.length, false).map(function () {
      return '0';
    }).join('') + str;
  }

  return str;
}

function range(left, right, inclusive) {
  var result = [];
  var ascending = left < right;
  var end = !inclusive ? right : ascending ? right + 1 : right - 1;

  for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    result.push(i);
  }

  return result;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}
/**
 * Joins two arrays of objects without duplicates
 *
 * @param {Array} arr1
 * @param {Array} arr2
 *
 * @return {Array}
 */


function joinArrayOfUniqueTemplateObjs() {
  var arr1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var arr2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var firstArr = Array.isArray(arr1) ? arr1 : [];
  var secondArr = Array.isArray(arr2) ? arr2 : [];
  var arr = firstArr.concat(secondArr);
  return arr.reduce(function (res, val) {
    if (!containsTemplateObject(val, res)) {
      res.push(val);
    }

    return res;
  }, []);
}

var util = {
  track: track,
  resolveURLTemplates: resolveURLTemplates,
  extractURLsFromTemplates: extractURLsFromTemplates,
  containsTemplateObject: containsTemplateObject,
  isTemplateObjectEqual: isTemplateObjectEqual,
  encodeURIComponentRFC3986: encodeURIComponentRFC3986,
  replaceUrlMacros: replaceUrlMacros,
  leftpad: leftpad,
  range: range,
  isNumeric: isNumeric,
  flatten: flatten,
  joinArrayOfUniqueTemplateObjs: joinArrayOfUniqueTemplateObjs
};
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/parser/parser_utils.js
function parser_utils_toConsumableArray(arr) { return parser_utils_arrayWithoutHoles(arr) || parser_utils_iterableToArray(arr) || parser_utils_unsupportedIterableToArray(arr) || parser_utils_nonIterableSpread(); }

function parser_utils_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function parser_utils_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return parser_utils_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return parser_utils_arrayLikeToArray(o, minLen); }

function parser_utils_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function parser_utils_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return parser_utils_arrayLikeToArray(arr); }

function parser_utils_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }























/**
 * This module provides support methods to the parsing classes.
 */

/**
 * Returns the first element of the given node which nodeName matches the given name.
 * @param  {Node} node - The node to use to find a match.
 * @param  {String} name - The name to look for.
 * @return {Object|undefined}
 */

function childByName(node, name) {
  var childNodes = node.childNodes;

  for (var childKey in childNodes) {
    var child = childNodes[childKey];

    if (child.nodeName === name) {
      return child;
    }
  }
}
/**
 * Returns all the elements of the given node which nodeName match the given name.
 * @param  {Node} node - The node to use to find the matches.
 * @param  {String} name - The name to look for.
 * @return {Array}
 */


function childrenByName(node, name) {
  var children = [];
  var childNodes = node.childNodes;

  for (var childKey in childNodes) {
    var child = childNodes[childKey];

    if (child.nodeName === name) {
      children.push(child);
    }
  }

  return children;
}
/**
 * Converts relative vastAdTagUri.
 * @param  {String} vastAdTagUrl - The url to resolve.
 * @param  {String} originalUrl - The original url.
 * @return {String}
 */


function resolveVastAdTagURI(vastAdTagUrl, originalUrl) {
  if (!originalUrl) {
    return vastAdTagUrl;
  }

  if (vastAdTagUrl.indexOf('//') === 0) {
    var _location = location,
        protocol = _location.protocol;
    return "".concat(protocol).concat(vastAdTagUrl);
  }

  if (vastAdTagUrl.indexOf('://') === -1) {
    // Resolve relative URLs (mainly for unit testing)
    var baseURL = originalUrl.slice(0, originalUrl.lastIndexOf('/'));
    return "".concat(baseURL, "/").concat(vastAdTagUrl);
  }

  return vastAdTagUrl;
}
/**
 * Converts a boolean string into a Boolean.
 * @param  {String} booleanString - The boolean string to convert.
 * @return {Boolean}
 */


function parseBoolean(booleanString) {
  return ['true', 'TRUE', 'True', '1'].indexOf(booleanString) !== -1;
}
/**
 * Parses a node text (for legacy support).
 * @param  {Object} node - The node to parse the text from.
 * @return {String}
 */


function parseNodeText(node) {
  return node && (node.textContent || node.text || '').trim();
}
/**
 * Copies an attribute from a node to another.
 * @param  {String} attributeName - The name of the attribute to clone.
 * @param  {Object} nodeSource - The source node to copy the attribute from.
 * @param  {Object} nodeDestination - The destination node to copy the attribute at.
 */


function copyNodeAttribute(attributeName, nodeSource, nodeDestination) {
  var attributeValue = nodeSource.getAttribute(attributeName);

  if (attributeValue) {
    nodeDestination.setAttribute(attributeName, attributeValue);
  }
}
/**
 * Converts element attributes into an object, where object key is attribute name
 * and object value is attribute value
 * @param {Element} element
 * @returns {Object}
 */


function parseAttributes(element) {
  var nodeAttributes = element.attributes;
  var attributes = {};

  for (var i = 0; i < nodeAttributes.length; i++) {
    attributes[nodeAttributes[i].nodeName] = nodeAttributes[i].nodeValue;
  }

  return attributes;
}
/**
 * Parses a String duration into a Number.
 * @param  {String} durationString - The dureation represented as a string.
 * @return {Number}
 */


function parseDuration(durationString) {
  if (durationString === null || typeof durationString === 'undefined') {
    return -1;
  } // Some VAST doesn't have an HH:MM:SS duration format but instead jus the number of seconds


  if (util.isNumeric(durationString)) {
    return parseInt(durationString);
  }

  var durationComponents = durationString.split(':');

  if (durationComponents.length !== 3) {
    return -1;
  }

  var secondsAndMS = durationComponents[2].split('.');
  var seconds = parseInt(secondsAndMS[0]);

  if (secondsAndMS.length === 2) {
    seconds += parseFloat("0.".concat(secondsAndMS[1]));
  }

  var minutes = parseInt(durationComponents[1] * 60);
  var hours = parseInt(durationComponents[0] * 60 * 60);

  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || minutes > 60 * 60 || seconds > 60) {
    return -1;
  }

  return hours + minutes + seconds;
}
/**
 * Splits an Array of ads into an Array of Arrays of ads.
 * Each subarray contains either one ad or multiple ads (an AdPod)
 * @param  {Array} ads - An Array of ads to split
 * @return {Array}
 */


function splitVAST(ads) {
  var splittedVAST = [];
  var lastAdPod = null;
  ads.forEach(function (ad, i) {
    if (ad.sequence) {
      ad.sequence = parseInt(ad.sequence, 10);
    } // The current Ad may be the next Ad of an AdPod


    if (ad.sequence > 1) {
      var lastAd = ads[i - 1]; // check if the current Ad is exactly the next one in the AdPod

      if (lastAd && lastAd.sequence === ad.sequence - 1) {
        lastAdPod && lastAdPod.push(ad);
        return;
      } // If the ad had a sequence attribute but it was not part of a correctly formed
      // AdPod, let's remove the sequence attribute


      delete ad.sequence;
    }

    lastAdPod = [ad];
    splittedVAST.push(lastAdPod);
  });
  return splittedVAST;
}
/**
 * Parses the attributes and assign them to object
 * @param  {Object} attributes attribute
 * @param  {Object} verificationObject with properties which can be assigned
 */


function assignAttributes(attributes, verificationObject) {
  if (attributes) {
    for (var attrKey in attributes) {
      var attribute = attributes[attrKey];

      if (attribute.nodeName && attribute.nodeValue && verificationObject.hasOwnProperty(attribute.nodeName)) {
        var value = attribute.nodeValue;

        if (typeof verificationObject[attribute.nodeName] === 'boolean') {
          value = parseBoolean(value);
        }

        verificationObject[attribute.nodeName] = value;
      }
    }
  }
}
/**
 * Merges the data between an unwrapped ad and his wrapper.
 * @param  {Ad} unwrappedAd - The 'unwrapped' Ad.
 * @param  {Ad} wrapper - The wrapper Ad.
 * @return {void}
 */


function mergeWrapperAdData(unwrappedAd, wrapper) {
  unwrappedAd.errorURLTemplates = wrapper.errorURLTemplates.concat(unwrappedAd.errorURLTemplates);
  unwrappedAd.impressionURLTemplates = wrapper.impressionURLTemplates.concat(unwrappedAd.impressionURLTemplates);
  unwrappedAd.extensions = wrapper.extensions.concat(unwrappedAd.extensions);

  if (wrapper.viewableImpression.length > 0) {
    unwrappedAd.viewableImpression = [].concat(parser_utils_toConsumableArray(unwrappedAd.viewableImpression), parser_utils_toConsumableArray(wrapper.viewableImpression));
  } // values from the child wrapper will be overridden


  unwrappedAd.followAdditionalWrappers = wrapper.followAdditionalWrappers;
  unwrappedAd.allowMultipleAds = wrapper.allowMultipleAds;
  unwrappedAd.fallbackOnNoAd = wrapper.fallbackOnNoAd;
  var wrapperCompanions = (wrapper.creatives || []).filter(function (creative) {
    return creative && creative.type === 'companion';
  });
  var wrapperCompanionClickTracking = wrapperCompanions.reduce(function (result, creative) {
    (creative.variations || []).forEach(function (variation) {
      (variation.companionClickTrackingURLTemplates || []).forEach(function (companionClickTrackingURLTemplate) {
        if (!util.containsTemplateObject(companionClickTrackingURLTemplate, result)) {
          result.push(companionClickTrackingURLTemplate);
        }
      });
    });
    return result;
  }, []);
  unwrappedAd.creatives = wrapperCompanions.concat(unwrappedAd.creatives);
  var wrapperHasVideoClickTracking = wrapper.videoClickTrackingURLTemplates && wrapper.videoClickTrackingURLTemplates.length;
  var wrapperHasVideoCustomClick = wrapper.videoCustomClickURLTemplates && wrapper.videoCustomClickURLTemplates.length;
  unwrappedAd.creatives.forEach(function (creative) {
    // merge tracking events
    if (wrapper.trackingEvents && wrapper.trackingEvents[creative.type]) {
      for (var eventName in wrapper.trackingEvents[creative.type]) {
        var urls = wrapper.trackingEvents[creative.type][eventName];

        if (!Array.isArray(creative.trackingEvents[eventName])) {
          creative.trackingEvents[eventName] = [];
        }

        creative.trackingEvents[eventName] = creative.trackingEvents[eventName].concat(urls);
      }
    }

    if (creative.type === 'linear') {
      // merge video click tracking url
      if (wrapperHasVideoClickTracking) {
        creative.videoClickTrackingURLTemplates = creative.videoClickTrackingURLTemplates.concat(wrapper.videoClickTrackingURLTemplates);
      } // merge video custom click url


      if (wrapperHasVideoCustomClick) {
        creative.videoCustomClickURLTemplates = creative.videoCustomClickURLTemplates.concat(wrapper.videoCustomClickURLTemplates);
      } // VAST 2.0 support - Use Wrapper/linear/clickThrough when Inline/Linear/clickThrough is null


      if (wrapper.videoClickThroughURLTemplate && (creative.videoClickThroughURLTemplate === null || typeof creative.videoClickThroughURLTemplate === 'undefined')) {
        creative.videoClickThroughURLTemplate = wrapper.videoClickThroughURLTemplate;
      }
    } // pass wrapper companion trackers to all companions


    if (creative.type === 'companion' && wrapperCompanionClickTracking.length) {
      (creative.variations || []).forEach(function (variation) {
        variation.companionClickTrackingURLTemplates = util.joinArrayOfUniqueTemplateObjs(variation.companionClickTrackingURLTemplates, wrapperCompanionClickTracking);
      });
    }
  });

  if (wrapper.adVerifications) {
    // As specified by VAST specs unwrapped ads should contains wrapper adVerification script
    unwrappedAd.adVerifications = unwrappedAd.adVerifications.concat(wrapper.adVerifications);
  }

  if (wrapper.blockedAdCategories) {
    unwrappedAd.blockedAdCategories = unwrappedAd.blockedAdCategories.concat(wrapper.blockedAdCategories);
  }
}

var parserUtils = {
  childByName: childByName,
  childrenByName: childrenByName,
  resolveVastAdTagURI: resolveVastAdTagURI,
  parseBoolean: parseBoolean,
  parseNodeText: parseNodeText,
  copyNodeAttribute: copyNodeAttribute,
  parseAttributes: parseAttributes,
  parseDuration: parseDuration,
  splitVAST: splitVAST,
  assignAttributes: assignAttributes,
  mergeWrapperAdData: mergeWrapperAdData
};
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/parser/creative_companion_parser.js








/**
 * This module provides methods to parse a VAST CompanionAd Element.
 */

/**
 * Parses a CompanionAd.
 * @param  {Object} creativeElement - The VAST CompanionAd element to parse.
 * @param  {Object} creativeAttributes - The attributes of the CompanionAd (optional).
 * @return {Object} creative - The creative object.
 */

function parseCreativeCompanion(creativeElement, creativeAttributes) {
  var creative = createCreativeCompanion(creativeAttributes);
  creative.required = creativeElement.getAttribute('required') || null;
  creative.variations = parserUtils.childrenByName(creativeElement, 'Companion').map(function (companionResource) {
    var companionAd = createCompanionAd(parserUtils.parseAttributes(companionResource));
    companionAd.htmlResources = parserUtils.childrenByName(companionResource, 'HTMLResource').reduce(function (urls, resource) {
      var url = parserUtils.parseNodeText(resource);
      return url ? urls.concat(url) : urls;
    }, []);
    companionAd.iframeResources = parserUtils.childrenByName(companionResource, 'IFrameResource').reduce(function (urls, resource) {
      var url = parserUtils.parseNodeText(resource);
      return url ? urls.concat(url) : urls;
    }, []);
    companionAd.staticResources = parserUtils.childrenByName(companionResource, 'StaticResource').reduce(function (urls, resource) {
      var url = parserUtils.parseNodeText(resource);
      return url ? urls.concat({
        url: url,
        creativeType: resource.getAttribute('creativeType') || null
      }) : urls;
    }, []);
    companionAd.altText = parserUtils.parseNodeText(parserUtils.childByName(companionResource, 'AltText')) || null;
    var trackingEventsElement = parserUtils.childByName(companionResource, 'TrackingEvents');

    if (trackingEventsElement) {
      parserUtils.childrenByName(trackingEventsElement, 'Tracking').forEach(function (trackingElement) {
        var eventName = trackingElement.getAttribute('event');
        var trackingURLTemplate = parserUtils.parseNodeText(trackingElement);

        if (eventName && trackingURLTemplate) {
          if (!Array.isArray(companionAd.trackingEvents[eventName])) {
            companionAd.trackingEvents[eventName] = [];
          }

          companionAd.trackingEvents[eventName].push(trackingURLTemplate);
        }
      });
    }

    companionAd.companionClickTrackingURLTemplates = parserUtils.childrenByName(companionResource, 'CompanionClickTracking').map(function (clickTrackingElement) {
      return {
        id: clickTrackingElement.getAttribute('id') || null,
        url: parserUtils.parseNodeText(clickTrackingElement)
      };
    });
    companionAd.companionClickThroughURLTemplate = parserUtils.parseNodeText(parserUtils.childByName(companionResource, 'CompanionClickThrough')) || null;
    var adParametersElement = parserUtils.childByName(companionResource, 'AdParameters');

    if (adParametersElement) {
      companionAd.adParameters = parserUtils.parseNodeText(adParametersElement);
      companionAd.xmlEncoded = adParametersElement.getAttribute('xmlEncoded') || null;
    }

    return companionAd;
  });
  return creative;
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/creative/creative_linear.js

function createCreativeLinear() {
  var creativeAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _createCreative = createCreative(creativeAttributes),
      id = _createCreative.id,
      adId = _createCreative.adId,
      sequence = _createCreative.sequence,
      apiFramework = _createCreative.apiFramework;

  return {
    id: id,
    adId: adId,
    sequence: sequence,
    apiFramework: apiFramework,
    type: 'linear',
    duration: 0,
    skipDelay: null,
    mediaFiles: [],
    mezzanine: null,
    interactiveCreativeFile: null,
    closedCaptionFiles: [],
    videoClickThroughURLTemplate: null,
    videoClickTrackingURLTemplates: [],
    videoCustomClickURLTemplates: [],
    adParameters: null,
    icons: [],
    trackingEvents: {}
  };
}
function isCreativeLinear(ad) {
  return ad.type === 'linear';
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/closed_caption_file.js
function createClosedCaptionFile() {
  var closedCaptionAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    type: closedCaptionAttributes.type || null,
    language: closedCaptionAttributes.language || null,
    fileURL: null
  };
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/icon.js
function createIcon() {
  return {
    program: null,
    height: 0,
    width: 0,
    xPosition: 0,
    yPosition: 0,
    apiFramework: null,
    offset: null,
    duration: 0,
    type: null,
    staticResource: null,
    htmlResource: null,
    iframeResource: null,
    pxratio: '1',
    iconClickThroughURLTemplate: null,
    iconClickTrackingURLTemplates: [],
    iconViewTrackingURLTemplate: null
  };
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/interactive_creative_file.js

function createInteractiveCreativeFile() {
  var interactiveCreativeAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    type: interactiveCreativeAttributes.type || null,
    apiFramework: interactiveCreativeAttributes.apiFramework || null,
    variableDuration: parserUtils.parseBoolean(interactiveCreativeAttributes.variableDuration),
    fileURL: null
  };
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/media_file.js
function createMediaFile() {
  return {
    id: null,
    fileURL: null,
    fileSize: 0,
    deliveryType: 'progressive',
    mimeType: null,
    mediaType: null,
    codec: null,
    bitrate: 0,
    minBitrate: 0,
    maxBitrate: 0,
    width: 0,
    height: 0,
    apiFramework: null,
    // @deprecated in VAST 4.1. <InteractiveCreativeFile> should be used instead.
    scalable: null,
    maintainAspectRatio: null
  };
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/mezzanine.js
function createMezzanine() {
  return {
    id: null,
    fileURL: null,
    delivery: null,
    codec: null,
    type: null,
    width: 0,
    height: 0,
    fileSize: 0,
    mediaType: '2D'
  };
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/parser/creative_linear_parser.js











/**
 * This module provides methods to parse a VAST Linear Element.
 */

/**
 * Parses a Linear element.
 * @param  {Object} creativeElement - The VAST Linear element to parse.
 * @param  {any} creativeAttributes - The attributes of the Linear (optional).
 * @return {Object} creative - The creativeLinear object.
 */

function parseCreativeLinear(creativeElement, creativeAttributes) {
  var offset;
  var creative = createCreativeLinear(creativeAttributes);
  creative.duration = parserUtils.parseDuration(parserUtils.parseNodeText(parserUtils.childByName(creativeElement, 'Duration')));
  var skipOffset = creativeElement.getAttribute('skipoffset');

  if (typeof skipOffset === 'undefined' || skipOffset === null) {
    creative.skipDelay = null;
  } else if (skipOffset.charAt(skipOffset.length - 1) === '%' && creative.duration !== -1) {
    var percent = parseInt(skipOffset, 10);
    creative.skipDelay = creative.duration * (percent / 100);
  } else {
    creative.skipDelay = parserUtils.parseDuration(skipOffset);
  }

  var videoClicksElement = parserUtils.childByName(creativeElement, 'VideoClicks');

  if (videoClicksElement) {
    var videoClickThroughElement = parserUtils.childByName(videoClicksElement, 'ClickThrough');

    if (videoClickThroughElement) {
      creative.videoClickThroughURLTemplate = {
        id: videoClickThroughElement.getAttribute('id') || null,
        url: parserUtils.parseNodeText(videoClickThroughElement)
      };
    } else {
      creative.videoClickThroughURLTemplate = null;
    }

    parserUtils.childrenByName(videoClicksElement, 'ClickTracking').forEach(function (clickTrackingElement) {
      creative.videoClickTrackingURLTemplates.push({
        id: clickTrackingElement.getAttribute('id') || null,
        url: parserUtils.parseNodeText(clickTrackingElement)
      });
    });
    parserUtils.childrenByName(videoClicksElement, 'CustomClick').forEach(function (customClickElement) {
      creative.videoCustomClickURLTemplates.push({
        id: customClickElement.getAttribute('id') || null,
        url: parserUtils.parseNodeText(customClickElement)
      });
    });
  }

  var adParamsElement = parserUtils.childByName(creativeElement, 'AdParameters');

  if (adParamsElement) {
    creative.adParameters = parserUtils.parseNodeText(adParamsElement);
  }

  parserUtils.childrenByName(creativeElement, 'TrackingEvents').forEach(function (trackingEventsElement) {
    parserUtils.childrenByName(trackingEventsElement, 'Tracking').forEach(function (trackingElement) {
      var eventName = trackingElement.getAttribute('event');
      var trackingURLTemplate = parserUtils.parseNodeText(trackingElement);

      if (eventName && trackingURLTemplate) {
        if (eventName === 'progress') {
          offset = trackingElement.getAttribute('offset');

          if (!offset) {
            return;
          }

          if (offset.charAt(offset.length - 1) === '%') {
            eventName = "progress-".concat(offset);
          } else {
            eventName = "progress-".concat(Math.round(parserUtils.parseDuration(offset)));
          }
        }

        if (!Array.isArray(creative.trackingEvents[eventName])) {
          creative.trackingEvents[eventName] = [];
        }

        creative.trackingEvents[eventName].push(trackingURLTemplate);
      }
    });
  });
  parserUtils.childrenByName(creativeElement, 'MediaFiles').forEach(function (mediaFilesElement) {
    parserUtils.childrenByName(mediaFilesElement, 'MediaFile').forEach(function (mediaFileElement) {
      creative.mediaFiles.push(parseMediaFile(mediaFileElement));
    });
    var interactiveCreativeElement = parserUtils.childByName(mediaFilesElement, 'InteractiveCreativeFile');

    if (interactiveCreativeElement) {
      creative.interactiveCreativeFile = parseInteractiveCreativeFile(interactiveCreativeElement);
    }

    var closedCaptionElements = parserUtils.childByName(mediaFilesElement, 'ClosedCaptionFiles');

    if (closedCaptionElements) {
      parserUtils.childrenByName(closedCaptionElements, 'ClosedCaptionFile').forEach(function (closedCaptionElement) {
        var closedCaptionFile = createClosedCaptionFile(parserUtils.parseAttributes(closedCaptionElement));
        closedCaptionFile.fileURL = parserUtils.parseNodeText(closedCaptionElement);
        creative.closedCaptionFiles.push(closedCaptionFile);
      });
    }

    var mezzanineElement = parserUtils.childByName(mediaFilesElement, 'Mezzanine');
    var requiredAttributes = getRequiredAttributes(mezzanineElement, ['delivery', 'type', 'width', 'height']);

    if (requiredAttributes) {
      var mezzanine = createMezzanine();
      mezzanine.id = mezzanineElement.getAttribute('id');
      mezzanine.fileURL = parserUtils.parseNodeText(mezzanineElement);
      mezzanine.delivery = requiredAttributes.delivery;
      mezzanine.codec = mezzanineElement.getAttribute('codec');
      mezzanine.type = requiredAttributes.type;
      mezzanine.width = parseInt(requiredAttributes.width, 10);
      mezzanine.height = parseInt(requiredAttributes.height, 10);
      mezzanine.fileSize = parseInt(mezzanineElement.getAttribute('fileSize'), 10);
      mezzanine.mediaType = mezzanineElement.getAttribute('mediaType') || '2D';
      creative.mezzanine = mezzanine;
    }
  });
  var iconsElement = parserUtils.childByName(creativeElement, 'Icons');

  if (iconsElement) {
    parserUtils.childrenByName(iconsElement, 'Icon').forEach(function (iconElement) {
      creative.icons.push(parseIcon(iconElement));
    });
  }

  return creative;
}
/**
 * Parses the MediaFile element from VAST.
 * @param  {Object} mediaFileElement - The VAST MediaFile element.
 * @return {Object} - Parsed mediaFile object.
 */

function parseMediaFile(mediaFileElement) {
  var mediaFile = createMediaFile();
  mediaFile.id = mediaFileElement.getAttribute('id');
  mediaFile.fileURL = parserUtils.parseNodeText(mediaFileElement);
  mediaFile.deliveryType = mediaFileElement.getAttribute('delivery');
  mediaFile.codec = mediaFileElement.getAttribute('codec');
  mediaFile.mimeType = mediaFileElement.getAttribute('type');
  mediaFile.mediaType = mediaFileElement.getAttribute('mediaType') || '2D';
  mediaFile.apiFramework = mediaFileElement.getAttribute('apiFramework');
  mediaFile.fileSize = parseInt(mediaFileElement.getAttribute('fileSize') || 0);
  mediaFile.bitrate = parseInt(mediaFileElement.getAttribute('bitrate') || 0);
  mediaFile.minBitrate = parseInt(mediaFileElement.getAttribute('minBitrate') || 0);
  mediaFile.maxBitrate = parseInt(mediaFileElement.getAttribute('maxBitrate') || 0);
  mediaFile.width = parseInt(mediaFileElement.getAttribute('width') || 0);
  mediaFile.height = parseInt(mediaFileElement.getAttribute('height') || 0);
  var scalable = mediaFileElement.getAttribute('scalable');

  if (scalable && typeof scalable === 'string') {
    mediaFile.scalable = parserUtils.parseBoolean(scalable);
  }

  var maintainAspectRatio = mediaFileElement.getAttribute('maintainAspectRatio');

  if (maintainAspectRatio && typeof maintainAspectRatio === 'string') {
    mediaFile.maintainAspectRatio = parserUtils.parseBoolean(maintainAspectRatio);
  }

  return mediaFile;
}
/**
 * Parses the InteractiveCreativeFile element from VAST MediaFiles node.
 * @param  {Object} interactiveCreativeElement - The VAST InteractiveCreativeFile element.
 * @return {Object} - Parsed interactiveCreativeFile object.
 */


function parseInteractiveCreativeFile(interactiveCreativeElement) {
  var interactiveCreativeFile = createInteractiveCreativeFile(parserUtils.parseAttributes(interactiveCreativeElement));
  interactiveCreativeFile.fileURL = parserUtils.parseNodeText(interactiveCreativeElement);
  return interactiveCreativeFile;
}
/**
 * Parses the Icon element from VAST.
 * @param  {Object} iconElement - The VAST Icon element.
 * @return {Object} - Parsed icon object.
 */


function parseIcon(iconElement) {
  var icon = createIcon(iconElement);
  icon.program = iconElement.getAttribute('program');
  icon.height = parseInt(iconElement.getAttribute('height') || 0);
  icon.width = parseInt(iconElement.getAttribute('width') || 0);
  icon.xPosition = parseXPosition(iconElement.getAttribute('xPosition'));
  icon.yPosition = parseYPosition(iconElement.getAttribute('yPosition'));
  icon.apiFramework = iconElement.getAttribute('apiFramework');
  icon.pxratio = iconElement.getAttribute('pxratio') || '1';
  icon.offset = parserUtils.parseDuration(iconElement.getAttribute('offset'));
  icon.duration = parserUtils.parseDuration(iconElement.getAttribute('duration'));
  parserUtils.childrenByName(iconElement, 'HTMLResource').forEach(function (htmlElement) {
    icon.type = htmlElement.getAttribute('creativeType') || 'text/html';
    icon.htmlResource = parserUtils.parseNodeText(htmlElement);
  });
  parserUtils.childrenByName(iconElement, 'IFrameResource').forEach(function (iframeElement) {
    icon.type = iframeElement.getAttribute('creativeType') || 0;
    icon.iframeResource = parserUtils.parseNodeText(iframeElement);
  });
  parserUtils.childrenByName(iconElement, 'StaticResource').forEach(function (staticElement) {
    icon.type = staticElement.getAttribute('creativeType') || 0;
    icon.staticResource = parserUtils.parseNodeText(staticElement);
  });
  var iconClicksElement = parserUtils.childByName(iconElement, 'IconClicks');

  if (iconClicksElement) {
    icon.iconClickThroughURLTemplate = parserUtils.parseNodeText(parserUtils.childByName(iconClicksElement, 'IconClickThrough'));
    parserUtils.childrenByName(iconClicksElement, 'IconClickTracking').forEach(function (iconClickTrackingElement) {
      icon.iconClickTrackingURLTemplates.push({
        id: iconClickTrackingElement.getAttribute('id') || null,
        url: parserUtils.parseNodeText(iconClickTrackingElement)
      });
    });
  }

  icon.iconViewTrackingURLTemplate = parserUtils.parseNodeText(parserUtils.childByName(iconElement, 'IconViewTracking'));
  return icon;
}
/**
 * Parses an horizontal position into a String ('left' or 'right') or into a Number.
 * @param  {String} xPosition - The x position to parse.
 * @return {String|Number}
 */


function parseXPosition(xPosition) {
  if (['left', 'right'].indexOf(xPosition) !== -1) {
    return xPosition;
  }

  return parseInt(xPosition || 0);
}
/**
 * Parses an vertical position into a String ('top' or 'bottom') or into a Number.
 * @param  {String} yPosition - The x position to parse.
 * @return {String|Number}
 */


function parseYPosition(yPosition) {
  if (['top', 'bottom'].indexOf(yPosition) !== -1) {
    return yPosition;
  }

  return parseInt(yPosition || 0);
}
/**
 * Getting required attributes from element
 * @param  {Object} element - DOM element
 * @param  {Array} attributes - list of attributes
 * @return {Object|null} null if a least one element not present
 */


function getRequiredAttributes(element, attributes) {
  var values = {};
  var error = false;
  attributes.forEach(function (name) {
    if (!element || !element.getAttribute(name)) {
      error = true;
    } else {
      values[name] = element.getAttribute(name);
    }
  });
  return error ? null : values;
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/creative/creative_non_linear.js

function createCreativeNonLinear() {
  var creativeAttributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _createCreative = createCreative(creativeAttributes),
      id = _createCreative.id,
      adId = _createCreative.adId,
      sequence = _createCreative.sequence,
      apiFramework = _createCreative.apiFramework;

  return {
    id: id,
    adId: adId,
    sequence: sequence,
    apiFramework: apiFramework,
    type: 'nonlinear',
    variations: [],
    trackingEvents: {}
  };
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/non_linear_ad.js
function createNonLinearAd() {
  return {
    id: null,
    width: 0,
    height: 0,
    expandedWidth: 0,
    expandedHeight: 0,
    scalable: true,
    maintainAspectRatio: true,
    minSuggestedDuration: 0,
    apiFramework: 'static',
    adType: 'nonLinearAd',
    type: null,
    staticResource: null,
    htmlResource: null,
    iframeResource: null,
    nonlinearClickThroughURLTemplate: null,
    nonlinearClickTrackingURLTemplates: [],
    adParameters: null
  };
}
function isNonLinearAd(ad) {
  return ad.adType === 'nonLinearAd';
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/parser/creative_non_linear_parser.js





/**
 * This module provides methods to parse a VAST NonLinear Element.
 */

/**
 * Parses a NonLinear element.
 * @param  {any} creativeElement - The VAST NonLinear element to parse.
 * @param  {any} creativeAttributes - The attributes of the NonLinear (optional).
 * @return {Object} creative - The CreativeNonLinear object.
 */

function parseCreativeNonLinear(creativeElement, creativeAttributes) {
  var creative = createCreativeNonLinear(creativeAttributes);
  parserUtils.childrenByName(creativeElement, 'TrackingEvents').forEach(function (trackingEventsElement) {
    var eventName, trackingURLTemplate;
    parserUtils.childrenByName(trackingEventsElement, 'Tracking').forEach(function (trackingElement) {
      eventName = trackingElement.getAttribute('event');
      trackingURLTemplate = parserUtils.parseNodeText(trackingElement);

      if (eventName && trackingURLTemplate) {
        if (!Array.isArray(creative.trackingEvents[eventName])) {
          creative.trackingEvents[eventName] = [];
        }

        creative.trackingEvents[eventName].push(trackingURLTemplate);
      }
    });
  });
  parserUtils.childrenByName(creativeElement, 'NonLinear').forEach(function (nonlinearResource) {
    var nonlinearAd = createNonLinearAd();
    nonlinearAd.id = nonlinearResource.getAttribute('id') || null;
    nonlinearAd.width = nonlinearResource.getAttribute('width');
    nonlinearAd.height = nonlinearResource.getAttribute('height');
    nonlinearAd.expandedWidth = nonlinearResource.getAttribute('expandedWidth');
    nonlinearAd.expandedHeight = nonlinearResource.getAttribute('expandedHeight');
    nonlinearAd.scalable = parserUtils.parseBoolean(nonlinearResource.getAttribute('scalable'));
    nonlinearAd.maintainAspectRatio = parserUtils.parseBoolean(nonlinearResource.getAttribute('maintainAspectRatio'));
    nonlinearAd.minSuggestedDuration = parserUtils.parseDuration(nonlinearResource.getAttribute('minSuggestedDuration'));
    nonlinearAd.apiFramework = nonlinearResource.getAttribute('apiFramework');
    parserUtils.childrenByName(nonlinearResource, 'HTMLResource').forEach(function (htmlElement) {
      nonlinearAd.type = htmlElement.getAttribute('creativeType') || 'text/html';
      nonlinearAd.htmlResource = parserUtils.parseNodeText(htmlElement);
    });
    parserUtils.childrenByName(nonlinearResource, 'IFrameResource').forEach(function (iframeElement) {
      nonlinearAd.type = iframeElement.getAttribute('creativeType') || 0;
      nonlinearAd.iframeResource = parserUtils.parseNodeText(iframeElement);
    });
    parserUtils.childrenByName(nonlinearResource, 'StaticResource').forEach(function (staticElement) {
      nonlinearAd.type = staticElement.getAttribute('creativeType') || 0;
      nonlinearAd.staticResource = parserUtils.parseNodeText(staticElement);
    });
    var adParamsElement = parserUtils.childByName(nonlinearResource, 'AdParameters');

    if (adParamsElement) {
      nonlinearAd.adParameters = parserUtils.parseNodeText(adParamsElement);
    }

    nonlinearAd.nonlinearClickThroughURLTemplate = parserUtils.parseNodeText(parserUtils.childByName(nonlinearResource, 'NonLinearClickThrough'));
    parserUtils.childrenByName(nonlinearResource, 'NonLinearClickTracking').forEach(function (clickTrackingElement) {
      nonlinearAd.nonlinearClickTrackingURLTemplates.push({
        id: clickTrackingElement.getAttribute('id') || null,
        url: parserUtils.parseNodeText(clickTrackingElement)
      });
    });
    creative.variations.push(nonlinearAd);
  });
  return creative;
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/extension.js

function createExtension() {
  return {
    name: null,
    value: null,
    attributes: {},
    children: []
  };
}
function isEmptyExtension(extension) {
  return extension.value === null && Object.keys(extension.attributes).length === 0 && extension.children.length === 0;
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/parser/extensions_parser.js






/**
 * Parses an array of Extension elements.
 * @param  {Node[]} extensions - The array of extensions to parse.
 * @param  {String} type - The type of extensions to parse.(Ad|Creative)
 * @return {AdExtension[]|CreativeExtension[]} - The nodes parsed to extensions
 */

function parseExtensions(extensions) {
  var exts = [];
  extensions.forEach(function (extNode) {
    var ext = _parseExtension(extNode);

    if (ext) {
      exts.push(ext);
    }
  });
  return exts;
}
/**
 * Parses an extension child node
 * @param {Node} extNode - The extension node to parse
 * @return {AdExtension|CreativeExtension|null} - The node parsed to extension
 */

function _parseExtension(extNode) {
  // Ignore comments
  if (extNode.nodeName === '#comment') return null;
  var ext = createExtension();
  var extNodeAttrs = extNode.attributes;
  var childNodes = extNode.childNodes;
  ext.name = extNode.nodeName; // Parse attributes

  if (extNode.attributes) {
    for (var extNodeAttrKey in extNodeAttrs) {
      if (extNodeAttrs.hasOwnProperty(extNodeAttrKey)) {
        var extNodeAttr = extNodeAttrs[extNodeAttrKey];

        if (extNodeAttr.nodeName && extNodeAttr.nodeValue) {
          ext.attributes[extNodeAttr.nodeName] = extNodeAttr.nodeValue;
        }
      }
    }
  } // Parse all children


  for (var childNodeKey in childNodes) {
    if (childNodes.hasOwnProperty(childNodeKey)) {
      var parsedChild = _parseExtension(childNodes[childNodeKey]);

      if (parsedChild) {
        ext.children.push(parsedChild);
      }
    }
  }
  /*
    Only parse value of Nodes with only eather no children or only a cdata or text
    to avoid useless parsing that would result to a concatenation of all children
  */


  if (ext.children.length === 0 || ext.children.length === 1 && ['#cdata-section', '#text'].indexOf(ext.children[0].name) >= 0) {
    var txt = parserUtils.parseNodeText(extNode);

    if (txt !== '') {
      ext.value = txt;
    } // Remove the children if it's a cdata or simply text to avoid useless children


    ext.children = [];
  } // Only return not empty objects to not pollute extentions


  return isEmptyExtension(ext) ? null : ext;
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/parser/creatives_parser.js







/**
 * Parses the creatives from the Creatives Node.
 * @param  {any} creativeNodes - The creative nodes to parse.
 * @return {Array<Creative>} - An array of Creative objects.
 */

function parseCreatives(creativeNodes) {
  var creatives = [];
  creativeNodes.forEach(function (creativeElement) {
    var creativeAttributes = {
      id: creativeElement.getAttribute('id') || null,
      adId: parseCreativeAdIdAttribute(creativeElement),
      sequence: creativeElement.getAttribute('sequence') || null,
      apiFramework: creativeElement.getAttribute('apiFramework') || null
    };
    var universalAdIds = [];
    var universalAdIdElements = parserUtils.childrenByName(creativeElement, 'UniversalAdId');
    universalAdIdElements.forEach(function (universalAdIdElement) {
      var universalAdId = {
        idRegistry: universalAdIdElement.getAttribute('idRegistry') || 'unknown',
        value: parserUtils.parseNodeText(universalAdIdElement)
      };
      universalAdIds.push(universalAdId);
    });
    var creativeExtensions;
    var creativeExtensionsElement = parserUtils.childByName(creativeElement, 'CreativeExtensions');

    if (creativeExtensionsElement) {
      creativeExtensions = parseExtensions(parserUtils.childrenByName(creativeExtensionsElement, 'CreativeExtension'));
    }

    for (var creativeTypeElementKey in creativeElement.childNodes) {
      var creativeTypeElement = creativeElement.childNodes[creativeTypeElementKey];
      var parsedCreative = void 0;

      switch (creativeTypeElement.nodeName) {
        case 'Linear':
          parsedCreative = parseCreativeLinear(creativeTypeElement, creativeAttributes);
          break;

        case 'NonLinearAds':
          parsedCreative = parseCreativeNonLinear(creativeTypeElement, creativeAttributes);
          break;

        case 'CompanionAds':
          parsedCreative = parseCreativeCompanion(creativeTypeElement, creativeAttributes);
          break;
      }

      if (parsedCreative) {
        if (universalAdIds) {
          parsedCreative.universalAdIds = universalAdIds;
        }

        if (creativeExtensions) {
          parsedCreative.creativeExtensions = creativeExtensions;
        }

        creatives.push(parsedCreative);
      }
    }
  });
  return creatives;
}
/**
 * Parses the creative adId Attribute.
 * @param  {any} creativeElement - The creative element to retrieve the adId from.
 * @return {String|null}
 */

function parseCreativeAdIdAttribute(creativeElement) {
  return creativeElement.getAttribute('AdID') || // VAST 2 spec
  creativeElement.getAttribute('adID') || // VAST 3 spec
  creativeElement.getAttribute('adId') || // VAST 4 spec
  null;
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/util/requiredValues.js
var requiredValues = {
  Wrapper: {
    subElements: ['VASTAdTagURI', 'Impression']
  },
  BlockedAdCategories: {
    attributes: ['authority']
  },
  InLine: {
    subElements: ['AdSystem', 'AdTitle', 'Impression', 'AdServingId', 'Creatives']
  },
  Category: {
    attributes: ['authority']
  },
  Pricing: {
    attributes: ['model', 'currency']
  },
  Verification: {
    oneOfinLineResources: ['JavaScriptResource', 'ExecutableResource'],
    attributes: ['vendor']
  },
  UniversalAdId: {
    attributes: ['idRegistry']
  },
  JavaScriptResource: {
    attributes: ['apiFramework', 'browserOptional']
  },
  ExecutableResource: {
    attributes: ['apiFramework', 'type']
  },
  Tracking: {
    attributes: ['event']
  },
  Creatives: {
    subElements: ['Creative']
  },
  Creative: {
    subElements: ['UniversalAdId']
  },
  Linear: {
    subElements: ['MediaFiles', 'Duration']
  },
  MediaFiles: {
    subElements: ['MediaFile']
  },
  MediaFile: {
    attributes: ['delivery', 'type', 'width', 'height']
  },
  Mezzanine: {
    attributes: ['delivery', 'type', 'width', 'height']
  },
  NonLinear: {
    oneOfinLineResources: ['StaticResource', 'IFrameResource', 'HTMLResource'],
    attributes: ['width', 'height']
  },
  Companion: {
    oneOfinLineResources: ['StaticResource', 'IFrameResource', 'HTMLResource'],
    attributes: ['width', 'height']
  },
  StaticResource: {
    attributes: ['creativeType']
  },
  Icons: {
    subElements: ['Icon']
  },
  Icon: {
    oneOfinLineResources: ['StaticResource', 'IFrameResource', 'HTMLResource']
  }
};
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/parser/parser_verification.js






/**
 * Verify node required values and also verify recursively all his child nodes.
 * Trigger warnings if a node required value is missing.
 * @param  {Node} node - The node element.
 * @param  {Function} emit - Emit function used to trigger Warning event.
 * @emits  VASTParser#VAST-warning
 * @param  {undefined|Boolean} [isAdInline] - Passed recursively to itself. True if the node is contained inside a inLine tag.
 */

function verifyRequiredValues(node, emit, isAdInline) {
  if (!node || !node.nodeName) {
    return;
  }

  if (node.nodeName === 'InLine') {
    isAdInline = true;
  }

  verifyRequiredAttributes(node, emit);

  if (hasSubElements(node)) {
    verifyRequiredSubElements(node, emit, isAdInline);

    for (var i = 0; i < node.children.length; i++) {
      verifyRequiredValues(node.children[i], emit, isAdInline);
    }
  } else if (parserUtils.parseNodeText(node).length === 0) {
    emitMissingValueWarning({
      name: node.nodeName,
      parentName: node.parentNode.nodeName
    }, emit);
  }
}
/**
 * Verify and trigger warnings if node required attributes are not set.
 * @param  {Node} node - The node element.
 * @param  {Function} emit - Emit function used to trigger Warning event.
 * @emits  VASTParser#VAST-warning
 */


function verifyRequiredAttributes(node, emit) {
  if (!requiredValues[node.nodeName] || !requiredValues[node.nodeName].attributes) {
    return;
  }

  var requiredAttributes = requiredValues[node.nodeName].attributes;
  var missingAttributes = requiredAttributes.filter(function (attributeName) {
    return !node.getAttribute(attributeName);
  });

  if (missingAttributes.length > 0) {
    emitMissingValueWarning({
      name: node.nodeName,
      parentName: node.parentNode.nodeName,
      attributes: missingAttributes
    }, emit);
  }
}
/**
 * Verify and trigger warnings if node required sub element are not set.
 * @param  {Node} node - The node element
 * @param  {Boolean} isAdInline - True if node is contained in a inline
 * @param  {Function} emit - Emit function used to trigger Warning event.
 * @emits  VASTParser#VAST-warning
 */


function verifyRequiredSubElements(node, emit, isAdInline) {
  var required = requiredValues[node.nodeName]; // Do not verify subelement if node is a child of wrapper, but verify it if node is the Wrapper itself
  // Wrapper child have no required subElement. (Only InLine does)

  var isInWrapperButNotWrapperItself = !isAdInline && node.nodeName !== 'Wrapper';

  if (!required || isInWrapperButNotWrapperItself) {
    return;
  }

  if (required.subElements) {
    var requiredSubElements = required.subElements;
    var missingSubElements = requiredSubElements.filter(function (subElementName) {
      return !parserUtils.childByName(node, subElementName);
    });

    if (missingSubElements.length > 0) {
      emitMissingValueWarning({
        name: node.nodeName,
        parentName: node.parentNode.nodeName,
        subElements: missingSubElements
      }, emit);
    }
  } // When InLine format is used some nodes (i.e <NonLinear>, <Companion>, or <Icon>)
  // require at least one of the following resources: StaticResource, IFrameResource, HTMLResource


  if (!isAdInline || !required.oneOfinLineResources) {
    return;
  }

  var resourceFound = required.oneOfinLineResources.some(function (resource) {
    return parserUtils.childByName(node, resource);
  });

  if (!resourceFound) {
    emitMissingValueWarning({
      name: node.nodeName,
      parentName: node.parentNode.nodeName,
      oneOfResources: required.oneOfinLineResources
    }, emit);
  }
}
/**
 * Check if a node has sub elements.
 * @param  {Node} node - The node element.
 * @returns {Boolean}
 */


function hasSubElements(node) {
  return node.children && node.children.length !== 0;
}
/**
 * Trigger Warning if a element is empty or has missing attributes/subelements/resources
 * @param  {Object} missingElement - Object containing missing elements and values
 * @param  {String} missingElement.name - The name of element containing missing values
 * @param  {String} missingElement.parentName - The parent name of element containing missing values
 * @param  {Array} missingElement.attributes - The array of missing attributes
 * @param  {Array} missingElement.subElements - The array of missing sub elements
 * @param  {Array} missingElement.oneOfResources - The array of resources in which at least one must be provided by the element
 * @param  {Function} emit - Emit function used to trigger Warning event.
 * @emits  VastParser#VAST-warning
 */


function emitMissingValueWarning(_ref, emit) {
  var name = _ref.name,
      parentName = _ref.parentName,
      attributes = _ref.attributes,
      subElements = _ref.subElements,
      oneOfResources = _ref.oneOfResources;
  var message = "Element '".concat(name, "'");

  if (attributes) {
    message += " missing required attribute(s) '".concat(attributes.join(', '), "' ");
  } else if (subElements) {
    message += " missing required sub element(s) '".concat(subElements.join(', '), "' ");
  } else if (oneOfResources) {
    message += " must provide one of the following '".concat(oneOfResources.join(', '), "' ");
  } else {
    message += " is empty";
  }

  emit('VAST-warning', {
    message: message,
    parentElement: parentName,
    specVersion: 4.1
  });
}

var parserVerification = {
  verifyRequiredValues: verifyRequiredValues,
  hasSubElements: hasSubElements,
  emitMissingValueWarning: emitMissingValueWarning,
  verifyRequiredAttributes: verifyRequiredAttributes,
  verifyRequiredSubElements: verifyRequiredSubElements
};
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/parser/ad_parser.js













/**
 * This module provides methods to parse a VAST Ad Element.
 */

/**
 * Parses an Ad element (can either be a Wrapper or an InLine).
 * @param  {Object} adElement - The VAST Ad element to parse.
 * @param  {Function} emit - Emit function used to trigger Warning event
 * @param  {Object} options - An optional Object of parameters to be used in the parsing process.
 * @emits  VASTParser#VAST-warning
 * @return {Object|undefined} - Object containing the ad and if it is wrapper/inline
 */

function parseAd(adElement, emit) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      allowMultipleAds = _ref.allowMultipleAds,
      followAdditionalWrappers = _ref.followAdditionalWrappers;

  var childNodes = adElement.childNodes;

  for (var adTypeElementKey in childNodes) {
    var adTypeElement = childNodes[adTypeElementKey];

    if (['Wrapper', 'InLine'].indexOf(adTypeElement.nodeName) === -1) {
      continue;
    }

    if (adTypeElement.nodeName === 'Wrapper' && followAdditionalWrappers === false) {
      continue;
    }

    parserUtils.copyNodeAttribute('id', adElement, adTypeElement);
    parserUtils.copyNodeAttribute('sequence', adElement, adTypeElement);
    parserUtils.copyNodeAttribute('adType', adElement, adTypeElement);

    if (adTypeElement.nodeName === 'Wrapper') {
      return {
        ad: parseWrapper(adTypeElement, emit),
        type: 'WRAPPER'
      };
    } else if (adTypeElement.nodeName === 'InLine') {
      return {
        ad: parseInLine(adTypeElement, emit, {
          allowMultipleAds: allowMultipleAds
        }),
        type: 'INLINE'
      };
    }
  }
}
/**
 * Parses an Inline
 * @param  {Object} adElement Element - The VAST Inline element to parse.
 * @param  {Function} emit - Emit function used to trigger Warning event.
 * @param  {Object} options - An optional Object of parameters to be used in the parsing process.
 * @emits  VASTParser#VAST-warning
 * @return {Object} ad - The ad object.
 */

function parseInLine(adElement, emit) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      allowMultipleAds = _ref2.allowMultipleAds;

  // if allowMultipleAds is set to false by wrapper attribute
  // only the first stand-alone Ad (with no sequence values) in the
  // requested VAST response is allowed so we won't parse ads with sequence
  if (allowMultipleAds === false && adElement.getAttribute('sequence')) {
    return null;
  }

  return parseAdElement(adElement, emit);
}
/**
 * Parses an ad type (Inline or Wrapper)
 * @param  {Object} adTypeElement - The VAST Inline or Wrapper element to parse.
 * @param  {Function} emit - Emit function used to trigger Warning event.
 * @emits  VASTParser#VAST-warning
 * @return {Object} ad - The ad object.
 */


function parseAdElement(adTypeElement, emit) {
  var adVerificationsFromExtensions = [];

  if (emit) {
    parserVerification.verifyRequiredValues(adTypeElement, emit);
  }

  var childNodes = adTypeElement.childNodes;
  var ad = createAd(parserUtils.parseAttributes(adTypeElement));

  for (var nodeKey in childNodes) {
    var node = childNodes[nodeKey];

    switch (node.nodeName) {
      case 'Error':
        ad.errorURLTemplates.push(parserUtils.parseNodeText(node));
        break;

      case 'Impression':
        ad.impressionURLTemplates.push({
          id: node.getAttribute('id') || null,
          url: parserUtils.parseNodeText(node)
        });
        break;

      case 'Creatives':
        ad.creatives = parseCreatives(parserUtils.childrenByName(node, 'Creative'));
        break;

      case 'Extensions':
        {
          var extNodes = parserUtils.childrenByName(node, 'Extension');
          ad.extensions = parseExtensions(extNodes);
          /*
            OMID specify adVerifications should be in extensions for VAST < 4.0
            To avoid to put them on two different places in two different format we reparse it
            from extensions the same way than for an AdVerifications node.
          */

          if (!ad.adVerifications.length) {
            adVerificationsFromExtensions = _parseAdVerificationsFromExtensions(extNodes);
          }

          break;
        }

      case 'AdVerifications':
        ad.adVerifications = _parseAdVerifications(parserUtils.childrenByName(node, 'Verification'));
        break;

      case 'AdSystem':
        ad.system = {
          value: parserUtils.parseNodeText(node),
          version: node.getAttribute('version') || null
        };
        break;

      case 'AdTitle':
        ad.title = parserUtils.parseNodeText(node);
        break;

      case 'AdServingId':
        ad.adServingId = parserUtils.parseNodeText(node);
        break;

      case 'Category':
        ad.categories.push({
          authority: node.getAttribute('authority') || null,
          value: parserUtils.parseNodeText(node)
        });
        break;

      case 'Expires':
        ad.expires = parseInt(parserUtils.parseNodeText(node), 10);
        break;

      case 'ViewableImpression':
        ad.viewableImpression.push(_parseViewableImpression(node));
        break;

      case 'Description':
        ad.description = parserUtils.parseNodeText(node);
        break;

      case 'Advertiser':
        ad.advertiser = {
          id: node.getAttribute('id') || null,
          value: parserUtils.parseNodeText(node)
        };
        break;

      case 'Pricing':
        ad.pricing = {
          value: parserUtils.parseNodeText(node),
          model: node.getAttribute('model') || null,
          currency: node.getAttribute('currency') || null
        };
        break;

      case 'Survey':
        ad.survey = parserUtils.parseNodeText(node);
        break;

      case 'BlockedAdCategories':
        ad.blockedAdCategories.push({
          authority: node.getAttribute('authority') || null,
          value: parserUtils.parseNodeText(node)
        });
        break;
    }
  }

  if (adVerificationsFromExtensions.length) {
    ad.adVerifications = ad.adVerifications.concat(adVerificationsFromExtensions);
  }

  return ad;
}
/**
 * Parses a Wrapper element without resolving the wrapped urls.
 * @param  {Object} wrapperElement - The VAST Wrapper element to be parsed.
 * @param  {Function} emit - Emit function used to trigger Warning event.
 * @emits  VASTParser#VAST-warning
 * @return {Ad}
 */


function parseWrapper(wrapperElement, emit) {
  var ad = parseAdElement(wrapperElement, emit);
  var followAdditionalWrappersValue = wrapperElement.getAttribute('followAdditionalWrappers');
  var allowMultipleAdsValue = wrapperElement.getAttribute('allowMultipleAds');
  var fallbackOnNoAdValue = wrapperElement.getAttribute('fallbackOnNoAd');
  ad.followAdditionalWrappers = followAdditionalWrappersValue ? parserUtils.parseBoolean(followAdditionalWrappersValue) : true;
  ad.allowMultipleAds = allowMultipleAdsValue ? parserUtils.parseBoolean(allowMultipleAdsValue) : false;
  ad.fallbackOnNoAd = fallbackOnNoAdValue ? parserUtils.parseBoolean(fallbackOnNoAdValue) : null;
  var wrapperURLElement = parserUtils.childByName(wrapperElement, 'VASTAdTagURI');

  if (wrapperURLElement) {
    ad.nextWrapperURL = parserUtils.parseNodeText(wrapperURLElement);
  } else {
    wrapperURLElement = parserUtils.childByName(wrapperElement, 'VASTAdTagURL');

    if (wrapperURLElement) {
      ad.nextWrapperURL = parserUtils.parseNodeText(parserUtils.childByName(wrapperURLElement, 'URL'));
    }
  }

  ad.creatives.forEach(function (wrapperCreativeElement) {
    if (['linear', 'nonlinear'].indexOf(wrapperCreativeElement.type) !== -1) {
      // TrackingEvents Linear / NonLinear
      if (wrapperCreativeElement.trackingEvents) {
        if (!ad.trackingEvents) {
          ad.trackingEvents = {};
        }

        if (!ad.trackingEvents[wrapperCreativeElement.type]) {
          ad.trackingEvents[wrapperCreativeElement.type] = {};
        }

        var _loop = function _loop(eventName) {
          var urls = wrapperCreativeElement.trackingEvents[eventName];

          if (!Array.isArray(ad.trackingEvents[wrapperCreativeElement.type][eventName])) {
            ad.trackingEvents[wrapperCreativeElement.type][eventName] = [];
          }

          urls.forEach(function (url) {
            ad.trackingEvents[wrapperCreativeElement.type][eventName].push(url);
          });
        };

        for (var eventName in wrapperCreativeElement.trackingEvents) {
          _loop(eventName);
        }
      } // ClickTracking


      if (wrapperCreativeElement.videoClickTrackingURLTemplates) {
        if (!Array.isArray(ad.videoClickTrackingURLTemplates)) {
          ad.videoClickTrackingURLTemplates = [];
        } // tmp property to save wrapper tracking URLs until they are merged


        wrapperCreativeElement.videoClickTrackingURLTemplates.forEach(function (item) {
          ad.videoClickTrackingURLTemplates.push(item);
        });
      } // ClickThrough


      if (wrapperCreativeElement.videoClickThroughURLTemplate) {
        ad.videoClickThroughURLTemplate = wrapperCreativeElement.videoClickThroughURLTemplate;
      } // CustomClick


      if (wrapperCreativeElement.videoCustomClickURLTemplates) {
        if (!Array.isArray(ad.videoCustomClickURLTemplates)) {
          ad.videoCustomClickURLTemplates = [];
        } // tmp property to save wrapper tracking URLs until they are merged


        wrapperCreativeElement.videoCustomClickURLTemplates.forEach(function (item) {
          ad.videoCustomClickURLTemplates.push(item);
        });
      }
    }
  });

  if (ad.nextWrapperURL) {
    return ad;
  }
}
/**
 * Parses the AdVerifications Element.
 * @param  {Array} verifications - The array of verifications to parse.
 * @return {Array<Object>}
 */


function _parseAdVerifications(verifications) {
  var ver = [];
  verifications.forEach(function (verificationNode) {
    var verification = createAdVerification();
    var childNodes = verificationNode.childNodes;
    parserUtils.assignAttributes(verificationNode.attributes, verification);

    for (var nodeKey in childNodes) {
      var node = childNodes[nodeKey];

      switch (node.nodeName) {
        case 'JavaScriptResource':
        case 'ExecutableResource':
          verification.resource = parserUtils.parseNodeText(node);
          parserUtils.assignAttributes(node.attributes, verification);
          break;

        case 'VerificationParameters':
          verification.parameters = parserUtils.parseNodeText(node);
          break;
      }
    }

    var trackingEventsElement = parserUtils.childByName(verificationNode, 'TrackingEvents');

    if (trackingEventsElement) {
      parserUtils.childrenByName(trackingEventsElement, 'Tracking').forEach(function (trackingElement) {
        var eventName = trackingElement.getAttribute('event');
        var trackingURLTemplate = parserUtils.parseNodeText(trackingElement);

        if (eventName && trackingURLTemplate) {
          if (!Array.isArray(verification.trackingEvents[eventName])) {
            verification.trackingEvents[eventName] = [];
          }

          verification.trackingEvents[eventName].push(trackingURLTemplate);
        }
      });
    }

    ver.push(verification);
  });
  return ver;
}
/**
 * Parses the AdVerifications Element from extension for versions < 4.0
 * @param  {Array<Node>} extensions - The array of extensions to parse.
 * @return {Array<Object>}
 */

function _parseAdVerificationsFromExtensions(extensions) {
  var adVerificationsNode = null,
      adVerifications = []; // Find the first (and only) AdVerifications node from extensions

  extensions.some(function (extension) {
    return adVerificationsNode = parserUtils.childByName(extension, 'AdVerifications');
  }); // Parse it if we get it

  if (adVerificationsNode) {
    adVerifications = _parseAdVerifications(parserUtils.childrenByName(adVerificationsNode, 'Verification'));
  }

  return adVerifications;
}
/**
 * Parses the ViewableImpression Element.
 * @param  {Object} viewableImpressionNode - The ViewableImpression node element.
 * @return {Object} viewableImpression - The viewableImpression object
 */

function _parseViewableImpression(viewableImpressionNode) {
  var viewableImpression = {};
  viewableImpression.id = viewableImpressionNode.getAttribute('id') || null;
  var viewableImpressionChildNodes = viewableImpressionNode.childNodes;

  for (var viewableImpressionElementKey in viewableImpressionChildNodes) {
    var viewableImpressionElement = viewableImpressionChildNodes[viewableImpressionElementKey];
    var viewableImpressionNodeName = viewableImpressionElement.nodeName;
    var viewableImpressionNodeValue = parserUtils.parseNodeText(viewableImpressionElement);

    if (viewableImpressionNodeName !== 'Viewable' && viewableImpressionNodeName !== 'NotViewable' && viewableImpressionNodeName !== 'ViewUndetermined' || !viewableImpressionNodeValue) {
      continue;
    } else {
      var viewableImpressionNodeNameLower = viewableImpressionNodeName.toLowerCase();

      if (!Array.isArray(viewableImpression[viewableImpressionNodeNameLower])) {
        viewableImpression[viewableImpressionNodeNameLower] = [];
      }

      viewableImpression[viewableImpressionNodeNameLower].push(viewableImpressionNodeValue);
    }
  }

  return viewableImpression;
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/util/event_emitter.js













function event_emitter_typeof(obj) { "@babel/helpers - typeof"; return event_emitter_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, event_emitter_typeof(obj); }

function event_emitter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function event_emitter_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function event_emitter_createClass(Constructor, protoProps, staticProps) { if (protoProps) event_emitter_defineProperties(Constructor.prototype, protoProps); if (staticProps) event_emitter_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    event_emitter_classCallCheck(this, EventEmitter);

    this._handlers = [];
  }
  /**
   * Adds the event name and handler function to the end of the handlers array.
   * No checks are made to see if the handler has already been added.
   * Multiple calls passing the same combination of event name and handler will result in the handler being added,
   * and called, multiple times.
   * @param {String} event
   * @param {Function} handler
   * @returns {EventEmitter}
   */


  event_emitter_createClass(EventEmitter, [{
    key: "on",
    value: function on(event, handler) {
      if (typeof handler !== 'function') {
        throw new TypeError("The handler argument must be of type Function. Received type ".concat(event_emitter_typeof(handler)));
      }

      if (!event) {
        throw new TypeError("The event argument must be of type String. Received type ".concat(event_emitter_typeof(event)));
      }

      this._handlers.push({
        event: event,
        handler: handler
      });

      return this;
    }
    /**
     * Adds a one-time handler function for the named event.
     * The next time event is triggered, this handler is removed and then invoked.
     * @param {String} event
     * @param {Function} handler
     * @returns {EventEmitter}
     */

  }, {
    key: "once",
    value: function once(event, handler) {
      return this.on(event, onceWrap(this, event, handler));
    }
    /**
     * Removes all instances for the specified handler from the handler array for the named event.
     * @param {String} event
     * @param {Function} handler
     * @returns {EventEmitter}
     */

  }, {
    key: "off",
    value: function off(event, handler) {
      this._handlers = this._handlers.filter(function (item) {
        return item.event !== event || item.handler !== handler;
      });
      return this;
    }
    /**
     * Synchronously calls each of the handlers registered for the named event,
     * in the order they were registered, passing the supplied arguments to each.
     * @param {String} event
     * @param  {any[]} args
     * @returns {Boolean} true if the event had handlers, false otherwise.
     */

  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var called = false;

      this._handlers.forEach(function (item) {
        if (item.event === '*') {
          called = true;
          item.handler.apply(item, [event].concat(args));
        }

        if (item.event === event) {
          called = true;
          item.handler.apply(item, args);
        }
      });

      return called;
    }
    /**
     * Removes all listeners, or those of the specified named event.
     * @param {String} event
     * @returns {EventEmitter}
     */

  }, {
    key: "removeAllListeners",
    value: function removeAllListeners(event) {
      if (!event) {
        this._handlers = [];
        return this;
      }

      this._handlers = this._handlers.filter(function (item) {
        return item.event !== event;
      });
      return this;
    }
    /**
     * Returns the number of listeners listening to the named event.
     * @param {String} event
     * @returns {Number}
     */

  }, {
    key: "listenerCount",
    value: function listenerCount(event) {
      return this._handlers.filter(function (item) {
        return item.event === event;
      }).length;
    }
    /**
     * Returns a copy of the array of listeners for the named event including those created by .once().
     * @param {String} event
     * @returns {Function[]}
     */

  }, {
    key: "listeners",
    value: function listeners(event) {
      return this._handlers.reduce(function (listeners, item) {
        if (item.event === event) {
          listeners.push(item.handler);
        }

        return listeners;
      }, []);
    }
    /**
     * Returns an array listing the events for which the emitter has registered handlers.
     * @returns {String[]}
     */

  }, {
    key: "eventNames",
    value: function eventNames() {
      return this._handlers.map(function (item) {
        return item.event;
      });
    }
  }]);

  return EventEmitter;
}();

function onceWrap(target, event, handler) {
  var state = {
    fired: false,
    wrapFn: undefined
  };

  function onceWrapper() {
    if (!state.fired) {
      target.off(event, state.wrapFn);
      state.fired = true;
      handler.bind(target).apply(void 0, arguments);
    }
  }

  state.wrapFn = onceWrapper;
  return onceWrapper;
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/urlhandlers/mock_node_url_handler.js
// This mock module is loaded in stead of the original NodeURLHandler module
// when bundling the library for environments which are not node.
// This allows us to avoid bundling useless node components and have a smaller build.
function get(url, options, cb) {
  cb(new Error('Please bundle the library for node to use the node urlHandler'));
}

var nodeURLHandler = {
  get: get
};
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/urlhandlers/consts.js
var DEFAULT_TIMEOUT = 120000;
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/urlhandlers/xhr_url_handler.js




function xhr() {
  try {
    var request = new window.XMLHttpRequest();

    if ('withCredentials' in request) {
      // check CORS support
      return request;
    }

    return null;
  } catch (err) {
    return null;
  }
}

function supported() {
  return !!xhr();
}

function handleLoad(request, cb) {
  if (request.status === 200) {
    cb(null, request.responseXML, {
      byteLength: request.response.length,
      statusCode: request.status
    });
  } else {
    handleFail(request, cb, false);
  }
}

function handleFail(request, cb, isTimeout) {
  var statusCode = !isTimeout ? request.status : 408; // Request timeout

  var msg = isTimeout ? "XHRURLHandler: Request timed out after ".concat(request.timeout, " ms (").concat(statusCode, ")") : "XHRURLHandler: ".concat(request.statusText, " (").concat(statusCode, ")");
  cb(new Error(msg), null, {
    statusCode: statusCode
  });
}

function xhr_url_handler_get(url, options, cb) {
  if (window.location.protocol === 'https:' && url.indexOf('http://') === 0) {
    return cb(new Error('XHRURLHandler: Cannot go from HTTPS to HTTP.'));
  }

  try {
    var request = xhr();
    request.open('GET', url);
    request.timeout = options.timeout || DEFAULT_TIMEOUT;
    request.withCredentials = options.withCredentials || false;
    request.overrideMimeType && request.overrideMimeType('text/xml');

    request.onload = function () {
      return handleLoad(request, cb);
    };

    request.onerror = function () {
      return handleFail(request, cb, false);
    };

    request.onabort = function () {
      return handleFail(request, cb, false);
    };

    request.ontimeout = function () {
      return handleFail(request, cb, true);
    };

    request.send();
  } catch (error) {
    cb(new Error('XHRURLHandler: Unexpected error'));
  }
}

var XHRURLHandler = {
  get: xhr_url_handler_get,
  supported: supported
};
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/url_handler.js



function url_handler_get(url, options, cb) {
  // Allow skip of the options param
  if (!cb) {
    if (typeof options === 'function') {
      cb = options;
    }

    options = {};
  }

  if (typeof window === 'undefined' || window === null) {
    return nodeURLHandler.get(url, options, cb);
  } else if (XHRURLHandler.supported()) {
    return XHRURLHandler.get(url, options, cb);
  }

  return cb(new Error('Current context is not supported by any of the default URLHandlers. Please provide a custom URLHandler'));
}

var urlHandler = {
  get: url_handler_get
};
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/vast_response.js
function createVASTResponse(_ref) {
  var ads = _ref.ads,
      errorURLTemplates = _ref.errorURLTemplates,
      version = _ref.version;
  return {
    ads: ads || [],
    errorURLTemplates: errorURLTemplates || [],
    version: version || null
  };
}
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/parser/bitrate.js
/*
  We decided to put the estimated bitrate separated from classes to persist it between different instances of vast client/parser
*/
var estimatedBitrateCount = 0;
var estimatedBitrate = 0;
/**
 * Calculate average estimated bitrate from the previous values and new entries
 * @param {Number} byteLength - The length of the response in bytes.
 * @param {Number} duration - The duration of the request in ms.
 */

var updateEstimatedBitrate = function updateEstimatedBitrate(byteLength, duration) {
  if (!byteLength || !duration || byteLength <= 0 || duration <= 0) {
    return;
  } // We want the bitrate in kb/s, byteLength are in bytes and duration in ms, just need to convert the byteLength because kb/s = b/ms


  var bitrate = byteLength * 8 / duration;
  estimatedBitrate = (estimatedBitrate * estimatedBitrateCount + bitrate) / ++estimatedBitrateCount;
};
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/parser/vast_parser.js
function vast_parser_typeof(obj) { "@babel/helpers - typeof"; return vast_parser_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, vast_parser_typeof(obj); }


















function vast_parser_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function vast_parser_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function vast_parser_createClass(Constructor, protoProps, staticProps) { if (protoProps) vast_parser_defineProperties(Constructor.prototype, protoProps); if (staticProps) vast_parser_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (vast_parser_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }









var DEFAULT_MAX_WRAPPER_DEPTH = 10;
var DEFAULT_EVENT_DATA = {
  ERRORCODE: 900,
  extensions: []
};
/**
 * This class provides methods to fetch and parse a VAST document.
 * @export
 * @class VASTParser
 * @extends EventEmitter
 */

var VASTParser = /*#__PURE__*/function (_EventEmitter) {
  _inherits(VASTParser, _EventEmitter);

  var _super = _createSuper(VASTParser);

  /**
   * Creates an instance of VASTParser.
   * @constructor
   */
  function VASTParser() {
    var _this;

    vast_parser_classCallCheck(this, VASTParser);

    _this = _super.call(this);
    _this.remainingAds = [];
    _this.parentURLs = [];
    _this.errorURLTemplates = [];
    _this.rootErrorURLTemplates = [];
    _this.maxWrapperDepth = null;
    _this.URLTemplateFilters = [];
    _this.fetchingOptions = {};
    _this.parsingOptions = {};
    return _this;
  }
  /**
   * Adds a filter function to the array of filters which are called before fetching a VAST document.
   * @param  {function} filter - The filter function to be added at the end of the array.
   * @return {void}
   */


  vast_parser_createClass(VASTParser, [{
    key: "addURLTemplateFilter",
    value: function addURLTemplateFilter(filter) {
      if (typeof filter === 'function') {
        this.URLTemplateFilters.push(filter);
      }
    }
    /**
     * Removes the last element of the url templates filters array.
     * @return {void}
     */

  }, {
    key: "removeURLTemplateFilter",
    value: function removeURLTemplateFilter() {
      this.URLTemplateFilters.pop();
    }
    /**
     * Returns the number of filters of the url templates filters array.
     * @return {Number}
     */

  }, {
    key: "countURLTemplateFilters",
    value: function countURLTemplateFilters() {
      return this.URLTemplateFilters.length;
    }
    /**
     * Removes all the filter functions from the url templates filters array.
     * @return {void}
     */

  }, {
    key: "clearURLTemplateFilters",
    value: function clearURLTemplateFilters() {
      this.URLTemplateFilters = [];
    }
    /**
     * Tracks the error provided in the errorCode parameter and emits a VAST-error event for the given error.
     * @param  {Array} urlTemplates - An Array of url templates to use to make the tracking call.
     * @param  {Object} errorCode - An Object containing the error data.
     * @param  {Object} data - One (or more) Object containing additional data.
     * @emits  VASTParser#VAST-error
     * @return {void}
     */

  }, {
    key: "trackVastError",
    value: function trackVastError(urlTemplates, errorCode) {
      for (var _len = arguments.length, data = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        data[_key - 2] = arguments[_key];
      }

      this.emit('VAST-error', Object.assign.apply(Object, [{}, DEFAULT_EVENT_DATA, errorCode].concat(data)));
      util.track(urlTemplates, errorCode);
    }
    /**
     * Returns an array of errorURLTemplates for the VAST being parsed.
     * @return {Array}
     */

  }, {
    key: "getErrorURLTemplates",
    value: function getErrorURLTemplates() {
      return this.rootErrorURLTemplates.concat(this.errorURLTemplates);
    }
    /**
     * Returns the estimated bitrate calculated from all previous requests
     * @returns The average of all estimated bitrates in kb/s.
     */

  }, {
    key: "getEstimatedBitrate",
    value: function getEstimatedBitrate() {
      return estimatedBitrate;
    }
    /**
     * Fetches a VAST document for the given url.
     * Returns a Promise which resolves,rejects according to the result of the request.
     * @param  {String} url - The url to request the VAST document.
     * @param {Number} wrapperDepth - How many times the current url has been wrapped.
     * @param {String} previousUrl - Url of the previous VAST.
     * @param {Object} wrapperAd - Previously parsed ad node (Wrapper) related to this fetching.
     * @emits  VASTParser#VAST-resolving
     * @emits  VASTParser#VAST-resolved
     * @return {Promise}
     */

  }, {
    key: "fetchVAST",
    value: function fetchVAST(url) {
      var _this2 = this;

      var wrapperDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var previousUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var wrapperAd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      return new Promise(function (resolve, reject) {
        // Process url with defined filter
        _this2.URLTemplateFilters.forEach(function (filter) {
          url = filter(url);
        });

        _this2.parentURLs.push(url);

        var timeBeforeGet = Date.now();

        _this2.emit('VAST-resolving', {
          url: url,
          previousUrl: previousUrl,
          wrapperDepth: wrapperDepth,
          maxWrapperDepth: _this2.maxWrapperDepth,
          timeout: _this2.fetchingOptions.timeout,
          wrapperAd: wrapperAd
        });

        _this2.urlHandler.get(url, _this2.fetchingOptions, function (error, xml) {
          var details = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var deltaTime = Math.round(Date.now() - timeBeforeGet);
          var info = Object.assign({
            url: url,
            previousUrl: previousUrl,
            wrapperDepth: wrapperDepth,
            error: error,
            duration: deltaTime
          }, details);

          _this2.emit('VAST-resolved', info);

          updateEstimatedBitrate(details.byteLength, deltaTime);

          if (error) {
            reject(error);
          } else {
            resolve(xml);
          }
        });
      });
    }
    /**
     * Inits the parsing properties of the class with the custom values provided as options.
     * @param {Object} options - The options to initialize a parsing sequence
     */

  }, {
    key: "initParsingStatus",
    value: function initParsingStatus() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.errorURLTemplates = [];
      this.fetchingOptions = {
        timeout: options.timeout || DEFAULT_TIMEOUT,
        withCredentials: options.withCredentials
      };
      this.maxWrapperDepth = options.wrapperLimit || DEFAULT_MAX_WRAPPER_DEPTH;
      this.parentURLs = [];
      this.parsingOptions = {
        allowMultipleAds: options.allowMultipleAds
      };
      this.remainingAds = [];
      this.rootErrorURLTemplates = [];
      this.rootURL = '';
      this.urlHandler = options.urlHandler || options.urlhandler || urlHandler;
      this.vastVersion = null;
      updateEstimatedBitrate(options.byteLength, options.requestDuration);
    }
    /**
     * Resolves the next group of ads. If all is true resolves all the remaining ads.
     * @param  {Boolean} all - If true all the remaining ads are resolved
     * @return {Promise}
     */

  }, {
    key: "getRemainingAds",
    value: function getRemainingAds(all) {
      var _this3 = this;

      if (this.remainingAds.length === 0) {
        return Promise.reject(new Error('No more ads are available for the given VAST'));
      }

      var ads = all ? util.flatten(this.remainingAds) : this.remainingAds.shift();
      this.errorURLTemplates = [];
      this.parentURLs = [];
      return this.resolveAds(ads, {
        wrapperDepth: 0,
        url: this.rootURL
      }).then(function (resolvedAds) {
        return _this3.buildVASTResponse(resolvedAds);
      });
    }
    /**
     * Fetches and parses a VAST for the given url.
     * Returns a Promise which resolves with a fully parsed VASTResponse or rejects with an Error.
     * @param  {String} url - The url to request the VAST document.
     * @param  {Object} options - An optional Object of parameters to be used in the parsing process.
     * @emits  VASTParser#VAST-resolving
     * @emits  VASTParser#VAST-resolved
     * @emits  VASTParser#VAST-warning
     * @return {Promise}
     */

  }, {
    key: "getAndParseVAST",
    value: function getAndParseVAST(url) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.initParsingStatus(options);
      this.URLTemplateFilters.forEach(function (filter) {
        url = filter(url);
      });
      this.rootURL = url;
      return this.fetchVAST(url).then(function (xml) {
        options.previousUrl = url;
        options.isRootVAST = true;
        options.url = url;
        return _this4.parse(xml, options).then(function (ads) {
          return _this4.buildVASTResponse(ads);
        });
      });
    }
    /**
     * Parses the given xml Object into a VASTResponse.
     * Returns a Promise which resolves with a fully parsed VASTResponse or rejects with an Error.
     * @param  {Object} vastXml - An object representing a vast xml document.
     * @param  {Object} options - An optional Object of parameters to be used in the parsing process.
     * @emits  VASTParser#VAST-resolving
     * @emits  VASTParser#VAST-resolved
     * @emits  VASTParser#VAST-warning
     * @return {Promise}
     */

  }, {
    key: "parseVAST",
    value: function parseVAST(vastXml) {
      var _this5 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.initParsingStatus(options);
      options.isRootVAST = true;
      return this.parse(vastXml, options).then(function (ads) {
        return _this5.buildVASTResponse(ads);
      });
    }
    /**
     * Builds a VASTResponse which can be returned.
     * @param  {Array} ads - An Array of unwrapped ads
     * @return {Object}
     */

  }, {
    key: "buildVASTResponse",
    value: function buildVASTResponse(ads) {
      var response = createVASTResponse({
        ads: ads,
        errorURLTemplates: this.getErrorURLTemplates(),
        version: this.vastVersion
      });
      this.completeWrapperResolving(response);
      return response;
    }
    /**
     * Parses the given xml Object into an array of ads
     * Returns the array or throws an `Error` if an invalid VAST XML is provided
     * @param  {Object} vastXml - An object representing an xml document.
     * @param  {Object} options - An optional Object of parameters to be used in the parsing process.
     * @emits  VASTParser#VAST-warning
     * @emits VASTParser#VAST-ad-parsed
     * @return {Array}
     * @throws {Error} `vastXml` must be a valid VAST XMLDocument
     */

  }, {
    key: "parseVastXml",
    value: function parseVastXml(vastXml, _ref) {
      var _ref$isRootVAST = _ref.isRootVAST,
          isRootVAST = _ref$isRootVAST === void 0 ? false : _ref$isRootVAST,
          _ref$url = _ref.url,
          url = _ref$url === void 0 ? null : _ref$url,
          _ref$wrapperDepth = _ref.wrapperDepth,
          wrapperDepth = _ref$wrapperDepth === void 0 ? 0 : _ref$wrapperDepth,
          allowMultipleAds = _ref.allowMultipleAds,
          followAdditionalWrappers = _ref.followAdditionalWrappers;

      // check if is a valid VAST document
      if (!vastXml || !vastXml.documentElement || vastXml.documentElement.nodeName !== 'VAST') {
        this.emit('VAST-ad-parsed', {
          type: 'ERROR',
          url: url,
          wrapperDepth: wrapperDepth
        });
        throw new Error('Invalid VAST XMLDocument');
      }

      var ads = [];
      var childNodes = vastXml.documentElement.childNodes;
      /* Only parse the version of the Root VAST for now because we don't know yet how to
       * handle some cases like multiple wrappers in the same vast
       */

      var vastVersion = vastXml.documentElement.getAttribute('version');

      if (isRootVAST) {
        if (vastVersion) this.vastVersion = vastVersion;
      } // Fill the VASTResponse object with ads and errorURLTemplates


      for (var nodeKey in childNodes) {
        var node = childNodes[nodeKey];

        if (node.nodeName === 'Error') {
          var errorURLTemplate = parserUtils.parseNodeText(node); // Distinguish root VAST url templates from ad specific ones

          isRootVAST ? this.rootErrorURLTemplates.push(errorURLTemplate) : this.errorURLTemplates.push(errorURLTemplate);
        } else if (node.nodeName === 'Ad') {
          // allowMultipleAds was introduced in VAST 3
          // for retrocompatibility set it to true
          if (this.vastVersion && parseFloat(this.vastVersion) < 3) {
            allowMultipleAds = true;
          } else if (allowMultipleAds === false && ads.length > 1) {
            // if wrapper allowMultipleAds is set to false only the first stand-alone Ad
            // (with no sequence values) in the requested VAST response is allowed
            break;
          }

          var result = parseAd(node, this.emit.bind(this), {
            allowMultipleAds: allowMultipleAds,
            followAdditionalWrappers: followAdditionalWrappers
          });

          if (result.ad) {
            ads.push(result.ad);
            this.emit('VAST-ad-parsed', {
              type: result.type,
              url: url,
              wrapperDepth: wrapperDepth,
              adIndex: ads.length - 1,
              vastVersion: vastVersion
            });
          } else {
            // VAST version of response not supported.
            this.trackVastError(this.getErrorURLTemplates(), {
              ERRORCODE: 101
            });
          }
        }
      }

      return ads;
    }
    /**
     * Parses the given xml Object into an array of unwrapped ads.
     * Returns a Promise which resolves with the array or rejects with an error according to the result of the parsing.
     * @param {Object} vastXml - An object representing an xml document.
     * @param {Object} options - An optional Object of parameters to be used in the parsing process.
     * @emits VASTParser#VAST-resolving
     * @emits VASTParser#VAST-resolved
     * @emits VASTParser#VAST-warning
     * @return {Promise}
     */

  }, {
    key: "parse",
    value: function parse(vastXml) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$url = _ref2.url,
          url = _ref2$url === void 0 ? null : _ref2$url,
          _ref2$resolveAll = _ref2.resolveAll,
          resolveAll = _ref2$resolveAll === void 0 ? true : _ref2$resolveAll,
          _ref2$wrapperSequence = _ref2.wrapperSequence,
          wrapperSequence = _ref2$wrapperSequence === void 0 ? null : _ref2$wrapperSequence,
          _ref2$previousUrl = _ref2.previousUrl,
          previousUrl = _ref2$previousUrl === void 0 ? null : _ref2$previousUrl,
          _ref2$wrapperDepth = _ref2.wrapperDepth,
          wrapperDepth = _ref2$wrapperDepth === void 0 ? 0 : _ref2$wrapperDepth,
          _ref2$isRootVAST = _ref2.isRootVAST,
          isRootVAST = _ref2$isRootVAST === void 0 ? false : _ref2$isRootVAST,
          followAdditionalWrappers = _ref2.followAdditionalWrappers,
          allowMultipleAds = _ref2.allowMultipleAds;

      var ads = []; // allowMultipleAds was introduced in VAST 3 as wrapper attribute
      // for retrocompatibility set it to true for vast pre-version 3

      if (this.vastVersion && parseFloat(this.vastVersion) < 3 && isRootVAST) {
        allowMultipleAds = true;
      }

      try {
        ads = this.parseVastXml(vastXml, {
          isRootVAST: isRootVAST,
          url: url,
          wrapperDepth: wrapperDepth,
          allowMultipleAds: allowMultipleAds,
          followAdditionalWrappers: followAdditionalWrappers
        });
      } catch (e) {
        return Promise.reject(e);
      }
      /* Keep wrapper sequence value to not break AdPod when wrapper contain only one Ad.
      e.g,for a AdPod containing :
      - Inline with sequence=1
      - Inline with sequence=2
      - Wrapper with sequence=3 wrapping a Inline with sequence=1
      once parsed we will obtain :
      - Inline sequence 1,
      - Inline sequence 2,
      - Inline sequence 3
      */


      if (ads.length === 1 && wrapperSequence !== undefined && wrapperSequence !== null) {
        ads[0].sequence = wrapperSequence;
      } // Split the VAST in case we don't want to resolve everything at the first time


      if (resolveAll === false) {
        this.remainingAds = parserUtils.splitVAST(ads); // Remove the first element from the remaining ads array, since we're going to resolve that element

        ads = this.remainingAds.shift();
      }

      return this.resolveAds(ads, {
        wrapperDepth: wrapperDepth,
        previousUrl: previousUrl,
        url: url
      });
    }
    /**
     * Resolves an Array of ads, recursively calling itself with the remaining ads if a no ad
     * response is returned for the given array.
     * @param {Array} ads - An array of ads to resolve
     * @param {Object} options - An options Object containing resolving parameters
     * @return {Promise}
     */

  }, {
    key: "resolveAds",
    value: function resolveAds() {
      var _this6 = this;

      var ads = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var _ref3 = arguments.length > 1 ? arguments[1] : undefined,
          wrapperDepth = _ref3.wrapperDepth,
          previousUrl = _ref3.previousUrl,
          url = _ref3.url;

      var resolveWrappersPromises = [];
      previousUrl = url;
      ads.forEach(function (ad) {
        var resolveWrappersPromise = _this6.resolveWrappers(ad, wrapperDepth, previousUrl);

        resolveWrappersPromises.push(resolveWrappersPromise);
      });
      return Promise.all(resolveWrappersPromises).then(function (unwrappedAds) {
        var resolvedAds = util.flatten(unwrappedAds);

        if (!resolvedAds && _this6.remainingAds.length > 0) {
          var remainingAdsToResolve = _this6.remainingAds.shift();

          return _this6.resolveAds(remainingAdsToResolve, {
            wrapperDepth: wrapperDepth,
            previousUrl: previousUrl,
            url: url
          });
        }

        return resolvedAds;
      });
    }
    /**
     * Resolves the wrappers for the given ad in a recursive way.
     * Returns a Promise which resolves with the unwrapped ad or rejects with an error.
     * @param {Object} ad - An ad object to be unwrapped.
     * @param {Number} wrapperDepth - The reached depth in the wrapper resolving chain.
     * @param {String} previousUrl - The previous vast url.
     * @return {Promise}
     */

  }, {
    key: "resolveWrappers",
    value: function resolveWrappers(ad, wrapperDepth, previousUrl) {
      var _this7 = this;

      return new Promise(function (resolve) {
        var _this7$parsingOptions;

        // Going one level deeper in the wrapper chain
        wrapperDepth++; // We already have a resolved VAST ad, no need to resolve wrapper

        if (!ad.nextWrapperURL) {
          delete ad.nextWrapperURL;
          return resolve(ad);
        }

        if (wrapperDepth >= _this7.maxWrapperDepth || _this7.parentURLs.indexOf(ad.nextWrapperURL) !== -1) {
          // Wrapper limit reached, as defined by the video player.
          // Too many Wrapper responses have been received with no InLine response.
          ad.errorCode = 302;
          delete ad.nextWrapperURL;
          return resolve(ad);
        } // Get full URL


        ad.nextWrapperURL = parserUtils.resolveVastAdTagURI(ad.nextWrapperURL, previousUrl);

        _this7.URLTemplateFilters.forEach(function (filter) {
          ad.nextWrapperURL = filter(ad.nextWrapperURL);
        }); // If allowMultipleAds is set inside the parameter 'option' of public method
        // override the vast value by the one provided


        var allowMultipleAds = (_this7$parsingOptions = _this7.parsingOptions.allowMultipleAds) !== null && _this7$parsingOptions !== void 0 ? _this7$parsingOptions : ad.allowMultipleAds; // sequence doesn't carry over in wrapper element

        var wrapperSequence = ad.sequence;

        _this7.fetchVAST(ad.nextWrapperURL, wrapperDepth, previousUrl, ad).then(function (xml) {
          return _this7.parse(xml, {
            url: ad.nextWrapperURL,
            previousUrl: previousUrl,
            wrapperSequence: wrapperSequence,
            wrapperDepth: wrapperDepth,
            followAdditionalWrappers: ad.followAdditionalWrappers,
            allowMultipleAds: allowMultipleAds
          }).then(function (unwrappedAds) {
            delete ad.nextWrapperURL;

            if (unwrappedAds.length === 0) {
              // No ads returned by the wrappedResponse, discard current <Ad><Wrapper> creatives
              ad.creatives = [];
              return resolve(ad);
            }

            unwrappedAds.forEach(function (unwrappedAd) {
              if (unwrappedAd) {
                parserUtils.mergeWrapperAdData(unwrappedAd, ad);
              }
            });
            resolve(unwrappedAds);
          });
        }).catch(function (err) {
          // Timeout of VAST URI provided in Wrapper element, or of VAST URI provided in a subsequent Wrapper element.
          // (URI was either unavailable or reached a timeout as defined by the video player.)
          ad.errorCode = 301;
          ad.errorMessage = err.message;
          resolve(ad);
        });
      });
    }
    /**
     * Takes care of handling errors when the wrappers are resolved.
     * @param {Object} vastResponse - A resolved VASTResponse.
     */

  }, {
    key: "completeWrapperResolving",
    value: function completeWrapperResolving(vastResponse) {
      // We've to wait for all <Ad> elements to be parsed before handling error so we can:
      // - Send computed extensions data
      // - Ping all <Error> URIs defined across VAST files
      // No Ad case - The parser never bump into an <Ad> element
      if (vastResponse.ads.length === 0) {
        this.trackVastError(vastResponse.errorURLTemplates, {
          ERRORCODE: 303
        });
      } else {
        for (var index = vastResponse.ads.length - 1; index >= 0; index--) {
          // - Error encountered while parsing
          // - No Creative case - The parser has dealt with soma <Ad><Wrapper> or/and an <Ad><Inline> elements
          // but no creative was found
          var ad = vastResponse.ads[index];

          if (ad.errorCode || ad.creatives.length === 0) {
            this.trackVastError(ad.errorURLTemplates.concat(vastResponse.errorURLTemplates), {
              ERRORCODE: ad.errorCode || 303
            }, {
              ERRORMESSAGE: ad.errorMessage || ''
            }, {
              extensions: ad.extensions
            }, {
              system: ad.system
            });
            vastResponse.ads.splice(index, 1);
          }
        }
      }
    }
  }]);

  return VASTParser;
}(EventEmitter);
;// CONCATENATED MODULE: ./src/assets/@dailymotion/vast-client/src/vast_client.js





function vast_client_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function vast_client_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function vast_client_createClass(Constructor, protoProps, staticProps) { if (protoProps) vast_client_defineProperties(Constructor.prototype, protoProps); if (staticProps) vast_client_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



/**
 * This class provides methods to fetch and parse a VAST document using VASTParser.
 * In addition it provides options to skip consecutive calls based on constraints.
 * @export
 * @class VASTClient
 */

var VASTClient = /*#__PURE__*/function () {
  /**
   * Creates an instance of VASTClient.
   * @param  {Number} cappingFreeLunch - The number of first calls to skip.
   * @param  {Number} cappingMinimumTimeInterval - The minimum time interval between two consecutive calls.
   * @param  {Storage} customStorage - A custom storage to use instead of the default one.
   * @constructor
   */
  function VASTClient(cappingFreeLunch, cappingMinimumTimeInterval, customStorage) {
    vast_client_classCallCheck(this, VASTClient);

    this.cappingFreeLunch = cappingFreeLunch || 0;
    this.cappingMinimumTimeInterval = cappingMinimumTimeInterval || 0;
    this.defaultOptions = {
      withCredentials: false,
      timeout: 0
    };
    this.vastParser = new VASTParser();
    this.storage = customStorage || new Storage(); // Init values if not already set

    if (this.lastSuccessfulAd === undefined) {
      this.lastSuccessfulAd = 0;
    }

    if (this.totalCalls === undefined) {
      this.totalCalls = 0;
    }

    if (this.totalCallsTimeout === undefined) {
      this.totalCallsTimeout = 0;
    }
  }

  vast_client_createClass(VASTClient, [{
    key: "getParser",
    value: function getParser() {
      return this.vastParser;
    }
  }, {
    key: "lastSuccessfulAd",
    get: function get() {
      return this.storage.getItem('vast-client-last-successful-ad');
    },
    set: function set(value) {
      this.storage.setItem('vast-client-last-successful-ad', value);
    }
  }, {
    key: "totalCalls",
    get: function get() {
      return this.storage.getItem('vast-client-total-calls');
    },
    set: function set(value) {
      this.storage.setItem('vast-client-total-calls', value);
    }
  }, {
    key: "totalCallsTimeout",
    get: function get() {
      return this.storage.getItem('vast-client-total-calls-timeout');
    },
    set: function set(value) {
      this.storage.setItem('vast-client-total-calls-timeout', value);
    }
    /**
     * Returns a boolean indicating if there are more ads to resolve for the current parsing.
     * @return {Boolean}
     */

  }, {
    key: "hasRemainingAds",
    value: function hasRemainingAds() {
      return this.vastParser.remainingAds.length > 0;
    }
    /**
     * Resolves the next group of ads. If all is true resolves all the remaining ads.
     * @param  {Boolean} all - If true all the remaining ads are resolved
     * @return {Promise}
     */

  }, {
    key: "getNextAds",
    value: function getNextAds(all) {
      return this.vastParser.getRemainingAds(all);
    }
    /**
     * Gets a parsed VAST document for the given url, applying the skipping rules defined.
     * Returns a Promise which resolves with a fully parsed VASTResponse or rejects with an Error.
     * @param  {String} url - The url to use to fecth the VAST document.
     * @param  {Object} options - An optional Object of parameters to be applied in the process.
     * @return {Promise}
     */

  }, {
    key: "get",
    value: function get(url) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var now = Date.now();
      options = Object.assign({}, this.defaultOptions, options); // By default the client resolves only the first Ad or AdPod

      if (!options.hasOwnProperty('resolveAll')) {
        options.resolveAll = false;
      } // Check totalCallsTimeout (first call + 1 hour), if older than now,
      // reset totalCalls number, by this way the client will be eligible again
      // for freelunch capping


      if (this.totalCallsTimeout < now) {
        this.totalCalls = 1;
        this.totalCallsTimeout = now + 60 * 60 * 1000;
      } else {
        this.totalCalls++;
      }

      return new Promise(function (resolve, reject) {
        if (_this.cappingFreeLunch >= _this.totalCalls) {
          return reject(new Error("VAST call canceled \u2013 FreeLunch capping not reached yet ".concat(_this.totalCalls, "/").concat(_this.cappingFreeLunch)));
        }

        var timeSinceLastCall = now - _this.lastSuccessfulAd; // Check timeSinceLastCall to be a positive number. If not, this mean the
        // previous was made in the future. We reset lastSuccessfulAd value

        if (timeSinceLastCall < 0) {
          _this.lastSuccessfulAd = 0;
        } else if (timeSinceLastCall < _this.cappingMinimumTimeInterval) {
          return reject(new Error("VAST call canceled \u2013 (".concat(_this.cappingMinimumTimeInterval, ")ms minimum interval reached")));
        }

        _this.vastParser.getAndParseVAST(url, options).then(function (response) {
          return resolve(response);
        }).catch(function (err) {
          return reject(err);
        });
      });
    }
  }]);

  return VASTClient;
}();
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(3379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(7795);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(569);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(3565);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(9216);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(4589);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/less-loader/dist/cjs.js!./src/less/rmp-vast.less
var rmp_vast = __webpack_require__(5131);
;// CONCATENATED MODULE: ./src/less/rmp-vast.less

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(rmp_vast/* default */.Z, options);




       /* harmony default export */ var less_rmp_vast = (rmp_vast/* default */.Z && rmp_vast/* default.locals */.Z.locals ? rmp_vast/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/js/index.js
function js_typeof(obj) { "@babel/helpers - typeof"; return js_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, js_typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == js_typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
























function js_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function js_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function js_createClass(Constructor, protoProps, staticProps) { if (protoProps) js_defineProperties(Constructor.prototype, protoProps); if (staticProps) js_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * @license Copyright (c) 2015-2022 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-vast
 * GitHub: https://github.com/radiantmediaplayer/rmp-vast
 * MIT License: https://github.com/radiantmediaplayer/rmp-vast/blob/master/LICENSE
 */












/**
 * The class to instantiate RmpVast
 * @export
 * @class RmpVast
*/

var RmpVast = /*#__PURE__*/function () {
  /**
   * @constructor
   * @param {string}  id - the id for the player container. Required parameter.
   * @typedef {object} VpaidSettings
   * @property {number} [width]
   * @property {number} [height]
   * @property {string} [viewMode]
   * @property {number} [desiredBitrate]
   * @typedef {object} Labels
   * @property {string} [skipMessage]
   * @property {string} [closeAd]
   * @property {string} [textForClickUIOnMobile] 
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
   * @property {boolean} [showControlsForVastPlayer] - Shows VAST player HTML5 default video controls. Default: false.
   * @property {boolean} [enableVpaid] - Enables VPAID support or not. Default: true.
   * @property {VpaidSettings} [vpaidSettings] - Information required to display VPAID creatives - note that it is up 
   *  to the parent application of rmp-vast to provide those informations
   * @property {boolean} [useHlsJS] - Enables hls.js usage to display creatives delivered in HLS format on all devices. Include hls.js library (./externals/hls/hls.min.js) in your page before usage. Default: false.
   * @property {boolean} [debugHlsJS] - Enables debug log when hls.js is used to stream creatives. Default: false.
   * @property {boolean} [omidSupport] - Enables OMID (OM Web SDK) support in rmp-vast. Default: false.
   * @property {string[]} [omidAllowedVendors] - List of allowed vendors for ad verification. Vendors not listed will 
   *  be rejected. Default: [].
   * @property {string} [omidPathTo] - Path to OM Web SDK script. Default: '../externals/omweb-v1.js'.
   * @property {boolean} [omidUnderEvaluation] - When in development/testing/staging set this to true. Default: false.
   * @property {boolean} [omidAutoplay] - The content player will autoplay or not. The possibility of autoplay is not 
   *  determined by rmp-vast, this information needs to be passed to rmp-vast (see this 
   *  script for example). Default: false (means a click to play is required).
   * @property {string} [partnerName] - partnerName for OMID. Default: 'Radiantmediaplayer'.
   * @property {string} [partnerVersion] - partnerVersion for OMID. Default: '6.0.0'.
   * @property {Labels} [labels] - Information required to properly display VPAID creatives - note that it is up to the 
   *  parent application of rmp-vast to provide those informations
   * @param {RmpVastParams} [params] - An object representing various parameters that can be passed to a rmp-vast 
   *  instance and that will affect the player inner-workings. Optional parameter.
   */
  function RmpVast(id, params) {
    js_classCallCheck(this, RmpVast);

    // reset instance variables - once per session
    Utils.initInstanceVariables.call(this);

    if (typeof id !== 'string' || id === '') {
      console.error("Invalid id to create new instance - exit");
      return;
    }

    this.id = id;
    this.container = document.getElementById(this.id);

    if (this.container === null) {
      console.error("Invalid DOM layout - exit");
      return;
    }

    this.contentWrapper = this.container.querySelector('.rmp-content');
    this.contentPlayer = this.container.querySelector('.rmp-video');

    if (this.contentWrapper === null || this.contentPlayer === null) {
      console.error("Invalid DOM layout - exit");
      return;
    }

    console.log("".concat(FW.consolePrepend, " Creating new RmpVast instance"), FW.consoleStyle, '');
    FW.logVideoEvents(this.contentPlayer, 'content'); // reset loadAds variables - this is reset at addestroyed 
    // so that next loadAds is cleared

    Utils.resetVariablesForNewLoadAds.call(this); // handle fullscreen events

    Utils.handleFullscreen.call(this); // filter input params

    Utils.filterParams.call(this, params);
    console.log("".concat(FW.consolePrepend, " Filtered params follow"), FW.consoleStyle, '');
    console.dir(this.params);
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


  js_createClass(RmpVast, [{
    key: "getEnvironment",
    value: function getEnvironment() {
      return ENV;
    }
    /** 
     * @private
     */

  }, {
    key: "_addTrackingEvents",
    value: function _addTrackingEvents(trackingEvents) {
      var _this = this;

      var keys = Object.keys(trackingEvents);
      keys.forEach(function (key) {
        trackingEvents[key].forEach(function (url) {
          _this.trackingTags.push({
            event: key,
            url: url
          });
        });
      });
    }
    /** 
     * @private
     */

  }, {
    key: "_parseCompanion",
    value: function _parseCompanion(creative) {
      var _this2 = this;

      // reset variables in case wrapper
      this.validCompanionAds = [];
      this.companionAdsRequiredAttribute = '';

      if (creative.required) {
        this.companionAdsRequiredAttribute = creative.required;
      }

      var companions = creative.variations; // at least 1 Companion is expected to continue

      if (companions.length > 0) {
        var _loop = function _loop(i) {
          var companion = companions[i];
          var newCompanionAds = {
            width: companion.width,
            height: companion.height
          };
          var staticResourceFound = companion.staticResources.find(function (staticResource) {
            if (staticResource.url) {
              return true;
            }
          });
          var iframeResourceFound = companion.iframeResources.find(function (iframeResource) {
            if (iframeResource) {
              return true;
            }
          });
          var htmlResourceFound = companion.htmlResources.find(function (htmlResource) {
            if (htmlResource) {
              return true;
            }
          });

          if (staticResourceFound && staticResourceFound.url) {
            newCompanionAds.imageUrl = staticResourceFound.url;
          }

          if (iframeResourceFound && iframeResourceFound.length > 0) {
            newCompanionAds.iframeUrl = iframeResourceFound[0];
          }

          if (htmlResourceFound && htmlResourceFound.length > 0) {
            newCompanionAds.htmlContent = htmlResourceFound[0];
          } // if no companion content for this <Companion> then move on to the next


          if (typeof staticResourceFound === 'undefined' && typeof iframeResourceFound === 'undefined' && typeof htmlResourceFound === 'undefined') {
            return "continue";
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

          if (companion.adSlotID) {
            newCompanionAds.adSlotID = companion.adSlotID;
          }

          newCompanionAds.trackingEventsUrls = [];

          if (companion.trackingEvents && companion.trackingEvents.creativeView) {
            companion.trackingEvents.creativeView.forEach(function (creativeView) {
              newCompanionAds.trackingEventsUrls.push(creativeView);
            });
          }

          _this2.validCompanionAds.push(newCompanionAds);
        };

        for (var i = 0; i < companions.length; i++) {
          var _ret = _loop(i);

          if (_ret === "continue") continue;
        }
      }

      console.log("".concat(FW.consolePrepend, " Parse companion ads follow"), FW.consoleStyle, '');
      console.dir(this.validCompanionAds);
    }
    /** 
     * @private
     */

  }, {
    key: "_handleIntersect",
    value: function _handleIntersect(entries) {
      var _this3 = this;

      entries.forEach(function (entry) {
        if (entry.intersectionRatio > _this3.viewablePreviousRatio) {
          _this3.viewableObserver.unobserve(_this3.container);

          Utils.createApiEvent.call(_this3, 'adviewable');
          tracking_events.dispatch.call(_this3, 'viewable');
        }

        _this3.viewablePreviousRatio = entry.intersectionRatio;
      });
    }
    /** 
     * @private
     */

  }, {
    key: "_attachViewableObserver",
    value: function _attachViewableObserver() {
      this.container.removeEventListener('adstarted', this.attachViewableObserver);

      if (typeof window.IntersectionObserver !== 'undefined') {
        var options = {
          root: null,
          rootMargin: '0px',
          threshold: [0.5]
        };
        this.viewableObserver = new IntersectionObserver(this._handleIntersect.bind(this), options);
        this.viewableObserver.observe(this.container);
      } else {
        Utils.createApiEvent.call(this, 'adviewundetermined');
        tracking_events.dispatch.call(this, 'viewundetermined');
      }
    }
    /** 
     * @private
     */

  }, {
    key: "_initViewableImpression",
    value: function _initViewableImpression() {
      var _this4 = this;

      if (this.viewableObserver) {
        this.viewableObserver.unobserve(this.container);
      }

      this.ad.viewableImpression.forEach(function (viewableImpression) {
        if (viewableImpression.viewable.length > 0) {
          viewableImpression.viewable.forEach(function (url) {
            _this4.trackingTags.push({
              event: 'viewable',
              url: url
            });
          });
        }

        if (viewableImpression.notviewable.length > 0) {
          viewableImpression.notviewable.forEach(function (url) {
            _this4.trackingTags.push({
              event: 'notviewable',
              url: url
            });
          });
        }

        if (viewableImpression.viewundetermined.length > 0) {
          viewableImpression.viewundetermined.forEach(function (url) {
            _this4.trackingTags.push({
              event: 'viewundetermined',
              url: url
            });
          });
        }
      });
      this.attachViewableObserver = this._attachViewableObserver.bind(this);
      this.container.addEventListener('adstarted', this.attachViewableObserver);
    }
    /** 
     * @private
     */

  }, {
    key: "_loopAds",
    value: function () {
      var _loopAds2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(ads) {
        var _this5 = this;

        var _loop2, i;

        return _regeneratorRuntime().wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _loop2 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop2(i) {
                  return _regeneratorRuntime().wrap(function _loop2$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return new Promise(function (resolve) {
                            var currentAd = ads[i];
                            console.log("".concat(FW.consolePrepend, " currentAd follows"), FW.consoleStyle, '');
                            console.dir(currentAd);
                            _this5.ad.id = currentAd.id;
                            _this5.ad.adServingId = currentAd.adServingId;
                            _this5.ad.categories = currentAd.categories;

                            if (_this5.requireCategory) {
                              if (_this5.ad.categories.length === 0 || !_this5.ad.categories[0].authority) {
                                Utils.processVastErrors.call(_this5, 204, true);
                                resolve();
                              }
                            }

                            _this5.ad.blockedAdCategories = currentAd.blockedAdCategories;

                            if (_this5.requireCategory) {
                              var haltDueToBlockedAdCategories = false;

                              _this5.ad.blockedAdCategories.forEach(function (blockedAdCategory) {
                                var blockedAdCategoryAuthority = blockedAdCategory.authority;
                                var blockedAdCategoryValue = blockedAdCategory.value;

                                _this5.ad.categories.forEach(function (category) {
                                  var categoriesAuthority = category.authority;
                                  var categoriesValue = category.value;

                                  if (blockedAdCategoryAuthority === categoriesAuthority && blockedAdCategoryValue === categoriesValue) {
                                    Utils.processVastErrors.call(_this5, 205, true);
                                    haltDueToBlockedAdCategories = true;
                                  }
                                });
                              });

                              if (haltDueToBlockedAdCategories) {
                                resolve();
                              }
                            }

                            _this5.ad.adType = currentAd.adType;
                            _this5.ad.title = currentAd.title;
                            _this5.ad.description = currentAd.description;
                            _this5.ad.system = currentAd.system;
                            _this5.ad.advertiser = currentAd.advertiser;
                            _this5.ad.pricing = currentAd.pricing;
                            _this5.ad.survey = currentAd.survey;
                            _this5.ad.sequence = currentAd.sequence;
                            ads.find(function (ad) {
                              _this5.adPod = false;

                              if (ad.sequence && ad.sequence > 1) {
                                _this5.adPod = true;
                                return true;
                              }
                            });

                            if (_this5.adPod) {
                              _this5.adSequence++;

                              if (_this5.adPodLength === 0) {
                                var adPodLength = 0;
                                ads.forEach(function (ad) {
                                  if (ad.sequence) {
                                    adPodLength++;
                                  }
                                });
                                _this5.adPodLength = adPodLength;
                                console.log("".concat(FW.consolePrepend, " AdPod detected with length ").concat(_this5.adPodLength), FW.consoleStyle, '');
                              }
                            }

                            _this5.ad.viewableImpression = currentAd.viewableImpression;

                            if (_this5.ad.viewableImpression.length > 0) {
                              _this5._initViewableImpression();
                            }

                            currentAd.errorURLTemplates.forEach(function (errorURLTemplate) {
                              _this5.adErrorTags.push({
                                event: 'error',
                                url: errorURLTemplate
                              });
                            });
                            currentAd.impressionURLTemplates.forEach(function (impression) {
                              if (impression.url) {
                                _this5.trackingTags.push({
                                  event: 'impression',
                                  url: impression.url
                                });
                              }
                            });

                            _this5.container.addEventListener('addestroyed', function () {
                              if (_this5.adPod && _this5.adSequence === _this5.adPodLength) {
                                _this5.adPodLength = 0;
                                _this5.adSequence = 0;
                                _this5.adPod = false;
                                Utils.createApiEvent.call(_this5, 'adpodcompleted');
                              }

                              resolve();
                            }, {
                              once: true
                            }); // parse companion


                            var creatives = currentAd.creatives;
                            console.log("".concat(FW.consolePrepend, " Parsed creatives follow"), FW.consoleStyle, '');
                            console.dir(creatives);
                            creatives.find(function (creative) {
                              if (creative.type === 'companion') {
                                console.log("".concat(FW.consolePrepend, " Creative type companion detected"), FW.consoleStyle, '');

                                _this5._parseCompanion(creative);

                                return true;
                              }
                            });

                            for (var k = 0; k < creatives.length; k++) {
                              var creative = creatives[k]; // companion >> continue

                              if (creative.type === 'companion') {
                                continue;
                              }

                              _this5.creative.id = creative.id;
                              _this5.creative.universalAdIds = creative.universalAdIds;
                              _this5.creative.adId = creative.adId;
                              _this5.creative.trackingEvents = creative.trackingEvents;

                              switch (creative.type) {
                                case 'linear':
                                  _this5.creative.duration = creative.duration;
                                  _this5.creative.skipDelay = creative.skipDelay;

                                  if (_this5.creative.skipDelay) {
                                    _this5.creative.skipoffset = creative.skipDelay;
                                    _this5.creative.isSkippableAd = true;
                                  }

                                  if (creative.videoClickThroughURLTemplate && creative.videoClickThroughURLTemplate.url) {
                                    _this5.creative.clickThroughUrl = creative.videoClickThroughURLTemplate.url;
                                  }

                                  if (creative.videoClickTrackingURLTemplates.length > 0) {
                                    creative.videoClickTrackingURLTemplates.forEach(function (videoClickTrackingURLTemplate) {
                                      if (videoClickTrackingURLTemplate.url) {
                                        _this5.trackingTags.push({
                                          event: 'clickthrough',
                                          url: videoClickTrackingURLTemplate.url
                                        });
                                      }
                                    });
                                  }

                                  _this5.creative.isLinear = true;

                                  _this5._addTrackingEvents(creative.trackingEvents);

                                  linear.parse.call(_this5, creative.icons, creative.adParameters, creative.mediaFiles);

                                  if (_this5.params.omidSupport && currentAd.adVerifications.length > 0) {
                                    var omSdkManager = new omsdk(currentAd.adVerifications, _this5.vastPlayer, _this5.params, _this5.getIsSkippableAd(), _this5.getSkipTimeOffset());
                                    omSdkManager.init();
                                  }

                                  break;

                                case 'nonlinear':
                                  _this5.creative.isLinear = false;

                                  _this5._addTrackingEvents(creative.trackingEvents);

                                  non_linear.parse.call(_this5, creative.variations);
                                  break;

                                default:
                                  break;
                              }
                            }
                          });

                        case 2:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _loop2);
                });
                i = 0;

              case 2:
                if (!(i < ads.length)) {
                  _context2.next = 7;
                  break;
                }

                return _context2.delegateYield(_loop2(i), "t0", 4);

              case 4:
                i++;
                _context2.next = 2;
                break;

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee);
      }));

      function _loopAds(_x) {
        return _loopAds2.apply(this, arguments);
      }

      return _loopAds;
    }()
    /** 
     * @private
     */

  }, {
    key: "_getVastTag",
    value: function _getVastTag(vastUrl) {
      var _this6 = this;

      // we check for required VAST URL and API here
      // as we need to have this.currentContentSrc available for iOS
      if (typeof vastUrl !== 'string' || vastUrl === '') {
        Utils.processVastErrors.call(this, 1001, false);
        return;
      }

      if (typeof DOMParser === 'undefined') {
        Utils.processVastErrors.call(this, 1002, false);
        return;
      }

      Utils.createApiEvent.call(this, 'adtagstartloading');
      var vastClient = new VASTClient();
      var options = {
        timeout: this.params.ajaxTimeout,
        withCredentials: this.params.ajaxWithCredentials,
        wrapperLimit: this.params.maxNumRedirects,
        resolveAll: false
      };
      this.adTagUrl = vastUrl;
      console.log("".concat(FW.consolePrepend, " Try to load VAST tag at: ").concat(this.adTagUrl), FW.consoleStyle, '');
      vastClient.get(this.adTagUrl, options).then(function (response) {
        console.log("".concat(FW.consolePrepend, " VAST response follows"), FW.consoleStyle, '');
        console.dir(response);
        Utils.createApiEvent.call(_this6, 'adtagloaded'); // error at VAST/Error level

        if (response.errorURLTemplates.length > 0) {
          response.errorURLTemplates.forEach(function (errorURLTemplate) {
            _this6.vastErrorTags.push({
              event: 'error',
              url: errorURLTemplate
            });
          });
        } // VAST/Ad 


        if (response.ads.length === 0) {
          Utils.processVastErrors.call(_this6, 303, true);
          return;
        } else {
          _this6._loopAds(response.ads);
        }
      }).catch(function (error) {
        console.warn(error); // PING 900 Undefined Error.

        Utils.processVastErrors.call(_this6, 900, true);
      });
    }
    /** 
     * @param {string} vastUrl - the URI to the VAST resource to be loaded
     * @param {object} [regulationsInfo] - data for regulations as
     * @param {string} [regulationsInfo.regulations] - coppa|gdpr for REGULATIONS macro
     * @param {string} [regulationsInfo.limitAdTracking] - 0|1 for LIMITADTRACKING macro
     * @param {string} [regulationsInfo.gdprConsent] - Base64-encoded Cookie Value of IAB GDPR consent info for 
     *  GDPRCONSENT macro
     * @param {boolean} [requireCategory] - for enforcement of VAST 4 Ad Categories
     * @return {void}
     */

  }, {
    key: "loadAds",
    value: function loadAds(vastUrl, regulationsInfo, requireCategory) {
      console.log("".concat(FW.consolePrepend, " loadAds method starts"), FW.consoleStyle, ''); // if player is not initialized - this must be done now

      if (!this.rmpVastInitialized) {
        this.initialize();
      }

      if (js_typeof(regulationsInfo) === 'object') {
        var regulationRegExp = /coppa|gdpr/ig;

        if (regulationsInfo.regulations && regulationRegExp.test(regulationsInfo.regulations)) {
          this.regulationsInfo.regulations = regulationsInfo.regulations;
        }

        var limitAdTrackingRegExp = /0|1/ig;

        if (regulationsInfo.limitAdTracking && limitAdTrackingRegExp.test(regulationsInfo.limitAdTracking)) {
          this.regulationsInfo.limitAdTracking = regulationsInfo.limitAdTracking;
        } // Base64-encoded Cookie Value of IAB GDPR consent info


        if (regulationsInfo.gdprConsent) {
          this.regulationsInfo.gdprConsent = regulationsInfo.gdprConsent;
        }
      }

      if (requireCategory) {
        this.requireCategory = true;
      }

      var finalUrl = tracking_events.replaceMacros.call(this, vastUrl, false); // if an ad is already on stage we need to clear it first before we can accept another ad request

      if (this.getAdOnStage()) {
        console.log("".concat(FW.consolePrepend, " Creative already on stage calling stopAds before loading new ad"), FW.consoleStyle, '');

        var _onDestroyLoadAds = function _onDestroyLoadAds(url) {
          this.loadAds(url);
        };

        this.container.addEventListener('addestroyed', _onDestroyLoadAds.bind(this, finalUrl), {
          once: true
        });
        this.stopAds();
        return;
      } // for useContentPlayerForAds we need to know early what is the content src
      // so that we can resume content when ad finishes or on aderror


      var contentCurrentTime = content_player.getCurrentTime.call(this);

      if (this.useContentPlayerForAds) {
        this.currentContentSrc = this.contentPlayer.src;
        console.log("".concat(FW.consolePrepend, " currentContentSrc is ").concat(this.currentContentSrc), FW.consoleStyle, '');
        this.currentContentCurrentTime = contentCurrentTime;
        console.log("".concat(FW.consolePrepend, " currentContentCurrentTime is ").concat(this.currentContentCurrentTime), FW.consoleStyle, ''); // on iOS we need to prevent seeking when linear ad is on stage

        content_player.preventSeekingForCustomPlayback.call(this);
      }

      this._getVastTag(finalUrl);
    }
    /** 
     * @type {() => void} 
     */

  }, {
    key: "play",
    value: function play() {
      if (this.adOnStage && this.creative && this.creative.isLinear) {
        if (this.isVPAID) {
          vpaid.resumeAd.call(this);
        } else {
          vast_player.play.call(this);
        }
      } else {
        content_player.play.call(this);
      }
    }
    /** 
     * @type {() => void} 
     */

  }, {
    key: "pause",
    value: function pause() {
      if (this.adOnStage && this.creative && this.creative.isLinear) {
        if (this.isVPAID) {
          vpaid.pauseAd.call(this);
        } else {
          vast_player.pause.call(this);
        }
      } else {
        content_player.pause.call(this);
      }
    }
    /** 
     * @type {() => boolean} 
     */

  }, {
    key: "getAdPaused",
    value: function getAdPaused() {
      if (this.adOnStage && this.creative && this.creative.isLinear) {
        if (this.isVPAID) {
          return vpaid.getAdPaused.call(this);
        } else {
          return this.vastPlayerPaused;
        }
      }

      return false;
    }
    /** 
     * @type {(level: number) => void} 
     */

  }, {
    key: "setVolume",
    value: function setVolume(level) {
      if (!FW.isNumber(level)) {
        return;
      }

      var validatedLevel = 0;

      if (level < 0) {
        validatedLevel = 0;
      } else if (level > 1) {
        validatedLevel = 1;
      } else {
        validatedLevel = level;
      }

      if (this.adOnStage && this.creative && this.creative.isLinear) {
        if (this.isVPAID) {
          vpaid.setAdVolume.call(this, validatedLevel);
        }

        vast_player.setVolume.call(this, validatedLevel);
      }

      content_player.setVolume.call(this, validatedLevel);
    }
    /** 
     * @type {() => number} 
     */

  }, {
    key: "getVolume",
    value: function getVolume() {
      if (this.adOnStage && this.creative && this.creative.isLinear) {
        if (this.isVPAID) {
          return vpaid.getAdVolume.call(this);
        } else {
          return vast_player.getVolume.call(this);
        }
      }

      return content_player.getVolume.call(this);
    }
    /** 
     * @type {(muted: boolean) => void} 
     */

  }, {
    key: "setMute",
    value: function setMute(muted) {
      if (typeof muted !== 'boolean') {
        return;
      }

      if (this.adOnStage && this.creative && this.creative.isLinear) {
        if (this.isVPAID) {
          if (muted) {
            vpaid.setAdVolume.call(this, 0);
          } else {
            vpaid.setAdVolume.call(this, 1);
          }
        } else {
          vast_player.setMute.call(this, muted);
        }
      }

      content_player.setMute.call(this, muted);
    }
    /** 
     * @type {() => boolean} 
     */

  }, {
    key: "getMute",
    value: function getMute() {
      if (this.adOnStage && this.creative && this.creative.isLinear) {
        if (this.isVPAID) {
          if (vpaid.getAdVolume.call(this) === 0) {
            return true;
          }

          return false;
        } else {
          return vast_player.getMute.call(this);
        }
      }

      return content_player.getMute.call(this);
    }
    /** 
     * @type {() => boolean} 
     */

  }, {
    key: "getFullscreen",
    value: function getFullscreen() {
      return this.isInFullscreen;
    }
    /** 
     * @type {() => void} 
     */

  }, {
    key: "stopAds",
    value: function stopAds() {
      if (this.adOnStage) {
        if (this.isVPAID) {
          vpaid.stopAd.call(this);
        } else {
          // this will destroy ad
          vast_player.resumeContent.call(this);
        }
      }
    }
    /** 
     * @type {() => void} 
     */

  }, {
    key: "skipAd",
    value: function skipAd() {
      if (this.adOnStage && this.getAdSkippableState()) {
        if (this.isVPAID) {
          vpaid.skipAd.call(this);
        } else {
          // this will destroy ad
          vast_player.resumeContent.call(this);
        }
      }
    }
    /** 
     * @type {() => string} 
     */

  }, {
    key: "getAdTagUrl",
    value: function getAdTagUrl() {
      return this.adTagUrl;
    }
    /** 
     * @type {() => string} 
     */

  }, {
    key: "getAdMediaUrl",
    value: function getAdMediaUrl() {
      if (this.adOnStage) {
        if (this.isVPAID) {
          return vpaid.getCreativeUrl.call(this);
        } else {
          if (this.creative && this.creative.mediaUrl) {
            return this.creative.mediaUrl;
          }
        }
      }

      return null;
    }
    /** 
     * @type {() => boolean} 
     */

  }, {
    key: "getAdLinear",
    value: function getAdLinear() {
      if (this.creative && this.creative.isLinear) {
        return this.creative.isLinear;
      }

      return true;
    }
    /** 
     * @typedef {object} AdSystem
     * @property {string} value
     * @property {string} version
     * @return {AdSystem}
     */

  }, {
    key: "getAdSystem",
    value: function getAdSystem() {
      // <AdSystem version="2.0" ><![CDATA[AdServer]]></AdSystem>
      // {value: String, version: String}
      if (this.ad && this.ad.system) {
        return this.ad.system;
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

  }, {
    key: "getAdUniversalAdIds",
    value: function getAdUniversalAdIds() {
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

  }, {
    key: "getAdContentType",
    value: function getAdContentType() {
      if (this.creative && this.creative.type) {
        return this.creative.type;
      }

      return '';
    }
    /** 
     * @type {() => string} 
     */

  }, {
    key: "getAdTitle",
    value: function getAdTitle() {
      if (this.ad && this.ad.title) {
        return this.ad.title;
      }

      return '';
    }
    /** 
     * @type {() => string} 
     */

  }, {
    key: "getAdDescription",
    value: function getAdDescription() {
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

  }, {
    key: "getAdAdvertiser",
    value: function getAdAdvertiser() {
      // <Advertiser id='advertiser-desc'><![CDATA[Advertiser name]]></Advertiser>
      // {id: String, value: String}
      if (this.ad && !FW.isEmptyObject(this.ad.advertiser)) {
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

  }, {
    key: "getAdPricing",
    value: function getAdPricing() {
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

  }, {
    key: "getAdSurvey",
    value: function getAdSurvey() {
      if (this.ad && this.ad.survey) {
        return this.ad.survey;
      }

      return '';
    }
    /** 
     * @type {() => string} 
     */

  }, {
    key: "getAdAdServingId",
    value: function getAdAdServingId() {
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

  }, {
    key: "getAdCategories",
    value: function getAdCategories() {
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

  }, {
    key: "getAdBlockedAdCategories",
    value: function getAdBlockedAdCategories() {
      // <BlockedAdCategories authority=”iabtechlab.com”>232</BlockedAdCategories> 
      if (this.ad && this.ad.blockedAdCategories && this.ad.blockedAdCategories.length > 0) {
        return this.ad.blockedAdCategories;
      }

      return [];
    }
    /** 
     * @type {() => number} 
     */

  }, {
    key: "getAdDuration",
    value: function getAdDuration() {
      if (this.adOnStage && this.creative && this.creative.isLinear) {
        if (this.isVPAID) {
          var duration = vpaid.getAdDuration.call(this);

          if (duration > 0) {
            duration = duration * 1000;
          }

          return duration;
        } else {
          return vast_player.getDuration.call(this);
        }
      }

      return -1;
    }
    /** 
     * @type {() => number} 
     */

  }, {
    key: "getAdCurrentTime",
    value: function getAdCurrentTime() {
      if (this.adOnStage && this.creative && this.creative.isLinear) {
        if (this.isVPAID) {
          var remainingTime = vpaid.getAdRemainingTime.call(this);
          var duration = vpaid.getAdDuration.call(this);

          if (remainingTime === -1 || duration === -1 || remainingTime > duration) {
            return -1;
          }

          return (duration - remainingTime) * 1000;
        } else {
          return vast_player.getCurrentTime.call(this);
        }
      }

      return -1;
    }
    /** 
     * @type {() => number} 
     */

  }, {
    key: "getAdRemainingTime",
    value: function getAdRemainingTime() {
      if (this.adOnStage && this.creative && this.creative.isLinear) {
        if (this.isVPAID) {
          return vpaid.getAdRemainingTime.call(this) * 1000;
        } else {
          var currentTime = vast_player.getCurrentTime.call(this);
          var duration = vast_player.getDuration.call(this);

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

  }, {
    key: "getAdOnStage",
    value: function getAdOnStage() {
      return this.adOnStage;
    }
    /** 
     * @type {() => number} 
     */

  }, {
    key: "getAdMediaWidth",
    value: function getAdMediaWidth() {
      if (this.adOnStage) {
        if (this.isVPAID) {
          return vpaid.getAdWidth.call(this);
        } else if (this.creative && this.creative.width) {
          return this.creative.width;
        }
      }

      return -1;
    }
    /** 
     * @type {() => number} 
     */

  }, {
    key: "getAdMediaHeight",
    value: function getAdMediaHeight() {
      if (this.adOnStage) {
        if (this.isVPAID) {
          return vpaid.getAdHeight.call(this);
        } else if (this.creative && this.creative.height) {
          return this.creative.height;
        }
      }

      return -1;
    }
    /** 
     * @type {() => string} 
     */

  }, {
    key: "getClickThroughUrl",
    value: function getClickThroughUrl() {
      if (this.creative && this.creative.clickThroughUrl) {
        return this.creative.clickThroughUrl;
      }

      return '';
    }
    /** 
     * @type {() => number} 
     */

  }, {
    key: "getSkipTimeOffset",
    value: function getSkipTimeOffset() {
      if (this.creative && this.creative.skipoffset) {
        return this.creative.skipoffset;
      }

      return -1;
    }
    /** 
     * @type {() => boolean} 
     */

  }, {
    key: "getIsSkippableAd",
    value: function getIsSkippableAd() {
      if (this.creative && this.creative.isSkippableAd) {
        return true;
      }

      return false;
    }
    /** 
     * @type {() => boolean} 
     */

  }, {
    key: "getContentPlayerCompleted",
    value: function getContentPlayerCompleted() {
      return this.contentPlayerCompleted;
    }
    /** 
     * @param {boolean} value
     * @return {void}
     */

  }, {
    key: "setContentPlayerCompleted",
    value: function setContentPlayerCompleted(value) {
      if (typeof value === 'boolean') {
        this.contentPlayerCompleted = value;
      }
    }
    /** 
     * @type {() => string} 
     */

  }, {
    key: "getAdErrorMessage",
    value: function getAdErrorMessage() {
      return this.vastErrorMessage;
    }
    /** 
     * @type {() => number} 
     */

  }, {
    key: "getAdVastErrorCode",
    value: function getAdVastErrorCode() {
      return this.vastErrorCode;
    }
    /** 
     * @type {() => string} 
     */

  }, {
    key: "getAdErrorType",
    value: function getAdErrorType() {
      return this.adErrorType;
    }
    /** 
     * @type {() => boolean} 
     */

  }, {
    key: "getIsUsingContentPlayerForAds",
    value: function getIsUsingContentPlayerForAds() {
      return this.useContentPlayerForAds;
    }
    /** 
     * @type {() => boolean} 
     */

  }, {
    key: "getAdSkippableState",
    value: function getAdSkippableState() {
      if (this.adOnStage) {
        if (this.isVPAID) {
          return vpaid.getAdSkippableState.call(this);
        } else {
          if (this.getIsSkippableAd()) {
            return this.skippableAdCanBeSkipped;
          }
        }
      }

      return false;
    }
    /** 
     * @return {HTMLMediaElement|null}
     */

  }, {
    key: "getVastPlayer",
    value: function getVastPlayer() {
      return this.vastPlayer;
    }
    /** 
     * @return {HTMLMediaElement|null}
     */

  }, {
    key: "getContentPlayer",
    value: function getContentPlayer() {
      return this.contentPlayer;
    }
    /** 
     * @param {number} inputWidth
     * @param {number} inputHeight
     * @typedef {object} Companion
     * @property {string} adSlotID
     * @property {string} altText
     * @property {string} companionClickThroughUrl
     * @property {string} companionClickTrackingUrl
     * @property {number} height
     * @property {number} width
     * @property {string} imageUrl
     * @property {string[]} trackingEventsUri
     * @return {Companion[]}
     */

  }, {
    key: "getCompanionAdsList",
    value: function getCompanionAdsList(inputWidth, inputHeight) {
      if (this.validCompanionAds.length > 0) {
        var availableCompanionAds;

        if (typeof inputWidth === 'number' && inputWidth > 0 && typeof inputHeight === 'number' && inputHeight > 0) {
          availableCompanionAds = this.validCompanionAds.filter(function (companionAds) {
            return inputWidth >= companionAds.width && inputHeight >= companionAds.height;
          });
        } else {
          availableCompanionAds = this.validCompanionAds;
        }

        if (availableCompanionAds.length > 0) {
          this.companionAdsList = availableCompanionAds;
          return this.companionAdsList;
        }
      }

      return [];
    }
    /** 
     * @param {number} index
     * @return {HTMLElement|null}
     */

  }, {
    key: "getCompanionAd",
    value: function getCompanionAd(index) {
      var _this7 = this;

      if (typeof this.companionAdsList[index] === 'undefined') {
        return null;
      }

      var companionAd = this.companionAdsList[index];
      var html;

      if (companionAd.imageUrl || companionAd.iframeUrl) {
        if (companionAd.imageUrl) {
          html = document.createElement('img');
        } else {
          html = document.createElement('iframe');
          html.sandbox = 'allow-scripts allow-same-origin';
        }

        if (companionAd.altText) {
          html.alt = companionAd.altText;
        }

        html.width = companionAd.width;
        html.height = companionAd.height;
        html.style.cursor = 'pointer';
      } else if (companionAd.htmlContent) {
        html = companionAd.htmlContent;
      }

      if (companionAd.imageUrl || companionAd.iframeUrl) {
        var trackingEventsUrls = companionAd.trackingEventsUrls;

        if (trackingEventsUrls.length > 0) {
          html.onload = function () {
            trackingEventsUrls.forEach(function (trackingEventsUrl) {
              tracking_events.pingURI.call(_this7, trackingEventsUrl);
            });
          };

          html.onerror = function () {
            tracking_events.error.call(_this7, 603);
          };
        }

        var companionClickTrackingUrls = null;

        if (companionAd.companionClickTrackingUrls) {
          console.log("".concat(FW.consolePrepend, " Companion click tracking URIs"), FW.consoleStyle, '');
          console.dir(companionClickTrackingUrls);
          companionClickTrackingUrls = companionAd.companionClickTrackingUrls;
        }

        var _onImgClickThrough = function _onImgClickThrough(companionClickThroughUrl, companionClickTrackingUrls, event) {
          var _this8 = this;

          if (event) {
            event.stopPropagation();

            if (event.type === 'touchend') {
              event.preventDefault();
            }
          }

          if (companionClickTrackingUrls) {
            companionClickTrackingUrls.forEach(function (companionClickTrackingUrl) {
              if (companionClickTrackingUrl.url) {
                tracking_events.pingURI.call(_this8, companionClickTrackingUrl.url);
              }
            });
          }

          FW.openWindow(companionClickThroughUrl);
        };

        if (companionAd.companionClickThroughUrl) {
          html.addEventListener('touchend', _onImgClickThrough.bind(this, companionAd.companionClickThroughUrl, companionClickTrackingUrls));
          html.addEventListener('click', _onImgClickThrough.bind(this, companionAd.companionClickThroughUrl, companionClickTrackingUrls));
        }
      }

      if (companionAd.imageUrl) {
        html.src = companionAd.imageUrl;
      } else if (companionAd.iframeUrl) {
        html.src = companionAd.iframeUrl;
      } else if (companionAd.htmlContent) {
        try {
          var parser = new DOMParser();
          html = parser.parseFromString(companionAd.htmlContent, 'text/html');
        } catch (e) {
          return null;
        }
      }

      return html;
    }
    /** 
     * @type {() => string} 
     */

  }, {
    key: "getCompanionAdsRequiredAttribute",
    value: function getCompanionAdsRequiredAttribute() {
      if (this.adOnStage) {
        return this.companionAdsRequiredAttribute;
      }

      return '';
    }
    /** 
     * @type {() => void} 
     */

  }, {
    key: "initialize",
    value: function initialize() {
      if (!this.rmpVastInitialized) {
        console.log("".concat(FW.consolePrepend, " Upon user interaction - player needs to be initialized"), FW.consoleStyle, '');
        vast_player.init.call(this);
      }
    }
    /** 
     * @type {() => boolean} 
     */

  }, {
    key: "getInitialized",
    value: function getInitialized() {
      return this.rmpVastInitialized;
    }
    /** 
     * @type {() => void} 
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.contentPlayer) {
        this.contentPlayer.removeEventListener('webkitbeginfullscreen', this.onFullscreenchange);
        this.contentPlayer.removeEventListener('webkitendfullscreen', this.onFullscreenchange);
      } else {
        document.removeEventListener('fullscreenchange', this.onFullscreenchange);
      }

      vast_player.destroy.call(this);
      Utils.initInstanceVariables.call(this);
    }
    /** 
     * @typedef {object} AdPod
     * @property {number} adPodCurrentIndex
     * @property {number} adPodLength
     * @return {AdPod}
     */

  }, {
    key: "getAdPodInfo",
    value: function getAdPodInfo() {
      if (this.adPod && this.adPodLength) {
        var result = {};
        result.adPodCurrentIndex = this.adSequence;
        result.adPodLength = this.adPodLength;
        return result;
      }

      return {
        adPodCurrentIndex: -1,
        adPodLength: 0
      };
    } // VPAID methods

    /** 
     * @type {(width: number, height: number, viewMode: string) => void} 
     */

  }, {
    key: "resizeAd",
    value: function resizeAd(width, height, viewMode) {
      if (this.adOnStage && this.isVPAID) {
        vpaid.resizeAd.call(this, width, height, viewMode);
      }
    }
    /** 
     * @type {() => void} 
     */

  }, {
    key: "expandAd",
    value: function expandAd() {
      if (this.adOnStage && this.isVPAID) {
        vpaid.expandAd.call(this);
      }
    }
    /** 
     * @type {() => void} 
     */

  }, {
    key: "collapseAd",
    value: function collapseAd() {
      if (this.adOnStage && this.isVPAID) {
        vpaid.collapseAd.call(this);
      }
    }
    /** 
     * @type {() => boolean} 
     */

  }, {
    key: "getAdExpanded",
    value: function getAdExpanded() {
      if (this.adOnStage && this.isVPAID) {
        vpaid.getAdExpanded.call(this);
      }

      return false;
    }
    /** 
     * @type {() => string} 
     */

  }, {
    key: "getVPAIDCompanionAds",
    value: function getVPAIDCompanionAds() {
      if (this.adOnStage && this.isVPAID) {
        vpaid.getAdCompanions.call(this);
      }

      return '';
    }
  }]);

  return RmpVast;
}();


}();
window.RmpVast = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=rmp-vast.js.map