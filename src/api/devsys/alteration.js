import request from '@/utils/request'

// 查询设备变更列表
export function listAlteration(query) {
  return request({
    url: '/devsys/alteration/list',
    method: 'get',
    params: query
  })
}

// 查询设备变更详细
export function getAlteration(alterationId) {
  return request({
    url: '/devsys/alteration/' + alterationId,
    method: 'get'
  })
}

// 新增设备变更
export function addAlteration(data) {
  return request({
    url: '/devsys/alteration',
    method: 'post',
    data: data
  })
}

// 修改设备变更
export function updateAlteration(data) {
  return request({
    url: '/devsys/alteration',
    method: 'put',
    data: data
  })
}

// 删除设备变更
export function delAlteration(alterationId) {
  return request({
    url: '/devsys/alteration/' + alterationId,
    method: 'delete'
  })
}

// 导出设备变更
export function exportAlteration(query) {
  return request({
    url: '/devsys/alteration/export',
    method: 'get',
    params: query
  })
}