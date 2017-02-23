<template>
  <div>
    <el-form ref="user" :model="user" label-width="80px" style="width: 420px">
      <el-form-item label="微信名">
        <span>啦啦啦</span>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="user.tag"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="user.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">设置</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  name: 'usermanage',
  data() {
      return {
        user: {
          tag: '',
          remark: ''
        }
      };
    },
    methods: {
     handleClick(tab, event) {
        console.log(tab, event);
      }
    }
}
</script>

<style>
  
</style>
