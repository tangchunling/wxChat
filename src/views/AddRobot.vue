<template>
  <div>
   <el-card class="box-card" style="width: 420px">
      <div slot="header" class="clearfix">
        <span>{{groupName}}</span>
        <el-button style="float: right;margin-bottom: -10px" type="text" @click="addrobot">确定</el-button>        
      </div>
      <!--<div class="item text" v-for="item in robotlist">
          <el-checkbox v-model="checkList" @click="change(item)">{{item.robotWx}}</el-checkbox>
      </div>-->
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in robotlist" :label="item.id" style="display: block;margin: 10px 0" :disabled="show(item)">{{item.robotWx}}</el-checkbox>
      </el-checkbox-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'usermanage',
  data() {
      return {
       groupName: '',
       robotlist: [],
       id: '',
       checkList: [],
       robotlist1: []
      };
    },
    methods: {
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
      addrobot: function () {
        var robotList = []
         for(var i in this.checkList){
            for(var q in this.robotlist1){
              if(this.checkList[i] == this.robotlist1[q].robotId){
                var index = this.checkList.indexOf(this.robotlist1[q].robotId);
                  if (index > -1) {
                  this.checkList.splice(index, 1);
                }
               }
            } 
        }
        console.log(this.checkList)
        for(var i in this.checkList){
          for(var j in this.robotlist){
              if(this.robotlist[j].id == this.checkList[i]){
                var data = {
                  id: this.robotlist[j].id,
                  robotWx: this.robotlist[j].robotWx
                }
                robotList.push(data)
              }
          }
        }
        var self = this
        this.axios.post('/robotgroup/add_group_info_list',{robotGroupId: this.id, robotList: robotList})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.$message({
                message: '添加成功',
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
						var data = response.data;
            console.log(data)
            if(data.code == 0){
              self.robotlist1 = data.data || []
              for(var item in data.data){
                self.checkList.push(data.data[item].robotId)
              }
            }
					}, (response) => {
						console.log(response);
					});
      },
      show: function (item) {
        for(var i in this.robotlist1){
          if(item.id == this.robotlist1[i].robotId){
            return true
          }
        }
      }
    },
    created: function () {
      this.id = Number.parseInt(this.$route.query.id)
      this.groupName = this.$route.query.groupName
      this.getrobot()
      this.getrobotdata()
    }
}
</script>

<style scoped>
  .text{font-size: 14px;overflow: hidden;padding: 10px 0}
  .input{width: 300px}
</style>
