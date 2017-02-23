<template>
  <div class="admin-sourcelist">
    <div class="admin-list-content">
      <div class="admin-list" v-for="item in sourcelist">
        <div class="admin-text">
          {{item.words}}
        </div>
        <div class="admin-img" v-if="item.type == 1">
          <div class="admin-list-img" v-for="list in item.materialUrls">
            <img :src="list" alt="">
          </div>
        </div>
        <div class="admin-img" v-if="item.type == 2">
         <a href=""></a>
        </div>
        <div class="admin-img" v-if="item.type == 3">
         {{item.materialUrls[0]}}
        </div>
        <div class="admin-btn">
          <el-button type="primary" size="small" @click='delet(item.id)'>删除</el-button>
          <el-button type="primary" size="small" @click='send(item.id)'>发送</el-button>
          <el-button type="primary" size="small" @click='update(item.id)'>修改</el-button>          
          <el-button type="primary" size="small" @click='record(item.id)'>发送记录</el-button>          
        </div>
      </div>
      <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :current-page='currentpage' :page-size="num" :total="total" style="margin: 20px 0 40px 0;text-align: center">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sourcelist',
  data() {
      return {
       sourcelist: [],
       offset: 0,
       num: 10,
       total: 0,
       currentpage: 1
      };
    },
    methods: {
     handleCurrentChange(val) {
       this.offset = (val-1)*this.num
       this.getsourcelist()
      },
      send: function (val) {
        this.$router.push('/sendsetting?wxCircleId=' + val)
      },
      record: function (val) {
        this.$router.push('/sendrecord?wxCircleId=' + val)
      },
      getsourcelist: function () {
         var self = this
        this.axios.post('/robotwxcircle/get_wx_circle_list',{offset: this.offset, num: this.num})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.total = data.data.count
              self.sourcelist = data.data.list || []
            }
            console.log(data)
					}, (response) => {
						console.log(response);
					});
      },
      delet: function (val){
         var self = this
        this.axios.post('/robotwxcircle/delete_wx_circle',{id: val})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.$message({
                message: '删除成功',
                type: 'success'
              });
              self.getsourcelist()
            }
            console.log(data)
					}, (response) => {
						console.log(response);
					});
      },
      update: function (val) {
        this.$router.push('/updatesource?id=' + val)
      }
    },
    created: function () {
      this.getsourcelist()
    }
}
</script>

<style>
  .admin-sourcelist{width: 100%}
  .admin-list-content{width: 420px;}
  .admin-list{margin-bottom: 30px}
  .admin-list .admin-text{color: #666;line-height: 20px;margin-bottom: 10px}
  .admin-list .admin-img{display: flex;display: -webkit-flex;flex-wrap: wrap;-webkit-flex-wrap: wrap}
  .admin-list .admin-img .admin-list-img{flex: 1;-webkit-flex: 1;min-width: 140px}
  .admin-list-img img{width: 98%}
  .admin-btn{margin-top: 10px;text-align: right}
</style>
