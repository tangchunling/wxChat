<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="组" prop="robot">
        <el-checkbox-group v-model="ruleForm.group">
          <el-checkbox :label="item.id" name="type" v-for="item in grouplist">{{item.groupName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="发送时间" prop="date">
        <el-date-picker
          v-model="ruleForm.date"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendsetting">发送</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  name: 'sendsetting',
  data() {
      return {
       ruleForm: {
          group: [],
          date: ''
        },
        wxCircleId: '',
        grouplist: [],
        rules: {
          date: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          group: [
            { type: 'array', required: true, message: '请至少选择一个组', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
     handleClick(tab, event) {
        console.log(tab, event);
      },
      getgroup: function () {
        var self = this
        this.axios.post('/robotgroup/get_list')
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.grouplist = data.data || []
            }
            console.log(data)
					}, (response) => {
						console.log(response);
					});
      },
      sendsetting: function () {
        var self = this
        var sendTime = Number.parseInt(new Date(this.ruleForm.date).getTime()/1000)
        this.axios.post('/robotwxcircle/create_wx_circle_setting',
         {wxCircleId: this.wxCircleId, robotGroupIdList: this.ruleForm.group, sendTime: sendTime})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.$message({
                message: '设置成功',
                type: 'success'
              });
            }
            console.log(data)
					}, (response) => {
						console.log(response);
					});
      }
    },
    created: function () {
      this.getgroup()
      this.wxCircleId = Number.parseInt(this.$route.query.wxCircleId)
    }
}
</script>

<style>
  
</style>
