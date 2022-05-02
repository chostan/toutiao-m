module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assets',
        utils: '@/utils',
        components: '@/components',
        network: '@/network',
        views: '@/views'
      }
    }
  },
  devServer: {
    // 开启代理服务器 解决跨域问题
    proxy: {
      '/dev-api': {
        target: 'http://toutiao.itheima.net/',
        changeOrigin: true,
        pathRewrite: { '/dev-api': '' }
      }
    }
  },
  publicPath: './' // 告诉webpack打包的index.html引入其他资源文件以./开头, 不要默认/开头
};
