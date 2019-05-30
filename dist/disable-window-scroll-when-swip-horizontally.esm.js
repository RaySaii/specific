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

  if (Math.abs(this.clientX) > minValue) {
    e.preventDefault();
    e.returnValue = false;
    return false;
  }
}

function disabledScroll() {
  window.addEventListener('touchstart', touchStart);
  window.addEventListener('touchmove', preventTouch, {
    passive: false
  });
}
function removeDisabled() {
  window.removeEventListener('touchstart', this.touchStart);
  window.removeEventListener('touchmove', this.preventTouch, {
    passive: false
  });
}

export { disabledScroll, removeDisabled };
