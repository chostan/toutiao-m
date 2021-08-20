<template>
  <div class="user-chat">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <van-cell-group class="message-list" ref="message-list">
      <van-cell
        :title="item.msg"
        v-for="(item, index) in messages"
        :key="index"
      />
    </van-cell-group>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message-wrap">
      <van-field v-model="message" placeholder="请输入消息" :border="false" />
      <van-button
        class="send-message-btn"
        type="primary"
        size="small"
        @click="onSend"
        >发送</van-button
      >
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
import io from 'socket.io-client';
import { getItem, setItem } from 'utils/store';

export default {
  name: 'UserChat',
  data() {
    return {
      message: '',
      // WebSocket通信对象
      socket: null,
      // 消息列表
      messages: getItem('chat-messages') || null,
    };
  },
  watch: {
    messages() {
      // setItem('chat-messages', this.messages);
      // this.$nextTick(() => {
      //   this.scrollToBottom();
      // });
    },
  },
  created() {
    // // 建立连接
    // const socket = io('http://ttapi.research.itcast.cn');
    // this.socket = socket;
    // socket.on('connect', () => {
    //   console.log('连接建立');
    // });
    // socket.on('disconnect', () => {
    //   console.log('连接断开');
    // });
    // // 监听message事件，接受服务端消息
    // socket.on('message', (data) => {
    //   console.log(data);
    //   this.messages.push(data);
    // });
  },
  mounted() {
    this.scrollToBottom();
  },
  methods: {
    onSend() {
      // const data = {
      //   msg: this.message,
      //   timestamp: Date.now(),
      // };
      // this.socket.emit('message', data);
      // // 把用户发出去的消息存储到列表中
      // this.messages.push(data);
      // // 清空输入框
      // this.message = '';
    },
    scrollToBottom() {
      // const list = this.$refs['message-list'];
      // list.scrollTop = list.scrollHeight;
    },
  },
};
</script>

<style lang="less" scoped>
.message-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
.send-message-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 0 14px;
  align-items: center;
  .send-message-btn {
    white-space: nowrap;
    width: 60px;
    height: 30px;
  }
}
</style>
