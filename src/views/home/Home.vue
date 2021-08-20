<template>
  <div id="home">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 文章频道列表 -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel"></article-list>
        <!-- /文章频道列表 -->
      </van-tab>
      <!-- 汉堡按钮定位把频道最后的位置挡住了,解决办法在这里添加站位元素 -->
      <div slot="nav-right" class="wrap-nav-placeholder"></div>
      <div
        slot="nav-right"
        class="wrap-nav-wrap"
        @click="isChannelEditShow = true"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>

    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%"
    >
      <channel-edit
        :user-channels="channels"
        :active="active"
        @close="isChannelEditShow = false"
        @updateActive="onUpdateActive"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from 'network/user';

import ArticleList from './childComps/ArticleList';
import ChannelEdit from './childComps/ChannelEdit';

import { mapState } from 'vuex';
import { getItem } from 'utils/store';

export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit,
  },
  data() {
    return {
      // 被控制的激活标签
      active: 0,
      // 频道列表
      channels: [],
      // 控制编辑频道的显示状态
      isChannelEditShow: false,
    };
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    this.loadChannels();
  },
  methods: {
    // 请求获取频道数据
    async loadChannels() {
      let channels = [];
      if (this.user) {
        // 已登录，请求获取线上的用户频道列表数据
        const { data } = await getUserChannels();
        // console.log(data.data.channels);
        channels = data.data.channels;
      } else {
        // 没有登录,判断是否有本地存储的频道列表数据
        const localChannels = getItem('user-channels');
        if (localChannels) {
          channels = localChannels;
        } else {
          // 请求默认推荐的频道列表
          const { data } = await getUserChannels();
          channels = data.data.channels;
        }
      }
      this.channels = channels;
      /* const { data } = await getUserChannels();
      // console.log(data);
      this.channels = data.data.channels; */
    },
    onUpdateActive(index) {
      this.active = index;
    },
  },
};
</script>

<style lang="less" scoped>
#home {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }

  .channel-tabs {
    /deep/.van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      bottom: 22px;
      width: 15px;
      height: 3px;
      background: #3296fa;
    }
  }

  .wrap-nav-placeholder {
    width: 33px;
    flex: 0 0 6%;
    border-bottom: 1px solid #edeff3;
  }

  .wrap-nav-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    line-height: 44px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.9;
    .van-icon {
      font-size: 24px;
    }
    &::before {
      content: '';
      width: 1px;
      height: 43px;
      background: url('~assets/img/home/line.png') no-repeat;
      background-size: contain;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
