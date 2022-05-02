<template>
  <div class="profile">
    <van-cell-group v-if="user" class="my-info">
      <van-cell center class="base-info" :border="false">
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="$store.state.userPhoto"
        />
        <!-- <div class="name" slot="title">{{ currentUser.name }}</div> -->
        <div class="name" slot="title">{{ $store.state.userName }}</div>
        <van-button class="update-btn" size="small" round to="/user/profile"
          >编辑资料</van-button
        >
      </van-cell>
      <van-grid class="data-info" :border="false">
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div v-else class="not-login">
      <div
        @click="
          $router.push({
            name: 'login',
            query: {
              redirect: '/profile',
            },
          })
        "
      >
        <img class="mobile" src="~assets/img/profile/mobile.png" />
      </div>
      <div class="text">登录/注册</div>
    </div>

    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="lishi"
        text="历史"
      />
    </van-grid>

    <!-- <van-cell title="消息通知" is-link to="/" /> -->
    <van-cell class="mb-4" title="小智同学" is-link to="/user/chat" />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getCurrentUser } from 'network/user';

export default {
  name: 'Profile',
  data() {
    return {
      // 当前登录用户信息
      currentUser: {},
    };
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    this.loadCurrentUser();
  },
  methods: {
    async loadCurrentUser() {
      if (this.user) {
        const { data } = await getCurrentUser();
        this.currentUser = data.data;
        this.$store.commit('setUserPhoto', this.currentUser.photo);
        this.$store.commit('setUserName', this.currentUser.name);
      }
    },
    onLogout() {
      // 提示用户确认退出
      // 确认 -> 处理退出
      this.$dialog
        .confirm({
          title: '退出提示',
          message: '确认退出吗?',
        })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', null);
          // 清除TabBar的缓存,让它重新渲染
          // this.$store.commit('removeCachePage', 'TabBar');
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
.profile {
  .my-info {
    background: url('~assets/img/profile/banner.png') no-repeat;
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        height: 16px;
        font-size: 10px;
        color: #666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .count {
          font-size: 18px;
        }
        .text {
          font-size: 11px;
        }
      }
    }

    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }

  .not-login {
    height: 180px;
    background: url('~assets/img/profile/banner.png') no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      font-size: 14px;
      color: #fff;
    }
  }

  /deep/ .nav-grid {
    .nav-grid-item {
      box-sizing: border-box;
      height: 70px;
      .toutiao {
        font-size: 22px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
