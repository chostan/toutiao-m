<template>
  <div class="footer">
    <van-button class="write-btn" type="default" round size="small"
      >写评论</van-button
    >
    <van-icon color="#777" name="comment-o" />
    <van-icon
      :color="article.is_collected ? 'orange' : '#777'"
      :name="article.is_collected ? 'star' : 'star-o'"
      @click="onCollect"
    />
    <van-icon color="#777" name="good-job-o" />
    <van-icon color="#777" name="share" />
  </div>
</template>

<script>
export default {
  name: 'ArticleFooter',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .write-btn {
    width: 160px;
  }
  .van-icon {
    font-size: 20px;
  }
}
</style>
