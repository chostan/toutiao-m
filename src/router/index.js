import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store/index'

const Login = () => import('views/login/Login')
const Search = () => import('views/search/Search')
const Article = () => import('views/article/Article')
const UserProfile = () => import('views/userProfile/UserProfile')
const UserChat = () => import('views/userChat/UserChat')
const TabBar = () => import('views/tabBar/TabBar')
const Home = () => import('views/home/Home')
const QA = () => import('views/qa/QA')
const Video = () => import('views/video/Video')
const Profile = () => import('views/profile/Profile')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    // 添加额外的自定义数据
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: TabBar,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
        meta: { requiresAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: QA,
        meta: { requiresAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: Video,
        meta: { requiresAuth: false }
      },
      {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: { requiresAuth: false }
      },
    ]
  },
  {
    path: '/search',
    component: Search,
    name: 'search',
    meta: { requiresAuth: false }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: Article,
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: UserProfile,
    meta: { requiresAuth: false }
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: UserChat,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 判断页面是否需要登录才能访问
  if (to.meta.requiresAuth) {
    // 如果已登录，则直接通过
    if (store.state.user) {
      return next()
    }
    // 没有登录，提示是否登录
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问,确认登录吗',
    })
      .then(() => {
        // on confirm
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      })
      .catch(() => {
        // on cancel
        // 取消了，中断路由导航
        next(false)
      });
  } else {
    // 不需要登录状态的页面，直接过去
    next()
  }
})

export default router
