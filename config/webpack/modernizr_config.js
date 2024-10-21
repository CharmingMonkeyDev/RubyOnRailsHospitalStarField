const path = require('path')
module.exports = {
  module: {
    rules: [
      {
        loader: "webpack-modernizr-loader",
        test: /\.modernizrrc\.js$/
        // Uncomment this when you use `JSON` format for configuration
        // type: 'javascript/auto'
      }
    ]
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, "./.modernizrrc.js")
    }
  }
}
