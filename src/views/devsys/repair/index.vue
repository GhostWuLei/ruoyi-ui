<template>
  <div class="app-container">

    <!-- 查询表单项 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="检修名称" prop="repairName">
        <el-input
          v-model="queryParams.repairName"
          placeholder="请输入检修名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检修性质" prop="repairKind">
        <el-select v-model="queryParams.repairKind" placeholder="请选择检修性质" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="检修类型" prop="repairType">
        <el-select v-model="queryParams.repairType" placeholder="请选择检修类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
    </el-row>

    <!-- 表格部分 -->
    <el-table border v-loading="loading" :data="repairList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="检修名称" align="center" prop="repairName" />
      <el-table-column label="检修时间" align="center" prop="repairDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.repairDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检修内容" align="center" prop="repairContent" />
      <el-table-column label="检修单位" align="center" prop="workUnit" />
      <el-table-column label="检修性质" align="center" prop="repairKind" />
      <el-table-column label="检修类型" align="center" prop="repairType" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="附件管理" prop="attach" width="180">
        <template slot-scope="scope">
          <!-- 上传按钮绑定click事件 -->
          <el-button
            size="mini"
            type="primary"
            @click="uploadBtnClick(scope.row.repairId)">
            <i  class="el-icon-upload el-icon--right">上传</i>
          </el-button>
          <el-button style="position: absolute"
            size="mini"
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
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改检修记录对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="检修名称" prop="repairName">
          <el-input v-model="form.repairName" placeholder="请输入检修名称" />
        </el-form-item>
        <el-form-item label="检修时间" prop="repairDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.repairDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择检修时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检修内容" prop="repairContent">
          <el-input v-model="form.repairContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="检修单位" prop="workUnit">
          <el-input v-model="form.workUnit" placeholder="请输入检修单位" />
        </el-form-item>
        <el-form-item label="检修性质" prop="repairKind">
          <el-select v-model="form.repairKind" placeholder="请选择检修性质">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="检修类型">
          <el-select v-model="form.repairType" placeholder="请选择检修类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
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
import { listRepair, getRepair, delRepair, addRepair, updateRepair, exportRepair, uploadAnnx, download } from "@/api/devsys/repair";
export default {
    props: {
    currentEquipId:{
      type: Number,
      default:'',
    }
  },
  name: "Repair",
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
        repairName: undefined,
        equipId: undefined,
        workUnit: undefined,
        repairKind: undefined,
        repairType: undefined,
      },
      // 当前检修记录所属的设备ID
      // currentEquipId: undefined,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        repairName: [
          { required: true, message: "检修名称不能为空", trigger: "blur" }
        ],
        equipId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
        repairKind: [
          { required: true, message: "检修性质不能为空", trigger: "blur" }
        ],
        repairType: [
          { required: true, message: "检修类型不能为空", trigger: "blur" }
        ],
      },
      //===================================
      dialogVisible: false,
      // 设置当前文件列表数据currentAttachList，每次用户点击上传按钮，该数据就会被赋值为当前按钮那一列repaireList中的attachList数据
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
    // 查询检修记录表
    getList(){
      this.loading = true
      listRepair(this.queryParams).then(response => {
        this.repairList = response.rows
        // 添加附件的数组
        this.repairList.forEach((val, index) => {
          val.attachList = [];
        })
        this.total = response.total
        this.loading = false
      })
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 表单重置
    reset() {
      this.form = {
        repairId: undefined,
        repairName: undefined,
        repairDate: undefined,
        repairContent: undefined,
        workUnit: undefined,
        repairKind: '0',
        repairType: '0',
        fname: undefined,
        fpath: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
    // 重置按钮操作
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 添加按钮操作
    handleAdd(){
      this.reset()
      this.open = true
      this.form.equipId = this.currentEquipId
      this.title = "添加检修记录"
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.repairId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 修改按钮操作
    handleUpdate(row){
      this.reset();
      this.form.equipId = this.currentEquipId
      const repairId = row.repairId || this.ids
      getRepair(repairId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改检修记录"
      })
    },
    // 删除按钮操作
    handleDelete(row){
      // 删除单个 或者 批量删除
      const repairIds = row.repairId || this.ids;
      this.$confirm('是否确认删除检修记录名称为'+ repairIds + '的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(function() {
        return delRepair(repairIds)
      }).then(() => {
        this.getList()
        this.msgSuccess("删除成功")
      }).catch(function() { console.log('删除失败') })
    },
    // 添加修改框的确认按钮
    submitForm: function() {
      console.log("submitForm函数执行了...")
      this.$refs["form"].validate(valid => {
        if(valid) {
          if(this.form.repairId != undefined){
            // 修改的操作
            updateRepair(this.form).then(response => {
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
            addRepair(this.form).then(response => {
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
    // 添加修改框的取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // ===========================================
    uploadBtnClick(id) {
      console.log(id)
      this.clickedId = id
      // 获取上传按钮对应那一列表格数据中的附件列表，赋值给currentAttachList
      // this.currentAttachList = this.repairList[index].attachList;
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
      formData.append("repairId", this.clickedId)
      formData.append("files", param.file)
      console.log(formData.get("repairId"),formData.get("files"),1111222)
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
      this.repairList[currentIndex].attachList.push({
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
        var attachList = this.repairList[currentIndex].attachList;
        var tempList = [];
        for (var i = 0; i < attachList.length; i++) {
          if (file.name != attachList[i].name) {
            tempList.push(attachList[i]);
          }
        }
        this.repairList[currentIndex].attachList = tempList;
      } else {
        this.isRepeat = false;
      }
    },
    beforeUpload(file) {
      var currentIndex = this.currentIndex;
      //首先需要获取当前已经上传的文件列表
      var list = this.repairList[currentIndex].attachList;
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
