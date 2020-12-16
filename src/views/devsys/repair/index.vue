<template>
  <div>
    <el-form class="form1" :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="检修内容" prop="repairContent">
        <el-input
          v-model="queryParams.repairContent"
          placeholder="请输入检修内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="leader">
        <el-input
          v-model="queryParams.leader"
          placeholder="请输入负责人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          size="small"
          v-model="queryParams.startTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          :picker-options="pickerOptions"
          end-placeholder="结束日期">
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
          v-hasPermi="['devsys:repair:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:repair:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:repair:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['devsys:repair:export']"
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

    <el-table stripe border v-loading="loading" :data="repairList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="检修内容" width='550' prop="repairContent">
         <template slot-scope="scoped">
          <span v-html="scoped.row.repairContent"></span>
        </template>
      </el-table-column>
      <el-table-column label="处理问题" header-align="center" width='150' prop="handleProblem" />
      <el-table-column label="遗留问题" header-align="center" width='150' prop="remainProblem" />
      <el-table-column label="检修级别" align="center" prop="repairLevel" />
      <el-table-column width='100' label="开始时间" align="center" prop="startTime" >
        <template slot-scope="scope">
          <span>{{ (scope.row.startTime !=null ? scope.row.startTime.substr(0, 10):scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column width='100' label="结束时间" align="center" prop="finishTime" >
        <template slot-scope="scope">
        <span>{{ (scope.row.finishTime !=null ? scope.row.finishTime.substr(0, 10):scope.row.finishTime) }}</span>
      </template>
      </el-table-column>
      <el-table-column label="检修班组" align="center" prop="clazz" />
      <el-table-column label="检修单位" width="100" align="center" prop="repairUnit" />
      <el-table-column label="负责人" width='80' align="center" prop="leader" />
      <el-table-column label="联系人" width='80' align="center" prop="linkman" />
      <el-table-column label="备注" width='200' align="center" prop="remark" />
       <el-table-column label="附件管理" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="uploadBtnClick(scope.row.repairId)">
            <i  class="el-icon-upload el-icon--right">上传</i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width='150' align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['devsys:repair:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:repair:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      style="margin-bottom: 30px"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

     <!-- 上传附件对话框 -->
    <el-dialog :close-on-click-modal="false" append-to-body title="附件管理" :visible.sync="dialogVisible" width="50%">
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
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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
    <el-dialog :close-on-click-modal="false" append-to-body :title="upload.title" :visible.sync="upload.open" width="400px">
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

    <!-- 添加或修改检修记录对话框 -->
    <el-dialog :close-on-click-modal="false" append-to-body :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="检修内容" prop="repairContent">
              <el-input v-model="form.repairContent" type="textarea" placeholder="请输入内容" :rows="3" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主要处理问题" prop="handleProblem">
              <el-input v-model="form.handleProblem" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="遗留问题" prop="remainProblem">
              <el-input v-model="form.remainProblem" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检修级别" prop="repairLevel">
              <el-input v-model="form.repairLevel" placeholder="请输入检修级别" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker clearable size="small" style="width: 180px"
                v-model="form.startTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择检修开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="finishTime">
              <el-date-picker clearable size="small" style="width: 180px"
                v-model="form.finishTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择检修结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检修班组" prop="clazz">
              <el-input v-model="form.clazz" placeholder="请输入检修班组" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检修单位" prop="repairUnit">
              <el-input v-model="form.repairUnit" placeholder="请输入检修单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="form.linkman" placeholder="请输入工作联系人" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :rows="5" />
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
import { uploadAnnx, removeUpdated, download, showUploadFile, listRepair, getRepair, delRepair, addRepair, updateRepair, exportRepair } from "@/api/devsys/repair";

export default {
  name: 'Repair',
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      },
       loading: null,
      fullscreenLoading: false,
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
        url: process.env.VUE_APP_BASE_API +`/devsys/repair/importData`
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
      // 检修记录表格数据
      repairList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipId: undefined,
        finishTime: undefined,
        startTime: undefined,
        repairContent: undefined,
        leader: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equipId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询检修记录列表 */
    getList() {
      let query = this.queryParams
      this.ocj.equipId = this.currentEquipId
      query.equipId = this.currentEquipId

      if (query.startTime) {
        query.finishTime = query.startTime[1]
        query.startTime = query.startTime[0]
      }

      this.loading = true;
      listRepair(query).then(response => {
        this.repairList = response.rows;
        // this.repairList.startTime.replace('T');

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
        repairId: undefined,
        equipId: this.ocj.equipId,
        startTime: undefined,
        finishTime: undefined,
        repairLevel: undefined,
        repairContent: undefined,
        handleProblem: undefined,
        remainProblem: undefined,
        clazz: undefined,
        repairUnit: undefined,
        leader: undefined,
        linkman: undefined,
        remark: undefined,
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
      this.ids = selection.map(item => item.repairId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.equipId = this.currentEquipId;
      this.title = "添加检修记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const repairId = row.repairId || this.ids
      getRepair(repairId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改检修记录";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.repairId != undefined) {
            updateRepair(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            //替换回车
            console.log(this.form.repairContent,222)
            this.form.repairContent = this.form.repairContent.replace(/\n|\r\n/g,'<br/>');
            console.log(this.form.repairContent,333)
            addRepair(this.form).then(response => {
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
      const repairIds = row.repairId || this.ids;
      this.$confirm('是否确认删除检修记录编号为"' + repairIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRepair(repairIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有检修记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRepair(queryParams);
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
      this.upUrl = process.env.VUE_APP_BASE_API +`/devsys/repair/uploadFile`

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
    // 自己定义上传方法  把默认的上传覆盖了  而且还改了上传参数  必须接受 repairId  files(不是上传的默认file~)
    handleUploadForm(param){
      console.log(param, 221);
      let formData = new FormData();
      formData.append("repairId", this.clickedId)
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
      download(row.repairId).then(res => {
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
      data.repairId = data.fileId
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
