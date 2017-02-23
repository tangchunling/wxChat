<template>
  <div>
   <el-card class="box-card" style="width: 420px">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">组列表</span>
        <el-button style="float: right;" size="small" icon="plus" type="text" @click="open">新建组</el-button>        
      </div>
      <div class="text item" @click="addall">
        <span>所有机器人</span>
        <i class="el-icon-arrow-right" style="float: right;color: #666"></i>
      </div>
      <div class="text item" v-for='item in grouplist' @click="add(item.id, item.groupName)">
        <span>{{item.groupName}}</span>
        <i class="el-icon-arrow-right" style="float: right;color: #666"></i>        
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'usermanage',
  data() {
      return {
       grouplist: []
      };
    },
    methods: {
     handleClick(tab, event) {
        console.log(tab, event);
      },
      open: function () {
        var self = this
        this.$prompt('请输入组', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          self.addgroup(value)
        }).catch(() => {
                
        });
      },
      add: function (id, groupName) {
        this.$router.push('/robotlist?id='+ id + '&groupName=' + groupName)
      },
      addall: function () {
        this.$router.push('/allrobotlist')        
      },
      getgroup: function () {
        var self = this
        this.axios.post('/robotgroup/get_list')
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.grouplist = data.data
            }
						console.log(data)
					}, (response) => {
						console.log(response);
					});
      },
      addgroup: function (value) {
        var self = this
        this.axios.post('/robotgroup/create', {groupName: value})
          .then(function(res){
              var data = res.data
              console.log(data)
              if(data.code == 0){
                self.getgroup()
              }            
          })
          .catch(function(err){
              console.log(err);
          })
      }
    },
    created: function () {
      this.getgroup()
    }
}
</script>

<style scoped>
  .text{font-size: 14px;overflow: hidden;padding: 16px 0}
</style>
