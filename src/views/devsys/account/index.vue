<template>
  <div class="app-container" style="padding:0px 0px 20px 15px">
    <el-row :gutter="15" class="box" ref="box">
      <!-- 设备目录树 -->
      <el-col :span="4" :xs="24" class="left">
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
          <!-- <el-tree
            class="filter-tree"
            :data="data"
            :props="defaultProps"
            node-key="OID"
            accordion
            :indent=0
            :check-on-click-node='true'
            @check="setSelectedNode"
            :default-expanded-keys="[11]"
            :default-checked-keys="[11]"
            :filter-node-method="filterNode"
            ref="tree">
            **<span class="slot-t-node" slot-scope="{node,data}"> <i :class="{'fa fa-folder':!node.expanded,'fa fa-folder-open':node.expanded,'fa fa-file':node.isLeaf}" style="color:#333" /> <span style="color:red;font-weight:600" v-show="data.existFD==0&&node.isLeaf">{{node.label}}</span> <span v-show="data.existFD!=0">{{node.label}} </span>
            </span>**
          </el-tree> -->
          <el-tree
            class="filter-tree"
            :data="equipOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ data }">
              <span>
                  <i class="el-icon-folder" v-if="data.children"></i>
                  <i class="el-icon-document" v-else></i>
                  &nbsp;{{ data.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>

      <!-- <div class="resize" title="收缩侧边栏">
        ⋮
      </div> -->
      <div class="ivu-split-trigger-con resize" title="收缩侧边栏">
        <div class="ivu-split-trigger ivu-split-trigger-vertical">
          <div class="ivu-split-trigger-bar-con vertical">
            <i class="ivu-split-trigger-bar"></i>
            <i class="ivu-split-trigger-bar"></i>
            <i class="ivu-split-trigger-bar"></i>
            <i class="ivu-split-trigger-bar"></i>
            <i class="ivu-split-trigger-bar"></i>
            <i class="ivu-split-trigger-bar"></i>
            <i class="ivu-split-trigger-bar"></i>
            <i class="ivu-split-trigger-bar"></i>
          </div>
        </div>
      </div>

      <!-- 设备列表 -->
      <el-col :span="20" :xs="24" class="mid">
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
  name: 'Account',
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
      currentEquipId: 1,
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
    this.getTreeselect();
  },
  mounted () {
    this.dragControllerDiv()
  },
  methods: {
    dragControllerDiv: function () {
      var resize = document.getElementsByClassName('resize');
      var left = document.getElementsByClassName('left');
      var mid = document.getElementsByClassName('mid');
      var box = document.getElementsByClassName('box');

      for (let i = 0; i < resize.length; i++) {
        // 鼠标按下事件
        resize[i].onmousedown = function (e) {
          //颜色改变提醒
          // resize[i].style.background = '#c4c2c2';
          var startX = e.clientX;

          resize[i].left = resize[i].offsetLeft;
          // 鼠标拖动事件
          document.onmousemove = function (e) {
            var endX = e.clientX;
            var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度

            var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
            console.log(box[i].clientWidth, 22221,maxT, left[i].offsetWidth);
            if (moveLen < 200) moveLen = 200; // 左边区域的最小宽度为32px
            if (moveLen > maxT - 750) moveLen = maxT - 750; //右边区域最小宽度为150px

            resize[i].style.left = moveLen; // 设置左侧区域的宽度
            for (let j = 0; j < left.length; j++) {
              left[j].style.width = moveLen + 'px';
              mid[j].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
            }
            resize[i].style.left = moveLen + 'px'
          };
          // 鼠标松开事件
          document.onmouseup = function (evt) {
            //颜色恢复
            resize[i].style.background = '#d6d6d6';
            document.onmousemove = null;
            document.onmouseup = null;
            resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
          };
          resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
          return false;
        }
      }
    },
    /** 查询设备下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.equipOptions = response.data;
        this.dealClassList()
      })
    },
    dealClassList () {
      this.$nextTick(
        () => {
          if (this.currentEquipId === 1) {
            document.querySelector(".el-tree-node.is-expanded.is-focusable").classList.add('is-current')
          } else {
            document.querySelector(".el-tree-node.is-expanded.is-focusable").classList.remove('is-current')
          }
        }
      )
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击树节点时触发
    handleNodeClick(data){
      console.log(data);
      this.currentEquipId = data.id
      this.currentEquipName = data.label
      //获取当前点击的设备信息 如果点击的是设备 则显示设备台账
      this.questById(this.currentEquipId)
      this.dealClassList()
    },
    questById (id) {
      getEquip(id).then(response => {
        if(response.data.catalogType === '0'){
          this.isEquip = true
        }else{
          this.isEquip = false
        }
        this.equip = response.data
      })
    }

  }
}
</script>

<style lang="scss" scoped>

/deep/.el-tabs__item {
    padding: 0 20px;
    height: 35px;
    box-sizing: border-box;
    line-height: 35px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
}
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
.box {
  position: relative;
  width: 100%;
  margin: 1% 0px;
  display: flex;
}
/*左侧div样式*/
.left {
  width: 213;;
  // width: calc(20% - 7.5px); /*左侧初始化宽度*/
}
/*拖拽区div样式*/
// .resize {
//   cursor: col-resize;
//   position: absolute;
//   left: calc(20% - 135px);
//   top: 200px;
//   background-color: #d6d6d6;
//   border-radius: 5px;
//   margin-top: -10px;
//   width: 10px;
//   height: 50px;
//   font-size: 32px;
//   color: white;
//   z-index: 999;
// }
/*拖拽区鼠标悬停样式*/
// .resize:hover {
//   color: #696868;
// }
 .ivu-split-trigger-con {
    .ivu-split-trigger-vertical {
      width: 4px;
      height: 100%;
      background: #f8f8f9;
      border-top: none;
      border-bottom: none;
      cursor: col-resize;
    }
    .ivu-split-trigger {
      position: relative;
      border: 1px solid #dcdee2;
      .ivu-split-trigger-bar-con.vertical {
        left: 0;
        top: 50%;
        height: 32px;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
      }
      .ivu-split-trigger-bar-con {
        position: absolute;
        overflow: hidden;
        .ivu-split-trigger-bar {
          width: 3px;
          height: 1px;
          background: rgba(23,35,61,.25);
          float: left;
          margin-top: 3px;
        }
      }
    }
  }
/*右侧div'样式*/
.mid {
  flex: 1;
  //box-shadow: -1px 4px 5px 3px rgba(190, 189, 189, 0.11);
}

</style>
