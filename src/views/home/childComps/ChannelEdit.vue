<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        class="editBtn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: active === index }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>

    <van-cell center :border="false">
      <div slot="title">频道推荐</div>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from 'network/channel';
import { setItem } from 'utils/store';

export default {
  name: 'ChannelEdit',
  props: {
    userChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // 所有频道列表
      allChannels: [],
      // 控制编辑的显示状态
      isEdit: false,
    };
  },
  computed: {
    ...mapState(['user']),
    // 推荐频道列表
    recommendChannels() {
      return this.allChannels.filter((channel) => {
        // 判断channel是否属于用户频道
        return !this.userChannels.find((userChannel) => {
          // 找到满足该条件的元素
          return userChannel.id === channel.id;
        });
      });
    },
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels();
      // console.log(data);
      this.allChannels = data.data.channels;
    },
    async onAdd(channel) {
      this.userChannels.push(channel);

      // todo: 数据持久化
      if (this.user) {
        // 登录了，数据存储到线上
        const res = await addUserChannel({
          channels: [
            {
              id: channel.id,
              seq: this.userChannels.length,
            },
          ],
        });
        // console.log(res);
      } else {
        // 没有登录，数据存储到本地
        // console.log('本地');
        setItem('user-channels', this.userChannels);
      }
    },
    onUserChannelClick(channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，删除频道
        this.deleteChannel(channel, index);
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index);
      }
    },
    async deleteChannel(channel, index) {
      // 如果删除的是当前激活频道之前的频道
      if (index <= this.active) {
        // 更新激活频道的索引
        this.$emit('updateActive', this.active - 1);
      }
      this.userChannels.splice(index, 1);

      // 数据持久化
      if (this.user) {
        // 登录了，持久化到线上
        const res = await deleteUserChannel(channel.id);
        console.log(res);
      } else {
        // 没有登录，持久化到本地
        setItem('user-channels', this.userChannels);
      }
    },
    switchChannel(index) {
      // console.log('切换频道');
      // 切换频道
      this.$emit('updateActive', index);
      // 关闭弹出层
      this.$emit('close');
    },
  },
};
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 54px;

  .channel-title {
    font-size: 16px;
    color: #333;
  }

  .editBtn {
    width: 50px;
    height: 24px;
  }

  .grid-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      top: -8px;
      right: -9px;
      font-size: 20px;
      color: #ccc;
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
