<template>
  <div class="post-comment">
    <van-field
      class="comment-content"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-btn"
      size="mini"
      :disabled="!message"
      @click="onPost"
      >发布</van-button
    >
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
  },
  data() {
    return {
      // 输入框内容
      message: '',
    };
  },
  methods: {
    async onPost() {
      this.$toast.loading({
        message: '发布中',
        forbidClick: true,
      });
      // 找到数据接口
      // 封装请求方法
      // 请求提交数据
      const { data } = await addComment({
        // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id
        target: this.target.toString(),
        // 评论内容
        content: this.message,
        // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        art_id: this.articleId ? this.articleId.toString() : null,
      });
      // 处理相应结果
      this.$emit('post-success', data.data.new_obj);

      this.$toast.success('发布成功');
      // 发布成功，清空文本框内容
      this.message = '';
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
