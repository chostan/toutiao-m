<template>
  <div id="app">
    <h1>头条</h1>
    <div class="box">哈哈哈</div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="less">
@import url('assets/css/index.less');
.box {
  width: 350px;
  height: 200px;
  background-color: skyblue;
  font-size: 12px;
}
</style>
