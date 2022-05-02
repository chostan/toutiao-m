import Vue from 'vue';
// 导入vant组件库
import Vant from 'vant';
// 导入vant组件库的样式
import 'vant/lib/index.css';
import { Lazyload } from 'vant';

Vue.use(Lazyload, {
  preLoad: 0.8 // 屏幕高度百分比
});

// 全局注册vant组件
Vue.use(Vant);
