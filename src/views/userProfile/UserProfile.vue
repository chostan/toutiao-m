  <template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <input
      type="file"
      hidden
      accept="image/*"
      ref="file"
      @change="onFileChange"
    />
    <!-- /导航栏 -->

    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image width="30" height="30" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="isEditNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
      @click="isEditGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isEditBirthdayShow = true"
    ></van-cell>

    <!-- 修改昵称 -->
    <van-popup
      v-model="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!--
        <update-name
          :name="user.name"
          @updateName="user.name = $event"
      ></update-name> -->
      <!-- 但项子组件传值，且改制要在子组件修改并且作用在父组件上时 -->
      <!--
        v-model="user.name"
          默认传递一个名字叫value的数据
          :value="user.name"
          默认监听input事件 @input="user.name = $event"
       -->
      <!-- <update-name
        v-if="isEditNameShow"
        v-model="user.name"
        @close="isEditNameShow = false"
      ></update-name> -->
      <update-name
        v-if="isEditNameShow"
        :value="user.name"
        @input="updateUserName"
        @close="isEditNameShow = false"
      ></update-name>
    </van-popup>
    <!-- /修改昵称 -->

    <!-- 修改性别 -->
    <van-popup v-model="isEditGenderShow" position="bottom">
      <update-gender
        v-if="isEditGenderShow"
        v-model="user.gender"
        @close="isEditGenderShow = false"
      ></update-gender>
    </van-popup>
    <!-- /修改性别 -->

    <!-- 修改生日 -->
    <van-popup v-model="isEditBirthdayShow" position="bottom">
      <update-birthday
        v-if="isEditBirthdayShow"
        v-model="user.birthday"
        @close="isEditBirthdayShow = false"
      ></update-birthday>
    </van-popup>
    <!-- /修改生日 -->

    <!-- 修改头像 -->
    <van-popup
      class="update-pthoto-popup"
      v-model="isEditPhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
        v-if="isEditPhotoShow"
        :file="previewImage"
        @close="isEditPhotoShow = false"
        @update-photo="updateUserPhoto"
      ></update-photo>
    </van-popup>
    <!-- /修改头像 -->
  </div>
</template>

<script>
import { getUserProfile } from 'network/user';
import UpdateName from './childComps/UpdateName';
import UpdateGender from './childComps/UpdateGender';
import UpdateBirthday from './childComps/UpdateBirthday';
import UpdatePhoto from './childComps/UpdatePhoto';

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  data() {
    return {
      // 用户数据
      user: {},
      // 编辑昵称的显示状态
      isEditNameShow: false,
      // 编辑性别的显示状态
      isEditGenderShow: false,
      // 编辑生日的显示状态
      isEditBirthdayShow: false,
      // 编辑头像的显示状态
      isEditPhotoShow: false,
      // 上传预览图片
      previewImage: null,
    };
  },
  created() {
    this.loadUserProfile();
  },
  methods: {
    async loadUserProfile() {
      const { data } = await getUserProfile();
      this.user = data.data;
    },

    onFileChange() {
      // 在弹出层里预览图片
      const file = this.$refs.file.files[0];
      // const blob = window.URL.createObjectURL(this.$refs.file.files[0]);
      this.previewImage = file;

      // 展示弹出层
      this.isEditPhotoShow = true;

      // 为了解决相同文件不触发change事件，这里手动的清空file的value
      this.$refs.file.value = '';
    },
    updateUserName(name) {
      this.user.name = name;
      this.$store.commit('setUserName', name);
    },
    updateUserPhoto(photo) {
      this.user.photo = photo;
      this.$store.commit('setUserPhoto', photo);
    },
  },
};
</script>

<style lang="less" scoped>
.user-profile {
  .van-popup {
    background-color: #f5f7f9;
  }

  .update-pthoto-popup {
    background-color: #000;
  }
  /deep/ .van-cell__value {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
