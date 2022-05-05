<template>
  <div class="myarticle-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar" left-arrow @click-left="$router.back()">
      <!-- 文章标签列表 -->
      <van-tabs
        slot="title"
        v-model="active"
        background="#3296fa"
        color="#fff"
        title-inactive-color="#fff"
        title-active-color="#fff"
      >
        <van-tab :title="tab.title" v-for="tab in tabs" :key="tab.title">
          <loading-list :fn="tab.fn" class="collect-list">
            <template v-slot="{ item }">
              <article-item :article="item" />
            </template>
          </loading-list>
        </van-tab>
      </van-tabs>
      <!-- /文章标签列表 -->
    </van-nav-bar>
    <!-- /导航栏 -->
  </div>
</template>

<script>
import LoadingList from '@/components/loadingList';
import ArticleItem from './components/articleItem.vue';
import {
  getUserCollectArticles,
  getUserHistoryArticles,
} from '@/network/article';

export default {
  name: 'MyArticle',
  components: {
    LoadingList,
    ArticleItem,
  },
  props: {
    type: {
      type: String,
    },
  },
  data() {
    return {
      active: this.getInitialActive(),
      tabs: [
        {
          title: '收藏',
          fn: getUserCollectArticles,
        },
        {
          title: '历史',
          fn: getUserHistoryArticles,
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getInitialActive() {
      const active = ['collect', 'history', undefined].indexOf(this.type);
      return active !== -1 ? active : 0;
    },
  },
};
</script>

<style lang="less" scoped>
.myarticle-container {
  .app-nav-bar {
    /deep/ .van-nav-bar__title {
      width: 220px;
    }
  }
  .collect-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 0;
    overflow-y: auto;
  }
}
</style>
