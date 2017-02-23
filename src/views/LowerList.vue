<template>
  <div style="width: 100%">
      <el-table :data="userlist" style="width: 100%">
        <el-table-column prop="friend.wechat" label="微信号"></el-table-column>
        <el-table-column prop="friend.name" label="微信名"></el-table-column>                
        <el-table-column prop="" label="最后发言时间">
          <template scope="scope">
            {{formate(scope.row.friend.lastChatTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="friend.message" label="最后一条消息"></el-table-column>
        <el-table-column prop="friend.chatNum" label="消息数"></el-table-column>                                
        <el-table-column label="用户标签" prop="tag">
            <template scope='scope'>
              <el-tag type="primary" v-for="item in scope.row.friend.tag">{{item.tagName}}</el-tag>                  
            </template>
        </el-table-column>                        
        <el-table-column prop="friend.remark" label="备注"></el-table-column> 
        <!--<el-table-column label="用户操作">
            <template scope="scope">
              <el-button size="small" @click="setting" type="text">设置</el-button>
              <el-button size="small" @click="see" type="text">查看消息记录</el-button>
              <el-button size="small" @click="query" type="text">查看下级</el-button>                                                      
            </template>
          </el-table-column>                                     -->
      </el-table>
      <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="num"
      layout="total, prev, pager, next"
      :total="total" style="margin-top: 20px;text-align: center">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'lowerlist',
  data() {
      return {
       userlist: [],
       offset: 0,
       num: 10,
       total: 0,
       currentPage: 1
      };
    },
    methods: {
      formate:function(t){
        var d = new Date(t*1000);
        var year = d.getFullYear();
        var day = d.getDate();
        var month = d.getMonth()+1;
        var hour = d.getHours();
        var minute = d.getMinutes();
        var f = year + "-" +this.init(month) + "-" + this.init(day) + " " + this.init(hour) + ":" + this.init(minute);
        return f;
      },
      init: function(d){
        return d>9?d:"0"+d;
      },
      handleCurrentChange: function (val) {
        this.offset = (val-1)*this.num
        this.getlower()
      },
     getlower: function () {
        var self = this
        var robotId = Number.parseInt(this.$route.query.robotId)
        var sourceWechat = self.$route.query.sourceWechat
        this.axios.post('/robotfriend/get_robot_lower_friend_list',{robotId: robotId, sourceWechat: sourceWechat, offset: this.offset, num: this.num})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.total = data.data.count
              self.userlist = data.data.list
            }
						console.log(data)
					}, (response) => {
						console.log(response);
					});
      }
    },
    created: function () {
      this.getlower()
    }
}
</script>

<style scoped>
  .text{font-size: 14px;overflow: hidden;padding: 10px 0}
  .input{width: 300px}
</style>
