<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 设备目录树 -->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="equipName"
            placeholder="请输入设备名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container mytree">
          <el-tree
            :data="equipOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <!-- 设备列表 -->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="设备名称" prop="equipName">
            <el-input
              v-model="queryParams.equipName"
              placeholder="请输入设备名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="kks编码" prop="equipKks">
            <el-input
              v-model="queryParams.equipKks"
              placeholder="请输入kks编码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择设备状态"
              clearable
              size="small"
            >
              <el-option label="请选择字典生成" value />
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-input
              v-model="queryParams.department"
              placeholder="请输入部门"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
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
              v-hasPermi="['devsys:equip:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              @click="editEquipNode"
              v-hasPermi="['devsys:equip:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteEquipNode"
              v-hasPermi="['devsys:equip:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['devsys:equip:export']"
              >导出</el-button
            >
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="equipList" row-key="equipId">
          <el-table-column
            label="设备名称"
            align="center"
            prop="equipName"
            width="150px"
          />
          <el-table-column
            label="kks编码"
            align="center"
            prop="equipKks"
            width="150px"
          />
          <el-table-column label="目录类型" align="center" prop="catalogType" />
          <el-table-column label="设备状态" align="center" prop="status">
            <template slot-scope="scope">
              <!-- {{ scope.row.status }} -->
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="statechanged(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="部门" align="center" prop="department" />
          <el-table-column label="专业" align="center" prop="major" />
          <el-table-column label="班组" align="center" prop="clazz" />
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column
            label="操作"
            align="center"
            width="200px"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['devsys:equip:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['devsys:equip:remove']"
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
      </el-col>
    </el-row>

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级设备/目录">
              <treeselect
                v-model="form.parentId"
                :options="equipOptions"
                :show-count="true"
                placeholder="选择上级设备/目录"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备名称" prop="equipName">
              <el-input v-model="form.equipName" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目录类型">
              <!-- <el-select v-model="form.catalogType" placeholder="请选择目录类型">
                <el-option label="请选择字典生成" value />
              </el-select> -->
              <el-radio-group v-model="form.catalogType">
                <el-radio label="0">设备</el-radio>
                <el-radio label="1">目录</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="kks编码" prop="equipKks">
              <el-input v-model="form.equipKks" placeholder="请输入kks编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-input v-model="form.department" placeholder="请输入部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-input v-model="form.major" placeholder="请输入专业" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班组" prop="clazz">
              <el-input v-model="form.clazz" placeholder="请输入班组" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备状态">
              <el-radio-group v-model="form.status">
                <el-radio label="1">请选择字典生成</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
  listEquip,
  getEquip,
  delEquip,
  addEquip,
  updateEquip,
  exportEquip,
  treeselect
} from "@/api/devsys/equip";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Equip",
  components: { Treeselect },
  data() {
    return {
      // 设备树选项
      equipOptions: [],
      // 设备名称
      equipName: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 设备表格数据
      equipList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentId: undefined,
        equipName: undefined,
        equipKks: undefined,
        status: undefined,
        department: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equipName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        catalogType: [
          {
            required: true,
            message: "目录类型（0设备 1目录）不能为空",
            trigger: "blur"
          }
        ]
      },
      // 当前点击左侧树的节点id
      currentParentId: undefined,
      currentParentName: undefined
    };
  },
  watch: {
    // 根据名称筛选部门树
    equipName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    // 监听switch开关状态的改变
    statechanged(info) {
      // console.log(info.status);
      if (info.status === true) {
        info.status = 0;
      } else if (info.status === false) {
        info.status = 1;
      }
      // console.log(info.status, 1111);
      let text = info.status == "0" ? "启用" : "停用";
      this.$confirm("确认要" + text + "" + info.equipName + "吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          updateEquip(info).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              // this.open = false;
              // this.getTreeselect();
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        })
        .catch(err => {
          this.getList();
          info.status = info.status == "0" ? "true" : "false";
          this.msgSuccess("已取消");
        });
    },
    /** 查询设备列表 */
    getList() {
      this.loading = true;
      listEquip(this.queryParams).then(response => {
        response.rows.forEach(res => {
          if (res.status == 0) {
            res.status = true;
          } else {
            res.status = false;
          }
        });

        this.equipList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.equipOptions = response.data;
      });
    },
    // 筛选节点  true 这个节点显示，false 这个节点会被隐藏
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击节点时触发
    handleNodeClick(data) {
      this.queryParams.parentId = data.id;
      this.currentParentId = data.id;
      this.currentParentName = data.label;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        equipId: undefined,
        parentId: 1,
        equipName: undefined,
        equipKks: undefined,
        orderNum: undefined,
        catalogType: "0",
        status: "0",
        department: undefined,
        major: undefined,
        clazz: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      if (this.currentParentId != null) {
        this.form.parentId = this.queryParams.parentId;
      }
      this.open = true;
      this.title = "添加设备";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const equipId = row.equipId;
      getEquip(equipId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备";
      });
    },

    //点击表哥上方的修改按钮
    editEquipNode() {
      this.reset();
      const equipId = this.currentParentId;
      if (equipId === undefined) {
        this.msgInfo("请选择左侧设备数据");
        return;
      }
      getEquip(equipId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.equipId != undefined) {
            updateEquip(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getTreeselect();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addEquip(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getTreeselect();
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
      console.log(row.equipName);
      const equipId = row.equipId;
      this.$confirm(
        '是否确认删除设备名称为"' + row.equipName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delEquip(equipId);
        })
        .then(() => {
          this.getList();
          this.getTreeselect();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },

    //点击表哥上方的删除键
    deleteEquipNode() {
      console.log(this.currentParentId, this.currentParentName);
      const equipId = this.currentParentId;
      if (equipId === undefined) {
        this.msgInfo("请选择左侧设备数据");
        return;
      }
      this.$confirm(
        "是否确认删除设备名称为" + this.currentParentName + "的数据项",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          return delEquip(equipId);
        })
        .then(() => {
          this.getList();
          this.getTreeselect();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有设备数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportEquip(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>

<style lang="scss" scoped>
.mytree /deep/ {
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node {
    position: relative;
    padding-left: 16px;
    .el-tree-node__content {
      padding-left: 0 !important;
    }
  }
  /* 节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉 */
  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }
  .el-tree-node__children {
    padding-left: 16px;
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 15px;
  }

  .el-tree-node__label {
    // padding-left: 8px;
    // font-size: 18px;
  }
}
</style>
