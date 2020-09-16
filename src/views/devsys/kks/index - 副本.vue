<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="设备名称" prop="equName">
        <el-input
          v-model="queryParams.equName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="新kks编码" prop="newKks">
        <el-input
          v-model="queryParams.newKks"
          placeholder="请输入新kks编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="旧kks编码" prop="oldKks">
        <el-input
          v-model="queryParams.oldKks"
          placeholder="请输入旧kks编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input
          v-model="queryParams.department"
          placeholder="请输入部门"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input
          v-model="queryParams.major"
          placeholder="请输入专业"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班组" prop="clazz">
        <el-input
          v-model="queryParams.clazz"
          placeholder="请输入班组"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父kks编码" prop="parentKks">
        <el-input
          v-model="queryParams.parentKks"
          placeholder="请输入父kks编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item style="margin-left:22px">
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
          v-hasPermi="['devsys:kks:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:kks:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:kks:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['devsys:kks:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['devsys:kks:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="kksList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="kks编码id" align="center" prop="kksId" />
      <el-table-column label="设备名称" align="center" prop="equName" />
      <el-table-column label="新kks编码" align="center" prop="newKks" />
      <el-table-column label="旧kks编码" align="center" prop="oldKks" />
      <el-table-column label="设备规格" align="center" prop="equSpecifications" />
      <el-table-column label="部门" align="center" prop="department" />
      <el-table-column label="专业" align="center" prop="major" />
      <el-table-column label="班组" align="center" prop="clazz" />
      <el-table-column label="父kks编码" align="center" prop="parentKks" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['devsys:kks:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:kks:remove']"
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

    <!-- 添加或修改kks编码对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="equName">
          <el-input v-model="form.equName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="新kks编码" prop="newKks">
          <el-input v-model="form.newKks" placeholder="请输入新kks编码" />
        </el-form-item>
        <el-form-item label="旧kks编码" prop="oldKks">
          <el-input v-model="form.oldKks" placeholder="请输入旧kks编码" />
        </el-form-item>
        <el-form-item label="设备规格" prop="equSpecifications">
          <el-input v-model="form.equSpecifications" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="班组" prop="clazz">
          <el-input v-model="form.clazz" placeholder="请输入班组" />
        </el-form-item>
        <el-form-item label="父kks编码" prop="parentKks">
          <el-input v-model="form.parentKks" placeholder="请输入父kks编码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- kks编码导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
      ref="upload"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url + '?updateSupport=' + upload.updateSupport"
      :disabled="upload.isUploading"
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
      <div class="el-upload__tip" slot="tip">
        <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的kks编码数据
        <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
      </div>
      <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm">确 定</el-button>
      <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listKks, getKks, delKks, addKks, updateKks, exportKks, importTemplate } from "@/api/devsys/kks";
import { getToken } from "@/utils/auth";

export default {
  name: "Kks",
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
      // kks编码表格数据
      kksList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equName: undefined,
        newKks: undefined,
        oldKks: undefined,
        equSpecifications: undefined,
        department: undefined,
        major: undefined,
        clazz: undefined,
        parentKks: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        newKks: [
          { required: true, message: "新kks编码不能为空", trigger: "blur" }
        ],
      },
      // kks编码导入参数
      upload: {
        // 是否显示弹出层（kks编码导入）
        open: false,
        // 弹出层标题（kks编码导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的kks编码数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/devsys/kks/importData"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询kks编码列表 */
    getList() {
      this.loading = true;
      listKks(this.queryParams).then(response => {
        this.kksList = response.rows;
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
        kksId: undefined,
        equName: undefined,
        newKks: undefined,
        oldKks: undefined,
        equSpecifications: undefined,
        department: undefined,
        major: undefined,
        clazz: undefined,
        parentKks: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
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
      this.ids = selection.map(item => item.kksId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加kks编码";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const kksId = row.kksId || this.ids
      getKks(kksId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改kks编码";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.kksId != undefined) {
            updateKks(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addKks(this.form).then(response => {
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
      const kksIds = row.kksId || this.ids;
      this.$confirm('是否确认删除kks编码编号为"' + kksIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delKks(kksIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有kks编码数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportKks(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    // ##########################################################
    // 导出操作按钮
    handleImport() {
      this.upload.title = "kks编码导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
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