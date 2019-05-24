import React from 'react';
import Hammer from 'react-hammerjs';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var id = function () {
  var _id = 1;
  return function (_) {
    return _id++;
  };
}();

var HammerFinger =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HammerFinger, _React$Component);

  function HammerFinger() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, HammerFinger);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(HammerFinger)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.hammerRef = null;
    _this.ele = null;
    _this.fixHammerjsDeltaIssue = undefined;
    _this.pinchStart = {
      x: undefined,
      y: undefined
    };
    _this.lastEvent = undefined;
    _this.pinchZoomOrigin = undefined;
    _this.zIndex = undefined;

    _this.getRelativePosition = function (element, point, originalSize, scale) {
      var domCoords = _this.getCoords(element);

      var elementX = point.x - domCoords.x;
      var elementY = point.y - domCoords.y;
      var relativeX = elementX / (originalSize.width * scale / 2) - 1;
      var relativeY = elementY / (originalSize.height * scale / 2) - 1;
      return {
        x: relativeX,
        y: relativeY
      };
    };

    _this.getCoords = function (elem) {
      // crossbrowser version
      var box = elem.getBoundingClientRect();
      var body = document.body;
      var docEl = document.documentElement;
      var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
      var clientTop = docEl.clientTop || body.clientTop || 0;
      var clientLeft = docEl.clientLeft || body.clientLeft || 0;
      var top = box.top + scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;
      return {
        x: Math.round(left),
        y: Math.round(top)
      };
    };

    _this.scaleFrom = function (zoomOrigin, currentScale, newScale) {
      var currentShift = _this.getCoordinateShiftDueToScale(_this.originalSize, currentScale);

      var newShift = _this.getCoordinateShiftDueToScale(_this.originalSize, newScale);

      var zoomDistance = newScale - currentScale;
      var shift = {
        x: currentShift.x - newShift.x,
        y: currentShift.y - newShift.y
      };
      var output = {
        x: zoomOrigin.x * shift.x,
        y: zoomOrigin.y * shift.y,
        z: zoomDistance
      };
      return output;
    };

    _this.getCoordinateShiftDueToScale = function (size, scale) {
      var newWidth = scale * size.width;
      var newHeight = scale * size.height;
      var dx = (newWidth - size.width) / 2;
      var dy = (newHeight - size.height) / 2;
      return {
        x: dx,
        y: dy
      };
    };

    _this.update = function (callback) {
      if (_this.originalSize.height == 0) {
        _this.originalSize.height = _this.ele.clientHeight;
      }

      if (_this.current.z < 0.5) {
        _this.current.z = 0.5;
      } else if (_this.current.z > 1.5) {
        _this.current.z = 1.5;
      }

      _this.current.height = _this.originalSize.height * _this.current.z;
      _this.current.width = _this.originalSize.width * _this.current.z;
      var parent = _this.ele.offsetParent;
      var leftEdge = (_this.current.width - _this.originalSize.width) / 2 - _this.offset.x;
      var rightEdge = parent.clientWidth - _this.originalSize.width - (_this.current.width - _this.originalSize.width) / 2 - _this.offset.x;
      var topEdge = (_this.current.height - _this.originalSize.height) / 2 - _this.offset.y;
      var bottomEdge = parent.clientHeight - _this.originalSize.height - (_this.current.height - _this.originalSize.height) / 2 - _this.offset.y;
      _this.current.x = Math.max(leftEdge, _this.current.x);
      _this.current.x = Math.min(rightEdge, _this.current.x);
      _this.current.y = Math.max(topEdge, _this.current.y);
      _this.current.y = Math.min(bottomEdge, _this.current.y);
      _this.ele.style.transform = "\n      translate3d(".concat(_this.current.x, "px,").concat(_this.current.y, "px, 0) \n      scale(").concat(_this.current.z, ") \n      rotate(").concat(_this.current.r, "deg)");
      _this.ele.currentWidth = _this.current.width;
      _this.ele.currentHeight = _this.current.height;
      callback === null || callback === void 0 ? void 0 : callback(_this.current.x + _this.offset.x, _this.current.y + _this.offset.y, _this.ele);
    };

    _this.active = function () {
      _this.ele.style.opacity = 0.7;
      _this.ele.style.backgroundColor = '#fff';
      _this.ele.style.zIndex = 10 + id();
    };

    _this.unActive = function () {
      _this.ele.style.opacity = null;
      _this.ele.style.backgroundColor = null;
    };

    _this.onDoubleTap = function (e) {
      var scaleFactor = 1;

      if (_this.current.zooming === false) {
        _this.current.zooming = true;
      } else {
        _this.current.zooming = false;
        scaleFactor = -scaleFactor;
      }

      _this.ele.style.transition = '0.3s';
      setTimeout(function () {
        _this.ele.style.transition = 'none';
      }, 300);

      var zoomOrigin = _this.getRelativePosition(_this.ele, {
        x: e.center.x,
        y: e.center.y
      }, _this.originalSize, _this.current.z);

      var d = _this.scaleFrom(zoomOrigin, _this.current.z, _this.current.z + scaleFactor);

      _this.current.x += d.x;
      _this.current.y += d.y;
      _this.current.z += d.z;
      _this.last.x = _this.current.x;
      _this.last.y = _this.current.y;
      _this.last.z = _this.current.z;

      _this.update();
    };

    _this.onPan = function (e) {
      if (_this.lastEvent !== 'pan') {
        _this.fixHammerjsDeltaIssue = {
          x: e.deltaX,
          y: e.deltaY
        };
      }

      _this.current.x = _this.last.x + e.deltaX - _this.fixHammerjsDeltaIssue.x;
      _this.current.y = _this.last.y + e.deltaY - _this.fixHammerjsDeltaIssue.y;
      _this.lastEvent = 'pan';

      _this.update(_this.props.onPan);

      _this.active();
    };

    _this.onPanEnd = function (e) {
      var _this$props$onPanEnd, _this$props;

      _this.unActive();

      _this.last.x = _this.current.x;
      _this.last.y = _this.current.y;
      _this.lastEvent = 'panend';
      (_this$props$onPanEnd = (_this$props = _this.props).onPanEnd) === null || _this$props$onPanEnd === void 0 ? void 0 : _this$props$onPanEnd.call(_this$props, _this.ele);
    };

    _this.onPinchStart = function (e) {
      _this.active();

      _this.pinchStart.x = e.center.x;
      _this.pinchStart.y = e.center.y;
      _this.pinchZoomOrigin = _this.getRelativePosition(_this.ele, {
        x: _this.pinchStart.x,
        y: _this.pinchStart.y
      }, _this.originalSize, _this.current.z);
      _this.lastEvent = 'pinchstart';
    };

    _this.onPinch = function (e) {
      var d = _this.scaleFrom(_this.pinchZoomOrigin, _this.last.z, _this.last.z * e.scale); // disabled move when pinch
      // current.x = d.x + last.x + e.deltaX
      // current.y = d.y + last.y + e.deltaY


      _this.current.z = d.z + _this.last.z;
      _this.lastEvent = 'pinch';

      _this.update();
    };

    _this.onPinchEnd = function (e) {
      _this.unActive();

      _this.last.x = _this.current.x;
      _this.last.y = _this.current.y;
      _this.last.z = _this.current.z;
      _this.lastEvent = 'pinchend';
    };

    _this.onRotateStart = function (e) {
      _this.last.r = _this.current.r;
      _this.startRotation = e.rotation;

      _this.active();
    };

    _this.onRotate = function (e) {
      var diff = _this.startRotation - e.rotation;
      _this.current.r = _this.last.r - diff;
    };

    _this.onRotateEnd = function (e) {
      _this.unActive();

      _this.last.r = _this.current.r;
      _this.lastEvent = 'rotateend';
    };

    return _this;
  }

  _createClass(HammerFinger, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.ele = this.hammerRef.domElement;
      this.zIndex = this.ele.style.zIndex;
      this.offset = {
        x: this.ele.offsetLeft,
        y: this.ele.offsetTop
      };
      this.originalSize = {
        width: this.ele.clientWidth,
        height: this.ele.clientHeight
      };
      this.current = {
        x: 0,
        y: 0,
        z: 1,
        r: 0,
        zooming: false,
        width: this.originalSize.width * 1,
        height: this.originalSize.height * 1
      };
      this.startRotation = 0;
      this.last = {
        x: this.current.x,
        y: this.current.y,
        z: this.current.z,
        r: this.current.r
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(Hammer, {
        onPan: this.onPan,
        onPanEnd: this.onPanEnd,
        onPinchStart: this.onPinchStart,
        onPinch: this.onPinch,
        onPinchEnd: this.onPinchEnd // onDoubleTap={this.onDoubleTap}
        ,
        onRotateStart: this.onRotateStart,
        onRotate: this.onRotate,
        onRotateEnd: this.onRotateEnd,
        options: {
          recognizers: {
            pinch: {
              enable: true,
              threshold: 0
            } // rotate: { enable: true },

          }
        },
        ref: function ref(_ref) {
          return _this2.hammerRef = _ref;
        }
      }, this.props.children);
    }
  }]);

  return HammerFinger;
}(React.Component);

export default HammerFinger;
