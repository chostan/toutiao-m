<template>
  <div class="comment-list">
    <!-- <van-cell>全部评论</van-cell> -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多评论了~"
      @load="onLoad"
    >
      <comment-item
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
        @reply-click="$emit('reply-click', $event)"
      ></comment-item>
      <!-- <van-cell
        v-for="(comment, index) in list"
        :key="index"
        :title="comment.content"
      /> -->
    </van-list>
  </div>
</template>

<script>
import { getComments } from 'network/comment';
import CommentItem from './CommentItem';
// import { getCurrentUser } from '@/network/user';

export default {
  name: 'CommentList',
  components: {
    CommentItem,
  },
  props: {
    // 源id，文章id或评论id
    source: {
      type: [Number, String, Object],
      required: true,
    },
    // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
    type: {
      type: String,
      default: 'a',
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    showReply: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // list: [],
      commentList: [],
      loading: false,
      finished: false,
      // 获取下一页数据的页码
      offset: null,
      // 每页大小
      limit: 10,
    };
  },
  watch: {
    // list: {
    //   isDeep: true,
    //   async handler() {
    //     const { idObj, content } = this.list[0];
    //     const { data } = await getCurrentUser();
    //     let newComment = {
    //       com_id: idObj.com_id,
    //       aut_id: data.data.id,
    //       aut_name: data.data.name,
    //       aut_photo: data.data.photo,
    //       like_count: 0,
    //       reply_count: 0,
    //       pubdate: Date.now(),
    //       content: content,
    //       is_top: 0,
    //       is_liking: false,
    //     };
    //     this.commentList.unshift(newComment);
    //   },
    // },
  },
  created() {},
  methods: {
    async onLoad() {
      // 1.请求获取数据
      const { data } = await getComments({
        // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        type: this.type,
        // 源id，文章id或评论id
        source: this.source.toString(),
        // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        offset: this.offset,
        // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        limit: this.limit,
      });
      // console.log('评论列表', data);
      if (this.showReply && this.showReply == true) {
        // this.getComentReply();
      }
      // console.log('commentList', data);
      // this.$emit('update-total-count', data.data.total_count);
      // 2.把数据放到列表中
      const { results } = data.data;
      this.list.push(...results);
      // this.commentList.push(...results);

      // 3.将本次的loading关闭
      this.loading = false;
      // 4.判断是否还有数据
      if (results.length) {
        // 如果有，则更新获取下一页数据的页码
        this.offset = data.data.last_id;
      } else {
        // 如果没有，则把finish设为true,不再触发加载更多了
        this.finished = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
