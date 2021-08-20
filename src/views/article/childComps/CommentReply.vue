<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- /头部信息 -->

    <!-- 当前评论项 -->
    <comment-item :comment="comment"></comment-item>
    <!-- /当前评论项 -->

    <!-- 所有评论回复 -->
    <van-cell title="所有回复"></van-cell>
    <comment-list
      :source="comment.com_id"
      type="c"
      :list="commentList"
    ></comment-list>
    <!-- /所有评论回复 -->

    <!-- 底部区域 -->
    <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >
        写评论
      </van-button>
    </div>
    <!-- /底部区域 -->

    <!-- 发布回复 -->
    <van-popup v-model="isPostShow" position="bottom">
      <post-comment
        :target="comment.com_id"
        :articleId="articleId"
        @post-success="onPostSuccess"
      ></post-comment>
    </van-popup>
    <!-- /发布回复 -->
  </div>
</template>

<script>
import CommentItem from './CommentItem.vue';
import CommentList from './CommentList.vue';
import PostComment from './PostComment.vue';

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    PostComment,
  },
  props: {
    // 查看回复的评论项
    comment: {
      type: Object,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      isPostShow: false,
      // 评论的回复列表
      commentList: [],
    };
  },
  methods: {
    onPostSuccess(comment) {
      // console.log(comment);
      // 将发布成功的评论放到评论列表的顶部
      this.commentList.unshift(comment);
      // 更新评论回复的数量
      this.comment.reply_count++;
      // 关闭发布回复的弹出层
      this.isPostShow = false;
    },
  },
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
    width: 200px;
    height: 30px;
    border: 1px solid #eee;
    font-size: 15px;
    line-height: 30px;
    color: #a7a7a7;
  }
}
</style>
