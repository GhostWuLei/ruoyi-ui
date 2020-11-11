<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="设备ID" prop="equipId">
        <el-input
          v-model="queryParams.equipId"
          placeholder="请输入设备ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发现日期" prop="findTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.findTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择发现日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="处理日期" prop="handleTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.handleTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择处理日期">
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
          v-hasPermi="['devsys:fault:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:fault:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:fault:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['devsys:fault:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="faultList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="故障ID" align="center" prop="faultId" />
      <el-table-column label="发现日期" align="center" prop="findTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.findTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="故障现象" align="center" prop="appearance" />
      <el-table-column label="分析" align="center" prop="analysis" />
      <el-table-column label="处理日期" align="center" prop="handleTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.handleTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理过程" align="center" prop="process" />
      <el-table-column label="损坏情况" align="center" prop="damage" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['devsys:fault:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:fault:remove']"
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

    <!-- 添加或修改故障记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="equipId">
          <el-input v-model="form.equipId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="发现日期" prop="findTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.findTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发现日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="故障现象" prop="appearance">
          <el-input v-model="form.appearance" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="分析" prop="analysis">
          <el-input v-model="form.analysis" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="处理日期" prop="handleTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.handleTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择处理日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理过程" prop="process">
          <el-input v-model="form.process" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="损坏情况" prop="damage">
          <el-input v-model="form.damage" type="textarea" placeholder="请输入内容" />
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
import { listFault, getFault, delFault, addFault, updateFault, exportFault } from "@/api/devsys/fault";

export default {
  name: "Fault",
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
      // 故障记录表格数据
      faultList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipId: undefined,
        findTime: undefined,
        appearance: undefined,
        handleTime: undefined,
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
    /** 查询故障记录列表 */
    getList() {
      this.loading = true;
      listFault(this.queryParams).then(response => {
        this.faultList = response.rows;
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
        faultId: undefined,
        equipId: undefined,
        findTime: undefined,
        appearance: undefined,
        analysis: undefined,
        handleTime: undefined,
        process: undefined,
        damage: undefined,
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
      this.ids = selection.map(item => item.faultId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加故障记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const faultId = row.faultId || this.ids
      getFault(faultId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改故障记录";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.faultId != undefined) {
            updateFault(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFault(this.form).then(response => {
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
      const faultIds = row.faultId || this.ids;
      this.$confirm('是否确认删除故障记录编号为"' + faultIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFault(faultIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有故障记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFault(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>