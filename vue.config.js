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
  }
};
