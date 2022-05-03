import '@/utils/console.js'; // 去掉打印语句
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 导入vant组件库
import '@/plugins/vant';

// 自动设置REM基准值(html标签的字体大小)
import 'amfe-flexible';

// 代码高亮的样式
import 'highlight.js/styles/default.css';

// 导入全局样式(最好放到最后，方便覆盖第三方样式)
import 'assets/css/index.less';

import '@/utils/dayjs';

import * as directives from '@/utils/directive';

Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key]);
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

console.log('process.env', process.env);
