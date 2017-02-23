<template>
  <div>
   <el-card class="box-card" style="width: 420px">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">标签列表</span>
      </div>
      <div class="text item" v-for='item in taglist' @click="go(item.tag)">
        <span>{{item.tag}}</span>
        <i class="el-icon-arrow-right" style="float: right;color: #666"></i>        
      </div>
    </el-card>
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
  name: 'taglist',
  data() {
      return {
       taglist: [],
       offset: 0,
       num: 20,
       total: 0,
       currentPage: 1
      };
    },
    methods: {
      handleCurrentChange: function (val) {
        this.offset = (val-1)*this.num
        this.gettaglist()
      },
      gettaglist: function () {
        var self = this
        this.axios.post('/robottag/get_tag_list', {offset: this.offset, num: this.num})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.total = data.data.count
              self.taglist = data.data.list || []
            }
						console.log(data)
					}, (response) => {
						console.log(response);
					});
      },
      go: function (val) {
        this.$router.push('/taguserlist?tagname=' + val)
      }
    },
    created: function () {
      this.gettaglist()
    }
}
</script>

<style scoped>
  .text{font-size: 14px;overflow: hidden;padding: 16px 0}
</style>
