import request from '@/utils/request'

// 查询异动变更列表
export function listAlteration(query) {
  return request({
    url: '/devsys/alteration/list',
    method: 'get',
    params: query
  })
}

// 查询异动变更详细
export function getAlteration(alterationId) {
  return request({
    url: '/devsys/alteration/' + alterationId,
    method: 'get'
  })
}

// 新增异动变更
export function addAlteration(data) {
  return request({
    url: '/devsys/alteration',
    method: 'post',
    data: data
  })
}

// 修改异动变更
export function updateAlteration(data) {
  return request({
    url: '/devsys/alteration',
    method: 'put',
    data: data
  })
}

// 删除异动变更
export function delAlteration(alterationId) {
  return request({
    url: '/devsys/alteration/' + alterationId,
    method: 'delete'
  })
}

// 导出异动变更
export function exportAlteration(query) {
  return request({
    url: '/devsys/alteration/export',
    method: 'get',
    params: query
  })
}