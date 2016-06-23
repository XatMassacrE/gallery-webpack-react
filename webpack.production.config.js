var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
  entry: path.resolve(__dirname, 'src/components/Main.js'),
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,

      // There is not need to run the loader through
      // vendors
      // 这里再也不需通过任何第三方来加载
      exclude: [node_modules_dir],
      loader: 'babel'
    }]
  }
};

module.exports = config;
