<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 设备目录树 -->
      <el-col :span="5" :xs="24">
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
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                  <i class="el-icon-folder" v-if="data.children"></i>
                  <i class="el-icon-document" v-else></i>
                  &nbsp;{{ data.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>

      <el-col :span="19" :xs="24" v-if="isEquip">
        <el-tabs type="card">
          <el-tab-pane label="设备信息">
            <information-vue :currentEquipId="this.currentEquipId"></information-vue>
          </el-tab-pane>
          <el-tab-pane label="检修记录">
            <repair-vue :currentEquipId="this.currentEquipId"></repair-vue>
          </el-tab-pane>
          <el-tab-pane label="故障记录">
            <fault-vue :currentEquipId="this.currentEquipId"></fault-vue>
          </el-tab-pane>
          <el-tab-pane label="异动变更">
            <alteration-vue :currentEquipId="this.currentEquipId"></alteration-vue>
          </el-tab-pane>
          <el-tab-pane label="附属设备明细">
            <subsidiary-vue :currentEquipId="this.currentEquipId"></subsidiary-vue>
          </el-tab-pane>
          <el-tab-pane label="备品备件">
            <spare-vue :currentEquipId="this.currentEquipId"></spare-vue>
          </el-tab-pane>
          <!-- <el-tab-pane label="技术资料">
            <material-vue :currentEquipId="this.currentEquipId"></material-vue>
          </el-tab-pane> -->
          <!-- <el-tab-pane label="设备定值">
            <constval-vue :currentEquipId="this.currentEquipId"></constval-vue>
          </el-tab-pane>
          <el-tab-pane label="设备规范">
            <norm-vue :currentEquipId="this.currentEquipId"></norm-vue>
          </el-tab-pane>
          <el-tab-pane label="设备跟踪">
            <track-vue :currentEquipId="this.currentEquipId"></track-vue>
          </el-tab-pane>
          <el-tab-pane label="异动变更">
            <alteration-vue :currentEquipId="this.currentEquipId"></alteration-vue>
          </el-tab-pane>
          <el-tab-pane label="重大技改">
            <reform-vue :currentEquipId="this.currentEquipId"></reform-vue>
          </el-tab-pane> -->
        </el-tabs>
      </el-col>

    </el-row>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect, getEquip } from "@/api/devsys/equip";
import spareVue from '@/views/devsys/spare/index.vue'
import informationVue from '@/views/devsys/information/index.vue'
import repairVue from '@/views/devsys/repair/index.vue'
import subsidiaryVue from '@/views/devsys/subsidiary/index.vue'
import faultVue from '@/views/devsys/fault/index.vue'
import alterationVue from '@/views/devsys/alteration/index.vue'
// import reformVue from '@/views/devsys/reform/index.vue'
// import trackVue from '@/views/devsys/track/index.vue'
export default {
  data() {
    return {
      isEquip: false,
      // 设备树选项
      equipOptions: [],
      // 设备名称
      equipName: '',
      defaultProps: {
        children: "children",
        label: "label"
      },
      currentEquipId: undefined,
      currentEquipName: undefined,
      //点击节点 查询出来的设备信息
      equip: {}
    }
  },
  components: {
    spareVue,
    alterationVue,
    repairVue,
    subsidiaryVue,
    faultVue,
    informationVue
    // materialVue,
    // constvalVue,
    // normVue,
    // trackVue,
    // reformVue,
  },
  watch: {
    //根据设备名称 筛选设备
    equipName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeselect()
  },
  methods: {
    /** 查询设备下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.equipOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击树节点时触发
    handleNodeClick(data){
      // console.log(data.id);

      this.currentEquipId = data.id
      this.currentEquipName = data.label
      //获取当前点击的设备信息 如果点击的是设备 则显示设备台账
      getEquip(this.currentEquipId).then(response => {
        if(response.data.catalogType === '0'){
          this.isEquip = true
        }else{
          this.isEquip = false
        }
        this.equip = response.data
      })

      this.getTreeselect()
    }

  }
}
</script>

<style lang="scss" scoped>
.info-blank {
  font-size: 25px;
}
.el-icon-folder {
  color: black;
  font-weight: 600;
}
.el-icon-document {
  color: black;
}
// .mytree /deep/{
//      .el-tree > .el-tree-node:after {
//       border-top: none;
//     }
//     .el-tree-node {
//       position: relative;
//       padding-left: 16px;
//     }
//     /* 节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉 */
//     .el-tree-node__expand-icon.is-leaf{
//       display: none;
//     }
//     .el-tree-node__children {
//       padding-left: 16px;
//     }

//     .el-tree-node :last-child:before {
//       height: 38px;
//     }

//     .el-tree > .el-tree-node:before {
//       border-left: none;
//     }

//     .el-tree > .el-tree-node:after {
//       border-top: none;
//     }

//     .el-tree-node:before {
//       content: "";
//       left: -4px;
//       position: absolute;
//       right: auto;
//       border-width: 1px;
//     }

//     .el-tree-node:after {
//       content: "";
//       left: -4px;
//       position: absolute;
//       right: auto;
//       border-width: 1px;
//     }

//     .el-tree-node:before {
//       border-left: 1px dashed #4386c6;
//       bottom: 0px;
//       height: 100%;
//       top: -26px;
//       width: 1px;
//     }

//     .el-tree-node:after {
//       border-top: 1px dashed #4386c6;
//       height: 20px;
//       top: 12px;
//       width: 15px;
//     }

//     .el-tree-node__label{
//       padding-left: 8px;
//     }
//   }
</style>
