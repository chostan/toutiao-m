<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- /导航栏 -->

    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from 'network/user';

export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localName: this.value,
    };
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // 禁止背景点击
      });
      try {
        // 请求提交更新用户昵称
        const res = await updateUserProfile({
          name: this.localName,
        });
        // console.log(res);
        // 更新成功，修改父组件的name，关闭弹出层
        // this.$emit('update-name', this.localName);
        this.$emit('input', this.localName);
        this.$emit('close');
        this.$toast.success('保存成功');
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在');
        } else {
          this.$toast.fail('操作失败，请稍后重试');
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.name-field-wrap {
  padding: 10px;
}
</style>
