<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        ></article-item>
        <!-- <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from 'network/article';
import ArticleItem from 'components/articlItem/ArticleItem';
import { debounce } from 'lodash';

export default {
  name: 'ArticleList',
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // 数据列表
      articles: [],
      // 控制加载中的loading状态
      loading: false,
      // 控制加载结束的状态
      finished: false,
      // 获取下一页数据的时间戳
      timestamp: null,
      // 下拉刷新的loading状态
      isRefreshLoading: false,
      // 下拉刷新成功的提示文本
      refreshSuccessText: '',
      // 列表滚动到顶部的距离
      scrollTop: 0,
    };
  },
  mounted() {
    const articleList = this.$refs['article-list'];
    articleList.onscroll = debounce(() => {
      // console.log('onscroll');
      this.scrollTop = articleList.scrollTop;
    }, 50);
  },
  activated() {
    // 把记录到顶部的距离重新设置回去
    this.$refs['article-list'].scrollTop = this.scrollTop;
  },
  methods: {
    async onLoad() {
      // console.log('onLoad');
      // 1. 请求获取数据
      const { data } = await getArticles({
        // 频道id
        channel_id: this.channel.id,
        // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        timestamp: this.timestamp || Date.now(),
        // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        with_top: 1,
      });
      // console.log(data);
      // 2. 将数据添加到当前频道的文章列表中
      // ...数组，数组的展开操作符，它会把数组元素一个一个的拿出来，传递给使用的位置
      const { results } = data.data;
      this.articles.push(...results);
      // 3. 将 loading 设置为 false
      this.loading = false;
      // 4. 判断还有下一页数据，则更新获取下一个数据的时间戳
      //    如果没有了，则将 finished 设置为 true，不再加载更多了
      if (results.length) {
        this.timestamp = data.data.pre_timestamp;
      } else {
        this.finished = true;
      }
    },
    async onRefresh() {
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1,
      });
      // 2.把数据放到列表中（往顶部追加）
      const { results } = data.data;
      this.articles.unshift(...results);
      // 3.关闭刷新的状态loading
      this.isRefreshLoading = false;

      this.refreshSuccessText = `更新了${results.length}条数据`;
    },
  },
};
</script>

<style lang="less" scoped>
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>
