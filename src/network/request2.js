import axios from 'axios';
import jsonBig from 'json-bigint';
import { Toast } from 'vant';

// 在非组件模块中获取store必须通过这种方式
import store from '@/store/index';
import router from '@/router/index';

function redirectLogin() {
  router.replace({
    name: 'login',
    // 传递查询参数
    query: {
      // 数据名是自己起的
      // router.currentRoute和我们在组件中的this.$route是一个东西
      redirect: router.currentRoute.fullPath
    }
  });
}

const refreshTokenReq = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  timeout: 5000
});

export default function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net',
    timeout: 5000,
    // transformResponse 允许自定义原始的响应数据（字符串）
    transformResponse: [
      function(data) {
        try {
          // 如果转换成功则返回转换的数据结果
          return jsonBig.parse(data);
        } catch (err) {
          // 如果转换失败，则包装为统一数据格式并返回
          return {
            data
          };
        }
      }
    ]
  });

  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(
    config => {
      const { user } = store.state;

      // 如果用户已登录，统一给接口设置token信息
      if (user) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    function(err) {
      return Promise.reject(err);
    }
  );

  // 2.2.响应拦截
  instance.interceptors.response.use(
    res => {
      return res;
    },
    async function(err) {
      // 请求失败进入这里
      // 超过2xx的状态码都会进入这里

      const status = err.response ? err.response.status: 500;

      if (status === 400) {
        // 客户端请求参数错误
        Toast.fail('客户端请求参数异常');
      } else if (status === 401) {
        // token无效
        // 如果没有user或者user.token，直接去登录
        const { user } = store.state;
        if (!user || !user.token) {
          // 直接跳转到登录页
          return redirectLogin();
        }
        // 使用refresh_token请求获取新的token
        try {
          const { data } = await refreshTokenReq({
            // url: '/app/v1_0/authorizations',
            url: '/v1_0/authorizations',
            method: 'put',
            headers: {
              Authorization: `Bearer ${user.refresh_token}`
            }
          });

          // 拿到新的token之后把它更新到容器中
          user.token = data.data.token;
          store.commit('setUser', user);
          // 把失败的请求重新发出去
          return request(err.config);
        } catch (err) {
          store.commit('setUser', null);
          redirectLogin();
        }
      } else if (status === 403) {
        // 没有权限操作
        Toast.fail('没有权限操作');
      } else if (status >= 500) {
        // 服务端异常
        Toast.fail('服务端异常,请稍后重试');
      }

      return Promise.reject(err);
    }
  );

  // 3.发送真正的网络请求
  return instance(config);
}
