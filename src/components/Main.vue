<template>
  <div class="admin-content">
    <el-menu theme="dark" default-active="1" class="el-menu-demo header" mode="horizontal" @select='handselect1'>
      <el-menu-item index="/loginrobot" class="top">登录机器人</el-menu-item>
      <el-submenu index="1" class="top">
        <template slot="title">{{user}}</template>
        <el-menu-item index="loginout">退出</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="main">
      <div class="admin-slider">
        <el-menu :default-active="active" class="el-menu-vertical-demo" @select='handselect'>
          <el-menu-item index="/usermanage"><i class="el-icon-menu"></i>组管理</el-menu-item>          
          <el-menu-item index="/userlist"><i class="el-icon-menu"></i>用户信息管理</el-menu-item>
          <el-menu-item index="/taglist"><i class="el-icon-document"></i>标签管理</el-menu-item>           
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-setting"></i>朋友圈素材管理</template>
            <el-menu-item-group>
              <el-menu-item index="/sourcelist">素材列表</el-menu-item>
              <el-menu-item index="/addsource">添加素材</el-menu-item>              
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/sendmessage"><i class="el-icon-message"></i>消息发送</el-menu-item>
        </el-menu>
      </div>
      <div class="admin-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'main',
  data () {
    return {
      active: '/userlist',
      user: ''
    }
  },
  methods: {
      handselect(index, indexPath){
        if(index == '/sendmessage'){
          window.open(index)
          return false
        }
        this.$router.push(index)
      },
      handselect1(index, indexPath){
        if(index == '/loginrobot'){
          this.$router.push('/loginrobot')
        }
        else if(index == 'loginout'){
          var self = this
          this.axios.get('http://tym.taoyumin.cn/index.php?r=user/logout',{withCredentials: true})
          .then((response) => {
            var data = response.data
            if(data.state == 1000){
              self.$router.push("/")
            }
           
          }, (response) => {
            console.log(response);
          });
        }
      },
      getuser: function () {
        var self = this
        this.axios.get('http://tym.taoyumin.cn/index.php?r=user/checklogin',{withCredentials: true})
          .then((response) => {
            var data = response.data
            if(data.state == 1000){
              self.user = data.data.userName
            }
            else{
              self.$router.push("/")
            }
          }, (response) => {
            console.log(response);
          });
      }
    },
    created: function () {
      this.active = this.$route.path
      this.getuser()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .admin-content{position: relative;height: 100%;}
  .admin-content:after,.admin-content::before{content: '';display: table}
  .admin-slider{width: 200px;float: left;position: static;height: 100%}
  .admin-slider>ul{height: 100%}
  .el-menu--horizontal .top{float: right}
  .admin-container{display: flex;padding:20px;height: 100%;overflow-y: scroll;}
  .header{position: fixed;top: 0;width: 100%;left:0;z-index:2000}
  .main{position: relative;height: 100%;padding-top: 60px}
</style>
