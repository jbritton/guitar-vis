/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(36);


/***/ },

/***/ 36:
/***/ function(module, exports, __webpack_require__) {

	
	__webpack_require__(37);
	
	__webpack_require__(38);
	__webpack_require__(39);
	__webpack_require__(40);
	__webpack_require__(41);
	__webpack_require__(42);

/***/ },

/***/ 37:
/***/ function(module, exports) {

	/**
	 * @license AngularJS v1.5.5
	 * (c) 2010-2016 Google, Inc. http://angularjs.org
	 * License: MIT
	 */
	(function(window, angular) {
	
	'use strict';
	
	/**
	 * @ngdoc object
	 * @name angular.mock
	 * @description
	 *
	 * Namespace from 'angular-mocks.js' which contains testing related code.
	 */
	angular.mock = {};
	
	/**
	 * ! This is a private undocumented service !
	 *
	 * @name $browser
	 *
	 * @description
	 * This service is a mock implementation of {@link ng.$browser}. It provides fake
	 * implementation for commonly used browser apis that are hard to test, e.g. setTimeout, xhr,
	 * cookies, etc...
	 *
	 * The api of this service is the same as that of the real {@link ng.$browser $browser}, except
	 * that there are several helper methods available which can be used in tests.
	 */
	angular.mock.$BrowserProvider = function() {
	  this.$get = function() {
	    return new angular.mock.$Browser();
	  };
	};
	
	angular.mock.$Browser = function() {
	  var self = this;
	
	  this.isMock = true;
	  self.$$url = "http://server/";
	  self.$$lastUrl = self.$$url; // used by url polling fn
	  self.pollFns = [];
	
	  // TODO(vojta): remove this temporary api
	  self.$$completeOutstandingRequest = angular.noop;
	  self.$$incOutstandingRequestCount = angular.noop;
	
	
	  // register url polling fn
	
	  self.onUrlChange = function(listener) {
	    self.pollFns.push(
	      function() {
	        if (self.$$lastUrl !== self.$$url || self.$$state !== self.$$lastState) {
	          self.$$lastUrl = self.$$url;
	          self.$$lastState = self.$$state;
	          listener(self.$$url, self.$$state);
	        }
	      }
	    );
	
	    return listener;
	  };
	
	  self.$$applicationDestroyed = angular.noop;
	  self.$$checkUrlChange = angular.noop;
	
	  self.deferredFns = [];
	  self.deferredNextId = 0;
	
	  self.defer = function(fn, delay) {
	    delay = delay || 0;
	    self.deferredFns.push({time:(self.defer.now + delay), fn:fn, id: self.deferredNextId});
	    self.deferredFns.sort(function(a, b) { return a.time - b.time;});
	    return self.deferredNextId++;
	  };
	
	
	  /**
	   * @name $browser#defer.now
	   *
	   * @description
	   * Current milliseconds mock time.
	   */
	  self.defer.now = 0;
	
	
	  self.defer.cancel = function(deferId) {
	    var fnIndex;
	
	    angular.forEach(self.deferredFns, function(fn, index) {
	      if (fn.id === deferId) fnIndex = index;
	    });
	
	    if (angular.isDefined(fnIndex)) {
	      self.deferredFns.splice(fnIndex, 1);
	      return true;
	    }
	
	    return false;
	  };
	
	
	  /**
	   * @name $browser#defer.flush
	   *
	   * @description
	   * Flushes all pending requests and executes the defer callbacks.
	   *
	   * @param {number=} number of milliseconds to flush. See {@link #defer.now}
	   */
	  self.defer.flush = function(delay) {
	    if (angular.isDefined(delay)) {
	      self.defer.now += delay;
	    } else {
	      if (self.deferredFns.length) {
	        self.defer.now = self.deferredFns[self.deferredFns.length - 1].time;
	      } else {
	        throw new Error('No deferred tasks to be flushed');
	      }
	    }
	
	    while (self.deferredFns.length && self.deferredFns[0].time <= self.defer.now) {
	      self.deferredFns.shift().fn();
	    }
	  };
	
	  self.$$baseHref = '/';
	  self.baseHref = function() {
	    return this.$$baseHref;
	  };
	};
	angular.mock.$Browser.prototype = {
	
	  /**
	   * @name $browser#poll
	   *
	   * @description
	   * run all fns in pollFns
	   */
	  poll: function poll() {
	    angular.forEach(this.pollFns, function(pollFn) {
	      pollFn();
	    });
	  },
	
	  url: function(url, replace, state) {
	    if (angular.isUndefined(state)) {
	      state = null;
	    }
	    if (url) {
	      this.$$url = url;
	      // Native pushState serializes & copies the object; simulate it.
	      this.$$state = angular.copy(state);
	      return this;
	    }
	
	    return this.$$url;
	  },
	
	  state: function() {
	    return this.$$state;
	  },
	
	  notifyWhenNoOutstandingRequests: function(fn) {
	    fn();
	  }
	};
	
	
	/**
	 * @ngdoc provider
	 * @name $exceptionHandlerProvider
	 *
	 * @description
	 * Configures the mock implementation of {@link ng.$exceptionHandler} to rethrow or to log errors
	 * passed to the `$exceptionHandler`.
	 */
	
	/**
	 * @ngdoc service
	 * @name $exceptionHandler
	 *
	 * @description
	 * Mock implementation of {@link ng.$exceptionHandler} that rethrows or logs errors passed
	 * to it. See {@link ngMock.$exceptionHandlerProvider $exceptionHandlerProvider} for configuration
	 * information.
	 *
	 *
	 * ```js
	 *   describe('$exceptionHandlerProvider', function() {
	 *
	 *     it('should capture log messages and exceptions', function() {
	 *
	 *       module(function($exceptionHandlerProvider) {
	 *         $exceptionHandlerProvider.mode('log');
	 *       });
	 *
	 *       inject(function($log, $exceptionHandler, $timeout) {
	 *         $timeout(function() { $log.log(1); });
	 *         $timeout(function() { $log.log(2); throw 'banana peel'; });
	 *         $timeout(function() { $log.log(3); });
	 *         expect($exceptionHandler.errors).toEqual([]);
	 *         expect($log.assertEmpty());
	 *         $timeout.flush();
	 *         expect($exceptionHandler.errors).toEqual(['banana peel']);
	 *         expect($log.log.logs).toEqual([[1], [2], [3]]);
	 *       });
	 *     });
	 *   });
	 * ```
	 */
	
	angular.mock.$ExceptionHandlerProvider = function() {
	  var handler;
	
	  /**
	   * @ngdoc method
	   * @name $exceptionHandlerProvider#mode
	   *
	   * @description
	   * Sets the logging mode.
	   *
	   * @param {string} mode Mode of operation, defaults to `rethrow`.
	   *
	   *   - `log`: Sometimes it is desirable to test that an error is thrown, for this case the `log`
	   *            mode stores an array of errors in `$exceptionHandler.errors`, to allow later
	   *            assertion of them. See {@link ngMock.$log#assertEmpty assertEmpty()} and
	   *            {@link ngMock.$log#reset reset()}
	   *   - `rethrow`: If any errors are passed to the handler in tests, it typically means that there
	   *                is a bug in the application or test, so this mock will make these tests fail.
	   *                For any implementations that expect exceptions to be thrown, the `rethrow` mode
	   *                will also maintain a log of thrown errors.
	   */
	  this.mode = function(mode) {
	
	    switch (mode) {
	      case 'log':
	      case 'rethrow':
	        var errors = [];
	        handler = function(e) {
	          if (arguments.length == 1) {
	            errors.push(e);
	          } else {
	            errors.push([].slice.call(arguments, 0));
	          }
	          if (mode === "rethrow") {
	            throw e;
	          }
	        };
	        handler.errors = errors;
	        break;
	      default:
	        throw new Error("Unknown mode '" + mode + "', only 'log'/'rethrow' modes are allowed!");
	    }
	  };
	
	  this.$get = function() {
	    return handler;
	  };
	
	  this.mode('rethrow');
	};
	
	
	/**
	 * @ngdoc service
	 * @name $log
	 *
	 * @description
	 * Mock implementation of {@link ng.$log} that gathers all logged messages in arrays
	 * (one array per logging level). These arrays are exposed as `logs` property of each of the
	 * level-specific log function, e.g. for level `error` the array is exposed as `$log.error.logs`.
	 *
	 */
	angular.mock.$LogProvider = function() {
	  var debug = true;
	
	  function concat(array1, array2, index) {
	    return array1.concat(Array.prototype.slice.call(array2, index));
	  }
	
	  this.debugEnabled = function(flag) {
	    if (angular.isDefined(flag)) {
	      debug = flag;
	      return this;
	    } else {
	      return debug;
	    }
	  };
	
	  this.$get = function() {
	    var $log = {
	      log: function() { $log.log.logs.push(concat([], arguments, 0)); },
	      warn: function() { $log.warn.logs.push(concat([], arguments, 0)); },
	      info: function() { $log.info.logs.push(concat([], arguments, 0)); },
	      error: function() { $log.error.logs.push(concat([], arguments, 0)); },
	      debug: function() {
	        if (debug) {
	          $log.debug.logs.push(concat([], arguments, 0));
	        }
	      }
	    };
	
	    /**
	     * @ngdoc method
	     * @name $log#reset
	     *
	     * @description
	     * Reset all of the logging arrays to empty.
	     */
	    $log.reset = function() {
	      /**
	       * @ngdoc property
	       * @name $log#log.logs
	       *
	       * @description
	       * Array of messages logged using {@link ng.$log#log `log()`}.
	       *
	       * @example
	       * ```js
	       * $log.log('Some Log');
	       * var first = $log.log.logs.unshift();
	       * ```
	       */
	      $log.log.logs = [];
	      /**
	       * @ngdoc property
	       * @name $log#info.logs
	       *
	       * @description
	       * Array of messages logged using {@link ng.$log#info `info()`}.
	       *
	       * @example
	       * ```js
	       * $log.info('Some Info');
	       * var first = $log.info.logs.unshift();
	       * ```
	       */
	      $log.info.logs = [];
	      /**
	       * @ngdoc property
	       * @name $log#warn.logs
	       *
	       * @description
	       * Array of messages logged using {@link ng.$log#warn `warn()`}.
	       *
	       * @example
	       * ```js
	       * $log.warn('Some Warning');
	       * var first = $log.warn.logs.unshift();
	       * ```
	       */
	      $log.warn.logs = [];
	      /**
	       * @ngdoc property
	       * @name $log#error.logs
	       *
	       * @description
	       * Array of messages logged using {@link ng.$log#error `error()`}.
	       *
	       * @example
	       * ```js
	       * $log.error('Some Error');
	       * var first = $log.error.logs.unshift();
	       * ```
	       */
	      $log.error.logs = [];
	        /**
	       * @ngdoc property
	       * @name $log#debug.logs
	       *
	       * @description
	       * Array of messages logged using {@link ng.$log#debug `debug()`}.
	       *
	       * @example
	       * ```js
	       * $log.debug('Some Error');
	       * var first = $log.debug.logs.unshift();
	       * ```
	       */
	      $log.debug.logs = [];
	    };
	
	    /**
	     * @ngdoc method
	     * @name $log#assertEmpty
	     *
	     * @description
	     * Assert that all of the logging methods have no logged messages. If any messages are present,
	     * an exception is thrown.
	     */
	    $log.assertEmpty = function() {
	      var errors = [];
	      angular.forEach(['error', 'warn', 'info', 'log', 'debug'], function(logLevel) {
	        angular.forEach($log[logLevel].logs, function(log) {
	          angular.forEach(log, function(logItem) {
	            errors.push('MOCK $log (' + logLevel + '): ' + String(logItem) + '\n' +
	                        (logItem.stack || ''));
	          });
	        });
	      });
	      if (errors.length) {
	        errors.unshift("Expected $log to be empty! Either a message was logged unexpectedly, or " +
	          "an expected log message was not checked and removed:");
	        errors.push('');
	        throw new Error(errors.join('\n---------\n'));
	      }
	    };
	
	    $log.reset();
	    return $log;
	  };
	};
	
	
	/**
	 * @ngdoc service
	 * @name $interval
	 *
	 * @description
	 * Mock implementation of the $interval service.
	 *
	 * Use {@link ngMock.$interval#flush `$interval.flush(millis)`} to
	 * move forward by `millis` milliseconds and trigger any functions scheduled to run in that
	 * time.
	 *
	 * @param {function()} fn A function that should be called repeatedly.
	 * @param {number} delay Number of milliseconds between each function call.
	 * @param {number=} [count=0] Number of times to repeat. If not set, or 0, will repeat
	 *   indefinitely.
	 * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
	 *   will invoke `fn` within the {@link ng.$rootScope.Scope#$apply $apply} block.
	 * @param {...*=} Pass additional parameters to the executed function.
	 * @returns {promise} A promise which will be notified on each iteration.
	 */
	angular.mock.$IntervalProvider = function() {
	  this.$get = ['$browser', '$rootScope', '$q', '$$q',
	       function($browser,   $rootScope,   $q,   $$q) {
	    var repeatFns = [],
	        nextRepeatId = 0,
	        now = 0;
	
	    var $interval = function(fn, delay, count, invokeApply) {
	      var hasParams = arguments.length > 4,
	          args = hasParams ? Array.prototype.slice.call(arguments, 4) : [],
	          iteration = 0,
	          skipApply = (angular.isDefined(invokeApply) && !invokeApply),
	          deferred = (skipApply ? $$q : $q).defer(),
	          promise = deferred.promise;
	
	      count = (angular.isDefined(count)) ? count : 0;
	      promise.then(null, null, (!hasParams) ? fn : function() {
	        fn.apply(null, args);
	      });
	
	      promise.$$intervalId = nextRepeatId;
	
	      function tick() {
	        deferred.notify(iteration++);
	
	        if (count > 0 && iteration >= count) {
	          var fnIndex;
	          deferred.resolve(iteration);
	
	          angular.forEach(repeatFns, function(fn, index) {
	            if (fn.id === promise.$$intervalId) fnIndex = index;
	          });
	
	          if (angular.isDefined(fnIndex)) {
	            repeatFns.splice(fnIndex, 1);
	          }
	        }
	
	        if (skipApply) {
	          $browser.defer.flush();
	        } else {
	          $rootScope.$apply();
	        }
	      }
	
	      repeatFns.push({
	        nextTime:(now + delay),
	        delay: delay,
	        fn: tick,
	        id: nextRepeatId,
	        deferred: deferred
	      });
	      repeatFns.sort(function(a, b) { return a.nextTime - b.nextTime;});
	
	      nextRepeatId++;
	      return promise;
	    };
	    /**
	     * @ngdoc method
	     * @name $interval#cancel
	     *
	     * @description
	     * Cancels a task associated with the `promise`.
	     *
	     * @param {promise} promise A promise from calling the `$interval` function.
	     * @returns {boolean} Returns `true` if the task was successfully cancelled.
	     */
	    $interval.cancel = function(promise) {
	      if (!promise) return false;
	      var fnIndex;
	
	      angular.forEach(repeatFns, function(fn, index) {
	        if (fn.id === promise.$$intervalId) fnIndex = index;
	      });
	
	      if (angular.isDefined(fnIndex)) {
	        repeatFns[fnIndex].deferred.reject('canceled');
	        repeatFns.splice(fnIndex, 1);
	        return true;
	      }
	
	      return false;
	    };
	
	    /**
	     * @ngdoc method
	     * @name $interval#flush
	     * @description
	     *
	     * Runs interval tasks scheduled to be run in the next `millis` milliseconds.
	     *
	     * @param {number=} millis maximum timeout amount to flush up until.
	     *
	     * @return {number} The amount of time moved forward.
	     */
	    $interval.flush = function(millis) {
	      now += millis;
	      while (repeatFns.length && repeatFns[0].nextTime <= now) {
	        var task = repeatFns[0];
	        task.fn();
	        task.nextTime += task.delay;
	        repeatFns.sort(function(a, b) { return a.nextTime - b.nextTime;});
	      }
	      return millis;
	    };
	
	    return $interval;
	  }];
	};
	
	
	/* jshint -W101 */
	/* The R_ISO8061_STR regex is never going to fit into the 100 char limit!
	 * This directive should go inside the anonymous function but a bug in JSHint means that it would
	 * not be enacted early enough to prevent the warning.
	 */
	var R_ISO8061_STR = /^(-?\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?:\:?(\d\d)(?:\:?(\d\d)(?:\.(\d{3}))?)?)?(Z|([+-])(\d\d):?(\d\d)))?$/;
	
	function jsonStringToDate(string) {
	  var match;
	  if (match = string.match(R_ISO8061_STR)) {
	    var date = new Date(0),
	        tzHour = 0,
	        tzMin  = 0;
	    if (match[9]) {
	      tzHour = toInt(match[9] + match[10]);
	      tzMin = toInt(match[9] + match[11]);
	    }
	    date.setUTCFullYear(toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
	    date.setUTCHours(toInt(match[4] || 0) - tzHour,
	                     toInt(match[5] || 0) - tzMin,
	                     toInt(match[6] || 0),
	                     toInt(match[7] || 0));
	    return date;
	  }
	  return string;
	}
	
	function toInt(str) {
	  return parseInt(str, 10);
	}
	
	function padNumberInMock(num, digits, trim) {
	  var neg = '';
	  if (num < 0) {
	    neg =  '-';
	    num = -num;
	  }
	  num = '' + num;
	  while (num.length < digits) num = '0' + num;
	  if (trim) {
	    num = num.substr(num.length - digits);
	  }
	  return neg + num;
	}
	
	
	/**
	 * @ngdoc type
	 * @name angular.mock.TzDate
	 * @description
	 *
	 * *NOTE*: this is not an injectable instance, just a globally available mock class of `Date`.
	 *
	 * Mock of the Date type which has its timezone specified via constructor arg.
	 *
	 * The main purpose is to create Date-like instances with timezone fixed to the specified timezone
	 * offset, so that we can test code that depends on local timezone settings without dependency on
	 * the time zone settings of the machine where the code is running.
	 *
	 * @param {number} offset Offset of the *desired* timezone in hours (fractions will be honored)
	 * @param {(number|string)} timestamp Timestamp representing the desired time in *UTC*
	 *
	 * @example
	 * !!!! WARNING !!!!!
	 * This is not a complete Date object so only methods that were implemented can be called safely.
	 * To make matters worse, TzDate instances inherit stuff from Date via a prototype.
	 *
	 * We do our best to intercept calls to "unimplemented" methods, but since the list of methods is
	 * incomplete we might be missing some non-standard methods. This can result in errors like:
	 * "Date.prototype.foo called on incompatible Object".
	 *
	 * ```js
	 * var newYearInBratislava = new TzDate(-1, '2009-12-31T23:00:00Z');
	 * newYearInBratislava.getTimezoneOffset() => -60;
	 * newYearInBratislava.getFullYear() => 2010;
	 * newYearInBratislava.getMonth() => 0;
	 * newYearInBratislava.getDate() => 1;
	 * newYearInBratislava.getHours() => 0;
	 * newYearInBratislava.getMinutes() => 0;
	 * newYearInBratislava.getSeconds() => 0;
	 * ```
	 *
	 */
	angular.mock.TzDate = function(offset, timestamp) {
	  var self = new Date(0);
	  if (angular.isString(timestamp)) {
	    var tsStr = timestamp;
	
	    self.origDate = jsonStringToDate(timestamp);
	
	    timestamp = self.origDate.getTime();
	    if (isNaN(timestamp)) {
	      throw {
	        name: "Illegal Argument",
	        message: "Arg '" + tsStr + "' passed into TzDate constructor is not a valid date string"
	      };
	    }
	  } else {
	    self.origDate = new Date(timestamp);
	  }
	
	  var localOffset = new Date(timestamp).getTimezoneOffset();
	  self.offsetDiff = localOffset * 60 * 1000 - offset * 1000 * 60 * 60;
	  self.date = new Date(timestamp + self.offsetDiff);
	
	  self.getTime = function() {
	    return self.date.getTime() - self.offsetDiff;
	  };
	
	  self.toLocaleDateString = function() {
	    return self.date.toLocaleDateString();
	  };
	
	  self.getFullYear = function() {
	    return self.date.getFullYear();
	  };
	
	  self.getMonth = function() {
	    return self.date.getMonth();
	  };
	
	  self.getDate = function() {
	    return self.date.getDate();
	  };
	
	  self.getHours = function() {
	    return self.date.getHours();
	  };
	
	  self.getMinutes = function() {
	    return self.date.getMinutes();
	  };
	
	  self.getSeconds = function() {
	    return self.date.getSeconds();
	  };
	
	  self.getMilliseconds = function() {
	    return self.date.getMilliseconds();
	  };
	
	  self.getTimezoneOffset = function() {
	    return offset * 60;
	  };
	
	  self.getUTCFullYear = function() {
	    return self.origDate.getUTCFullYear();
	  };
	
	  self.getUTCMonth = function() {
	    return self.origDate.getUTCMonth();
	  };
	
	  self.getUTCDate = function() {
	    return self.origDate.getUTCDate();
	  };
	
	  self.getUTCHours = function() {
	    return self.origDate.getUTCHours();
	  };
	
	  self.getUTCMinutes = function() {
	    return self.origDate.getUTCMinutes();
	  };
	
	  self.getUTCSeconds = function() {
	    return self.origDate.getUTCSeconds();
	  };
	
	  self.getUTCMilliseconds = function() {
	    return self.origDate.getUTCMilliseconds();
	  };
	
	  self.getDay = function() {
	    return self.date.getDay();
	  };
	
	  // provide this method only on browsers that already have it
	  if (self.toISOString) {
	    self.toISOString = function() {
	      return padNumberInMock(self.origDate.getUTCFullYear(), 4) + '-' +
	            padNumberInMock(self.origDate.getUTCMonth() + 1, 2) + '-' +
	            padNumberInMock(self.origDate.getUTCDate(), 2) + 'T' +
	            padNumberInMock(self.origDate.getUTCHours(), 2) + ':' +
	            padNumberInMock(self.origDate.getUTCMinutes(), 2) + ':' +
	            padNumberInMock(self.origDate.getUTCSeconds(), 2) + '.' +
	            padNumberInMock(self.origDate.getUTCMilliseconds(), 3) + 'Z';
	    };
	  }
	
	  //hide all methods not implemented in this mock that the Date prototype exposes
	  var unimplementedMethods = ['getUTCDay',
	      'getYear', 'setDate', 'setFullYear', 'setHours', 'setMilliseconds',
	      'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear',
	      'setUTCHours', 'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds',
	      'setYear', 'toDateString', 'toGMTString', 'toJSON', 'toLocaleFormat', 'toLocaleString',
	      'toLocaleTimeString', 'toSource', 'toString', 'toTimeString', 'toUTCString', 'valueOf'];
	
	  angular.forEach(unimplementedMethods, function(methodName) {
	    self[methodName] = function() {
	      throw new Error("Method '" + methodName + "' is not implemented in the TzDate mock");
	    };
	  });
	
	  return self;
	};
	
	//make "tzDateInstance instanceof Date" return true
	angular.mock.TzDate.prototype = Date.prototype;
	/* jshint +W101 */
	
	
	/**
	 * @ngdoc service
	 * @name $animate
	 *
	 * @description
	 * Mock implementation of the {@link ng.$animate `$animate`} service. Exposes two additional methods
	 * for testing animations.
	 */
	angular.mock.animate = angular.module('ngAnimateMock', ['ng'])
	
	  .config(['$provide', function($provide) {
	
	    $provide.factory('$$forceReflow', function() {
	      function reflowFn() {
	        reflowFn.totalReflows++;
	      }
	      reflowFn.totalReflows = 0;
	      return reflowFn;
	    });
	
	    $provide.factory('$$animateAsyncRun', function() {
	      var queue = [];
	      var queueFn = function() {
	        return function(fn) {
	          queue.push(fn);
	        };
	      };
	      queueFn.flush = function() {
	        if (queue.length === 0) return false;
	
	        for (var i = 0; i < queue.length; i++) {
	          queue[i]();
	        }
	        queue = [];
	
	        return true;
	      };
	      return queueFn;
	    });
	
	    $provide.decorator('$$animateJs', ['$delegate', function($delegate) {
	      var runners = [];
	
	      var animateJsConstructor = function() {
	        var animator = $delegate.apply($delegate, arguments);
	        // If no javascript animation is found, animator is undefined
	        if (animator) {
	          runners.push(animator);
	        }
	        return animator;
	      };
	
	      animateJsConstructor.$closeAndFlush = function() {
	        runners.forEach(function(runner) {
	          runner.end();
	        });
	        runners = [];
	      };
	
	      return animateJsConstructor;
	    }]);
	
	    $provide.decorator('$animateCss', ['$delegate', function($delegate) {
	      var runners = [];
	
	      var animateCssConstructor = function(element, options) {
	        var animator = $delegate(element, options);
	        runners.push(animator);
	        return animator;
	      };
	
	      animateCssConstructor.$closeAndFlush = function() {
	        runners.forEach(function(runner) {
	          runner.end();
	        });
	        runners = [];
	      };
	
	      return animateCssConstructor;
	    }]);
	
	    $provide.decorator('$animate', ['$delegate', '$timeout', '$browser', '$$rAF', '$animateCss', '$$animateJs',
	                                    '$$forceReflow', '$$animateAsyncRun', '$rootScope',
	                            function($delegate,   $timeout,   $browser,   $$rAF,   $animateCss,   $$animateJs,
	                                     $$forceReflow,   $$animateAsyncRun,  $rootScope) {
	      var animate = {
	        queue: [],
	        cancel: $delegate.cancel,
	        on: $delegate.on,
	        off: $delegate.off,
	        pin: $delegate.pin,
	        get reflows() {
	          return $$forceReflow.totalReflows;
	        },
	        enabled: $delegate.enabled,
	        /**
	         * @ngdoc method
	         * @name $animate#closeAndFlush
	         * @description
	         *
	         * This method will close all pending animations (both {@link ngAnimate#javascript-based-animations Javascript}
	         * and {@link ngAnimate.$animateCss CSS}) and it will also flush any remaining animation frames and/or callbacks.
	         */
	        closeAndFlush: function() {
	          // we allow the flush command to swallow the errors
	          // because depending on whether CSS or JS animations are
	          // used, there may not be a RAF flush. The primary flush
	          // at the end of this function must throw an exception
	          // because it will track if there were pending animations
	          this.flush(true);
	          $animateCss.$closeAndFlush();
	          $$animateJs.$closeAndFlush();
	          this.flush();
	        },
	        /**
	         * @ngdoc method
	         * @name $animate#flush
	         * @description
	         *
	         * This method is used to flush the pending callbacks and animation frames to either start
	         * an animation or conclude an animation. Note that this will not actually close an
	         * actively running animation (see {@link ngMock.$animate#closeAndFlush `closeAndFlush()`} for that).
	         */
	        flush: function(hideErrors) {
	          $rootScope.$digest();
	
	          var doNextRun, somethingFlushed = false;
	          do {
	            doNextRun = false;
	
	            if ($$rAF.queue.length) {
	              $$rAF.flush();
	              doNextRun = somethingFlushed = true;
	            }
	
	            if ($$animateAsyncRun.flush()) {
	              doNextRun = somethingFlushed = true;
	            }
	          } while (doNextRun);
	
	          if (!somethingFlushed && !hideErrors) {
	            throw new Error('No pending animations ready to be closed or flushed');
	          }
	
	          $rootScope.$digest();
	        }
	      };
	
	      angular.forEach(
	        ['animate','enter','leave','move','addClass','removeClass','setClass'], function(method) {
	        animate[method] = function() {
	          animate.queue.push({
	            event: method,
	            element: arguments[0],
	            options: arguments[arguments.length - 1],
	            args: arguments
	          });
	          return $delegate[method].apply($delegate, arguments);
	        };
	      });
	
	      return animate;
	    }]);
	
	  }]);
	
	
	/**
	 * @ngdoc function
	 * @name angular.mock.dump
	 * @description
	 *
	 * *NOTE*: this is not an injectable instance, just a globally available function.
	 *
	 * Method for serializing common angular objects (scope, elements, etc..) into strings, useful for
	 * debugging.
	 *
	 * This method is also available on window, where it can be used to display objects on debug
	 * console.
	 *
	 * @param {*} object - any object to turn into string.
	 * @return {string} a serialized string of the argument
	 */
	angular.mock.dump = function(object) {
	  return serialize(object);
	
	  function serialize(object) {
	    var out;
	
	    if (angular.isElement(object)) {
	      object = angular.element(object);
	      out = angular.element('<div></div>');
	      angular.forEach(object, function(element) {
	        out.append(angular.element(element).clone());
	      });
	      out = out.html();
	    } else if (angular.isArray(object)) {
	      out = [];
	      angular.forEach(object, function(o) {
	        out.push(serialize(o));
	      });
	      out = '[ ' + out.join(', ') + ' ]';
	    } else if (angular.isObject(object)) {
	      if (angular.isFunction(object.$eval) && angular.isFunction(object.$apply)) {
	        out = serializeScope(object);
	      } else if (object instanceof Error) {
	        out = object.stack || ('' + object.name + ': ' + object.message);
	      } else {
	        // TODO(i): this prevents methods being logged,
	        // we should have a better way to serialize objects
	        out = angular.toJson(object, true);
	      }
	    } else {
	      out = String(object);
	    }
	
	    return out;
	  }
	
	  function serializeScope(scope, offset) {
	    offset = offset ||  '  ';
	    var log = [offset + 'Scope(' + scope.$id + '): {'];
	    for (var key in scope) {
	      if (Object.prototype.hasOwnProperty.call(scope, key) && !key.match(/^(\$|this)/)) {
	        log.push('  ' + key + ': ' + angular.toJson(scope[key]));
	      }
	    }
	    var child = scope.$$childHead;
	    while (child) {
	      log.push(serializeScope(child, offset + '  '));
	      child = child.$$nextSibling;
	    }
	    log.push('}');
	    return log.join('\n' + offset);
	  }
	};
	
	/**
	 * @ngdoc service
	 * @name $httpBackend
	 * @description
	 * Fake HTTP backend implementation suitable for unit testing applications that use the
	 * {@link ng.$http $http service}.
	 *
	 * *Note*: For fake HTTP backend implementation suitable for end-to-end testing or backend-less
	 * development please see {@link ngMockE2E.$httpBackend e2e $httpBackend mock}.
	 *
	 * During unit testing, we want our unit tests to run quickly and have no external dependencies so
	 * we don’t want to send [XHR](https://developer.mozilla.org/en/xmlhttprequest) or
	 * [JSONP](http://en.wikipedia.org/wiki/JSONP) requests to a real server. All we really need is
	 * to verify whether a certain request has been sent or not, or alternatively just let the
	 * application make requests, respond with pre-trained responses and assert that the end result is
	 * what we expect it to be.
	 *
	 * This mock implementation can be used to respond with static or dynamic responses via the
	 * `expect` and `when` apis and their shortcuts (`expectGET`, `whenPOST`, etc).
	 *
	 * When an Angular application needs some data from a server, it calls the $http service, which
	 * sends the request to a real server using $httpBackend service. With dependency injection, it is
	 * easy to inject $httpBackend mock (which has the same API as $httpBackend) and use it to verify
	 * the requests and respond with some testing data without sending a request to a real server.
	 *
	 * There are two ways to specify what test data should be returned as http responses by the mock
	 * backend when the code under test makes http requests:
	 *
	 * - `$httpBackend.expect` - specifies a request expectation
	 * - `$httpBackend.when` - specifies a backend definition
	 *
	 *
	 * ## Request Expectations vs Backend Definitions
	 *
	 * Request expectations provide a way to make assertions about requests made by the application and
	 * to define responses for those requests. The test will fail if the expected requests are not made
	 * or they are made in the wrong order.
	 *
	 * Backend definitions allow you to define a fake backend for your application which doesn't assert
	 * if a particular request was made or not, it just returns a trained response if a request is made.
	 * The test will pass whether or not the request gets made during testing.
	 *
	 *
	 * <table class="table">
	 *   <tr><th width="220px"></th><th>Request expectations</th><th>Backend definitions</th></tr>
	 *   <tr>
	 *     <th>Syntax</th>
	 *     <td>.expect(...).respond(...)</td>
	 *     <td>.when(...).respond(...)</td>
	 *   </tr>
	 *   <tr>
	 *     <th>Typical usage</th>
	 *     <td>strict unit tests</td>
	 *     <td>loose (black-box) unit testing</td>
	 *   </tr>
	 *   <tr>
	 *     <th>Fulfills multiple requests</th>
	 *     <td>NO</td>
	 *     <td>YES</td>
	 *   </tr>
	 *   <tr>
	 *     <th>Order of requests matters</th>
	 *     <td>YES</td>
	 *     <td>NO</td>
	 *   </tr>
	 *   <tr>
	 *     <th>Request required</th>
	 *     <td>YES</td>
	 *     <td>NO</td>
	 *   </tr>
	 *   <tr>
	 *     <th>Response required</th>
	 *     <td>optional (see below)</td>
	 *     <td>YES</td>
	 *   </tr>
	 * </table>
	 *
	 * In cases where both backend definitions and request expectations are specified during unit
	 * testing, the request expectations are evaluated first.
	 *
	 * If a request expectation has no response specified, the algorithm will search your backend
	 * definitions for an appropriate response.
	 *
	 * If a request didn't match any expectation or if the expectation doesn't have the response
	 * defined, the backend definitions are evaluated in sequential order to see if any of them match
	 * the request. The response from the first matched definition is returned.
	 *
	 *
	 * ## Flushing HTTP requests
	 *
	 * The $httpBackend used in production always responds to requests asynchronously. If we preserved
	 * this behavior in unit testing, we'd have to create async unit tests, which are hard to write,
	 * to follow and to maintain. But neither can the testing mock respond synchronously; that would
	 * change the execution of the code under test. For this reason, the mock $httpBackend has a
	 * `flush()` method, which allows the test to explicitly flush pending requests. This preserves
	 * the async api of the backend, while allowing the test to execute synchronously.
	 *
	 *
	 * ## Unit testing with mock $httpBackend
	 * The following code shows how to setup and use the mock backend when unit testing a controller.
	 * First we create the controller under test:
	 *
	  ```js
	  // The module code
	  angular
	    .module('MyApp', [])
	    .controller('MyController', MyController);
	
	  // The controller code
	  function MyController($scope, $http) {
	    var authToken;
	
	    $http.get('/auth.py').then(function(response) {
	      authToken = response.headers('A-Token');
	      $scope.user = response.data;
	    });
	
	    $scope.saveMessage = function(message) {
	      var headers = { 'Authorization': authToken };
	      $scope.status = 'Saving...';
	
	      $http.post('/add-msg.py', message, { headers: headers } ).then(function(response) {
	        $scope.status = '';
	      }).catch(function() {
	        $scope.status = 'Failed...';
	      });
	    };
	  }
	  ```
	 *
	 * Now we setup the mock backend and create the test specs:
	 *
	  ```js
	    // testing controller
	    describe('MyController', function() {
	       var $httpBackend, $rootScope, createController, authRequestHandler;
	
	       // Set up the module
	       beforeEach(module('MyApp'));
	
	       beforeEach(inject(function($injector) {
	         // Set up the mock http service responses
	         $httpBackend = $injector.get('$httpBackend');
	         // backend definition common for all tests
	         authRequestHandler = $httpBackend.when('GET', '/auth.py')
	                                .respond({userId: 'userX'}, {'A-Token': 'xxx'});
	
	         // Get hold of a scope (i.e. the root scope)
	         $rootScope = $injector.get('$rootScope');
	         // The $controller service is used to create instances of controllers
	         var $controller = $injector.get('$controller');
	
	         createController = function() {
	           return $controller('MyController', {'$scope' : $rootScope });
	         };
	       }));
	
	
	       afterEach(function() {
	         $httpBackend.verifyNoOutstandingExpectation();
	         $httpBackend.verifyNoOutstandingRequest();
	       });
	
	
	       it('should fetch authentication token', function() {
	         $httpBackend.expectGET('/auth.py');
	         var controller = createController();
	         $httpBackend.flush();
	       });
	
	
	       it('should fail authentication', function() {
	
	         // Notice how you can change the response even after it was set
	         authRequestHandler.respond(401, '');
	
	         $httpBackend.expectGET('/auth.py');
	         var controller = createController();
	         $httpBackend.flush();
	         expect($rootScope.status).toBe('Failed...');
	       });
	
	
	       it('should send msg to server', function() {
	         var controller = createController();
	         $httpBackend.flush();
	
	         // now you don’t care about the authentication, but
	         // the controller will still send the request and
	         // $httpBackend will respond without you having to
	         // specify the expectation and response for this request
	
	         $httpBackend.expectPOST('/add-msg.py', 'message content').respond(201, '');
	         $rootScope.saveMessage('message content');
	         expect($rootScope.status).toBe('Saving...');
	         $httpBackend.flush();
	         expect($rootScope.status).toBe('');
	       });
	
	
	       it('should send auth header', function() {
	         var controller = createController();
	         $httpBackend.flush();
	
	         $httpBackend.expectPOST('/add-msg.py', undefined, function(headers) {
	           // check if the header was sent, if it wasn't the expectation won't
	           // match the request and the test will fail
	           return headers['Authorization'] == 'xxx';
	         }).respond(201, '');
	
	         $rootScope.saveMessage('whatever');
	         $httpBackend.flush();
	       });
	    });
	  ```
	 *
	 * ## Dynamic responses
	 *
	 * You define a response to a request by chaining a call to `respond()` onto a definition or expectation.
	 * If you provide a **callback** as the first parameter to `respond(callback)` then you can dynamically generate
	 * a response based on the properties of the request.
	 *
	 * The `callback` function should be of the form `function(method, url, data, headers, params)`.
	 *
	 * ### Query parameters
	 *
	 * By default, query parameters on request URLs are parsed into the `params` object. So a request URL
	 * of `/list?q=searchstr&orderby=-name` would set `params` to be `{q: 'searchstr', orderby: '-name'}`.
	 *
	 * ### Regex parameter matching
	 *
	 * If an expectation or definition uses a **regex** to match the URL, you can provide an array of **keys** via a
	 * `params` argument. The index of each **key** in the array will match the index of a **group** in the
	 * **regex**.
	 *
	 * The `params` object in the **callback** will now have properties with these keys, which hold the value of the
	 * corresponding **group** in the **regex**.
	 *
	 * This also applies to the `when` and `expect` shortcut methods.
	 *
	 *
	 * ```js
	 *   $httpBackend.expect('GET', /\/user\/(.+)/, undefined, undefined, ['id'])
	 *     .respond(function(method, url, data, headers, params) {
	 *       // for requested url of '/user/1234' params is {id: '1234'}
	 *     });
	 *
	 *   $httpBackend.whenPATCH(/\/user\/(.+)\/article\/(.+)/, undefined, undefined, ['user', 'article'])
	 *     .respond(function(method, url, data, headers, params) {
	 *       // for url of '/user/1234/article/567' params is {user: '1234', article: '567'}
	 *     });
	 * ```
	 *
	 * ## Matching route requests
	 *
	 * For extra convenience, `whenRoute` and `expectRoute` shortcuts are available. These methods offer colon
	 * delimited matching of the url path, ignoring the query string. This allows declarations
	 * similar to how application routes are configured with `$routeProvider`. Because these methods convert
	 * the definition url to regex, declaration order is important. Combined with query parameter parsing,
	 * the following is possible:
	 *
	  ```js
	    $httpBackend.whenRoute('GET', '/users/:id')
	      .respond(function(method, url, data, headers, params) {
	        return [200, MockUserList[Number(params.id)]];
	      });
	
	    $httpBackend.whenRoute('GET', '/users')
	      .respond(function(method, url, data, headers, params) {
	        var userList = angular.copy(MockUserList),
	          defaultSort = 'lastName',
	          count, pages, isPrevious, isNext;
	
	        // paged api response '/v1/users?page=2'
	        params.page = Number(params.page) || 1;
	
	        // query for last names '/v1/users?q=Archer'
	        if (params.q) {
	          userList = $filter('filter')({lastName: params.q});
	        }
	
	        pages = Math.ceil(userList.length / pagingLength);
	        isPrevious = params.page > 1;
	        isNext = params.page < pages;
	
	        return [200, {
	          count:    userList.length,
	          previous: isPrevious,
	          next:     isNext,
	          // sort field -> '/v1/users?sortBy=firstName'
	          results:  $filter('orderBy')(userList, params.sortBy || defaultSort)
	                      .splice((params.page - 1) * pagingLength, pagingLength)
	        }];
	      });
	  ```
	 */
	angular.mock.$HttpBackendProvider = function() {
	  this.$get = ['$rootScope', '$timeout', createHttpBackendMock];
	};
	
	/**
	 * General factory function for $httpBackend mock.
	 * Returns instance for unit testing (when no arguments specified):
	 *   - passing through is disabled
	 *   - auto flushing is disabled
	 *
	 * Returns instance for e2e testing (when `$delegate` and `$browser` specified):
	 *   - passing through (delegating request to real backend) is enabled
	 *   - auto flushing is enabled
	 *
	 * @param {Object=} $delegate Real $httpBackend instance (allow passing through if specified)
	 * @param {Object=} $browser Auto-flushing enabled if specified
	 * @return {Object} Instance of $httpBackend mock
	 */
	function createHttpBackendMock($rootScope, $timeout, $delegate, $browser) {
	  var definitions = [],
	      expectations = [],
	      responses = [],
	      responsesPush = angular.bind(responses, responses.push),
	      copy = angular.copy;
	
	  function createResponse(status, data, headers, statusText) {
	    if (angular.isFunction(status)) return status;
	
	    return function() {
	      return angular.isNumber(status)
	          ? [status, data, headers, statusText]
	          : [200, status, data, headers];
	    };
	  }
	
	  // TODO(vojta): change params to: method, url, data, headers, callback
	  function $httpBackend(method, url, data, callback, headers, timeout, withCredentials, responseType, eventHandlers, uploadEventHandlers) {
	
	    var xhr = new MockXhr(),
	        expectation = expectations[0],
	        wasExpected = false;
	
	    xhr.$$events = eventHandlers;
	    xhr.upload.$$events = uploadEventHandlers;
	
	    function prettyPrint(data) {
	      return (angular.isString(data) || angular.isFunction(data) || data instanceof RegExp)
	          ? data
	          : angular.toJson(data);
	    }
	
	    function wrapResponse(wrapped) {
	      if (!$browser && timeout) {
	        timeout.then ? timeout.then(handleTimeout) : $timeout(handleTimeout, timeout);
	      }
	
	      return handleResponse;
	
	      function handleResponse() {
	        var response = wrapped.response(method, url, data, headers, wrapped.params(url));
	        xhr.$$respHeaders = response[2];
	        callback(copy(response[0]), copy(response[1]), xhr.getAllResponseHeaders(),
	                 copy(response[3] || ''));
	      }
	
	      function handleTimeout() {
	        for (var i = 0, ii = responses.length; i < ii; i++) {
	          if (responses[i] === handleResponse) {
	            responses.splice(i, 1);
	            callback(-1, undefined, '');
	            break;
	          }
	        }
	      }
	    }
	
	    if (expectation && expectation.match(method, url)) {
	      if (!expectation.matchData(data)) {
	        throw new Error('Expected ' + expectation + ' with different data\n' +
	            'EXPECTED: ' + prettyPrint(expectation.data) + '\nGOT:      ' + data);
	      }
	
	      if (!expectation.matchHeaders(headers)) {
	        throw new Error('Expected ' + expectation + ' with different headers\n' +
	                        'EXPECTED: ' + prettyPrint(expectation.headers) + '\nGOT:      ' +
	                        prettyPrint(headers));
	      }
	
	      expectations.shift();
	
	      if (expectation.response) {
	        responses.push(wrapResponse(expectation));
	        return;
	      }
	      wasExpected = true;
	    }
	
	    var i = -1, definition;
	    while ((definition = definitions[++i])) {
	      if (definition.match(method, url, data, headers || {})) {
	        if (definition.response) {
	          // if $browser specified, we do auto flush all requests
	          ($browser ? $browser.defer : responsesPush)(wrapResponse(definition));
	        } else if (definition.passThrough) {
	          $delegate(method, url, data, callback, headers, timeout, withCredentials, responseType);
	        } else throw new Error('No response defined !');
	        return;
	      }
	    }
	    throw wasExpected ?
	        new Error('No response defined !') :
	        new Error('Unexpected request: ' + method + ' ' + url + '\n' +
	                  (expectation ? 'Expected ' + expectation : 'No more request expected'));
	  }
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#when
	   * @description
	   * Creates a new backend definition.
	   *
	   * @param {string} method HTTP method.
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(string|RegExp|function(string))=} data HTTP request body or function that receives
	   *   data string and returns true if the data is as expected.
	   * @param {(Object|function(Object))=} headers HTTP headers or function that receives http header
	   *   object and returns true if the headers match the current definition.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   *   request is handled. You can save this object for later use and invoke `respond` again in
	   *   order to change how a matched request is handled.
	   *
	   *  - respond –
	   *      ```js
	   *      {function([status,] data[, headers, statusText])
	   *      | function(function(method, url, data, headers, params)}
	   *      ```
	   *    – The respond method takes a set of static data to be returned or a function that can
	   *    return an array containing response status (number), response data (Array|Object|string),
	   *    response headers (Object), and the text for the status (string). The respond method returns
	   *    the `requestHandler` object for possible overrides.
	   */
	  $httpBackend.when = function(method, url, data, headers, keys) {
	    var definition = new MockHttpExpectation(method, url, data, headers, keys),
	        chain = {
	          respond: function(status, data, headers, statusText) {
	            definition.passThrough = undefined;
	            definition.response = createResponse(status, data, headers, statusText);
	            return chain;
	          }
	        };
	
	    if ($browser) {
	      chain.passThrough = function() {
	        definition.response = undefined;
	        definition.passThrough = true;
	        return chain;
	      };
	    }
	
	    definitions.push(definition);
	    return chain;
	  };
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#whenGET
	   * @description
	   * Creates a new backend definition for GET requests. For more info see `when()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(Object|function(Object))=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   * request is handled. You can save this object for later use and invoke `respond` again in
	   * order to change how a matched request is handled.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#whenHEAD
	   * @description
	   * Creates a new backend definition for HEAD requests. For more info see `when()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(Object|function(Object))=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   * request is handled. You can save this object for later use and invoke `respond` again in
	   * order to change how a matched request is handled.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#whenDELETE
	   * @description
	   * Creates a new backend definition for DELETE requests. For more info see `when()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(Object|function(Object))=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   * request is handled. You can save this object for later use and invoke `respond` again in
	   * order to change how a matched request is handled.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#whenPOST
	   * @description
	   * Creates a new backend definition for POST requests. For more info see `when()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(string|RegExp|function(string))=} data HTTP request body or function that receives
	   *   data string and returns true if the data is as expected.
	   * @param {(Object|function(Object))=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   * request is handled. You can save this object for later use and invoke `respond` again in
	   * order to change how a matched request is handled.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#whenPUT
	   * @description
	   * Creates a new backend definition for PUT requests.  For more info see `when()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(string|RegExp|function(string))=} data HTTP request body or function that receives
	   *   data string and returns true if the data is as expected.
	   * @param {(Object|function(Object))=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   * request is handled. You can save this object for later use and invoke `respond` again in
	   * order to change how a matched request is handled.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#whenJSONP
	   * @description
	   * Creates a new backend definition for JSONP requests. For more info see `when()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   * request is handled. You can save this object for later use and invoke `respond` again in
	   * order to change how a matched request is handled.
	   */
	  createShortMethods('when');
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#whenRoute
	   * @description
	   * Creates a new backend definition that compares only with the requested route.
	   *
	   * @param {string} method HTTP method.
	   * @param {string} url HTTP url string that supports colon param matching.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   * request is handled. You can save this object for later use and invoke `respond` again in
	   * order to change how a matched request is handled. See #when for more info.
	   */
	  $httpBackend.whenRoute = function(method, url) {
	    var pathObj = parseRoute(url);
	    return $httpBackend.when(method, pathObj.regexp, undefined, undefined, pathObj.keys);
	  };
	
	  function parseRoute(url) {
	    var ret = {
	      regexp: url
	    },
	    keys = ret.keys = [];
	
	    if (!url || !angular.isString(url)) return ret;
	
	    url = url
	      .replace(/([().])/g, '\\$1')
	      .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
	        var optional = option === '?' ? option : null;
	        var star = option === '*' ? option : null;
	        keys.push({ name: key, optional: !!optional });
	        slash = slash || '';
	        return ''
	          + (optional ? '' : slash)
	          + '(?:'
	          + (optional ? slash : '')
	          + (star && '(.+?)' || '([^/]+)')
	          + (optional || '')
	          + ')'
	          + (optional || '');
	      })
	      .replace(/([\/$\*])/g, '\\$1');
	
	    ret.regexp = new RegExp('^' + url, 'i');
	    return ret;
	  }
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#expect
	   * @description
	   * Creates a new request expectation.
	   *
	   * @param {string} method HTTP method.
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
	   *  receives data string and returns true if the data is as expected, or Object if request body
	   *  is in JSON format.
	   * @param {(Object|function(Object))=} headers HTTP headers or function that receives http header
	   *   object and returns true if the headers match the current expectation.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   *  request is handled. You can save this object for later use and invoke `respond` again in
	   *  order to change how a matched request is handled.
	   *
	   *  - respond –
	   *    ```
	   *    { function([status,] data[, headers, statusText])
	   *    | function(function(method, url, data, headers, params)}
	   *    ```
	   *    – The respond method takes a set of static data to be returned or a function that can
	   *    return an array containing response status (number), response data (Array|Object|string),
	   *    response headers (Object), and the text for the status (string). The respond method returns
	   *    the `requestHandler` object for possible overrides.
	   */
	  $httpBackend.expect = function(method, url, data, headers, keys) {
	    var expectation = new MockHttpExpectation(method, url, data, headers, keys),
	        chain = {
	          respond: function(status, data, headers, statusText) {
	            expectation.response = createResponse(status, data, headers, statusText);
	            return chain;
	          }
	        };
	
	    expectations.push(expectation);
	    return chain;
	  };
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#expectGET
	   * @description
	   * Creates a new request expectation for GET requests. For more info see `expect()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {Object=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   * request is handled. You can save this object for later use and invoke `respond` again in
	   * order to change how a matched request is handled. See #expect for more info.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#expectHEAD
	   * @description
	   * Creates a new request expectation for HEAD requests. For more info see `expect()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {Object=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   *   request is handled. You can save this object for later use and invoke `respond` again in
	   *   order to change how a matched request is handled.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#expectDELETE
	   * @description
	   * Creates a new request expectation for DELETE requests. For more info see `expect()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {Object=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   *   request is handled. You can save this object for later use and invoke `respond` again in
	   *   order to change how a matched request is handled.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#expectPOST
	   * @description
	   * Creates a new request expectation for POST requests. For more info see `expect()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
	   *  receives data string and returns true if the data is as expected, or Object if request body
	   *  is in JSON format.
	   * @param {Object=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   *   request is handled. You can save this object for later use and invoke `respond` again in
	   *   order to change how a matched request is handled.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#expectPUT
	   * @description
	   * Creates a new request expectation for PUT requests. For more info see `expect()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
	   *  receives data string and returns true if the data is as expected, or Object if request body
	   *  is in JSON format.
	   * @param {Object=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   *   request is handled. You can save this object for later use and invoke `respond` again in
	   *   order to change how a matched request is handled.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#expectPATCH
	   * @description
	   * Creates a new request expectation for PATCH requests. For more info see `expect()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	   *   and returns true if the url matches the current definition.
	   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
	   *  receives data string and returns true if the data is as expected, or Object if request body
	   *  is in JSON format.
	   * @param {Object=} headers HTTP headers.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   *   request is handled. You can save this object for later use and invoke `respond` again in
	   *   order to change how a matched request is handled.
	   */
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#expectJSONP
	   * @description
	   * Creates a new request expectation for JSONP requests. For more info see `expect()`.
	   *
	   * @param {string|RegExp|function(string)} url HTTP url or function that receives an url
	   *   and returns true if the url matches the current definition.
	   * @param {(Array)=} keys Array of keys to assign to regex matches in request url described above.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   *   request is handled. You can save this object for later use and invoke `respond` again in
	   *   order to change how a matched request is handled.
	   */
	  createShortMethods('expect');
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#expectRoute
	   * @description
	   * Creates a new request expectation that compares only with the requested route.
	   *
	   * @param {string} method HTTP method.
	   * @param {string} url HTTP url string that supports colon param matching.
	   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
	   * request is handled. You can save this object for later use and invoke `respond` again in
	   * order to change how a matched request is handled. See #expect for more info.
	   */
	  $httpBackend.expectRoute = function(method, url) {
	    var pathObj = parseRoute(url);
	    return $httpBackend.expect(method, pathObj.regexp, undefined, undefined, pathObj.keys);
	  };
	
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#flush
	   * @description
	   * Flushes all pending requests using the trained responses.
	   *
	   * @param {number=} count Number of responses to flush (in the order they arrived). If undefined,
	   *   all pending requests will be flushed. If there are no pending requests when the flush method
	   *   is called an exception is thrown (as this typically a sign of programming error).
	   */
	  $httpBackend.flush = function(count, digest) {
	    if (digest !== false) $rootScope.$digest();
	    if (!responses.length) throw new Error('No pending request to flush !');
	
	    if (angular.isDefined(count) && count !== null) {
	      while (count--) {
	        if (!responses.length) throw new Error('No more pending request to flush !');
	        responses.shift()();
	      }
	    } else {
	      while (responses.length) {
	        responses.shift()();
	      }
	    }
	    $httpBackend.verifyNoOutstandingExpectation(digest);
	  };
	
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#verifyNoOutstandingExpectation
	   * @description
	   * Verifies that all of the requests defined via the `expect` api were made. If any of the
	   * requests were not made, verifyNoOutstandingExpectation throws an exception.
	   *
	   * Typically, you would call this method following each test case that asserts requests using an
	   * "afterEach" clause.
	   *
	   * ```js
	   *   afterEach($httpBackend.verifyNoOutstandingExpectation);
	   * ```
	   */
	  $httpBackend.verifyNoOutstandingExpectation = function(digest) {
	    if (digest !== false) $rootScope.$digest();
	    if (expectations.length) {
	      throw new Error('Unsatisfied requests: ' + expectations.join(', '));
	    }
	  };
	
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#verifyNoOutstandingRequest
	   * @description
	   * Verifies that there are no outstanding requests that need to be flushed.
	   *
	   * Typically, you would call this method following each test case that asserts requests using an
	   * "afterEach" clause.
	   *
	   * ```js
	   *   afterEach($httpBackend.verifyNoOutstandingRequest);
	   * ```
	   */
	  $httpBackend.verifyNoOutstandingRequest = function() {
	    if (responses.length) {
	      throw new Error('Unflushed requests: ' + responses.length);
	    }
	  };
	
	
	  /**
	   * @ngdoc method
	   * @name $httpBackend#resetExpectations
	   * @description
	   * Resets all request expectations, but preserves all backend definitions. Typically, you would
	   * call resetExpectations during a multiple-phase test when you want to reuse the same instance of
	   * $httpBackend mock.
	   */
	  $httpBackend.resetExpectations = function() {
	    expectations.length = 0;
	    responses.length = 0;
	  };
	
	  return $httpBackend;
	
	
	  function createShortMethods(prefix) {
	    angular.forEach(['GET', 'DELETE', 'JSONP', 'HEAD'], function(method) {
	     $httpBackend[prefix + method] = function(url, headers, keys) {
	       return $httpBackend[prefix](method, url, undefined, headers, keys);
	     };
	    });
	
	    angular.forEach(['PUT', 'POST', 'PATCH'], function(method) {
	      $httpBackend[prefix + method] = function(url, data, headers, keys) {
	        return $httpBackend[prefix](method, url, data, headers, keys);
	      };
	    });
	  }
	}
	
	function MockHttpExpectation(method, url, data, headers, keys) {
	
	  this.data = data;
	  this.headers = headers;
	
	  this.match = function(m, u, d, h) {
	    if (method != m) return false;
	    if (!this.matchUrl(u)) return false;
	    if (angular.isDefined(d) && !this.matchData(d)) return false;
	    if (angular.isDefined(h) && !this.matchHeaders(h)) return false;
	    return true;
	  };
	
	  this.matchUrl = function(u) {
	    if (!url) return true;
	    if (angular.isFunction(url.test)) return url.test(u);
	    if (angular.isFunction(url)) return url(u);
	    return url == u;
	  };
	
	  this.matchHeaders = function(h) {
	    if (angular.isUndefined(headers)) return true;
	    if (angular.isFunction(headers)) return headers(h);
	    return angular.equals(headers, h);
	  };
	
	  this.matchData = function(d) {
	    if (angular.isUndefined(data)) return true;
	    if (data && angular.isFunction(data.test)) return data.test(d);
	    if (data && angular.isFunction(data)) return data(d);
	    if (data && !angular.isString(data)) {
	      return angular.equals(angular.fromJson(angular.toJson(data)), angular.fromJson(d));
	    }
	    return data == d;
	  };
	
	  this.toString = function() {
	    return method + ' ' + url;
	  };
	
	  this.params = function(u) {
	    return angular.extend(parseQuery(), pathParams());
	
	    function pathParams() {
	      var keyObj = {};
	      if (!url || !angular.isFunction(url.test) || !keys || keys.length === 0) return keyObj;
	
	      var m = url.exec(u);
	      if (!m) return keyObj;
	      for (var i = 1, len = m.length; i < len; ++i) {
	        var key = keys[i - 1];
	        var val = m[i];
	        if (key && val) {
	          keyObj[key.name || key] = val;
	        }
	      }
	
	      return keyObj;
	    }
	
	    function parseQuery() {
	      var obj = {}, key_value, key,
	          queryStr = u.indexOf('?') > -1
	          ? u.substring(u.indexOf('?') + 1)
	          : "";
	
	      angular.forEach(queryStr.split('&'), function(keyValue) {
	        if (keyValue) {
	          key_value = keyValue.replace(/\+/g,'%20').split('=');
	          key = tryDecodeURIComponent(key_value[0]);
	          if (angular.isDefined(key)) {
	            var val = angular.isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
	            if (!hasOwnProperty.call(obj, key)) {
	              obj[key] = val;
	            } else if (angular.isArray(obj[key])) {
	              obj[key].push(val);
	            } else {
	              obj[key] = [obj[key],val];
	            }
	          }
	        }
	      });
	      return obj;
	    }
	    function tryDecodeURIComponent(value) {
	      try {
	        return decodeURIComponent(value);
	      } catch (e) {
	        // Ignore any invalid uri component
	      }
	    }
	  };
	}
	
	function createMockXhr() {
	  return new MockXhr();
	}
	
	function MockXhr() {
	
	  // hack for testing $http, $httpBackend
	  MockXhr.$$lastInstance = this;
	
	  this.open = function(method, url, async) {
	    this.$$method = method;
	    this.$$url = url;
	    this.$$async = async;
	    this.$$reqHeaders = {};
	    this.$$respHeaders = {};
	  };
	
	  this.send = function(data) {
	    this.$$data = data;
	  };
	
	  this.setRequestHeader = function(key, value) {
	    this.$$reqHeaders[key] = value;
	  };
	
	  this.getResponseHeader = function(name) {
	    // the lookup must be case insensitive,
	    // that's why we try two quick lookups first and full scan last
	    var header = this.$$respHeaders[name];
	    if (header) return header;
	
	    name = angular.lowercase(name);
	    header = this.$$respHeaders[name];
	    if (header) return header;
	
	    header = undefined;
	    angular.forEach(this.$$respHeaders, function(headerVal, headerName) {
	      if (!header && angular.lowercase(headerName) == name) header = headerVal;
	    });
	    return header;
	  };
	
	  this.getAllResponseHeaders = function() {
	    var lines = [];
	
	    angular.forEach(this.$$respHeaders, function(value, key) {
	      lines.push(key + ': ' + value);
	    });
	    return lines.join('\n');
	  };
	
	  this.abort = angular.noop;
	
	  // This section simulates the events on a real XHR object (and the upload object)
	  // When we are testing $httpBackend (inside the angular project) we make partial use of this
	  // but store the events directly ourselves on `$$events`, instead of going through the `addEventListener`
	  this.$$events = {};
	  this.addEventListener = function(name, listener) {
	    if (angular.isUndefined(this.$$events[name])) this.$$events[name] = [];
	    this.$$events[name].push(listener);
	  };
	
	  this.upload = {
	    $$events: {},
	    addEventListener: this.addEventListener
	  };
	}
	
	
	/**
	 * @ngdoc service
	 * @name $timeout
	 * @description
	 *
	 * This service is just a simple decorator for {@link ng.$timeout $timeout} service
	 * that adds a "flush" and "verifyNoPendingTasks" methods.
	 */
	
	angular.mock.$TimeoutDecorator = ['$delegate', '$browser', function($delegate, $browser) {
	
	  /**
	   * @ngdoc method
	   * @name $timeout#flush
	   * @description
	   *
	   * Flushes the queue of pending tasks.
	   *
	   * @param {number=} delay maximum timeout amount to flush up until
	   */
	  $delegate.flush = function(delay) {
	    $browser.defer.flush(delay);
	  };
	
	  /**
	   * @ngdoc method
	   * @name $timeout#verifyNoPendingTasks
	   * @description
	   *
	   * Verifies that there are no pending tasks that need to be flushed.
	   */
	  $delegate.verifyNoPendingTasks = function() {
	    if ($browser.deferredFns.length) {
	      throw new Error('Deferred tasks to flush (' + $browser.deferredFns.length + '): ' +
	          formatPendingTasksAsString($browser.deferredFns));
	    }
	  };
	
	  function formatPendingTasksAsString(tasks) {
	    var result = [];
	    angular.forEach(tasks, function(task) {
	      result.push('{id: ' + task.id + ', ' + 'time: ' + task.time + '}');
	    });
	
	    return result.join(', ');
	  }
	
	  return $delegate;
	}];
	
	angular.mock.$RAFDecorator = ['$delegate', function($delegate) {
	  var rafFn = function(fn) {
	    var index = rafFn.queue.length;
	    rafFn.queue.push(fn);
	    return function() {
	      rafFn.queue.splice(index, 1);
	    };
	  };
	
	  rafFn.queue = [];
	  rafFn.supported = $delegate.supported;
	
	  rafFn.flush = function() {
	    if (rafFn.queue.length === 0) {
	      throw new Error('No rAF callbacks present');
	    }
	
	    var length = rafFn.queue.length;
	    for (var i = 0; i < length; i++) {
	      rafFn.queue[i]();
	    }
	
	    rafFn.queue = rafFn.queue.slice(i);
	  };
	
	  return rafFn;
	}];
	
	/**
	 *
	 */
	var originalRootElement;
	angular.mock.$RootElementProvider = function() {
	  this.$get = ['$injector', function($injector) {
	    originalRootElement = angular.element('<div ng-app></div>').data('$injector', $injector);
	    return originalRootElement;
	  }];
	};
	
	/**
	 * @ngdoc service
	 * @name $controller
	 * @description
	 * A decorator for {@link ng.$controller} with additional `bindings` parameter, useful when testing
	 * controllers of directives that use {@link $compile#-bindtocontroller- `bindToController`}.
	 *
	 *
	 * ## Example
	 *
	 * ```js
	 *
	 * // Directive definition ...
	 *
	 * myMod.directive('myDirective', {
	 *   controller: 'MyDirectiveController',
	 *   bindToController: {
	 *     name: '@'
	 *   }
	 * });
	 *
	 *
	 * // Controller definition ...
	 *
	 * myMod.controller('MyDirectiveController', ['$log', function($log) {
	 *   $log.info(this.name);
	 * }]);
	 *
	 *
	 * // In a test ...
	 *
	 * describe('myDirectiveController', function() {
	 *   it('should write the bound name to the log', inject(function($controller, $log) {
	 *     var ctrl = $controller('MyDirectiveController', { /* no locals &#42;/ }, { name: 'Clark Kent' });
	 *     expect(ctrl.name).toEqual('Clark Kent');
	 *     expect($log.info.logs).toEqual(['Clark Kent']);
	 *   }));
	 * });
	 *
	 * ```
	 *
	 * @param {Function|string} constructor If called with a function then it's considered to be the
	 *    controller constructor function. Otherwise it's considered to be a string which is used
	 *    to retrieve the controller constructor using the following steps:
	 *
	 *    * check if a controller with given name is registered via `$controllerProvider`
	 *    * check if evaluating the string on the current scope returns a constructor
	 *    * if $controllerProvider#allowGlobals, check `window[constructor]` on the global
	 *      `window` object (not recommended)
	 *
	 *    The string can use the `controller as property` syntax, where the controller instance is published
	 *    as the specified property on the `scope`; the `scope` must be injected into `locals` param for this
	 *    to work correctly.
	 *
	 * @param {Object} locals Injection locals for Controller.
	 * @param {Object=} bindings Properties to add to the controller before invoking the constructor. This is used
	 *                           to simulate the `bindToController` feature and simplify certain kinds of tests.
	 * @return {Object} Instance of given controller.
	 */
	angular.mock.$ControllerDecorator = ['$delegate', function($delegate) {
	  return function(expression, locals, later, ident) {
	    if (later && typeof later === 'object') {
	      var create = $delegate(expression, locals, true, ident);
	      angular.extend(create.instance, later);
	      return create();
	    }
	    return $delegate(expression, locals, later, ident);
	  };
	}];
	
	/**
	 * @ngdoc service
	 * @name $componentController
	 * @description
	 * A service that can be used to create instances of component controllers.
	 * <div class="alert alert-info">
	 * Be aware that the controller will be instantiated and attached to the scope as specified in
	 * the component definition object. If you do not provide a `$scope` object in the `locals` param
	 * then the helper will create a new isolated scope as a child of `$rootScope`.
	 * </div>
	 * @param {string} componentName the name of the component whose controller we want to instantiate
	 * @param {Object} locals Injection locals for Controller.
	 * @param {Object=} bindings Properties to add to the controller before invoking the constructor. This is used
	 *                           to simulate the `bindToController` feature and simplify certain kinds of tests.
	 * @param {string=} ident Override the property name to use when attaching the controller to the scope.
	 * @return {Object} Instance of requested controller.
	 */
	angular.mock.$ComponentControllerProvider = ['$compileProvider', function($compileProvider) {
	  this.$get = ['$controller','$injector', '$rootScope', function($controller, $injector, $rootScope) {
	    return function $componentController(componentName, locals, bindings, ident) {
	      // get all directives associated to the component name
	      var directives = $injector.get(componentName + 'Directive');
	      // look for those directives that are components
	      var candidateDirectives = directives.filter(function(directiveInfo) {
	        // components have controller, controllerAs and restrict:'E'
	        return directiveInfo.controller && directiveInfo.controllerAs && directiveInfo.restrict === 'E';
	      });
	      // check if valid directives found
	      if (candidateDirectives.length === 0) {
	        throw new Error('No component found');
	      }
	      if (candidateDirectives.length > 1) {
	        throw new Error('Too many components found');
	      }
	      // get the info of the component
	      var directiveInfo = candidateDirectives[0];
	      // create a scope if needed
	      locals = locals || {};
	      locals.$scope = locals.$scope || $rootScope.$new(true);
	      return $controller(directiveInfo.controller, locals, bindings, ident || directiveInfo.controllerAs);
	    };
	  }];
	}];
	
	
	/**
	 * @ngdoc module
	 * @name ngMock
	 * @packageName angular-mocks
	 * @description
	 *
	 * # ngMock
	 *
	 * The `ngMock` module provides support to inject and mock Angular services into unit tests.
	 * In addition, ngMock also extends various core ng services such that they can be
	 * inspected and controlled in a synchronous manner within test code.
	 *
	 *
	 * <div doc-module-components="ngMock"></div>
	 *
	 */
	angular.module('ngMock', ['ng']).provider({
	  $browser: angular.mock.$BrowserProvider,
	  $exceptionHandler: angular.mock.$ExceptionHandlerProvider,
	  $log: angular.mock.$LogProvider,
	  $interval: angular.mock.$IntervalProvider,
	  $httpBackend: angular.mock.$HttpBackendProvider,
	  $rootElement: angular.mock.$RootElementProvider,
	  $componentController: angular.mock.$ComponentControllerProvider
	}).config(['$provide', function($provide) {
	  $provide.decorator('$timeout', angular.mock.$TimeoutDecorator);
	  $provide.decorator('$$rAF', angular.mock.$RAFDecorator);
	  $provide.decorator('$rootScope', angular.mock.$RootScopeDecorator);
	  $provide.decorator('$controller', angular.mock.$ControllerDecorator);
	}]);
	
	/**
	 * @ngdoc module
	 * @name ngMockE2E
	 * @module ngMockE2E
	 * @packageName angular-mocks
	 * @description
	 *
	 * The `ngMockE2E` is an angular module which contains mocks suitable for end-to-end testing.
	 * Currently there is only one mock present in this module -
	 * the {@link ngMockE2E.$httpBackend e2e $httpBackend} mock.
	 */
	angular.module('ngMockE2E', ['ng']).config(['$provide', function($provide) {
	  $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
	}]);
	
	/**
	 * @ngdoc service
	 * @name $httpBackend
	 * @module ngMockE2E
	 * @description
	 * Fake HTTP backend implementation suitable for end-to-end testing or backend-less development of
	 * applications that use the {@link ng.$http $http service}.
	 *
	 * *Note*: For fake http backend implementation suitable for unit testing please see
	 * {@link ngMock.$httpBackend unit-testing $httpBackend mock}.
	 *
	 * This implementation can be used to respond with static or dynamic responses via the `when` api
	 * and its shortcuts (`whenGET`, `whenPOST`, etc) and optionally pass through requests to the
	 * real $httpBackend for specific requests (e.g. to interact with certain remote apis or to fetch
	 * templates from a webserver).
	 *
	 * As opposed to unit-testing, in an end-to-end testing scenario or in scenario when an application
	 * is being developed with the real backend api replaced with a mock, it is often desirable for
	 * certain category of requests to bypass the mock and issue a real http request (e.g. to fetch
	 * templates or static files from the webserver). To configure the backend with this behavior
	 * use the `passThrough` request handler of `when` instead of `respond`.
	 *
	 * Additionally, we don't want to manually have to flush mocked out requests like we do during unit
	 * testing. For this reason the e2e $httpBackend flushes mocked out requests
	 * automatically, closely simulating the behavior of the XMLHttpRequest object.
	 *
	 * To setup the application to run with this http backend, you have to create a module that depends
	 * on the `ngMockE2E` and your application modules and defines the fake backend:
	 *
	 * ```js
	 *   myAppDev = angular.module('myAppDev', ['myApp', 'ngMockE2E']);
	 *   myAppDev.run(function($httpBackend) {
	 *     phones = [{name: 'phone1'}, {name: 'phone2'}];
	 *
	 *     // returns the current list of phones
	 *     $httpBackend.whenGET('/phones').respond(phones);
	 *
	 *     // adds a new phone to the phones array
	 *     $httpBackend.whenPOST('/phones').respond(function(method, url, data) {
	 *       var phone = angular.fromJson(data);
	 *       phones.push(phone);
	 *       return [200, phone, {}];
	 *     });
	 *     $httpBackend.whenGET(/^\/templates\//).passThrough();
	 *     //...
	 *   });
	 * ```
	 *
	 * Afterwards, bootstrap your app with this new module.
	 */
	
	/**
	 * @ngdoc method
	 * @name $httpBackend#when
	 * @module ngMockE2E
	 * @description
	 * Creates a new backend definition.
	 *
	 * @param {string} method HTTP method.
	 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	 *   and returns true if the url matches the current definition.
	 * @param {(string|RegExp)=} data HTTP request body.
	 * @param {(Object|function(Object))=} headers HTTP headers or function that receives http header
	 *   object and returns true if the headers match the current definition.
	 * @param {(Array)=} keys Array of keys to assign to regex matches in request url described on
	 *   {@link ngMock.$httpBackend $httpBackend mock}.
	 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
	 *   control how a matched request is handled. You can save this object for later use and invoke
	 *   `respond` or `passThrough` again in order to change how a matched request is handled.
	 *
	 *  - respond –
	 *    ```
	 *    { function([status,] data[, headers, statusText])
	 *    | function(function(method, url, data, headers, params)}
	 *    ```
	 *    – The respond method takes a set of static data to be returned or a function that can return
	 *    an array containing response status (number), response data (Array|Object|string), response
	 *    headers (Object), and the text for the status (string).
	 *  - passThrough – `{function()}` – Any request matching a backend definition with
	 *    `passThrough` handler will be passed through to the real backend (an XHR request will be made
	 *    to the server.)
	 *  - Both methods return the `requestHandler` object for possible overrides.
	 */
	
	/**
	 * @ngdoc method
	 * @name $httpBackend#whenGET
	 * @module ngMockE2E
	 * @description
	 * Creates a new backend definition for GET requests. For more info see `when()`.
	 *
	 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	 *   and returns true if the url matches the current definition.
	 * @param {(Object|function(Object))=} headers HTTP headers.
	 * @param {(Array)=} keys Array of keys to assign to regex matches in request url described on
	 *   {@link ngMock.$httpBackend $httpBackend mock}.
	 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
	 *   control how a matched request is handled. You can save this object for later use and invoke
	 *   `respond` or `passThrough` again in order to change how a matched request is handled.
	 */
	
	/**
	 * @ngdoc method
	 * @name $httpBackend#whenHEAD
	 * @module ngMockE2E
	 * @description
	 * Creates a new backend definition for HEAD requests. For more info see `when()`.
	 *
	 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	 *   and returns true if the url matches the current definition.
	 * @param {(Object|function(Object))=} headers HTTP headers.
	 * @param {(Array)=} keys Array of keys to assign to regex matches in request url described on
	 *   {@link ngMock.$httpBackend $httpBackend mock}.
	 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
	 *   control how a matched request is handled. You can save this object for later use and invoke
	 *   `respond` or `passThrough` again in order to change how a matched request is handled.
	 */
	
	/**
	 * @ngdoc method
	 * @name $httpBackend#whenDELETE
	 * @module ngMockE2E
	 * @description
	 * Creates a new backend definition for DELETE requests. For more info see `when()`.
	 *
	 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	 *   and returns true if the url matches the current definition.
	 * @param {(Object|function(Object))=} headers HTTP headers.
	 * @param {(Array)=} keys Array of keys to assign to regex matches in request url described on
	 *   {@link ngMock.$httpBackend $httpBackend mock}.
	 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
	 *   control how a matched request is handled. You can save this object for later use and invoke
	 *   `respond` or `passThrough` again in order to change how a matched request is handled.
	 */
	
	/**
	 * @ngdoc method
	 * @name $httpBackend#whenPOST
	 * @module ngMockE2E
	 * @description
	 * Creates a new backend definition for POST requests. For more info see `when()`.
	 *
	 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	 *   and returns true if the url matches the current definition.
	 * @param {(string|RegExp)=} data HTTP request body.
	 * @param {(Object|function(Object))=} headers HTTP headers.
	 * @param {(Array)=} keys Array of keys to assign to regex matches in request url described on
	 *   {@link ngMock.$httpBackend $httpBackend mock}.
	 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
	 *   control how a matched request is handled. You can save this object for later use and invoke
	 *   `respond` or `passThrough` again in order to change how a matched request is handled.
	 */
	
	/**
	 * @ngdoc method
	 * @name $httpBackend#whenPUT
	 * @module ngMockE2E
	 * @description
	 * Creates a new backend definition for PUT requests.  For more info see `when()`.
	 *
	 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	 *   and returns true if the url matches the current definition.
	 * @param {(string|RegExp)=} data HTTP request body.
	 * @param {(Object|function(Object))=} headers HTTP headers.
	 * @param {(Array)=} keys Array of keys to assign to regex matches in request url described on
	 *   {@link ngMock.$httpBackend $httpBackend mock}.
	 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
	 *   control how a matched request is handled. You can save this object for later use and invoke
	 *   `respond` or `passThrough` again in order to change how a matched request is handled.
	 */
	
	/**
	 * @ngdoc method
	 * @name $httpBackend#whenPATCH
	 * @module ngMockE2E
	 * @description
	 * Creates a new backend definition for PATCH requests.  For more info see `when()`.
	 *
	 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	 *   and returns true if the url matches the current definition.
	 * @param {(string|RegExp)=} data HTTP request body.
	 * @param {(Object|function(Object))=} headers HTTP headers.
	 * @param {(Array)=} keys Array of keys to assign to regex matches in request url described on
	 *   {@link ngMock.$httpBackend $httpBackend mock}.
	 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
	 *   control how a matched request is handled. You can save this object for later use and invoke
	 *   `respond` or `passThrough` again in order to change how a matched request is handled.
	 */
	
	/**
	 * @ngdoc method
	 * @name $httpBackend#whenJSONP
	 * @module ngMockE2E
	 * @description
	 * Creates a new backend definition for JSONP requests. For more info see `when()`.
	 *
	 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
	 *   and returns true if the url matches the current definition.
	 * @param {(Array)=} keys Array of keys to assign to regex matches in request url described on
	 *   {@link ngMock.$httpBackend $httpBackend mock}.
	 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
	 *   control how a matched request is handled. You can save this object for later use and invoke
	 *   `respond` or `passThrough` again in order to change how a matched request is handled.
	 */
	/**
	 * @ngdoc method
	 * @name $httpBackend#whenRoute
	 * @module ngMockE2E
	 * @description
	 * Creates a new backend definition that compares only with the requested route.
	 *
	 * @param {string} method HTTP method.
	 * @param {string} url HTTP url string that supports colon param matching.
	 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
	 *   control how a matched request is handled. You can save this object for later use and invoke
	 *   `respond` or `passThrough` again in order to change how a matched request is handled.
	 */
	angular.mock.e2e = {};
	angular.mock.e2e.$httpBackendDecorator =
	  ['$rootScope', '$timeout', '$delegate', '$browser', createHttpBackendMock];
	
	
	/**
	 * @ngdoc type
	 * @name $rootScope.Scope
	 * @module ngMock
	 * @description
	 * {@link ng.$rootScope.Scope Scope} type decorated with helper methods useful for testing. These
	 * methods are automatically available on any {@link ng.$rootScope.Scope Scope} instance when
	 * `ngMock` module is loaded.
	 *
	 * In addition to all the regular `Scope` methods, the following helper methods are available:
	 */
	angular.mock.$RootScopeDecorator = ['$delegate', function($delegate) {
	
	  var $rootScopePrototype = Object.getPrototypeOf($delegate);
	
	  $rootScopePrototype.$countChildScopes = countChildScopes;
	  $rootScopePrototype.$countWatchers = countWatchers;
	
	  return $delegate;
	
	  // ------------------------------------------------------------------------------------------ //
	
	  /**
	   * @ngdoc method
	   * @name $rootScope.Scope#$countChildScopes
	   * @module ngMock
	   * @description
	   * Counts all the direct and indirect child scopes of the current scope.
	   *
	   * The current scope is excluded from the count. The count includes all isolate child scopes.
	   *
	   * @returns {number} Total number of child scopes.
	   */
	  function countChildScopes() {
	    // jshint validthis: true
	    var count = 0; // exclude the current scope
	    var pendingChildHeads = [this.$$childHead];
	    var currentScope;
	
	    while (pendingChildHeads.length) {
	      currentScope = pendingChildHeads.shift();
	
	      while (currentScope) {
	        count += 1;
	        pendingChildHeads.push(currentScope.$$childHead);
	        currentScope = currentScope.$$nextSibling;
	      }
	    }
	
	    return count;
	  }
	
	
	  /**
	   * @ngdoc method
	   * @name $rootScope.Scope#$countWatchers
	   * @module ngMock
	   * @description
	   * Counts all the watchers of direct and indirect child scopes of the current scope.
	   *
	   * The watchers of the current scope are included in the count and so are all the watchers of
	   * isolate child scopes.
	   *
	   * @returns {number} Total number of watchers.
	   */
	  function countWatchers() {
	    // jshint validthis: true
	    var count = this.$$watchers ? this.$$watchers.length : 0; // include the current scope
	    var pendingChildHeads = [this.$$childHead];
	    var currentScope;
	
	    while (pendingChildHeads.length) {
	      currentScope = pendingChildHeads.shift();
	
	      while (currentScope) {
	        count += currentScope.$$watchers ? currentScope.$$watchers.length : 0;
	        pendingChildHeads.push(currentScope.$$childHead);
	        currentScope = currentScope.$$nextSibling;
	      }
	    }
	
	    return count;
	  }
	}];
	
	
	!(function(jasmineOrMocha) {
	
	  if (!jasmineOrMocha) {
	    return;
	  }
	
	  var currentSpec = null,
	      injectorState = new InjectorState(),
	      annotatedFunctions = [],
	      wasInjectorCreated = function() {
	        return !!currentSpec;
	      };
	
	  angular.mock.$$annotate = angular.injector.$$annotate;
	  angular.injector.$$annotate = function(fn) {
	    if (typeof fn === 'function' && !fn.$inject) {
	      annotatedFunctions.push(fn);
	    }
	    return angular.mock.$$annotate.apply(this, arguments);
	  };
	
	  /**
	   * @ngdoc function
	   * @name angular.mock.module
	   * @description
	   *
	   * *NOTE*: This function is also published on window for easy access.<br>
	   * *NOTE*: This function is declared ONLY WHEN running tests with jasmine or mocha
	   *
	   * This function registers a module configuration code. It collects the configuration information
	   * which will be used when the injector is created by {@link angular.mock.inject inject}.
	   *
	   * See {@link angular.mock.inject inject} for usage example
	   *
	   * @param {...(string|Function|Object)} fns any number of modules which are represented as string
	   *        aliases or as anonymous module initialization functions. The modules are used to
	   *        configure the injector. The 'ng' and 'ngMock' modules are automatically loaded. If an
	   *        object literal is passed each key-value pair will be registered on the module via
	   *        {@link auto.$provide $provide}.value, the key being the string name (or token) to associate
	   *        with the value on the injector.
	   */
	  var module = window.module = angular.mock.module = function() {
	    var moduleFns = Array.prototype.slice.call(arguments, 0);
	    return wasInjectorCreated() ? workFn() : workFn;
	    /////////////////////
	    function workFn() {
	      if (currentSpec.$injector) {
	        throw new Error('Injector already created, can not register a module!');
	      } else {
	        var fn, modules = currentSpec.$modules || (currentSpec.$modules = []);
	        angular.forEach(moduleFns, function(module) {
	          if (angular.isObject(module) && !angular.isArray(module)) {
	            fn = ['$provide', function($provide) {
	              angular.forEach(module, function(value, key) {
	                $provide.value(key, value);
	              });
	            }];
	          } else {
	            fn = module;
	          }
	          if (currentSpec.$providerInjector) {
	            currentSpec.$providerInjector.invoke(fn);
	          } else {
	            modules.push(fn);
	          }
	        });
	      }
	    }
	  };
	
	  module.$$beforeAllHook = (window.before || window.beforeAll);
	  module.$$afterAllHook = (window.after || window.afterAll);
	
	  // purely for testing ngMock itself
	  module.$$currentSpec = function(to) {
	    if (arguments.length === 0) return to;
	    currentSpec = to;
	  };
	
	  /**
	   * @ngdoc function
	   * @name angular.mock.module.sharedInjector
	   * @description
	   *
	   * *NOTE*: This function is declared ONLY WHEN running tests with jasmine or mocha
	   *
	   * This function ensures a single injector will be used for all tests in a given describe context.
	   * This contrasts with the default behaviour where a new injector is created per test case.
	   *
	   * Use sharedInjector when you want to take advantage of Jasmine's `beforeAll()`, or mocha's
	   * `before()` methods. Call `module.sharedInjector()` before you setup any other hooks that
	   * will create (i.e call `module()`) or use (i.e call `inject()`) the injector.
	   *
	   * You cannot call `sharedInjector()` from within a context already using `sharedInjector()`.
	   *
	   * ## Example
	   *
	   * Typically beforeAll is used to make many assertions about a single operation. This can
	   * cut down test run-time as the test setup doesn't need to be re-run, and enabling focussed
	   * tests each with a single assertion.
	   *
	   * ```js
	   * describe("Deep Thought", function() {
	   *
	   *   module.sharedInjector();
	   *
	   *   beforeAll(module("UltimateQuestion"));
	   *
	   *   beforeAll(inject(function(DeepThought) {
	   *     expect(DeepThought.answer).toBeUndefined();
	   *     DeepThought.generateAnswer();
	   *   }));
	   *
	   *   it("has calculated the answer correctly", inject(function(DeepThought) {
	   *     // Because of sharedInjector, we have access to the instance of the DeepThought service
	   *     // that was provided to the beforeAll() hook. Therefore we can test the generated answer
	   *     expect(DeepThought.answer).toBe(42);
	   *   }));
	   *
	   *   it("has calculated the answer within the expected time", inject(function(DeepThought) {
	   *     expect(DeepThought.runTimeMillennia).toBeLessThan(8000);
	   *   }));
	   *
	   *   it("has double checked the answer", inject(function(DeepThought) {
	   *     expect(DeepThought.absolutelySureItIsTheRightAnswer).toBe(true);
	   *   }));
	   *
	   * });
	   *
	   * ```
	   */
	  module.sharedInjector = function() {
	    if (!(module.$$beforeAllHook && module.$$afterAllHook)) {
	      throw Error("sharedInjector() cannot be used unless your test runner defines beforeAll/afterAll");
	    }
	
	    var initialized = false;
	
	    module.$$beforeAllHook(function() {
	      if (injectorState.shared) {
	        injectorState.sharedError = Error("sharedInjector() cannot be called inside a context that has already called sharedInjector()");
	        throw injectorState.sharedError;
	      }
	      initialized = true;
	      currentSpec = this;
	      injectorState.shared = true;
	    });
	
	    module.$$afterAllHook(function() {
	      if (initialized) {
	        injectorState = new InjectorState();
	        module.$$cleanup();
	      } else {
	        injectorState.sharedError = null;
	      }
	    });
	  };
	
	  module.$$beforeEach = function() {
	    if (injectorState.shared && currentSpec && currentSpec != this) {
	      var state = currentSpec;
	      currentSpec = this;
	      angular.forEach(["$injector","$modules","$providerInjector", "$injectorStrict"], function(k) {
	        currentSpec[k] = state[k];
	        state[k] = null;
	      });
	    } else {
	      currentSpec = this;
	      originalRootElement = null;
	      annotatedFunctions = [];
	    }
	  };
	
	  module.$$afterEach = function() {
	    if (injectorState.cleanupAfterEach()) {
	      module.$$cleanup();
	    }
	  };
	
	  module.$$cleanup = function() {
	    var injector = currentSpec.$injector;
	
	    annotatedFunctions.forEach(function(fn) {
	      delete fn.$inject;
	    });
	
	    angular.forEach(currentSpec.$modules, function(module) {
	      if (module && module.$$hashKey) {
	        module.$$hashKey = undefined;
	      }
	    });
	
	    currentSpec.$injector = null;
	    currentSpec.$modules = null;
	    currentSpec.$providerInjector = null;
	    currentSpec = null;
	
	    if (injector) {
	      // Ensure `$rootElement` is instantiated, before checking `originalRootElement`
	      var $rootElement = injector.get('$rootElement');
	      var rootNode = $rootElement && $rootElement[0];
	      var cleanUpNodes = !originalRootElement ? [] : [originalRootElement[0]];
	      if (rootNode && (!originalRootElement || rootNode !== originalRootElement[0])) {
	        cleanUpNodes.push(rootNode);
	      }
	      angular.element.cleanData(cleanUpNodes);
	
	      // Ensure `$destroy()` is available, before calling it
	      // (a mocked `$rootScope` might not implement it (or not even be an object at all))
	      var $rootScope = injector.get('$rootScope');
	      if ($rootScope && $rootScope.$destroy) $rootScope.$destroy();
	    }
	
	    // clean up jquery's fragment cache
	    angular.forEach(angular.element.fragments, function(val, key) {
	      delete angular.element.fragments[key];
	    });
	
	    MockXhr.$$lastInstance = null;
	
	    angular.forEach(angular.callbacks, function(val, key) {
	      delete angular.callbacks[key];
	    });
	    angular.callbacks.counter = 0;
	  };
	
	  (window.beforeEach || window.setup)(module.$$beforeEach);
	  (window.afterEach || window.teardown)(module.$$afterEach);
	
	  /**
	   * @ngdoc function
	   * @name angular.mock.inject
	   * @description
	   *
	   * *NOTE*: This function is also published on window for easy access.<br>
	   * *NOTE*: This function is declared ONLY WHEN running tests with jasmine or mocha
	   *
	   * The inject function wraps a function into an injectable function. The inject() creates new
	   * instance of {@link auto.$injector $injector} per test, which is then used for
	   * resolving references.
	   *
	   *
	   * ## Resolving References (Underscore Wrapping)
	   * Often, we would like to inject a reference once, in a `beforeEach()` block and reuse this
	   * in multiple `it()` clauses. To be able to do this we must assign the reference to a variable
	   * that is declared in the scope of the `describe()` block. Since we would, most likely, want
	   * the variable to have the same name of the reference we have a problem, since the parameter
	   * to the `inject()` function would hide the outer variable.
	   *
	   * To help with this, the injected parameters can, optionally, be enclosed with underscores.
	   * These are ignored by the injector when the reference name is resolved.
	   *
	   * For example, the parameter `_myService_` would be resolved as the reference `myService`.
	   * Since it is available in the function body as _myService_, we can then assign it to a variable
	   * defined in an outer scope.
	   *
	   * ```
	   * // Defined out reference variable outside
	   * var myService;
	   *
	   * // Wrap the parameter in underscores
	   * beforeEach( inject( function(_myService_){
	   *   myService = _myService_;
	   * }));
	   *
	   * // Use myService in a series of tests.
	   * it('makes use of myService', function() {
	   *   myService.doStuff();
	   * });
	   *
	   * ```
	   *
	   * See also {@link angular.mock.module angular.mock.module}
	   *
	   * ## Example
	   * Example of what a typical jasmine tests looks like with the inject method.
	   * ```js
	   *
	   *   angular.module('myApplicationModule', [])
	   *       .value('mode', 'app')
	   *       .value('version', 'v1.0.1');
	   *
	   *
	   *   describe('MyApp', function() {
	   *
	   *     // You need to load modules that you want to test,
	   *     // it loads only the "ng" module by default.
	   *     beforeEach(module('myApplicationModule'));
	   *
	   *
	   *     // inject() is used to inject arguments of all given functions
	   *     it('should provide a version', inject(function(mode, version) {
	   *       expect(version).toEqual('v1.0.1');
	   *       expect(mode).toEqual('app');
	   *     }));
	   *
	   *
	   *     // The inject and module method can also be used inside of the it or beforeEach
	   *     it('should override a version and test the new version is injected', function() {
	   *       // module() takes functions or strings (module aliases)
	   *       module(function($provide) {
	   *         $provide.value('version', 'overridden'); // override version here
	   *       });
	   *
	   *       inject(function(version) {
	   *         expect(version).toEqual('overridden');
	   *       });
	   *     });
	   *   });
	   *
	   * ```
	   *
	   * @param {...Function} fns any number of functions which will be injected using the injector.
	   */
	
	
	
	  var ErrorAddingDeclarationLocationStack = function(e, errorForStack) {
	    this.message = e.message;
	    this.name = e.name;
	    if (e.line) this.line = e.line;
	    if (e.sourceId) this.sourceId = e.sourceId;
	    if (e.stack && errorForStack)
	      this.stack = e.stack + '\n' + errorForStack.stack;
	    if (e.stackArray) this.stackArray = e.stackArray;
	  };
	  ErrorAddingDeclarationLocationStack.prototype.toString = Error.prototype.toString;
	
	  window.inject = angular.mock.inject = function() {
	    var blockFns = Array.prototype.slice.call(arguments, 0);
	    var errorForStack = new Error('Declaration Location');
	    // IE10+ and PhanthomJS do not set stack trace information, until the error is thrown
	    if (!errorForStack.stack) {
	      try {
	        throw errorForStack;
	      } catch (e) {}
	    }
	    return wasInjectorCreated() ? workFn.call(currentSpec) : workFn;
	    /////////////////////
	    function workFn() {
	      var modules = currentSpec.$modules || [];
	      var strictDi = !!currentSpec.$injectorStrict;
	      modules.unshift(['$injector', function($injector) {
	        currentSpec.$providerInjector = $injector;
	      }]);
	      modules.unshift('ngMock');
	      modules.unshift('ng');
	      var injector = currentSpec.$injector;
	      if (!injector) {
	        if (strictDi) {
	          // If strictDi is enabled, annotate the providerInjector blocks
	          angular.forEach(modules, function(moduleFn) {
	            if (typeof moduleFn === "function") {
	              angular.injector.$$annotate(moduleFn);
	            }
	          });
	        }
	        injector = currentSpec.$injector = angular.injector(modules, strictDi);
	        currentSpec.$injectorStrict = strictDi;
	      }
	      for (var i = 0, ii = blockFns.length; i < ii; i++) {
	        if (currentSpec.$injectorStrict) {
	          // If the injector is strict / strictDi, and the spec wants to inject using automatic
	          // annotation, then annotate the function here.
	          injector.annotate(blockFns[i]);
	        }
	        try {
	          /* jshint -W040 *//* Jasmine explicitly provides a `this` object when calling functions */
	          injector.invoke(blockFns[i] || angular.noop, this);
	          /* jshint +W040 */
	        } catch (e) {
	          if (e.stack && errorForStack) {
	            throw new ErrorAddingDeclarationLocationStack(e, errorForStack);
	          }
	          throw e;
	        } finally {
	          errorForStack = null;
	        }
	      }
	    }
	  };
	
	
	  angular.mock.inject.strictDi = function(value) {
	    value = arguments.length ? !!value : true;
	    return wasInjectorCreated() ? workFn() : workFn;
	
	    function workFn() {
	      if (value !== currentSpec.$injectorStrict) {
	        if (currentSpec.$injector) {
	          throw new Error('Injector already created, can not modify strict annotations');
	        } else {
	          currentSpec.$injectorStrict = value;
	        }
	      }
	    }
	  };
	
	  function InjectorState() {
	    this.shared = false;
	    this.sharedError = null;
	
	    this.cleanupAfterEach = function() {
	      return !this.shared || this.sharedError;
	    };
	  }
	})(window.jasmine || window.mocha);
	
	
	})(window, window.angular);


/***/ },

/***/ 38:
/***/ function(module, exports) {

	
	
	describe('The chord service', function () {
	    var app, chordService;
	
	    beforeEach(function () {
	        var app = angular.mock.module('app');
	    });
	
	    beforeEach(angular.mock.inject(function ($injector) {
	        chordService = $injector.get('chordService');
	    }));
	
	    it('should exist', function () {
	        expect(chordService).not.toBeNull();
	    });
	});

/***/ },

/***/ 39:
/***/ function(module, exports) {

	
	
	describe('The interval service', function () {
	    var app, intervalService;
	
	    beforeEach(function () {
	        var app = angular.mock.module('app');
	    });
	
	    beforeEach(angular.mock.inject(function ($injector) {
	        intervalService = $injector.get('intervalService');
	    }));
	
	    it('should exist', function () {
	        expect(intervalService).not.toBeNull();
	    });
	
	    it('should provide interval objects', function () {
	        // check for interval constant object
	        expect(intervalService.intervals).toBeDefined();
	
	        // check interval constants
	        for (var key in intervalService.intervals) {
	            var interval = intervalService.intervals[key];
	            expect(interval.id).toBeDefined();
	            expect(interval.label).toBeDefined();
	            expect(interval.offset).toBeDefined();
	        }
	    });
	
	    it('should provide a note given an interval', function () {
	        var intervals = intervalService.intervals;
	
	        var tests = [{ root: 'E', interval: intervals.FIRST, expected: 'E' }, { root: 'E', interval: intervals.MINOR_SECOND, expected: 'F' }, { root: 'E', interval: intervals.MAJOR_SECOND, expected: 'F#' }, { root: 'E', interval: intervals.MINOR_THIRD, expected: 'G' }, { root: 'E', interval: intervals.MAJOR_THIRD, expected: 'G#' }, { root: 'E', interval: intervals.PERFECT_FOURTH, expected: 'A' }, { root: 'E', interval: intervals.DIM_FIFTH, expected: 'A#' }, { root: 'E', interval: intervals.PERFECT_FIFTH, expected: 'B' }, { root: 'E', interval: intervals.MINOR_SIXTH, expected: 'C' }, { root: 'E', interval: intervals.MAJOR_SIXTH, expected: 'C#' }, { root: 'E', interval: intervals.MINOR_SEVENTH, expected: 'D' }, { root: 'E', interval: intervals.MAJOR_SEVENTH, expected: 'D#' }, { root: 'E', interval: intervals.OCTAVE, expected: 'E' }];
	
	        tests.forEach(function (test) {
	            var note = intervalService.noteAtInterval(test.root, test.interval);
	            expect(note).toEqual(test.expected);
	        });
	    });
	
	    it('should provide an array of notes given an array of intervals', function () {
	        var intervals = intervalService.intervals;
	
	        var tests = [{
	            root: 'C',
	            intervals: [intervals.FIRST, intervals.PERFECT_FOURTH, intervals.PERFECT_FIFTH],
	            expected: ['C', 'F', 'G']
	        }, {
	            root: 'A',
	            intervals: [intervals.FIRST, intervals.PERFECT_FOURTH, intervals.PERFECT_FIFTH],
	            expected: ['A', 'D', 'E']
	        }, {
	            root: 'G',
	            intervals: [intervals.FIRST, intervals.PERFECT_FOURTH, intervals.PERFECT_FIFTH],
	            expected: ['G', 'C', 'D']
	        }, {
	            root: 'E',
	            intervals: [intervals.FIRST, intervals.PERFECT_FOURTH, intervals.PERFECT_FIFTH],
	            expected: ['E', 'A', 'B']
	        }, {
	            root: 'D',
	            intervals: [intervals.FIRST, intervals.PERFECT_FOURTH, intervals.PERFECT_FIFTH],
	            expected: ['D', 'G', 'A']
	        }];
	
	        tests.forEach(function (test) {
	            var notes = intervalService.notesAtIntervals(test.root, test.intervals);
	            expect(notes).toEqual(test.expected);
	        });
	    });
	});

/***/ },

/***/ 40:
/***/ function(module, exports) {

	
	
	describe('The note service', function () {
	    var app, noteService;
	
	    beforeEach(function () {
	        var app = angular.mock.module('app');
	    });
	
	    beforeEach(angular.mock.inject(function ($injector) {
	        noteService = $injector.get('noteService');
	    }));
	
	    it('should exist', function () {
	        expect(noteService).not.toBeNull();
	    });
	});

/***/ },

/***/ 41:
/***/ function(module, exports) {

	
	describe('The scale service', function () {
	    var app, scaleService;
	
	    beforeEach(function () {
	        var app = angular.mock.module('app');
	    });
	
	    beforeEach(angular.mock.inject(function ($injector) {
	        scaleService = $injector.get('scaleService');
	    }));
	
	    it('should exist', function () {
	        expect(scaleService).toBeDefined();
	    });
	
	    it('should provide scale options', function () {
	        // check for scale option constants
	        expect(scaleService.scaleOptions).toBeDefined();
	
	        // check scale constants
	        scaleService.scaleOptions.forEach(function (scaleOption) {
	            expect(scaleOption.id).toBeDefined();
	            expect(scaleOption.label).toBeDefined();
	            expect(scaleOption.intervals).toBeDefined();
	        });
	    });
	
	    it('should provide scale notes when given a root and a scale option', function () {
	
	        var scales = scaleService.scales;
	
	        var tests = [{ root: 'C', scale: scales.MAJOR, expected: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] }];
	
	        tests.forEach(function (test) {
	            var notes = scaleService.scaleNotes(test.root, test.scale);
	            expect(notes).toEqual(test.expected);
	        });
	    });
	});

/***/ },

/***/ 42:
/***/ function(module, exports) {

	
	describe('The tuning service', function () {
	    var app, tuningService;
	
	    beforeEach(function () {
	        var app = angular.mock.module('app');
	    });
	
	    beforeEach(angular.mock.inject(function ($injector) {
	        tuningService = $injector.get('tuningService');
	    }));
	
	    it('should exist', function () {
	        expect(tuningService).not.toBeNull();
	    });
	});

/***/ }

/******/ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjNjM2VlMDM1MGQ5YmJjNmJkNWE/MTcxMCIsIndlYnBhY2s6Ly8vLi9hcHAtdGVzdC91bml0L2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYW5ndWxhci1tb2Nrcy9hbmd1bGFyLW1vY2tzLmpzIiwid2VicGFjazovLy8uL2FwcC10ZXN0L3VuaXQvY2hvcmQtc2VydmljZS11bml0LmpzIiwid2VicGFjazovLy8uL2FwcC10ZXN0L3VuaXQvaW50ZXJ2YWwtc2VydmljZS11bml0LmpzIiwid2VicGFjazovLy8uL2FwcC10ZXN0L3VuaXQvbm90ZS1zZXJ2aWNlLXVuaXQuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwLXRlc3QvdW5pdC9zY2FsZS1zZXJ2aWNlLXVuaXQuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwLXRlc3QvdW5pdC90dW5pbmctc2VydmljZS11bml0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3JDQSxxQkFBUSxFQUFSOztBQUVBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSO0FBQ0EscUJBQVEsRUFBUjtBQUNBLHFCQUFRLEVBQVI7QUFDQSxxQkFBUSxFQUFSLEU7Ozs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkMsa0JBQWtCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBLDZEQUE0RCwyQkFBMkI7QUFDdkY7QUFD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QUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQStCLDZCQUE2QjtBQUM1RDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0JBQXVCLGtCQUFrQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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YSxTQUFTO0FBQ3RCLGdCQUFlLGVBQWU7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxPQUFPO0FBQ3BCLGNBQWEsT0FBTztBQUNwQixnQkFBZSxlQUFlO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFxQyxTQUFTO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFhO0FBQ2IsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsU0FBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFNBQVE7QUFDUjtBQUNBLE9BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LEVBQXFCO0FBQ2hELHlCQUFnQixVQUFVLEdBQVYsQ0FBYyxlQUFkLENBQWhCO0FBQ0gsTUFGVSxDQUFYOztBQUlBLFFBQUcsY0FBSCxFQUFtQixZQUFXO0FBQzFCLGdCQUFPLGFBQVAsRUFBc0IsR0FBdEIsQ0FBMEIsUUFBMUI7QUFDSCxNQUZEO0FBSUgsRUFoQkQsRSIsImZpbGUiOiJhcHB1bml0LWJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgYjNjM2VlMDM1MGQ5YmJjNmJkNWFcbiAqKi8iLCJcbnJlcXVpcmUoJ2FuZ3VsYXItbW9ja3MvYW5ndWxhci1tb2Nrcy5qcycpO1xuXG5yZXF1aXJlKCcuL2Nob3JkLXNlcnZpY2UtdW5pdCcpO1xucmVxdWlyZSgnLi9pbnRlcnZhbC1zZXJ2aWNlLXVuaXQnKTtcbnJlcXVpcmUoJy4vbm90ZS1zZXJ2aWNlLXVuaXQnKTtcbnJlcXVpcmUoJy4vc2NhbGUtc2VydmljZS11bml0Jyk7XG5yZXF1aXJlKCcuL3R1bmluZy1zZXJ2aWNlLXVuaXQnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2FwcC10ZXN0L3VuaXQvaW5kZXguanNcbiAqKi8iLCIvKipcbiAqIEBsaWNlbnNlIEFuZ3VsYXJKUyB2MS41LjVcbiAqIChjKSAyMDEwLTIwMTYgR29vZ2xlLCBJbmMuIGh0dHA6Ly9hbmd1bGFyanMub3JnXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgYW5ndWxhcikge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5nZG9jIG9iamVjdFxuICogQG5hbWUgYW5ndWxhci5tb2NrXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBOYW1lc3BhY2UgZnJvbSAnYW5ndWxhci1tb2Nrcy5qcycgd2hpY2ggY29udGFpbnMgdGVzdGluZyByZWxhdGVkIGNvZGUuXG4gKi9cbmFuZ3VsYXIubW9jayA9IHt9O1xuXG4vKipcbiAqICEgVGhpcyBpcyBhIHByaXZhdGUgdW5kb2N1bWVudGVkIHNlcnZpY2UgIVxuICpcbiAqIEBuYW1lICRicm93c2VyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGlzIHNlcnZpY2UgaXMgYSBtb2NrIGltcGxlbWVudGF0aW9uIG9mIHtAbGluayBuZy4kYnJvd3Nlcn0uIEl0IHByb3ZpZGVzIGZha2VcbiAqIGltcGxlbWVudGF0aW9uIGZvciBjb21tb25seSB1c2VkIGJyb3dzZXIgYXBpcyB0aGF0IGFyZSBoYXJkIHRvIHRlc3QsIGUuZy4gc2V0VGltZW91dCwgeGhyLFxuICogY29va2llcywgZXRjLi4uXG4gKlxuICogVGhlIGFwaSBvZiB0aGlzIHNlcnZpY2UgaXMgdGhlIHNhbWUgYXMgdGhhdCBvZiB0aGUgcmVhbCB7QGxpbmsgbmcuJGJyb3dzZXIgJGJyb3dzZXJ9LCBleGNlcHRcbiAqIHRoYXQgdGhlcmUgYXJlIHNldmVyYWwgaGVscGVyIG1ldGhvZHMgYXZhaWxhYmxlIHdoaWNoIGNhbiBiZSB1c2VkIGluIHRlc3RzLlxuICovXG5hbmd1bGFyLm1vY2suJEJyb3dzZXJQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLiRnZXQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IGFuZ3VsYXIubW9jay4kQnJvd3NlcigpO1xuICB9O1xufTtcblxuYW5ndWxhci5tb2NrLiRCcm93c2VyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB0aGlzLmlzTW9jayA9IHRydWU7XG4gIHNlbGYuJCR1cmwgPSBcImh0dHA6Ly9zZXJ2ZXIvXCI7XG4gIHNlbGYuJCRsYXN0VXJsID0gc2VsZi4kJHVybDsgLy8gdXNlZCBieSB1cmwgcG9sbGluZyBmblxuICBzZWxmLnBvbGxGbnMgPSBbXTtcblxuICAvLyBUT0RPKHZvanRhKTogcmVtb3ZlIHRoaXMgdGVtcG9yYXJ5IGFwaVxuICBzZWxmLiQkY29tcGxldGVPdXRzdGFuZGluZ1JlcXVlc3QgPSBhbmd1bGFyLm5vb3A7XG4gIHNlbGYuJCRpbmNPdXRzdGFuZGluZ1JlcXVlc3RDb3VudCA9IGFuZ3VsYXIubm9vcDtcblxuXG4gIC8vIHJlZ2lzdGVyIHVybCBwb2xsaW5nIGZuXG5cbiAgc2VsZi5vblVybENoYW5nZSA9IGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgc2VsZi5wb2xsRm5zLnB1c2goXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHNlbGYuJCRsYXN0VXJsICE9PSBzZWxmLiQkdXJsIHx8IHNlbGYuJCRzdGF0ZSAhPT0gc2VsZi4kJGxhc3RTdGF0ZSkge1xuICAgICAgICAgIHNlbGYuJCRsYXN0VXJsID0gc2VsZi4kJHVybDtcbiAgICAgICAgICBzZWxmLiQkbGFzdFN0YXRlID0gc2VsZi4kJHN0YXRlO1xuICAgICAgICAgIGxpc3RlbmVyKHNlbGYuJCR1cmwsIHNlbGYuJCRzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuXG4gICAgcmV0dXJuIGxpc3RlbmVyO1xuICB9O1xuXG4gIHNlbGYuJCRhcHBsaWNhdGlvbkRlc3Ryb3llZCA9IGFuZ3VsYXIubm9vcDtcbiAgc2VsZi4kJGNoZWNrVXJsQ2hhbmdlID0gYW5ndWxhci5ub29wO1xuXG4gIHNlbGYuZGVmZXJyZWRGbnMgPSBbXTtcbiAgc2VsZi5kZWZlcnJlZE5leHRJZCA9IDA7XG5cbiAgc2VsZi5kZWZlciA9IGZ1bmN0aW9uKGZuLCBkZWxheSkge1xuICAgIGRlbGF5ID0gZGVsYXkgfHwgMDtcbiAgICBzZWxmLmRlZmVycmVkRm5zLnB1c2goe3RpbWU6KHNlbGYuZGVmZXIubm93ICsgZGVsYXkpLCBmbjpmbiwgaWQ6IHNlbGYuZGVmZXJyZWROZXh0SWR9KTtcbiAgICBzZWxmLmRlZmVycmVkRm5zLnNvcnQoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS50aW1lIC0gYi50aW1lO30pO1xuICAgIHJldHVybiBzZWxmLmRlZmVycmVkTmV4dElkKys7XG4gIH07XG5cblxuICAvKipcbiAgICogQG5hbWUgJGJyb3dzZXIjZGVmZXIubm93XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDdXJyZW50IG1pbGxpc2Vjb25kcyBtb2NrIHRpbWUuXG4gICAqL1xuICBzZWxmLmRlZmVyLm5vdyA9IDA7XG5cblxuICBzZWxmLmRlZmVyLmNhbmNlbCA9IGZ1bmN0aW9uKGRlZmVySWQpIHtcbiAgICB2YXIgZm5JbmRleDtcblxuICAgIGFuZ3VsYXIuZm9yRWFjaChzZWxmLmRlZmVycmVkRm5zLCBmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgIGlmIChmbi5pZCA9PT0gZGVmZXJJZCkgZm5JbmRleCA9IGluZGV4O1xuICAgIH0pO1xuXG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGZuSW5kZXgpKSB7XG4gICAgICBzZWxmLmRlZmVycmVkRm5zLnNwbGljZShmbkluZGV4LCAxKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBAbmFtZSAkYnJvd3NlciNkZWZlci5mbHVzaFxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRmx1c2hlcyBhbGwgcGVuZGluZyByZXF1ZXN0cyBhbmQgZXhlY3V0ZXMgdGhlIGRlZmVyIGNhbGxiYWNrcy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGZsdXNoLiBTZWUge0BsaW5rICNkZWZlci5ub3d9XG4gICAqL1xuICBzZWxmLmRlZmVyLmZsdXNoID0gZnVuY3Rpb24oZGVsYXkpIHtcbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoZGVsYXkpKSB7XG4gICAgICBzZWxmLmRlZmVyLm5vdyArPSBkZWxheTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHNlbGYuZGVmZXJyZWRGbnMubGVuZ3RoKSB7XG4gICAgICAgIHNlbGYuZGVmZXIubm93ID0gc2VsZi5kZWZlcnJlZEZuc1tzZWxmLmRlZmVycmVkRm5zLmxlbmd0aCAtIDFdLnRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGRlZmVycmVkIHRhc2tzIHRvIGJlIGZsdXNoZWQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aGlsZSAoc2VsZi5kZWZlcnJlZEZucy5sZW5ndGggJiYgc2VsZi5kZWZlcnJlZEZuc1swXS50aW1lIDw9IHNlbGYuZGVmZXIubm93KSB7XG4gICAgICBzZWxmLmRlZmVycmVkRm5zLnNoaWZ0KCkuZm4oKTtcbiAgICB9XG4gIH07XG5cbiAgc2VsZi4kJGJhc2VIcmVmID0gJy8nO1xuICBzZWxmLmJhc2VIcmVmID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJCRiYXNlSHJlZjtcbiAgfTtcbn07XG5hbmd1bGFyLm1vY2suJEJyb3dzZXIucHJvdG90eXBlID0ge1xuXG4gIC8qKlxuICAgKiBAbmFtZSAkYnJvd3NlciNwb2xsXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBydW4gYWxsIGZucyBpbiBwb2xsRm5zXG4gICAqL1xuICBwb2xsOiBmdW5jdGlvbiBwb2xsKCkge1xuICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGlzLnBvbGxGbnMsIGZ1bmN0aW9uKHBvbGxGbikge1xuICAgICAgcG9sbEZuKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgdXJsOiBmdW5jdGlvbih1cmwsIHJlcGxhY2UsIHN0YXRlKSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoc3RhdGUpKSB7XG4gICAgICBzdGF0ZSA9IG51bGw7XG4gICAgfVxuICAgIGlmICh1cmwpIHtcbiAgICAgIHRoaXMuJCR1cmwgPSB1cmw7XG4gICAgICAvLyBOYXRpdmUgcHVzaFN0YXRlIHNlcmlhbGl6ZXMgJiBjb3BpZXMgdGhlIG9iamVjdDsgc2ltdWxhdGUgaXQuXG4gICAgICB0aGlzLiQkc3RhdGUgPSBhbmd1bGFyLmNvcHkoc3RhdGUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJCR1cmw7XG4gIH0sXG5cbiAgc3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiQkc3RhdGU7XG4gIH0sXG5cbiAgbm90aWZ5V2hlbk5vT3V0c3RhbmRpbmdSZXF1ZXN0czogZnVuY3Rpb24oZm4pIHtcbiAgICBmbigpO1xuICB9XG59O1xuXG5cbi8qKlxuICogQG5nZG9jIHByb3ZpZGVyXG4gKiBAbmFtZSAkZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDb25maWd1cmVzIHRoZSBtb2NrIGltcGxlbWVudGF0aW9uIG9mIHtAbGluayBuZy4kZXhjZXB0aW9uSGFuZGxlcn0gdG8gcmV0aHJvdyBvciB0byBsb2cgZXJyb3JzXG4gKiBwYXNzZWQgdG8gdGhlIGAkZXhjZXB0aW9uSGFuZGxlcmAuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJGV4Y2VwdGlvbkhhbmRsZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE1vY2sgaW1wbGVtZW50YXRpb24gb2Yge0BsaW5rIG5nLiRleGNlcHRpb25IYW5kbGVyfSB0aGF0IHJldGhyb3dzIG9yIGxvZ3MgZXJyb3JzIHBhc3NlZFxuICogdG8gaXQuIFNlZSB7QGxpbmsgbmdNb2NrLiRleGNlcHRpb25IYW5kbGVyUHJvdmlkZXIgJGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlcn0gZm9yIGNvbmZpZ3VyYXRpb25cbiAqIGluZm9ybWF0aW9uLlxuICpcbiAqXG4gKiBgYGBqc1xuICogICBkZXNjcmliZSgnJGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlcicsIGZ1bmN0aW9uKCkge1xuICpcbiAqICAgICBpdCgnc2hvdWxkIGNhcHR1cmUgbG9nIG1lc3NhZ2VzIGFuZCBleGNlcHRpb25zJywgZnVuY3Rpb24oKSB7XG4gKlxuICogICAgICAgbW9kdWxlKGZ1bmN0aW9uKCRleGNlcHRpb25IYW5kbGVyUHJvdmlkZXIpIHtcbiAqICAgICAgICAgJGV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlci5tb2RlKCdsb2cnKTtcbiAqICAgICAgIH0pO1xuICpcbiAqICAgICAgIGluamVjdChmdW5jdGlvbigkbG9nLCAkZXhjZXB0aW9uSGFuZGxlciwgJHRpbWVvdXQpIHtcbiAqICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7ICRsb2cubG9nKDEpOyB9KTtcbiAqICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7ICRsb2cubG9nKDIpOyB0aHJvdyAnYmFuYW5hIHBlZWwnOyB9KTtcbiAqICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7ICRsb2cubG9nKDMpOyB9KTtcbiAqICAgICAgICAgZXhwZWN0KCRleGNlcHRpb25IYW5kbGVyLmVycm9ycykudG9FcXVhbChbXSk7XG4gKiAgICAgICAgIGV4cGVjdCgkbG9nLmFzc2VydEVtcHR5KCkpO1xuICogICAgICAgICAkdGltZW91dC5mbHVzaCgpO1xuICogICAgICAgICBleHBlY3QoJGV4Y2VwdGlvbkhhbmRsZXIuZXJyb3JzKS50b0VxdWFsKFsnYmFuYW5hIHBlZWwnXSk7XG4gKiAgICAgICAgIGV4cGVjdCgkbG9nLmxvZy5sb2dzKS50b0VxdWFsKFtbMV0sIFsyXSwgWzNdXSk7XG4gKiAgICAgICB9KTtcbiAqICAgICB9KTtcbiAqICAgfSk7XG4gKiBgYGBcbiAqL1xuXG5hbmd1bGFyLm1vY2suJEV4Y2VwdGlvbkhhbmRsZXJQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaGFuZGxlcjtcblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkZXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyI21vZGVcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgdGhlIGxvZ2dpbmcgbW9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGUgTW9kZSBvZiBvcGVyYXRpb24sIGRlZmF1bHRzIHRvIGByZXRocm93YC5cbiAgICpcbiAgICogICAtIGBsb2dgOiBTb21ldGltZXMgaXQgaXMgZGVzaXJhYmxlIHRvIHRlc3QgdGhhdCBhbiBlcnJvciBpcyB0aHJvd24sIGZvciB0aGlzIGNhc2UgdGhlIGBsb2dgXG4gICAqICAgICAgICAgICAgbW9kZSBzdG9yZXMgYW4gYXJyYXkgb2YgZXJyb3JzIGluIGAkZXhjZXB0aW9uSGFuZGxlci5lcnJvcnNgLCB0byBhbGxvdyBsYXRlclxuICAgKiAgICAgICAgICAgIGFzc2VydGlvbiBvZiB0aGVtLiBTZWUge0BsaW5rIG5nTW9jay4kbG9nI2Fzc2VydEVtcHR5IGFzc2VydEVtcHR5KCl9IGFuZFxuICAgKiAgICAgICAgICAgIHtAbGluayBuZ01vY2suJGxvZyNyZXNldCByZXNldCgpfVxuICAgKiAgIC0gYHJldGhyb3dgOiBJZiBhbnkgZXJyb3JzIGFyZSBwYXNzZWQgdG8gdGhlIGhhbmRsZXIgaW4gdGVzdHMsIGl0IHR5cGljYWxseSBtZWFucyB0aGF0IHRoZXJlXG4gICAqICAgICAgICAgICAgICAgIGlzIGEgYnVnIGluIHRoZSBhcHBsaWNhdGlvbiBvciB0ZXN0LCBzbyB0aGlzIG1vY2sgd2lsbCBtYWtlIHRoZXNlIHRlc3RzIGZhaWwuXG4gICAqICAgICAgICAgICAgICAgIEZvciBhbnkgaW1wbGVtZW50YXRpb25zIHRoYXQgZXhwZWN0IGV4Y2VwdGlvbnMgdG8gYmUgdGhyb3duLCB0aGUgYHJldGhyb3dgIG1vZGVcbiAgICogICAgICAgICAgICAgICAgd2lsbCBhbHNvIG1haW50YWluIGEgbG9nIG9mIHRocm93biBlcnJvcnMuXG4gICAqL1xuICB0aGlzLm1vZGUgPSBmdW5jdGlvbihtb2RlKSB7XG5cbiAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgIGNhc2UgJ2xvZyc6XG4gICAgICBjYXNlICdyZXRocm93JzpcbiAgICAgICAgdmFyIGVycm9ycyA9IFtdO1xuICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcnMucHVzaChbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobW9kZSA9PT0gXCJyZXRocm93XCIpIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBoYW5kbGVyLmVycm9ycyA9IGVycm9ycztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG1vZGUgJ1wiICsgbW9kZSArIFwiJywgb25seSAnbG9nJy8ncmV0aHJvdycgbW9kZXMgYXJlIGFsbG93ZWQhXCIpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLiRnZXQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gaGFuZGxlcjtcbiAgfTtcblxuICB0aGlzLm1vZGUoJ3JldGhyb3cnKTtcbn07XG5cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJGxvZ1xuICpcbiAqIEBkZXNjcmlwdGlvblxuICogTW9jayBpbXBsZW1lbnRhdGlvbiBvZiB7QGxpbmsgbmcuJGxvZ30gdGhhdCBnYXRoZXJzIGFsbCBsb2dnZWQgbWVzc2FnZXMgaW4gYXJyYXlzXG4gKiAob25lIGFycmF5IHBlciBsb2dnaW5nIGxldmVsKS4gVGhlc2UgYXJyYXlzIGFyZSBleHBvc2VkIGFzIGBsb2dzYCBwcm9wZXJ0eSBvZiBlYWNoIG9mIHRoZVxuICogbGV2ZWwtc3BlY2lmaWMgbG9nIGZ1bmN0aW9uLCBlLmcuIGZvciBsZXZlbCBgZXJyb3JgIHRoZSBhcnJheSBpcyBleHBvc2VkIGFzIGAkbG9nLmVycm9yLmxvZ3NgLlxuICpcbiAqL1xuYW5ndWxhci5tb2NrLiRMb2dQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVidWcgPSB0cnVlO1xuXG4gIGZ1bmN0aW9uIGNvbmNhdChhcnJheTEsIGFycmF5MiwgaW5kZXgpIHtcbiAgICByZXR1cm4gYXJyYXkxLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnJheTIsIGluZGV4KSk7XG4gIH1cblxuICB0aGlzLmRlYnVnRW5hYmxlZCA9IGZ1bmN0aW9uKGZsYWcpIHtcbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoZmxhZykpIHtcbiAgICAgIGRlYnVnID0gZmxhZztcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVidWc7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkbG9nID0ge1xuICAgICAgbG9nOiBmdW5jdGlvbigpIHsgJGxvZy5sb2cubG9ncy5wdXNoKGNvbmNhdChbXSwgYXJndW1lbnRzLCAwKSk7IH0sXG4gICAgICB3YXJuOiBmdW5jdGlvbigpIHsgJGxvZy53YXJuLmxvZ3MucHVzaChjb25jYXQoW10sIGFyZ3VtZW50cywgMCkpOyB9LFxuICAgICAgaW5mbzogZnVuY3Rpb24oKSB7ICRsb2cuaW5mby5sb2dzLnB1c2goY29uY2F0KFtdLCBhcmd1bWVudHMsIDApKTsgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbigpIHsgJGxvZy5lcnJvci5sb2dzLnB1c2goY29uY2F0KFtdLCBhcmd1bWVudHMsIDApKTsgfSxcbiAgICAgIGRlYnVnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRlYnVnKSB7XG4gICAgICAgICAgJGxvZy5kZWJ1Zy5sb2dzLnB1c2goY29uY2F0KFtdLCBhcmd1bWVudHMsIDApKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICogQG5hbWUgJGxvZyNyZXNldFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmVzZXQgYWxsIG9mIHRoZSBsb2dnaW5nIGFycmF5cyB0byBlbXB0eS5cbiAgICAgKi9cbiAgICAkbG9nLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAvKipcbiAgICAgICAqIEBuZ2RvYyBwcm9wZXJ0eVxuICAgICAgICogQG5hbWUgJGxvZyNsb2cubG9nc1xuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogQXJyYXkgb2YgbWVzc2FnZXMgbG9nZ2VkIHVzaW5nIHtAbGluayBuZy4kbG9nI2xvZyBgbG9nKClgfS5cbiAgICAgICAqXG4gICAgICAgKiBAZXhhbXBsZVxuICAgICAgICogYGBganNcbiAgICAgICAqICRsb2cubG9nKCdTb21lIExvZycpO1xuICAgICAgICogdmFyIGZpcnN0ID0gJGxvZy5sb2cubG9ncy51bnNoaWZ0KCk7XG4gICAgICAgKiBgYGBcbiAgICAgICAqL1xuICAgICAgJGxvZy5sb2cubG9ncyA9IFtdO1xuICAgICAgLyoqXG4gICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAqIEBuYW1lICRsb2cjaW5mby5sb2dzXG4gICAgICAgKlxuICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgKiBBcnJheSBvZiBtZXNzYWdlcyBsb2dnZWQgdXNpbmcge0BsaW5rIG5nLiRsb2cjaW5mbyBgaW5mbygpYH0uXG4gICAgICAgKlxuICAgICAgICogQGV4YW1wbGVcbiAgICAgICAqIGBgYGpzXG4gICAgICAgKiAkbG9nLmluZm8oJ1NvbWUgSW5mbycpO1xuICAgICAgICogdmFyIGZpcnN0ID0gJGxvZy5pbmZvLmxvZ3MudW5zaGlmdCgpO1xuICAgICAgICogYGBgXG4gICAgICAgKi9cbiAgICAgICRsb2cuaW5mby5sb2dzID0gW107XG4gICAgICAvKipcbiAgICAgICAqIEBuZ2RvYyBwcm9wZXJ0eVxuICAgICAgICogQG5hbWUgJGxvZyN3YXJuLmxvZ3NcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIEFycmF5IG9mIG1lc3NhZ2VzIGxvZ2dlZCB1c2luZyB7QGxpbmsgbmcuJGxvZyN3YXJuIGB3YXJuKClgfS5cbiAgICAgICAqXG4gICAgICAgKiBAZXhhbXBsZVxuICAgICAgICogYGBganNcbiAgICAgICAqICRsb2cud2FybignU29tZSBXYXJuaW5nJyk7XG4gICAgICAgKiB2YXIgZmlyc3QgPSAkbG9nLndhcm4ubG9ncy51bnNoaWZ0KCk7XG4gICAgICAgKiBgYGBcbiAgICAgICAqL1xuICAgICAgJGxvZy53YXJuLmxvZ3MgPSBbXTtcbiAgICAgIC8qKlxuICAgICAgICogQG5nZG9jIHByb3BlcnR5XG4gICAgICAgKiBAbmFtZSAkbG9nI2Vycm9yLmxvZ3NcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIEFycmF5IG9mIG1lc3NhZ2VzIGxvZ2dlZCB1c2luZyB7QGxpbmsgbmcuJGxvZyNlcnJvciBgZXJyb3IoKWB9LlxuICAgICAgICpcbiAgICAgICAqIEBleGFtcGxlXG4gICAgICAgKiBgYGBqc1xuICAgICAgICogJGxvZy5lcnJvcignU29tZSBFcnJvcicpO1xuICAgICAgICogdmFyIGZpcnN0ID0gJGxvZy5lcnJvci5sb2dzLnVuc2hpZnQoKTtcbiAgICAgICAqIGBgYFxuICAgICAgICovXG4gICAgICAkbG9nLmVycm9yLmxvZ3MgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICAgICAqIEBuYW1lICRsb2cjZGVidWcubG9nc1xuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogQXJyYXkgb2YgbWVzc2FnZXMgbG9nZ2VkIHVzaW5nIHtAbGluayBuZy4kbG9nI2RlYnVnIGBkZWJ1ZygpYH0uXG4gICAgICAgKlxuICAgICAgICogQGV4YW1wbGVcbiAgICAgICAqIGBgYGpzXG4gICAgICAgKiAkbG9nLmRlYnVnKCdTb21lIEVycm9yJyk7XG4gICAgICAgKiB2YXIgZmlyc3QgPSAkbG9nLmRlYnVnLmxvZ3MudW5zaGlmdCgpO1xuICAgICAgICogYGBgXG4gICAgICAgKi9cbiAgICAgICRsb2cuZGVidWcubG9ncyA9IFtdO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICogQG5hbWUgJGxvZyNhc3NlcnRFbXB0eVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQXNzZXJ0IHRoYXQgYWxsIG9mIHRoZSBsb2dnaW5nIG1ldGhvZHMgaGF2ZSBubyBsb2dnZWQgbWVzc2FnZXMuIElmIGFueSBtZXNzYWdlcyBhcmUgcHJlc2VudCxcbiAgICAgKiBhbiBleGNlcHRpb24gaXMgdGhyb3duLlxuICAgICAqL1xuICAgICRsb2cuYXNzZXJ0RW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChbJ2Vycm9yJywgJ3dhcm4nLCAnaW5mbycsICdsb2cnLCAnZGVidWcnXSwgZnVuY3Rpb24obG9nTGV2ZWwpIHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRsb2dbbG9nTGV2ZWxdLmxvZ3MsIGZ1bmN0aW9uKGxvZykge1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsb2csIGZ1bmN0aW9uKGxvZ0l0ZW0pIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKCdNT0NLICRsb2cgKCcgKyBsb2dMZXZlbCArICcpOiAnICsgU3RyaW5nKGxvZ0l0ZW0pICsgJ1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKGxvZ0l0ZW0uc3RhY2sgfHwgJycpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGVycm9ycy51bnNoaWZ0KFwiRXhwZWN0ZWQgJGxvZyB0byBiZSBlbXB0eSEgRWl0aGVyIGEgbWVzc2FnZSB3YXMgbG9nZ2VkIHVuZXhwZWN0ZWRseSwgb3IgXCIgK1xuICAgICAgICAgIFwiYW4gZXhwZWN0ZWQgbG9nIG1lc3NhZ2Ugd2FzIG5vdCBjaGVja2VkIGFuZCByZW1vdmVkOlwiKTtcbiAgICAgICAgZXJyb3JzLnB1c2goJycpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JzLmpvaW4oJ1xcbi0tLS0tLS0tLVxcbicpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJGxvZy5yZXNldCgpO1xuICAgIHJldHVybiAkbG9nO1xuICB9O1xufTtcblxuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSAkaW50ZXJ2YWxcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE1vY2sgaW1wbGVtZW50YXRpb24gb2YgdGhlICRpbnRlcnZhbCBzZXJ2aWNlLlxuICpcbiAqIFVzZSB7QGxpbmsgbmdNb2NrLiRpbnRlcnZhbCNmbHVzaCBgJGludGVydmFsLmZsdXNoKG1pbGxpcylgfSB0b1xuICogbW92ZSBmb3J3YXJkIGJ5IGBtaWxsaXNgIG1pbGxpc2Vjb25kcyBhbmQgdHJpZ2dlciBhbnkgZnVuY3Rpb25zIHNjaGVkdWxlZCB0byBydW4gaW4gdGhhdFxuICogdGltZS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCl9IGZuIEEgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgY2FsbGVkIHJlcGVhdGVkbHkuXG4gKiBAcGFyYW0ge251bWJlcn0gZGVsYXkgTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBiZXR3ZWVuIGVhY2ggZnVuY3Rpb24gY2FsbC5cbiAqIEBwYXJhbSB7bnVtYmVyPX0gW2NvdW50PTBdIE51bWJlciBvZiB0aW1lcyB0byByZXBlYXQuIElmIG5vdCBzZXQsIG9yIDAsIHdpbGwgcmVwZWF0XG4gKiAgIGluZGVmaW5pdGVseS5cbiAqIEBwYXJhbSB7Ym9vbGVhbj19IFtpbnZva2VBcHBseT10cnVlXSBJZiBzZXQgdG8gYGZhbHNlYCBza2lwcyBtb2RlbCBkaXJ0eSBjaGVja2luZywgb3RoZXJ3aXNlXG4gKiAgIHdpbGwgaW52b2tlIGBmbmAgd2l0aGluIHRoZSB7QGxpbmsgbmcuJHJvb3RTY29wZS5TY29wZSMkYXBwbHkgJGFwcGx5fSBibG9jay5cbiAqIEBwYXJhbSB7Li4uKj19IFBhc3MgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIHRvIHRoZSBleGVjdXRlZCBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtwcm9taXNlfSBBIHByb21pc2Ugd2hpY2ggd2lsbCBiZSBub3RpZmllZCBvbiBlYWNoIGl0ZXJhdGlvbi5cbiAqL1xuYW5ndWxhci5tb2NrLiRJbnRlcnZhbFByb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuJGdldCA9IFsnJGJyb3dzZXInLCAnJHJvb3RTY29wZScsICckcScsICckJHEnLFxuICAgICAgIGZ1bmN0aW9uKCRicm93c2VyLCAgICRyb290U2NvcGUsICAgJHEsICAgJCRxKSB7XG4gICAgdmFyIHJlcGVhdEZucyA9IFtdLFxuICAgICAgICBuZXh0UmVwZWF0SWQgPSAwLFxuICAgICAgICBub3cgPSAwO1xuXG4gICAgdmFyICRpbnRlcnZhbCA9IGZ1bmN0aW9uKGZuLCBkZWxheSwgY291bnQsIGludm9rZUFwcGx5KSB7XG4gICAgICB2YXIgaGFzUGFyYW1zID0gYXJndW1lbnRzLmxlbmd0aCA+IDQsXG4gICAgICAgICAgYXJncyA9IGhhc1BhcmFtcyA/IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgNCkgOiBbXSxcbiAgICAgICAgICBpdGVyYXRpb24gPSAwLFxuICAgICAgICAgIHNraXBBcHBseSA9IChhbmd1bGFyLmlzRGVmaW5lZChpbnZva2VBcHBseSkgJiYgIWludm9rZUFwcGx5KSxcbiAgICAgICAgICBkZWZlcnJlZCA9IChza2lwQXBwbHkgPyAkJHEgOiAkcSkuZGVmZXIoKSxcbiAgICAgICAgICBwcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZTtcblxuICAgICAgY291bnQgPSAoYW5ndWxhci5pc0RlZmluZWQoY291bnQpKSA/IGNvdW50IDogMDtcbiAgICAgIHByb21pc2UudGhlbihudWxsLCBudWxsLCAoIWhhc1BhcmFtcykgPyBmbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH0pO1xuXG4gICAgICBwcm9taXNlLiQkaW50ZXJ2YWxJZCA9IG5leHRSZXBlYXRJZDtcblxuICAgICAgZnVuY3Rpb24gdGljaygpIHtcbiAgICAgICAgZGVmZXJyZWQubm90aWZ5KGl0ZXJhdGlvbisrKTtcblxuICAgICAgICBpZiAoY291bnQgPiAwICYmIGl0ZXJhdGlvbiA+PSBjb3VudCkge1xuICAgICAgICAgIHZhciBmbkluZGV4O1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoaXRlcmF0aW9uKTtcblxuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyZXBlYXRGbnMsIGZ1bmN0aW9uKGZuLCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKGZuLmlkID09PSBwcm9taXNlLiQkaW50ZXJ2YWxJZCkgZm5JbmRleCA9IGluZGV4O1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGZuSW5kZXgpKSB7XG4gICAgICAgICAgICByZXBlYXRGbnMuc3BsaWNlKGZuSW5kZXgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChza2lwQXBwbHkpIHtcbiAgICAgICAgICAkYnJvd3Nlci5kZWZlci5mbHVzaCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVwZWF0Rm5zLnB1c2goe1xuICAgICAgICBuZXh0VGltZToobm93ICsgZGVsYXkpLFxuICAgICAgICBkZWxheTogZGVsYXksXG4gICAgICAgIGZuOiB0aWNrLFxuICAgICAgICBpZDogbmV4dFJlcGVhdElkLFxuICAgICAgICBkZWZlcnJlZDogZGVmZXJyZWRcbiAgICAgIH0pO1xuICAgICAgcmVwZWF0Rm5zLnNvcnQoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS5uZXh0VGltZSAtIGIubmV4dFRpbWU7fSk7XG5cbiAgICAgIG5leHRSZXBlYXRJZCsrO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICogQG5hbWUgJGludGVydmFsI2NhbmNlbFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ2FuY2VscyBhIHRhc2sgYXNzb2NpYXRlZCB3aXRoIHRoZSBgcHJvbWlzZWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3Byb21pc2V9IHByb21pc2UgQSBwcm9taXNlIGZyb20gY2FsbGluZyB0aGUgYCRpbnRlcnZhbGAgZnVuY3Rpb24uXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB0YXNrIHdhcyBzdWNjZXNzZnVsbHkgY2FuY2VsbGVkLlxuICAgICAqL1xuICAgICRpbnRlcnZhbC5jYW5jZWwgPSBmdW5jdGlvbihwcm9taXNlKSB7XG4gICAgICBpZiAoIXByb21pc2UpIHJldHVybiBmYWxzZTtcbiAgICAgIHZhciBmbkluZGV4O1xuXG4gICAgICBhbmd1bGFyLmZvckVhY2gocmVwZWF0Rm5zLCBmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmlkID09PSBwcm9taXNlLiQkaW50ZXJ2YWxJZCkgZm5JbmRleCA9IGluZGV4O1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChmbkluZGV4KSkge1xuICAgICAgICByZXBlYXRGbnNbZm5JbmRleF0uZGVmZXJyZWQucmVqZWN0KCdjYW5jZWxlZCcpO1xuICAgICAgICByZXBlYXRGbnMuc3BsaWNlKGZuSW5kZXgsIDEpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICogQG5hbWUgJGludGVydmFsI2ZsdXNoXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBSdW5zIGludGVydmFsIHRhc2tzIHNjaGVkdWxlZCB0byBiZSBydW4gaW4gdGhlIG5leHQgYG1pbGxpc2AgbWlsbGlzZWNvbmRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXI9fSBtaWxsaXMgbWF4aW11bSB0aW1lb3V0IGFtb3VudCB0byBmbHVzaCB1cCB1bnRpbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGFtb3VudCBvZiB0aW1lIG1vdmVkIGZvcndhcmQuXG4gICAgICovXG4gICAgJGludGVydmFsLmZsdXNoID0gZnVuY3Rpb24obWlsbGlzKSB7XG4gICAgICBub3cgKz0gbWlsbGlzO1xuICAgICAgd2hpbGUgKHJlcGVhdEZucy5sZW5ndGggJiYgcmVwZWF0Rm5zWzBdLm5leHRUaW1lIDw9IG5vdykge1xuICAgICAgICB2YXIgdGFzayA9IHJlcGVhdEZuc1swXTtcbiAgICAgICAgdGFzay5mbigpO1xuICAgICAgICB0YXNrLm5leHRUaW1lICs9IHRhc2suZGVsYXk7XG4gICAgICAgIHJlcGVhdEZucy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEubmV4dFRpbWUgLSBiLm5leHRUaW1lO30pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1pbGxpcztcbiAgICB9O1xuXG4gICAgcmV0dXJuICRpbnRlcnZhbDtcbiAgfV07XG59O1xuXG5cbi8qIGpzaGludCAtVzEwMSAqL1xuLyogVGhlIFJfSVNPODA2MV9TVFIgcmVnZXggaXMgbmV2ZXIgZ29pbmcgdG8gZml0IGludG8gdGhlIDEwMCBjaGFyIGxpbWl0IVxuICogVGhpcyBkaXJlY3RpdmUgc2hvdWxkIGdvIGluc2lkZSB0aGUgYW5vbnltb3VzIGZ1bmN0aW9uIGJ1dCBhIGJ1ZyBpbiBKU0hpbnQgbWVhbnMgdGhhdCBpdCB3b3VsZFxuICogbm90IGJlIGVuYWN0ZWQgZWFybHkgZW5vdWdoIHRvIHByZXZlbnQgdGhlIHdhcm5pbmcuXG4gKi9cbnZhciBSX0lTTzgwNjFfU1RSID0gL14oLT9cXGR7NH0pLT8oXFxkXFxkKS0/KFxcZFxcZCkoPzpUKFxcZFxcZCkoPzpcXDo/KFxcZFxcZCkoPzpcXDo/KFxcZFxcZCkoPzpcXC4oXFxkezN9KSk/KT8pPyhafChbKy1dKShcXGRcXGQpOj8oXFxkXFxkKSkpPyQvO1xuXG5mdW5jdGlvbiBqc29uU3RyaW5nVG9EYXRlKHN0cmluZykge1xuICB2YXIgbWF0Y2g7XG4gIGlmIChtYXRjaCA9IHN0cmluZy5tYXRjaChSX0lTTzgwNjFfU1RSKSkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoMCksXG4gICAgICAgIHR6SG91ciA9IDAsXG4gICAgICAgIHR6TWluICA9IDA7XG4gICAgaWYgKG1hdGNoWzldKSB7XG4gICAgICB0ekhvdXIgPSB0b0ludChtYXRjaFs5XSArIG1hdGNoWzEwXSk7XG4gICAgICB0ek1pbiA9IHRvSW50KG1hdGNoWzldICsgbWF0Y2hbMTFdKTtcbiAgICB9XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcih0b0ludChtYXRjaFsxXSksIHRvSW50KG1hdGNoWzJdKSAtIDEsIHRvSW50KG1hdGNoWzNdKSk7XG4gICAgZGF0ZS5zZXRVVENIb3Vycyh0b0ludChtYXRjaFs0XSB8fCAwKSAtIHR6SG91cixcbiAgICAgICAgICAgICAgICAgICAgIHRvSW50KG1hdGNoWzVdIHx8IDApIC0gdHpNaW4sXG4gICAgICAgICAgICAgICAgICAgICB0b0ludChtYXRjaFs2XSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgIHRvSW50KG1hdGNoWzddIHx8IDApKTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuICByZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiB0b0ludChzdHIpIHtcbiAgcmV0dXJuIHBhcnNlSW50KHN0ciwgMTApO1xufVxuXG5mdW5jdGlvbiBwYWROdW1iZXJJbk1vY2sobnVtLCBkaWdpdHMsIHRyaW0pIHtcbiAgdmFyIG5lZyA9ICcnO1xuICBpZiAobnVtIDwgMCkge1xuICAgIG5lZyA9ICAnLSc7XG4gICAgbnVtID0gLW51bTtcbiAgfVxuICBudW0gPSAnJyArIG51bTtcbiAgd2hpbGUgKG51bS5sZW5ndGggPCBkaWdpdHMpIG51bSA9ICcwJyArIG51bTtcbiAgaWYgKHRyaW0pIHtcbiAgICBudW0gPSBudW0uc3Vic3RyKG51bS5sZW5ndGggLSBkaWdpdHMpO1xuICB9XG4gIHJldHVybiBuZWcgKyBudW07XG59XG5cblxuLyoqXG4gKiBAbmdkb2MgdHlwZVxuICogQG5hbWUgYW5ndWxhci5tb2NrLlR6RGF0ZVxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogKk5PVEUqOiB0aGlzIGlzIG5vdCBhbiBpbmplY3RhYmxlIGluc3RhbmNlLCBqdXN0IGEgZ2xvYmFsbHkgYXZhaWxhYmxlIG1vY2sgY2xhc3Mgb2YgYERhdGVgLlxuICpcbiAqIE1vY2sgb2YgdGhlIERhdGUgdHlwZSB3aGljaCBoYXMgaXRzIHRpbWV6b25lIHNwZWNpZmllZCB2aWEgY29uc3RydWN0b3IgYXJnLlxuICpcbiAqIFRoZSBtYWluIHB1cnBvc2UgaXMgdG8gY3JlYXRlIERhdGUtbGlrZSBpbnN0YW5jZXMgd2l0aCB0aW1lem9uZSBmaXhlZCB0byB0aGUgc3BlY2lmaWVkIHRpbWV6b25lXG4gKiBvZmZzZXQsIHNvIHRoYXQgd2UgY2FuIHRlc3QgY29kZSB0aGF0IGRlcGVuZHMgb24gbG9jYWwgdGltZXpvbmUgc2V0dGluZ3Mgd2l0aG91dCBkZXBlbmRlbmN5IG9uXG4gKiB0aGUgdGltZSB6b25lIHNldHRpbmdzIG9mIHRoZSBtYWNoaW5lIHdoZXJlIHRoZSBjb2RlIGlzIHJ1bm5pbmcuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCBPZmZzZXQgb2YgdGhlICpkZXNpcmVkKiB0aW1lem9uZSBpbiBob3VycyAoZnJhY3Rpb25zIHdpbGwgYmUgaG9ub3JlZClcbiAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSB0aW1lc3RhbXAgVGltZXN0YW1wIHJlcHJlc2VudGluZyB0aGUgZGVzaXJlZCB0aW1lIGluICpVVEMqXG4gKlxuICogQGV4YW1wbGVcbiAqICEhISEgV0FSTklORyAhISEhIVxuICogVGhpcyBpcyBub3QgYSBjb21wbGV0ZSBEYXRlIG9iamVjdCBzbyBvbmx5IG1ldGhvZHMgdGhhdCB3ZXJlIGltcGxlbWVudGVkIGNhbiBiZSBjYWxsZWQgc2FmZWx5LlxuICogVG8gbWFrZSBtYXR0ZXJzIHdvcnNlLCBUekRhdGUgaW5zdGFuY2VzIGluaGVyaXQgc3R1ZmYgZnJvbSBEYXRlIHZpYSBhIHByb3RvdHlwZS5cbiAqXG4gKiBXZSBkbyBvdXIgYmVzdCB0byBpbnRlcmNlcHQgY2FsbHMgdG8gXCJ1bmltcGxlbWVudGVkXCIgbWV0aG9kcywgYnV0IHNpbmNlIHRoZSBsaXN0IG9mIG1ldGhvZHMgaXNcbiAqIGluY29tcGxldGUgd2UgbWlnaHQgYmUgbWlzc2luZyBzb21lIG5vbi1zdGFuZGFyZCBtZXRob2RzLiBUaGlzIGNhbiByZXN1bHQgaW4gZXJyb3JzIGxpa2U6XG4gKiBcIkRhdGUucHJvdG90eXBlLmZvbyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIE9iamVjdFwiLlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgbmV3WWVhckluQnJhdGlzbGF2YSA9IG5ldyBUekRhdGUoLTEsICcyMDA5LTEyLTMxVDIzOjAwOjAwWicpO1xuICogbmV3WWVhckluQnJhdGlzbGF2YS5nZXRUaW1lem9uZU9mZnNldCgpID0+IC02MDtcbiAqIG5ld1llYXJJbkJyYXRpc2xhdmEuZ2V0RnVsbFllYXIoKSA9PiAyMDEwO1xuICogbmV3WWVhckluQnJhdGlzbGF2YS5nZXRNb250aCgpID0+IDA7XG4gKiBuZXdZZWFySW5CcmF0aXNsYXZhLmdldERhdGUoKSA9PiAxO1xuICogbmV3WWVhckluQnJhdGlzbGF2YS5nZXRIb3VycygpID0+IDA7XG4gKiBuZXdZZWFySW5CcmF0aXNsYXZhLmdldE1pbnV0ZXMoKSA9PiAwO1xuICogbmV3WWVhckluQnJhdGlzbGF2YS5nZXRTZWNvbmRzKCkgPT4gMDtcbiAqIGBgYFxuICpcbiAqL1xuYW5ndWxhci5tb2NrLlR6RGF0ZSA9IGZ1bmN0aW9uKG9mZnNldCwgdGltZXN0YW1wKSB7XG4gIHZhciBzZWxmID0gbmV3IERhdGUoMCk7XG4gIGlmIChhbmd1bGFyLmlzU3RyaW5nKHRpbWVzdGFtcCkpIHtcbiAgICB2YXIgdHNTdHIgPSB0aW1lc3RhbXA7XG5cbiAgICBzZWxmLm9yaWdEYXRlID0ganNvblN0cmluZ1RvRGF0ZSh0aW1lc3RhbXApO1xuXG4gICAgdGltZXN0YW1wID0gc2VsZi5vcmlnRGF0ZS5nZXRUaW1lKCk7XG4gICAgaWYgKGlzTmFOKHRpbWVzdGFtcCkpIHtcbiAgICAgIHRocm93IHtcbiAgICAgICAgbmFtZTogXCJJbGxlZ2FsIEFyZ3VtZW50XCIsXG4gICAgICAgIG1lc3NhZ2U6IFwiQXJnICdcIiArIHRzU3RyICsgXCInIHBhc3NlZCBpbnRvIFR6RGF0ZSBjb25zdHJ1Y3RvciBpcyBub3QgYSB2YWxpZCBkYXRlIHN0cmluZ1wiXG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLm9yaWdEYXRlID0gbmV3IERhdGUodGltZXN0YW1wKTtcbiAgfVxuXG4gIHZhciBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKHRpbWVzdGFtcCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgc2VsZi5vZmZzZXREaWZmID0gbG9jYWxPZmZzZXQgKiA2MCAqIDEwMDAgLSBvZmZzZXQgKiAxMDAwICogNjAgKiA2MDtcbiAgc2VsZi5kYXRlID0gbmV3IERhdGUodGltZXN0YW1wICsgc2VsZi5vZmZzZXREaWZmKTtcblxuICBzZWxmLmdldFRpbWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5kYXRlLmdldFRpbWUoKSAtIHNlbGYub2Zmc2V0RGlmZjtcbiAgfTtcblxuICBzZWxmLnRvTG9jYWxlRGF0ZVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRGdWxsWWVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgfTtcblxuICBzZWxmLmdldE1vbnRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYuZGF0ZS5nZXRNb250aCgpO1xuICB9O1xuXG4gIHNlbGYuZ2V0RGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUuZ2V0RGF0ZSgpO1xuICB9O1xuXG4gIHNlbGYuZ2V0SG91cnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5kYXRlLmdldEhvdXJzKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRNaW51dGVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYuZGF0ZS5nZXRNaW51dGVzKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRTZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYuZGF0ZS5nZXRTZWNvbmRzKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRNaWxsaXNlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5kYXRlLmdldE1pbGxpc2Vjb25kcygpO1xuICB9O1xuXG4gIHNlbGYuZ2V0VGltZXpvbmVPZmZzZXQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gb2Zmc2V0ICogNjA7XG4gIH07XG5cbiAgc2VsZi5nZXRVVENGdWxsWWVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLm9yaWdEYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRVVENNb250aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLm9yaWdEYXRlLmdldFVUQ01vbnRoKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRVVENEYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNlbGYub3JpZ0RhdGUuZ2V0VVRDRGF0ZSgpO1xuICB9O1xuXG4gIHNlbGYuZ2V0VVRDSG91cnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5vcmlnRGF0ZS5nZXRVVENIb3VycygpO1xuICB9O1xuXG4gIHNlbGYuZ2V0VVRDTWludXRlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLm9yaWdEYXRlLmdldFVUQ01pbnV0ZXMoKTtcbiAgfTtcblxuICBzZWxmLmdldFVUQ1NlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5vcmlnRGF0ZS5nZXRVVENTZWNvbmRzKCk7XG4gIH07XG5cbiAgc2VsZi5nZXRVVENNaWxsaXNlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2VsZi5vcmlnRGF0ZS5nZXRVVENNaWxsaXNlY29uZHMoKTtcbiAgfTtcblxuICBzZWxmLmdldERheSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZWxmLmRhdGUuZ2V0RGF5KCk7XG4gIH07XG5cbiAgLy8gcHJvdmlkZSB0aGlzIG1ldGhvZCBvbmx5IG9uIGJyb3dzZXJzIHRoYXQgYWxyZWFkeSBoYXZlIGl0XG4gIGlmIChzZWxmLnRvSVNPU3RyaW5nKSB7XG4gICAgc2VsZi50b0lTT1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBhZE51bWJlckluTW9jayhzZWxmLm9yaWdEYXRlLmdldFVUQ0Z1bGxZZWFyKCksIDQpICsgJy0nICtcbiAgICAgICAgICAgIHBhZE51bWJlckluTW9jayhzZWxmLm9yaWdEYXRlLmdldFVUQ01vbnRoKCkgKyAxLCAyKSArICctJyArXG4gICAgICAgICAgICBwYWROdW1iZXJJbk1vY2soc2VsZi5vcmlnRGF0ZS5nZXRVVENEYXRlKCksIDIpICsgJ1QnICtcbiAgICAgICAgICAgIHBhZE51bWJlckluTW9jayhzZWxmLm9yaWdEYXRlLmdldFVUQ0hvdXJzKCksIDIpICsgJzonICtcbiAgICAgICAgICAgIHBhZE51bWJlckluTW9jayhzZWxmLm9yaWdEYXRlLmdldFVUQ01pbnV0ZXMoKSwgMikgKyAnOicgK1xuICAgICAgICAgICAgcGFkTnVtYmVySW5Nb2NrKHNlbGYub3JpZ0RhdGUuZ2V0VVRDU2Vjb25kcygpLCAyKSArICcuJyArXG4gICAgICAgICAgICBwYWROdW1iZXJJbk1vY2soc2VsZi5vcmlnRGF0ZS5nZXRVVENNaWxsaXNlY29uZHMoKSwgMykgKyAnWic7XG4gICAgfTtcbiAgfVxuXG4gIC8vaGlkZSBhbGwgbWV0aG9kcyBub3QgaW1wbGVtZW50ZWQgaW4gdGhpcyBtb2NrIHRoYXQgdGhlIERhdGUgcHJvdG90eXBlIGV4cG9zZXNcbiAgdmFyIHVuaW1wbGVtZW50ZWRNZXRob2RzID0gWydnZXRVVENEYXknLFxuICAgICAgJ2dldFllYXInLCAnc2V0RGF0ZScsICdzZXRGdWxsWWVhcicsICdzZXRIb3VycycsICdzZXRNaWxsaXNlY29uZHMnLFxuICAgICAgJ3NldE1pbnV0ZXMnLCAnc2V0TW9udGgnLCAnc2V0U2Vjb25kcycsICdzZXRUaW1lJywgJ3NldFVUQ0RhdGUnLCAnc2V0VVRDRnVsbFllYXInLFxuICAgICAgJ3NldFVUQ0hvdXJzJywgJ3NldFVUQ01pbGxpc2Vjb25kcycsICdzZXRVVENNaW51dGVzJywgJ3NldFVUQ01vbnRoJywgJ3NldFVUQ1NlY29uZHMnLFxuICAgICAgJ3NldFllYXInLCAndG9EYXRlU3RyaW5nJywgJ3RvR01UU3RyaW5nJywgJ3RvSlNPTicsICd0b0xvY2FsZUZvcm1hdCcsICd0b0xvY2FsZVN0cmluZycsXG4gICAgICAndG9Mb2NhbGVUaW1lU3RyaW5nJywgJ3RvU291cmNlJywgJ3RvU3RyaW5nJywgJ3RvVGltZVN0cmluZycsICd0b1VUQ1N0cmluZycsICd2YWx1ZU9mJ107XG5cbiAgYW5ndWxhci5mb3JFYWNoKHVuaW1wbGVtZW50ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgc2VsZlttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kICdcIiArIG1ldGhvZE5hbWUgKyBcIicgaXMgbm90IGltcGxlbWVudGVkIGluIHRoZSBUekRhdGUgbW9ja1wiKTtcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gc2VsZjtcbn07XG5cbi8vbWFrZSBcInR6RGF0ZUluc3RhbmNlIGluc3RhbmNlb2YgRGF0ZVwiIHJldHVybiB0cnVlXG5hbmd1bGFyLm1vY2suVHpEYXRlLnByb3RvdHlwZSA9IERhdGUucHJvdG90eXBlO1xuLyoganNoaW50ICtXMTAxICovXG5cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJGFuaW1hdGVcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE1vY2sgaW1wbGVtZW50YXRpb24gb2YgdGhlIHtAbGluayBuZy4kYW5pbWF0ZSBgJGFuaW1hdGVgfSBzZXJ2aWNlLiBFeHBvc2VzIHR3byBhZGRpdGlvbmFsIG1ldGhvZHNcbiAqIGZvciB0ZXN0aW5nIGFuaW1hdGlvbnMuXG4gKi9cbmFuZ3VsYXIubW9jay5hbmltYXRlID0gYW5ndWxhci5tb2R1bGUoJ25nQW5pbWF0ZU1vY2snLCBbJ25nJ10pXG5cbiAgLmNvbmZpZyhbJyRwcm92aWRlJywgZnVuY3Rpb24oJHByb3ZpZGUpIHtcblxuICAgICRwcm92aWRlLmZhY3RvcnkoJyQkZm9yY2VSZWZsb3cnLCBmdW5jdGlvbigpIHtcbiAgICAgIGZ1bmN0aW9uIHJlZmxvd0ZuKCkge1xuICAgICAgICByZWZsb3dGbi50b3RhbFJlZmxvd3MrKztcbiAgICAgIH1cbiAgICAgIHJlZmxvd0ZuLnRvdGFsUmVmbG93cyA9IDA7XG4gICAgICByZXR1cm4gcmVmbG93Rm47XG4gICAgfSk7XG5cbiAgICAkcHJvdmlkZS5mYWN0b3J5KCckJGFuaW1hdGVBc3luY1J1bicsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICB2YXIgcXVldWVGbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICBxdWV1ZUZuLmZsdXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgcXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBxdWV1ZSA9IFtdO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBxdWV1ZUZuO1xuICAgIH0pO1xuXG4gICAgJHByb3ZpZGUuZGVjb3JhdG9yKCckJGFuaW1hdGVKcycsIFsnJGRlbGVnYXRlJywgZnVuY3Rpb24oJGRlbGVnYXRlKSB7XG4gICAgICB2YXIgcnVubmVycyA9IFtdO1xuXG4gICAgICB2YXIgYW5pbWF0ZUpzQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFuaW1hdG9yID0gJGRlbGVnYXRlLmFwcGx5KCRkZWxlZ2F0ZSwgYXJndW1lbnRzKTtcbiAgICAgICAgLy8gSWYgbm8gamF2YXNjcmlwdCBhbmltYXRpb24gaXMgZm91bmQsIGFuaW1hdG9yIGlzIHVuZGVmaW5lZFxuICAgICAgICBpZiAoYW5pbWF0b3IpIHtcbiAgICAgICAgICBydW5uZXJzLnB1c2goYW5pbWF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbmltYXRvcjtcbiAgICAgIH07XG5cbiAgICAgIGFuaW1hdGVKc0NvbnN0cnVjdG9yLiRjbG9zZUFuZEZsdXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJ1bm5lcnMuZm9yRWFjaChmdW5jdGlvbihydW5uZXIpIHtcbiAgICAgICAgICBydW5uZXIuZW5kKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBydW5uZXJzID0gW107XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gYW5pbWF0ZUpzQ29uc3RydWN0b3I7XG4gICAgfV0pO1xuXG4gICAgJHByb3ZpZGUuZGVjb3JhdG9yKCckYW5pbWF0ZUNzcycsIFsnJGRlbGVnYXRlJywgZnVuY3Rpb24oJGRlbGVnYXRlKSB7XG4gICAgICB2YXIgcnVubmVycyA9IFtdO1xuXG4gICAgICB2YXIgYW5pbWF0ZUNzc0NvbnN0cnVjdG9yID0gZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgYW5pbWF0b3IgPSAkZGVsZWdhdGUoZWxlbWVudCwgb3B0aW9ucyk7XG4gICAgICAgIHJ1bm5lcnMucHVzaChhbmltYXRvcik7XG4gICAgICAgIHJldHVybiBhbmltYXRvcjtcbiAgICAgIH07XG5cbiAgICAgIGFuaW1hdGVDc3NDb25zdHJ1Y3Rvci4kY2xvc2VBbmRGbHVzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBydW5uZXJzLmZvckVhY2goZnVuY3Rpb24ocnVubmVyKSB7XG4gICAgICAgICAgcnVubmVyLmVuZCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcnVubmVycyA9IFtdO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGFuaW1hdGVDc3NDb25zdHJ1Y3RvcjtcbiAgICB9XSk7XG5cbiAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRhbmltYXRlJywgWyckZGVsZWdhdGUnLCAnJHRpbWVvdXQnLCAnJGJyb3dzZXInLCAnJCRyQUYnLCAnJGFuaW1hdGVDc3MnLCAnJCRhbmltYXRlSnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyQkZm9yY2VSZWZsb3cnLCAnJCRhbmltYXRlQXN5bmNSdW4nLCAnJHJvb3RTY29wZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oJGRlbGVnYXRlLCAgICR0aW1lb3V0LCAgICRicm93c2VyLCAgICQkckFGLCAgICRhbmltYXRlQ3NzLCAgICQkYW5pbWF0ZUpzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkZm9yY2VSZWZsb3csICAgJCRhbmltYXRlQXN5bmNSdW4sICAkcm9vdFNjb3BlKSB7XG4gICAgICB2YXIgYW5pbWF0ZSA9IHtcbiAgICAgICAgcXVldWU6IFtdLFxuICAgICAgICBjYW5jZWw6ICRkZWxlZ2F0ZS5jYW5jZWwsXG4gICAgICAgIG9uOiAkZGVsZWdhdGUub24sXG4gICAgICAgIG9mZjogJGRlbGVnYXRlLm9mZixcbiAgICAgICAgcGluOiAkZGVsZWdhdGUucGluLFxuICAgICAgICBnZXQgcmVmbG93cygpIHtcbiAgICAgICAgICByZXR1cm4gJCRmb3JjZVJlZmxvdy50b3RhbFJlZmxvd3M7XG4gICAgICAgIH0sXG4gICAgICAgIGVuYWJsZWQ6ICRkZWxlZ2F0ZS5lbmFibGVkLFxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgKiBAbmFtZSAkYW5pbWF0ZSNjbG9zZUFuZEZsdXNoXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIGNsb3NlIGFsbCBwZW5kaW5nIGFuaW1hdGlvbnMgKGJvdGgge0BsaW5rIG5nQW5pbWF0ZSNqYXZhc2NyaXB0LWJhc2VkLWFuaW1hdGlvbnMgSmF2YXNjcmlwdH1cbiAgICAgICAgICogYW5kIHtAbGluayBuZ0FuaW1hdGUuJGFuaW1hdGVDc3MgQ1NTfSkgYW5kIGl0IHdpbGwgYWxzbyBmbHVzaCBhbnkgcmVtYWluaW5nIGFuaW1hdGlvbiBmcmFtZXMgYW5kL29yIGNhbGxiYWNrcy5cbiAgICAgICAgICovXG4gICAgICAgIGNsb3NlQW5kRmx1c2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIHdlIGFsbG93IHRoZSBmbHVzaCBjb21tYW5kIHRvIHN3YWxsb3cgdGhlIGVycm9yc1xuICAgICAgICAgIC8vIGJlY2F1c2UgZGVwZW5kaW5nIG9uIHdoZXRoZXIgQ1NTIG9yIEpTIGFuaW1hdGlvbnMgYXJlXG4gICAgICAgICAgLy8gdXNlZCwgdGhlcmUgbWF5IG5vdCBiZSBhIFJBRiBmbHVzaC4gVGhlIHByaW1hcnkgZmx1c2hcbiAgICAgICAgICAvLyBhdCB0aGUgZW5kIG9mIHRoaXMgZnVuY3Rpb24gbXVzdCB0aHJvdyBhbiBleGNlcHRpb25cbiAgICAgICAgICAvLyBiZWNhdXNlIGl0IHdpbGwgdHJhY2sgaWYgdGhlcmUgd2VyZSBwZW5kaW5nIGFuaW1hdGlvbnNcbiAgICAgICAgICB0aGlzLmZsdXNoKHRydWUpO1xuICAgICAgICAgICRhbmltYXRlQ3NzLiRjbG9zZUFuZEZsdXNoKCk7XG4gICAgICAgICAgJCRhbmltYXRlSnMuJGNsb3NlQW5kRmx1c2goKTtcbiAgICAgICAgICB0aGlzLmZsdXNoKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAqIEBuYW1lICRhbmltYXRlI2ZsdXNoXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIGZsdXNoIHRoZSBwZW5kaW5nIGNhbGxiYWNrcyBhbmQgYW5pbWF0aW9uIGZyYW1lcyB0byBlaXRoZXIgc3RhcnRcbiAgICAgICAgICogYW4gYW5pbWF0aW9uIG9yIGNvbmNsdWRlIGFuIGFuaW1hdGlvbi4gTm90ZSB0aGF0IHRoaXMgd2lsbCBub3QgYWN0dWFsbHkgY2xvc2UgYW5cbiAgICAgICAgICogYWN0aXZlbHkgcnVubmluZyBhbmltYXRpb24gKHNlZSB7QGxpbmsgbmdNb2NrLiRhbmltYXRlI2Nsb3NlQW5kRmx1c2ggYGNsb3NlQW5kRmx1c2goKWB9IGZvciB0aGF0KS5cbiAgICAgICAgICovXG4gICAgICAgIGZsdXNoOiBmdW5jdGlvbihoaWRlRXJyb3JzKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XG5cbiAgICAgICAgICB2YXIgZG9OZXh0UnVuLCBzb21ldGhpbmdGbHVzaGVkID0gZmFsc2U7XG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgZG9OZXh0UnVuID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICgkJHJBRi5xdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgJCRyQUYuZmx1c2goKTtcbiAgICAgICAgICAgICAgZG9OZXh0UnVuID0gc29tZXRoaW5nRmx1c2hlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkJGFuaW1hdGVBc3luY1J1bi5mbHVzaCgpKSB7XG4gICAgICAgICAgICAgIGRvTmV4dFJ1biA9IHNvbWV0aGluZ0ZsdXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gd2hpbGUgKGRvTmV4dFJ1bik7XG5cbiAgICAgICAgICBpZiAoIXNvbWV0aGluZ0ZsdXNoZWQgJiYgIWhpZGVFcnJvcnMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcGVuZGluZyBhbmltYXRpb25zIHJlYWR5IHRvIGJlIGNsb3NlZCBvciBmbHVzaGVkJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJHJvb3RTY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChcbiAgICAgICAgWydhbmltYXRlJywnZW50ZXInLCdsZWF2ZScsJ21vdmUnLCdhZGRDbGFzcycsJ3JlbW92ZUNsYXNzJywnc2V0Q2xhc3MnXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIGFuaW1hdGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFuaW1hdGUucXVldWUucHVzaCh7XG4gICAgICAgICAgICBldmVudDogbWV0aG9kLFxuICAgICAgICAgICAgZWxlbWVudDogYXJndW1lbnRzWzBdLFxuICAgICAgICAgICAgb3B0aW9uczogYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3VtZW50c1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiAkZGVsZWdhdGVbbWV0aG9kXS5hcHBseSgkZGVsZWdhdGUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGFuaW1hdGU7XG4gICAgfV0pO1xuXG4gIH1dKTtcblxuXG4vKipcbiAqIEBuZ2RvYyBmdW5jdGlvblxuICogQG5hbWUgYW5ndWxhci5tb2NrLmR1bXBcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqICpOT1RFKjogdGhpcyBpcyBub3QgYW4gaW5qZWN0YWJsZSBpbnN0YW5jZSwganVzdCBhIGdsb2JhbGx5IGF2YWlsYWJsZSBmdW5jdGlvbi5cbiAqXG4gKiBNZXRob2QgZm9yIHNlcmlhbGl6aW5nIGNvbW1vbiBhbmd1bGFyIG9iamVjdHMgKHNjb3BlLCBlbGVtZW50cywgZXRjLi4pIGludG8gc3RyaW5ncywgdXNlZnVsIGZvclxuICogZGVidWdnaW5nLlxuICpcbiAqIFRoaXMgbWV0aG9kIGlzIGFsc28gYXZhaWxhYmxlIG9uIHdpbmRvdywgd2hlcmUgaXQgY2FuIGJlIHVzZWQgdG8gZGlzcGxheSBvYmplY3RzIG9uIGRlYnVnXG4gKiBjb25zb2xlLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IC0gYW55IG9iamVjdCB0byB0dXJuIGludG8gc3RyaW5nLlxuICogQHJldHVybiB7c3RyaW5nfSBhIHNlcmlhbGl6ZWQgc3RyaW5nIG9mIHRoZSBhcmd1bWVudFxuICovXG5hbmd1bGFyLm1vY2suZHVtcCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gc2VyaWFsaXplKG9iamVjdCk7XG5cbiAgZnVuY3Rpb24gc2VyaWFsaXplKG9iamVjdCkge1xuICAgIHZhciBvdXQ7XG5cbiAgICBpZiAoYW5ndWxhci5pc0VsZW1lbnQob2JqZWN0KSkge1xuICAgICAgb2JqZWN0ID0gYW5ndWxhci5lbGVtZW50KG9iamVjdCk7XG4gICAgICBvdXQgPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXY+PC9kaXY+Jyk7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob2JqZWN0LCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIG91dC5hcHBlbmQoYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLmNsb25lKCkpO1xuICAgICAgfSk7XG4gICAgICBvdXQgPSBvdXQuaHRtbCgpO1xuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIG91dCA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKG9iamVjdCwgZnVuY3Rpb24obykge1xuICAgICAgICBvdXQucHVzaChzZXJpYWxpemUobykpO1xuICAgICAgfSk7XG4gICAgICBvdXQgPSAnWyAnICsgb3V0LmpvaW4oJywgJykgKyAnIF0nO1xuICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKG9iamVjdC4kZXZhbCkgJiYgYW5ndWxhci5pc0Z1bmN0aW9uKG9iamVjdC4kYXBwbHkpKSB7XG4gICAgICAgIG91dCA9IHNlcmlhbGl6ZVNjb3BlKG9iamVjdCk7XG4gICAgICB9IGVsc2UgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG91dCA9IG9iamVjdC5zdGFjayB8fCAoJycgKyBvYmplY3QubmFtZSArICc6ICcgKyBvYmplY3QubWVzc2FnZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPKGkpOiB0aGlzIHByZXZlbnRzIG1ldGhvZHMgYmVpbmcgbG9nZ2VkLFxuICAgICAgICAvLyB3ZSBzaG91bGQgaGF2ZSBhIGJldHRlciB3YXkgdG8gc2VyaWFsaXplIG9iamVjdHNcbiAgICAgICAgb3V0ID0gYW5ndWxhci50b0pzb24ob2JqZWN0LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ID0gU3RyaW5nKG9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZVNjb3BlKHNjb3BlLCBvZmZzZXQpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgICcgICc7XG4gICAgdmFyIGxvZyA9IFtvZmZzZXQgKyAnU2NvcGUoJyArIHNjb3BlLiRpZCArICcpOiB7J107XG4gICAgZm9yICh2YXIga2V5IGluIHNjb3BlKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNjb3BlLCBrZXkpICYmICFrZXkubWF0Y2goL14oXFwkfHRoaXMpLykpIHtcbiAgICAgICAgbG9nLnB1c2goJyAgJyArIGtleSArICc6ICcgKyBhbmd1bGFyLnRvSnNvbihzY29wZVtrZXldKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBjaGlsZCA9IHNjb3BlLiQkY2hpbGRIZWFkO1xuICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgbG9nLnB1c2goc2VyaWFsaXplU2NvcGUoY2hpbGQsIG9mZnNldCArICcgICcpKTtcbiAgICAgIGNoaWxkID0gY2hpbGQuJCRuZXh0U2libGluZztcbiAgICB9XG4gICAgbG9nLnB1c2goJ30nKTtcbiAgICByZXR1cm4gbG9nLmpvaW4oJ1xcbicgKyBvZmZzZXQpO1xuICB9XG59O1xuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmRcbiAqIEBkZXNjcmlwdGlvblxuICogRmFrZSBIVFRQIGJhY2tlbmQgaW1wbGVtZW50YXRpb24gc3VpdGFibGUgZm9yIHVuaXQgdGVzdGluZyBhcHBsaWNhdGlvbnMgdGhhdCB1c2UgdGhlXG4gKiB7QGxpbmsgbmcuJGh0dHAgJGh0dHAgc2VydmljZX0uXG4gKlxuICogKk5vdGUqOiBGb3IgZmFrZSBIVFRQIGJhY2tlbmQgaW1wbGVtZW50YXRpb24gc3VpdGFibGUgZm9yIGVuZC10by1lbmQgdGVzdGluZyBvciBiYWNrZW5kLWxlc3NcbiAqIGRldmVsb3BtZW50IHBsZWFzZSBzZWUge0BsaW5rIG5nTW9ja0UyRS4kaHR0cEJhY2tlbmQgZTJlICRodHRwQmFja2VuZCBtb2NrfS5cbiAqXG4gKiBEdXJpbmcgdW5pdCB0ZXN0aW5nLCB3ZSB3YW50IG91ciB1bml0IHRlc3RzIHRvIHJ1biBxdWlja2x5IGFuZCBoYXZlIG5vIGV4dGVybmFsIGRlcGVuZGVuY2llcyBzb1xuICogd2UgZG9u4oCZdCB3YW50IHRvIHNlbmQgW1hIUl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4veG1saHR0cHJlcXVlc3QpIG9yXG4gKiBbSlNPTlBdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSlNPTlApIHJlcXVlc3RzIHRvIGEgcmVhbCBzZXJ2ZXIuIEFsbCB3ZSByZWFsbHkgbmVlZCBpc1xuICogdG8gdmVyaWZ5IHdoZXRoZXIgYSBjZXJ0YWluIHJlcXVlc3QgaGFzIGJlZW4gc2VudCBvciBub3QsIG9yIGFsdGVybmF0aXZlbHkganVzdCBsZXQgdGhlXG4gKiBhcHBsaWNhdGlvbiBtYWtlIHJlcXVlc3RzLCByZXNwb25kIHdpdGggcHJlLXRyYWluZWQgcmVzcG9uc2VzIGFuZCBhc3NlcnQgdGhhdCB0aGUgZW5kIHJlc3VsdCBpc1xuICogd2hhdCB3ZSBleHBlY3QgaXQgdG8gYmUuXG4gKlxuICogVGhpcyBtb2NrIGltcGxlbWVudGF0aW9uIGNhbiBiZSB1c2VkIHRvIHJlc3BvbmQgd2l0aCBzdGF0aWMgb3IgZHluYW1pYyByZXNwb25zZXMgdmlhIHRoZVxuICogYGV4cGVjdGAgYW5kIGB3aGVuYCBhcGlzIGFuZCB0aGVpciBzaG9ydGN1dHMgKGBleHBlY3RHRVRgLCBgd2hlblBPU1RgLCBldGMpLlxuICpcbiAqIFdoZW4gYW4gQW5ndWxhciBhcHBsaWNhdGlvbiBuZWVkcyBzb21lIGRhdGEgZnJvbSBhIHNlcnZlciwgaXQgY2FsbHMgdGhlICRodHRwIHNlcnZpY2UsIHdoaWNoXG4gKiBzZW5kcyB0aGUgcmVxdWVzdCB0byBhIHJlYWwgc2VydmVyIHVzaW5nICRodHRwQmFja2VuZCBzZXJ2aWNlLiBXaXRoIGRlcGVuZGVuY3kgaW5qZWN0aW9uLCBpdCBpc1xuICogZWFzeSB0byBpbmplY3QgJGh0dHBCYWNrZW5kIG1vY2sgKHdoaWNoIGhhcyB0aGUgc2FtZSBBUEkgYXMgJGh0dHBCYWNrZW5kKSBhbmQgdXNlIGl0IHRvIHZlcmlmeVxuICogdGhlIHJlcXVlc3RzIGFuZCByZXNwb25kIHdpdGggc29tZSB0ZXN0aW5nIGRhdGEgd2l0aG91dCBzZW5kaW5nIGEgcmVxdWVzdCB0byBhIHJlYWwgc2VydmVyLlxuICpcbiAqIFRoZXJlIGFyZSB0d28gd2F5cyB0byBzcGVjaWZ5IHdoYXQgdGVzdCBkYXRhIHNob3VsZCBiZSByZXR1cm5lZCBhcyBodHRwIHJlc3BvbnNlcyBieSB0aGUgbW9ja1xuICogYmFja2VuZCB3aGVuIHRoZSBjb2RlIHVuZGVyIHRlc3QgbWFrZXMgaHR0cCByZXF1ZXN0czpcbiAqXG4gKiAtIGAkaHR0cEJhY2tlbmQuZXhwZWN0YCAtIHNwZWNpZmllcyBhIHJlcXVlc3QgZXhwZWN0YXRpb25cbiAqIC0gYCRodHRwQmFja2VuZC53aGVuYCAtIHNwZWNpZmllcyBhIGJhY2tlbmQgZGVmaW5pdGlvblxuICpcbiAqXG4gKiAjIyBSZXF1ZXN0IEV4cGVjdGF0aW9ucyB2cyBCYWNrZW5kIERlZmluaXRpb25zXG4gKlxuICogUmVxdWVzdCBleHBlY3RhdGlvbnMgcHJvdmlkZSBhIHdheSB0byBtYWtlIGFzc2VydGlvbnMgYWJvdXQgcmVxdWVzdHMgbWFkZSBieSB0aGUgYXBwbGljYXRpb24gYW5kXG4gKiB0byBkZWZpbmUgcmVzcG9uc2VzIGZvciB0aG9zZSByZXF1ZXN0cy4gVGhlIHRlc3Qgd2lsbCBmYWlsIGlmIHRoZSBleHBlY3RlZCByZXF1ZXN0cyBhcmUgbm90IG1hZGVcbiAqIG9yIHRoZXkgYXJlIG1hZGUgaW4gdGhlIHdyb25nIG9yZGVyLlxuICpcbiAqIEJhY2tlbmQgZGVmaW5pdGlvbnMgYWxsb3cgeW91IHRvIGRlZmluZSBhIGZha2UgYmFja2VuZCBmb3IgeW91ciBhcHBsaWNhdGlvbiB3aGljaCBkb2Vzbid0IGFzc2VydFxuICogaWYgYSBwYXJ0aWN1bGFyIHJlcXVlc3Qgd2FzIG1hZGUgb3Igbm90LCBpdCBqdXN0IHJldHVybnMgYSB0cmFpbmVkIHJlc3BvbnNlIGlmIGEgcmVxdWVzdCBpcyBtYWRlLlxuICogVGhlIHRlc3Qgd2lsbCBwYXNzIHdoZXRoZXIgb3Igbm90IHRoZSByZXF1ZXN0IGdldHMgbWFkZSBkdXJpbmcgdGVzdGluZy5cbiAqXG4gKlxuICogPHRhYmxlIGNsYXNzPVwidGFibGVcIj5cbiAqICAgPHRyPjx0aCB3aWR0aD1cIjIyMHB4XCI+PC90aD48dGg+UmVxdWVzdCBleHBlY3RhdGlvbnM8L3RoPjx0aD5CYWNrZW5kIGRlZmluaXRpb25zPC90aD48L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRoPlN5bnRheDwvdGg+XG4gKiAgICAgPHRkPi5leHBlY3QoLi4uKS5yZXNwb25kKC4uLik8L3RkPlxuICogICAgIDx0ZD4ud2hlbiguLi4pLnJlc3BvbmQoLi4uKTwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGg+VHlwaWNhbCB1c2FnZTwvdGg+XG4gKiAgICAgPHRkPnN0cmljdCB1bml0IHRlc3RzPC90ZD5cbiAqICAgICA8dGQ+bG9vc2UgKGJsYWNrLWJveCkgdW5pdCB0ZXN0aW5nPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0aD5GdWxmaWxscyBtdWx0aXBsZSByZXF1ZXN0czwvdGg+XG4gKiAgICAgPHRkPk5PPC90ZD5cbiAqICAgICA8dGQ+WUVTPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0aD5PcmRlciBvZiByZXF1ZXN0cyBtYXR0ZXJzPC90aD5cbiAqICAgICA8dGQ+WUVTPC90ZD5cbiAqICAgICA8dGQ+Tk88L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRoPlJlcXVlc3QgcmVxdWlyZWQ8L3RoPlxuICogICAgIDx0ZD5ZRVM8L3RkPlxuICogICAgIDx0ZD5OTzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGg+UmVzcG9uc2UgcmVxdWlyZWQ8L3RoPlxuICogICAgIDx0ZD5vcHRpb25hbCAoc2VlIGJlbG93KTwvdGQ+XG4gKiAgICAgPHRkPllFUzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiA8L3RhYmxlPlxuICpcbiAqIEluIGNhc2VzIHdoZXJlIGJvdGggYmFja2VuZCBkZWZpbml0aW9ucyBhbmQgcmVxdWVzdCBleHBlY3RhdGlvbnMgYXJlIHNwZWNpZmllZCBkdXJpbmcgdW5pdFxuICogdGVzdGluZywgdGhlIHJlcXVlc3QgZXhwZWN0YXRpb25zIGFyZSBldmFsdWF0ZWQgZmlyc3QuXG4gKlxuICogSWYgYSByZXF1ZXN0IGV4cGVjdGF0aW9uIGhhcyBubyByZXNwb25zZSBzcGVjaWZpZWQsIHRoZSBhbGdvcml0aG0gd2lsbCBzZWFyY2ggeW91ciBiYWNrZW5kXG4gKiBkZWZpbml0aW9ucyBmb3IgYW4gYXBwcm9wcmlhdGUgcmVzcG9uc2UuXG4gKlxuICogSWYgYSByZXF1ZXN0IGRpZG4ndCBtYXRjaCBhbnkgZXhwZWN0YXRpb24gb3IgaWYgdGhlIGV4cGVjdGF0aW9uIGRvZXNuJ3QgaGF2ZSB0aGUgcmVzcG9uc2VcbiAqIGRlZmluZWQsIHRoZSBiYWNrZW5kIGRlZmluaXRpb25zIGFyZSBldmFsdWF0ZWQgaW4gc2VxdWVudGlhbCBvcmRlciB0byBzZWUgaWYgYW55IG9mIHRoZW0gbWF0Y2hcbiAqIHRoZSByZXF1ZXN0LiBUaGUgcmVzcG9uc2UgZnJvbSB0aGUgZmlyc3QgbWF0Y2hlZCBkZWZpbml0aW9uIGlzIHJldHVybmVkLlxuICpcbiAqXG4gKiAjIyBGbHVzaGluZyBIVFRQIHJlcXVlc3RzXG4gKlxuICogVGhlICRodHRwQmFja2VuZCB1c2VkIGluIHByb2R1Y3Rpb24gYWx3YXlzIHJlc3BvbmRzIHRvIHJlcXVlc3RzIGFzeW5jaHJvbm91c2x5LiBJZiB3ZSBwcmVzZXJ2ZWRcbiAqIHRoaXMgYmVoYXZpb3IgaW4gdW5pdCB0ZXN0aW5nLCB3ZSdkIGhhdmUgdG8gY3JlYXRlIGFzeW5jIHVuaXQgdGVzdHMsIHdoaWNoIGFyZSBoYXJkIHRvIHdyaXRlLFxuICogdG8gZm9sbG93IGFuZCB0byBtYWludGFpbi4gQnV0IG5laXRoZXIgY2FuIHRoZSB0ZXN0aW5nIG1vY2sgcmVzcG9uZCBzeW5jaHJvbm91c2x5OyB0aGF0IHdvdWxkXG4gKiBjaGFuZ2UgdGhlIGV4ZWN1dGlvbiBvZiB0aGUgY29kZSB1bmRlciB0ZXN0LiBGb3IgdGhpcyByZWFzb24sIHRoZSBtb2NrICRodHRwQmFja2VuZCBoYXMgYVxuICogYGZsdXNoKClgIG1ldGhvZCwgd2hpY2ggYWxsb3dzIHRoZSB0ZXN0IHRvIGV4cGxpY2l0bHkgZmx1c2ggcGVuZGluZyByZXF1ZXN0cy4gVGhpcyBwcmVzZXJ2ZXNcbiAqIHRoZSBhc3luYyBhcGkgb2YgdGhlIGJhY2tlbmQsIHdoaWxlIGFsbG93aW5nIHRoZSB0ZXN0IHRvIGV4ZWN1dGUgc3luY2hyb25vdXNseS5cbiAqXG4gKlxuICogIyMgVW5pdCB0ZXN0aW5nIHdpdGggbW9jayAkaHR0cEJhY2tlbmRcbiAqIFRoZSBmb2xsb3dpbmcgY29kZSBzaG93cyBob3cgdG8gc2V0dXAgYW5kIHVzZSB0aGUgbW9jayBiYWNrZW5kIHdoZW4gdW5pdCB0ZXN0aW5nIGEgY29udHJvbGxlci5cbiAqIEZpcnN0IHdlIGNyZWF0ZSB0aGUgY29udHJvbGxlciB1bmRlciB0ZXN0OlxuICpcbiAgYGBganNcbiAgLy8gVGhlIG1vZHVsZSBjb2RlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdNeUFwcCcsIFtdKVxuICAgIC5jb250cm9sbGVyKCdNeUNvbnRyb2xsZXInLCBNeUNvbnRyb2xsZXIpO1xuXG4gIC8vIFRoZSBjb250cm9sbGVyIGNvZGVcbiAgZnVuY3Rpb24gTXlDb250cm9sbGVyKCRzY29wZSwgJGh0dHApIHtcbiAgICB2YXIgYXV0aFRva2VuO1xuXG4gICAgJGh0dHAuZ2V0KCcvYXV0aC5weScpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGF1dGhUb2tlbiA9IHJlc3BvbnNlLmhlYWRlcnMoJ0EtVG9rZW4nKTtcbiAgICAgICRzY29wZS51c2VyID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zYXZlTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIHZhciBoZWFkZXJzID0geyAnQXV0aG9yaXphdGlvbic6IGF1dGhUb2tlbiB9O1xuICAgICAgJHNjb3BlLnN0YXR1cyA9ICdTYXZpbmcuLi4nO1xuXG4gICAgICAkaHR0cC5wb3N0KCcvYWRkLW1zZy5weScsIG1lc3NhZ2UsIHsgaGVhZGVyczogaGVhZGVycyB9ICkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuc3RhdHVzID0gJyc7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnN0YXR1cyA9ICdGYWlsZWQuLi4nO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuICBgYGBcbiAqXG4gKiBOb3cgd2Ugc2V0dXAgdGhlIG1vY2sgYmFja2VuZCBhbmQgY3JlYXRlIHRoZSB0ZXN0IHNwZWNzOlxuICpcbiAgYGBganNcbiAgICAvLyB0ZXN0aW5nIGNvbnRyb2xsZXJcbiAgICBkZXNjcmliZSgnTXlDb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgdmFyICRodHRwQmFja2VuZCwgJHJvb3RTY29wZSwgY3JlYXRlQ29udHJvbGxlciwgYXV0aFJlcXVlc3RIYW5kbGVyO1xuXG4gICAgICAgLy8gU2V0IHVwIHRoZSBtb2R1bGVcbiAgICAgICBiZWZvcmVFYWNoKG1vZHVsZSgnTXlBcHAnKSk7XG5cbiAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbigkaW5qZWN0b3IpIHtcbiAgICAgICAgIC8vIFNldCB1cCB0aGUgbW9jayBodHRwIHNlcnZpY2UgcmVzcG9uc2VzXG4gICAgICAgICAkaHR0cEJhY2tlbmQgPSAkaW5qZWN0b3IuZ2V0KCckaHR0cEJhY2tlbmQnKTtcbiAgICAgICAgIC8vIGJhY2tlbmQgZGVmaW5pdGlvbiBjb21tb24gZm9yIGFsbCB0ZXN0c1xuICAgICAgICAgYXV0aFJlcXVlc3RIYW5kbGVyID0gJGh0dHBCYWNrZW5kLndoZW4oJ0dFVCcsICcvYXV0aC5weScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXNwb25kKHt1c2VySWQ6ICd1c2VyWCd9LCB7J0EtVG9rZW4nOiAneHh4J30pO1xuXG4gICAgICAgICAvLyBHZXQgaG9sZCBvZiBhIHNjb3BlIChpLmUuIHRoZSByb290IHNjb3BlKVxuICAgICAgICAgJHJvb3RTY29wZSA9ICRpbmplY3Rvci5nZXQoJyRyb290U2NvcGUnKTtcbiAgICAgICAgIC8vIFRoZSAkY29udHJvbGxlciBzZXJ2aWNlIGlzIHVzZWQgdG8gY3JlYXRlIGluc3RhbmNlcyBvZiBjb250cm9sbGVyc1xuICAgICAgICAgdmFyICRjb250cm9sbGVyID0gJGluamVjdG9yLmdldCgnJGNvbnRyb2xsZXInKTtcblxuICAgICAgICAgY3JlYXRlQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICByZXR1cm4gJGNvbnRyb2xsZXIoJ015Q29udHJvbGxlcicsIHsnJHNjb3BlJyA6ICRyb290U2NvcGUgfSk7XG4gICAgICAgICB9O1xuICAgICAgIH0pKTtcblxuXG4gICAgICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvbigpO1xuICAgICAgICAgJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0KCk7XG4gICAgICAgfSk7XG5cblxuICAgICAgIGl0KCdzaG91bGQgZmV0Y2ggYXV0aGVudGljYXRpb24gdG9rZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICRodHRwQmFja2VuZC5leHBlY3RHRVQoJy9hdXRoLnB5Jyk7XG4gICAgICAgICB2YXIgY29udHJvbGxlciA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgIH0pO1xuXG5cbiAgICAgICBpdCgnc2hvdWxkIGZhaWwgYXV0aGVudGljYXRpb24nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgLy8gTm90aWNlIGhvdyB5b3UgY2FuIGNoYW5nZSB0aGUgcmVzcG9uc2UgZXZlbiBhZnRlciBpdCB3YXMgc2V0XG4gICAgICAgICBhdXRoUmVxdWVzdEhhbmRsZXIucmVzcG9uZCg0MDEsICcnKTtcblxuICAgICAgICAgJGh0dHBCYWNrZW5kLmV4cGVjdEdFVCgnL2F1dGgucHknKTtcbiAgICAgICAgIHZhciBjb250cm9sbGVyID0gY3JlYXRlQ29udHJvbGxlcigpO1xuICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgICBleHBlY3QoJHJvb3RTY29wZS5zdGF0dXMpLnRvQmUoJ0ZhaWxlZC4uLicpO1xuICAgICAgIH0pO1xuXG5cbiAgICAgICBpdCgnc2hvdWxkIHNlbmQgbXNnIHRvIHNlcnZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBjcmVhdGVDb250cm9sbGVyKCk7XG4gICAgICAgICAkaHR0cEJhY2tlbmQuZmx1c2goKTtcblxuICAgICAgICAgLy8gbm93IHlvdSBkb27igJl0IGNhcmUgYWJvdXQgdGhlIGF1dGhlbnRpY2F0aW9uLCBidXRcbiAgICAgICAgIC8vIHRoZSBjb250cm9sbGVyIHdpbGwgc3RpbGwgc2VuZCB0aGUgcmVxdWVzdCBhbmRcbiAgICAgICAgIC8vICRodHRwQmFja2VuZCB3aWxsIHJlc3BvbmQgd2l0aG91dCB5b3UgaGF2aW5nIHRvXG4gICAgICAgICAvLyBzcGVjaWZ5IHRoZSBleHBlY3RhdGlvbiBhbmQgcmVzcG9uc2UgZm9yIHRoaXMgcmVxdWVzdFxuXG4gICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0UE9TVCgnL2FkZC1tc2cucHknLCAnbWVzc2FnZSBjb250ZW50JykucmVzcG9uZCgyMDEsICcnKTtcbiAgICAgICAgICRyb290U2NvcGUuc2F2ZU1lc3NhZ2UoJ21lc3NhZ2UgY29udGVudCcpO1xuICAgICAgICAgZXhwZWN0KCRyb290U2NvcGUuc3RhdHVzKS50b0JlKCdTYXZpbmcuLi4nKTtcbiAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuICAgICAgICAgZXhwZWN0KCRyb290U2NvcGUuc3RhdHVzKS50b0JlKCcnKTtcbiAgICAgICB9KTtcblxuXG4gICAgICAgaXQoJ3Nob3VsZCBzZW5kIGF1dGggaGVhZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICB2YXIgY29udHJvbGxlciA9IGNyZWF0ZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICRodHRwQmFja2VuZC5mbHVzaCgpO1xuXG4gICAgICAgICAkaHR0cEJhY2tlbmQuZXhwZWN0UE9TVCgnL2FkZC1tc2cucHknLCB1bmRlZmluZWQsIGZ1bmN0aW9uKGhlYWRlcnMpIHtcbiAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGhlYWRlciB3YXMgc2VudCwgaWYgaXQgd2Fzbid0IHRoZSBleHBlY3RhdGlvbiB3b24ndFxuICAgICAgICAgICAvLyBtYXRjaCB0aGUgcmVxdWVzdCBhbmQgdGhlIHRlc3Qgd2lsbCBmYWlsXG4gICAgICAgICAgIHJldHVybiBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPT0gJ3h4eCc7XG4gICAgICAgICB9KS5yZXNwb25kKDIwMSwgJycpO1xuXG4gICAgICAgICAkcm9vdFNjb3BlLnNhdmVNZXNzYWdlKCd3aGF0ZXZlcicpO1xuICAgICAgICAgJGh0dHBCYWNrZW5kLmZsdXNoKCk7XG4gICAgICAgfSk7XG4gICAgfSk7XG4gIGBgYFxuICpcbiAqICMjIER5bmFtaWMgcmVzcG9uc2VzXG4gKlxuICogWW91IGRlZmluZSBhIHJlc3BvbnNlIHRvIGEgcmVxdWVzdCBieSBjaGFpbmluZyBhIGNhbGwgdG8gYHJlc3BvbmQoKWAgb250byBhIGRlZmluaXRpb24gb3IgZXhwZWN0YXRpb24uXG4gKiBJZiB5b3UgcHJvdmlkZSBhICoqY2FsbGJhY2sqKiBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyIHRvIGByZXNwb25kKGNhbGxiYWNrKWAgdGhlbiB5b3UgY2FuIGR5bmFtaWNhbGx5IGdlbmVyYXRlXG4gKiBhIHJlc3BvbnNlIGJhc2VkIG9uIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSByZXF1ZXN0LlxuICpcbiAqIFRoZSBgY2FsbGJhY2tgIGZ1bmN0aW9uIHNob3VsZCBiZSBvZiB0aGUgZm9ybSBgZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMsIHBhcmFtcylgLlxuICpcbiAqICMjIyBRdWVyeSBwYXJhbWV0ZXJzXG4gKlxuICogQnkgZGVmYXVsdCwgcXVlcnkgcGFyYW1ldGVycyBvbiByZXF1ZXN0IFVSTHMgYXJlIHBhcnNlZCBpbnRvIHRoZSBgcGFyYW1zYCBvYmplY3QuIFNvIGEgcmVxdWVzdCBVUkxcbiAqIG9mIGAvbGlzdD9xPXNlYXJjaHN0ciZvcmRlcmJ5PS1uYW1lYCB3b3VsZCBzZXQgYHBhcmFtc2AgdG8gYmUgYHtxOiAnc2VhcmNoc3RyJywgb3JkZXJieTogJy1uYW1lJ31gLlxuICpcbiAqICMjIyBSZWdleCBwYXJhbWV0ZXIgbWF0Y2hpbmdcbiAqXG4gKiBJZiBhbiBleHBlY3RhdGlvbiBvciBkZWZpbml0aW9uIHVzZXMgYSAqKnJlZ2V4KiogdG8gbWF0Y2ggdGhlIFVSTCwgeW91IGNhbiBwcm92aWRlIGFuIGFycmF5IG9mICoqa2V5cyoqIHZpYSBhXG4gKiBgcGFyYW1zYCBhcmd1bWVudC4gVGhlIGluZGV4IG9mIGVhY2ggKiprZXkqKiBpbiB0aGUgYXJyYXkgd2lsbCBtYXRjaCB0aGUgaW5kZXggb2YgYSAqKmdyb3VwKiogaW4gdGhlXG4gKiAqKnJlZ2V4KiouXG4gKlxuICogVGhlIGBwYXJhbXNgIG9iamVjdCBpbiB0aGUgKipjYWxsYmFjayoqIHdpbGwgbm93IGhhdmUgcHJvcGVydGllcyB3aXRoIHRoZXNlIGtleXMsIHdoaWNoIGhvbGQgdGhlIHZhbHVlIG9mIHRoZVxuICogY29ycmVzcG9uZGluZyAqKmdyb3VwKiogaW4gdGhlICoqcmVnZXgqKi5cbiAqXG4gKiBUaGlzIGFsc28gYXBwbGllcyB0byB0aGUgYHdoZW5gIGFuZCBgZXhwZWN0YCBzaG9ydGN1dCBtZXRob2RzLlxuICpcbiAqXG4gKiBgYGBqc1xuICogICAkaHR0cEJhY2tlbmQuZXhwZWN0KCdHRVQnLCAvXFwvdXNlclxcLyguKykvLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgWydpZCddKVxuICogICAgIC5yZXNwb25kKGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzLCBwYXJhbXMpIHtcbiAqICAgICAgIC8vIGZvciByZXF1ZXN0ZWQgdXJsIG9mICcvdXNlci8xMjM0JyBwYXJhbXMgaXMge2lkOiAnMTIzNCd9XG4gKiAgICAgfSk7XG4gKlxuICogICAkaHR0cEJhY2tlbmQud2hlblBBVENIKC9cXC91c2VyXFwvKC4rKVxcL2FydGljbGVcXC8oLispLywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFsndXNlcicsICdhcnRpY2xlJ10pXG4gKiAgICAgLnJlc3BvbmQoZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMsIHBhcmFtcykge1xuICogICAgICAgLy8gZm9yIHVybCBvZiAnL3VzZXIvMTIzNC9hcnRpY2xlLzU2NycgcGFyYW1zIGlzIHt1c2VyOiAnMTIzNCcsIGFydGljbGU6ICc1NjcnfVxuICogICAgIH0pO1xuICogYGBgXG4gKlxuICogIyMgTWF0Y2hpbmcgcm91dGUgcmVxdWVzdHNcbiAqXG4gKiBGb3IgZXh0cmEgY29udmVuaWVuY2UsIGB3aGVuUm91dGVgIGFuZCBgZXhwZWN0Um91dGVgIHNob3J0Y3V0cyBhcmUgYXZhaWxhYmxlLiBUaGVzZSBtZXRob2RzIG9mZmVyIGNvbG9uXG4gKiBkZWxpbWl0ZWQgbWF0Y2hpbmcgb2YgdGhlIHVybCBwYXRoLCBpZ25vcmluZyB0aGUgcXVlcnkgc3RyaW5nLiBUaGlzIGFsbG93cyBkZWNsYXJhdGlvbnNcbiAqIHNpbWlsYXIgdG8gaG93IGFwcGxpY2F0aW9uIHJvdXRlcyBhcmUgY29uZmlndXJlZCB3aXRoIGAkcm91dGVQcm92aWRlcmAuIEJlY2F1c2UgdGhlc2UgbWV0aG9kcyBjb252ZXJ0XG4gKiB0aGUgZGVmaW5pdGlvbiB1cmwgdG8gcmVnZXgsIGRlY2xhcmF0aW9uIG9yZGVyIGlzIGltcG9ydGFudC4gQ29tYmluZWQgd2l0aCBxdWVyeSBwYXJhbWV0ZXIgcGFyc2luZyxcbiAqIHRoZSBmb2xsb3dpbmcgaXMgcG9zc2libGU6XG4gKlxuICBgYGBqc1xuICAgICRodHRwQmFja2VuZC53aGVuUm91dGUoJ0dFVCcsICcvdXNlcnMvOmlkJylcbiAgICAgIC5yZXNwb25kKGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzLCBwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIFsyMDAsIE1vY2tVc2VyTGlzdFtOdW1iZXIocGFyYW1zLmlkKV1dO1xuICAgICAgfSk7XG5cbiAgICAkaHR0cEJhY2tlbmQud2hlblJvdXRlKCdHRVQnLCAnL3VzZXJzJylcbiAgICAgIC5yZXNwb25kKGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzLCBwYXJhbXMpIHtcbiAgICAgICAgdmFyIHVzZXJMaXN0ID0gYW5ndWxhci5jb3B5KE1vY2tVc2VyTGlzdCksXG4gICAgICAgICAgZGVmYXVsdFNvcnQgPSAnbGFzdE5hbWUnLFxuICAgICAgICAgIGNvdW50LCBwYWdlcywgaXNQcmV2aW91cywgaXNOZXh0O1xuXG4gICAgICAgIC8vIHBhZ2VkIGFwaSByZXNwb25zZSAnL3YxL3VzZXJzP3BhZ2U9MidcbiAgICAgICAgcGFyYW1zLnBhZ2UgPSBOdW1iZXIocGFyYW1zLnBhZ2UpIHx8IDE7XG5cbiAgICAgICAgLy8gcXVlcnkgZm9yIGxhc3QgbmFtZXMgJy92MS91c2Vycz9xPUFyY2hlcidcbiAgICAgICAgaWYgKHBhcmFtcy5xKSB7XG4gICAgICAgICAgdXNlckxpc3QgPSAkZmlsdGVyKCdmaWx0ZXInKSh7bGFzdE5hbWU6IHBhcmFtcy5xfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdlcyA9IE1hdGguY2VpbCh1c2VyTGlzdC5sZW5ndGggLyBwYWdpbmdMZW5ndGgpO1xuICAgICAgICBpc1ByZXZpb3VzID0gcGFyYW1zLnBhZ2UgPiAxO1xuICAgICAgICBpc05leHQgPSBwYXJhbXMucGFnZSA8IHBhZ2VzO1xuXG4gICAgICAgIHJldHVybiBbMjAwLCB7XG4gICAgICAgICAgY291bnQ6ICAgIHVzZXJMaXN0Lmxlbmd0aCxcbiAgICAgICAgICBwcmV2aW91czogaXNQcmV2aW91cyxcbiAgICAgICAgICBuZXh0OiAgICAgaXNOZXh0LFxuICAgICAgICAgIC8vIHNvcnQgZmllbGQgLT4gJy92MS91c2Vycz9zb3J0Qnk9Zmlyc3ROYW1lJ1xuICAgICAgICAgIHJlc3VsdHM6ICAkZmlsdGVyKCdvcmRlckJ5JykodXNlckxpc3QsIHBhcmFtcy5zb3J0QnkgfHwgZGVmYXVsdFNvcnQpXG4gICAgICAgICAgICAgICAgICAgICAgLnNwbGljZSgocGFyYW1zLnBhZ2UgLSAxKSAqIHBhZ2luZ0xlbmd0aCwgcGFnaW5nTGVuZ3RoKVxuICAgICAgICB9XTtcbiAgICAgIH0pO1xuICBgYGBcbiAqL1xuYW5ndWxhci5tb2NrLiRIdHRwQmFja2VuZFByb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuJGdldCA9IFsnJHJvb3RTY29wZScsICckdGltZW91dCcsIGNyZWF0ZUh0dHBCYWNrZW5kTW9ja107XG59O1xuXG4vKipcbiAqIEdlbmVyYWwgZmFjdG9yeSBmdW5jdGlvbiBmb3IgJGh0dHBCYWNrZW5kIG1vY2suXG4gKiBSZXR1cm5zIGluc3RhbmNlIGZvciB1bml0IHRlc3RpbmcgKHdoZW4gbm8gYXJndW1lbnRzIHNwZWNpZmllZCk6XG4gKiAgIC0gcGFzc2luZyB0aHJvdWdoIGlzIGRpc2FibGVkXG4gKiAgIC0gYXV0byBmbHVzaGluZyBpcyBkaXNhYmxlZFxuICpcbiAqIFJldHVybnMgaW5zdGFuY2UgZm9yIGUyZSB0ZXN0aW5nICh3aGVuIGAkZGVsZWdhdGVgIGFuZCBgJGJyb3dzZXJgIHNwZWNpZmllZCk6XG4gKiAgIC0gcGFzc2luZyB0aHJvdWdoIChkZWxlZ2F0aW5nIHJlcXVlc3QgdG8gcmVhbCBiYWNrZW5kKSBpcyBlbmFibGVkXG4gKiAgIC0gYXV0byBmbHVzaGluZyBpcyBlbmFibGVkXG4gKlxuICogQHBhcmFtIHtPYmplY3Q9fSAkZGVsZWdhdGUgUmVhbCAkaHR0cEJhY2tlbmQgaW5zdGFuY2UgKGFsbG93IHBhc3NpbmcgdGhyb3VnaCBpZiBzcGVjaWZpZWQpXG4gKiBAcGFyYW0ge09iamVjdD19ICRicm93c2VyIEF1dG8tZmx1c2hpbmcgZW5hYmxlZCBpZiBzcGVjaWZpZWRcbiAqIEByZXR1cm4ge09iamVjdH0gSW5zdGFuY2Ugb2YgJGh0dHBCYWNrZW5kIG1vY2tcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSHR0cEJhY2tlbmRNb2NrKCRyb290U2NvcGUsICR0aW1lb3V0LCAkZGVsZWdhdGUsICRicm93c2VyKSB7XG4gIHZhciBkZWZpbml0aW9ucyA9IFtdLFxuICAgICAgZXhwZWN0YXRpb25zID0gW10sXG4gICAgICByZXNwb25zZXMgPSBbXSxcbiAgICAgIHJlc3BvbnNlc1B1c2ggPSBhbmd1bGFyLmJpbmQocmVzcG9uc2VzLCByZXNwb25zZXMucHVzaCksXG4gICAgICBjb3B5ID0gYW5ndWxhci5jb3B5O1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlc3BvbnNlKHN0YXR1cywgZGF0YSwgaGVhZGVycywgc3RhdHVzVGV4dCkge1xuICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oc3RhdHVzKSkgcmV0dXJuIHN0YXR1cztcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBhbmd1bGFyLmlzTnVtYmVyKHN0YXR1cylcbiAgICAgICAgICA/IFtzdGF0dXMsIGRhdGEsIGhlYWRlcnMsIHN0YXR1c1RleHRdXG4gICAgICAgICAgOiBbMjAwLCBzdGF0dXMsIGRhdGEsIGhlYWRlcnNdO1xuICAgIH07XG4gIH1cblxuICAvLyBUT0RPKHZvanRhKTogY2hhbmdlIHBhcmFtcyB0bzogbWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMsIGNhbGxiYWNrXG4gIGZ1bmN0aW9uICRodHRwQmFja2VuZChtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIGhlYWRlcnMsIHRpbWVvdXQsIHdpdGhDcmVkZW50aWFscywgcmVzcG9uc2VUeXBlLCBldmVudEhhbmRsZXJzLCB1cGxvYWRFdmVudEhhbmRsZXJzKSB7XG5cbiAgICB2YXIgeGhyID0gbmV3IE1vY2tYaHIoKSxcbiAgICAgICAgZXhwZWN0YXRpb24gPSBleHBlY3RhdGlvbnNbMF0sXG4gICAgICAgIHdhc0V4cGVjdGVkID0gZmFsc2U7XG5cbiAgICB4aHIuJCRldmVudHMgPSBldmVudEhhbmRsZXJzO1xuICAgIHhoci51cGxvYWQuJCRldmVudHMgPSB1cGxvYWRFdmVudEhhbmRsZXJzO1xuXG4gICAgZnVuY3Rpb24gcHJldHR5UHJpbnQoZGF0YSkge1xuICAgICAgcmV0dXJuIChhbmd1bGFyLmlzU3RyaW5nKGRhdGEpIHx8IGFuZ3VsYXIuaXNGdW5jdGlvbihkYXRhKSB8fCBkYXRhIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICAgID8gZGF0YVxuICAgICAgICAgIDogYW5ndWxhci50b0pzb24oZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd3JhcFJlc3BvbnNlKHdyYXBwZWQpIHtcbiAgICAgIGlmICghJGJyb3dzZXIgJiYgdGltZW91dCkge1xuICAgICAgICB0aW1lb3V0LnRoZW4gPyB0aW1lb3V0LnRoZW4oaGFuZGxlVGltZW91dCkgOiAkdGltZW91dChoYW5kbGVUaW1lb3V0LCB0aW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhhbmRsZVJlc3BvbnNlO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVSZXNwb25zZSgpIHtcbiAgICAgICAgdmFyIHJlc3BvbnNlID0gd3JhcHBlZC5yZXNwb25zZShtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycywgd3JhcHBlZC5wYXJhbXModXJsKSk7XG4gICAgICAgIHhoci4kJHJlc3BIZWFkZXJzID0gcmVzcG9uc2VbMl07XG4gICAgICAgIGNhbGxiYWNrKGNvcHkocmVzcG9uc2VbMF0pLCBjb3B5KHJlc3BvbnNlWzFdKSwgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpLFxuICAgICAgICAgICAgICAgICBjb3B5KHJlc3BvbnNlWzNdIHx8ICcnKSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHJlc3BvbnNlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlc1tpXSA9PT0gaGFuZGxlUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBjYWxsYmFjaygtMSwgdW5kZWZpbmVkLCAnJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXhwZWN0YXRpb24gJiYgZXhwZWN0YXRpb24ubWF0Y2gobWV0aG9kLCB1cmwpKSB7XG4gICAgICBpZiAoIWV4cGVjdGF0aW9uLm1hdGNoRGF0YShkYXRhKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkICcgKyBleHBlY3RhdGlvbiArICcgd2l0aCBkaWZmZXJlbnQgZGF0YVxcbicgK1xuICAgICAgICAgICAgJ0VYUEVDVEVEOiAnICsgcHJldHR5UHJpbnQoZXhwZWN0YXRpb24uZGF0YSkgKyAnXFxuR09UOiAgICAgICcgKyBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFleHBlY3RhdGlvbi5tYXRjaEhlYWRlcnMoaGVhZGVycykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCAnICsgZXhwZWN0YXRpb24gKyAnIHdpdGggZGlmZmVyZW50IGhlYWRlcnNcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdFWFBFQ1RFRDogJyArIHByZXR0eVByaW50KGV4cGVjdGF0aW9uLmhlYWRlcnMpICsgJ1xcbkdPVDogICAgICAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXR0eVByaW50KGhlYWRlcnMpKTtcbiAgICAgIH1cblxuICAgICAgZXhwZWN0YXRpb25zLnNoaWZ0KCk7XG5cbiAgICAgIGlmIChleHBlY3RhdGlvbi5yZXNwb25zZSkge1xuICAgICAgICByZXNwb25zZXMucHVzaCh3cmFwUmVzcG9uc2UoZXhwZWN0YXRpb24pKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgd2FzRXhwZWN0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciBpID0gLTEsIGRlZmluaXRpb247XG4gICAgd2hpbGUgKChkZWZpbml0aW9uID0gZGVmaW5pdGlvbnNbKytpXSkpIHtcbiAgICAgIGlmIChkZWZpbml0aW9uLm1hdGNoKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzIHx8IHt9KSkge1xuICAgICAgICBpZiAoZGVmaW5pdGlvbi5yZXNwb25zZSkge1xuICAgICAgICAgIC8vIGlmICRicm93c2VyIHNwZWNpZmllZCwgd2UgZG8gYXV0byBmbHVzaCBhbGwgcmVxdWVzdHNcbiAgICAgICAgICAoJGJyb3dzZXIgPyAkYnJvd3Nlci5kZWZlciA6IHJlc3BvbnNlc1B1c2gpKHdyYXBSZXNwb25zZShkZWZpbml0aW9uKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVmaW5pdGlvbi5wYXNzVGhyb3VnaCkge1xuICAgICAgICAgICRkZWxlZ2F0ZShtZXRob2QsIHVybCwgZGF0YSwgY2FsbGJhY2ssIGhlYWRlcnMsIHRpbWVvdXQsIHdpdGhDcmVkZW50aWFscywgcmVzcG9uc2VUeXBlKTtcbiAgICAgICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcignTm8gcmVzcG9uc2UgZGVmaW5lZCAhJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgd2FzRXhwZWN0ZWQgP1xuICAgICAgICBuZXcgRXJyb3IoJ05vIHJlc3BvbnNlIGRlZmluZWQgIScpIDpcbiAgICAgICAgbmV3IEVycm9yKCdVbmV4cGVjdGVkIHJlcXVlc3Q6ICcgKyBtZXRob2QgKyAnICcgKyB1cmwgKyAnXFxuJyArXG4gICAgICAgICAgICAgICAgICAoZXhwZWN0YXRpb24gPyAnRXhwZWN0ZWQgJyArIGV4cGVjdGF0aW9uIDogJ05vIG1vcmUgcmVxdWVzdCBleHBlY3RlZCcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCBIVFRQIG1ldGhvZC5cbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl9IHVybCBIVFRQIHVybCBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgdXJsXG4gICAqICAgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgdXJsIG1hdGNoZXMgdGhlIGN1cnJlbnQgZGVmaW5pdGlvbi5cbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpKT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlc1xuICAgKiAgIGRhdGEgc3RyaW5nIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGRhdGEgaXMgYXMgZXhwZWN0ZWQuXG4gICAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgaHR0cCBoZWFkZXJcbiAgICogICBvYmplY3QgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgaGVhZGVycyBtYXRjaCB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0geyhBcnJheSk9fSBrZXlzIEFycmF5IG9mIGtleXMgdG8gYXNzaWduIHRvIHJlZ2V4IG1hdGNoZXMgaW4gcmVxdWVzdCB1cmwgZGVzY3JpYmVkIGFib3ZlLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2xzIGhvdyBhIG1hdGNoZWRcbiAgICogICByZXF1ZXN0IGlzIGhhbmRsZWQuIFlvdSBjYW4gc2F2ZSB0aGlzIG9iamVjdCBmb3IgbGF0ZXIgdXNlIGFuZCBpbnZva2UgYHJlc3BvbmRgIGFnYWluIGluXG4gICAqICAgb3JkZXIgdG8gY2hhbmdlIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKlxuICAgKiAgLSByZXNwb25kIOKAk1xuICAgKiAgICAgIGBgYGpzXG4gICAqICAgICAge2Z1bmN0aW9uKFtzdGF0dXMsXSBkYXRhWywgaGVhZGVycywgc3RhdHVzVGV4dF0pXG4gICAqICAgICAgfCBmdW5jdGlvbihmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycywgcGFyYW1zKX1cbiAgICogICAgICBgYGBcbiAgICogICAg4oCTIFRoZSByZXNwb25kIG1ldGhvZCB0YWtlcyBhIHNldCBvZiBzdGF0aWMgZGF0YSB0byBiZSByZXR1cm5lZCBvciBhIGZ1bmN0aW9uIHRoYXQgY2FuXG4gICAqICAgIHJldHVybiBhbiBhcnJheSBjb250YWluaW5nIHJlc3BvbnNlIHN0YXR1cyAobnVtYmVyKSwgcmVzcG9uc2UgZGF0YSAoQXJyYXl8T2JqZWN0fHN0cmluZyksXG4gICAqICAgIHJlc3BvbnNlIGhlYWRlcnMgKE9iamVjdCksIGFuZCB0aGUgdGV4dCBmb3IgdGhlIHN0YXR1cyAoc3RyaW5nKS4gVGhlIHJlc3BvbmQgbWV0aG9kIHJldHVybnNcbiAgICogICAgdGhlIGByZXF1ZXN0SGFuZGxlcmAgb2JqZWN0IGZvciBwb3NzaWJsZSBvdmVycmlkZXMuXG4gICAqL1xuICAkaHR0cEJhY2tlbmQud2hlbiA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzLCBrZXlzKSB7XG4gICAgdmFyIGRlZmluaXRpb24gPSBuZXcgTW9ja0h0dHBFeHBlY3RhdGlvbihtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycywga2V5cyksXG4gICAgICAgIGNoYWluID0ge1xuICAgICAgICAgIHJlc3BvbmQ6IGZ1bmN0aW9uKHN0YXR1cywgZGF0YSwgaGVhZGVycywgc3RhdHVzVGV4dCkge1xuICAgICAgICAgICAgZGVmaW5pdGlvbi5wYXNzVGhyb3VnaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRlZmluaXRpb24ucmVzcG9uc2UgPSBjcmVhdGVSZXNwb25zZShzdGF0dXMsIGRhdGEsIGhlYWRlcnMsIHN0YXR1c1RleHQpO1xuICAgICAgICAgICAgcmV0dXJuIGNoYWluO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIGlmICgkYnJvd3Nlcikge1xuICAgICAgY2hhaW4ucGFzc1Rocm91Z2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZGVmaW5pdGlvbi5yZXNwb25zZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgZGVmaW5pdGlvbi5wYXNzVGhyb3VnaCA9IHRydWU7XG4gICAgICAgIHJldHVybiBjaGFpbjtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZGVmaW5pdGlvbnMucHVzaChkZWZpbml0aW9uKTtcbiAgICByZXR1cm4gY2hhaW47XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5HRVRcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBHRVQgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKX0gdXJsIEhUVFAgdXJsIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSB1cmxcbiAgICogICBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSB1cmwgbWF0Y2hlcyB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAgICogQHBhcmFtIHsoQXJyYXkpPX0ga2V5cyBBcnJheSBvZiBrZXlzIHRvIGFzc2lnbiB0byByZWdleCBtYXRjaGVzIGluIHJlcXVlc3QgdXJsIGRlc2NyaWJlZCBhYm92ZS5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9scyBob3cgYSBtYXRjaGVkXG4gICAqIHJlcXVlc3QgaXMgaGFuZGxlZC4gWW91IGNhbiBzYXZlIHRoaXMgb2JqZWN0IGZvciBsYXRlciB1c2UgYW5kIGludm9rZSBgcmVzcG9uZGAgYWdhaW4gaW5cbiAgICogb3JkZXIgdG8gY2hhbmdlIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlbkhFQURcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBIRUFEIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl9IHVybCBIVFRQIHVybCBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgdXJsXG4gICAqICAgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgdXJsIG1hdGNoZXMgdGhlIGN1cnJlbnQgZGVmaW5pdGlvbi5cbiAgICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEBwYXJhbSB7KEFycmF5KT19IGtleXMgQXJyYXkgb2Yga2V5cyB0byBhc3NpZ24gdG8gcmVnZXggbWF0Y2hlcyBpbiByZXF1ZXN0IHVybCBkZXNjcmliZWQgYWJvdmUuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbHMgaG93IGEgbWF0Y2hlZFxuICAgKiByZXF1ZXN0IGlzIGhhbmRsZWQuIFlvdSBjYW4gc2F2ZSB0aGlzIG9iamVjdCBmb3IgbGF0ZXIgdXNlIGFuZCBpbnZva2UgYHJlc3BvbmRgIGFnYWluIGluXG4gICAqIG9yZGVyIHRvIGNoYW5nZSBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5ERUxFVEVcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBERUxFVEUgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKX0gdXJsIEhUVFAgdXJsIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSB1cmxcbiAgICogICBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSB1cmwgbWF0Y2hlcyB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAgICogQHBhcmFtIHsoQXJyYXkpPX0ga2V5cyBBcnJheSBvZiBrZXlzIHRvIGFzc2lnbiB0byByZWdleCBtYXRjaGVzIGluIHJlcXVlc3QgdXJsIGRlc2NyaWJlZCBhYm92ZS5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9scyBob3cgYSBtYXRjaGVkXG4gICAqIHJlcXVlc3QgaXMgaGFuZGxlZC4gWW91IGNhbiBzYXZlIHRoaXMgb2JqZWN0IGZvciBsYXRlciB1c2UgYW5kIGludm9rZSBgcmVzcG9uZGAgYWdhaW4gaW5cbiAgICogb3JkZXIgdG8gY2hhbmdlIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlblBPU1RcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBQT1NUIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl9IHVybCBIVFRQIHVybCBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgdXJsXG4gICAqICAgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgdXJsIG1hdGNoZXMgdGhlIGN1cnJlbnQgZGVmaW5pdGlvbi5cbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpKT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlc1xuICAgKiAgIGRhdGEgc3RyaW5nIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGRhdGEgaXMgYXMgZXhwZWN0ZWQuXG4gICAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcGFyYW0geyhBcnJheSk9fSBrZXlzIEFycmF5IG9mIGtleXMgdG8gYXNzaWduIHRvIHJlZ2V4IG1hdGNoZXMgaW4gcmVxdWVzdCB1cmwgZGVzY3JpYmVkIGFib3ZlLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2xzIGhvdyBhIG1hdGNoZWRcbiAgICogcmVxdWVzdCBpcyBoYW5kbGVkLiBZb3UgY2FuIHNhdmUgdGhpcyBvYmplY3QgZm9yIGxhdGVyIHVzZSBhbmQgaW52b2tlIGByZXNwb25kYCBhZ2FpbiBpblxuICAgKiBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuUFVUXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgUFVUIHJlcXVlc3RzLiAgRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpfSB1cmwgSFRUUCB1cmwgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIHVybFxuICAgKiAgIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIHVybCBtYXRjaGVzIHRoZSBjdXJyZW50IGRlZmluaXRpb24uXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKSk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5IG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXNcbiAgICogICBkYXRhIHN0cmluZyBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBkYXRhIGlzIGFzIGV4cGVjdGVkLlxuICAgKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAgICogQHBhcmFtIHsoQXJyYXkpPX0ga2V5cyBBcnJheSBvZiBrZXlzIHRvIGFzc2lnbiB0byByZWdleCBtYXRjaGVzIGluIHJlcXVlc3QgdXJsIGRlc2NyaWJlZCBhYm92ZS5cbiAgICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBtZXRob2QgdGhhdCBjb250cm9scyBob3cgYSBtYXRjaGVkXG4gICAqIHJlcXVlc3QgaXMgaGFuZGxlZC4gWW91IGNhbiBzYXZlIHRoaXMgb2JqZWN0IGZvciBsYXRlciB1c2UgYW5kIGludm9rZSBgcmVzcG9uZGAgYWdhaW4gaW5cbiAgICogb3JkZXIgdG8gY2hhbmdlIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlbkpTT05QXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgSlNPTlAgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKX0gdXJsIEhUVFAgdXJsIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSB1cmxcbiAgICogICBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSB1cmwgbWF0Y2hlcyB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0geyhBcnJheSk9fSBrZXlzIEFycmF5IG9mIGtleXMgdG8gYXNzaWduIHRvIHJlZ2V4IG1hdGNoZXMgaW4gcmVxdWVzdCB1cmwgZGVzY3JpYmVkIGFib3ZlLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2xzIGhvdyBhIG1hdGNoZWRcbiAgICogcmVxdWVzdCBpcyBoYW5kbGVkLiBZb3UgY2FuIHNhdmUgdGhpcyBvYmplY3QgZm9yIGxhdGVyIHVzZSBhbmQgaW52b2tlIGByZXNwb25kYCBhZ2FpbiBpblxuICAgKiBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gICAqL1xuICBjcmVhdGVTaG9ydE1ldGhvZHMoJ3doZW4nKTtcblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlblJvdXRlXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiB0aGF0IGNvbXBhcmVzIG9ubHkgd2l0aCB0aGUgcmVxdWVzdGVkIHJvdXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIEhUVFAgbWV0aG9kLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIEhUVFAgdXJsIHN0cmluZyB0aGF0IHN1cHBvcnRzIGNvbG9uIHBhcmFtIG1hdGNoaW5nLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2xzIGhvdyBhIG1hdGNoZWRcbiAgICogcmVxdWVzdCBpcyBoYW5kbGVkLiBZb3UgY2FuIHNhdmUgdGhpcyBvYmplY3QgZm9yIGxhdGVyIHVzZSBhbmQgaW52b2tlIGByZXNwb25kYCBhZ2FpbiBpblxuICAgKiBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuIFNlZSAjd2hlbiBmb3IgbW9yZSBpbmZvLlxuICAgKi9cbiAgJGh0dHBCYWNrZW5kLndoZW5Sb3V0ZSA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsKSB7XG4gICAgdmFyIHBhdGhPYmogPSBwYXJzZVJvdXRlKHVybCk7XG4gICAgcmV0dXJuICRodHRwQmFja2VuZC53aGVuKG1ldGhvZCwgcGF0aE9iai5yZWdleHAsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBwYXRoT2JqLmtleXMpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHBhcnNlUm91dGUodXJsKSB7XG4gICAgdmFyIHJldCA9IHtcbiAgICAgIHJlZ2V4cDogdXJsXG4gICAgfSxcbiAgICBrZXlzID0gcmV0LmtleXMgPSBbXTtcblxuICAgIGlmICghdXJsIHx8ICFhbmd1bGFyLmlzU3RyaW5nKHVybCkpIHJldHVybiByZXQ7XG5cbiAgICB1cmwgPSB1cmxcbiAgICAgIC5yZXBsYWNlKC8oWygpLl0pL2csICdcXFxcJDEnKVxuICAgICAgLnJlcGxhY2UoLyhcXC8pPzooXFx3KykoW1xcP1xcKl0pPy9nLCBmdW5jdGlvbihfLCBzbGFzaCwga2V5LCBvcHRpb24pIHtcbiAgICAgICAgdmFyIG9wdGlvbmFsID0gb3B0aW9uID09PSAnPycgPyBvcHRpb24gOiBudWxsO1xuICAgICAgICB2YXIgc3RhciA9IG9wdGlvbiA9PT0gJyonID8gb3B0aW9uIDogbnVsbDtcbiAgICAgICAga2V5cy5wdXNoKHsgbmFtZToga2V5LCBvcHRpb25hbDogISFvcHRpb25hbCB9KTtcbiAgICAgICAgc2xhc2ggPSBzbGFzaCB8fCAnJztcbiAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgKyAob3B0aW9uYWwgPyAnJyA6IHNsYXNoKVxuICAgICAgICAgICsgJyg/OidcbiAgICAgICAgICArIChvcHRpb25hbCA/IHNsYXNoIDogJycpXG4gICAgICAgICAgKyAoc3RhciAmJiAnKC4rPyknIHx8ICcoW14vXSspJylcbiAgICAgICAgICArIChvcHRpb25hbCB8fCAnJylcbiAgICAgICAgICArICcpJ1xuICAgICAgICAgICsgKG9wdGlvbmFsIHx8ICcnKTtcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZSgvKFtcXC8kXFwqXSkvZywgJ1xcXFwkMScpO1xuXG4gICAgcmV0LnJlZ2V4cCA9IG5ldyBSZWdFeHAoJ14nICsgdXJsLCAnaScpO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZXhwZWN0XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IHJlcXVlc3QgZXhwZWN0YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgSFRUUCBtZXRob2QuXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpfSB1cmwgSFRUUCB1cmwgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIHVybFxuICAgKiAgIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIHVybCBtYXRjaGVzIHRoZSBjdXJyZW50IGRlZmluaXRpb24uXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKXxPYmplY3QpPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keSBvciBmdW5jdGlvbiB0aGF0XG4gICAqICByZWNlaXZlcyBkYXRhIHN0cmluZyBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBkYXRhIGlzIGFzIGV4cGVjdGVkLCBvciBPYmplY3QgaWYgcmVxdWVzdCBib2R5XG4gICAqICBpcyBpbiBKU09OIGZvcm1hdC5cbiAgICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBodHRwIGhlYWRlclxuICAgKiAgIG9iamVjdCBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBoZWFkZXJzIG1hdGNoIHRoZSBjdXJyZW50IGV4cGVjdGF0aW9uLlxuICAgKiBAcGFyYW0geyhBcnJheSk9fSBrZXlzIEFycmF5IG9mIGtleXMgdG8gYXNzaWduIHRvIHJlZ2V4IG1hdGNoZXMgaW4gcmVxdWVzdCB1cmwgZGVzY3JpYmVkIGFib3ZlLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2xzIGhvdyBhIG1hdGNoZWRcbiAgICogIHJlcXVlc3QgaXMgaGFuZGxlZC4gWW91IGNhbiBzYXZlIHRoaXMgb2JqZWN0IGZvciBsYXRlciB1c2UgYW5kIGludm9rZSBgcmVzcG9uZGAgYWdhaW4gaW5cbiAgICogIG9yZGVyIHRvIGNoYW5nZSBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAgICpcbiAgICogIC0gcmVzcG9uZCDigJNcbiAgICogICAgYGBgXG4gICAqICAgIHsgZnVuY3Rpb24oW3N0YXR1cyxdIGRhdGFbLCBoZWFkZXJzLCBzdGF0dXNUZXh0XSlcbiAgICogICAgfCBmdW5jdGlvbihmdW5jdGlvbihtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycywgcGFyYW1zKX1cbiAgICogICAgYGBgXG4gICAqICAgIOKAkyBUaGUgcmVzcG9uZCBtZXRob2QgdGFrZXMgYSBzZXQgb2Ygc3RhdGljIGRhdGEgdG8gYmUgcmV0dXJuZWQgb3IgYSBmdW5jdGlvbiB0aGF0IGNhblxuICAgKiAgICByZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyByZXNwb25zZSBzdGF0dXMgKG51bWJlciksIHJlc3BvbnNlIGRhdGEgKEFycmF5fE9iamVjdHxzdHJpbmcpLFxuICAgKiAgICByZXNwb25zZSBoZWFkZXJzIChPYmplY3QpLCBhbmQgdGhlIHRleHQgZm9yIHRoZSBzdGF0dXMgKHN0cmluZykuIFRoZSByZXNwb25kIG1ldGhvZCByZXR1cm5zXG4gICAqICAgIHRoZSBgcmVxdWVzdEhhbmRsZXJgIG9iamVjdCBmb3IgcG9zc2libGUgb3ZlcnJpZGVzLlxuICAgKi9cbiAgJGh0dHBCYWNrZW5kLmV4cGVjdCA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzLCBrZXlzKSB7XG4gICAgdmFyIGV4cGVjdGF0aW9uID0gbmV3IE1vY2tIdHRwRXhwZWN0YXRpb24obWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMsIGtleXMpLFxuICAgICAgICBjaGFpbiA9IHtcbiAgICAgICAgICByZXNwb25kOiBmdW5jdGlvbihzdGF0dXMsIGRhdGEsIGhlYWRlcnMsIHN0YXR1c1RleHQpIHtcbiAgICAgICAgICAgIGV4cGVjdGF0aW9uLnJlc3BvbnNlID0gY3JlYXRlUmVzcG9uc2Uoc3RhdHVzLCBkYXRhLCBoZWFkZXJzLCBzdGF0dXNUZXh0KTtcbiAgICAgICAgICAgIHJldHVybiBjaGFpbjtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICBleHBlY3RhdGlvbnMucHVzaChleHBlY3RhdGlvbik7XG4gICAgcmV0dXJuIGNoYWluO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCNleHBlY3RHRVRcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbiBmb3IgR0VUIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgZXhwZWN0KClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKX0gdXJsIEhUVFAgdXJsIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSB1cmxcbiAgICogICBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSB1cmwgbWF0Y2hlcyB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcGFyYW0geyhBcnJheSk9fSBrZXlzIEFycmF5IG9mIGtleXMgdG8gYXNzaWduIHRvIHJlZ2V4IG1hdGNoZXMgaW4gcmVxdWVzdCB1cmwgZGVzY3JpYmVkIGFib3ZlLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2xzIGhvdyBhIG1hdGNoZWRcbiAgICogcmVxdWVzdCBpcyBoYW5kbGVkLiBZb3UgY2FuIHNhdmUgdGhpcyBvYmplY3QgZm9yIGxhdGVyIHVzZSBhbmQgaW52b2tlIGByZXNwb25kYCBhZ2FpbiBpblxuICAgKiBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuIFNlZSAjZXhwZWN0IGZvciBtb3JlIGluZm8uXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCNleHBlY3RIRUFEXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgbmV3IHJlcXVlc3QgZXhwZWN0YXRpb24gZm9yIEhFQUQgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGBleHBlY3QoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpfSB1cmwgSFRUUCB1cmwgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIHVybFxuICAgKiAgIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIHVybCBtYXRjaGVzIHRoZSBjdXJyZW50IGRlZmluaXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEBwYXJhbSB7KEFycmF5KT19IGtleXMgQXJyYXkgb2Yga2V5cyB0byBhc3NpZ24gdG8gcmVnZXggbWF0Y2hlcyBpbiByZXF1ZXN0IHVybCBkZXNjcmliZWQgYWJvdmUuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbHMgaG93IGEgbWF0Y2hlZFxuICAgKiAgIHJlcXVlc3QgaXMgaGFuZGxlZC4gWW91IGNhbiBzYXZlIHRoaXMgb2JqZWN0IGZvciBsYXRlciB1c2UgYW5kIGludm9rZSBgcmVzcG9uZGAgYWdhaW4gaW5cbiAgICogICBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCNleHBlY3RERUxFVEVcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbiBmb3IgREVMRVRFIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgZXhwZWN0KClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKX0gdXJsIEhUVFAgdXJsIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSB1cmxcbiAgICogICBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSB1cmwgbWF0Y2hlcyB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcGFyYW0geyhBcnJheSk9fSBrZXlzIEFycmF5IG9mIGtleXMgdG8gYXNzaWduIHRvIHJlZ2V4IG1hdGNoZXMgaW4gcmVxdWVzdCB1cmwgZGVzY3JpYmVkIGFib3ZlLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2xzIGhvdyBhIG1hdGNoZWRcbiAgICogICByZXF1ZXN0IGlzIGhhbmRsZWQuIFlvdSBjYW4gc2F2ZSB0aGlzIG9iamVjdCBmb3IgbGF0ZXIgdXNlIGFuZCBpbnZva2UgYHJlc3BvbmRgIGFnYWluIGluXG4gICAqICAgb3JkZXIgdG8gY2hhbmdlIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZXhwZWN0UE9TVFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIG5ldyByZXF1ZXN0IGV4cGVjdGF0aW9uIGZvciBQT1NUIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgZXhwZWN0KClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKX0gdXJsIEhUVFAgdXJsIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSB1cmxcbiAgICogICBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSB1cmwgbWF0Y2hlcyB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl8T2JqZWN0KT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkgb3IgZnVuY3Rpb24gdGhhdFxuICAgKiAgcmVjZWl2ZXMgZGF0YSBzdHJpbmcgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgZGF0YSBpcyBhcyBleHBlY3RlZCwgb3IgT2JqZWN0IGlmIHJlcXVlc3QgYm9keVxuICAgKiAgaXMgaW4gSlNPTiBmb3JtYXQuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEBwYXJhbSB7KEFycmF5KT19IGtleXMgQXJyYXkgb2Yga2V5cyB0byBhc3NpZ24gdG8gcmVnZXggbWF0Y2hlcyBpbiByZXF1ZXN0IHVybCBkZXNjcmliZWQgYWJvdmUuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbHMgaG93IGEgbWF0Y2hlZFxuICAgKiAgIHJlcXVlc3QgaXMgaGFuZGxlZC4gWW91IGNhbiBzYXZlIHRoaXMgb2JqZWN0IGZvciBsYXRlciB1c2UgYW5kIGludm9rZSBgcmVzcG9uZGAgYWdhaW4gaW5cbiAgICogICBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCNleHBlY3RQVVRcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbiBmb3IgUFVUIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgZXhwZWN0KClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKX0gdXJsIEhUVFAgdXJsIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSB1cmxcbiAgICogICBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSB1cmwgbWF0Y2hlcyB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl8T2JqZWN0KT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkgb3IgZnVuY3Rpb24gdGhhdFxuICAgKiAgcmVjZWl2ZXMgZGF0YSBzdHJpbmcgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgZGF0YSBpcyBhcyBleHBlY3RlZCwgb3IgT2JqZWN0IGlmIHJlcXVlc3QgYm9keVxuICAgKiAgaXMgaW4gSlNPTiBmb3JtYXQuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gICAqIEBwYXJhbSB7KEFycmF5KT19IGtleXMgQXJyYXkgb2Yga2V5cyB0byBhc3NpZ24gdG8gcmVnZXggbWF0Y2hlcyBpbiByZXF1ZXN0IHVybCBkZXNjcmliZWQgYWJvdmUuXG4gICAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgbWV0aG9kIHRoYXQgY29udHJvbHMgaG93IGEgbWF0Y2hlZFxuICAgKiAgIHJlcXVlc3QgaXMgaGFuZGxlZC4gWW91IGNhbiBzYXZlIHRoaXMgb2JqZWN0IGZvciBsYXRlciB1c2UgYW5kIGludm9rZSBgcmVzcG9uZGAgYWdhaW4gaW5cbiAgICogICBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCNleHBlY3RQQVRDSFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIG5ldyByZXF1ZXN0IGV4cGVjdGF0aW9uIGZvciBQQVRDSCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYGV4cGVjdCgpYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl9IHVybCBIVFRQIHVybCBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgdXJsXG4gICAqICAgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgdXJsIG1hdGNoZXMgdGhlIGN1cnJlbnQgZGVmaW5pdGlvbi5cbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpfE9iamVjdCk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5IG9yIGZ1bmN0aW9uIHRoYXRcbiAgICogIHJlY2VpdmVzIGRhdGEgc3RyaW5nIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGRhdGEgaXMgYXMgZXhwZWN0ZWQsIG9yIE9iamVjdCBpZiByZXF1ZXN0IGJvZHlcbiAgICogIGlzIGluIEpTT04gZm9ybWF0LlxuICAgKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICAgKiBAcGFyYW0geyhBcnJheSk9fSBrZXlzIEFycmF5IG9mIGtleXMgdG8gYXNzaWduIHRvIHJlZ2V4IG1hdGNoZXMgaW4gcmVxdWVzdCB1cmwgZGVzY3JpYmVkIGFib3ZlLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2xzIGhvdyBhIG1hdGNoZWRcbiAgICogICByZXF1ZXN0IGlzIGhhbmRsZWQuIFlvdSBjYW4gc2F2ZSB0aGlzIG9iamVjdCBmb3IgbGF0ZXIgdXNlIGFuZCBpbnZva2UgYHJlc3BvbmRgIGFnYWluIGluXG4gICAqICAgb3JkZXIgdG8gY2hhbmdlIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZXhwZWN0SlNPTlBcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbiBmb3IgSlNPTlAgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGBleHBlY3QoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpfSB1cmwgSFRUUCB1cmwgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhbiB1cmxcbiAgICogICBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSB1cmwgbWF0Y2hlcyB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICAgKiBAcGFyYW0geyhBcnJheSk9fSBrZXlzIEFycmF5IG9mIGtleXMgdG8gYXNzaWduIHRvIHJlZ2V4IG1hdGNoZXMgaW4gcmVxdWVzdCB1cmwgZGVzY3JpYmVkIGFib3ZlLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2xzIGhvdyBhIG1hdGNoZWRcbiAgICogICByZXF1ZXN0IGlzIGhhbmRsZWQuIFlvdSBjYW4gc2F2ZSB0aGlzIG9iamVjdCBmb3IgbGF0ZXIgdXNlIGFuZCBpbnZva2UgYHJlc3BvbmRgIGFnYWluIGluXG4gICAqICAgb3JkZXIgdG8gY2hhbmdlIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICAgKi9cbiAgY3JlYXRlU2hvcnRNZXRob2RzKCdleHBlY3QnKTtcblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkaHR0cEJhY2tlbmQjZXhwZWN0Um91dGVcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSBuZXcgcmVxdWVzdCBleHBlY3RhdGlvbiB0aGF0IGNvbXBhcmVzIG9ubHkgd2l0aCB0aGUgcmVxdWVzdGVkIHJvdXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIEhUVFAgbWV0aG9kLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIEhUVFAgdXJsIHN0cmluZyB0aGF0IHN1cHBvcnRzIGNvbG9uIHBhcmFtIG1hdGNoaW5nLlxuICAgKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIG1ldGhvZCB0aGF0IGNvbnRyb2xzIGhvdyBhIG1hdGNoZWRcbiAgICogcmVxdWVzdCBpcyBoYW5kbGVkLiBZb3UgY2FuIHNhdmUgdGhpcyBvYmplY3QgZm9yIGxhdGVyIHVzZSBhbmQgaW52b2tlIGByZXNwb25kYCBhZ2FpbiBpblxuICAgKiBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuIFNlZSAjZXhwZWN0IGZvciBtb3JlIGluZm8uXG4gICAqL1xuICAkaHR0cEJhY2tlbmQuZXhwZWN0Um91dGUgPSBmdW5jdGlvbihtZXRob2QsIHVybCkge1xuICAgIHZhciBwYXRoT2JqID0gcGFyc2VSb3V0ZSh1cmwpO1xuICAgIHJldHVybiAkaHR0cEJhY2tlbmQuZXhwZWN0KG1ldGhvZCwgcGF0aE9iai5yZWdleHAsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBwYXRoT2JqLmtleXMpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI2ZsdXNoXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBGbHVzaGVzIGFsbCBwZW5kaW5nIHJlcXVlc3RzIHVzaW5nIHRoZSB0cmFpbmVkIHJlc3BvbnNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjb3VudCBOdW1iZXIgb2YgcmVzcG9uc2VzIHRvIGZsdXNoIChpbiB0aGUgb3JkZXIgdGhleSBhcnJpdmVkKS4gSWYgdW5kZWZpbmVkLFxuICAgKiAgIGFsbCBwZW5kaW5nIHJlcXVlc3RzIHdpbGwgYmUgZmx1c2hlZC4gSWYgdGhlcmUgYXJlIG5vIHBlbmRpbmcgcmVxdWVzdHMgd2hlbiB0aGUgZmx1c2ggbWV0aG9kXG4gICAqICAgaXMgY2FsbGVkIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gKGFzIHRoaXMgdHlwaWNhbGx5IGEgc2lnbiBvZiBwcm9ncmFtbWluZyBlcnJvcikuXG4gICAqL1xuICAkaHR0cEJhY2tlbmQuZmx1c2ggPSBmdW5jdGlvbihjb3VudCwgZGlnZXN0KSB7XG4gICAgaWYgKGRpZ2VzdCAhPT0gZmFsc2UpICRyb290U2NvcGUuJGRpZ2VzdCgpO1xuICAgIGlmICghcmVzcG9uc2VzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdObyBwZW5kaW5nIHJlcXVlc3QgdG8gZmx1c2ggIScpO1xuXG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGNvdW50KSAmJiBjb3VudCAhPT0gbnVsbCkge1xuICAgICAgd2hpbGUgKGNvdW50LS0pIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ05vIG1vcmUgcGVuZGluZyByZXF1ZXN0IHRvIGZsdXNoICEnKTtcbiAgICAgICAgcmVzcG9uc2VzLnNoaWZ0KCkoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKHJlc3BvbnNlcy5sZW5ndGgpIHtcbiAgICAgICAgcmVzcG9uc2VzLnNoaWZ0KCkoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgJGh0dHBCYWNrZW5kLnZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvbihkaWdlc3QpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3ZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvblxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVmVyaWZpZXMgdGhhdCBhbGwgb2YgdGhlIHJlcXVlc3RzIGRlZmluZWQgdmlhIHRoZSBgZXhwZWN0YCBhcGkgd2VyZSBtYWRlLiBJZiBhbnkgb2YgdGhlXG4gICAqIHJlcXVlc3RzIHdlcmUgbm90IG1hZGUsIHZlcmlmeU5vT3V0c3RhbmRpbmdFeHBlY3RhdGlvbiB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICAgKlxuICAgKiBUeXBpY2FsbHksIHlvdSB3b3VsZCBjYWxsIHRoaXMgbWV0aG9kIGZvbGxvd2luZyBlYWNoIHRlc3QgY2FzZSB0aGF0IGFzc2VydHMgcmVxdWVzdHMgdXNpbmcgYW5cbiAgICogXCJhZnRlckVhY2hcIiBjbGF1c2UuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqICAgYWZ0ZXJFYWNoKCRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb24pO1xuICAgKiBgYGBcbiAgICovXG4gICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nRXhwZWN0YXRpb24gPSBmdW5jdGlvbihkaWdlc3QpIHtcbiAgICBpZiAoZGlnZXN0ICE9PSBmYWxzZSkgJHJvb3RTY29wZS4kZGlnZXN0KCk7XG4gICAgaWYgKGV4cGVjdGF0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5zYXRpc2ZpZWQgcmVxdWVzdHM6ICcgKyBleHBlY3RhdGlvbnMuam9pbignLCAnKSk7XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJGh0dHBCYWNrZW5kI3ZlcmlmeU5vT3V0c3RhbmRpbmdSZXF1ZXN0XG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBWZXJpZmllcyB0aGF0IHRoZXJlIGFyZSBubyBvdXRzdGFuZGluZyByZXF1ZXN0cyB0aGF0IG5lZWQgdG8gYmUgZmx1c2hlZC5cbiAgICpcbiAgICogVHlwaWNhbGx5LCB5b3Ugd291bGQgY2FsbCB0aGlzIG1ldGhvZCBmb2xsb3dpbmcgZWFjaCB0ZXN0IGNhc2UgdGhhdCBhc3NlcnRzIHJlcXVlc3RzIHVzaW5nIGFuXG4gICAqIFwiYWZ0ZXJFYWNoXCIgY2xhdXNlLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiAgIGFmdGVyRWFjaCgkaHR0cEJhY2tlbmQudmVyaWZ5Tm9PdXRzdGFuZGluZ1JlcXVlc3QpO1xuICAgKiBgYGBcbiAgICovXG4gICRodHRwQmFja2VuZC52ZXJpZnlOb091dHN0YW5kaW5nUmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChyZXNwb25zZXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZmx1c2hlZCByZXF1ZXN0czogJyArIHJlc3BvbnNlcy5sZW5ndGgpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRodHRwQmFja2VuZCNyZXNldEV4cGVjdGF0aW9uc1xuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVzZXRzIGFsbCByZXF1ZXN0IGV4cGVjdGF0aW9ucywgYnV0IHByZXNlcnZlcyBhbGwgYmFja2VuZCBkZWZpbml0aW9ucy4gVHlwaWNhbGx5LCB5b3Ugd291bGRcbiAgICogY2FsbCByZXNldEV4cGVjdGF0aW9ucyBkdXJpbmcgYSBtdWx0aXBsZS1waGFzZSB0ZXN0IHdoZW4geW91IHdhbnQgdG8gcmV1c2UgdGhlIHNhbWUgaW5zdGFuY2Ugb2ZcbiAgICogJGh0dHBCYWNrZW5kIG1vY2suXG4gICAqL1xuICAkaHR0cEJhY2tlbmQucmVzZXRFeHBlY3RhdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICBleHBlY3RhdGlvbnMubGVuZ3RoID0gMDtcbiAgICByZXNwb25zZXMubGVuZ3RoID0gMDtcbiAgfTtcblxuICByZXR1cm4gJGh0dHBCYWNrZW5kO1xuXG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hvcnRNZXRob2RzKHByZWZpeCkge1xuICAgIGFuZ3VsYXIuZm9yRWFjaChbJ0dFVCcsICdERUxFVEUnLCAnSlNPTlAnLCAnSEVBRCddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgJGh0dHBCYWNrZW5kW3ByZWZpeCArIG1ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGhlYWRlcnMsIGtleXMpIHtcbiAgICAgICByZXR1cm4gJGh0dHBCYWNrZW5kW3ByZWZpeF0obWV0aG9kLCB1cmwsIHVuZGVmaW5lZCwgaGVhZGVycywga2V5cyk7XG4gICAgIH07XG4gICAgfSk7XG5cbiAgICBhbmd1bGFyLmZvckVhY2goWydQVVQnLCAnUE9TVCcsICdQQVRDSCddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICRodHRwQmFja2VuZFtwcmVmaXggKyBtZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBoZWFkZXJzLCBrZXlzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cEJhY2tlbmRbcHJlZml4XShtZXRob2QsIHVybCwgZGF0YSwgaGVhZGVycywga2V5cyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIE1vY2tIdHRwRXhwZWN0YXRpb24obWV0aG9kLCB1cmwsIGRhdGEsIGhlYWRlcnMsIGtleXMpIHtcblxuICB0aGlzLmRhdGEgPSBkYXRhO1xuICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xuXG4gIHRoaXMubWF0Y2ggPSBmdW5jdGlvbihtLCB1LCBkLCBoKSB7XG4gICAgaWYgKG1ldGhvZCAhPSBtKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCF0aGlzLm1hdGNoVXJsKHUpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGQpICYmICF0aGlzLm1hdGNoRGF0YShkKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChoKSAmJiAhdGhpcy5tYXRjaEhlYWRlcnMoaCkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICB0aGlzLm1hdGNoVXJsID0gZnVuY3Rpb24odSkge1xuICAgIGlmICghdXJsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHVybC50ZXN0KSkgcmV0dXJuIHVybC50ZXN0KHUpO1xuICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24odXJsKSkgcmV0dXJuIHVybCh1KTtcbiAgICByZXR1cm4gdXJsID09IHU7XG4gIH07XG5cbiAgdGhpcy5tYXRjaEhlYWRlcnMgPSBmdW5jdGlvbihoKSB7XG4gICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoaGVhZGVycykpIHJldHVybiB0cnVlO1xuICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24oaGVhZGVycykpIHJldHVybiBoZWFkZXJzKGgpO1xuICAgIHJldHVybiBhbmd1bGFyLmVxdWFscyhoZWFkZXJzLCBoKTtcbiAgfTtcblxuICB0aGlzLm1hdGNoRGF0YSA9IGZ1bmN0aW9uKGQpIHtcbiAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChkYXRhKSkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGRhdGEgJiYgYW5ndWxhci5pc0Z1bmN0aW9uKGRhdGEudGVzdCkpIHJldHVybiBkYXRhLnRlc3QoZCk7XG4gICAgaWYgKGRhdGEgJiYgYW5ndWxhci5pc0Z1bmN0aW9uKGRhdGEpKSByZXR1cm4gZGF0YShkKTtcbiAgICBpZiAoZGF0YSAmJiAhYW5ndWxhci5pc1N0cmluZyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGFuZ3VsYXIuZXF1YWxzKGFuZ3VsYXIuZnJvbUpzb24oYW5ndWxhci50b0pzb24oZGF0YSkpLCBhbmd1bGFyLmZyb21Kc29uKGQpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGEgPT0gZDtcbiAgfTtcblxuICB0aGlzLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG1ldGhvZCArICcgJyArIHVybDtcbiAgfTtcblxuICB0aGlzLnBhcmFtcyA9IGZ1bmN0aW9uKHUpIHtcbiAgICByZXR1cm4gYW5ndWxhci5leHRlbmQocGFyc2VRdWVyeSgpLCBwYXRoUGFyYW1zKCkpO1xuXG4gICAgZnVuY3Rpb24gcGF0aFBhcmFtcygpIHtcbiAgICAgIHZhciBrZXlPYmogPSB7fTtcbiAgICAgIGlmICghdXJsIHx8ICFhbmd1bGFyLmlzRnVuY3Rpb24odXJsLnRlc3QpIHx8ICFrZXlzIHx8IGtleXMubGVuZ3RoID09PSAwKSByZXR1cm4ga2V5T2JqO1xuXG4gICAgICB2YXIgbSA9IHVybC5leGVjKHUpO1xuICAgICAgaWYgKCFtKSByZXR1cm4ga2V5T2JqO1xuICAgICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IG0ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbaSAtIDFdO1xuICAgICAgICB2YXIgdmFsID0gbVtpXTtcbiAgICAgICAgaWYgKGtleSAmJiB2YWwpIHtcbiAgICAgICAgICBrZXlPYmpba2V5Lm5hbWUgfHwga2V5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5T2JqO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlUXVlcnkoKSB7XG4gICAgICB2YXIgb2JqID0ge30sIGtleV92YWx1ZSwga2V5LFxuICAgICAgICAgIHF1ZXJ5U3RyID0gdS5pbmRleE9mKCc/JykgPiAtMVxuICAgICAgICAgID8gdS5zdWJzdHJpbmcodS5pbmRleE9mKCc/JykgKyAxKVxuICAgICAgICAgIDogXCJcIjtcblxuICAgICAgYW5ndWxhci5mb3JFYWNoKHF1ZXJ5U3RyLnNwbGl0KCcmJyksIGZ1bmN0aW9uKGtleVZhbHVlKSB7XG4gICAgICAgIGlmIChrZXlWYWx1ZSkge1xuICAgICAgICAgIGtleV92YWx1ZSA9IGtleVZhbHVlLnJlcGxhY2UoL1xcKy9nLCclMjAnKS5zcGxpdCgnPScpO1xuICAgICAgICAgIGtleSA9IHRyeURlY29kZVVSSUNvbXBvbmVudChrZXlfdmFsdWVbMF0pO1xuICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChrZXkpKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gYW5ndWxhci5pc0RlZmluZWQoa2V5X3ZhbHVlWzFdKSA/IHRyeURlY29kZVVSSUNvbXBvbmVudChrZXlfdmFsdWVbMV0pIDogdHJ1ZTtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgICAgICAgb2JqW2tleV0gPSB2YWw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNBcnJheShvYmpba2V5XSkpIHtcbiAgICAgICAgICAgICAgb2JqW2tleV0ucHVzaCh2YWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb2JqW2tleV0gPSBbb2JqW2tleV0sdmFsXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gdHJ5RGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gSWdub3JlIGFueSBpbnZhbGlkIHVyaSBjb21wb25lbnRcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vY2tYaHIoKSB7XG4gIHJldHVybiBuZXcgTW9ja1hocigpO1xufVxuXG5mdW5jdGlvbiBNb2NrWGhyKCkge1xuXG4gIC8vIGhhY2sgZm9yIHRlc3RpbmcgJGh0dHAsICRodHRwQmFja2VuZFxuICBNb2NrWGhyLiQkbGFzdEluc3RhbmNlID0gdGhpcztcblxuICB0aGlzLm9wZW4gPSBmdW5jdGlvbihtZXRob2QsIHVybCwgYXN5bmMpIHtcbiAgICB0aGlzLiQkbWV0aG9kID0gbWV0aG9kO1xuICAgIHRoaXMuJCR1cmwgPSB1cmw7XG4gICAgdGhpcy4kJGFzeW5jID0gYXN5bmM7XG4gICAgdGhpcy4kJHJlcUhlYWRlcnMgPSB7fTtcbiAgICB0aGlzLiQkcmVzcEhlYWRlcnMgPSB7fTtcbiAgfTtcblxuICB0aGlzLnNlbmQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdGhpcy4kJGRhdGEgPSBkYXRhO1xuICB9O1xuXG4gIHRoaXMuc2V0UmVxdWVzdEhlYWRlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICB0aGlzLiQkcmVxSGVhZGVyc1trZXldID0gdmFsdWU7XG4gIH07XG5cbiAgdGhpcy5nZXRSZXNwb25zZUhlYWRlciA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAvLyB0aGUgbG9va3VwIG11c3QgYmUgY2FzZSBpbnNlbnNpdGl2ZSxcbiAgICAvLyB0aGF0J3Mgd2h5IHdlIHRyeSB0d28gcXVpY2sgbG9va3VwcyBmaXJzdCBhbmQgZnVsbCBzY2FuIGxhc3RcbiAgICB2YXIgaGVhZGVyID0gdGhpcy4kJHJlc3BIZWFkZXJzW25hbWVdO1xuICAgIGlmIChoZWFkZXIpIHJldHVybiBoZWFkZXI7XG5cbiAgICBuYW1lID0gYW5ndWxhci5sb3dlcmNhc2UobmFtZSk7XG4gICAgaGVhZGVyID0gdGhpcy4kJHJlc3BIZWFkZXJzW25hbWVdO1xuICAgIGlmIChoZWFkZXIpIHJldHVybiBoZWFkZXI7XG5cbiAgICBoZWFkZXIgPSB1bmRlZmluZWQ7XG4gICAgYW5ndWxhci5mb3JFYWNoKHRoaXMuJCRyZXNwSGVhZGVycywgZnVuY3Rpb24oaGVhZGVyVmFsLCBoZWFkZXJOYW1lKSB7XG4gICAgICBpZiAoIWhlYWRlciAmJiBhbmd1bGFyLmxvd2VyY2FzZShoZWFkZXJOYW1lKSA9PSBuYW1lKSBoZWFkZXIgPSBoZWFkZXJWYWw7XG4gICAgfSk7XG4gICAgcmV0dXJuIGhlYWRlcjtcbiAgfTtcblxuICB0aGlzLmdldEFsbFJlc3BvbnNlSGVhZGVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsaW5lcyA9IFtdO1xuXG4gICAgYW5ndWxhci5mb3JFYWNoKHRoaXMuJCRyZXNwSGVhZGVycywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgbGluZXMucHVzaChrZXkgKyAnOiAnICsgdmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbiAgfTtcblxuICB0aGlzLmFib3J0ID0gYW5ndWxhci5ub29wO1xuXG4gIC8vIFRoaXMgc2VjdGlvbiBzaW11bGF0ZXMgdGhlIGV2ZW50cyBvbiBhIHJlYWwgWEhSIG9iamVjdCAoYW5kIHRoZSB1cGxvYWQgb2JqZWN0KVxuICAvLyBXaGVuIHdlIGFyZSB0ZXN0aW5nICRodHRwQmFja2VuZCAoaW5zaWRlIHRoZSBhbmd1bGFyIHByb2plY3QpIHdlIG1ha2UgcGFydGlhbCB1c2Ugb2YgdGhpc1xuICAvLyBidXQgc3RvcmUgdGhlIGV2ZW50cyBkaXJlY3RseSBvdXJzZWx2ZXMgb24gYCQkZXZlbnRzYCwgaW5zdGVhZCBvZiBnb2luZyB0aHJvdWdoIHRoZSBgYWRkRXZlbnRMaXN0ZW5lcmBcbiAgdGhpcy4kJGV2ZW50cyA9IHt9O1xuICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihuYW1lLCBsaXN0ZW5lcikge1xuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHRoaXMuJCRldmVudHNbbmFtZV0pKSB0aGlzLiQkZXZlbnRzW25hbWVdID0gW107XG4gICAgdGhpcy4kJGV2ZW50c1tuYW1lXS5wdXNoKGxpc3RlbmVyKTtcbiAgfTtcblxuICB0aGlzLnVwbG9hZCA9IHtcbiAgICAkJGV2ZW50czoge30sXG4gICAgYWRkRXZlbnRMaXN0ZW5lcjogdGhpcy5hZGRFdmVudExpc3RlbmVyXG4gIH07XG59XG5cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJHRpbWVvdXRcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFRoaXMgc2VydmljZSBpcyBqdXN0IGEgc2ltcGxlIGRlY29yYXRvciBmb3Ige0BsaW5rIG5nLiR0aW1lb3V0ICR0aW1lb3V0fSBzZXJ2aWNlXG4gKiB0aGF0IGFkZHMgYSBcImZsdXNoXCIgYW5kIFwidmVyaWZ5Tm9QZW5kaW5nVGFza3NcIiBtZXRob2RzLlxuICovXG5cbmFuZ3VsYXIubW9jay4kVGltZW91dERlY29yYXRvciA9IFsnJGRlbGVnYXRlJywgJyRicm93c2VyJywgZnVuY3Rpb24oJGRlbGVnYXRlLCAkYnJvd3Nlcikge1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICR0aW1lb3V0I2ZsdXNoXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBGbHVzaGVzIHRoZSBxdWV1ZSBvZiBwZW5kaW5nIHRhc2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcj19IGRlbGF5IG1heGltdW0gdGltZW91dCBhbW91bnQgdG8gZmx1c2ggdXAgdW50aWxcbiAgICovXG4gICRkZWxlZ2F0ZS5mbHVzaCA9IGZ1bmN0aW9uKGRlbGF5KSB7XG4gICAgJGJyb3dzZXIuZGVmZXIuZmx1c2goZGVsYXkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICR0aW1lb3V0I3ZlcmlmeU5vUGVuZGluZ1Rhc2tzXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBWZXJpZmllcyB0aGF0IHRoZXJlIGFyZSBubyBwZW5kaW5nIHRhc2tzIHRoYXQgbmVlZCB0byBiZSBmbHVzaGVkLlxuICAgKi9cbiAgJGRlbGVnYXRlLnZlcmlmeU5vUGVuZGluZ1Rhc2tzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCRicm93c2VyLmRlZmVycmVkRm5zLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEZWZlcnJlZCB0YXNrcyB0byBmbHVzaCAoJyArICRicm93c2VyLmRlZmVycmVkRm5zLmxlbmd0aCArICcpOiAnICtcbiAgICAgICAgICBmb3JtYXRQZW5kaW5nVGFza3NBc1N0cmluZygkYnJvd3Nlci5kZWZlcnJlZEZucykpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBmb3JtYXRQZW5kaW5nVGFza3NBc1N0cmluZyh0YXNrcykge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBhbmd1bGFyLmZvckVhY2godGFza3MsIGZ1bmN0aW9uKHRhc2spIHtcbiAgICAgIHJlc3VsdC5wdXNoKCd7aWQ6ICcgKyB0YXNrLmlkICsgJywgJyArICd0aW1lOiAnICsgdGFzay50aW1lICsgJ30nKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQuam9pbignLCAnKTtcbiAgfVxuXG4gIHJldHVybiAkZGVsZWdhdGU7XG59XTtcblxuYW5ndWxhci5tb2NrLiRSQUZEZWNvcmF0b3IgPSBbJyRkZWxlZ2F0ZScsIGZ1bmN0aW9uKCRkZWxlZ2F0ZSkge1xuICB2YXIgcmFmRm4gPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBpbmRleCA9IHJhZkZuLnF1ZXVlLmxlbmd0aDtcbiAgICByYWZGbi5xdWV1ZS5wdXNoKGZuKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByYWZGbi5xdWV1ZS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH07XG4gIH07XG5cbiAgcmFmRm4ucXVldWUgPSBbXTtcbiAgcmFmRm4uc3VwcG9ydGVkID0gJGRlbGVnYXRlLnN1cHBvcnRlZDtcblxuICByYWZGbi5mbHVzaCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChyYWZGbi5xdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gckFGIGNhbGxiYWNrcyBwcmVzZW50Jyk7XG4gICAgfVxuXG4gICAgdmFyIGxlbmd0aCA9IHJhZkZuLnF1ZXVlLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByYWZGbi5xdWV1ZVtpXSgpO1xuICAgIH1cblxuICAgIHJhZkZuLnF1ZXVlID0gcmFmRm4ucXVldWUuc2xpY2UoaSk7XG4gIH07XG5cbiAgcmV0dXJuIHJhZkZuO1xufV07XG5cbi8qKlxuICpcbiAqL1xudmFyIG9yaWdpbmFsUm9vdEVsZW1lbnQ7XG5hbmd1bGFyLm1vY2suJFJvb3RFbGVtZW50UHJvdmlkZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy4kZ2V0ID0gWyckaW5qZWN0b3InLCBmdW5jdGlvbigkaW5qZWN0b3IpIHtcbiAgICBvcmlnaW5hbFJvb3RFbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2IG5nLWFwcD48L2Rpdj4nKS5kYXRhKCckaW5qZWN0b3InLCAkaW5qZWN0b3IpO1xuICAgIHJldHVybiBvcmlnaW5hbFJvb3RFbGVtZW50O1xuICB9XTtcbn07XG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lICRjb250cm9sbGVyXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZGVjb3JhdG9yIGZvciB7QGxpbmsgbmcuJGNvbnRyb2xsZXJ9IHdpdGggYWRkaXRpb25hbCBgYmluZGluZ3NgIHBhcmFtZXRlciwgdXNlZnVsIHdoZW4gdGVzdGluZ1xuICogY29udHJvbGxlcnMgb2YgZGlyZWN0aXZlcyB0aGF0IHVzZSB7QGxpbmsgJGNvbXBpbGUjLWJpbmR0b2NvbnRyb2xsZXItIGBiaW5kVG9Db250cm9sbGVyYH0uXG4gKlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiBgYGBqc1xuICpcbiAqIC8vIERpcmVjdGl2ZSBkZWZpbml0aW9uIC4uLlxuICpcbiAqIG15TW9kLmRpcmVjdGl2ZSgnbXlEaXJlY3RpdmUnLCB7XG4gKiAgIGNvbnRyb2xsZXI6ICdNeURpcmVjdGl2ZUNvbnRyb2xsZXInLFxuICogICBiaW5kVG9Db250cm9sbGVyOiB7XG4gKiAgICAgbmFtZTogJ0AnXG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqXG4gKiAvLyBDb250cm9sbGVyIGRlZmluaXRpb24gLi4uXG4gKlxuICogbXlNb2QuY29udHJvbGxlcignTXlEaXJlY3RpdmVDb250cm9sbGVyJywgWyckbG9nJywgZnVuY3Rpb24oJGxvZykge1xuICogICAkbG9nLmluZm8odGhpcy5uYW1lKTtcbiAqIH1dKTtcbiAqXG4gKlxuICogLy8gSW4gYSB0ZXN0IC4uLlxuICpcbiAqIGRlc2NyaWJlKCdteURpcmVjdGl2ZUNvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcbiAqICAgaXQoJ3Nob3VsZCB3cml0ZSB0aGUgYm91bmQgbmFtZSB0byB0aGUgbG9nJywgaW5qZWN0KGZ1bmN0aW9uKCRjb250cm9sbGVyLCAkbG9nKSB7XG4gKiAgICAgdmFyIGN0cmwgPSAkY29udHJvbGxlcignTXlEaXJlY3RpdmVDb250cm9sbGVyJywgeyAvKiBubyBsb2NhbHMgJiM0MjsvIH0sIHsgbmFtZTogJ0NsYXJrIEtlbnQnIH0pO1xuICogICAgIGV4cGVjdChjdHJsLm5hbWUpLnRvRXF1YWwoJ0NsYXJrIEtlbnQnKTtcbiAqICAgICBleHBlY3QoJGxvZy5pbmZvLmxvZ3MpLnRvRXF1YWwoWydDbGFyayBLZW50J10pO1xuICogICB9KSk7XG4gKiB9KTtcbiAqXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gY29uc3RydWN0b3IgSWYgY2FsbGVkIHdpdGggYSBmdW5jdGlvbiB0aGVuIGl0J3MgY29uc2lkZXJlZCB0byBiZSB0aGVcbiAqICAgIGNvbnRyb2xsZXIgY29uc3RydWN0b3IgZnVuY3Rpb24uIE90aGVyd2lzZSBpdCdzIGNvbnNpZGVyZWQgdG8gYmUgYSBzdHJpbmcgd2hpY2ggaXMgdXNlZFxuICogICAgdG8gcmV0cmlldmUgdGhlIGNvbnRyb2xsZXIgY29uc3RydWN0b3IgdXNpbmcgdGhlIGZvbGxvd2luZyBzdGVwczpcbiAqXG4gKiAgICAqIGNoZWNrIGlmIGEgY29udHJvbGxlciB3aXRoIGdpdmVuIG5hbWUgaXMgcmVnaXN0ZXJlZCB2aWEgYCRjb250cm9sbGVyUHJvdmlkZXJgXG4gKiAgICAqIGNoZWNrIGlmIGV2YWx1YXRpbmcgdGhlIHN0cmluZyBvbiB0aGUgY3VycmVudCBzY29wZSByZXR1cm5zIGEgY29uc3RydWN0b3JcbiAqICAgICogaWYgJGNvbnRyb2xsZXJQcm92aWRlciNhbGxvd0dsb2JhbHMsIGNoZWNrIGB3aW5kb3dbY29uc3RydWN0b3JdYCBvbiB0aGUgZ2xvYmFsXG4gKiAgICAgIGB3aW5kb3dgIG9iamVjdCAobm90IHJlY29tbWVuZGVkKVxuICpcbiAqICAgIFRoZSBzdHJpbmcgY2FuIHVzZSB0aGUgYGNvbnRyb2xsZXIgYXMgcHJvcGVydHlgIHN5bnRheCwgd2hlcmUgdGhlIGNvbnRyb2xsZXIgaW5zdGFuY2UgaXMgcHVibGlzaGVkXG4gKiAgICBhcyB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IG9uIHRoZSBgc2NvcGVgOyB0aGUgYHNjb3BlYCBtdXN0IGJlIGluamVjdGVkIGludG8gYGxvY2Fsc2AgcGFyYW0gZm9yIHRoaXNcbiAqICAgIHRvIHdvcmsgY29ycmVjdGx5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBsb2NhbHMgSW5qZWN0aW9uIGxvY2FscyBmb3IgQ29udHJvbGxlci5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gYmluZGluZ3MgUHJvcGVydGllcyB0byBhZGQgdG8gdGhlIGNvbnRyb2xsZXIgYmVmb3JlIGludm9raW5nIHRoZSBjb25zdHJ1Y3Rvci4gVGhpcyBpcyB1c2VkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIHNpbXVsYXRlIHRoZSBgYmluZFRvQ29udHJvbGxlcmAgZmVhdHVyZSBhbmQgc2ltcGxpZnkgY2VydGFpbiBraW5kcyBvZiB0ZXN0cy5cbiAqIEByZXR1cm4ge09iamVjdH0gSW5zdGFuY2Ugb2YgZ2l2ZW4gY29udHJvbGxlci5cbiAqL1xuYW5ndWxhci5tb2NrLiRDb250cm9sbGVyRGVjb3JhdG9yID0gWyckZGVsZWdhdGUnLCBmdW5jdGlvbigkZGVsZWdhdGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGV4cHJlc3Npb24sIGxvY2FscywgbGF0ZXIsIGlkZW50KSB7XG4gICAgaWYgKGxhdGVyICYmIHR5cGVvZiBsYXRlciA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBjcmVhdGUgPSAkZGVsZWdhdGUoZXhwcmVzc2lvbiwgbG9jYWxzLCB0cnVlLCBpZGVudCk7XG4gICAgICBhbmd1bGFyLmV4dGVuZChjcmVhdGUuaW5zdGFuY2UsIGxhdGVyKTtcbiAgICAgIHJldHVybiBjcmVhdGUoKTtcbiAgICB9XG4gICAgcmV0dXJuICRkZWxlZ2F0ZShleHByZXNzaW9uLCBsb2NhbHMsIGxhdGVyLCBpZGVudCk7XG4gIH07XG59XTtcblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJGNvbXBvbmVudENvbnRyb2xsZXJcbiAqIEBkZXNjcmlwdGlvblxuICogQSBzZXJ2aWNlIHRoYXQgY2FuIGJlIHVzZWQgdG8gY3JlYXRlIGluc3RhbmNlcyBvZiBjb21wb25lbnQgY29udHJvbGxlcnMuXG4gKiA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtaW5mb1wiPlxuICogQmUgYXdhcmUgdGhhdCB0aGUgY29udHJvbGxlciB3aWxsIGJlIGluc3RhbnRpYXRlZCBhbmQgYXR0YWNoZWQgdG8gdGhlIHNjb3BlIGFzIHNwZWNpZmllZCBpblxuICogdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uIG9iamVjdC4gSWYgeW91IGRvIG5vdCBwcm92aWRlIGEgYCRzY29wZWAgb2JqZWN0IGluIHRoZSBgbG9jYWxzYCBwYXJhbVxuICogdGhlbiB0aGUgaGVscGVyIHdpbGwgY3JlYXRlIGEgbmV3IGlzb2xhdGVkIHNjb3BlIGFzIGEgY2hpbGQgb2YgYCRyb290U2NvcGVgLlxuICogPC9kaXY+XG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSB0aGUgbmFtZSBvZiB0aGUgY29tcG9uZW50IHdob3NlIGNvbnRyb2xsZXIgd2Ugd2FudCB0byBpbnN0YW50aWF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGxvY2FscyBJbmplY3Rpb24gbG9jYWxzIGZvciBDb250cm9sbGVyLlxuICogQHBhcmFtIHtPYmplY3Q9fSBiaW5kaW5ncyBQcm9wZXJ0aWVzIHRvIGFkZCB0byB0aGUgY29udHJvbGxlciBiZWZvcmUgaW52b2tpbmcgdGhlIGNvbnN0cnVjdG9yLiBUaGlzIGlzIHVzZWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gc2ltdWxhdGUgdGhlIGBiaW5kVG9Db250cm9sbGVyYCBmZWF0dXJlIGFuZCBzaW1wbGlmeSBjZXJ0YWluIGtpbmRzIG9mIHRlc3RzLlxuICogQHBhcmFtIHtzdHJpbmc9fSBpZGVudCBPdmVycmlkZSB0aGUgcHJvcGVydHkgbmFtZSB0byB1c2Ugd2hlbiBhdHRhY2hpbmcgdGhlIGNvbnRyb2xsZXIgdG8gdGhlIHNjb3BlLlxuICogQHJldHVybiB7T2JqZWN0fSBJbnN0YW5jZSBvZiByZXF1ZXN0ZWQgY29udHJvbGxlci5cbiAqL1xuYW5ndWxhci5tb2NrLiRDb21wb25lbnRDb250cm9sbGVyUHJvdmlkZXIgPSBbJyRjb21waWxlUHJvdmlkZXInLCBmdW5jdGlvbigkY29tcGlsZVByb3ZpZGVyKSB7XG4gIHRoaXMuJGdldCA9IFsnJGNvbnRyb2xsZXInLCckaW5qZWN0b3InLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uKCRjb250cm9sbGVyLCAkaW5qZWN0b3IsICRyb290U2NvcGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gJGNvbXBvbmVudENvbnRyb2xsZXIoY29tcG9uZW50TmFtZSwgbG9jYWxzLCBiaW5kaW5ncywgaWRlbnQpIHtcbiAgICAgIC8vIGdldCBhbGwgZGlyZWN0aXZlcyBhc3NvY2lhdGVkIHRvIHRoZSBjb21wb25lbnQgbmFtZVxuICAgICAgdmFyIGRpcmVjdGl2ZXMgPSAkaW5qZWN0b3IuZ2V0KGNvbXBvbmVudE5hbWUgKyAnRGlyZWN0aXZlJyk7XG4gICAgICAvLyBsb29rIGZvciB0aG9zZSBkaXJlY3RpdmVzIHRoYXQgYXJlIGNvbXBvbmVudHNcbiAgICAgIHZhciBjYW5kaWRhdGVEaXJlY3RpdmVzID0gZGlyZWN0aXZlcy5maWx0ZXIoZnVuY3Rpb24oZGlyZWN0aXZlSW5mbykge1xuICAgICAgICAvLyBjb21wb25lbnRzIGhhdmUgY29udHJvbGxlciwgY29udHJvbGxlckFzIGFuZCByZXN0cmljdDonRSdcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZUluZm8uY29udHJvbGxlciAmJiBkaXJlY3RpdmVJbmZvLmNvbnRyb2xsZXJBcyAmJiBkaXJlY3RpdmVJbmZvLnJlc3RyaWN0ID09PSAnRSc7XG4gICAgICB9KTtcbiAgICAgIC8vIGNoZWNrIGlmIHZhbGlkIGRpcmVjdGl2ZXMgZm91bmRcbiAgICAgIGlmIChjYW5kaWRhdGVEaXJlY3RpdmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGNvbXBvbmVudCBmb3VuZCcpO1xuICAgICAgfVxuICAgICAgaWYgKGNhbmRpZGF0ZURpcmVjdGl2ZXMubGVuZ3RoID4gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvbyBtYW55IGNvbXBvbmVudHMgZm91bmQnKTtcbiAgICAgIH1cbiAgICAgIC8vIGdldCB0aGUgaW5mbyBvZiB0aGUgY29tcG9uZW50XG4gICAgICB2YXIgZGlyZWN0aXZlSW5mbyA9IGNhbmRpZGF0ZURpcmVjdGl2ZXNbMF07XG4gICAgICAvLyBjcmVhdGUgYSBzY29wZSBpZiBuZWVkZWRcbiAgICAgIGxvY2FscyA9IGxvY2FscyB8fCB7fTtcbiAgICAgIGxvY2Fscy4kc2NvcGUgPSBsb2NhbHMuJHNjb3BlIHx8ICRyb290U2NvcGUuJG5ldyh0cnVlKTtcbiAgICAgIHJldHVybiAkY29udHJvbGxlcihkaXJlY3RpdmVJbmZvLmNvbnRyb2xsZXIsIGxvY2FscywgYmluZGluZ3MsIGlkZW50IHx8IGRpcmVjdGl2ZUluZm8uY29udHJvbGxlckFzKTtcbiAgICB9O1xuICB9XTtcbn1dO1xuXG5cbi8qKlxuICogQG5nZG9jIG1vZHVsZVxuICogQG5hbWUgbmdNb2NrXG4gKiBAcGFja2FnZU5hbWUgYW5ndWxhci1tb2Nrc1xuICogQGRlc2NyaXB0aW9uXG4gKlxuICogIyBuZ01vY2tcbiAqXG4gKiBUaGUgYG5nTW9ja2AgbW9kdWxlIHByb3ZpZGVzIHN1cHBvcnQgdG8gaW5qZWN0IGFuZCBtb2NrIEFuZ3VsYXIgc2VydmljZXMgaW50byB1bml0IHRlc3RzLlxuICogSW4gYWRkaXRpb24sIG5nTW9jayBhbHNvIGV4dGVuZHMgdmFyaW91cyBjb3JlIG5nIHNlcnZpY2VzIHN1Y2ggdGhhdCB0aGV5IGNhbiBiZVxuICogaW5zcGVjdGVkIGFuZCBjb250cm9sbGVkIGluIGEgc3luY2hyb25vdXMgbWFubmVyIHdpdGhpbiB0ZXN0IGNvZGUuXG4gKlxuICpcbiAqIDxkaXYgZG9jLW1vZHVsZS1jb21wb25lbnRzPVwibmdNb2NrXCI+PC9kaXY+XG4gKlxuICovXG5hbmd1bGFyLm1vZHVsZSgnbmdNb2NrJywgWyduZyddKS5wcm92aWRlcih7XG4gICRicm93c2VyOiBhbmd1bGFyLm1vY2suJEJyb3dzZXJQcm92aWRlcixcbiAgJGV4Y2VwdGlvbkhhbmRsZXI6IGFuZ3VsYXIubW9jay4kRXhjZXB0aW9uSGFuZGxlclByb3ZpZGVyLFxuICAkbG9nOiBhbmd1bGFyLm1vY2suJExvZ1Byb3ZpZGVyLFxuICAkaW50ZXJ2YWw6IGFuZ3VsYXIubW9jay4kSW50ZXJ2YWxQcm92aWRlcixcbiAgJGh0dHBCYWNrZW5kOiBhbmd1bGFyLm1vY2suJEh0dHBCYWNrZW5kUHJvdmlkZXIsXG4gICRyb290RWxlbWVudDogYW5ndWxhci5tb2NrLiRSb290RWxlbWVudFByb3ZpZGVyLFxuICAkY29tcG9uZW50Q29udHJvbGxlcjogYW5ndWxhci5tb2NrLiRDb21wb25lbnRDb250cm9sbGVyUHJvdmlkZXJcbn0pLmNvbmZpZyhbJyRwcm92aWRlJywgZnVuY3Rpb24oJHByb3ZpZGUpIHtcbiAgJHByb3ZpZGUuZGVjb3JhdG9yKCckdGltZW91dCcsIGFuZ3VsYXIubW9jay4kVGltZW91dERlY29yYXRvcik7XG4gICRwcm92aWRlLmRlY29yYXRvcignJCRyQUYnLCBhbmd1bGFyLm1vY2suJFJBRkRlY29yYXRvcik7XG4gICRwcm92aWRlLmRlY29yYXRvcignJHJvb3RTY29wZScsIGFuZ3VsYXIubW9jay4kUm9vdFNjb3BlRGVjb3JhdG9yKTtcbiAgJHByb3ZpZGUuZGVjb3JhdG9yKCckY29udHJvbGxlcicsIGFuZ3VsYXIubW9jay4kQ29udHJvbGxlckRlY29yYXRvcik7XG59XSk7XG5cbi8qKlxuICogQG5nZG9jIG1vZHVsZVxuICogQG5hbWUgbmdNb2NrRTJFXG4gKiBAbW9kdWxlIG5nTW9ja0UyRVxuICogQHBhY2thZ2VOYW1lIGFuZ3VsYXItbW9ja3NcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFRoZSBgbmdNb2NrRTJFYCBpcyBhbiBhbmd1bGFyIG1vZHVsZSB3aGljaCBjb250YWlucyBtb2NrcyBzdWl0YWJsZSBmb3IgZW5kLXRvLWVuZCB0ZXN0aW5nLlxuICogQ3VycmVudGx5IHRoZXJlIGlzIG9ubHkgb25lIG1vY2sgcHJlc2VudCBpbiB0aGlzIG1vZHVsZSAtXG4gKiB0aGUge0BsaW5rIG5nTW9ja0UyRS4kaHR0cEJhY2tlbmQgZTJlICRodHRwQmFja2VuZH0gbW9jay5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ25nTW9ja0UyRScsIFsnbmcnXSkuY29uZmlnKFsnJHByb3ZpZGUnLCBmdW5jdGlvbigkcHJvdmlkZSkge1xuICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRodHRwQmFja2VuZCcsIGFuZ3VsYXIubW9jay5lMmUuJGh0dHBCYWNrZW5kRGVjb3JhdG9yKTtcbn1dKTtcblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJGh0dHBCYWNrZW5kXG4gKiBAbW9kdWxlIG5nTW9ja0UyRVxuICogQGRlc2NyaXB0aW9uXG4gKiBGYWtlIEhUVFAgYmFja2VuZCBpbXBsZW1lbnRhdGlvbiBzdWl0YWJsZSBmb3IgZW5kLXRvLWVuZCB0ZXN0aW5nIG9yIGJhY2tlbmQtbGVzcyBkZXZlbG9wbWVudCBvZlxuICogYXBwbGljYXRpb25zIHRoYXQgdXNlIHRoZSB7QGxpbmsgbmcuJGh0dHAgJGh0dHAgc2VydmljZX0uXG4gKlxuICogKk5vdGUqOiBGb3IgZmFrZSBodHRwIGJhY2tlbmQgaW1wbGVtZW50YXRpb24gc3VpdGFibGUgZm9yIHVuaXQgdGVzdGluZyBwbGVhc2Ugc2VlXG4gKiB7QGxpbmsgbmdNb2NrLiRodHRwQmFja2VuZCB1bml0LXRlc3RpbmcgJGh0dHBCYWNrZW5kIG1vY2t9LlxuICpcbiAqIFRoaXMgaW1wbGVtZW50YXRpb24gY2FuIGJlIHVzZWQgdG8gcmVzcG9uZCB3aXRoIHN0YXRpYyBvciBkeW5hbWljIHJlc3BvbnNlcyB2aWEgdGhlIGB3aGVuYCBhcGlcbiAqIGFuZCBpdHMgc2hvcnRjdXRzIChgd2hlbkdFVGAsIGB3aGVuUE9TVGAsIGV0YykgYW5kIG9wdGlvbmFsbHkgcGFzcyB0aHJvdWdoIHJlcXVlc3RzIHRvIHRoZVxuICogcmVhbCAkaHR0cEJhY2tlbmQgZm9yIHNwZWNpZmljIHJlcXVlc3RzIChlLmcuIHRvIGludGVyYWN0IHdpdGggY2VydGFpbiByZW1vdGUgYXBpcyBvciB0byBmZXRjaFxuICogdGVtcGxhdGVzIGZyb20gYSB3ZWJzZXJ2ZXIpLlxuICpcbiAqIEFzIG9wcG9zZWQgdG8gdW5pdC10ZXN0aW5nLCBpbiBhbiBlbmQtdG8tZW5kIHRlc3Rpbmcgc2NlbmFyaW8gb3IgaW4gc2NlbmFyaW8gd2hlbiBhbiBhcHBsaWNhdGlvblxuICogaXMgYmVpbmcgZGV2ZWxvcGVkIHdpdGggdGhlIHJlYWwgYmFja2VuZCBhcGkgcmVwbGFjZWQgd2l0aCBhIG1vY2ssIGl0IGlzIG9mdGVuIGRlc2lyYWJsZSBmb3JcbiAqIGNlcnRhaW4gY2F0ZWdvcnkgb2YgcmVxdWVzdHMgdG8gYnlwYXNzIHRoZSBtb2NrIGFuZCBpc3N1ZSBhIHJlYWwgaHR0cCByZXF1ZXN0IChlLmcuIHRvIGZldGNoXG4gKiB0ZW1wbGF0ZXMgb3Igc3RhdGljIGZpbGVzIGZyb20gdGhlIHdlYnNlcnZlcikuIFRvIGNvbmZpZ3VyZSB0aGUgYmFja2VuZCB3aXRoIHRoaXMgYmVoYXZpb3JcbiAqIHVzZSB0aGUgYHBhc3NUaHJvdWdoYCByZXF1ZXN0IGhhbmRsZXIgb2YgYHdoZW5gIGluc3RlYWQgb2YgYHJlc3BvbmRgLlxuICpcbiAqIEFkZGl0aW9uYWxseSwgd2UgZG9uJ3Qgd2FudCB0byBtYW51YWxseSBoYXZlIHRvIGZsdXNoIG1vY2tlZCBvdXQgcmVxdWVzdHMgbGlrZSB3ZSBkbyBkdXJpbmcgdW5pdFxuICogdGVzdGluZy4gRm9yIHRoaXMgcmVhc29uIHRoZSBlMmUgJGh0dHBCYWNrZW5kIGZsdXNoZXMgbW9ja2VkIG91dCByZXF1ZXN0c1xuICogYXV0b21hdGljYWxseSwgY2xvc2VseSBzaW11bGF0aW5nIHRoZSBiZWhhdmlvciBvZiB0aGUgWE1MSHR0cFJlcXVlc3Qgb2JqZWN0LlxuICpcbiAqIFRvIHNldHVwIHRoZSBhcHBsaWNhdGlvbiB0byBydW4gd2l0aCB0aGlzIGh0dHAgYmFja2VuZCwgeW91IGhhdmUgdG8gY3JlYXRlIGEgbW9kdWxlIHRoYXQgZGVwZW5kc1xuICogb24gdGhlIGBuZ01vY2tFMkVgIGFuZCB5b3VyIGFwcGxpY2F0aW9uIG1vZHVsZXMgYW5kIGRlZmluZXMgdGhlIGZha2UgYmFja2VuZDpcbiAqXG4gKiBgYGBqc1xuICogICBteUFwcERldiA9IGFuZ3VsYXIubW9kdWxlKCdteUFwcERldicsIFsnbXlBcHAnLCAnbmdNb2NrRTJFJ10pO1xuICogICBteUFwcERldi5ydW4oZnVuY3Rpb24oJGh0dHBCYWNrZW5kKSB7XG4gKiAgICAgcGhvbmVzID0gW3tuYW1lOiAncGhvbmUxJ30sIHtuYW1lOiAncGhvbmUyJ31dO1xuICpcbiAqICAgICAvLyByZXR1cm5zIHRoZSBjdXJyZW50IGxpc3Qgb2YgcGhvbmVzXG4gKiAgICAgJGh0dHBCYWNrZW5kLndoZW5HRVQoJy9waG9uZXMnKS5yZXNwb25kKHBob25lcyk7XG4gKlxuICogICAgIC8vIGFkZHMgYSBuZXcgcGhvbmUgdG8gdGhlIHBob25lcyBhcnJheVxuICogICAgICRodHRwQmFja2VuZC53aGVuUE9TVCgnL3Bob25lcycpLnJlc3BvbmQoZnVuY3Rpb24obWV0aG9kLCB1cmwsIGRhdGEpIHtcbiAqICAgICAgIHZhciBwaG9uZSA9IGFuZ3VsYXIuZnJvbUpzb24oZGF0YSk7XG4gKiAgICAgICBwaG9uZXMucHVzaChwaG9uZSk7XG4gKiAgICAgICByZXR1cm4gWzIwMCwgcGhvbmUsIHt9XTtcbiAqICAgICB9KTtcbiAqICAgICAkaHR0cEJhY2tlbmQud2hlbkdFVCgvXlxcL3RlbXBsYXRlc1xcLy8pLnBhc3NUaHJvdWdoKCk7XG4gKiAgICAgLy8uLi5cbiAqICAgfSk7XG4gKiBgYGBcbiAqXG4gKiBBZnRlcndhcmRzLCBib290c3RyYXAgeW91ciBhcHAgd2l0aCB0aGlzIG5ldyBtb2R1bGUuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgbWV0aG9kXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlblxuICogQG1vZHVsZSBuZ01vY2tFMkVcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIG5ldyBiYWNrZW5kIGRlZmluaXRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCBIVFRQIG1ldGhvZC5cbiAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpfSB1cmwgSFRUUCB1cmwgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIHVybFxuICogICBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSB1cmwgbWF0Y2hlcyB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCk9fSBkYXRhIEhUVFAgcmVxdWVzdCBib2R5LlxuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBodHRwIGhlYWRlclxuICogICBvYmplY3QgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgaGVhZGVycyBtYXRjaCB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICogQHBhcmFtIHsoQXJyYXkpPX0ga2V5cyBBcnJheSBvZiBrZXlzIHRvIGFzc2lnbiB0byByZWdleCBtYXRjaGVzIGluIHJlcXVlc3QgdXJsIGRlc2NyaWJlZCBvblxuICogICB7QGxpbmsgbmdNb2NrLiRodHRwQmFja2VuZCAkaHR0cEJhY2tlbmQgbW9ja30uXG4gKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIGFuZCBgcGFzc1Rocm91Z2hgIG1ldGhvZHMgdGhhdFxuICogICBjb250cm9sIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLiBZb3UgY2FuIHNhdmUgdGhpcyBvYmplY3QgZm9yIGxhdGVyIHVzZSBhbmQgaW52b2tlXG4gKiAgIGByZXNwb25kYCBvciBgcGFzc1Rocm91Z2hgIGFnYWluIGluIG9yZGVyIHRvIGNoYW5nZSBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAqXG4gKiAgLSByZXNwb25kIOKAk1xuICogICAgYGBgXG4gKiAgICB7IGZ1bmN0aW9uKFtzdGF0dXMsXSBkYXRhWywgaGVhZGVycywgc3RhdHVzVGV4dF0pXG4gKiAgICB8IGZ1bmN0aW9uKGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBkYXRhLCBoZWFkZXJzLCBwYXJhbXMpfVxuICogICAgYGBgXG4gKiAgICDigJMgVGhlIHJlc3BvbmQgbWV0aG9kIHRha2VzIGEgc2V0IG9mIHN0YXRpYyBkYXRhIHRvIGJlIHJldHVybmVkIG9yIGEgZnVuY3Rpb24gdGhhdCBjYW4gcmV0dXJuXG4gKiAgICBhbiBhcnJheSBjb250YWluaW5nIHJlc3BvbnNlIHN0YXR1cyAobnVtYmVyKSwgcmVzcG9uc2UgZGF0YSAoQXJyYXl8T2JqZWN0fHN0cmluZyksIHJlc3BvbnNlXG4gKiAgICBoZWFkZXJzIChPYmplY3QpLCBhbmQgdGhlIHRleHQgZm9yIHRoZSBzdGF0dXMgKHN0cmluZykuXG4gKiAgLSBwYXNzVGhyb3VnaCDigJMgYHtmdW5jdGlvbigpfWAg4oCTIEFueSByZXF1ZXN0IG1hdGNoaW5nIGEgYmFja2VuZCBkZWZpbml0aW9uIHdpdGhcbiAqICAgIGBwYXNzVGhyb3VnaGAgaGFuZGxlciB3aWxsIGJlIHBhc3NlZCB0aHJvdWdoIHRvIHRoZSByZWFsIGJhY2tlbmQgKGFuIFhIUiByZXF1ZXN0IHdpbGwgYmUgbWFkZVxuICogICAgdG8gdGhlIHNlcnZlci4pXG4gKiAgLSBCb3RoIG1ldGhvZHMgcmV0dXJuIHRoZSBgcmVxdWVzdEhhbmRsZXJgIG9iamVjdCBmb3IgcG9zc2libGUgb3ZlcnJpZGVzLlxuICovXG5cbi8qKlxuICogQG5nZG9jIG1ldGhvZFxuICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5HRVRcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBHRVQgcmVxdWVzdHMuIEZvciBtb3JlIGluZm8gc2VlIGB3aGVuKClgLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cHxmdW5jdGlvbihzdHJpbmcpfSB1cmwgSFRUUCB1cmwgb3IgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIHVybFxuICogICBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSB1cmwgbWF0Y2hlcyB0aGUgY3VycmVudCBkZWZpbml0aW9uLlxuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKE9iamVjdCkpPX0gaGVhZGVycyBIVFRQIGhlYWRlcnMuXG4gKiBAcGFyYW0geyhBcnJheSk9fSBrZXlzIEFycmF5IG9mIGtleXMgdG8gYXNzaWduIHRvIHJlZ2V4IG1hdGNoZXMgaW4gcmVxdWVzdCB1cmwgZGVzY3JpYmVkIG9uXG4gKiAgIHtAbGluayBuZ01vY2suJGh0dHBCYWNrZW5kICRodHRwQmFja2VuZCBtb2NrfS5cbiAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgYW5kIGBwYXNzVGhyb3VnaGAgbWV0aG9kcyB0aGF0XG4gKiAgIGNvbnRyb2wgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuIFlvdSBjYW4gc2F2ZSB0aGlzIG9iamVjdCBmb3IgbGF0ZXIgdXNlIGFuZCBpbnZva2VcbiAqICAgYHJlc3BvbmRgIG9yIGBwYXNzVGhyb3VnaGAgYWdhaW4gaW4gb3JkZXIgdG8gY2hhbmdlIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICovXG5cbi8qKlxuICogQG5nZG9jIG1ldGhvZFxuICogQG5hbWUgJGh0dHBCYWNrZW5kI3doZW5IRUFEXG4gKiBAbW9kdWxlIG5nTW9ja0UyRVxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgSEVBRCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl9IHVybCBIVFRQIHVybCBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgdXJsXG4gKiAgIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIHVybCBtYXRjaGVzIHRoZSBjdXJyZW50IGRlZmluaXRpb24uXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAqIEBwYXJhbSB7KEFycmF5KT19IGtleXMgQXJyYXkgb2Yga2V5cyB0byBhc3NpZ24gdG8gcmVnZXggbWF0Y2hlcyBpbiByZXF1ZXN0IHVybCBkZXNjcmliZWQgb25cbiAqICAge0BsaW5rIG5nTW9jay4kaHR0cEJhY2tlbmQgJGh0dHBCYWNrZW5kIG1vY2t9LlxuICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBhbmQgYHBhc3NUaHJvdWdoYCBtZXRob2RzIHRoYXRcbiAqICAgY29udHJvbCBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC4gWW91IGNhbiBzYXZlIHRoaXMgb2JqZWN0IGZvciBsYXRlciB1c2UgYW5kIGludm9rZVxuICogICBgcmVzcG9uZGAgb3IgYHBhc3NUaHJvdWdoYCBhZ2FpbiBpbiBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgbWV0aG9kXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlbkRFTEVURVxuICogQG1vZHVsZSBuZ01vY2tFMkVcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIG5ldyBiYWNrZW5kIGRlZmluaXRpb24gZm9yIERFTEVURSByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl9IHVybCBIVFRQIHVybCBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgdXJsXG4gKiAgIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIHVybCBtYXRjaGVzIHRoZSBjdXJyZW50IGRlZmluaXRpb24uXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAqIEBwYXJhbSB7KEFycmF5KT19IGtleXMgQXJyYXkgb2Yga2V5cyB0byBhc3NpZ24gdG8gcmVnZXggbWF0Y2hlcyBpbiByZXF1ZXN0IHVybCBkZXNjcmliZWQgb25cbiAqICAge0BsaW5rIG5nTW9jay4kaHR0cEJhY2tlbmQgJGh0dHBCYWNrZW5kIG1vY2t9LlxuICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBhbmQgYHBhc3NUaHJvdWdoYCBtZXRob2RzIHRoYXRcbiAqICAgY29udHJvbCBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC4gWW91IGNhbiBzYXZlIHRoaXMgb2JqZWN0IGZvciBsYXRlciB1c2UgYW5kIGludm9rZVxuICogICBgcmVzcG9uZGAgb3IgYHBhc3NUaHJvdWdoYCBhZ2FpbiBpbiBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgbWV0aG9kXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlblBPU1RcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBQT1NUIHJlcXVlc3RzLiBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKX0gdXJsIEhUVFAgdXJsIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSB1cmxcbiAqICAgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgdXJsIG1hdGNoZXMgdGhlIGN1cnJlbnQgZGVmaW5pdGlvbi5cbiAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keS5cbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICogQHBhcmFtIHsoQXJyYXkpPX0ga2V5cyBBcnJheSBvZiBrZXlzIHRvIGFzc2lnbiB0byByZWdleCBtYXRjaGVzIGluIHJlcXVlc3QgdXJsIGRlc2NyaWJlZCBvblxuICogICB7QGxpbmsgbmdNb2NrLiRodHRwQmFja2VuZCAkaHR0cEJhY2tlbmQgbW9ja30uXG4gKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIGFuZCBgcGFzc1Rocm91Z2hgIG1ldGhvZHMgdGhhdFxuICogICBjb250cm9sIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLiBZb3UgY2FuIHNhdmUgdGhpcyBvYmplY3QgZm9yIGxhdGVyIHVzZSBhbmQgaW52b2tlXG4gKiAgIGByZXNwb25kYCBvciBgcGFzc1Rocm91Z2hgIGFnYWluIGluIG9yZGVyIHRvIGNoYW5nZSBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBtZXRob2RcbiAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuUFVUXG4gKiBAbW9kdWxlIG5nTW9ja0UyRVxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgUFVUIHJlcXVlc3RzLiAgRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl9IHVybCBIVFRQIHVybCBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgdXJsXG4gKiAgIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIHVybCBtYXRjaGVzIHRoZSBjdXJyZW50IGRlZmluaXRpb24uXG4gKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKT19IGRhdGEgSFRUUCByZXF1ZXN0IGJvZHkuXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24oT2JqZWN0KSk9fSBoZWFkZXJzIEhUVFAgaGVhZGVycy5cbiAqIEBwYXJhbSB7KEFycmF5KT19IGtleXMgQXJyYXkgb2Yga2V5cyB0byBhc3NpZ24gdG8gcmVnZXggbWF0Y2hlcyBpbiByZXF1ZXN0IHVybCBkZXNjcmliZWQgb25cbiAqICAge0BsaW5rIG5nTW9jay4kaHR0cEJhY2tlbmQgJGh0dHBCYWNrZW5kIG1vY2t9LlxuICogQHJldHVybnMge3JlcXVlc3RIYW5kbGVyfSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGByZXNwb25kYCBhbmQgYHBhc3NUaHJvdWdoYCBtZXRob2RzIHRoYXRcbiAqICAgY29udHJvbCBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC4gWW91IGNhbiBzYXZlIHRoaXMgb2JqZWN0IGZvciBsYXRlciB1c2UgYW5kIGludm9rZVxuICogICBgcmVzcG9uZGAgb3IgYHBhc3NUaHJvdWdoYCBhZ2FpbiBpbiBvcmRlciB0byBjaGFuZ2UgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgbWV0aG9kXG4gKiBAbmFtZSAkaHR0cEJhY2tlbmQjd2hlblBBVENIXG4gKiBAbW9kdWxlIG5nTW9ja0UyRVxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgbmV3IGJhY2tlbmQgZGVmaW5pdGlvbiBmb3IgUEFUQ0ggcmVxdWVzdHMuICBGb3IgbW9yZSBpbmZvIHNlZSBgd2hlbigpYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB8ZnVuY3Rpb24oc3RyaW5nKX0gdXJsIEhUVFAgdXJsIG9yIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSB1cmxcbiAqICAgYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgdXJsIG1hdGNoZXMgdGhlIGN1cnJlbnQgZGVmaW5pdGlvbi5cbiAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApPX0gZGF0YSBIVFRQIHJlcXVlc3QgYm9keS5cbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbihPYmplY3QpKT19IGhlYWRlcnMgSFRUUCBoZWFkZXJzLlxuICogQHBhcmFtIHsoQXJyYXkpPX0ga2V5cyBBcnJheSBvZiBrZXlzIHRvIGFzc2lnbiB0byByZWdleCBtYXRjaGVzIGluIHJlcXVlc3QgdXJsIGRlc2NyaWJlZCBvblxuICogICB7QGxpbmsgbmdNb2NrLiRodHRwQmFja2VuZCAkaHR0cEJhY2tlbmQgbW9ja30uXG4gKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIGFuZCBgcGFzc1Rocm91Z2hgIG1ldGhvZHMgdGhhdFxuICogICBjb250cm9sIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLiBZb3UgY2FuIHNhdmUgdGhpcyBvYmplY3QgZm9yIGxhdGVyIHVzZSBhbmQgaW52b2tlXG4gKiAgIGByZXNwb25kYCBvciBgcGFzc1Rocm91Z2hgIGFnYWluIGluIG9yZGVyIHRvIGNoYW5nZSBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBtZXRob2RcbiAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuSlNPTlBcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIGZvciBKU09OUCByZXF1ZXN0cy4gRm9yIG1vcmUgaW5mbyBzZWUgYHdoZW4oKWAuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKHN0cmluZyl9IHVybCBIVFRQIHVybCBvciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgdXJsXG4gKiAgIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIHVybCBtYXRjaGVzIHRoZSBjdXJyZW50IGRlZmluaXRpb24uXG4gKiBAcGFyYW0geyhBcnJheSk9fSBrZXlzIEFycmF5IG9mIGtleXMgdG8gYXNzaWduIHRvIHJlZ2V4IG1hdGNoZXMgaW4gcmVxdWVzdCB1cmwgZGVzY3JpYmVkIG9uXG4gKiAgIHtAbGluayBuZ01vY2suJGh0dHBCYWNrZW5kICRodHRwQmFja2VuZCBtb2NrfS5cbiAqIEByZXR1cm5zIHtyZXF1ZXN0SGFuZGxlcn0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBgcmVzcG9uZGAgYW5kIGBwYXNzVGhyb3VnaGAgbWV0aG9kcyB0aGF0XG4gKiAgIGNvbnRyb2wgaG93IGEgbWF0Y2hlZCByZXF1ZXN0IGlzIGhhbmRsZWQuIFlvdSBjYW4gc2F2ZSB0aGlzIG9iamVjdCBmb3IgbGF0ZXIgdXNlIGFuZCBpbnZva2VcbiAqICAgYHJlc3BvbmRgIG9yIGBwYXNzVGhyb3VnaGAgYWdhaW4gaW4gb3JkZXIgdG8gY2hhbmdlIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLlxuICovXG4vKipcbiAqIEBuZ2RvYyBtZXRob2RcbiAqIEBuYW1lICRodHRwQmFja2VuZCN3aGVuUm91dGVcbiAqIEBtb2R1bGUgbmdNb2NrRTJFXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBuZXcgYmFja2VuZCBkZWZpbml0aW9uIHRoYXQgY29tcGFyZXMgb25seSB3aXRoIHRoZSByZXF1ZXN0ZWQgcm91dGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCBIVFRQIG1ldGhvZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgSFRUUCB1cmwgc3RyaW5nIHRoYXQgc3VwcG9ydHMgY29sb24gcGFyYW0gbWF0Y2hpbmcuXG4gKiBAcmV0dXJucyB7cmVxdWVzdEhhbmRsZXJ9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggYHJlc3BvbmRgIGFuZCBgcGFzc1Rocm91Z2hgIG1ldGhvZHMgdGhhdFxuICogICBjb250cm9sIGhvdyBhIG1hdGNoZWQgcmVxdWVzdCBpcyBoYW5kbGVkLiBZb3UgY2FuIHNhdmUgdGhpcyBvYmplY3QgZm9yIGxhdGVyIHVzZSBhbmQgaW52b2tlXG4gKiAgIGByZXNwb25kYCBvciBgcGFzc1Rocm91Z2hgIGFnYWluIGluIG9yZGVyIHRvIGNoYW5nZSBob3cgYSBtYXRjaGVkIHJlcXVlc3QgaXMgaGFuZGxlZC5cbiAqL1xuYW5ndWxhci5tb2NrLmUyZSA9IHt9O1xuYW5ndWxhci5tb2NrLmUyZS4kaHR0cEJhY2tlbmREZWNvcmF0b3IgPVxuICBbJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCAnJGRlbGVnYXRlJywgJyRicm93c2VyJywgY3JlYXRlSHR0cEJhY2tlbmRNb2NrXTtcblxuXG4vKipcbiAqIEBuZ2RvYyB0eXBlXG4gKiBAbmFtZSAkcm9vdFNjb3BlLlNjb3BlXG4gKiBAbW9kdWxlIG5nTW9ja1xuICogQGRlc2NyaXB0aW9uXG4gKiB7QGxpbmsgbmcuJHJvb3RTY29wZS5TY29wZSBTY29wZX0gdHlwZSBkZWNvcmF0ZWQgd2l0aCBoZWxwZXIgbWV0aG9kcyB1c2VmdWwgZm9yIHRlc3RpbmcuIFRoZXNlXG4gKiBtZXRob2RzIGFyZSBhdXRvbWF0aWNhbGx5IGF2YWlsYWJsZSBvbiBhbnkge0BsaW5rIG5nLiRyb290U2NvcGUuU2NvcGUgU2NvcGV9IGluc3RhbmNlIHdoZW5cbiAqIGBuZ01vY2tgIG1vZHVsZSBpcyBsb2FkZWQuXG4gKlxuICogSW4gYWRkaXRpb24gdG8gYWxsIHRoZSByZWd1bGFyIGBTY29wZWAgbWV0aG9kcywgdGhlIGZvbGxvd2luZyBoZWxwZXIgbWV0aG9kcyBhcmUgYXZhaWxhYmxlOlxuICovXG5hbmd1bGFyLm1vY2suJFJvb3RTY29wZURlY29yYXRvciA9IFsnJGRlbGVnYXRlJywgZnVuY3Rpb24oJGRlbGVnYXRlKSB7XG5cbiAgdmFyICRyb290U2NvcGVQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoJGRlbGVnYXRlKTtcblxuICAkcm9vdFNjb3BlUHJvdG90eXBlLiRjb3VudENoaWxkU2NvcGVzID0gY291bnRDaGlsZFNjb3BlcztcbiAgJHJvb3RTY29wZVByb3RvdHlwZS4kY291bnRXYXRjaGVycyA9IGNvdW50V2F0Y2hlcnM7XG5cbiAgcmV0dXJuICRkZWxlZ2F0ZTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkcm9vdFNjb3BlLlNjb3BlIyRjb3VudENoaWxkU2NvcGVzXG4gICAqIEBtb2R1bGUgbmdNb2NrXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb3VudHMgYWxsIHRoZSBkaXJlY3QgYW5kIGluZGlyZWN0IGNoaWxkIHNjb3BlcyBvZiB0aGUgY3VycmVudCBzY29wZS5cbiAgICpcbiAgICogVGhlIGN1cnJlbnQgc2NvcGUgaXMgZXhjbHVkZWQgZnJvbSB0aGUgY291bnQuIFRoZSBjb3VudCBpbmNsdWRlcyBhbGwgaXNvbGF0ZSBjaGlsZCBzY29wZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFRvdGFsIG51bWJlciBvZiBjaGlsZCBzY29wZXMuXG4gICAqL1xuICBmdW5jdGlvbiBjb3VudENoaWxkU2NvcGVzKCkge1xuICAgIC8vIGpzaGludCB2YWxpZHRoaXM6IHRydWVcbiAgICB2YXIgY291bnQgPSAwOyAvLyBleGNsdWRlIHRoZSBjdXJyZW50IHNjb3BlXG4gICAgdmFyIHBlbmRpbmdDaGlsZEhlYWRzID0gW3RoaXMuJCRjaGlsZEhlYWRdO1xuICAgIHZhciBjdXJyZW50U2NvcGU7XG5cbiAgICB3aGlsZSAocGVuZGluZ0NoaWxkSGVhZHMubGVuZ3RoKSB7XG4gICAgICBjdXJyZW50U2NvcGUgPSBwZW5kaW5nQ2hpbGRIZWFkcy5zaGlmdCgpO1xuXG4gICAgICB3aGlsZSAoY3VycmVudFNjb3BlKSB7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgIHBlbmRpbmdDaGlsZEhlYWRzLnB1c2goY3VycmVudFNjb3BlLiQkY2hpbGRIZWFkKTtcbiAgICAgICAgY3VycmVudFNjb3BlID0gY3VycmVudFNjb3BlLiQkbmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkcm9vdFNjb3BlLlNjb3BlIyRjb3VudFdhdGNoZXJzXG4gICAqIEBtb2R1bGUgbmdNb2NrXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb3VudHMgYWxsIHRoZSB3YXRjaGVycyBvZiBkaXJlY3QgYW5kIGluZGlyZWN0IGNoaWxkIHNjb3BlcyBvZiB0aGUgY3VycmVudCBzY29wZS5cbiAgICpcbiAgICogVGhlIHdhdGNoZXJzIG9mIHRoZSBjdXJyZW50IHNjb3BlIGFyZSBpbmNsdWRlZCBpbiB0aGUgY291bnQgYW5kIHNvIGFyZSBhbGwgdGhlIHdhdGNoZXJzIG9mXG4gICAqIGlzb2xhdGUgY2hpbGQgc2NvcGVzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUb3RhbCBudW1iZXIgb2Ygd2F0Y2hlcnMuXG4gICAqL1xuICBmdW5jdGlvbiBjb3VudFdhdGNoZXJzKCkge1xuICAgIC8vIGpzaGludCB2YWxpZHRoaXM6IHRydWVcbiAgICB2YXIgY291bnQgPSB0aGlzLiQkd2F0Y2hlcnMgPyB0aGlzLiQkd2F0Y2hlcnMubGVuZ3RoIDogMDsgLy8gaW5jbHVkZSB0aGUgY3VycmVudCBzY29wZVxuICAgIHZhciBwZW5kaW5nQ2hpbGRIZWFkcyA9IFt0aGlzLiQkY2hpbGRIZWFkXTtcbiAgICB2YXIgY3VycmVudFNjb3BlO1xuXG4gICAgd2hpbGUgKHBlbmRpbmdDaGlsZEhlYWRzLmxlbmd0aCkge1xuICAgICAgY3VycmVudFNjb3BlID0gcGVuZGluZ0NoaWxkSGVhZHMuc2hpZnQoKTtcblxuICAgICAgd2hpbGUgKGN1cnJlbnRTY29wZSkge1xuICAgICAgICBjb3VudCArPSBjdXJyZW50U2NvcGUuJCR3YXRjaGVycyA/IGN1cnJlbnRTY29wZS4kJHdhdGNoZXJzLmxlbmd0aCA6IDA7XG4gICAgICAgIHBlbmRpbmdDaGlsZEhlYWRzLnB1c2goY3VycmVudFNjb3BlLiQkY2hpbGRIZWFkKTtcbiAgICAgICAgY3VycmVudFNjb3BlID0gY3VycmVudFNjb3BlLiQkbmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG59XTtcblxuXG4hKGZ1bmN0aW9uKGphc21pbmVPck1vY2hhKSB7XG5cbiAgaWYgKCFqYXNtaW5lT3JNb2NoYSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjdXJyZW50U3BlYyA9IG51bGwsXG4gICAgICBpbmplY3RvclN0YXRlID0gbmV3IEluamVjdG9yU3RhdGUoKSxcbiAgICAgIGFubm90YXRlZEZ1bmN0aW9ucyA9IFtdLFxuICAgICAgd2FzSW5qZWN0b3JDcmVhdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhIWN1cnJlbnRTcGVjO1xuICAgICAgfTtcblxuICBhbmd1bGFyLm1vY2suJCRhbm5vdGF0ZSA9IGFuZ3VsYXIuaW5qZWN0b3IuJCRhbm5vdGF0ZTtcbiAgYW5ndWxhci5pbmplY3Rvci4kJGFubm90YXRlID0gZnVuY3Rpb24oZm4pIHtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmICFmbi4kaW5qZWN0KSB7XG4gICAgICBhbm5vdGF0ZWRGdW5jdGlvbnMucHVzaChmbik7XG4gICAgfVxuICAgIHJldHVybiBhbmd1bGFyLm1vY2suJCRhbm5vdGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgYW5ndWxhci5tb2NrLm1vZHVsZVxuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICogKk5PVEUqOiBUaGlzIGZ1bmN0aW9uIGlzIGFsc28gcHVibGlzaGVkIG9uIHdpbmRvdyBmb3IgZWFzeSBhY2Nlc3MuPGJyPlxuICAgKiAqTk9URSo6IFRoaXMgZnVuY3Rpb24gaXMgZGVjbGFyZWQgT05MWSBXSEVOIHJ1bm5pbmcgdGVzdHMgd2l0aCBqYXNtaW5lIG9yIG1vY2hhXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gcmVnaXN0ZXJzIGEgbW9kdWxlIGNvbmZpZ3VyYXRpb24gY29kZS4gSXQgY29sbGVjdHMgdGhlIGNvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25cbiAgICogd2hpY2ggd2lsbCBiZSB1c2VkIHdoZW4gdGhlIGluamVjdG9yIGlzIGNyZWF0ZWQgYnkge0BsaW5rIGFuZ3VsYXIubW9jay5pbmplY3QgaW5qZWN0fS5cbiAgICpcbiAgICogU2VlIHtAbGluayBhbmd1bGFyLm1vY2suaW5qZWN0IGluamVjdH0gZm9yIHVzYWdlIGV4YW1wbGVcbiAgICpcbiAgICogQHBhcmFtIHsuLi4oc3RyaW5nfEZ1bmN0aW9ufE9iamVjdCl9IGZucyBhbnkgbnVtYmVyIG9mIG1vZHVsZXMgd2hpY2ggYXJlIHJlcHJlc2VudGVkIGFzIHN0cmluZ1xuICAgKiAgICAgICAgYWxpYXNlcyBvciBhcyBhbm9ueW1vdXMgbW9kdWxlIGluaXRpYWxpemF0aW9uIGZ1bmN0aW9ucy4gVGhlIG1vZHVsZXMgYXJlIHVzZWQgdG9cbiAgICogICAgICAgIGNvbmZpZ3VyZSB0aGUgaW5qZWN0b3IuIFRoZSAnbmcnIGFuZCAnbmdNb2NrJyBtb2R1bGVzIGFyZSBhdXRvbWF0aWNhbGx5IGxvYWRlZC4gSWYgYW5cbiAgICogICAgICAgIG9iamVjdCBsaXRlcmFsIGlzIHBhc3NlZCBlYWNoIGtleS12YWx1ZSBwYWlyIHdpbGwgYmUgcmVnaXN0ZXJlZCBvbiB0aGUgbW9kdWxlIHZpYVxuICAgKiAgICAgICAge0BsaW5rIGF1dG8uJHByb3ZpZGUgJHByb3ZpZGV9LnZhbHVlLCB0aGUga2V5IGJlaW5nIHRoZSBzdHJpbmcgbmFtZSAob3IgdG9rZW4pIHRvIGFzc29jaWF0ZVxuICAgKiAgICAgICAgd2l0aCB0aGUgdmFsdWUgb24gdGhlIGluamVjdG9yLlxuICAgKi9cbiAgdmFyIG1vZHVsZSA9IHdpbmRvdy5tb2R1bGUgPSBhbmd1bGFyLm1vY2subW9kdWxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1vZHVsZUZucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgcmV0dXJuIHdhc0luamVjdG9yQ3JlYXRlZCgpID8gd29ya0ZuKCkgOiB3b3JrRm47XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgZnVuY3Rpb24gd29ya0ZuKCkge1xuICAgICAgaWYgKGN1cnJlbnRTcGVjLiRpbmplY3Rvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luamVjdG9yIGFscmVhZHkgY3JlYXRlZCwgY2FuIG5vdCByZWdpc3RlciBhIG1vZHVsZSEnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBmbiwgbW9kdWxlcyA9IGN1cnJlbnRTcGVjLiRtb2R1bGVzIHx8IChjdXJyZW50U3BlYy4kbW9kdWxlcyA9IFtdKTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1vZHVsZUZucywgZnVuY3Rpb24obW9kdWxlKSB7XG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QobW9kdWxlKSAmJiAhYW5ndWxhci5pc0FycmF5KG1vZHVsZSkpIHtcbiAgICAgICAgICAgIGZuID0gWyckcHJvdmlkZScsIGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChtb2R1bGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAkcHJvdmlkZS52YWx1ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm4gPSBtb2R1bGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50U3BlYy4kcHJvdmlkZXJJbmplY3Rvcikge1xuICAgICAgICAgICAgY3VycmVudFNwZWMuJHByb3ZpZGVySW5qZWN0b3IuaW52b2tlKGZuKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9kdWxlcy5wdXNoKGZuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBtb2R1bGUuJCRiZWZvcmVBbGxIb29rID0gKHdpbmRvdy5iZWZvcmUgfHwgd2luZG93LmJlZm9yZUFsbCk7XG4gIG1vZHVsZS4kJGFmdGVyQWxsSG9vayA9ICh3aW5kb3cuYWZ0ZXIgfHwgd2luZG93LmFmdGVyQWxsKTtcblxuICAvLyBwdXJlbHkgZm9yIHRlc3RpbmcgbmdNb2NrIGl0c2VsZlxuICBtb2R1bGUuJCRjdXJyZW50U3BlYyA9IGZ1bmN0aW9uKHRvKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB0bztcbiAgICBjdXJyZW50U3BlYyA9IHRvO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgYW5ndWxhci5tb2NrLm1vZHVsZS5zaGFyZWRJbmplY3RvclxuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICogKk5PVEUqOiBUaGlzIGZ1bmN0aW9uIGlzIGRlY2xhcmVkIE9OTFkgV0hFTiBydW5uaW5nIHRlc3RzIHdpdGggamFzbWluZSBvciBtb2NoYVxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGVuc3VyZXMgYSBzaW5nbGUgaW5qZWN0b3Igd2lsbCBiZSB1c2VkIGZvciBhbGwgdGVzdHMgaW4gYSBnaXZlbiBkZXNjcmliZSBjb250ZXh0LlxuICAgKiBUaGlzIGNvbnRyYXN0cyB3aXRoIHRoZSBkZWZhdWx0IGJlaGF2aW91ciB3aGVyZSBhIG5ldyBpbmplY3RvciBpcyBjcmVhdGVkIHBlciB0ZXN0IGNhc2UuXG4gICAqXG4gICAqIFVzZSBzaGFyZWRJbmplY3RvciB3aGVuIHlvdSB3YW50IHRvIHRha2UgYWR2YW50YWdlIG9mIEphc21pbmUncyBgYmVmb3JlQWxsKClgLCBvciBtb2NoYSdzXG4gICAqIGBiZWZvcmUoKWAgbWV0aG9kcy4gQ2FsbCBgbW9kdWxlLnNoYXJlZEluamVjdG9yKClgIGJlZm9yZSB5b3Ugc2V0dXAgYW55IG90aGVyIGhvb2tzIHRoYXRcbiAgICogd2lsbCBjcmVhdGUgKGkuZSBjYWxsIGBtb2R1bGUoKWApIG9yIHVzZSAoaS5lIGNhbGwgYGluamVjdCgpYCkgdGhlIGluamVjdG9yLlxuICAgKlxuICAgKiBZb3UgY2Fubm90IGNhbGwgYHNoYXJlZEluamVjdG9yKClgIGZyb20gd2l0aGluIGEgY29udGV4dCBhbHJlYWR5IHVzaW5nIGBzaGFyZWRJbmplY3RvcigpYC5cbiAgICpcbiAgICogIyPCoEV4YW1wbGVcbiAgICpcbiAgICogVHlwaWNhbGx5IGJlZm9yZUFsbCBpcyB1c2VkIHRvIG1ha2UgbWFueSBhc3NlcnRpb25zIGFib3V0IGEgc2luZ2xlIG9wZXJhdGlvbi4gVGhpcyBjYW5cbiAgICogY3V0IGRvd24gdGVzdCBydW4tdGltZSBhcyB0aGUgdGVzdCBzZXR1cCBkb2Vzbid0IG5lZWQgdG8gYmUgcmUtcnVuLCBhbmQgZW5hYmxpbmcgZm9jdXNzZWRcbiAgICogdGVzdHMgZWFjaCB3aXRoIGEgc2luZ2xlIGFzc2VydGlvbi5cbiAgICpcbiAgICogYGBganNcbiAgICogZGVzY3JpYmUoXCJEZWVwIFRob3VnaHRcIiwgZnVuY3Rpb24oKSB7XG4gICAqXG4gICAqICAgbW9kdWxlLnNoYXJlZEluamVjdG9yKCk7XG4gICAqXG4gICAqICAgYmVmb3JlQWxsKG1vZHVsZShcIlVsdGltYXRlUXVlc3Rpb25cIikpO1xuICAgKlxuICAgKiAgIGJlZm9yZUFsbChpbmplY3QoZnVuY3Rpb24oRGVlcFRob3VnaHQpIHtcbiAgICogICAgIGV4cGVjdChEZWVwVGhvdWdodC5hbnN3ZXIpLnRvQmVVbmRlZmluZWQoKTtcbiAgICogICAgIERlZXBUaG91Z2h0LmdlbmVyYXRlQW5zd2VyKCk7XG4gICAqICAgfSkpO1xuICAgKlxuICAgKiAgIGl0KFwiaGFzIGNhbGN1bGF0ZWQgdGhlIGFuc3dlciBjb3JyZWN0bHlcIiwgaW5qZWN0KGZ1bmN0aW9uKERlZXBUaG91Z2h0KSB7XG4gICAqICAgICAvLyBCZWNhdXNlIG9mIHNoYXJlZEluamVjdG9yLCB3ZSBoYXZlIGFjY2VzcyB0byB0aGUgaW5zdGFuY2Ugb2YgdGhlIERlZXBUaG91Z2h0IHNlcnZpY2VcbiAgICogICAgIC8vIHRoYXQgd2FzIHByb3ZpZGVkIHRvIHRoZSBiZWZvcmVBbGwoKSBob29rLiBUaGVyZWZvcmUgd2UgY2FuIHRlc3QgdGhlIGdlbmVyYXRlZCBhbnN3ZXJcbiAgICogICAgIGV4cGVjdChEZWVwVGhvdWdodC5hbnN3ZXIpLnRvQmUoNDIpO1xuICAgKiAgIH0pKTtcbiAgICpcbiAgICogICBpdChcImhhcyBjYWxjdWxhdGVkIHRoZSBhbnN3ZXIgd2l0aGluIHRoZSBleHBlY3RlZCB0aW1lXCIsIGluamVjdChmdW5jdGlvbihEZWVwVGhvdWdodCkge1xuICAgKiAgICAgZXhwZWN0KERlZXBUaG91Z2h0LnJ1blRpbWVNaWxsZW5uaWEpLnRvQmVMZXNzVGhhbig4MDAwKTtcbiAgICogICB9KSk7XG4gICAqXG4gICAqICAgaXQoXCJoYXMgZG91YmxlIGNoZWNrZWQgdGhlIGFuc3dlclwiLCBpbmplY3QoZnVuY3Rpb24oRGVlcFRob3VnaHQpIHtcbiAgICogICAgIGV4cGVjdChEZWVwVGhvdWdodC5hYnNvbHV0ZWx5U3VyZUl0SXNUaGVSaWdodEFuc3dlcikudG9CZSh0cnVlKTtcbiAgICogICB9KSk7XG4gICAqXG4gICAqIH0pO1xuICAgKlxuICAgKiBgYGBcbiAgICovXG4gIG1vZHVsZS5zaGFyZWRJbmplY3RvciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghKG1vZHVsZS4kJGJlZm9yZUFsbEhvb2sgJiYgbW9kdWxlLiQkYWZ0ZXJBbGxIb29rKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJzaGFyZWRJbmplY3RvcigpIGNhbm5vdCBiZSB1c2VkIHVubGVzcyB5b3VyIHRlc3QgcnVubmVyIGRlZmluZXMgYmVmb3JlQWxsL2FmdGVyQWxsXCIpO1xuICAgIH1cblxuICAgIHZhciBpbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgbW9kdWxlLiQkYmVmb3JlQWxsSG9vayhmdW5jdGlvbigpIHtcbiAgICAgIGlmIChpbmplY3RvclN0YXRlLnNoYXJlZCkge1xuICAgICAgICBpbmplY3RvclN0YXRlLnNoYXJlZEVycm9yID0gRXJyb3IoXCJzaGFyZWRJbmplY3RvcigpIGNhbm5vdCBiZSBjYWxsZWQgaW5zaWRlIGEgY29udGV4dCB0aGF0IGhhcyBhbHJlYWR5IGNhbGxlZCBzaGFyZWRJbmplY3RvcigpXCIpO1xuICAgICAgICB0aHJvdyBpbmplY3RvclN0YXRlLnNoYXJlZEVycm9yO1xuICAgICAgfVxuICAgICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgY3VycmVudFNwZWMgPSB0aGlzO1xuICAgICAgaW5qZWN0b3JTdGF0ZS5zaGFyZWQgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgbW9kdWxlLiQkYWZ0ZXJBbGxIb29rKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGluaXRpYWxpemVkKSB7XG4gICAgICAgIGluamVjdG9yU3RhdGUgPSBuZXcgSW5qZWN0b3JTdGF0ZSgpO1xuICAgICAgICBtb2R1bGUuJCRjbGVhbnVwKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmplY3RvclN0YXRlLnNoYXJlZEVycm9yID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBtb2R1bGUuJCRiZWZvcmVFYWNoID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGluamVjdG9yU3RhdGUuc2hhcmVkICYmIGN1cnJlbnRTcGVjICYmIGN1cnJlbnRTcGVjICE9IHRoaXMpIHtcbiAgICAgIHZhciBzdGF0ZSA9IGN1cnJlbnRTcGVjO1xuICAgICAgY3VycmVudFNwZWMgPSB0aGlzO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKFtcIiRpbmplY3RvclwiLFwiJG1vZHVsZXNcIixcIiRwcm92aWRlckluamVjdG9yXCIsIFwiJGluamVjdG9yU3RyaWN0XCJdLCBmdW5jdGlvbihrKSB7XG4gICAgICAgIGN1cnJlbnRTcGVjW2tdID0gc3RhdGVba107XG4gICAgICAgIHN0YXRlW2tdID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50U3BlYyA9IHRoaXM7XG4gICAgICBvcmlnaW5hbFJvb3RFbGVtZW50ID0gbnVsbDtcbiAgICAgIGFubm90YXRlZEZ1bmN0aW9ucyA9IFtdO1xuICAgIH1cbiAgfTtcblxuICBtb2R1bGUuJCRhZnRlckVhY2ggPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoaW5qZWN0b3JTdGF0ZS5jbGVhbnVwQWZ0ZXJFYWNoKCkpIHtcbiAgICAgIG1vZHVsZS4kJGNsZWFudXAoKTtcbiAgICB9XG4gIH07XG5cbiAgbW9kdWxlLiQkY2xlYW51cCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbmplY3RvciA9IGN1cnJlbnRTcGVjLiRpbmplY3RvcjtcblxuICAgIGFubm90YXRlZEZ1bmN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gICAgICBkZWxldGUgZm4uJGluamVjdDtcbiAgICB9KTtcblxuICAgIGFuZ3VsYXIuZm9yRWFjaChjdXJyZW50U3BlYy4kbW9kdWxlcywgZnVuY3Rpb24obW9kdWxlKSB7XG4gICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS4kJGhhc2hLZXkpIHtcbiAgICAgICAgbW9kdWxlLiQkaGFzaEtleSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGN1cnJlbnRTcGVjLiRpbmplY3RvciA9IG51bGw7XG4gICAgY3VycmVudFNwZWMuJG1vZHVsZXMgPSBudWxsO1xuICAgIGN1cnJlbnRTcGVjLiRwcm92aWRlckluamVjdG9yID0gbnVsbDtcbiAgICBjdXJyZW50U3BlYyA9IG51bGw7XG5cbiAgICBpZiAoaW5qZWN0b3IpIHtcbiAgICAgIC8vIEVuc3VyZSBgJHJvb3RFbGVtZW50YCBpcyBpbnN0YW50aWF0ZWQsIGJlZm9yZSBjaGVja2luZyBgb3JpZ2luYWxSb290RWxlbWVudGBcbiAgICAgIHZhciAkcm9vdEVsZW1lbnQgPSBpbmplY3Rvci5nZXQoJyRyb290RWxlbWVudCcpO1xuICAgICAgdmFyIHJvb3ROb2RlID0gJHJvb3RFbGVtZW50ICYmICRyb290RWxlbWVudFswXTtcbiAgICAgIHZhciBjbGVhblVwTm9kZXMgPSAhb3JpZ2luYWxSb290RWxlbWVudCA/IFtdIDogW29yaWdpbmFsUm9vdEVsZW1lbnRbMF1dO1xuICAgICAgaWYgKHJvb3ROb2RlICYmICghb3JpZ2luYWxSb290RWxlbWVudCB8fCByb290Tm9kZSAhPT0gb3JpZ2luYWxSb290RWxlbWVudFswXSkpIHtcbiAgICAgICAgY2xlYW5VcE5vZGVzLnB1c2gocm9vdE5vZGUpO1xuICAgICAgfVxuICAgICAgYW5ndWxhci5lbGVtZW50LmNsZWFuRGF0YShjbGVhblVwTm9kZXMpO1xuXG4gICAgICAvLyBFbnN1cmUgYCRkZXN0cm95KClgIGlzIGF2YWlsYWJsZSwgYmVmb3JlIGNhbGxpbmcgaXRcbiAgICAgIC8vIChhIG1vY2tlZCBgJHJvb3RTY29wZWAgbWlnaHQgbm90IGltcGxlbWVudCBpdCAob3Igbm90IGV2ZW4gYmUgYW4gb2JqZWN0IGF0IGFsbCkpXG4gICAgICB2YXIgJHJvb3RTY29wZSA9IGluamVjdG9yLmdldCgnJHJvb3RTY29wZScpO1xuICAgICAgaWYgKCRyb290U2NvcGUgJiYgJHJvb3RTY29wZS4kZGVzdHJveSkgJHJvb3RTY29wZS4kZGVzdHJveSgpO1xuICAgIH1cblxuICAgIC8vIGNsZWFuIHVwIGpxdWVyeSdzIGZyYWdtZW50IGNhY2hlXG4gICAgYW5ndWxhci5mb3JFYWNoKGFuZ3VsYXIuZWxlbWVudC5mcmFnbWVudHMsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICBkZWxldGUgYW5ndWxhci5lbGVtZW50LmZyYWdtZW50c1trZXldO1xuICAgIH0pO1xuXG4gICAgTW9ja1hoci4kJGxhc3RJbnN0YW5jZSA9IG51bGw7XG5cbiAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhci5jYWxsYmFja3MsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICBkZWxldGUgYW5ndWxhci5jYWxsYmFja3Nba2V5XTtcbiAgICB9KTtcbiAgICBhbmd1bGFyLmNhbGxiYWNrcy5jb3VudGVyID0gMDtcbiAgfTtcblxuICAod2luZG93LmJlZm9yZUVhY2ggfHwgd2luZG93LnNldHVwKShtb2R1bGUuJCRiZWZvcmVFYWNoKTtcbiAgKHdpbmRvdy5hZnRlckVhY2ggfHwgd2luZG93LnRlYXJkb3duKShtb2R1bGUuJCRhZnRlckVhY2gpO1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgYW5ndWxhci5tb2NrLmluamVjdFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICogKk5PVEUqOiBUaGlzIGZ1bmN0aW9uIGlzIGFsc28gcHVibGlzaGVkIG9uIHdpbmRvdyBmb3IgZWFzeSBhY2Nlc3MuPGJyPlxuICAgKiAqTk9URSo6IFRoaXMgZnVuY3Rpb24gaXMgZGVjbGFyZWQgT05MWSBXSEVOIHJ1bm5pbmcgdGVzdHMgd2l0aCBqYXNtaW5lIG9yIG1vY2hhXG4gICAqXG4gICAqIFRoZSBpbmplY3QgZnVuY3Rpb24gd3JhcHMgYSBmdW5jdGlvbiBpbnRvIGFuIGluamVjdGFibGUgZnVuY3Rpb24uIFRoZSBpbmplY3QoKSBjcmVhdGVzIG5ld1xuICAgKiBpbnN0YW5jZSBvZiB7QGxpbmsgYXV0by4kaW5qZWN0b3IgJGluamVjdG9yfSBwZXIgdGVzdCwgd2hpY2ggaXMgdGhlbiB1c2VkIGZvclxuICAgKiByZXNvbHZpbmcgcmVmZXJlbmNlcy5cbiAgICpcbiAgICpcbiAgICogIyMgUmVzb2x2aW5nIFJlZmVyZW5jZXMgKFVuZGVyc2NvcmUgV3JhcHBpbmcpXG4gICAqIE9mdGVuLCB3ZSB3b3VsZCBsaWtlIHRvIGluamVjdCBhIHJlZmVyZW5jZSBvbmNlLCBpbiBhIGBiZWZvcmVFYWNoKClgIGJsb2NrIGFuZCByZXVzZSB0aGlzXG4gICAqIGluIG11bHRpcGxlIGBpdCgpYCBjbGF1c2VzLiBUbyBiZSBhYmxlIHRvIGRvIHRoaXMgd2UgbXVzdCBhc3NpZ24gdGhlIHJlZmVyZW5jZSB0byBhIHZhcmlhYmxlXG4gICAqIHRoYXQgaXMgZGVjbGFyZWQgaW4gdGhlIHNjb3BlIG9mIHRoZSBgZGVzY3JpYmUoKWAgYmxvY2suIFNpbmNlIHdlIHdvdWxkLCBtb3N0IGxpa2VseSwgd2FudFxuICAgKiB0aGUgdmFyaWFibGUgdG8gaGF2ZSB0aGUgc2FtZSBuYW1lIG9mIHRoZSByZWZlcmVuY2Ugd2UgaGF2ZSBhIHByb2JsZW0sIHNpbmNlIHRoZSBwYXJhbWV0ZXJcbiAgICogdG8gdGhlIGBpbmplY3QoKWAgZnVuY3Rpb24gd291bGQgaGlkZSB0aGUgb3V0ZXIgdmFyaWFibGUuXG4gICAqXG4gICAqIFRvIGhlbHAgd2l0aCB0aGlzLCB0aGUgaW5qZWN0ZWQgcGFyYW1ldGVycyBjYW4sIG9wdGlvbmFsbHksIGJlIGVuY2xvc2VkIHdpdGggdW5kZXJzY29yZXMuXG4gICAqIFRoZXNlIGFyZSBpZ25vcmVkIGJ5IHRoZSBpbmplY3RvciB3aGVuIHRoZSByZWZlcmVuY2UgbmFtZSBpcyByZXNvbHZlZC5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRoZSBwYXJhbWV0ZXIgYF9teVNlcnZpY2VfYCB3b3VsZCBiZSByZXNvbHZlZCBhcyB0aGUgcmVmZXJlbmNlIGBteVNlcnZpY2VgLlxuICAgKiBTaW5jZSBpdCBpcyBhdmFpbGFibGUgaW4gdGhlIGZ1bmN0aW9uIGJvZHkgYXMgX215U2VydmljZV8sIHdlIGNhbiB0aGVuIGFzc2lnbiBpdCB0byBhIHZhcmlhYmxlXG4gICAqIGRlZmluZWQgaW4gYW4gb3V0ZXIgc2NvcGUuXG4gICAqXG4gICAqIGBgYFxuICAgKiAvLyBEZWZpbmVkIG91dCByZWZlcmVuY2UgdmFyaWFibGUgb3V0c2lkZVxuICAgKiB2YXIgbXlTZXJ2aWNlO1xuICAgKlxuICAgKiAvLyBXcmFwIHRoZSBwYXJhbWV0ZXIgaW4gdW5kZXJzY29yZXNcbiAgICogYmVmb3JlRWFjaCggaW5qZWN0KCBmdW5jdGlvbihfbXlTZXJ2aWNlXyl7XG4gICAqICAgbXlTZXJ2aWNlID0gX215U2VydmljZV87XG4gICAqIH0pKTtcbiAgICpcbiAgICogLy8gVXNlIG15U2VydmljZSBpbiBhIHNlcmllcyBvZiB0ZXN0cy5cbiAgICogaXQoJ21ha2VzIHVzZSBvZiBteVNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICogICBteVNlcnZpY2UuZG9TdHVmZigpO1xuICAgKiB9KTtcbiAgICpcbiAgICogYGBgXG4gICAqXG4gICAqIFNlZSBhbHNvIHtAbGluayBhbmd1bGFyLm1vY2subW9kdWxlIGFuZ3VsYXIubW9jay5tb2R1bGV9XG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICogRXhhbXBsZSBvZiB3aGF0IGEgdHlwaWNhbCBqYXNtaW5lIHRlc3RzIGxvb2tzIGxpa2Ugd2l0aCB0aGUgaW5qZWN0IG1ldGhvZC5cbiAgICogYGBganNcbiAgICpcbiAgICogICBhbmd1bGFyLm1vZHVsZSgnbXlBcHBsaWNhdGlvbk1vZHVsZScsIFtdKVxuICAgKiAgICAgICAudmFsdWUoJ21vZGUnLCAnYXBwJylcbiAgICogICAgICAgLnZhbHVlKCd2ZXJzaW9uJywgJ3YxLjAuMScpO1xuICAgKlxuICAgKlxuICAgKiAgIGRlc2NyaWJlKCdNeUFwcCcsIGZ1bmN0aW9uKCkge1xuICAgKlxuICAgKiAgICAgLy8gWW91IG5lZWQgdG8gbG9hZCBtb2R1bGVzIHRoYXQgeW91IHdhbnQgdG8gdGVzdCxcbiAgICogICAgIC8vIGl0IGxvYWRzIG9ubHkgdGhlIFwibmdcIiBtb2R1bGUgYnkgZGVmYXVsdC5cbiAgICogICAgIGJlZm9yZUVhY2gobW9kdWxlKCdteUFwcGxpY2F0aW9uTW9kdWxlJykpO1xuICAgKlxuICAgKlxuICAgKiAgICAgLy8gaW5qZWN0KCkgaXMgdXNlZCB0byBpbmplY3QgYXJndW1lbnRzIG9mIGFsbCBnaXZlbiBmdW5jdGlvbnNcbiAgICogICAgIGl0KCdzaG91bGQgcHJvdmlkZSBhIHZlcnNpb24nLCBpbmplY3QoZnVuY3Rpb24obW9kZSwgdmVyc2lvbikge1xuICAgKiAgICAgICBleHBlY3QodmVyc2lvbikudG9FcXVhbCgndjEuMC4xJyk7XG4gICAqICAgICAgIGV4cGVjdChtb2RlKS50b0VxdWFsKCdhcHAnKTtcbiAgICogICAgIH0pKTtcbiAgICpcbiAgICpcbiAgICogICAgIC8vIFRoZSBpbmplY3QgYW5kIG1vZHVsZSBtZXRob2QgY2FuIGFsc28gYmUgdXNlZCBpbnNpZGUgb2YgdGhlIGl0IG9yIGJlZm9yZUVhY2hcbiAgICogICAgIGl0KCdzaG91bGQgb3ZlcnJpZGUgYSB2ZXJzaW9uIGFuZCB0ZXN0IHRoZSBuZXcgdmVyc2lvbiBpcyBpbmplY3RlZCcsIGZ1bmN0aW9uKCkge1xuICAgKiAgICAgICAvLyBtb2R1bGUoKSB0YWtlcyBmdW5jdGlvbnMgb3Igc3RyaW5ncyAobW9kdWxlIGFsaWFzZXMpXG4gICAqICAgICAgIG1vZHVsZShmdW5jdGlvbigkcHJvdmlkZSkge1xuICAgKiAgICAgICAgICRwcm92aWRlLnZhbHVlKCd2ZXJzaW9uJywgJ292ZXJyaWRkZW4nKTsgLy8gb3ZlcnJpZGUgdmVyc2lvbiBoZXJlXG4gICAqICAgICAgIH0pO1xuICAgKlxuICAgKiAgICAgICBpbmplY3QoZnVuY3Rpb24odmVyc2lvbikge1xuICAgKiAgICAgICAgIGV4cGVjdCh2ZXJzaW9uKS50b0VxdWFsKCdvdmVycmlkZGVuJyk7XG4gICAqICAgICAgIH0pO1xuICAgKiAgICAgfSk7XG4gICAqICAgfSk7XG4gICAqXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBmbnMgYW55IG51bWJlciBvZiBmdW5jdGlvbnMgd2hpY2ggd2lsbCBiZSBpbmplY3RlZCB1c2luZyB0aGUgaW5qZWN0b3IuXG4gICAqL1xuXG5cblxuICB2YXIgRXJyb3JBZGRpbmdEZWNsYXJhdGlvbkxvY2F0aW9uU3RhY2sgPSBmdW5jdGlvbihlLCBlcnJvckZvclN0YWNrKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gZS5tZXNzYWdlO1xuICAgIHRoaXMubmFtZSA9IGUubmFtZTtcbiAgICBpZiAoZS5saW5lKSB0aGlzLmxpbmUgPSBlLmxpbmU7XG4gICAgaWYgKGUuc291cmNlSWQpIHRoaXMuc291cmNlSWQgPSBlLnNvdXJjZUlkO1xuICAgIGlmIChlLnN0YWNrICYmIGVycm9yRm9yU3RhY2spXG4gICAgICB0aGlzLnN0YWNrID0gZS5zdGFjayArICdcXG4nICsgZXJyb3JGb3JTdGFjay5zdGFjaztcbiAgICBpZiAoZS5zdGFja0FycmF5KSB0aGlzLnN0YWNrQXJyYXkgPSBlLnN0YWNrQXJyYXk7XG4gIH07XG4gIEVycm9yQWRkaW5nRGVjbGFyYXRpb25Mb2NhdGlvblN0YWNrLnByb3RvdHlwZS50b1N0cmluZyA9IEVycm9yLnByb3RvdHlwZS50b1N0cmluZztcblxuICB3aW5kb3cuaW5qZWN0ID0gYW5ndWxhci5tb2NrLmluamVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBibG9ja0ZucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgdmFyIGVycm9yRm9yU3RhY2sgPSBuZXcgRXJyb3IoJ0RlY2xhcmF0aW9uIExvY2F0aW9uJyk7XG4gICAgLy8gSUUxMCsgYW5kIFBoYW50aG9tSlMgZG8gbm90IHNldCBzdGFjayB0cmFjZSBpbmZvcm1hdGlvbiwgdW50aWwgdGhlIGVycm9yIGlzIHRocm93blxuICAgIGlmICghZXJyb3JGb3JTdGFjay5zdGFjaykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhyb3cgZXJyb3JGb3JTdGFjaztcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIHJldHVybiB3YXNJbmplY3RvckNyZWF0ZWQoKSA/IHdvcmtGbi5jYWxsKGN1cnJlbnRTcGVjKSA6IHdvcmtGbjtcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBmdW5jdGlvbiB3b3JrRm4oKSB7XG4gICAgICB2YXIgbW9kdWxlcyA9IGN1cnJlbnRTcGVjLiRtb2R1bGVzIHx8IFtdO1xuICAgICAgdmFyIHN0cmljdERpID0gISFjdXJyZW50U3BlYy4kaW5qZWN0b3JTdHJpY3Q7XG4gICAgICBtb2R1bGVzLnVuc2hpZnQoWyckaW5qZWN0b3InLCBmdW5jdGlvbigkaW5qZWN0b3IpIHtcbiAgICAgICAgY3VycmVudFNwZWMuJHByb3ZpZGVySW5qZWN0b3IgPSAkaW5qZWN0b3I7XG4gICAgICB9XSk7XG4gICAgICBtb2R1bGVzLnVuc2hpZnQoJ25nTW9jaycpO1xuICAgICAgbW9kdWxlcy51bnNoaWZ0KCduZycpO1xuICAgICAgdmFyIGluamVjdG9yID0gY3VycmVudFNwZWMuJGluamVjdG9yO1xuICAgICAgaWYgKCFpbmplY3Rvcikge1xuICAgICAgICBpZiAoc3RyaWN0RGkpIHtcbiAgICAgICAgICAvLyBJZiBzdHJpY3REaSBpcyBlbmFibGVkLCBhbm5vdGF0ZSB0aGUgcHJvdmlkZXJJbmplY3RvciBibG9ja3NcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobW9kdWxlcywgZnVuY3Rpb24obW9kdWxlRm4pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbW9kdWxlRm4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBhbmd1bGFyLmluamVjdG9yLiQkYW5ub3RhdGUobW9kdWxlRm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGluamVjdG9yID0gY3VycmVudFNwZWMuJGluamVjdG9yID0gYW5ndWxhci5pbmplY3Rvcihtb2R1bGVzLCBzdHJpY3REaSk7XG4gICAgICAgIGN1cnJlbnRTcGVjLiRpbmplY3RvclN0cmljdCA9IHN0cmljdERpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gYmxvY2tGbnMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICBpZiAoY3VycmVudFNwZWMuJGluamVjdG9yU3RyaWN0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGluamVjdG9yIGlzIHN0cmljdCAvIHN0cmljdERpLCBhbmQgdGhlIHNwZWMgd2FudHMgdG8gaW5qZWN0IHVzaW5nIGF1dG9tYXRpY1xuICAgICAgICAgIC8vIGFubm90YXRpb24sIHRoZW4gYW5ub3RhdGUgdGhlIGZ1bmN0aW9uIGhlcmUuXG4gICAgICAgICAgaW5qZWN0b3IuYW5ub3RhdGUoYmxvY2tGbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLyoganNoaW50IC1XMDQwICovLyogSmFzbWluZSBleHBsaWNpdGx5IHByb3ZpZGVzIGEgYHRoaXNgIG9iamVjdCB3aGVuIGNhbGxpbmcgZnVuY3Rpb25zICovXG4gICAgICAgICAgaW5qZWN0b3IuaW52b2tlKGJsb2NrRm5zW2ldIHx8IGFuZ3VsYXIubm9vcCwgdGhpcyk7XG4gICAgICAgICAgLyoganNoaW50ICtXMDQwICovXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoZS5zdGFjayAmJiBlcnJvckZvclN0YWNrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3JBZGRpbmdEZWNsYXJhdGlvbkxvY2F0aW9uU3RhY2soZSwgZXJyb3JGb3JTdGFjayk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgZXJyb3JGb3JTdGFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cblxuICBhbmd1bGFyLm1vY2suaW5qZWN0LnN0cmljdERpID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPyAhIXZhbHVlIDogdHJ1ZTtcbiAgICByZXR1cm4gd2FzSW5qZWN0b3JDcmVhdGVkKCkgPyB3b3JrRm4oKSA6IHdvcmtGbjtcblxuICAgIGZ1bmN0aW9uIHdvcmtGbigpIHtcbiAgICAgIGlmICh2YWx1ZSAhPT0gY3VycmVudFNwZWMuJGluamVjdG9yU3RyaWN0KSB7XG4gICAgICAgIGlmIChjdXJyZW50U3BlYy4kaW5qZWN0b3IpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luamVjdG9yIGFscmVhZHkgY3JlYXRlZCwgY2FuIG5vdCBtb2RpZnkgc3RyaWN0IGFubm90YXRpb25zJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VycmVudFNwZWMuJGluamVjdG9yU3RyaWN0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gSW5qZWN0b3JTdGF0ZSgpIHtcbiAgICB0aGlzLnNoYXJlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2hhcmVkRXJyb3IgPSBudWxsO1xuXG4gICAgdGhpcy5jbGVhbnVwQWZ0ZXJFYWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXRoaXMuc2hhcmVkIHx8IHRoaXMuc2hhcmVkRXJyb3I7XG4gICAgfTtcbiAgfVxufSkod2luZG93Lmphc21pbmUgfHwgd2luZG93Lm1vY2hhKTtcblxuXG59KSh3aW5kb3csIHdpbmRvdy5hbmd1bGFyKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2FuZ3VsYXItbW9ja3MvYW5ndWxhci1tb2Nrcy5qc1xuICoqIG1vZHVsZSBpZCA9IDM3XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJcblxuZGVzY3JpYmUoJ1RoZSBjaG9yZCBzZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFwcCxcbiAgICAgICAgY2hvcmRTZXJ2aWNlO1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgYXBwID0gYW5ndWxhci5tb2NrLm1vZHVsZSgnYXBwJyk7XG4gICAgfSk7XG5cbiAgICBiZWZvcmVFYWNoKGFuZ3VsYXIubW9jay5pbmplY3QoZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICBjaG9yZFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdjaG9yZFNlcnZpY2UnKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGV4aXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChjaG9yZFNlcnZpY2UpLm5vdC50b0JlTnVsbCgpO1xuICAgIH0pO1xuXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2FwcC10ZXN0L3VuaXQvY2hvcmQtc2VydmljZS11bml0LmpzXG4gKiovIiwiXG5cblxuZGVzY3JpYmUoJ1RoZSBpbnRlcnZhbCBzZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFwcCxcbiAgICAgICAgaW50ZXJ2YWxTZXJ2aWNlO1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgYXBwID0gYW5ndWxhci5tb2NrLm1vZHVsZSgnYXBwJyk7XG4gICAgfSk7XG5cbiAgICBiZWZvcmVFYWNoKGFuZ3VsYXIubW9jay5pbmplY3QoZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICBpbnRlcnZhbFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdpbnRlcnZhbFNlcnZpY2UnKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGV4aXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChpbnRlcnZhbFNlcnZpY2UpLm5vdC50b0JlTnVsbCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm92aWRlIGludGVydmFsIG9iamVjdHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2hlY2sgZm9yIGludGVydmFsIGNvbnN0YW50IG9iamVjdFxuICAgICAgICBleHBlY3QoaW50ZXJ2YWxTZXJ2aWNlLmludGVydmFscykudG9CZURlZmluZWQoKTtcblxuICAgICAgICAvLyBjaGVjayBpbnRlcnZhbCBjb25zdGFudHNcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gaW50ZXJ2YWxTZXJ2aWNlLmludGVydmFscyl7XG4gICAgICAgICAgICB2YXIgaW50ZXJ2YWwgPSBpbnRlcnZhbFNlcnZpY2UuaW50ZXJ2YWxzW2tleV07XG4gICAgICAgICAgICBleHBlY3QoaW50ZXJ2YWwuaWQpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICBleHBlY3QoaW50ZXJ2YWwubGFiZWwpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICBleHBlY3QoaW50ZXJ2YWwub2Zmc2V0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb3ZpZGUgYSBub3RlIGdpdmVuIGFuIGludGVydmFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbnRlcnZhbHMgPSBpbnRlcnZhbFNlcnZpY2UuaW50ZXJ2YWxzO1xuXG4gICAgICAgIHZhciB0ZXN0cyA9IFtcbiAgICAgICAgICAgIHsgcm9vdDogJ0UnLCBpbnRlcnZhbDogaW50ZXJ2YWxzLkZJUlNULCBleHBlY3RlZDogJ0UnIH0sXG4gICAgICAgICAgICB7IHJvb3Q6ICdFJywgaW50ZXJ2YWw6IGludGVydmFscy5NSU5PUl9TRUNPTkQsIGV4cGVjdGVkOiAnRicgfSxcbiAgICAgICAgICAgIHsgcm9vdDogJ0UnLCBpbnRlcnZhbDogaW50ZXJ2YWxzLk1BSk9SX1NFQ09ORCwgZXhwZWN0ZWQ6ICdGIycgfSxcbiAgICAgICAgICAgIHsgcm9vdDogJ0UnLCBpbnRlcnZhbDogaW50ZXJ2YWxzLk1JTk9SX1RISVJELCBleHBlY3RlZDogJ0cnIH0sXG4gICAgICAgICAgICB7IHJvb3Q6ICdFJywgaW50ZXJ2YWw6IGludGVydmFscy5NQUpPUl9USElSRCwgZXhwZWN0ZWQ6ICdHIycgfSxcbiAgICAgICAgICAgIHsgcm9vdDogJ0UnLCBpbnRlcnZhbDogaW50ZXJ2YWxzLlBFUkZFQ1RfRk9VUlRILCBleHBlY3RlZDogJ0EnIH0sXG4gICAgICAgICAgICB7IHJvb3Q6ICdFJywgaW50ZXJ2YWw6IGludGVydmFscy5ESU1fRklGVEgsIGV4cGVjdGVkOiAnQSMnIH0sXG4gICAgICAgICAgICB7IHJvb3Q6ICdFJywgaW50ZXJ2YWw6IGludGVydmFscy5QRVJGRUNUX0ZJRlRILCBleHBlY3RlZDogJ0InIH0sXG4gICAgICAgICAgICB7IHJvb3Q6ICdFJywgaW50ZXJ2YWw6IGludGVydmFscy5NSU5PUl9TSVhUSCwgZXhwZWN0ZWQ6ICdDJyB9LFxuICAgICAgICAgICAgeyByb290OiAnRScsIGludGVydmFsOiBpbnRlcnZhbHMuTUFKT1JfU0lYVEgsIGV4cGVjdGVkOiAnQyMnIH0sXG4gICAgICAgICAgICB7IHJvb3Q6ICdFJywgaW50ZXJ2YWw6IGludGVydmFscy5NSU5PUl9TRVZFTlRILCBleHBlY3RlZDogJ0QnIH0sXG4gICAgICAgICAgICB7IHJvb3Q6ICdFJywgaW50ZXJ2YWw6IGludGVydmFscy5NQUpPUl9TRVZFTlRILCBleHBlY3RlZDogJ0QjJyB9LFxuICAgICAgICAgICAgeyByb290OiAnRScsIGludGVydmFsOiBpbnRlcnZhbHMuT0NUQVZFLCBleHBlY3RlZDogJ0UnIH1cbiAgICAgICAgXTtcblxuICAgICAgICB0ZXN0cy5mb3JFYWNoKGZ1bmN0aW9uKHRlc3Qpe1xuICAgICAgICAgICAgdmFyIG5vdGUgPSBpbnRlcnZhbFNlcnZpY2Uubm90ZUF0SW50ZXJ2YWwodGVzdC5yb290LCB0ZXN0LmludGVydmFsKTtcbiAgICAgICAgICAgIGV4cGVjdChub3RlKS50b0VxdWFsKHRlc3QuZXhwZWN0ZWQpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm92aWRlIGFuIGFycmF5IG9mIG5vdGVzIGdpdmVuIGFuIGFycmF5IG9mIGludGVydmFscycsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBpbnRlcnZhbHMgPSBpbnRlcnZhbFNlcnZpY2UuaW50ZXJ2YWxzO1xuXG4gICAgICAgIHZhciB0ZXN0cyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByb290OiAnQycsXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWxzOiBbaW50ZXJ2YWxzLkZJUlNULCBpbnRlcnZhbHMuUEVSRkVDVF9GT1VSVEgsIGludGVydmFscy5QRVJGRUNUX0ZJRlRIXSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWydDJywgJ0YnLCAnRyddXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJvb3Q6ICdBJyxcbiAgICAgICAgICAgICAgICBpbnRlcnZhbHM6IFtpbnRlcnZhbHMuRklSU1QsIGludGVydmFscy5QRVJGRUNUX0ZPVVJUSCwgaW50ZXJ2YWxzLlBFUkZFQ1RfRklGVEhdLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBbJ0EnLCAnRCcsICdFJ11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcm9vdDogJ0cnLFxuICAgICAgICAgICAgICAgIGludGVydmFsczogW2ludGVydmFscy5GSVJTVCwgaW50ZXJ2YWxzLlBFUkZFQ1RfRk9VUlRILCBpbnRlcnZhbHMuUEVSRkVDVF9GSUZUSF0sXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFsnRycsICdDJywgJ0QnXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByb290OiAnRScsXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWxzOiBbaW50ZXJ2YWxzLkZJUlNULCBpbnRlcnZhbHMuUEVSRkVDVF9GT1VSVEgsIGludGVydmFscy5QRVJGRUNUX0ZJRlRIXSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWydFJywgJ0EnLCAnQiddXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJvb3Q6ICdEJyxcbiAgICAgICAgICAgICAgICBpbnRlcnZhbHM6IFtpbnRlcnZhbHMuRklSU1QsIGludGVydmFscy5QRVJGRUNUX0ZPVVJUSCwgaW50ZXJ2YWxzLlBFUkZFQ1RfRklGVEhdLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBbJ0QnLCAnRycsICdBJ11cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICB0ZXN0cy5mb3JFYWNoKGZ1bmN0aW9uKHRlc3Qpe1xuICAgICAgICAgICAgdmFyIG5vdGVzID0gaW50ZXJ2YWxTZXJ2aWNlLm5vdGVzQXRJbnRlcnZhbHModGVzdC5yb290LCB0ZXN0LmludGVydmFscylcbiAgICAgICAgICAgIGV4cGVjdChub3RlcykudG9FcXVhbCh0ZXN0LmV4cGVjdGVkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vYXBwLXRlc3QvdW5pdC9pbnRlcnZhbC1zZXJ2aWNlLXVuaXQuanNcbiAqKi8iLCJcblxuZGVzY3JpYmUoJ1RoZSBub3RlIHNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXBwLFxuICAgICAgICBub3RlU2VydmljZTtcblxuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9jay5tb2R1bGUoJ2FwcCcpO1xuICAgIH0pO1xuXG4gICAgYmVmb3JlRWFjaChhbmd1bGFyLm1vY2suaW5qZWN0KGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICAgICAgbm90ZVNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdub3RlU2VydmljZScpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZXhpc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KG5vdGVTZXJ2aWNlKS5ub3QudG9CZU51bGwoKTtcbiAgICB9KTtcblxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9hcHAtdGVzdC91bml0L25vdGUtc2VydmljZS11bml0LmpzXG4gKiovIiwiXG5kZXNjcmliZSgnVGhlIHNjYWxlIHNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXBwLFxuICAgICAgICBzY2FsZVNlcnZpY2U7XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vY2subW9kdWxlKCdhcHAnKTtcbiAgICB9KTtcblxuICAgIGJlZm9yZUVhY2goYW5ndWxhci5tb2NrLmluamVjdChmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgIHNjYWxlU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJ3NjYWxlU2VydmljZScpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZXhpc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHNjYWxlU2VydmljZSkudG9CZURlZmluZWQoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvdmlkZSBzY2FsZSBvcHRpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNoZWNrIGZvciBzY2FsZSBvcHRpb24gY29uc3RhbnRzXG4gICAgICAgIGV4cGVjdChzY2FsZVNlcnZpY2Uuc2NhbGVPcHRpb25zKS50b0JlRGVmaW5lZCgpO1xuXG4gICAgICAgIC8vIGNoZWNrIHNjYWxlIGNvbnN0YW50c1xuICAgICAgICBzY2FsZVNlcnZpY2Uuc2NhbGVPcHRpb25zLmZvckVhY2goZnVuY3Rpb24oc2NhbGVPcHRpb24pe1xuICAgICAgICAgICAgZXhwZWN0KHNjYWxlT3B0aW9uLmlkKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNjYWxlT3B0aW9uLmxhYmVsKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZXhwZWN0KHNjYWxlT3B0aW9uLmludGVydmFscykudG9CZURlZmluZWQoKTtcbiAgICAgICAgfSlcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvdmlkZSBzY2FsZSBub3RlcyB3aGVuIGdpdmVuIGEgcm9vdCBhbmQgYSBzY2FsZSBvcHRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBzY2FsZXMgPSBzY2FsZVNlcnZpY2Uuc2NhbGVzO1xuXG4gICAgICAgIHZhciB0ZXN0cyA9IFtcbiAgICAgICAgICAgIHsgcm9vdDogJ0MnLCBzY2FsZTogc2NhbGVzLk1BSk9SLCBleHBlY3RlZDogWydDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnQScsICdCJ119XG4gICAgICAgIF07XG5cbiAgICAgICAgdGVzdHMuZm9yRWFjaChmdW5jdGlvbih0ZXN0KXtcbiAgICAgICAgICAgIHZhciBub3RlcyA9IHNjYWxlU2VydmljZS5zY2FsZU5vdGVzKHRlc3Qucm9vdCwgdGVzdC5zY2FsZSk7XG4gICAgICAgICAgICBleHBlY3Qobm90ZXMpLnRvRXF1YWwodGVzdC5leHBlY3RlZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cblxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9hcHAtdGVzdC91bml0L3NjYWxlLXNlcnZpY2UtdW5pdC5qc1xuICoqLyIsIlxuZGVzY3JpYmUoJ1RoZSB0dW5pbmcgc2VydmljZScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcHAsXG4gICAgICAgIHR1bmluZ1NlcnZpY2U7XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vY2subW9kdWxlKCdhcHAnKTtcbiAgICB9KTtcblxuICAgIGJlZm9yZUVhY2goYW5ndWxhci5tb2NrLmluamVjdChmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgIHR1bmluZ1NlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCd0dW5pbmdTZXJ2aWNlJyk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBleGlzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QodHVuaW5nU2VydmljZSkubm90LnRvQmVOdWxsKCk7XG4gICAgfSk7XG5cbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vYXBwLXRlc3QvdW5pdC90dW5pbmctc2VydmljZS11bml0LmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==