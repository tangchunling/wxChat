<template>
  <div class="admin-message">
   <div class="messageleft">
     
      <el-select placeholder="组" v-model="groupid" @change="getrobotdata">
          <el-option label="所有机器人" value="" checked></el-option>            
          <el-option :label="item.groupName" :value="item.id" v-for="item in grouplist"></el-option>
      </el-select>
     <ul>
       <li v-for="item in robotlist" @click="getuser(item.id, item.robotWx)" :class="{active: robotid == item.id}">
         <span>{{item.robotWx}}</span>
       </li>
     </ul>
   </div>
   <div class="messagemiddle">  
     <el-tabs type="border-card" v-model="activename">
        <el-tab-pane label="聊天" name="first">
          <ul>
              <li v-for="(item, index) in messageuser" @click="getusermessage(index)" v-if="index != robotWx" :class="{active: userName==index}">
                <sub v-show="item.length != 0">{{item.length}}</sub>
                <span v-html="index"></span>
              </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="联系人" name="second">
          <el-input v-model="searchcontent"></el-input>
           <ul>
              <li v-for="item in userlist" @click="queryuser(item.friend.name)">
                <span v-html="item.friend.name"></span>
              </li>
            </ul>
        </el-tab-pane>
      </el-tabs>
     
   </div>
   <div class="messageright">
     <div class="messagecontent">
       <div class="messagetop" id="messagetop">
         <div class="messagelist messagelistleft" v-for="item in messagelist" :class="{messagelistright: item.fromName == robotWx}">
           <div style="text-align:center;font-size: 12px;color: #aaa">{{formate(item.createdAt)}}</div>
           <span>{{item.fromName}}</span>
           <p>{{item.content}}</p>
         </div>
         <div v-if="messagelist.length == 0" style="text-align: center;font-size: 14px;color: #666;padding:100px 0">
           暂无聊天记录
         </div>
       </div>
       <div class="sendmessage">
         <textarea rows="6" cols="" class="messagetextarea" v-model="sendcontent" v-on:keyup.enter="send"></textarea>
         <div class="btn">
           <el-button type="success" size="small" @click="send">发送</el-button>
         </div>
       </div>
     </div>
   </div>
  </div>
</template>

<script>
export default {
  name: 'sendmessage',
  data() {
      return {
       groupid: '',
       grouplist: [],
       robotlist: [],
       userlist: [],
       messagelist: [],
       robotid: '',
       accountId: '',
       robotWx: '',
       sendcontent: '',
       nickName: '',
       userName: '',
       messageuser: {},
       lastTime: 0,
       activename: 'first',
       intervalid: '',
       robotmessageuser: {},
       searchcontent: ''
      };
    },
    watch: {
      searchcontent: function (val){
        this.search()
      }
    },
    methods: {
      reserve: function (val) {
        return val.reverse()
      },
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
        console.log(tab, event);
      },
      getrobot: function () {
        var self = this
        this.axios.post('/robotgroup/get_robot_list')
					.then((response) => {
						var data = response.data;
            console.log(data)
            if(data.code == 0){
              self.robotlist = data.data || []
              for(var item in self.robotlist){
                self.robotmessageuser[self.robotlist[item].id] = {
                  lastTime: 0,
                  messageuser: {}
                }
              }
            }
					}, (response) => {
						console.log(response);
					});
      },
      getgroup: function () {
        var self = this
        this.axios.post('/robotgroup/get_list')
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.grouplist = data.data || []
            }
					}, (response) => {
						console.log(response);
					});
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
       getuser: function (value, robotWx) {   
        this.robotid = value
        this.robotWx = robotWx   
        this.messageuser =  this.robotmessageuser[this.robotid].messageuser 
        if(this.robotid == ''){
          return false
        }
        var self = this
        self.getrobotmessage()
        clearInterval(this.intervalid)
        this.intervalid = setInterval(function (){
          self.getrobotmessage()
        }, 10000)
        this.axios.post('/robotfriend/get_robot_friend_list',{robotId: value})
					.then((response) => {
						var data = response.data;
            console.log(data)
            if(data.code == 0){
              self.userlist = data.data.list || []
            }
					}, (response) => {
						console.log(response);
					});
      },
      getrobotmessage: function(val) {
        var self = this
        var lastTime = this.robotmessageuser[this.robotid].lastTime
        this.axios.post('/robotfriend/get_robot_new_chat_list',{robotId: this.robotid, lastTime: lastTime})
					.then((response) => {
						var data = response.data;
            console.log(data)
            if(data.code == 0){
              var s = _.groupBy(data.data, function(n){
                return n.fromName
              })
              var t = _.merge(self.messageuser, s, function(a, b) {
                if (_.isArray(a)) {
                  return a.concat(b);
                }
              })
              self.$set(data, self.messageuser, t)
              self.messageuser = Object.assign({}, self.messageuser, {})
              self.robotmessageuser[self.robotid].messageuser = self.messageuser
              if(data.data){
                self.robotmessageuser[this.robotid].lastTime = data.data[0].createdAt
              }  
            }
					}, (response) => {
						console.log(response);
					});
      },
      getusermessage: function(name) {
        this.userName = name
        this.messageuser[name] = []
        var result = _.find(this.userlist, function(chr) {
            return chr.friend.name == name;
          })
          console.log(result)
        if(!result){
          return false
        }
        this.accountId = result.friend.id
        this.nickName = result.friend.userName
        var self = this
        this.axios.post('/robotfriend/get_robot_friend_chat_list',{robotId: result.friend.robotId, accountId: result.friend.id})
					.then((response) => {
						var data = response.data;
            console.log(data)
            if(data.code == 0){
              self.messagelist = data.data.list? data.data.list.reverse() : []
            }
					}, (response) => {
						console.log(response);
					});
      },
      send: function () {
        if(!this.userName){
          this.$message({
            message: '请选择用户',
            type: 'warning'
          })
          return false
        }
        var self = this
        this.axios.post('/robotfriend/send_text_msg',{wechatNick: this.robotWx, nickName: this.userName, userName: this.nickName, msg: this.sendcontent})
					.then((response) => {
						var data = response.data;
            console.log(data)
            if(data.code == 0){
              var resultdata = {fromName: self.robotWx, toName: self.userName, content: self.sendcontent, createdAt: Number.parseInt(new Date().getTime()/1000)}
              self.messagelist.push(resultdata)
              self.sendcontent = ''              
              document.getElementById('messagetop').scrollTop = (document.getElementById('messagetop').scrollHeight - document.getElementById('messagetop').offsetHeight)  
            }
            else{
              self.$message.error('发送失败');
            }
					}, (response) => {
						console.log(response);
					});
      },
      queryuser: function (name) {
        if(!this.messageuser[name]){
          this.$set(this.messageuser, name, [])           
        }
        this.activename = 'first'
        this.getusermessage(name)
      },
      search: function () {
        var self = this
        this.axios.post('/robotfriend/search_robot_friend', {robotId: this.robotid, keyword: this.searchcontent})
          .then(function(res){
              var data = res.data
              console.log(data)
              if(data.code == 0){
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

<style scoped>
  .admin-message{display: flex;display: -webkit-flex;border: 1px solid #eee;width: 100%;height: 100%;min-height: 600px;}
  .messageleft,.messagemiddle{font-size: 14px;overflow-y:scroll}
  .messageleft ul li{padding: 10px;border-bottom: 1px solid #222;color: #f1f2f4;cursor: pointer}
  .messageleft ul li.active{background: #475669}
  .messagemiddle ul li.active{background: #EFF2F7}  
  .messagemiddle ul li span{display: block; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
  .messageleft{background: #324057;width: 160px;}
  .messagemiddle{width: 240px}
  .messagemiddle ul li{padding: 10px;border-bottom: 1px solid #eee;position: relative}
  .messagemiddle ul li sub{position: absolute;color: red;right: 10px}
  .messageright{flex: 1;-webkit-flex: 1;background: #f1f2f4;}
  .messagecontent{display: flex;display: -webkit-flex;flex-direction: column;height: 100%}
  .messagecontent .messagetop{flex: 1;-webkit-flex:1;border-bottom: 1px solid #ddd;overflow-y: scroll;padding-bottom: 20px;}
  .messagecontent .sendmessage{height: 160px}
  .sendmessage .messagetextarea{width: 100%;border: none;outline: none;padding: 6px 12px;font-size: 14px;color: #666;background: #f1f2f4}
  .btn{text-align: right;padding-right: 10px}
  .el-tree{border: none}
  .messagelist{font-size: 14px;margin-left: 20px;margin-top: 20px}
  .messagelist p{display: inline-block;background: #fff;margin-top: 12px;padding: 10px;border-radius: 4px;max-width: 400px;position: relative}
  .messagelist p:before{position: absolute;content: '';width: 0;height: 0;border: 8px solid transparent;border-bottom-color: #fff;top: -14px}
  .messagelist span{display: block;color: #999}
  .messagelistright{text-align: right;margin-right: 20px}
  .messagelist.messagelistright p{background: rgb(140, 216, 69);color: #000;border-bottom-color: rgb(140, 216, 69);}
  .messagelist.messagelistright p:before{right: 6px;border-bottom-color: rgb(140, 216, 69);}
  .el-tabs--border-card>.el-tabs__header{position: fixed; width: 240px; z-index: 999;}
  .el-tabs--border-card>.el-tabs__content{padding-top: 58px}
</style>
