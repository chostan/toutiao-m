<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
    <form action="/">
      <van-search
        v-model.trim="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    ></search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    ></search-suggestion>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    ></search-history>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchSuggestion from './childComps/SearchSuggestion';
import SearchHistory from './childComps/SearchHistory';
import SearchResult from './childComps/SearchResult';

// import { getSearchHistories } from 'network/search';

import { setItem, getItem } from 'utils/store';
import { mapState } from 'vuex';

export default {
  name: 'Search',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult,
  },
  data() {
    return {
      // 搜索框输入内容
      searchText: '',
      // 控制搜索结果的显示状态
      isResultShow: false,
      // 搜索历史数据
      searchHistories: [],
    };
  },
  computed: {
    ...mapState(['user']),
  },
  watch: {
    // 监视搜索历史记录的变化，存储到本地存储
    searchHistories() {
      setItem('search-histories', this.searchHistories);
    },
  },
  created() {
    this.loadHistories();
  },
  methods: {
    async loadHistories() {
      // 因为后端帮我们存储的用户历史记录太少了（只有四条）
      // 所以我们这里让后端返回的历史记录和本地的历史记录合并到一起
      // 如果用户已登录
      const searchHistories = getItem('search-histories') || [];
      // if (this.user) {
      //   const { data } = await getSearchHistories();
      //   console.log(data.data.keywords);
      //   searchHistories = [
      //     ...new Set([...searchHistories, ...data.data.keywords]),
      //   ];
      // }

      this.searchHistories = searchHistories;
    },
    onSearch(searchText) {
      // 把输入框设置为你要搜索的文本
      this.searchText = searchText;

      const index = this.searchHistories.indexOf(searchText);
      if (index !== -1) {
        // 把重复项删除
        this.searchHistories.splice(index, 1);
      }
      // 把最新的搜索历史放到顶部
      this.searchHistories.unshift(this.searchText);

      // 如果用户已登录，则把搜索历史记录存储到线上
      // 只要我们调用搜索结果的接口，后端会给我们自动存储用户的搜索历史记录
      // 如果没有登录，则把搜索历史记录存储到本地
      // setItem('search-histories', this.searchHistories);

      // 展示搜索结果
      this.isResultShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
