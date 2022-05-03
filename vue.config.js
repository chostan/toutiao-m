module.exports = {
  publicPath: './', // 告诉webpack打包的index.html引入其他资源文件以./开头, 不要默认/开头
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
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      //移除原有默认的入口，添加新的入口文件
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js');

      config.plugin('html').tap(args => {
        args[0].isProd = true;
        return args;
      });
    });
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js');

      //通过html插件动态添加isProd属性，来判断是开发模式还是发布模式
      config.plugin('html').tap(args => {
        args[0].isProd = false;
        return args;
      });
    });
  }
};
