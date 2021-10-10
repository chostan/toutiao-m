<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar" title="登录" left-arrow @click-left="$router.back()" />
    <!-- 登录表单 -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="loginForm"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        center
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        class="user-code"
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        center
        placeholder="请输入验证码"
        name="code"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-btn"
            size="mini"
            round
            :loading="isSendSmsLoading"
            @click.prevent="onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
/* 
测试账号
13911111111 / 246810
13611111111 / 246810
13922222222 / 246810
17090086870 / 246810
*/
import { login, sendSms } from 'network/user';

export default {
  name: 'Login',
  data() {
    return {
      user: {
        mobile: '13922222222',
        code: '246810',
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' },
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' },
        ],
      },
      // 控制倒计时和发送按钮的显示状态
      isCountDownShow: false,
      // 发送验证码的loading状态
      isSendSmsLoading: false,
    };
  },
  methods: {
    async onLogin() {
      this.$toast.loading({
        message: '登录...',
        forbidClick: true, // 禁止背景点击
        duration: 0,
      });
      try {
        const { data } = await login(this.user);
        // 处理相应结果
        this.$toast.success('登录成功');

        // 将后端返回的用户登录状态(token等数据)放到Vuex中
        this.$store.commit('setUser', data.data);

        // 清除TabBar的缓存,让它重新渲染
        this.$store.commit('removeCachePage', 'TabBar');

        // 登录成功，跳转回原来的页面
        // this.$router.back();
        this.$router.replace(this.$route.query.redirect || '/');
      } catch (err) {
        // console.log(err);
        // console.log('登录失败!', err);
        this.$toast.fail('登录失败,手机号或验证码错误');
      }
    },
    onFailed(err) {
      // console.log(err);
      if (err.errors[0]) {
        this.$toast({
          message: err.errors[0].message,
          position: 'top',
        });
      }
    },
    async onSendSms() {
      try {
        // 校验手机号
        await this.$refs.loginForm.validate('mobile');
        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true; // 展示按钮的loading状态，防止网络慢用户多次触发发送行为
        const res = await sendSms(this.user.mobile);
        // console.log(res);

        // 短信发出去了，隐藏发送按钮,显示倒计时
        this.isCountDownShow = true;

        // 倒计时结束，隐藏倒计时，显示发送按钮(监视倒计时的finish事件)
      } catch (err) {
        let message = '';
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁了，请稍后重试';
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message;
        } else {
          // 未知错误
          message = '发送失败，请稍后重试';
        }
        // 提示用户
        this.$toast({
          message,
          position: 'top',
        });
      }

      // 无论发送验证码成功或者失败，最后都要关闭发送按钮的Loading状态
      this.isSendSmsLoading = false;
      // 发送失败，显示发送按钮，关闭倒计时
      this.isCountDownShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  .send-btn {
    // transform: translate(-50%, -50%);
    width: 76px;
    height: 23px;
    background-color: #ededed;
    white-space: nowrap;
    .van-button__text {
      font-size: 11px;
      color: #666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
        color: #fff;
      }
    }
  }
}
</style>
