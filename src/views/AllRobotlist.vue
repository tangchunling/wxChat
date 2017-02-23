<template>
  <div>
   <el-card class="box-card" style="width: 420px">
      <div slot="header" class="clearfix">
        所有机器人      
      </div>
      <div class="text item" v-for="item in robotlist">
          {{item.robotWx}}
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'allrobotlist',
  data() {
      return {
       robotlist: []
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
      }
    },
    created: function () {
      this.getrobot()
    }
}
</script>

<style scoped>
  .text{font-size: 14px;overflow: hidden;padding: 10px 0}
  .input{width: 300px}
</style>
