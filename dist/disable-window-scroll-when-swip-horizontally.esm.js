var firstClientX = null;
var firstClientY = null;
var clientX = null;
var clientY = null;

function touchStart(e) {
  firstClientX = e.touches[0].clientX;
  firstClientY = e.touches[0].clientY;
}

function preventTouch(e) {
  var minValue = 5; // threshold

  clientX = e.touches[0].clientX - firstClientX;
  clientY = e.touches[0].clientY - firstClientY; // Vertical scrolling does not work when you start swiping horizontally.

  if (Math.abs(clientX) > minValue) {
    e.preventDefault();
    e.returnValue = false;
    return false;
  }
}

function disabledScroll() {
  var ele = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  if (!ele) return;
  ele.addEventListener('touchstart', touchStart);
  ele.addEventListener('touchmove', preventTouch, {
    passive: false
  });
}
function removeDisabled() {
  var ele = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  if (!ele) return;
  ele.removeEventListener('touchstart', touchStart);
  ele.removeEventListener('touchmove', preventTouch, {
    passive: false
  });
}

export { disabledScroll, removeDisabled };
