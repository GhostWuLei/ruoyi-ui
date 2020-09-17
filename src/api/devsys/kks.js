import request from '@/utils/request'

// 查询kks编码列表
export function listKks(query) {
  return request({
    url: '/devsys/kks/list',
    method: 'get',
    params: query
  })
}

// 查询kks编码树
export function listTreeKks(query) {
  return request({
    url: '/devsys/kks/kksTree',
    method: 'get',
    params: query
  })
}

// 查询kks编码详细
export function getKks(kksId) {
  return request({
    url: '/devsys/kks/' + kksId,
    method: 'get'
  })
}

// 新增kks编码
export function addKks(data) {
  return request({
    url: '/devsys/kks',
    method: 'post',
    data: data
  })
}

// 修改kks编码
export function updateKks(data) {
  return request({
    url: '/devsys/kks',
    method: 'put',
    data: data
  })
}

// 删除kks编码
export function delKks(kksId) {
  return request({
    url: '/devsys/kks/' + kksId,
    method: 'delete'
  })
}

// 导出kks编码
export function exportKks(query) {
  return request({
    url: '/devsys/kks/export',
    method: 'get',
    params: query
  })
}

// 下载kks编码导入模板
export function importTemplate() {
  return request({
    url: '/devsys/kks/importTemplate',
    method: 'get'
  })
}

// 获取根节点
export function getRoots() {
  return request({
    url: '/devsys/kks/getRoots',
    method: 'get'
  })
}

// 根据id获取下一级
export function getChildrenById(id) {
  return request({
    url: '/devsys/kks/getChildrenById/'+id,
    method: 'get'
  })
}

// 获取treeselect的根节点数据
export function getTreeRoots() {
  return request({
    url: '/devsys/kks/getTreeRoots',
    method: 'get'
  })
}

// 获取treeselect懒加载数据
export function getTreeByParentKks(parentKks) {
  return request({
    url: '/devsys/kks/getTreeByParentKks/'+parentKks,
    method: 'get'
  })
}

// 查询修改的kks编码 并返回
export function getUpdateInfo(kksId) {
  return request({
    url: '/devsys/kks/getUpdateInfo/' + kksId,
    method: 'get'
  })
}

// 获取子节点列表
export function getByParentKks(parentKks) {
  return request({
    url: '/devsys/kks/getByParentKks/'+parentKks,
    method: 'get'
  })
}
