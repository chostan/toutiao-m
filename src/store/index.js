import Vue from 'vue';
import Vuex from 'vuex';

import { getItem, setItem, removeItem } from 'utils/store';

Vue.use(Vuex);

const USER_KEY = 'user';

export default new Vuex.Store({
  state: {
    // 当前登录用户的登录状态(token等数据)
    user: getItem(USER_KEY),
    // user: JSON.parse(window.localStorage.getItem('user'))
    cachePages: ['TabBar'],
    userPhoto:
      getItem('user-photo') ||
      'https://pic4.zhimg.com/v2-874b7cb7ded56394b549d34a68c76a00_r.jpg'
  },
  mutations: {
    setUser(state, data) {
      state.user = data;

      // 为了防止页面刷新，还需要把数据放到本地存储中
      setItem(USER_KEY, state.user);
      // window.localStorage.setItem('user', JSON.stringify(state.user))
    },

    // 添加缓存页面
    addCachePage(state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName);
      }
    },

    // 移除缓存页面
    removeCachePage(state, pageName) {
      const index = state.cachePages.indexOf(pageName);
      if (index !== -1) {
        state.cachePages.splice(index, 1);
      }
    },

    // 设置用户头像
    setUserPhoto(state, photo) {
      state.userPhoto = photo;
      setItem('user-photo', photo);
    }
  },
  actions: {},
  modules: {}
});
