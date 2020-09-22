<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="跟踪事件名称" prop="trackName">
        <el-input
          v-model="queryParams.trackName"
          placeholder="请输入跟踪事件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发起者" prop="commander">
        <el-input
          v-model="queryParams.commander"
          placeholder="请输入发起者"
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
      <el-form-item label="执行单位" prop="workUnit">
        <el-input
          v-model="queryParams.workUnit"
          placeholder="请输入执行单位"
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
          v-hasPermi="['devsys:track:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:track:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:track:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table border v-loading="loading" :data="trackList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="跟踪事件名称" align="center" prop="trackName" />
      <el-table-column label="跟踪事件内容" align="center" prop="trackContent" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="153">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="finishTime" width="153">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起者" align="center" prop="commander" />
      <el-table-column label="执行者" align="center" prop="worker" />
      <el-table-column label="反馈内容" align="center" prop="feedback" />
      <el-table-column label="完成情况" align="center" prop="completeStatus" />
      <el-table-column label="执行单位" align="center" prop="workUnit" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="附件管理" align="center" class-name="small-padding fixed-width" width="168">
        <template slot-scope="scope">
          <el-button style="float: left"
            size="small"
            type="primary"
            icon="el-icon-upload"
            @click="handleAnnex(scope.row.trackId)"
          >附件</el-button>
          <el-button style="float: right;"
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
            v-hasPermi="['devsys:track:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:track:remove']"
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

    <!-- 添加或修改设备跟踪对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="跟踪事件名称" prop="trackName">
          <el-input v-model="form.trackName" placeholder="请输入跟踪事件名称" />
        </el-form-item>
        <el-form-item label="跟踪事件内容" prop="trackContent">
          <el-input v-model="form.trackContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="finishTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.finishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发起者" prop="commander">
          <el-input v-model="form.commander" placeholder="请输入发起者" />
        </el-form-item>
        <el-form-item label="执行者" prop="worker">
          <el-input v-model="form.worker" placeholder="请输入执行者" />
        </el-form-item>
        <el-form-item label="反馈内容" prop="feedback">
          <el-input v-model="form.feedback" placeholder="请输入反馈内容" />
        </el-form-item>
        <el-form-item label="完成情况" prop="completeStatus">
          <el-select v-model="form.completeStatus" placeholder="请选择完成状态">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行单位" prop="workUnit">
          <el-input v-model="form.workUnit" placeholder="请输入执行单位" />
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
import { listTrack, getTrack, delTrack, addTrack, updateTrack, exportTrack,uploadAnnx,download } from "@/api/devsys/track";

export default {
  props: {
    currentEquipId:{
      type: Number,
      default:'',
    }
  },
  name: "Track",
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
      // 设备跟踪表格数据
      trackList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 当前资料所属的设备ID
      // currentEquipId: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        trackName: undefined,
        equipId: undefined,
        commander: undefined,
        completeStatus: undefined,
        workUnit: undefined,
      },
      currentAttachList:[],
      dialogVisible:false,
      trackId:[],
      headersObj: {
        Authorization: document.cookie.split("=")[1],
        "Content-Type": "multipart/form-data"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        trackName: [
          { required: true, message: "跟踪事件名称不能为空", trigger: "blur" }
        ],
        equipId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
        completeStatus: [
          { required: true, message: "完成情况不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    //给设备id赋值，根据设备id查询设备的设备跟踪
    // this.currentEquipId = this.$route.params.equipId
    this.queryParams.equipId = this.currentEquipId
    this.getList();
  },
  watch: {
    currentEquipId(newval, oldval) {
      console.log(newval, oldval, 123);
      this.queryParams.equipId = this.currentEquipId;
      this.getList();
    }
  },
  methods: {
    /** 查询设备跟踪列表 */
    getList() {
      this.loading = true;
      listTrack(this.queryParams).then(response => {
        this.trackList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    handlePreview(file) {
      console.log(file);
    },
    //上传
    handleUploadForm(param){
      let formData = new FormData();
      formData.append("trackId", this.trackId)
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
    // 表单重置
    reset() {
      this.form = {
        trackId: undefined,
        trackName: undefined,
        trackContent: undefined,
        startTime: undefined,
        finishTime: undefined,
        commander: undefined,
        worker: undefined,
        feedback: undefined,
        completeStatus: "0",
        workUnit: undefined,
        fname: undefined,
        fpath: undefined,
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
      this.ids = selection.map(item => item.trackId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.equipId = this.currentEquipId
      this.title = "添加设备跟踪";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.equipId = this.currentEquipId
      const trackId = row.trackId || this.ids
      getTrack(trackId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备跟踪";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.trackId != undefined) {
            updateTrack(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTrack(this.form).then(response => {
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
      const trackIds = row.trackId || this.ids;
      this.$confirm('是否确认删除设备跟踪编号为"' + trackIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTrack(trackIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() { console.log('删除失败') });
    },
    handleAnnex(id){
      this.trackId=id;
      this.dialogVisible = true;
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
    submitUpload() {
      this.$refs.upload.submit();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有设备跟踪数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTrack(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    downloadBtnClick(row){
      download(row.trackId).then(res => {
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
