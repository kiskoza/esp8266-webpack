const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

class CppHeaderTransformPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('CppHeaderTransformPlugin', (compilation, callback) => {
      var cpp_header = 'const char* html = "';
      cpp_header += compilation.assets['index.html'].source().toString().replace(/"/g, '\\"');
      cpp_header += '";';

      compilation.assets['index.html.h'] = {
        source: function() {
          return cpp_header;
        },
        size: function() {
          return cpp_header.length;
        }
      };

      callback();
    });
  }
}

module.exports = (env, args) => {
  return {
    mode: args.mode,
    entry: './web/index.js',
    plugins: [
      new HtmlWebpackPlugin({
        title: 'ESP8266 Web Interface',
        inject: false,
        template: './web/index.html',
        minify: args.mode === 'production' ? {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        } : null,
      }),
      new CppHeaderTransformPlugin(),
    ]
  };
}
