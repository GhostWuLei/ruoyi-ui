<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="规范名称" prop="normName">
        <el-input
          v-model="queryParams.normName"
          placeholder="请输入规范名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['devsys:norm:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:norm:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:norm:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table border v-loading="loading" :data="normList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="规范名称" align="center" prop="normName" />
      <el-table-column label="规范值" align="center" prop="normValue" />
      <el-table-column label="计量单位" align="center" prop="normUnit" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="附件管理" width="180">
        <template slot-scope="scope">
          <!-- 上传按钮绑定click事件 -->
          <el-button
            style="float: left"
            size="mini"
            type="primary"
            @click="uploadBtnClick(scope.row.normId)">
            <i  class="el-icon-upload el-icon--right">上传</i>
          </el-button>
          <el-button style="float:right"
            size="small"
            type="success"
            @click="downloadBtnClick(scope.row)">
            <i  class="el-icon-upload el-icon--right">下载</i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['devsys:norm:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:norm:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备规范对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="规范名称" prop="normName">
          <el-input v-model="form.normName" placeholder="请输入规范名称" />
        </el-form-item>
        <el-form-item label="规范值" prop="normValue">
          <el-input v-model="form.normValue" placeholder="请输入规范值" />
        </el-form-item>
        <el-form-item label="计量单位" prop="normUnit">
          <el-input v-model="form.normUnit" placeholder="请输入计量单位" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 上传附件对话框 -->
    <el-dialog title="附件管理" :visible.sync="dialogVisible" width="20%">
      <!-- 将<el-upload>代码添加到<el-dialog>代码块中 -->
      <el-upload
        class="upload-demo"
        ref="upload"
        action="#"
        :http-request="handleUploadForm"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="currentAttachList"
        :headers="headersObj"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { listNorm, getNorm, delNorm, addNorm, updateNorm, exportNorm, uploadAnnx, download } from "@/api/devsys/norm";
export default {
   props: {
    currentEquipId:{
      type: Number,
      default:'',
    }
  },
  name: "Norm",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 设备规范表格数据
      normList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        normName: undefined,
        equipId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        normName: [
          { required: true, message: "规范名称不能为空", trigger: "blur" }
        ],
        equipId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
      },
      //===================文件上传============================
      dialogVisible: false,
      // 设置当前文件列表数据currentAttachList，每次用户点击上传按钮，该数据就会被赋值为当前按钮那一列normList中的attachList数据
      currentAttachList: [],
      //当前点击打开弹框的按钮在表格中是那一列
      currentIndex: 0,
      //是否包含重复的文件名称,默认不包含值为false
      isRepeat: false,
      // 上传图片给的请求头
      headersObj: {
        Authorization: document.cookie.split("=")[1],
        "Content-Type": "multipart/form-data"
      },
      clickedId: ''
    }
  },
  created() {
    //给设备id赋值，根据设备id查询设备的资料
    // this.currentEquipId = this.$route.params.equipId
    this.queryParams.equipId = this.currentEquipId
    this.getList()
  },
  watch: {
    currentEquipId(newval, oldval) {
      console.log(newval, oldval, 123);
      this.queryParams.equipId = this.currentEquipId;
      this.getList();
    }
  },
  methods: {
    /** 查询设备规范列表 */
    getList() {
      this.loading = true
      listNorm(this.queryParams).then(response => {
        this.normList = response.rows
        // 添加附件的数组
        this.normList.forEach((val, index) => {
          val.attachList = [];
        });
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        normId: undefined,
        normName: undefined,
        normValue: undefined,
        normUnit: undefined,
        fname: undefined,
        fpath: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },

    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.normId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset()
      this.open = true
      this.form.equipId = this.currentEquipId
      this.title = "添加设备规范"
    },
    handleUpdate(row) {
      this.reset();
      this.form.equipId = this.currentEquipId
      const normId = row.normId || this.ids
      getNorm(normId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改设备规范"
      })
    },
    submitForm: function() {
      console.log("submitForm方法执行了...")
      this.$refs["form"].validate(valid => {
        if(valid) {
          if(this.form.normId != undefined){
            // 修改的操作
            updateNorm(this.form).then(response => {
              if(response.code == 200){
                this.msgSuccess("修改成功")
                this.open = false
                this.getList()
              }else{
                this.msgError(response.msg)
              }
            })
          }else{
            //新增的操作
            addNorm(this.form).then(response => {
              if(response.code == 200){
                this.msgSuccess("新增成功")
                this.open = false
                this.getList()
              }else{
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    cancel() {
      this.open = false
      this.reset()
    },
    handleDelete(row) {
      // 删除单个 或者 批量删除
      const normIds = row.normId || this.ids;
      this.$confirm('是否确认删除设备规范名称为'+ normIds + '的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(function() {
        return delNorm(normIds)
      }).then(() => {
        this.getList()
        this.msgSuccess("删除成功")
      }).catch(function() { console.log('删除失败') })
    },
    handleAnnex(){
      console.log('handleAnnex函数执行了')
    },
    //#########################文件上传################################
    uploadBtnClick(id) {
      console.log(id)
      this.clickedId = id
      // 获取上传按钮对应那一列表格数据中的附件列表，赋值给currentAttachList
      // this.currentAttachList = this.normList[index].attachList;
      // 将控制弹框显示的dialogVisible设置为true，让弹框显示
      this.dialogVisible = true;
      // 设置currentIndex
      // this.currentIndex = index;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleUploadForm(param){
      let formData = new FormData();
      formData.append("normId", this.clickedId)
      formData.append("files", param.file)
      console.log(formData.get("normId"),formData.get("files"),1111222)
      uploadAnnx(formData).then(res => {
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      })
      this.$refs.upload.clearFiles()
      this.dialogVisible = false;
      this.handleRemove(param)
    },

    uploadSuccess(response, file, fileList) {
      var currentIndex = this.currentIndex;
      this.normList[currentIndex].attachList.push({
        name: file.name
      });
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      if (this.isRepeat == false) {
        return this.$confirm(
          "此操作将永久删除" + file.name + "文件, 是否继续?"
        );
      }
    },
    handleRemove(file, fileList) {
      if (this.isRepeat == false) {
        var currentIndex = this.currentIndex;
        var attachList = this.normList[currentIndex].attachList;
        var tempList = [];
        for (var i = 0; i < attachList.length; i++) {
          if (file.name != attachList[i].name) {
            tempList.push(attachList[i]);
          }
        }
        this.normList[currentIndex].attachList = tempList;
      } else {
        this.isRepeat = false;
      }
    },
    beforeUpload(file) {
      var currentIndex = this.currentIndex;
      //首先需要获取当前已经上传的文件列表
      var list = this.normList[currentIndex].attachList;
      //循环文件列表判断是否有重复的文件
      for (var i = 0; i < list.length; i++) {
        if (list[i].name == file.name) {
          this.$message.error(file.name + "文件名重复");
          //添加逻辑：得知上传了重复文件后，设置一个标志值为true，提供给beforeRemove函数使用
          this.isRepeat = true;
          //记得一定要返回false,否则控件继续会执行上传操作
          return false;
        }
      }
    },
    downloadBtnClick(row){
      console.log(row,11112233)
      download(row.normId).then(res => {
        console.log(res,111112266)
        if (res) {
          const content = res.data;
          const blob = new Blob([content]);
          // const fileName = `${rowName}.zip`;
          const fileName = row.fname;
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
          }
        }
      })
    }
  }
}
</script>
