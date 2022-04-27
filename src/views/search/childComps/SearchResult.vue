<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      /> -->
      <article-item
        v-for="(article, index) in list"
        :key="index"
        :article="article"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from 'network/search';
import ArticleItem from '@/components/articlItem/ArticleItem.vue';

export default {
  name: 'SearchResult',
  components: {
    ArticleItem,
  },
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
    };
  },
  methods: {
    async onLoad() {
      // 1.请求获取数据
      const { data } = await getSearchResults({
        // 页码
        page: this.page,
        // 每页大小
        per_page: this.perPage,
        // 搜索的字符
        q: this.searchText,
      });
      // console.log(data);
      // 2.将数据放到数据列表中
      const { results } = data.data;
      this.list.push(...results);
      // 3.结束本次的loading状态
      this.loading = false;
      // 4.判断是否还有数据
      if (results.length) {
        //如果有，则获取下一次数据的页码
        this.page++;
      } else {
        //  如果没有，则把finish设置为true， 关闭加载更多
        this.finished = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search-result {
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}
</style>
