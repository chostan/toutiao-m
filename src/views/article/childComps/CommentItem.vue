<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-wrap">
        <div class="name">{{ comment.aut_name }}</div>
        <div class="like-wrap" @click="onCommentLike">
          <!-- <van-icon
            class="like-icon"
            :class="{
              liked: comment.is_liking,
            }"
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
          /> -->
          <van-icon
            :color="comment.is_liking ? 'hotpink' : ''"
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
          />
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>

      <div class="content">{{ comment.content }}</div>
      <div class="title-bottom">
        <span class="pubdate">{{ comment.pubdate | relativeTime }}</span>
        <van-button
          v-if="reply"
          size="mini"
          type="default"
          class="reply-btn"
          @click="$emit('reply-click', comment)"
          >{{ comment.reply_count }} 回复</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from 'network/comment';

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true,
    },
    reply: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    async onCommentLike() {
      const commentId = this.comment.com_id.toString();
      if (this.comment.is_liking) {
        // 已点赞，取消点赞
        const res = await deleteCommentLike(commentId);
        this.comment.like_count--;
        // console.log(res);
      } else {
        // 没有点赞，添加点赞
        const res = await addCommentLike(commentId);
        this.comment.like_count++;
        // console.log(res);
      }
      // 更新视图
      this.comment.is_liking = !this.comment.is_liking;
    },
  },
};
</script>

<style lang="less" scoped>
.comment-item {
  .avatar {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
  }
  .name {
    font-size: 14px;
    color: #406599;
  }
  .content {
    font-size: 16px;
    color: #222;
    margin: 4px 0;
  }
  .title-bottom {
    display: flex;
    align-items: center;
  }
  .pubdate {
    font-size: 10px;
    margin-right: 10px;
    color: #969799;
  }
  .reply-btn {
    // width: 69px;
    // height: 24px;
    // font-size: 10px;
    // color: #222;
    // background-color: #f4f5f6;
  }
  .like-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 30px;
    font-size: 13px;
  }
  .like-icon.liked {
    color: hotpink;
  }
}
</style>
