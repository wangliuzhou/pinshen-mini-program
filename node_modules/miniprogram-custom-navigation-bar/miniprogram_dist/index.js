module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _util = __webpack_require__(1);

var _barHeight = (0, _util.getStatusBarHeight)(); /* eslint-disable object-curly-spacing */
/* eslint-disable no-console */

var _isIos = (0, _util.isIos)();
var _isIntoFromIndex = __wxConfig.tabBar.list.length > 0 ? __wxConfig.tabBar.list.some(function (tab) {
  return (0, _util.removeRouteSuffix)(tab.pagePath) === (0, _util.removeRouteSuffix)(__wxConfig.appLaunchInfo.path);
}) : (0, _util.removeRouteSuffix)(__wxConfig.appLaunchInfo.path) === (0, _util.removeRouteSuffix)(__wxConfig.entryPagePath);

Component({
  properties: {
    title: {
      type: String,
      value: '默认标题默认标题' // maxLength: 8
    },
    defaultHeight: {
      type: Boolean,
      value: false
    },
    proxyBack: {
      type: Boolean,
      value: false
    }
  },
  data: {
    barHeight_px: _barHeight,
    isIos: _isIos,
    contentPadding_px: _isIos ? 6 : 8,
    isShowHome: !_isIntoFromIndex,
    isShowBack: false
  },
  methods: {
    /**
     * trigger一个事件
     * @param {Object} evt - 事件对象
     * @param {String} evt.name - 事件名
     * @param {*} evt.value - 事件携带的值
     */
    trigger: function trigger() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$name = _ref.name,
          name = _ref$name === undefined ? '' : _ref$name,
          _ref$value = _ref.value,
          value = _ref$value === undefined ? {} : _ref$value;

      if (!name) {
        throw new TypeError('name不能为空');
      }
      console.log('\u89E6\u53D1' + name + '\u4E8B\u4EF6,value\u4E3A' + JSON.stringify(value));
      this.triggerEvent(name, value);
    },
    handleBack: function handleBack() {
      if (this.data.proxyBack) {
        this.trigger({
          name: 'navigateBack'
        });
      } else {
        wx.navigateBack();
      }
    },
    handleHome: function handleHome() {
      _isIntoFromIndex = true;
      wx.reLaunch({
        url: '/' + (0, _util.removeRouteSuffix)(__wxConfig.entryPagePath)
      });
    }
  },
  ready: function ready() {
    this.setData({
      isShowBack: !(0, _util.isFirstLevelPage)()
    });
    this.trigger({
      name: 'navBarHeight',
      value: this.data.barHeight_px + this.data.contentPadding_px * 2 + 32
    });
  },

  pageLifetimes: {
    show: function show() {
      if (this.data.isShowHome === _isIntoFromIndex) {
        this.setData({
          isShowHome: !_isIntoFromIndex
        });
      }
    }
  }
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var getStatusBarHeight = exports.getStatusBarHeight = function getStatusBarHeight() {
  return wx.getSystemInfoSync().statusBarHeight;
};

var isIos = exports.isIos = function isIos() {
  return (/IOS/.test(''.toLocaleUpperCase.call(wx.getSystemInfoSync().system))
  );
};

var removeRouteSuffix = exports.removeRouteSuffix = function removeRouteSuffix(url) {
  if (/\.html$/g.test(url)) {
    return url.slice(0, -5);
  } else {
    return url;
  }
};

var isFirstLevelPage = exports.isFirstLevelPage = function isFirstLevelPage() {
  return getCurrentPages().length === 1;
};

/***/ })
/******/ ]);