<template>
  <div class="admin-login">
      <el-button type="success" @click="submitForm">登录微信网页版接口</el-button>
  </div>
</template>

<script>
export default {
  name: 'loginrobot',
  data() {
      return {
        
      };
    },
    methods: {
      submitForm() {
        var self = this
        this.axios.post('http://192.168.100.101:6161/startwx2',{'ifSaveRobot': true})
					.then((response) => {
						var data = response.data
						console.log(data)
					}, (response) => {
						console.log(response);
					});
      }
    }
}
</script>

<style>
  .admin-login{width: 400px;margin: auto;position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);}
</style>
