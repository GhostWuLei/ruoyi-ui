<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="备件名称" prop="spareName">
        <el-input
          v-model="queryParams.spareName"
          placeholder="请输入备件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="厂家" prop="productor">
        <el-input
          v-model="queryParams.productor"
          placeholder="请输入厂家"
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
          v-hasPermi="['devsys:spare:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:spare:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:spare:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['devsys:spare:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-download"
          size="mini"
          @click="importExport"
          v-hasPermi="['devsys:spare:export']"
        >导入</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="spareList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="spareId" />
      <el-table-column label="备件名称" align="center" prop="spareName" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="技术参数" align="center" prop="techParam" />
      <el-table-column label="数量" align="center" prop="num" />
      <el-table-column label="图号" align="center" prop="pictureNum" />
      <el-table-column label="厂家" align="center" prop="productor" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column prop="attach" label="附件管理" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="uploadBtnClick(scope.row.spareId)">
            <i  class="el-icon-upload el-icon--right">上传</i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column width='150' label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['devsys:spare:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:spare:remove']"
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

    <!-- 上传附件对话框 -->
    <el-dialog append-to-body title="附件管理" :visible.sync="dialogVisible" width="50%">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="upUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="currentAttachList"
        :headers="headersObj"
        :http-request="handleUploadForm"
        :show-file-list='false'
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      </el-upload>

      <el-table
        :data="currentAttachList"
        style='height: 450px; overflow: auto;'
      >
        <el-table-column
          label="名称"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          label="预览"
          prop="date"
        >
          <template slot-scope="scoped">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-search"
              @click="newWatch(scoped.row)"
            >预览</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="date"
        >
          <template slot-scope="scoped">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="newDelete(scoped.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-bottom"
              @click="newUpdate(scoped.row)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

       <!-- 导入对话框  :auto-upload="false"   :http-request="handleUploadForm2"  -->
    <el-dialog append-to-body :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :data='ocj'
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

      <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 添加或修改备品备件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
<!--        <el-form-item label="设备ID" prop="equipId">-->
<!--          <el-input v-model="form.equipId" placeholder="请输入设备ID" />-->
<!--        </el-form-item>-->
        <el-form-item label="备件名称" prop="spareName">
          <el-input v-model="form.spareName" placeholder="请输入备件名称" />
        </el-form-item>
        <el-form-item label="规格型号" prop="specification">
          <el-input v-model="form.specification" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="技术参数" prop="techParam">
          <el-input v-model="form.techParam" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <el-input v-model="form.num" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="图号" prop="pictureNum">
          <el-input v-model="form.pictureNum" placeholder="请输入图号" />
        </el-form-item>
        <el-form-item label="厂家" prop="productor">
          <el-input v-model="form.productor" placeholder="请输入厂家" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { uploadAnnx, removeUpdated, download, showUploadFile, listSpare, getSpare, delSpare, addSpare, updateSpare, exportSpare } from "@/api/devsys/spare";

export default {
  name: "SparePage",
  props: {
    currentEquipId: {
      type: Number,
      require: true
    }
  },
  watch: {
    currentEquipId(newVal, oldVal) {
     this.ocj.equipId = +newVal
     this.getList()
    }
  },
  data() {
    return {
      // 导入参数
      upload: {
        loading: null,
        fullscreenLoading: false,
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API +`/devsys/spare/importData`
      },
      ocj: {},
      currentIndex: 0,
      //是否包含重复的文件名称,默认不包含值为false
      isRepeat: false,
      // 上传图片给的请求头
      headersObj: {
        Authorization: document.cookie.split("=")[1],
      //  "Content-Type": "multipart/form-data"
      },
      dialogVisible: false,
      // 设置当前文件列表数据currentAttachList，每次用户点击上传按钮，该数据就会被赋值为当前按钮那一列spareList中的attachList数据
      currentAttachList: [],
      clickedId: '',
      picItem: '',
      upUrl: '#',
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
      // 备品备件表格数据
      spareList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipId: undefined,
        spareName: undefined,
        productor: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // equipId: [
        //   { required: true, message: "设备ID不能为空", trigger: "blur" }
        // ],
        spareName: [
          { required: true, message: "备件名称不能为空", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询备品备件列表 */
    getList() {
      this.ocj.equipId = this.currentEquipId
      this.queryParams.equipId = this.currentEquipId
      this.loading = true;
      listSpare(this.queryParams).then(response => {
        this.spareList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        spareId: undefined,
        equipId: this.ocj.equipId,
        spareName: undefined,
        specification: undefined,
        techParam: undefined,
        num: undefined,
        pictureNum: undefined,
        productor: undefined,
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.spareId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加备品备件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const spareId = row.spareId || this.ids
      getSpare(spareId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改备品备件";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.spareId != undefined) {
            updateSpare(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSpare(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const spareIds = row.spareId || this.ids;
      this.$confirm('是否确认删除备品备件编号为"' + spareIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSpare(spareIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有备品备件数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSpare(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
      //#########################文件上传################################
    async uploadBtnClick(id) {
      console.log(id, 111)
      this.clickedId = id
      await this.updataFile(id)

    // window.location.host
      this.upUrl = process.env.VUE_APP_BASE_API +`/devsys/spare/uploadFile`

      this.dialogVisible = true;
    },
    // 根据id 跟新数组 数据
    async updataFile(id) {
      this.currentAttachList = []
      const { data } = await showUploadFile(id)
      console.log(data, 112);
      data.forEach(item => {
        const obj = {}
        obj.name = item.fname
        obj.url = item.fpath
        obj.fileId = item.fileId
        this.currentAttachList.push(obj)
      })

      console.log(this.currentAttachList, 222);
    },
    // 自己定义上传方法  把默认的上传覆盖了  而且还改了上传参数  必须接受 spareId  files(不是上传的默认file~)
    handleUploadForm(param){
      console.log(param, 221);
      let formData = new FormData();
      formData.append("spareId", this.clickedId)
      formData.append("files", param.file)
      uploadAnnx(formData).then(res => {
          this.$message({
            type: 'success',
            message: '上传成功!'
          });
        this.getList()
        this.updataFile(this.clickedId)
      }).catch( err => {
        this.$message({
          type: 'error',
          message: '上传类型错误!'
        });

        this.getList()
        this.updataFile(this.clickedId)
      })
    },

    uploadSuccess(response, file, fileList) {
      var currentIndex = this.currentIndex;
      this.spareList[currentIndex].attachList.push({
        name: file.name
      });
    },
    handlePreview(file) {
      console.log(file, 1212);
    },

    beforeRemove(file, fileList) {
      console.log(file, fileList, 789);
      if (this.isRepeat == false) {
        return this.$confirm(
          "此操作将永久删除" + file.name + "文件, 是否继续?"
        );
      }
    },
    handleRemove(file, fileList) {
      console.log(666, file, fileList, this.isRepeat);
      // if (this.isRepeat == false) {
      //   var currentIndex = this.currentIndex;
      //   var attachList = this.spareList[currentIndex].attachList;
      //   var tempList = [];
      //   for (var i = 0; i < attachList.length; i++) {
      //     if (file.name != attachList[i].name) {
      //       tempList.push(attachList[i]);
      //     }
      //   }
      //   this.spareList[currentIndex].attachList = tempList;
      // } else {
      //   this.isRepeat = false;
      // }
      removeUpdated(file.fileId).then(res => {
        console.log(res, 44);
        if(res.code === 200) {
          this.$message({
            type: 'success',
            message: res.msg
          });
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          });
        }
        this.updataFile(this.clickedId)
      })
    },
    beforeUpload(file) {
      var currentIndex = this.currentIndex;
      //首先需要获取当前已经上传的文件列表
      var list = this.spareList[currentIndex].attachList;
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
      download(row.spareId).then(res => {
        console.log(res,111112266)
        if (res.data.size>0) {
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
    },

    newWatch(data) {
      console.log(data);
      window.open(process.env.VUE_APP_BASE_API + data.url)
    },
    newDelete(data) {
       this.$confirm('是否确认删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleRemove(data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    async newUpdate(data) {
      data.spareId = data.fileId
      data.fname = data.name
      console.log(data, 36);
      const res = await this.downloadBtnClick(data)
      console.log(res,112);
    },
    // 导入功能
    importExport() {
      this.upload.title = "导入";
      this.upload.open = true;
    },
        // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      console.log(event, file, fileList, 456)

    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.loading.close();
      this.upload.open = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg == null ? '导入失败' : response.msg , "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.loading = this.$loading({
        lock: true,
        text: '拼命上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$refs.upload.submit();
    }
  }
};
</script>
