<template>
  <div class="tab-bar">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  data() {
    return {
      active: 0,
    };
  },
  mounted() {
    this.$store.commit('addCachePage', 'TabBar');
  },
};
</script>

<style lang="less" scoped>
</style>
