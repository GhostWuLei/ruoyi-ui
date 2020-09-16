import request from '@/utils/request'

// 查询设备列表
export function listEquip(query) {
  return request({
    url: '/devsys/equip/list',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getEquip(equipId) {
  return request({
    url: '/devsys/equip/' + equipId,
    method: 'get'
  })
}

// 新增设备
export function addEquip(data) {
  return request({
    url: '/devsys/equip',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateEquip(data) {
  return request({
    url: '/devsys/equip',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delEquip(equipId) {
  return request({
    url: '/devsys/equip/' + equipId,
    method: 'delete'
  })
}

// 导出设备
export function exportEquip(query) {
  return request({
    url: '/devsys/equip/export',
    method: 'get',
    params: query
  })
}

// 查询设备下拉树结构
export function treeselect() {
  return request({
    url: '/devsys/equip/treeselect',
    method: 'get'
  })
}