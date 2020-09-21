<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="技改名称" prop="reformName">
        <el-input
          v-model="queryParams.reformName"
          placeholder="请输入技改名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="执行单位" prop="workUnit">
        <el-input
          v-model="queryParams.workUnit"
          placeholder="请输入执行单位"
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
      <el-form-item label="完成情况" prop="completeStatus">
        <el-select v-model="queryParams.completeStatus" placeholder="请选择完成情况" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getEquip">搜索</el-button>
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
          v-hasPermi="['devsys:reform:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:reform:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:reform:remove']"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="reformList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="技改名称" align="center" prop="reformName" />
      <el-table-column label="执行单位" align="center" prop="workUnit" />
      <el-table-column label="完成时间" align="center" prop="finishTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成情况" align="center" prop="completeStatus" />
      <el-table-column label="是否验收" align="center" prop="isCheck" />
      <el-table-column label="验收者" align="center" prop="checker" />
      <el-table-column label="专业" align="center" prop="major" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="附件管理" align="center" class-name="small-padding fixed-width" width="168">
        <template slot-scope="scope">
          <el-button
            style="float: left"
            size="small"
            type="primary"
            icon="el-icon-upload"
            @click="handleAnnex(scope.row.reformId)"
          >上传</el-button>
          <el-button
            style="float: right"
            size="small"
            type="success"
            @click="downloadBtnClick(scope.row)">
            <i  class="el-icon-upload el-icon--right">下载</i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="111">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['devsys:reform:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:reform:remove']"
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

    <!-- 添加或修改重大技改对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="技改名称" prop="reformName">
          <el-input v-model="form.reformName" placeholder="请输入技改名称" />
        </el-form-item>
        <el-form-item label="设备" prop="equipId" >
          <el-select v-model="form.equipId" placeholder="请选择设备">
            <el-option
              v-for="item in options"
              :key="item.equipId"
              :label="item.equipName"
              :value="item.equipId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="完成情况">
          <el-radio-group v-model="form.completeStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="执行单位" prop="workUnit">
          <el-input v-model="form.workUnit" placeholder="请输入执行单位" />
        </el-form-item>
        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.finishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否验收" prop="isCheck">
          <el-input v-model="form.isCheck" placeholder="请输入是否验收" />
        </el-form-item>
        <el-form-item label="验收者" prop="checker">
          <el-input v-model="form.checker" placeholder="请输入验收者" />
        </el-form-item>
        <el-form-item label="附件名称" prop="fname">
          <el-input v-model="form.fname" placeholder="请输入附件名称" />
        </el-form-item>
        <el-form-item label="附件路径" prop="fpath">
          <el-input v-model="form.fpath" placeholder="请输入附件路径" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="附件管理" :visible.sync="dialogVisible" width="20%">
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
import { listReform, getReform, delReform, addReform, updateReform, exportReform ,uploadAnnx,download,getEquip} from "@/api/devsys/reform";

export default {
  props:{
    currentEquipId:{
      type: Number,
      default: '',
    }
  },
  name: "Reform",
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
      // 重大技改表格数据
      reformList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        reformName: undefined,
        equipId: undefined,
        major: undefined,
        completeStatus: undefined,
        workUnit: undefined,
      },
      options:[],
      currentAttachList:[],
      dialogVisible:false,
      headersObj: {
        Authorization: document.cookie.split("=")[1],
        "Content-Type": "multipart/form-data"
      },
      value: '',
      reformId:[],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        reformName: [
          { required: true, message: "技改名称不能为空", trigger: "blur" }
        ],
        equipId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
        completeStatus: [
          { required: true, message: "完成情况不能为空", trigger: "blur" }
        ],
        isCheck: [
          { required: true, message: "是否验收不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getEquip();
  },
  watch: {
    currentEquipId(newval, oldval) {
      console.log(newval, oldval, 123);
      this.queryParams.equipId = this.currentEquipId;
      this.getList();
    }
  },
  methods: {
    /** 查询重大技改列表 */
    getList() {
      this.loading = true;
      listReform(this.queryParams).then(response => {
        this.reformList = response.rows;
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
        reformId: undefined,
        reformName: undefined,
        equipId: undefined,
        major: undefined,
        completeStatus: "0",
        workUnit: undefined,
        finishTime: undefined,
        isCheck: undefined,
        checker: undefined,
        fname: undefined,
        fpath: undefined,
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
      this.ids = selection.map(item => item.reformId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加重大技改";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const reformId = row.reformId || this.ids
      getReform(reformId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改重大技改";
      });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    getEquip(){
      getEquip().then(res=>{
        this.options=res.data
      })
    },
    handleRemove(file, fileList) {
      if (this.isRepeat == false) {
        var currentIndex = this.currentIndex;
        var attachList = this.spareList[currentIndex].attachList;
        var tempList = [];
        for (var i = 0; i < attachList.length; i++) {
          if (file.name != attachList[i].name) {
            tempList.push(attachList[i]);
          }
        }
        this.spareList[currentIndex].attachList = tempList;
      } else {
        this.isRepeat = false;
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.reformId != undefined) {
            updateReform(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addReform(this.form).then(response => {
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
      const reformIds = row.reformId || this.ids;
      this.$confirm('是否确认删除重大技改编号为"' + reformIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delReform(reformIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有重大技改数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportReform(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //上传
    handleUploadForm(param){
      let formData = new FormData();
      formData.append("reformId", this.reformId)
      formData.append("files", param.file)
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
    // 附件管理
    handleAnnex(id){
      this.reformId=id;
      this.dialogVisible = true;
    },
    downloadBtnClick(row){
      console.log(row,11112233)
      download(row.spareId).then(res => {
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
};
</script>
