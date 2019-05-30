export default {
  entry:['src/HammerFinger','src/disable-window-scroll-when-swip-horizontally'],
  esm:"rollup",
  extraBabelPlugins: [
    ['@babel/plugin-proposal-optional-chaining'],
  ],
}
