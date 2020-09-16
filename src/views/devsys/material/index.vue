<template>
  <div class="app-container">
    
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="资料名称" prop="materialName">
        <el-input 
          v-model="queryParams.materialName"
          placeholder="请输入资料名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资料类型" prop="materialType">
        <el-select v-model="queryParams.materialType" placeholder="请选择资料类型" clearable size="small">
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
          v-hasPermi="['devsys:material:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['devsys:material:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['devsys:material:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="materialList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资料名称" align="center" prop="materialName" />
      <el-table-column label="资料类型" align="center" prop="materialType" />
      <el-table-column label="上传时间" align="center" prop="upTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.upTime) }}</span>
        </template>
      </el-table-column>
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
            v-hasPermi="['devsys:material:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['devsys:material:remove']"
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

    <!-- 添加或修改技术资料对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="资料名称" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请输入资料名称" />
        </el-form-item>

        <el-form-item label="资料类型" prop="materialType">
          <el-select v-model="form.materialType" placeholder="请选择资料类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>

        <el-form-item label="上传时间" prop="upTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.upTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上传时间">
          </el-date-picker>
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
import { listMaterial, getMaterial, delMaterial, addMaterial, updateMaterial, exportMaterial } from "@/api/devsys/material";
export default {
  props: {
    currentEquipId:{
      type: Number,
      default:'',
    }
  },
  name: "Material",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数 总记录数
      total: 0,
      // 是否显示弹出层
      open: false,
      // 弹出框标题
      title: '',
      //查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipId: undefined,
        materialName: undefined,
        materialType: undefined
      },
      // 资料列表
      materialList: [],
      // 当前资料所属的设备ID
      // currentEquipId: undefined,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        materialName: [
          { required: true, message: "资料名称不能为空", trigger: "blur" }
        ],
        materialType: [
          { required: true, message: "资料类型不能为空", trigger: "blur" }
        ]
      },
      // 批量删除时的选中数组
      ids: []
    }
  },
  created() {
    //给设备id赋值，根据设备id查询设备的资料
    // this.currentEquipId = this.$route.params.equipId
    this.queryParams.equipId = this.currentEquipId
    this.getList();
  },
  mounted() {
    console.log(this.currentEquipId,55)
  },
  watch: {
    currentEquipId(newval,oldval) {
        console.log(newval,oldval,123);
      }
  },
  methods: {
    // 查询技术资料列表
    getList() {
      //console.log(this.queryParams.equipId)
      this.loading = true
      listMaterial(this.queryParams).then(response => {
        this.materialList = response.rows
        this.total = response.total
        this.loading = false
      })
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
      this.title = "添加技术资料"
    },
    // 修改按钮操作
    handleUpdate(row){
      this.reset();
      this.form.equipId = this.currentEquipId
      const materialId = row.materialId || this.ids
      getMaterial(materialId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改技术资料"
      })
    },
    // 点击删除按钮
    handleDelete(row){
      // 删除单个 或者 批量删除
      const materialIds = row.materialId || this.ids;
      this.$confirm('是否确认删除技术资料名称为'+ materialIds + '的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(function() {
        return delMaterial(materialIds)
      }).then(() => {
        this.getList()
        this.msgSuccess("删除成功")
      }).catch(function() { console.log('删除失败') })
    },
    // 多选框选中数据
    handleSelectionChange(selection){
      this.ids = selection.map(item => item.materialId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 附件管理按钮操作
    handleAnnex(){
      console.log('handleAnnex')
    },
    // 添加修改框的确认按钮
    submitForm: function() {
      //console.log("submitForm方法执行了...")
      this.$refs["form"].validate(valid => {
        if(valid) {
          if(this.form.materialId != undefined){
            // 修改的操作
            updateMaterial(this.form).then(response => {
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
            addMaterial(this.form).then(response => {
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
    // 取消按钮
    cancel(){
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        materialId: undefined,
        materialName: undefined,
        materialType: '0',
        upTime: undefined,
        fname: undefined,
        fpath: undefined,
        remark: undefined,
      }
      this.resetForm("form");
    }

  }
}
</script>
