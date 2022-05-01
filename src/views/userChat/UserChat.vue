<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      fixed
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div class="chat-item-wrap">
        <!-- 左侧是机器人小智 -->
        <div
          ref="chat-item"
          v-for="(item, index) in messageList"
          :key="index"
          class="chat-item"
          :class="{ reverse: item.name == 'me' }"
        >
          <van-image fit="cover" round :src="chatItemPhoto(item)" />
          <div class="chat-pao">{{ item.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <!-- <div class="chat-item reverse">
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">这里是我说的话</div>
        </div> -->
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field
        v-model="word"
        placeholder="说点什么..."
        @keyup.enter="sendMessage"
      >
        <template #button>
          <span style="font-size: 12px; color: #999" @click="sendMessage"
            >发送</span
          >
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import { mapState } from 'vuex';

export default {
  name: 'Chat',
  data() {
    return {
      word: '', // 输入框的内容
      // 所有的聊天消息
      messageList: [
        { name: 'xs', msg: 'hi，你好！我是小思' },
        { name: 'me', msg: '你好, 我是张三' },
        { name: 'xs', msg: 'hi，你好！我是小思' },
        { name: 'me', msg: '你好, 我是张三' },
        { name: 'xs', msg: 'hi，你好！我是小思' },
        { name: 'me', msg: '你好, 我是张三' },
        { name: 'xs', msg: 'hi，你好！我是小思' },
        { name: 'me', msg: '你好, 我是张三' },
        { name: 'xs', msg: 'hi，你好！我是小思' },
        { name: 'me', msg: '你好, 我是张三' },
      ],
      socket: null, // 客户端和服务端建立连接的socket对象
    };
  },
  computed: {
    ...mapState(['user']),
  },
  watch: {
    messageList: {
      handler: function () {
        console.log('-----');
        // 最后一条聊天消息滚动到底部
        this.$nextTick(() => {
          const chatItemRef =
            this.$refs['chat-item'][this.messageList.length - 1];

          chatItemRef.scrollIntoView({
            behavior: 'smooth',
          });
        });
      },
      immediate: true,
    },
  },
  created() {
    this.createSocket();
    this.socketConect();
    this.socketMessage();
  },
  methods: {
    createSocket() {
      this.socket = io('ws://geek.itheima.net', {
        query: {
          token: this.user.token,
        },
        transports: ['websocket'],
      });
    },

    // 测试下是否建立链接成功
    socketConect() {
      this.socket.on('connect', () => {
        console.log('连接建立成功');
      });
    },

    // 接收后端传回来的消息
    socketMessage() {
      this.socket.on('message', (obj) => {
        this.messageList.push({
          name: 'xs',
          msg: obj.msg,
        });

        // // 最后一条聊天消息滚动到底部
        // this.$nextTick(() => {
        //   const chatItemRef =
        //     this.$refs['chat-item'][this.messageList.length - 1];

        //   chatItemRef.scrollIntoView({
        //     behavior: 'smooth',
        //   });
        // });
      });
    },

    // 发送消息
    sendMessage() {
      if (this.word.trim().length === 0) return;
      this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getTime(),
      });
      this.messageList.push({
        name: 'me',
        msg: this.word,
      });

      this.word = '';
    },
    // 聊天头像
    chatItemPhoto(chat) {
      if (chat.name == 'me') {
        return this.$store.state.userPhoto;
      } else {
        return 'https://img.yzcdn.cn/vant/cat.jpeg';
      }
    },
  },
  destroyed() {
    this.socket.close();
    this.socket = null;
  },
};
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 46px 0 50px 0;
  box-sizing: border-box;
  background: #fafafa;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      padding: 10px;
      .van-image {
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        position: relative;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        padding: 0 10px;
        margin-left: 15px;
        margin-right: 0;
        border: 1px solid #c2d9ea;
        border-radius: 4px;
        background-color: #e0effb;
        color: #333;
        font-size: 14px;
        line-height: 38px;
        word-break: break-all;
        word-wrap: break-word;
        &::before {
          content: '';
          position: absolute;
          top: 12px;
          left: -5px;
          transform: rotate(-135deg);
          width: 10px;
          height: 10px;
          box-sizing: border-box;
          border-top: 1px solid #c2d9ea;
          border-right: 1px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
    .reverse {
      flex-direction: row-reverse;
      .chat-pao {
        margin-left: 0;
        margin-right: 15px;
        &::before {
          left: unset;
          right: -6px;
          transform: rotate(45deg);
        }
      }
    }
    // .chat-item.left {
    //   .chat-pao {
    //     margin-left: 15px;
    //     margin-right: 0;
    //     &::before {
    //       left: -5px;
    //       transform: rotate(-135deg);
    //     }
    //   }
    // }
    .reply-container {
      position: fixed;
      left: 0;
      bottom: 0;
      height: 44px;
      width: 100%;
      background: #f5f5f5;
      z-index: 9999;
    }
  }
}
</style>
