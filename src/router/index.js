import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        // component: () => import('@/views/redirect')
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    // component: () => import('@/views/login'),
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    // component: () => import('@/views/error/404'),
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    // component: () => import('@/views/error/401'),
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        // component: () => import('@/views/index'), // 相当于去执行函数去加载这个组件
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        // component: () => import('@/views/system/user/profile/index'),
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        // component: () => import('@/views/system/dict/data'),
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        // component: () => import('@/views/monitor/job/log'),
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit',
        // component: () => import('@/views/tool/gen/editTable'),
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'information/index/:equipId(\\d+)',
        // component: () => import('@/views/devsys/norm/index'),
        component: (resolve) => require(['@/views/devsys/information/index'], resolve),
        name: 'Information',
        meta: { title: '设备信息', icon: '' }
      },
      {
        path: 'repair/index/:equipId(\\d+)',
        // component: () => import('@/views/devsys/repair/index'),
        component: (resolve) => require(['@/views/devsys/repair/index'], resolve),
        name: 'Repair',
        meta: { title: '检修记录', icon: '' }
      },
      {
        path: 'fault/index/:equipId(\\d+)',
        // component: () => import('@/views/devsys/repair/index'),
        component: (resolve) => require(['@/views/devsys/fault/index'], resolve),
        name: 'Fault',
        meta: { title: '故障记录', icon: '' }
      },
      {
        path: 'alteration/index/:equipId(\\d+)',
        // component: () => import('@/views/devsys/repair/index'),
        component: (resolve) => require(['@/views/devsys/alteration/index'], resolve),
        name: 'Alteration',
        meta: { title: '异动变更', icon: '' }
      },
      {
        path: 'subsidiary/index/:equipId(\\d+)',
        // component: () => import('@/views/devsys/repair/index'),
        component: (resolve) => require(['@/views/devsys/subsidiary/index'], resolve),
        name: 'Subsidiary',
        meta: { title: '附属设备明细', icon: '' }
      },
      {
        path: 'spare/index/:equipId(\\d+)',
        // component: () => import('@/views/devsys/spare/index'),
        component: (resolve) => require(['@/views/devsys/spare/index'], resolve),
        name: 'Spare',
        meta: { title: '备品备件', icon: '' }
      }
      // {
      //   path: 'material/index/:equipId(\\d+)',
      //   // component: () => import('@/views/devsys/material/index'),
      //   component: (resolve) => require(['@/views/devsys/material/index'], resolve),
      //   name: 'Material',
      //   meta: { title: '技术资料', icon: '' }
      // },
      // {
      //   path: 'constval/index/:equipId(\\d+)',
      //   // component: () => import('@/views/devsys/constval/index'),
      //   component: (resolve) => require(['@/views/devsys/constval/index'], resolve),
      //   name: 'Constval',
      //   meta: { title: '设备定值', icon: '' }
      // },
      
      // {
      //   path: 'track/index/:equipId(\\d+)',
      //   // component: () => import('@/views/devsys/track/index'),
      //   component: (resolve) => require(['@/views/devsys/track/index'], resolve),
      //   name: 'Track',
      //   meta: { title: '设备跟踪', icon: '' }
      // },
      // {
      //   path: 'alteration/index/:equipId(\\d+)',
      //   // component: () => import('@/views/devsys/alteration/index'),
      //   component: (resolve) => require(['@/views/devsys/alteration/index'], resolve),
      //   name: 'Alteration',
      //   meta: { title: '异动变更', icon: '' }
      // },
      // {
      //   path: 'reform/index/:equipId(\\d+)',
      //   // component: () => import('@/views/devsys/reform/index'),
      //   component: (resolve) => require(['@/views/devsys/reform/index'], resolve),
      //   name: 'Reform',
      //   meta: { title: '重大技改', icon: '' }
      // }
    ]
  }
  // {
  //   path: '/account',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'material/index/:equipId(\\d+)',
  //       component: () => import('@/views/devsys/material/index'),
  //       name: 'Material',
  //       meta: { title: '技术资料', icon: '' }
  //     }
  //   ]
  // }
]

export default new Router({
  mode: 'history', // 去掉url中的# 去掉锚点
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
