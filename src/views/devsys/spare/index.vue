<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="备件名称" prop="spareName">
        <el-input
          v-model="queryParams.spareName"
          placeholder="请输入备件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备件编号" prop="spareCode">
        <el-input
          v-model="queryParams.spareCode"
          placeholder="请输入备件编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备件类型" prop="spareType">
        <el-select
          v-model="queryParams.spareType"
          placeholder="请选择备件类型"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:spare:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:spare:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['devsys:spare:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="spareList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="备件名称" align="center" prop="spareName" />
      <el-table-column label="备件编号" align="center" prop="spareCode" />
      <el-table-column label="备件类型" align="center" prop="spareType" />
      <el-table-column label="库存数量" align="center" prop="stockNum" />
      <el-table-column label="库存地址" align="center" prop="stockPlace" />
      <el-table-column label="已换数量" align="center" prop="consumeNum" />
      <el-table-column
        label="更换时间"
        align="center"
        prop="consumeTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.consumeTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附件名称" align="center" prop="fname">
      </el-table-column>
      <el-table-column label="附件路径" align="center" prop="fpath" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column prop="attach" label="附件管理" width="180">
        <template slot-scope="scope">
          <!-- 上传按钮绑定click事件 -->
          <el-button
            size="mini"
            type="primary"
            @click="uploadBtnClick(scope.row.spareId)">
            <i  class="el-icon-upload el-icon--right">上传</i>
          </el-button>
          <el-button style="position: absolute"
            size="small"
            type="success"
            @click="uploadBtnClick(scope.row.spareId)">
            <i  class="el-icon-upload el-icon--right">下载</i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['devsys:spare:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:spare:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 上传附件对话框 -->
    <el-dialog title="附件管理" :visible.sync="dialogVisible" width="20%">
      <!-- 将<el-upload>代码添加到<el-dialog>代码块中 -->
      <!-- <el-upload
        class="upload-demo"
        drag
        action="111111"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :file-list="currentAttachList"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload> -->

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

    <!-- 添加或修改备品备件对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="备件名称" prop="spareName">
          <el-input v-model="form.spareName" placeholder="请输入备件名称" />
        </el-form-item>
        <el-form-item label="备件编号" prop="spareCode">
          <el-input v-model="form.spareCode" placeholder="请输入备件编号" />
        </el-form-item>
        <el-form-item label="备件类型">
          <el-select v-model="form.spareType" placeholder="请选择备件类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量" prop="stockNum">
          <el-input v-model="form.stockNum" placeholder="请输入库存数量" />
        </el-form-item>
        <el-form-item label="库存地址" prop="stockPlace">
          <el-input v-model="form.stockPlace" placeholder="请输入库存地址" />
        </el-form-item>
        <el-form-item label="已换数量" prop="consumeNum">
          <el-input v-model="form.consumeNum" placeholder="请输入已换数量" />
        </el-form-item>
        <el-form-item label="更换时间" prop="consumeTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.consumeTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择更换时间"
          >
          </el-date-picker>
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
import {
  listSpare,
  getSpare,
  delSpare,
  addSpare,
  updateSpare,
  exportSpare,
  uploadAnnx
} from "@/api/devsys/spare";

export default {
  props: {
    currentEquipId: {
      type: Number,
      default: ""
    }
  },
  name: "Spare",
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
      // 备品备件表格数据
      spareList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        spareName: [
          { required: true, message: "备件名称不能为空", trigger: "blur" }
        ],
        equipId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
        spareType: [
          { required: true, message: "备件类型不能为空", trigger: "blur" }
        ]
      },
      //======================================================
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        spareName: undefined,
        equipId: undefined,
        spareCode: undefined,
        spareType: undefined
      },
      // currentEquipId: undefined,
      //===================文件上传============================
      dialogVisible: false,
      // 设置当前文件列表数据currentAttachList，每次用户点击上传按钮，该数据就会被赋值为当前按钮那一列spareList中的attachList数据
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
    };
  },
  created() {
    // 给设备id设置值 根据设备id查询设备的备件
    // this.currentEquipId = this.$route.params.equipId
    this.queryParams.equipId = this.currentEquipId;
    this.getList();
  },
  watch: {
    currentEquipId(newval, oldval) {
      console.log(newval, oldval, 123);
      this.queryParams.equipId = this.currentEquipId;
      this.getList();
    }
  },
  mounted() {
    console.log(this.currentEquipId, 333);
  },
  methods: {
    // handleClose(done) {
    //     this.$confirm('确认关闭？')
    //       .then(_ => {
    //         done();
    //       })
    //       .catch(_ => {});
    //   },
    /** 查询备品备件列表 */
    getList() {
      this.loading = true;
      listSpare(this.queryParams).then(response => {
        this.spareList = response.rows;
        // 添加附件的数组
        this.spareList.forEach((val, index) => {
          val.attachList = [];
        });
        //console.log(this.spareList)
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
        spareName: undefined,
        equipId: undefined,
        spareCode: undefined,
        spareType: "0",
        stockNum: "",
        stockPlace: undefined,
        consumeNum: undefined,
        consumeTime: undefined,
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
      this.ids = selection.map(item => item.spareId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.equipId = this.currentEquipId;
      this.title = "添加备品备件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.equipId = this.currentEquipId;
      const spareId = row.spareId || this.ids;
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
      this.$confirm(
        '是否确认删除备品备件编号为"' + spareIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delSpare(spareIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {
          this.msgError("删除异常");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有备品备件数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportSpare(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    //#########################文件上传################################
    uploadBtnClick(id) {
      console.log(id)
      this.clickedId = id
      // 获取上传按钮对应那一列表格数据中的附件列表，赋值给currentAttachList
      // this.currentAttachList = this.spareList[index].attachList;
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
      formData.append("spareId", this.clickedId)
      formData.append("files", param.file)
      console.log(formData.get("spareId"),formData.get("files"),1111222)
      uploadAnnx(formData).then(res => {
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      })
      this.dialogVisible = false;
      this.handleRemove(param)

    },

    uploadSuccess(response, file, fileList) {
      var currentIndex = this.currentIndex;
      this.spareList[currentIndex].attachList.push({
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
  }
};
</script>
