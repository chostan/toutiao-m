<template>
  <div class="post-comment">
    <van-field
      ref="post-input"
      class="comment-content"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      :placeholder="inputPlaceholder"
      show-word-limit
    />
    <van-button
      class="post-btn"
      size="mini"
      :disabled="!message"
      @click="onPost"
    >
      发布
    </van-button>
  </div>
</template>

<script>
import { addComment } from 'network/comment';

export default {
  name: 'PostComment',
  props: {
    // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id
    target: {
      type: [Number, String, Object],
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
    replyTo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      // 输入框内容
      message: '',
    };
  },
  computed: {
    inputPlaceholder() {
      const replyTo = this.replyTo;
      return replyTo ? `回复 ${replyTo.aut_name}` : '请输入评论';
    },
  },
  methods: {
    async onPost() {
      this.$toast.loading({
        message: '发布中',
        forbidClick: true,
      });
      try {
        if (!this.message) return;

        if (this.replyTo) {
          this.message += `//@${this.replyTo.aut_name}: ${this.replyTo.content}`;
        }

        const { data } = await addComment({
          // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id
          target: this.target.toString(),
          // 评论内容
          content: this.message,
          // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
          art_id: this.articleId ? this.articleId.toString() : null,
        });
        // 处理相应结果
        // console.log('发布结果', data);
        const newComment = data.data.new_obj;
        this.$emit('post-success', newComment);

        this.$toast.success('发布成功');
        // // 发布成功，清空文本框内容
        this.message = '';
      } catch (err) {
        console.log('发布失败', err);
        this.$toast.fail('发布失败');
      }
    },
  },
};
</script>

<style lang="less" scoped>
.post-comment {
  display: flex;
  align-items: center;
  padding: 14px;
  .comment-content {
    background-color: #f5f7f9;
    margin-right: 10px;
  }
  .post-btn {
    width: 48px;
  }
}
</style>
