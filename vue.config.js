const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
module.exports = {
    publicPath: '/ht_3d',
    lintOnSave: false,
    chainWebpack: config => {
        config.module
            .rule('js')
            .test('/.js/')
            .use('babel-loader')
    },
    configureWebpack: (config => {
        const plugins = [];
        plugins.push(
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: productionGzipExtensions,
                threshold: 10240,
                minRatio: 0.8
            })
        );
        config.plugins = plugins
        return config
    })({}),
    productionSourceMap: false,
    css: {
        extract: true, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: false,
        loaderOptions: {}, // css预设器配置项
        modules: false // 启用 CSS modules for all css / pre-processor files.
    },
    devServer: {
        open: true,
        port: 9900,
        proxy: {
            '/api': {
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
