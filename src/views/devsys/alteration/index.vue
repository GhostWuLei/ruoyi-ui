<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="变更名称" prop="alterationName">
        <el-input
          v-model="queryParams.alterationName"
          placeholder="请输入变更名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更类别" prop="alterationType">
        <el-select v-model="queryParams.alterationType" placeholder="请选择变更类别" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="完成情况" prop="completeStatus">
        <el-select v-model="queryParams.completeStatus" placeholder="请选择完成情况" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="验收者" prop="checkMan">
        <el-input
          v-model="queryParams.checkMan"
          placeholder="请输入验收者"
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
          v-hasPermi="['devsys:alteration:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:alteration:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:alteration:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="alterationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="变更名称" align="center" prop="alterationName" />
      <el-table-column label="变更内容" align="center" prop="alterationContent" />
      <el-table-column label="变更类别" align="center" prop="alterationType" />
      <el-table-column label="变更时间" align="center" prop="alterationTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.alterationTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="验收时间" align="center" prop="checkDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.checkDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成情况" align="center" prop="completeStatus" />
      <el-table-column label="申请者" align="center" prop="applyer" />
      <el-table-column label="验收者" align="center" prop="checkMan" />
      <el-table-column label="专业" align="center" prop="major" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['devsys:alteration:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:alteration:remove']"
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

    <!-- 添加或修改异动变更对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="变更名称" prop="alterationName">
          <el-input v-model="form.alterationName" placeholder="请输入变更名称" />
        </el-form-item>
        <el-form-item label="变更内容" prop="alterationContent">
          <el-input v-model="form.alterationContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="变更类别">
          <el-select v-model="form.alterationType" placeholder="请选择变更类别">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更时间" prop="alterationTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.alterationTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择变更时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="验收时间" prop="checkDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.checkDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择验收时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="完成情况">
          <el-select v-model="form.completeStatus" placeholder="请选择完成情况">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请者" prop="applyer">
          <el-input v-model="form.applyer" placeholder="请输入申请者" />
        </el-form-item>
        <el-form-item label="验收者" prop="checkMan">
          <el-input v-model="form.checkMan" placeholder="请输入验收者" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入专业" />
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
  </div>
</template>

<script>
import { listAlteration, getAlteration, delAlteration, addAlteration, updateAlteration, exportAlteration } from "@/api/devsys/alteration";

export default {
    props:{
    currentEquipId:{
      type: Number,
      default: '',
    }
  },
  name: "Alteration",
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
      // 异动变更表格数据
      alterationList: [],
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
        alterationName: undefined,
        equipId: undefined,
        alterationType: undefined,
        completeStatus: undefined,
        checkMan: undefined,
        major: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        alterationName: [
          { required: true, message: "变更名称不能为空", trigger: "blur" }
        ],
        equipId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
        alterationType: [
          { required: true, message: "变更类别不能为空", trigger: "blur" }
        ],
        completeStatus: [
          { required: true, message: "完成情况不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    //给设备id赋值，根据设备id查询设备的异动变更
    // this.currentEquipId = this.$route.params.equipId
    this.queryParams.equipId = this.currentEquipId
    this.getList();
  },
  methods: {
    /** 查询异动变更列表 */
    getList() {
      this.loading = true;
      listAlteration(this.queryParams).then(response => {
        this.alterationList = response.rows;
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
        alterationId: undefined,
        alterationName: undefined,
        alterationContent: undefined,
        alterationType: '0',
        alterationTime: undefined,
        applyer: undefined,
        completeStatus: '0',
        checkDate: undefined,
        checkMan: undefined,
        major: undefined,
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
      this.ids = selection.map(item => item.alterationId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.form.equipId = this.currentEquipId
      this.title = "添加异动变更";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.equipId = this.currentEquipId
      const alterationId = row.alterationId || this.ids
      getAlteration(alterationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改异动变更";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.alterationId != undefined) {
            updateAlteration(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addAlteration(this.form).then(response => {
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
      const alterationIds = row.alterationId || this.ids;
      this.$confirm('是否确认删除异动变更编号为"' + alterationIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAlteration(alterationIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() { console.log('删除失败') });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有异动变更数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAlteration(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>