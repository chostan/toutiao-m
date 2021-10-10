<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('update-histories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete-o" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      v-for="(history, index) in searchHistories"
      :key="index"
      :title="history"
      @click="onDelete(history, index)"
    >
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 删除的显示状态
      isDeleteShow: false,
    };
  },
  methods: {
    onDelete(history, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1);
        // 持久化处理
        // 1.修改本地存储的数据
        // 2.请求接口，删除线上数据
        // 无论是否登录都把数据存储到本地
        // 如果已登录，则删除线上的历史数据
        // 接口有问题
        // setItem('search-histories', this.searchHistories);
        return;
      }

      // 非删除状态，展示搜索结果
      this.$emit('search', history);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
