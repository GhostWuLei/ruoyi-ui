<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" size="mini">
      <!-- <el-form-item label="设备ID" prop="equipId">
        <el-input
          v-model="queryParams.equipId"
          placeholder="请输入设备ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="设备名称" prop="equipName">
        <el-input
          v-model="queryParams.equipName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="安装日期" prop="installTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.installTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择安装日期">
        </el-date-picker>
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
          v-hasPermi="['devsys:information:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:information:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:information:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['devsys:information:export']"
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

    <el-table v-loading="loading" :data="informationList" @selection-change="handleSelectionChange" style="min-height: 300px" ref="tableList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="信息ID" align="center" prop="informationId" />
      <el-table-column label="设备名称" align="center" prop="equipName" width="150" />
      <el-table-column width="150" label="设备型号" align="center" prop="specification" />
      <el-table-column prop="equipParam"
                       align="left"
                       width="280"
                       label="设备参数">
        <template slot-scope="scope">
          <span v-html="scope.row.equipParam"></span>
        </template>
      </el-table-column>
      <el-table-column label="技术要求" align="center" prop="techParam" />
      <el-table-column label="检修周期" align="center" prop="cycle" />
      <el-table-column label="安装日期" align="center" prop="installTime" width="100">
        <template slot-scope="scope">
          <span>{{ (scope.row.installTime!=null?scope.row.installTime.substr(0, 10):scope.row.installTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="安装地点" align="center" prop="installPlace" width="180">
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column prop="attach" label="附件管理" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="uploadBtnClick(scope.row.informationId)">
            <i  class="el-icon-upload el-icon--right">上传</i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width='150' class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['devsys:information:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:information:remove']"
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
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
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
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 添加或修改设备信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
<!--        <el-form-item label="设备ID" prop="equipId">-->
<!--          <el-input v-model="form.equipId" placeholder="请输入设备ID" />-->
<!--        </el-form-item>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="equipName">
              <el-input v-model="form.equipName" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="安装地点" prop="installPlace">
              <el-input v-model="form.installPlace" placeholder="请输入安装地点" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备型号" prop="specification">
              <el-input v-model="form.specification" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备参数" prop="equipParam">
              <el-input v-model="form.equipParam" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="技术要求" prop="techParam">
              <el-input v-model="form.techParam" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="检修周期" prop="cycle">
              <el-input v-model="form.cycle" placeholder="请输入检修周期" />
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="安装日期" prop="installTime">
              <el-date-picker clearable size="small" style="width: 200px"
                v-model="form.installTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择安装日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :rows="5"  />
            </el-form-item>
          </el-col>
        </el-row>
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
import { uploadAnnx, removeUpdated, download, showUploadFile, listInformation, getInformation, delInformation, addInformation, updateInformation, exportInformation } from "@/api/devsys/information";

export default {
  name: "Information",
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
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API +`/devsys/information/importData`
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
      // 设备信息表格数据
      informationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipId: undefined,
        equipName: undefined,
        installTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // equipId: [
        //   { required: true, message: "设备ID不能为空", trigger: "blur" }
        // ],
        equipName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备信息列表 */
    getList() {
      this.ocj.equipId = this.currentEquipId
      this.queryParams.equipId = this.currentEquipId
      this.loading = true;
      listInformation(this.queryParams).then(response => {
        this.informationList = response.rows;
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
        informationId: undefined,
        equipId: this.ocj.equipId,
        equipName: undefined,
        specification: undefined,
        equipParam: undefined,
        techParam: undefined,
        cycle: undefined,
        installTime: undefined,
        installPlace: undefined,
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
      this.ids = selection.map(item => item.informationId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const informationId = row.informationId || this.ids
      getInformation(informationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.informationId != undefined) {
            updateInformation(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addInformation(this.form).then(response => {
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
      const informationIds = row.informationId || this.ids;
      this.$confirm('是否确认删除设备信息编号为"' + informationIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInformation(informationIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有设备信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInformation(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    // ########################################文件上传
    async uploadBtnClick(id) {
      // console.log(id, 111)
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
    },
    // 自己定义上传方法  把默认的上传覆盖了  而且还改了上传参数  必须接受 informationId  files(不是上传的默认file~)
    handleUploadForm(param){
      console.log(param, 221);
      let formData = new FormData();
      formData.append("informationId", this.clickedId)
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
      download(row.informationId).then(res => {
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
      console.log(data, 36);
      data.informationId = data.fileId
      data.fname = data.name
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
      this.upload.open = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-table__body-wrapper.is-scrolling-left {
  min-height: 300px;
}
/deep/ .el-input--small .el-input__inner {
    height: 28px;
    line-height: 28px;
}
/deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 15px;
}
</style>
