<template>
  <div>
    
    <el-form ref="form" :model="sourcedata" :rules="rules" :ref="sourcedata" label-width="80px" style="width: 500px">
      <template>
        <el-tabs v-model="activeName" style="margin-left: 36px;margin-bottom: 30px">
          <el-tab-pane label="文字" name="0">
            <div>
             <el-input type="textarea" :rows='6' v-model="sourcedata.text1"></el-input>
            </div>
          </el-tab-pane>
          <el-tab-pane label="图片" name="1">
            <div id="btnwrap">
              <label for="img" class="el-button el-button--primary el-button--small">
                <i class="el-icon-upload"></i><span>点击上传图片</span>
              </label>
              <input type="file" id="img" class="hide" />
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              <div class="sourceimg">
                <div class="sourceimglist" v-for="item in sourcedata.img">
                  <img :src="item" alt="">                  
                </div>
              </div>
             <el-input type="textarea" :rows='6' v-model="sourcedata.text2"></el-input>              
            </div>
          </el-tab-pane>
          <el-tab-pane label="视频" name="2">
            <div id="videocontainer">
              <label for="video" class="el-button el-button--primary el-button--small">
                <i class="el-icon-upload"></i><span>点击上传视频</span>
              </label>
              <input type="file" id="video" class="hide" />
             <el-input type="textarea" :rows='6' v-model="sourcedata.text3"></el-input>              
            </div>
          </el-tab-pane>
          <el-tab-pane label="链接" name="3">
             <el-input type="textarea" :rows='6' v-model="sourcedata.text4"></el-input>            
            <el-input v-model="sourcedata.link" placeholder="请输入链接"></el-input>
          </el-tab-pane>
        </el-tabs>
      </template>
      <el-form-item>
        <el-button type="primary" @click="addsource">保存</el-button>
        <!--<el-button type="success">发送</el-button>        -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'updatesource',
  data() {
      return {
        activeName: '0',
        uptoken: '',
        sourceid: '',
        sourcedata: {
          text1: '',
          text2: '',
          text3: '',
          text4: '',
          img: [],
          video: '',
          link: ''
        },
        rules: {
          text: [
            {required: true, message: '请输入文字', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
     handleClick(tab, event) {
        console.log(tab, event);
      },
      uploadvideo:function(){
        var self = this;
        var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'video', //上传选择的点选按钮，**必需**
        uptoken: this.uptoken,
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://oe3slowqt.bkt.clouddn.com/',
        //bucket 域名，下载资源时用到，**必需**
        container: 'videocontainer', //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
          mime_types: [
              {title : "Video files", extensions : "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4"} // 限定flv后缀上传格式上传
          ]
        },
        multi_selection: false,
        init: {
          'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var urlImg = 'http://oe3slowqt.bkt.clouddn.com/' + res.key;
            self.sourcedata.video = urlImg
          },
          'Error': function(up, err, errTip) {
                  //上传出错时，处理相关的事情
                  alert("上传出错，请刷新重新上传")
            }
        }
      });
    },
      uploadimg:function(){
        var self = this;
        var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'img', //上传选择的点选按钮，**必需**
        uptoken: this.uptoken,
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://oe3slowqt.bkt.clouddn.com/',
        //bucket 域名，下载资源时用到，**必需**
        container: 'btnwrap', //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
          mime_types: [
              {title : "Image files", extensions : "jpg,png"} // 限定flv后缀上传格式上传
          ]
        },
        multi_selection: false,
        init: {
          'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var urlImg = 'http://oe3slowqt.bkt.clouddn.com/' + res.key;
            self.sourcedata.img.push(urlImg)
          },
          'Error': function(up, err, errTip) {
                  //上传出错时，处理相关的事情
                  alert("上传出错，请刷新重新上传")
            }
        }
      });
    },
    getuptoken:function(){
  		var self = this;
  		this.axios.get('http://tym.taoyumin.cn/index.php?r=search/token').then((response) => {
        var data = JSON.parse(response.data)        
        if(data.state == 1000){
          self.uptoken = data.data
          self.uploadimg()
          self.uploadvideo()          
        }
  		}, (response) => {
		    // error callback
		  });
  	},
    addsource:function(){
  		var self = this;
      var data = {
        id: this.sourceid,
        words: '',
        type: 0,
        materialUrls: []
      }
      switch(this.activeName){
        case '0':
          data.type = 0
          data.words = self.sourcedata.text1
          data.materialUrls = []
          break
        case '1':
          data.type = 1
          data.words = self.sourcedata.text2          
          data.materialUrls = self.sourcedata.img
          break
        case '2':
          data.type = 2
          data.words = self.sourcedata.text3          
          data.materialUrls = self.sourcedata.video
          break
        case '3':
          data.type = 3
          data.words = self.sourcedata.text4          
          data.materialUrls = [this.sourcedata.link]
          break
      }
  		this.axios.post('/robotwxcircle/update_wx_circle', data).then((response) => {
        var data = response.data
        console.log(data)
        if(data.code == 0){
          self.$message({
              message: '保存成功',
              type: 'success'
            });
        }
  		}, (response) => {
		    // error callback
		  });
  	},
    getsource: function () {
      var self = this
      this.axios.post('/robotwxcircle/get_wx_circle', {id: this.sourceid}).then((response) => {
        var data = response.data
        console.log(data)
        if(data.code == 0){
          switch(data.data.type){
            case 3:
              self.sourcedata.text4 = data.data.words
              self.sourcedata.link = data.data.materialUrls   
              self.activeName = '3'  
              break
            case 2:
              self.sourcedata.text3 = data.data.words
              self.sourcedata.video = data.data.materialUrls   
              self.activeName = '2'
              break
            case 1:
              self.sourcedata.text2 = data.data.words
              self.sourcedata.img = data.data.materialUrls   
              self.activeName = '1' 
              break
            case 0:
              self.sourcedata.text1 = data.data.words
              self.activeName = '0' 
              break
          }
        }
  		}, (response) => {
		    // error callback
		  });
    }
  },
  created: function () {
    this.getuptoken()
    this.sourceid = Number.parseInt(this.$route.query.id)
    this.getsource()
  }
}
</script>

<style scoped>
  .hide{display: none}
  .el-textarea{margin: 10px 0}
</style>
