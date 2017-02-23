<template>
  <div>
      <template>
    <el-table
      :data="recordlist"
      style="width: 100%">
      <el-table-column
        prop="groupName"
        label="组"
        width="180">
      </el-table-column>
      <el-table-column label="发送时间" width="180">
        <template scope="scope">{{formate(scope.row.sendTime)}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button icon="delete" type="text" @click="delet(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </template>
  </div>
</template>

<script>
export default {
  name: 'sendrecord',
  data() {
      return {
       wxCircleId: '',
       recordlist: []
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
      getrecordlist: function () {
        var self = this
        this.axios.post('/robotwxcircle/get_wx_circle_setting_list', {wxCircleId: this.wxCircleId})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.recordlist = data.data || []
            }
            console.log(data)
					}, (response) => {
						console.log(response);
					});
      },
      delet: function (val) {
         var self = this
        this.axios.post('/robotwxcircle/delete_wx_circle_setting', {id: val})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.$message({
                message: '删除成功',
                type: 'success'
              })
              self.getrecordlist()
            }
            console.log(data)
					}, (response) => {
						console.log(response);
					});
      }
    },
    created: function () {
      this.wxCircleId = Number.parseInt(this.$route.query.wxCircleId)
      this.getrecordlist()
    }
}
</script>

<style>
</style>
