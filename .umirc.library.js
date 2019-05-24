export default {
  entry:'src/HammerFinger',
  esm:"rollup",
  extraBabelPlugins: [
    ['@babel/plugin-proposal-optional-chaining'],
  ],
}
