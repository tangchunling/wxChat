<template>
  <div class="admin-userlist">
    <template>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select placeholder="组" v-model="groupid" @change="getrobotdata">
            <el-option label="所有机器人" value="" checked></el-option>            
            <el-option :label="item.groupName" :value="item.id" v-for="item in grouplist"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="机器人" v-model="robotid" @change="getuser">
            <template v-if='groupid == ""'>
              <el-option :label="item.robotWx" :value="item.id" v-for="item in robotlist"></el-option>              
            </template>
            <template v-else>
              <el-option :label="item.robotWx" :value="item.robotId" v-for="item in robotlist"></el-option>              
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="用户名" v-model="searchcontent"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部用户" name="first"></el-tab-pane>
        <el-tab-pane label="7天无互动用户" name="second"></el-tab-pane>
        <el-tab-pane label="前100互动用户" name="third"></el-tab-pane>
      </el-tabs>
      <el-dialog title="最新消息列表" v-model="dialogTableVisible" size="large">
        <el-table :data="contentlist">
          <el-table-column label="时间">
            <template scope="scope">
              {{formate(scope.row.createdAt)}}
            </template>
          </el-table-column>
          <el-table-column property="fromName" label="from"></el-table-column>
          <el-table-column property="toName" label="to"></el-table-column>                              
          <el-table-column property="content" label="消息内容"></el-table-column>
        </el-table>
      </el-dialog>
      <el-table :data="userlist" style="width: 100%" v-loading.fullscreen.lock="loading">
            <el-table-column prop="friend.wechat" label="微信号"></el-table-column>
            <el-table-column label="微信名">
              <template scope='scope'>
                <span v-html="scope.row.friend.name"></span>                  
              </template>
            </el-table-column>
            <el-table-column prop="friend.sex" label="性别">
              <template scope='scope'>
                <span v-if="scope.row.friend.sex">{{scope.row.friend.sex == 1 ? '男' : '女'}}</span>                  
              </template>
            </el-table-column>
            <el-table-column prop="friend.city" label="城市"></el-table-column>  
            <el-table-column prop="friend.sourceNick" label="上级"></el-table-column>
            <el-table-column prop="friend.sourceWechat" label="上级微信号"></el-table-column>            
            <el-table-column prop="friend.lastChatTime" label="最后发言时间">
              <template scope='scope'>
                  <span>{{formate(scope.row.friend.lastChatTime)}}</span>                  
                </template>
            </el-table-column>
            <el-table-column label="最后一条消息">
              <template scope='scope'>
                <el-button type="text" size="small" @click="open1(scope.row.friend.robotId, scope.row.friend.id)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="friend.chatNum" label="消息数"></el-table-column>            
            <el-table-column label="用户标签" prop="tag">
                <template scope='scope'>
                  <el-tag type="primary" v-for="item in scope.row.tags" :closable="true" @close="delettag(item.id)">{{item.tagName}}</el-tag> <br> 
                  <el-button size="small" @click="setting(scope.row.friend.robotId, scope.row.friend.id, scope.row.friend.name)" type="text">设置标签</el-button>               
                </template>
            </el-table-column>                        
            <el-table-column prop="friend.remark" label="备注">
                <template scope="scope">
                  <div>{{scope.row.friend.remark}}</div>
                  <el-button size="small" @click="open(scope.row.friend.name, scope.row.friend.id)" type="text">设置</el-button><br>                                                     
                </template>
            </el-table-column> 
            <el-table-column label="用户操作">
                <template scope="scope">
                  <el-button size="small" @click="see(scope.row.friend.robotId, scope.row.friend.id)" type="text">查看消息记录</el-button><br>
                  <el-button size="small" @click="query(scope.row.friend.robotId,scope.row.friend.wxId)" type="text">查看下级</el-button>                                                      
                </template>
              </el-table-column>                                     
          </el-table>
      <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :current-page='currentpage' :page-size="num" :total="total" style="margin: 20px 0 40px 0;text-align: center" v-show="pageshow">
      </el-pagination>
    </template>
  </div>
</template>

<script>
export default {
  name: 'userlist',
  data() {
      return {
        dialogTableVisible: false,
       activeName: 'first',
       userlist: [],
        grouplist: [],
        robotlist: [],
        groupid: '',
        robotid: '',
        total: 0,
        num: 20,
        offset: 0,
        currentpage: 1,
        loading: false,
        contentlist: [],
        searchcontent: '',
        pageshow: true
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
     handleClick(tab, event) {
       this.offset = 0
       this.currentpage = 1
       this.pageshow = true
        if(tab.name == 'third'){
          this.getactive()
        }
        else if(tab.name == 'second'){
          this.get7days()
        }
        else{
          this.getuser()
        }
      },
      setting: function (robotId, accountId, accountName) {
        var self = this
        this.$prompt('请输入标签', accountName, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          self.settag(value, robotId, accountId, accountName)
        }).catch(() => {
               
        });
      },
      settag: function (tagName, robotId, accountId, accountName) {
         var self = this
        this.axios.post('/robottag/create_account_tag',{tagName: tagName, robotId: robotId, accountId: accountId, accountName: accountName})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              if(self.activeName == 'first'){
                  self.getuser()          
                }
                else if(self.activeName == 'second'){
                  self.get7days()          
                }
                else if(self.activeName == 'third'){
                  self.getactive()          
                }
            }
					}, (response) => {
						console.log(response);
					});
      },
      delettag: function (id) {
        console.log(0)
         var self = this
        this.axios.post('/robottag/delete_account_tag',{id: id})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              if(self.activeName == 'first'){
                  self.getuser()          
                }
                else if(self.activeName == 'second'){
                  self.get7days()          
                }
                else if(self.activeName == 'third'){
                  self.getactive()          
                }
            }
					}, (response) => {
						console.log(response);
					});
      },
      see: function (robotId, id) {
        window.open('/sendmessage?robotId=' + robotId + '&id=' + id + '&groupid=' + this.groupid)
      },
      getgroup: function () {
        var self = this
        this.axios.post('/robotgroup/get_list')
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.grouplist = data.data
            }
					}, (response) => {
						console.log(response);
					});
      },
      getrobot: function () {
        var self = this
        this.axios.post('/robotgroup/get_robot_list')
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.robotlist = data.data
              self.robotid = ''
            }
					}, (response) => {
						console.log(response);
					});
      },
      getuser: function (value) {
        this.activeName = 'first'    
        this.pageshow = true            
        if(this.robotid == ''){
          return false
        }
        this.loading = true
        var self = this
        this.axios.post('/robotfriend/get_robot_friend_list',{robotId: self.robotid, offset: self.offset, num: self.num})
					.then((response) => {
						var data = response.data;
            self.loading = false
            console.log(data)
            if(data.code == 0){
              self.userlist = data.data.list
              self.total = data.data.count
            }
					}, (response) => {
            self.loading = false
						console.log(response);
					});
      },
      query: function (value1, value2) {
        this.$router.push('/lowerlist?robotId='+value1+'&sourceWechat='+value2)
      },
      getlower: function (value1, value2) {
        var self = this
        this.axios.post('/robotfriend/get_robot_lower_friend_list',{robotId: value1, sourceWechat: value2, offset: 0, num: 10})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              return data.data.count
            }
					}, (response) => {
						console.log(response);
					});
      },
      handleCurrentChange: function (val) {
        this.offset = (val-1)*this.num
        if(this.activeName == 'first'){
          this.getuser()          
        }
        else if(this.activeName == 'second'){
          this.get7days()          
        }
        else if(this.activeName == 'third'){
          this.getactive()          
        }
      },
      getrobotdata: function () {
        if(this.groupid == ''){
          this.getrobot()
          return false
        }
        var self = this
        this.axios.post('/robotgroup/get_info_list',{robotGroupId: this.groupid})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.robotlist = data.data || []
              self.robotid = '' 
            }
					}, (response) => {
						console.log(response);
					});
      },
      getactive: function () {
        var self = this
        self.loading = true
        this.axios.post('/robotfriend/get_robot_friend_list_active',{robotId: this.robotid, offset: this.offset, num: self.num})
					.then((response) => {
						var data = response.data;
            self.loading = false
            if(data.code == 0){
              self.userlist = data.data.list || []
              self.total = data.data.count > 100? 100 : data.data.count              
            }
					}, (response) => {
            self.loading = false
						console.log(response);
					});
      },
      get7days: function () {
        var self = this
        self.loading = true
        this.axios.post('/robotfriend/get_robot_friend_list_7days_nochat',{robotId: this.robotid, offset: this.offset, num: self.num})
					.then((response) => {
						var data = response.data;
            self.loading = false
            if(data.code == 0){
              self.userlist = data.data.list || []
              self.total = data.data.count             
            }
					}, (response) => {
            self.loading = false
						console.log(response);
					});
      },
      open: function (name, id) {
        var self = this
        this.$prompt('请输入备注', name, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          self.setremark(value, id)
        }).catch(() => {
               
        });
      },
      open1(robotId, id) {
        var self = this
        this.axios.post('/robotfriend/get_robot_friend_chat_list',{robotId: robotId, accountId: id, offset: 0,num: 10})
					.then((response) => {
						var data = response.data;
            console.log(data)
            if(data.code == 0){
              self.contentlist = data.data.list? [data.data.list[0]] : []
              self.dialogTableVisible = true
            }
					}, (response) => {
						console.log(response);
					});
      },
      setremark: function (value, id) {
        var self = this
        this.axios.post('/robotfriend/update_robot_friend_reamrk', {robotId: this.robotid, remark: value, userId: id})
          .then(function(res){
              var data = res.data
              console.log(data)
              if(data.code == 0){
                // self.getgroup()
                if(self.activeName == 'first'){
                  self.getuser()          
                }
                else if(self.activeName == 'second'){
                  self.get7days()          
                }
                else if(self.activeName == 'third'){
                  self.getactive()          
                }
              }            
          })
          .catch(function(err){
              console.log(err);
          })
      },
      search: function () {
        if(!this.searchcontent || !this.robotid){
          this.$message({
            message: '用户名为空或没有选择机器人',
            type: 'warning'
          })
          return false
        }
        var self = this
        this.axios.post('/robotfriend/search_robot_friend', {robotId: this.robotid, keyword: this.searchcontent})
          .then(function(res){
              var data = res.data
              console.log(data)
              if(data.code == 0){
                self.pageshow = false
                self.userlist = data.data || []
              }            
          })
          .catch(function(err){
              console.log(err);
          })
      }
    },
    created: function () {
      this.getgroup()
      this.getrobot()
    }
}
</script>

<style>
  .admin-userlist{width: 100%}
</style>
