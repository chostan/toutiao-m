<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 加载中：loading -->
    <van-loading color="#1989fa" v-if="Object.keys(article).length === 0">
      文章加载ing...
    </van-loading>
    <!-- /加载中：loading -->

    <template v-else>
      <!-- 文章详情 -->
      <div class="article-wrap">
        <h1 class="title">{{ article.title }}</h1>
        <van-cell center class="user-info" :border="false">
          <div slot="title" class="name">{{ article.aut_name }}</div>
          <van-image
            slot="icon"
            class="avatar"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="label" class="pubdate">
            {{ article.pubdate | relativeTime }}
          </div>
          <van-button
            class="follow-btn"
            :border="false"
            :type="article.is_followed ? 'default' : 'info'"
            :icon="article.is_followed ? '' : 'plus'"
            round
            size="mini"
            @click="onFollow"
            >{{ article.is_followed ? '已关注' : '关注' }}</van-button
          >
        </van-cell>

        <div
          class="markdown-body"
          v-html="article.content"
          ref="articleRef"
        ></div>

        <!-- 分割线 -->
        <van-divider ref="articleEndRef">End</van-divider>

        <van-cell title="全部评论" :border="false" />

        <!-- 文章评论列表 -->
        <!-- @update-total-count="totalCommentCount = $event" -->
        <comment-list
          :source="articleId"
          :list="commentList"
          @reply-click="onReplyClick"
        ></comment-list>
        <!-- /文章评论列表 -->
      </div>

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
        <van-icon
          color="#777"
          name="comment-o"
          :badge="totalCommentCount"
          @click="toCommentClick"
        />
        <van-icon
          :color="article.is_collected ? 'orange' : '#777'"
          :name="article.is_collected ? 'star' : 'star-o'"
          :loading="isCollectLoading"
          @click="onCollect"
        />
        <van-icon
          :color="article.attitude === 1 ? 'hotpink' : '#777'"
          :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
          @click="onLike"
        />
        <!-- <van-icon color="#777" name="share" /> -->
      </div>
      <!-- /底部区域 -->

      <!-- 发布评论 -->
      <van-popup v-model="isPostShow" position="bottom">
        <post-comment
          :target="articleId"
          @post-success="onPostSuccess"
        ></post-comment>
      </van-popup>
      <!-- /发布评论 -->

      <!-- 评论回复 -->
      <van-popup
        v-model="isReplyShow"
        position="bottom"
        :style="{ height: '90%' }"
      >
        <!-- 这里使用v-if的目的是让组件随着弹出层的显示进行渲染和销毁,防止加载过的组件不重新渲染导致数据不会重新加载的问题 -->
        <comment-reply
          v-if="isReplyShow"
          :comment="replyComment"
          :article-id="articleId"
          @update-total-count="updateTotalCount"
          @close="isReplyShow = false"
        ></comment-reply>
      </van-popup>
      <!-- /评论回复 -->
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import './github-markdown.css';
import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike,
} from 'network/article';
import { addFollow, deleteFollow } from 'network/user';
import { ImagePreview } from 'vant';
import ArticleFooter from './childComps/ArticleFooter';
import CommentList from './childComps/CommentList';
import PostComment from './childComps/PostComment';
import CommentReply from './childComps/CommentReply.vue';

export default {
  name: 'Article',
  components: {
    ArticleFooter,
    CommentList,
    PostComment,
    CommentReply,
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      // 文章数据对象
      article: {},
      // 关注用户按钮的loading状态
      isFollowLoading: false,
      // 收藏文章按钮的loading状态
      isCollectLoading: false,
      // 控制发布评论的显示状态
      isPostShow: false,
      // 评论列表
      commentList: [],
      // 评论总数据量
      totalCommentCount: 0,
      // 控制回复的显示状态
      isReplyShow: false,
      // 当前回复评论对象
      replyComment: {},
    };
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    this.loadArticle();
  },
  methods: {
    async loadArticle() {
      const { data } = await getArticleById(this.articleId);
      this.article = data.data;
      this.totalCommentCount = data.data.comm_count;

      // 得到所有的img标签
      this.$nextTick(() => {
        this.handelPreviewImage();
      });
    },
    handelPreviewImage() {
      // 获取文章内容dom容器
      const articleContent = this.$refs.articleRef;
      const imgs = articleContent.querySelectorAll('img');
      const imgPaths = [];

      // 循环img列表，给img注册点击事件
      imgs.forEach((img, index) => {
        imgPaths.push(img.src);
        img.onerror = function () {
          img.src = require('@/assets/img/404.jpg');
        };
        // 在事件处理函数中调用ImgPreview()预览
        img.onclick = function () {
          ImagePreview({
            images: imgPaths, // 预览图片路径列表
            startPosition: index, // 起始位置
          });
        };
      });
    },
    async onFollow() {
      this.isFollowLoading = true;
      if (this.user) {
        if (this.article.is_followed) {
          // 已关注，取消关注
          try {
            const res = await deleteFollow(this.article.aut_id);
            this.article.is_followed = !this.article.is_followed;
          } catch (error) {}
          // console.log('取消关注', res);
          // this.article.aut_id = false;
        } else {
          // 未关注，添加关注
          try {
            const res = await addFollow(this.article.aut_id);
            this.article.is_followed = !this.article.is_followed;
          } catch (error) {
            if (
              error.response &&
              error.response.status &&
              error.response.status == 410
            ) {
              this.$toast({
                message: '不能关注自己',
              });
            }
          }
          // console.log('添加关注', res);
          // this.article.aut_id = true;
        }
      } else {
        this.$toast({
          message: '请登录后进行操作',
        });
      }
      this.isFollowLoading = false;
    },
    async onCollect() {
      this.isCollectLoading = true;
      this.$toast.loading({
        message: '操作中',
        // 禁止背景点击
        forbidClick: true,
      });
      if (this.user) {
        if (this.article.is_collected) {
          // 已收藏，取消收藏
          const res = await deleteCollect(this.articleId);
          // console.log('取消收藏', res);
          if (res && res.status && res.status === 204) {
            this.$toast.success('取消收藏成功');
          }
        } else {
          // 未收藏，添加收藏
          const res = await addCollect(this.articleId);
          // console.log('添加收藏', res);
          if (res && res.status && res.status === 201) {
            this.$toast.success('收藏成功');
          }
        }
        this.article.is_collected = !this.article.is_collected;
      } else {
        this.$toast({
          message: '请登录后进行操作',
        });
      }
      this.isCollectLoading = false;
    },
    async onLike() {
      this.isCollectLoading = true;
      this.$toast.loading({
        message: '操作中',
        // 禁止背景点击
        forbidClick: true,
      });
      if (this.user) {
        if (this.article.attitude === 1) {
          // 已点赞，取消点赞
          const res = await deleteLike(this.articleId);
          // console.log('取消点赞', res);
          this.article.attitude = -1;
          if (res && res.status && res.status === 204) {
            this.$toast.success(
              `${this.article.attitude === 1 ? '' : '取消'}点赞成功`
            );
          }
        } else {
          // 未点赞，添加点赞
          const res = await addLike(this.articleId);
          // console.log('添加点赞', res);
          this.article.attitude = 1;
          if (res && res.status && res.status === 201) {
            this.$toast.success(
              `${this.article.attitude === 1 ? '' : '取消'}点赞成功`
            );
          }
        }
      } else {
        this.$toast({
          message: '请登录后进行操作',
        });
      }
      this.isCollectLoading = false;
    },
    onPostSuccess(comment) {
      // console.log(comment);
      // console.log('onPostSuccess', comment);
      // 把发布成功的评论数据对象放到评论列表顶部
      this.commentList.unshift(comment);
      // 更新评论的总数量
      this.totalCommentCount++;
      // 关闭发布评论弹出层
      this.isPostShow = false;
    },
    updateTotalCount() {
      this.totalCommentCount++;
    },
    onReplyClick(comment) {
      // console.log('onReplyClick', comment);
      this.replyComment = comment;
      // 展示回复内容
      this.isReplyShow = true;
    },
    // 滚动到全部评论位置
    toCommentClick() {
      this.$nextTick(() => {
        this.$refs.articleEndRef.scrollIntoView({
          behavior: 'smooth', // 设置出现的滑动效果->平滑的动画
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.article-container {
  background-color: #fff;
  /deep/ .van-loading {
    text-align: center;
    background-color: #f5f7f9;
  }
  .title {
    background-color: #fff;
    font-size: 20px;
    color: #3a3a3a;
    padding: 14px;
    margin: 0;
  }
  .user-info {
    .avatar {
      width: 35px;
      height: 35px;
      margin-right: 8px;
    }
    .name {
      font-size: 12px;
      color: #333;
    }
    .pubdate {
      font-size: 11px;
      color: #b4b4b4;
    }
    .follow-btn {
      width: 85px;
      height: 29px;
    }
  }
  .markdown-body {
    padding: 14px;
  }

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
      width: 141px;
      height: 23px;
      border: 1px solid #eee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 11px;
        background-color: #e22829;
      }
    }
  }

  .article-wrap {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 44px;
    overflow-y: auto;
    background-color: #fff;
  }
}
</style>
