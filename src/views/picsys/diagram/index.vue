<template>
  <div class="app-container">
    <el-row :gutter="30">
      <!-- 系统图目录树 -->
      <el-col class="listContain" :span="7" :xs="24">
        <div class="head-container">
          <el-input
            v-model="nodeName"
            placeholder="请输入系统图/目录名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container" style ="height:751px;overflow:auto;">
          <el-tree
            :data="equipOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                  <i class="el-icon-folder" v-if="data.children"></i>
                  <i class="el-icon-document" v-else></i>
                  &nbsp;{{ data.label }}
              </span>              
            </span>
          </el-tree>
        </div>
      </el-col>

      <!-- 系统图操作 -->
      <el-col :span="17" :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['devsys:diagram:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              @click="editDiagramNode"
              v-hasPermi="['devsys:diagram:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="isDelete"
              v-hasPermi="['devsys:diagram:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="downloadDiagramNode"
              v-hasPermi="['devsys:equip:export']"
              >下载</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <!-- <div class="imgBox">
            <img :src="imgurles" alt="">
          </div> -->
          <div id="canvas" style="position:absolute; top:0px; left:0px; text-align:center; background-color:white">

	        <!-- <object id="ADViewer" classid="clsid:A662DA7E-CCB7-4743-B71A-D817F6D575DF" border="1" width="1000" height="800" VIEWASTEXT>//创建Design Reiew对象
	        	<param name="Src" :value="imgurles">
	        </object> -->
          </div>
        </el-row>
      </el-col>
    </el-row>
<!-- 
    <el-dialog style="opacity:0" append-to-body class="elclass" :show-close="false" :visible.sync="open" fullscreen>
     <iframe id="iframe1" src="about:blank" frameBorder="0" marginHeight="0" marginWidth="0" style="position:absolute; visibility:inherit; top:0px;left:0px;width:100%; height:100%;z-index:-1; filter:alpha(opacity=0);"></iframe>
    </el-dialog> -->

    <!-- 添加或修目录/系统图对话框 -->
    <el-dialog append-to-body class="dialog2" :modal="false" :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级目录" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="equipOptions"
                :show-count="true"
                placeholder="选择上级目录"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="目录/系统图名称" prop="nodeName">
              <el-input v-model="form.nodeName" placeholder="请输入目录/系统图名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <!-- <el-select v-model="form.nodeType" placeholder="请选择目录类型">
                <el-option label="请选择字典生成" value />
              </el-select> -->
              <el-radio-group v-model="form.nodeType">
                <el-radio label="0">系统图</el-radio>
                <el-radio label="1">目录</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col>
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col> -->
          <el-col v-show="form.nodeType == 0">
            <el-form-item label="图片上传" prop="picUpload">
              <!-- action图片要上传到的后台api地址 要一个完整的api地址 -->
              <el-upload
                ref="upload"
                name="upload"
                class="upload-demo"
                drag
                :headers="headersObj"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                action="#"
                :multiple="false"
                :limit="1"
                :file-list="fileList"
                :before-upload="beforeUpload"
                :http-request="requestUpload"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>选取文件</em>
                </div>
                <!-- <el-button v-show="false" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                <div class="el-upload__tip" slot="tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>

              <!-- 原始的 -->
              <!-- <input id="avatar" type="file" @change="yuanFile" /> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <!-- 加了之后层级最高,不会被图纸覆盖 -->
      <iframe id="iframe1" src="about:blank" frameBorder="0" marginHeight="0" marginWidth="0" style="position:absolute; visibility:inherit; top:0px;left:0px;width:100%; height:100%;z-index:-1; filter:alpha(opacity=0);"></iframe>
    </el-dialog>

    <!-- 删除的弹框 -->
    <el-dialog :modal="false" append-to-body center class="deleteDia" :visible.sync="showDelete" width="400px">
      <div class="que1">是否确认删除?</div>
      <div class="que2">
        <el-button type="primary" @click='confirmDelete'>确认</el-button>
        <el-button @click="cancelDelete">取消</el-button>
      </div>
       <!-- 加了之后层级最高,不会被图纸覆盖 -->
      <iframe id="iframe1" src="about:blank" frameBorder="0" marginHeight="0" marginWidth="0" style="position:absolute; visibility:inherit; top:0px;left:0px;width:100%; height:100%;z-index:-1; filter:alpha(opacity=0);"></iframe>
    </el-dialog>
  </div>
</template>

   <script type="text/javascript" language="javascript">   
  function ListSections() { 
	  var ECompViewer = ADViewer.ECompositeViewer;   
	  var Sections = ECompViewer.Sections;    
	  var secList = document.getElementById("SectionList");  
	  for (iSection = 1;(iSection <= Sections.Count); iSection++) 
	  {  var Section = Sections(iSection); 
	  	   secList.innerHTML += Section.Title + "<BR>";   
	  } 
	} 
	</script>
	<script type="text/javascript" for="ADViewer" event="OnEndLoadItem(bstrItemType,vData, vResult)">  
	if (bstrItemType == 'DOCUMENT') 
	{ 
		ListSections();
  } 
  </script>

<script>


import {
  treeselect,
  addDiagrams,
  updateDiagrams,
  delDiagrams,
  getPicDiagrams,
  uploadPicDiagrams,
  uploadPic,
  getinfo,
  getNodeIdByDiagramName,
  getDwfPicture
} from "@/api/picsys/diagram";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Diagram",
  components: { Treeselect },
  data() {
    return {
      // 删除的弹框
      showDelete: false,
      // 图片路径
      imgurles: '',
      // 类型
      type: "",
      // 文件
      file: "",
      // 图片路径
      // imgUrl: "",
      // 上传的文件列表
      fileList: [],
      // 上传图片给的请求头
      headersObj: {
        Authorization: document.cookie.split("=")[1],
        "Content-Type": "multipart/form-data"
      },
      //系统图树选项
      equipOptions: [],
      // 系统图名称
      nodeName: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 遮罩层
      //loading: true,
      // 总条数
      total: 0,
      // 系统图表格数据
      equipList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        nodeName: [
          { required: true, message: "目录/系统图名称不能为空", trigger: "blur" }
        ],
        nodeType: [
          {
            required: true,
            message: "类型（0系统图 1目录）不能为空",
            trigger: "blur"
          }
        ],
        parentId: [
          { required: true, message: "上级目录不能为空", trigger: "blur" }
        ]
      },
      // 当前点击左侧树的节点id
      currentParentId: undefined,
      currentParentName: undefined
    };
  },
  watch: {
    // 根据名称筛选部门树
    nodeName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    // this.initialization();
    this.getTreeselect();
    // this.getToken();
    this.imgurles = window.sessionStorage.getItem('imgurles') || ''
  },
  // 生成  keep-alive
  activated(){
    console.log(11)
    this.initialization()
    if(this.currentParentId) {
      this.gettype(this.currentParentId)
    }
    //  this.getTreeselect()
  },
  // 销毁
  deactivated(){
    console.log(22)
  },
  methods: {
    // 覆盖默认的上传行为
    requestUpload(param) {
      // console.log(param, 3377);
    },
    // 文件上传到服务器触发的一个事件
    // submitUpload() {
    //     this.$refs.upload.submit();
    //   },
    // 上传预处理
    beforeUpload(file) {
      // if (file.type.indexOf("image/") == -1) {
        // this.msaError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件");
      // } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          // this.imgUrl = reader.result;
          let formData = new FormData();
          formData.append("file", file);

          this.file = formData;
        };
      // }
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset(); //重置表单的
      this.getTreeselect();
      if (this.currentParentId != null) {
        this.form.parentId = this.currentParentId;
      }
      this.open = true;
      this.title = "添加系统图";
      console.log(!this.file,2121);
    },
    //表上方的修改按钮
    editDiagramNode() {
      this.reset(); // 重置表单的
      const diagramId = this.currentParentId;
      if (diagramId === undefined) {
        this.msgInfo("请选择左侧树数据")
        return
      }
      getinfo(diagramId).then(response => {
        console.log(response,this.form,9898);
        
        this.form = response.data
        this.title = "修改目录/系统图"
        this.open = true
        console.log(this.form,9977);
      });
    },
    // 下载事件
    downloadDiagramNode () {
      console.log(typeof(this.currentParentId),this.imgurles,334); // 当前点击左侧树的节点id
      if(this.imgurles.length < 20 || !this.currentParentId) return this.msgError('请选择系统图下载')
      getDwfPicture(this.currentParentId).then(res => {
        console.log(res, 666)
        if (res) {
          const content = res.data;
          const blob = new Blob([content]);
          // const fileName = `${rowName}.zip`;
          const fileName = `12345.dwf`;
          if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
          } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
              // window.navigator.msSaveBlob(blob, unescape(res.headers.filename.replace(/\\u/g, '%u')))
            // }
          }
      }
      }).catch(err=>console.log(err))
    },
    isDelete () {
      this.showDelete = true
      const ids = this.currentParentId
      if(!ids) {
        this.$message("请选择删除项")
        this.showDelete = false
        return
      }
    },
    cancelDelete () {
      this.showDelete = false
      this.msgError("已取消删除")
    },
    confirmDelete () {
      this.deleteDiagramNode()
    },
    // 表上的删除按钮  一般根据id删除
    deleteDiagramNode() {
      const ids = this.currentParentId
      delDiagrams(ids).then(() => {
        this.getTreeselect()
        this.msgSuccess("删除成功")
        this.showDelete = false
      })
      .catch(() => {
        this.msgError("删除失败")
        this.showDelete = false
      })
    },
    // 弹出框的确认提交
    submitForm() {
      this.$refs.form.validate(async valid => {
        if(!valid) return
        if(this.form.nodeId){
          // 修改
           if (this.form.nodeType == 0) {
          this.type = this.form.nodeType
          console.log(!this.file, !this.form.fname);
          if(!this.file &&!this.form.fname) return this.msgError('请上传文件')
          if(this.file) {
            uploadPic(this.file)
            .then(res => {
              console.log(res,333);
              
              this.form.fname = res.fname
              this.form.fpath = res.fpath

              this.editFormes()
            })
            .catch(err => err)
          } else {
            this.editFormes()
          }
        } else {
          this.editFormes()
        }
      } else {
          // 要通过parentId获取他的nodeType 为1才可以新增
          getinfo(this.form.parentId).then(res=>{
            const {nodeType} = res.data
            if(nodeType == 0) return this.msgError('请选择目录添加')
          // 新增
          if (this.form.nodeType == 0) {
            this.type = this.form.nodeType
            console.log(!this.file, !this.form.fname);
            if(!this.file) return this.msgError('请上传文件')
            uploadPic(this.file)
            .then(res => {
              console.log(res,333);
              this.form.fname = res.fname
              this.form.fpath = res.fpath

              this.addFormes()
            })
            .catch(err => err)
          } else {
            this.addFormes()
          }
        })
        }
      })
    },
    // 表单提交接口 新增
    addFormes() {
      addDiagrams(this.form).then(response => {

        if (response.code === 200) {
          console.log(response)
          this.open = false;
          // this.options.img = process.env.VUE_APP_BASE_API + response.imgUrl;
          this.msgSuccess("添加成功")
          this.getTreeselect()
        } else {
          this.msgError(response.msg)
        }
        this.reset()
      })
    },
    // 表单修改的接口
    editFormes() {
      updateDiagrams(this.form).then(response => {
        if(response.code === 200){
          this.open = false;
           this.msgSuccess("修改成功")
          this.getTreeselect()
        } else {
           this.msgError(response.msg)
        }
         this.reset()
         console.log(this.form,8547);
      })
    },
    // 弹出框的取消提交
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.equipOptions = response.data;
        console.log(this.equipOptions,54545)
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击树节点时触发
    handleNodeClick(data) {
      this.currentParentId = data.id; //树id
      this.currentParentName = data.label; //树名

      this.gettype(data.id)
    },
    // 获取info   图片路径
    gettype(id){
      // console.log(id,78910);
      getinfo(id).then(res=>{
        // console.log(res,666444);
        this.imgurles = `/dev-api${res.data.fpath}`
        window.sessionStorage.setItem('imgurles', this.imgurles)
        console.log(this.imgurles,66655);
        // 获取图片
        // this.getPicUrl(data.id);
        this.setWarnImgHtml(this.imgurles)
      })
    },
    setWarnImgHtml(imgUrl){
      var canvas = document.querySelector('#canvas')
      console.log(imgUrl.length, 4848);
      if (imgUrl.length < 20) {
        return canvas.innerHTML = ''
      }
      var zuhe = `
        <object id="ADViewer" classid="clsid:A662DA7E-CCB7-4743-B71A-D817F6D575DF" border="1" width="1100" height="750" VIEWASTEXT>//创建Design Reiew对象
	        	<param name="Src" value="${imgUrl}">
          </object>`
        canvas.innerHTML = zuhe
    },
    // 获取图片
    // getPicUrl(Id) {
    //   console.log(Id,this.type)
    //   if(this.type == 0){
    //     uploadPicDiagrams(Id).then(res=>{
    //       console.log(res,77);
    //     })
    //   }
    // },
    // on-success	文件上传成功时的钩子	function(response, file, fileList)
    handleSuccess(response, file, fileList) {
      // console.log(response)
      // 1.拼接得到一个图片信息对象
      // const picInfo = { pic: response.data.tmp_path }
      // // 2.将图片信息对象, push到pics数组中
      // this.form.pics.push(picInfo)
      // console.log(this.form)
    },
    // on-remove	文件列表移除文件时的钩子	function(file, fileList)
    handleRemove(file) {
      this.file = ''
      // 1.获取要删除图片的临时路径
      // const filePath = file.response.data.tmp_path;
      // 2.从pics数组中,找到这个图片对应的索引值
      // const i = this.form.pics.findIndex(x => x.pic === filePath);
      // 3.调用数组的splice方法,把图片信息对象从pics 数组中移除
      // this.form.pics.splice(i, 1);
      // console.log(this.form,this.file, 123);
    },
    // 初始化跳转过来的参数获取
    initialization () {
      console.log(3333)
      const data = this.$route.query.val
      console.log(data,77777777788888);
      if(!data) return
      try {
        // 由名字拿id
        getNodeIdByDiagramName(data).then(res=>{
          const id = res.data
          this.currentParentId = id; //树id
          this.currentParentName = data; //树名
          if(id) {
            this.gettype(id)
          }
        })
      } catch (error) {
        console.log(error);
      }
    },
    // 表单重置
    reset() {
      this.form = {
        parentId: 1,
        nodeName: "",
        nodeType: "0",
        fname: "",
        fpath: ""
      };
      this.resetForm("form");
      this.fileList=[]
      this.file=''
    }
  }
};
</script>

<style lang="scss" scoped>

// /deep/.el-dialog {
//     box-shadow: 0 1px 3px rgba(0,0,0,0.5);
//     background-color: rgb(240, 249, 255);
// }
.deleteDia{
  margin-top: 200px;
}
.que1{
  text-align: center;
  font-size: 23px;
  margin-bottom: 10px;
  color: #3587be;
}
.que2{
  display: flex;
  justify-content: space-around;
}
.imgBox{
  width: 100%;
  // height: 50%;
  img{
    width: 100%;
    // height: 100%;
  }
}

.el-icon-folder {
  color: black;
  font-weight: 600;
}
.el-icon-document {
  color: black;  
}
// .mytree /deep/ {
//     // overflow: auto;
//     // overflow-y: hidden;
//   .el-tree > .el-tree-node:after {
//     border-top: none;
//   }
//   .el-tree-node {
//     position: relative;
//     padding-left: 16px;

//   }
//   /* 节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉 */
//   .el-tree-node__expand-icon.is-leaf {
//     display: none;
//   }
//   .el-tree-node__children {
//     padding-left: 16px;
//   }

//   .el-tree-node :last-child:before {
//     height: 38px;
//   }

//   .el-tree > .el-tree-node:before {
//     border-left: none;
//   }

//   .el-tree > .el-tree-node:after {
//     border-top: none;
//   }

//   .el-tree-node:before {
//     content: "";
//     left: -4px;
//     position: absolute;
//     right: auto;
//     border-width: 1px;
//   }

//   .el-tree-node:after {
//     content: "";
//     left: -4px;
//     position: absolute;
//     right: auto;
//     border-width: 1px;
//   }

//   .el-tree-node:before {
//     border-left: 1px dashed #4386c6;
//     bottom: 0px;
//     height: 100%;
//     top: -26px;
//     width: 1px;
//   }

//   .el-tree-node:after {
//     border-top: 1px dashed #4386c6;
//     height: 20px;
//     top: 12px;
//     width: 24px;
//   }

//   .el-tree-node__label {
//     padding-left: 8px;
//     // font-size: 18px;
//   }
// }
</style>
