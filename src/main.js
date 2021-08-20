import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入vant组件库
import Vant from 'vant';
// 导入vant组件库的样式
import 'vant/lib/index.css';

// 自动设置REM基准值(html标签的字体大小)
import 'amfe-flexible'

// 导入全局样式(最好放到最后，方便覆盖第三方样式)
import 'assets/css/index.less'

import './utils/dayjs'

// 全局注册vant组件
Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
