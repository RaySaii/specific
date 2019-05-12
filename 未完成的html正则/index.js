// getStyle(inner) {
//   let tag = inner.match(/<(\w+)/)[1]
//   const rex = new RegExp(`^<${tag} style="(.+?)"`)
//   let temp = rex.exec(inner)
//   let res = {}
//   if (!temp) return res
//   let value = temp[1]
//   const arr = value.split(';')
//   arr.forEach(item => {
//     const temp = item.split(':')
//     res[temp[0]] = temp[1]
//   })
//   return res
// },
// getTagFields(html) {
//   let tag = html.match(/<(\w+)/)[1]
//   let obj = { style: this.getStyle(html) }
//   if (tag == 'img') {
//     //处理图
//     obj.img = true
//     obj.src = this.getSrc(html)
//   } else if (tag == 'video') {
//     //处理视频
//     obj.video = true
//     obj.src = this.getSrc(html)
//   } else {
//     const tagMap = {
//       strong: {
//         style: { fontWeight: 'bold' },
//       },
//       b: {
//         style: { fontWeight: 'bold' },
//       },
//       em: {
//         style: { fontStyle: 'italic' },
//       },
//       i: {
//         style: { fontStyle: 'italic' },
//       },
//       u: {
//         style: { textDecoration: 'underline' },
//       },
//     }
//     let keys = Object.keys(tagMap)
//     for (let i = 0; i < keys.length; i++) {
//       const tag = keys[i]
//       const rex = new RegExp(`^\s*<${tag}.*?>(.*)<\/${tag}\s*>`)
//
//
//       const temp = rex.exec(html)
//
//       // console.log(
//       //     rex,
//       //     html,
//       //     temp,
//       //     obj,
//       // )
//
//       if (temp) {
//         obj.style = Object.assign({}, tagMap[tag].style, obj.style)
//         break
//       }
//     }
//   }
//   // console.log('res', [obj])
//   return obj
// },
// getSrc(inner) {
//   const rex = new RegExp(`src="(.+?)"`)
//   let temp = rex.exec(inner)
//   return temp ? temp[1] : ''
// },
// transform: function (html) {
//   if (!html) return []
//   //将块分开
//   const arr = html.match(/<(p|div).*?>(.*?)<\/(p|div)\s*>/g)
//   if (!arr || !arr.length) return [{ content: html, style: {} }]
//   return arr.map(blockHtml => this.transformBlock(blockHtml)).filter(Boolean)
// },
// transformBlock: function (html) {
//   // 将外层 p 和 div 标签去掉
//   const blockInner = /<(?:p|div).*?>(.*)<\/(?:p|div)\s*>/.exec(html)[1]
//   return this.transformInner(blockInner)
// },
// transformInner: function (inner, style = {}) {
//   let obj = { style }
//   console.log(inner)
//   inner = inner.replace(/(<[^<|>|/]+>)([^<]+)(<[^<|>|/]+>)/g, '$1<ok>$2</ok>$3')
//       .replace(/(<\/[^<|>]+>)([^<]+)(<\/[^<|>|/]+>)/g, '$1<ok>$2</ok>$3')
//       .replace(/(<\/[^<|>]+>)([^<]+)(<[^<|>]+>)/g, '$1<ok>$2</ok>$3')
//       .replace(/(^[^<]+)(<.*)/, '<ok>$1</ok>$2')
//   //释放捕获分组 js 目前还不支持
//   let lineInners = inner.match(/<(?<HtmlTag>(div|span|h1))[^>]*?>((?<Nested><\k<HtmlTag>[^>]*>)|<\/\k<HtmlTag>>(?<-Nested>)|.*?)*<\/\k<HtmlTag>>/)
//   console.log(lineInners)
//   debugger
//   //没有子元素 说明只剩文字
//   if (!lineInners) {
//     if (inner) {
//       obj.content = inner
//       return obj
//     }
//     return null
//   }
//   obj.children = lineInners.map(innerHtml => {
//     let fields = this.getTagFields(innerHtml)
//     let myStyle = Object.assign({}, style, fields.style)
//     //去除元素的外层标签
//     innerHtml = /<(?:span|strong|em|u|i|b|a|ok).*?>(.*)<\/(?:span|strong|em|u|i|b|a|ok)\s*>/.exec(innerHtml)[1]
//     return this.transformInner(innerHtml, myStyle)
//   })
//   return obj
// },
