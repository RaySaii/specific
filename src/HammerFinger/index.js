import React from 'react'
import Hammer from 'react-hammerjs'


const id = function () {
  let _id = 1
  return _ => _id++
}()

export default class HammerFinger extends React.Component {

  hammerRef = null
  ele = null
  fixHammerjsDeltaIssue = undefined
  pinchStart = { x: undefined, y: undefined }
  lastEvent = undefined
  pinchZoomOrigin = undefined
  zIndex = undefined

  componentDidMount() {
    this.ele = this.hammerRef.domElement
    this.zIndex = this.ele.style.zIndex
    this.offset = {
      x: this.ele.offsetLeft,
      y: this.ele.offsetTop,
    }
    this.originalSize = {
      width: this.ele.clientWidth,
      height: this.ele.clientHeight,
    }
    this.current = {
      x: 0,
      y: 0,
      z: 1,
      r: 0,
      zooming: false,
      width: this.originalSize.width * 1,
      height: this.originalSize.height * 1,
    }
    this.startRotation = 0
    this.last = {
      x: this.current.x,
      y: this.current.y,
      z: this.current.z,
      r: this.current.r,
    }
  }

  getRelativePosition = (element, point, originalSize, scale) => {
    const domCoords = this.getCoords(element)

    const elementX = point.x - domCoords.x
    const elementY = point.y - domCoords.y

    const relativeX = elementX / (originalSize.width * scale / 2) - 1
    const relativeY = elementY / (originalSize.height * scale / 2) - 1
    return { x: relativeX, y: relativeY }
  }

  getCoords = (elem) => { // crossbrowser version
    const box = elem.getBoundingClientRect()

    const body = document.body
    const docEl = document.documentElement

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

    const clientTop = docEl.clientTop || body.clientTop || 0
    const clientLeft = docEl.clientLeft || body.clientLeft || 0

    const top = box.top + scrollTop - clientTop
    const left = box.left + scrollLeft - clientLeft

    return { x: Math.round(left), y: Math.round(top) }
  }

  scaleFrom = (zoomOrigin, currentScale, newScale) => {
    const currentShift = this.getCoordinateShiftDueToScale(this.originalSize, currentScale)
    const newShift = this.getCoordinateShiftDueToScale(this.originalSize, newScale)

    const zoomDistance = newScale - currentScale

    const shift = {
      x: currentShift.x - newShift.x,
      y: currentShift.y - newShift.y,
    }

    const output = {
      x: zoomOrigin.x * shift.x,
      y: zoomOrigin.y * shift.y,
      z: zoomDistance,
    }
    return output
  }

  getCoordinateShiftDueToScale = (size, scale) => {
    const newWidth = scale * size.width
    const newHeight = scale * size.height
    const dx = (newWidth - size.width) / 2
    const dy = (newHeight - size.height) / 2
    return {
      x: dx,
      y: dy,
    }
  }

  update = (callback) => {

    if (this.originalSize.height == 0) {
      this.originalSize.height = this.ele.clientHeight
    }

    if (this.current.z < 0.5) {
      this.current.z = 0.5
    } else if (this.current.z > 1.5) {
      this.current.z = 1.5
    }

    this.current.height = this.originalSize.height * this.current.z
    this.current.width = this.originalSize.width * this.current.z
    const parent = this.ele.offsetParent
    const leftEdge = (this.current.width - this.originalSize.width) / 2 - this.offset.x
    const rightEdge = parent.clientWidth - this.originalSize.width - (this.current.width - this.originalSize.width) / 2 - this.offset.x
    const topEdge = (this.current.height - this.originalSize.height) / 2 - this.offset.y
    const bottomEdge = parent.clientHeight - this.originalSize.height - (this.current.height - this.originalSize.height) / 2 - this.offset.y

    this.current.x = Math.max(leftEdge, this.current.x)
    this.current.x = Math.min(rightEdge, this.current.x)
    this.current.y = Math.max(topEdge, this.current.y)
    this.current.y = Math.min(bottomEdge, this.current.y)

    this.ele.style.transform = `
      translate3d(${this.current.x}px,${this.current.y}px, 0) 
      scale(${this.current.z}) 
      rotate(${this.current.r}deg)`

    this.ele.currentWidth=this.current.width
    this.ele.currentHeight=this.current.height
    callback?.(this.current.x + this.offset.x, this.current.y + this.offset.y,this.ele)
  }

  active = () => {
    this.ele.style.opacity = 0.7
    this.ele.style.backgroundColor = '#fff'
    this.ele.style.zIndex = 10 + id()
  }

  unActive = () => {
    this.ele.style.opacity = null
    this.ele.style.backgroundColor = null
  }

  onDoubleTap = (e) => {
    var scaleFactor = 1
    if (this.current.zooming === false) {
      this.current.zooming = true
    } else {
      this.current.zooming = false
      scaleFactor = -scaleFactor
    }
    this.ele.style.transition = '0.3s'
    setTimeout(() => {
      this.ele.style.transition = 'none'
    }, 300)

    const zoomOrigin = this.getRelativePosition(
        this.ele,
        { x: e.center.x, y: e.center.y },
        this.originalSize,
        this.current.z,
    )
    const d = this.scaleFrom(
        zoomOrigin,
        this.current.z,
        this.current.z + scaleFactor,
    )
    this.current.x += d.x
    this.current.y += d.y
    this.current.z += d.z

    this.last.x = this.current.x
    this.last.y = this.current.y
    this.last.z = this.current.z

    this.update()
  }


  onPan = (e) => {
    if (this.lastEvent !== 'pan') {
      this.fixHammerjsDeltaIssue = {
        x: e.deltaX,
        y: e.deltaY,
      }
    }
    this.current.x = this.last.x + e.deltaX - this.fixHammerjsDeltaIssue.x
    this.current.y = this.last.y + e.deltaY - this.fixHammerjsDeltaIssue.y
    this.lastEvent = 'pan'
    this.update(this.props.onPan)
    this.active()
  }

  onPanEnd = e => {
    this.unActive()
    this.last.x = this.current.x
    this.last.y = this.current.y
    this.lastEvent = 'panend'
    this.props.onPanEnd?.(this.ele)
  }

  onPinchStart = (e) => {
    this.active()
    this.pinchStart.x = e.center.x
    this.pinchStart.y = e.center.y
    this.pinchZoomOrigin = this.getRelativePosition(
        this.ele,
        {
          x: this.pinchStart.x,
          y: this.pinchStart.y,
        },
        this.originalSize,
        this.current.z,
    )
    this.lastEvent = 'pinchstart'
  }

  onPinch = (e) => {
    const d = this.scaleFrom(this.pinchZoomOrigin, this.last.z, this.last.z * e.scale)
    // disabled move when pinch
    // current.x = d.x + last.x + e.deltaX
    // current.y = d.y + last.y + e.deltaY
    this.current.z = d.z + this.last.z
    this.lastEvent = 'pinch'
    this.update()
  }

  onPinchEnd = e => {
    this.unActive()
    this.last.x = this.current.x
    this.last.y = this.current.y
    this.last.z = this.current.z
    this.lastEvent = 'pinchend'
  }

  onRotateStart = e => {
    this.last.r = this.current.r
    this.startRotation = e.rotation
    this.active()
  }


  onRotate = e => {
    const diff = this.startRotation - e.rotation
    this.current.r = this.last.r - diff
  }

  onRotateEnd = e => {
    this.unActive()
    this.last.r = this.current.r
    this.lastEvent = 'rotateend'
  }


  render() {
    return (
        <Hammer onPan={this.onPan}
    onPanEnd={this.onPanEnd}
    onPinchStart={this.onPinchStart}
    onPinch={this.onPinch}
    onPinchEnd={this.onPinchEnd}
    // onDoubleTap={this.onDoubleTap}
    onRotateStart={this.onRotateStart}
    onRotate={this.onRotate}
    onRotateEnd={this.onRotateEnd}
    options={{
      recognizers: {
        pinch: { enable: true, threshold: 0 },
        // rotate: { enable: true },
      },
    }}
    ref={ref => this.hammerRef = ref}>
    {this.props.children}
  </Hammer>
  )
  }

}
