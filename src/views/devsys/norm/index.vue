<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="规范名称" prop="normName">
        <el-input
          v-model="queryParams.normName"
          placeholder="请输入规范名称"
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
          v-hasPermi="['devsys:norm:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:norm:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:norm:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="normList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="规范名称" align="center" prop="normName" />
      <el-table-column label="规范值" align="center" prop="normValue" />
      <el-table-column label="计量单位" align="center" prop="normUnit" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建者" align="center" prop="createBy" />
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
            v-hasPermi="['devsys:norm:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:norm:remove']"
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

    <!-- 添加或修改设备规范对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="规范名称" prop="normName">
          <el-input v-model="form.normName" placeholder="请输入规范名称" />
        </el-form-item>
        <el-form-item label="规范值" prop="normValue">
          <el-input v-model="form.normValue" placeholder="请输入规范值" />
        </el-form-item>
        <el-form-item label="计量单位" prop="normUnit">
          <el-input v-model="form.normUnit" placeholder="请输入计量单位" />
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
import { listNorm, getNorm, delNorm, addNorm, updateNorm, exportNorm } from "@/api/devsys/norm";
export default {
   props: {
    currentEquipId:{
      type: Number,
      default:'',
    }
  },
  name: "Norm",
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
      // 设备规范表格数据
      normList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        normName: undefined,
        equipId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        normName: [
          { required: true, message: "规范名称不能为空", trigger: "blur" }
        ],
        equipId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
      },
      // 当前资料所属的设备ID
      // currentEquipId: undefined,
    }
  },
  created() {
    //给设备id赋值，根据设备id查询设备的资料
    // this.currentEquipId = this.$route.params.equipId
    this.queryParams.equipId = this.currentEquipId
    this.getList()
  },
  methods: {
    /** 查询设备规范列表 */
    getList() {
      this.loading = true
      listNorm(this.queryParams).then(response => {
        this.normList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        normId: undefined,
        normName: undefined,
        normValue: undefined,
        normUnit: undefined,
        fname: undefined,
        fpath: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },

    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.normId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset()
      this.open = true
      this.form.equipId = this.currentEquipId
      this.title = "添加设备规范"
    },
    handleUpdate(row) {
      this.reset();
      this.form.equipId = this.currentEquipId
      const normId = row.normId || this.ids
      getNorm(normId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改设备规范"
      })
    },
    submitForm: function() {
      console.log("submitForm方法执行了...")
      this.$refs["form"].validate(valid => {
        if(valid) {
          if(this.form.normId != undefined){
            // 修改的操作
            updateNorm(this.form).then(response => {
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
            addNorm(this.form).then(response => {
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
    cancel() {
      this.open = false
      this.reset()
    },
    handleDelete(row) {
      // 删除单个 或者 批量删除
      const normIds = row.normId || this.ids;
      this.$confirm('是否确认删除设备规范名称为'+ normIds + '的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(function() {
        return delNorm(normIds)
      }).then(() => {
        this.getList()
        this.msgSuccess("删除成功")
      }).catch(function() { console.log('删除失败') })
    },
    handleAnnex(){
      console.log('handleAnnex函数执行了')
    }
  }
}
</script>