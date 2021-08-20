<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      :columns="columns"
      :default-index="defaultIndex"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onGenderChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from 'network/user';

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showPicker: false,
      columns: ['男', '女'],
      defaultIndex: this.value,
    };
  },
  methods: {
    onGenderChange(piker, value, index) {
      this.defaultIndex = index;
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // 禁止背景点击
      });
      // 请求提交更新用户性别
      const res = await updateUserProfile({
        gender: this.defaultIndex,
      });
      this.$emit('input', this.defaultIndex);
      this.$emit('close');
      this.$toast.success('保存成功');
    },
  },
};
</script>

<style lang="less" scoped>
</style>
