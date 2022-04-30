<template>
  <div class="update-photo">
    <img class="image" :src="image" ref="image" />
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    ></van-nav-bar>
  </div>
</template>

<script>
import { updateUserPhoto } from 'network/user';
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';

export default {
  name: 'UpdatePhoto',
  props: {
    file: {
      type: File,
      required: true,
    },
  },
  data() {
    return {
      image: window.URL.createObjectURL(this.file),
      // 裁切器实例
      cropper: null,
    };
  },
  mounted() {
    // 获取需要裁切的图片Dom
    const image = this.$refs.image;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      // autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
    });
  },
  methods: {
    getCroppedCanvas() {
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file);
        });
      });
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidclick: true,
        duration: 0,
      });

      const file = await this.getCroppedCanvas();
      const fd = new FormData();
      fd.append('photo', file);
      // 如果要求Content-Type是multipart/form-data，则一定要提交FormData数据对象,专门用于文件上传,不能提交{},没用
      // const fd = new FormData();
      // fd.append('photo', this.file);
      const res = await updateUserPhoto(fd);
      // console.log(res);

      // 更新父组件中的用户头像
      this.$emit('update-photo', window.URL.createObjectURL(file));

      // 关闭弹出层
      this.$emit('close');

      this.$toast.success('保存成功');
    },
  },
};
</script>

<style lang="less" scoped>
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
}
.image {
  /* Ensure the size of the image fit the container perfectly */
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
