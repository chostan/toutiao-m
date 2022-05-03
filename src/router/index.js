import Vue from 'vue';
import VueRouter from 'vue-router';
import { Dialog } from 'vant';
import store from '@/store/index';
// 导入 NProgress 进度条对应的JS和CSS
// import NProgress from 'nprogress';
// import 'nprogress/nprogress.css';

// NProgress.configure({ showSpinner: false });

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('views/login/Login'),
    // 添加额外的自定义数据
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('views/tabBar/TabBar'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('views/home/Home'),
        meta: { requiresAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('views/qa/QA'),
        meta: { requiresAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('views/video/Video'),
        meta: { requiresAuth: false }
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('views/profile/Profile'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/search',
    component: () => import('views/search/Search'),
    name: 'search',
    meta: { requiresAuth: false }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('views/article/Article'),
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('views/userProfile/UserProfile'),
    meta: { requiresAuth: false }
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('@/views/userChat/UserChat'),
    meta: { requiresAuth: true }
  }
  // {
  //   path: '/usercollect',
  //   name: 'usercollect',
  //   meta: {
  //     requireAuth: true
  //   },
  //   component: () => import('@/views/usercollect'),
  //   props: true
  // },
  // {
  //   path: '/userhistory',
  //   name: 'userhistory',
  //   meta: {
  //     requireAuth: true
  //   },
  //   component: () => import('@/views/usercollect'),
  //   props: true
  // }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  // 显示加载进度条
  // NProgress.start();

  // 判断页面是否需要登录才能访问
  if (to.meta.requiresAuth) {
    // 如果已登录，则直接通过
    if (store.state.user) {
      return next();
    }
    // 没有登录，提示是否登录
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问,确认登录吗'
    })
      .then(() => {
        // on confirm
        router.replace({
          name: 'login',
          query: {
            redirect: to.path
          }
        });
      })
      .catch(() => {
        // on cancel
        // 取消了，中断路由导航
        next(false);
      });
  } else {
    // 不需要登录状态的页面，直接过去
    next();
  }

  // NProgress.done(); // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
});

router.afterEach(() => {
  // NProgress.done();
});

export default router;
