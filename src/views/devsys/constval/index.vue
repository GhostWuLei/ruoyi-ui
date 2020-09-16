<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="定值名称" prop="constvalName">
        <el-input
          v-model="queryParams.constvalName"
          placeholder="请输入定值名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="执行者" prop="worker">
        <el-input
          v-model="queryParams.worker"
          placeholder="请输入执行者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="监督者" prop="supervisor">
        <el-input
          v-model="queryParams.supervisor"
          placeholder="请输入监督者"
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
          v-hasPermi="['devsys:constval:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:constval:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:constval:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格部分 -->
    <el-table v-loading="loading" :data="constvalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="定值名称" align="center" prop="constvalName" />
      <el-table-column label="原定值" align="center" prop="oldValue" />
      <el-table-column label="新定值" align="center" prop="newValue" />
      <el-table-column label="执行者" align="center" prop="worker" />
      <el-table-column label="监督者" align="center" prop="supervisor" />
      <el-table-column label="要求执行时间" align="center" prop="requireTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.requireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际执行时间" align="center" prop="actualTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.actualTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大值" align="center" prop="maxValue" />
      <el-table-column label="最小值" align="center" prop="minValue" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="附件管理" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-upload"
            @click="handleAnnex(scope.row)"
          >附件</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['devsys:constval:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:constval:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备定值对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="定值名称" prop="constvalName">
          <el-input v-model="form.constvalName" placeholder="请输入定值名称" />
        </el-form-item>
        <el-form-item label="原定值" prop="oldValue">
          <el-input v-model="form.oldValue" placeholder="请输入原定值" />
        </el-form-item>
        <el-form-item label="新定值" prop="newValue">
          <el-input v-model="form.newValue" placeholder="请输入新定值" />
        </el-form-item>
        <el-form-item label="执行者" prop="worker">
          <el-input v-model="form.worker" placeholder="请输入执行者" />
        </el-form-item>
        <el-form-item label="监督者" prop="supervisor">
          <el-input v-model="form.supervisor" placeholder="请输入监督者" />
        </el-form-item>
        <el-form-item label="要求执行时间" prop="requireTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.requireTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择要求执行时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实际执行时间" prop="actualTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.actualTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择实际执行时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最大值" prop="maxValue">
          <el-input v-model="form.maxValue" placeholder="请输入最大值" />
        </el-form-item>
        <el-form-item label="最小值" prop="minValue">
          <el-input v-model="form.minValue" placeholder="请输入最小值" />
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
import { listConstval, getConstval, delConstval, addConstval, updateConstval, exportConstval } from "@/api/devsys/constval";
export default {
  props: {
    currentEquipId:{
      type: Number,
      default:'',
    }
  },
  name: "Constval",
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipId: undefined,
        constvalName: undefined,
        worker: undefined,
        supervisor: undefined
      },
      // 当前资料所属的设备ID
      // currentEquipId: undefined,
      // 设备定值表格数据
      constvalList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        constvalName: [
          { required: true, message: "定值名称不能为空", trigger: "blur" }
        ],
        equipId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
    //给设备id赋值，根据设备id查询设备的定值
    // this.currentEquipId = this.$route.params.equipId
    this.queryParams.equipId = this.currentEquipId
    this.getList()
  },
  methods: {
    // 查询设备定值列表
    getList() {
      //console.log(this.queryParams.equipId)
      this.loading = true
      listConstval(this.queryParams).then(response => {
        this.constvalList = response.rows
        this.total = response.total
      })
      this.loading = false
    },
    // 表单重置
    reset() {
      this.form = {
        constvalId: undefined,
        constvalName: undefined,
        oldValue: undefined,
        newValue: undefined,
        worker: undefined,
        supervisor: undefined,
        requireTime: undefined,
        actualTime: undefined,
        maxValue: undefined,
        minValue: undefined,
        fname: undefined,
        fpath: undefined,
        remark: undefined
      }
      this.resetForm("form");
    },
    // 搜索按钮操作
    handleQuery(){
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置按钮操作
    resetQuery(){
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 新增按钮操作
    handleAdd(){
      this.reset()
      this.open = true
      this.form.equipId = this.currentEquipId
      this.title = "添加设备定值"
    },
    // 多选框选中数据
    handleSelectionChange(selection){
      this.ids = selection.map(item => item.constvalId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 修改按钮操作
    handleUpdate(row){
      this.reset();
      this.form.equipId = this.currentEquipId
      const constvalId = row.constvalId || this.ids
      getConstval(constvalId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改设备定值"
      })
    },
    // 删除按钮操作
    handleDelete(row){
      // 删除单个 或者 批量删除
      const constvalIds = row.constvalId || this.ids;
      this.$confirm('是否确认删除技术资料名称为'+ constvalIds + '的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(function() {
        return delConstval(constvalIds)
      }).then(() => {
        this.getList()
        this.msgSuccess("删除成功")
      }).catch(function() { console.log('删除失败') })
    },
    // 对话框提交按钮操作
    submitForm: function() {
      console.log("submitForm方法执行了...")
      this.$refs["form"].validate(valid => {
        if(valid) {
          if(this.form.constvalId != undefined){
            // 修改的操作
            updateConstval(this.form).then(response => {
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
            addConstval(this.form).then(response => {
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
    // 对话框取消按钮操作
    cancel(){
      this.open = false
      this.reset()
    },
    // 附件操作
    handleAnnex(){
      console.log("handleAnnex函数执行了...")
    }
  }
}
</script>