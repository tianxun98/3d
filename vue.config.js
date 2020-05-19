/*
 * @Author: your name
 * @Date: 2019-12-09 11:17:58
 * @LastEditTime: 2020-03-08 09:24:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \device-cloud\device-manage\vue.config.js
 */
let SpeedMeasurePlugin =undefined
let smp = undefined
let HardSourceWebpackPlugin = undefined
if(process.env.NODE_ENV != 'development'){
   SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
   smp = new SpeedMeasurePlugin();
  //  HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
}
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
module.exports = {
  chainWebpack: config => {
    if(process.env.NODE_ENV != 'development'){
      config.module
      .rule('js')
      .test('/.js/')
      .use('thread-loader')
    }
    config.module
      .rule('js')
      .test('/.js/')
      .use('babel-loader')
  },
  publicPath: '/ht_3d',
  configureWebpack: (config => {
    const plugins = []
    plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8
      })
    )
    config.plugins = plugins
    config.devtool = 'cheap-module-eval-source-map'
    if(process.env.NODE_ENV != 'development'){
      // plugins.push(new HardSourceWebpackPlugin())
      return smp.wrap(config)
    }
    return config
  })({}),
  productionSourceMap: false,
  css: {
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false,
    loaderOptions: {}, // css预设器配置项
    modules: false // 启用 CSS modules for all css / pre-processor files.
  },
  // hmr 热部署热更新，启动一个服务器运行项目，代理请求到对应位置
  devServer: {
    open: true,
    port: 9000,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        // target: "http://10.17.162.100:30000/api/dc",
        // target: "http://10.18.17.183:30001/api/dc",
        target: "http://10.18.2.199:4000/api/dc",
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // 重写路径
        }
      }
    }
  },
  pluginOptions: {}
}
