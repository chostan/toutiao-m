<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highLight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from 'network/search';
import { debounce } from 'lodash';

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestions: [],
    };
  },
  watch: {
    // searchText() {
    //   console.log('hello');
    // },
    searchText: {
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.searchText);
        // console.log(data);
        this.suggestions = data.data.options;
      }, 200),
      // async handler() {
      //   const { data } = await getSearchSuggestions(this.searchText);
      //   // console.log(data);
      //   this.suggestions = data.data.options;
      // },
      // 该回调将会在侦听开始后立即调用
      immediate: true,
    },
  },
  methods: {
    highLight(str) {
      return str.replace(
        new RegExp(this.searchText, 'gi'),
        `<span style="color: red">${this.searchText}</span>`
      );
    },
  },
};
</script>

<style lang="less" scoped>
</style>
