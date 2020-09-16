import request from '@/utils/request'

// 查询技术资料列表
export function listMaterial(query) {
  return request({
    url: '/devsys/material/list',
    method: 'get',
    params: query
  })
}

// 查询技术资料详细
export function getMaterial(materialId) {
  return request({
    url: '/devsys/material/' + materialId,
    method: 'get'
  })
}

// 新增技术资料
export function addMaterial(data) {
  return request({
    url: '/devsys/material',
    method: 'post',
    data: data
  })
}

// 修改技术资料
export function updateMaterial(data) {
  return request({
    url: '/devsys/material',
    method: 'put',
    data: data
  })
}

// 删除技术资料
export function delMaterial(materialId) {
  return request({
    url: '/devsys/material/' + materialId,
    method: 'delete'
  })
}

// 导出技术资料
export function exportMaterial(query) {
  return request({
    url: '/devsys/material/export',
    method: 'get',
    params: query
  })
}