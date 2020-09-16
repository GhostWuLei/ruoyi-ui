<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 设备目录树 -->
      <el-col :span="8" :xs="24" style="width:200px;">
        <div class="head-container">
          <el-input
            v-model="nodeName"
            placeholder="请输入设备名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <el-scrollbar style="height:100%;">
        <div class="head-container mytree">
          <el-tree
            :indent="0"
            :data="equipOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
        </el-scrollbar>
      </el-col>

      <!-- 设备操作 -->
      <el-col :span="16" :xs="24">
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
              @click="deleteDiagramNode"
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
          <div id="canvas" style="position:absolute; top:0px; left:0px; width:100%; height:580px; text-align:center; background-color:white">

	        <!-- <object id="ADViewer" classid="clsid:A662DA7E-CCB7-4743-B71A-D817F6D575DF" border="1" width="1000" height="800" VIEWASTEXT>//创建Design Reiew对象
	        	<param name="Src" :value="imgurles">
	        </object> -->
          </div>
        </el-row>
      </el-col>
    </el-row>

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级设备/目录" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="equipOptions"
                :show-count="true"
                placeholder="选择上级设备/目录"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备名称" prop="nodeName">
              <el-input v-model="form.nodeName" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目录类型">
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
  </div>
</template>

<script type="text/javascript" language="javascript">   
  function ListSections() { 
    var ECompViewer = ADViewer.ECompositeViewer;   
    var Sections = ECompViewer.Sections;    
    var secList = document.getElementById("SectionList");  
    for (iSection = 1;(iSection <= Sections.Count); iSection++) 
    { 
      var Section = Sections(iSection); 
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

<script type="text/javascript" FOR="ADViewer" EVENT="OnSelectObject(objPageObjectNode,pHandled)"> 
  //When a object node is selected, the object is highlighted 
  //and the navigator's properties window is updated with the 
  //object properties.  
  //Setting pHandled to true will turn off these updates 
  pHandled.state = true;  
  //First parameter : piAdPageObjectNode 
  console.log("Object Node selected is " + objPageObjectNode.Name)
  alert("Object Node selected is " + objPageObjectNode.Name);
</script>

<script type="text/javascript" FOR="ADViewer" EVENT="OnSelectObjectEx(pHandled)"> 
  //When an object is selected, the object is highlighted
  //and the navigator's properties window is updated with the
  //object properties.
  //Setting pHandled to true will turn off these updates
  pHandled.state = true;	
  // Log.value = "Selected object shouldn't be highlighted (in yellow)";
  console.log("Selected object shouldn't be highlighted (in yellow)");
</script>

<script type="text/javascript" FOR="ADViewer" EVENT="OnRButtonDown(nX,nY,pHandled)">
  //Output the point where The Right mouse button was clicked
  window.status = 'Right button pick point: ' + nX + ',' + nY; 
  console.log(nX,nY)
  //Stop the context menu from opening
  pHandled.State = true;
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
  getPicture
} from "@/api/picsys/diagram";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Diagram",
  components: { Treeselect },
  data() {
    return {
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
      // 设备树选项
      equipOptions: [],
      // 设备名称
      nodeName: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 设备表格数据
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
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        nodeType: [
          {
            required: true,
            message: "目录类型（0设备 1目录）不能为空",
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
    this.initialization();
    this.getTreeselect();
    // this.getToken();
    this.imgurles = window.sessionStorage.getItem('imgurles') || ''
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
      this.title = "添加设备";
      console.log(!this.file,2121);
    },
    //表上方的修改按钮
    editDiagramNode() {
      this.reset(); // 重置表单的
      const diagramId = this.currentParentId;
      if (diagramId === undefined) {
        this.msgInfo("请选择左侧设备数据")
        return
      }
      getinfo(diagramId).then(response => {
        console.log(response,this.form,9898);
        
        this.form = response.data
        this.title = "修改设备"
        this.open = true
        console.log(this.form,9977);
      });
    },
    // 下载事件
    downloadDiagramNode () {
      console.log(this.currentParentId); // 当前点击左侧树的节点id
      // let data = {'nodeId': this.currentParentId};
      // data = JSON.stringify(data);
      // console.log(data,43435)
      getPicture(this.currentParentId).then(res => {
        console.log("download===",res);
        if (res) {
          console.log("download===",res);
          const content = res.data;
          const blob = new Blob([content]);
          // const fileName = `${rowName}.zip`;
          const fileName = `12345.dwf`;
          if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
          } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
          }
      }
      }).catch(err => {
        console.log(err)
      })

    },
    downloadDiagramNode1(){
      
    },
    // 表上的删除按钮  一般根据id删除
    deleteDiagramNode1() {
      console.log(this.currentParentId)
      const ids = this.currentParentId
      if(!ids) return this.$message("请选择删除项")
      this.$confirm(
         '是否确认删除?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function(){
        return delDiagrams(ids)
      })
      .then(() => {
        this.getTreeselect()
        this.msgSuccess("删除成功")
      })
      .catch(() => {
        this.msgError("已取消删除")
      })
    },
    deleteDiagramNode() {
      this.$alert('<iframe id="iframe1" src="about:blank" frameBorder="0" marginHeight="0" marginWidth="0" style="position:absolute; visibility:inherit; top:0px;left:0px;width:100%; height:100%;z-index:-1; filter:alpha(opacity=0);"></iframe><strong>这是 <i>HTML</i> 片段</strong>', 'HTML 片段', {
          dangerouslyUseHTMLString: true
        });
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
      getinfo(id).then(res=>{
        // console.log(res,666444);
        this.imgurles = `/dev-api${res.data.fpath}`
        window.sessionStorage.setItem('imgurles', this.imgurles)
        // console.log(this.imgurles,66655);
        // 获取图片
        // this.getPicUrl(data.id);
        this.setWarnImgHtml(this.imgurles)
      })
    },
    setWarnImgHtml(imgUrl){
      var canvas = document.querySelector('#canvas')
      var zuhe = `
        <object id="ADViewer" classid="clsid:A662DA7E-CCB7-4743-B71A-D817F6D575DF" border="1" width="1200" height="750" VIEWASTEXT>//创建Design Reiew对象
	        	<param name="Src" value="${imgUrl}">
          </object>`
        console.log(zuhe,787878);
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
      const data = this.$route.query.val
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
.imgBox{
  width: 100%;
  // height: 50%;
  img{
    width: 100%;
    // height: 100%;
  }
}
.mytree /deep/ {
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node {
    position: relative;
    padding-left: 16px;
  }
  /* 节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉 */
  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }
  .el-tree-node__children {
    padding-left: 16px;
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 24px;
  }

  .el-tree-node__label {
    padding-left: 8px;
    // font-size: 18px;
  }
}
</style>
