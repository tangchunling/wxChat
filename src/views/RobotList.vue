<template>
  <div>
   <el-card class="box-card" style="width: 420px">
      <div slot="header" class="clearfix">
        <el-input v-model="groupName" class="input"></el-input>
        <el-button style="float: right;" icon="plus" type="text" @click="updategroup()">保存</el-button>        
      </div>
      <div class="text item" v-for="item in robotlist">
          {{item.robotWx}}
          <el-button style="float: right;margin-top: -10px" icon="delete2" type="text" @click="deletrobot(item.id)"></el-button> 
      </div>
      <div class="text item" style="text-align: center">
        <el-button icon="plus" type="text" @click="add">添加机器人</el-button>                        
      </div>
    </el-card>
    <div style="text-align: center;margin-top: 20px">
        <el-button icon="delete2" type="text" @click="open">删除组</el-button>              
    </div>
  </div>
</template>

<script>
export default {
  name: 'robotlist',
  data() {
      return {
       groupName: '',
       robotlist: [],
       id: ''
      };
    },
    methods: {
     handleClick(tab, event) {
        console.log(tab, event);
      },
      open: function () {
        var self = this
        this.$confirm('此操作将永久删除该组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.deletgroup()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      getrobot: function () {
        var self = this
        this.axios.post('/robotgroup/get_robot_list')
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.robotlist = data.data
            }
						console.log(data)
					}, (response) => {
						console.log(response);
					});
      },
      deletrobot: function (id) {
        var self = this
        this.axios.post('/robotgroup/del_robot_group_info',{id: id})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.$message({
                message: '删除成功',
                type: 'success'
              })
              self.getrobotdata()
            }
						console.log(data)
					}, (response) => {
						console.log(response);
					});
      },
      getrobotdata: function () {
        var self = this
        this.axios.post('/robotgroup/get_info_list',{robotGroupId: this.id})
					.then((response) => {
						var data = response.data
            console.log(data)
            if(data.code == 0){
              self.robotlist = data.data || []
            }
					}, (response) => {
						console.log(response);
					});
      },
      add: function () {
        this.$router.push('/addrobot?id='+ this.id + '&groupName=' + this.groupName)        
      },
      updategroup: function () {
        var self = this
        this.axios.post('/robotgroup/update_robot_group',{robotGroupId: this.id, groupName: this.groupName})
					.then((response) => {
						var data = response.data
            if(data.code == 0){
              self.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$router.push('/robotlist?id='+ self.id + '&groupName=' + self.groupName)
            }
						console.log(data)
					}, (response) => {
						console.log(response);
					});
      },
      deletgroup: function () {
        var self = this
        this.axios.post('/robotgroup/del_robot_group',{robotGroupId: this.id})
					.then((response) => {
						var data = response.data
            if(data.code == 0){
              self.$message({
                message: '删除成功',
                type: 'success'
              })
              self.$router.push('/usermanage')
            }
						console.log(data)
					}, (response) => {
						console.log(response);
					});
      }
    },
    created: function () {
      this.id = Number.parseInt(this.$route.query.id)
      this.groupName = this.$route.query.groupName
      if(this.id){
        this.getrobotdata()
        return
      }
      this.getrobot()
    }
}
</script>

<style scoped>
  .text{font-size: 14px;overflow: hidden;padding: 10px 0}
  .input{width: 300px}
</style>
