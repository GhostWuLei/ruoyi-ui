<template>
  <div class="app-container">
    

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['devsys:kks:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      border
      :data="kksList"
      row-key="kksId"
      default-expand-all
      :row-style="{ height: 15 + 'px' }"
      :cell-style="{ padding: '0px' }"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column width="270" label="新kks编码" prop="newKks"></el-table-column>
      <el-table-column width="180" label="设备名称" prop="equName" />
      <el-table-column width="160" label="旧kks编码" prop="oldKks" />
      <el-table-column width="200" label="所属系统图" prop="diagramName" />
      <el-table-column width="250" label="设备规格" prop="equSpecifications"/>
      <!-- <el-table-column label="部门" align="center" prop="department" /> -->
      <el-table-column label="专业" prop="major"></el-table-column>
      
      <!-- <el-table-column label="班组" align="center" prop="clazz" /> -->
      <el-table-column width="210" label="备注" prop="remark" />
      
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAdd(scope.row)"
            v-hasPermi="['devsys:kks:add']"
            >新增</el-button
          >
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加或修改kks编码对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px">
      
    </el-dialog>

    <!-- kks编码导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      
    </el-dialog>

  </div>
</template>

<script>
import {
  listKks,
  getKks,
  delKks,
  addKks,
  updateKks,
  exportKks,
  importTemplate,
  listTreeKks
} from "@/api/devsys/kks";
import { getAllDiagrams } from "@/api/picsys/diagram"
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";

export default {
  name: "Kks",
  components: { Treeselect },
  data() {
    return {
      // 要展开的行，数值的元素是row的key值
      expands: ["1", "2", "3", "4"],

      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // kks编码表格数据
      kksList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 1000,
        equName: undefined,
        newKks: undefined,
        oldKks: undefined,
        equSpecifications: undefined,
        department: undefined,
        major: undefined,
        clazz: undefined,
        parentKks: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentKks: [
          { required: true, message: "上级设备不能为空", trigger: "blur" }
        ],
        equName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        newKks: [
          { required: true, message: "新kks编码不能为空", trigger: "blur" }
        ]
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
      },
      // KKS下拉树选项
      kksOptions: [],
      // 系统图下拉选项
      diagramsOption: [],
      // 专业下拉选项
      majorOptions: []

    };
  },
  created() {
    this.getList();
    this.getDicts("sys_ele_major").then(response => {
      this.majorOptions = response.data
    })
  },
  methods: {
    // 查询树表
    getList() {
      // console.log('getList()函数执行了')
      this.loading = true;
      listTreeKks(this.queryParams).then(response => {
        this.kksList = response.kksTree;
        // console.log(this.kksList, 444);
        // this.total = response.total;
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
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    

    /** 查询kks下拉树结构 */
    getTreeselect() {
      listKks().then(response => {
        this.kksOptions = this.handleTree(response.data, "newKks", "parentKks","children", "0");
      });
    },

    // 获取所有系统图数据
    getDiagramList() {
      getAllDiagrams().then(response => {
        this.diagramsOption = response.data
      })
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      // this.reset();
      // this.getTreeselect();
      // this.getDiagramList();
      if(row != undefined) {
        this.form.parentKks = row.newKks
      }
      this.open = true;
      this.title = "添加kks编码";
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
   
   
  }
};
</script>
