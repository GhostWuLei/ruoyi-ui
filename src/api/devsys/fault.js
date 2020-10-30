import request from '@/utils/request'

// 查询故障记录列表
export function listFault(query) {
  return request({
    url: '/devsys/fault/list',
    method: 'get',
    params: query
  })
}

// 查询故障记录详细
export function getFault(faultId) {
  return request({
    url: '/devsys/fault/' + faultId,
    method: 'get'
  })
}

// 新增故障记录
export function addFault(data) {
  return request({
    url: '/devsys/fault',
    method: 'post',
    data: data
  })
}

// 修改故障记录
export function updateFault(data) {
  return request({
    url: '/devsys/fault',
    method: 'put',
    data: data
  })
}

// 删除故障记录
export function delFault(faultId) {
  return request({
    url: '/devsys/fault/' + faultId,
    method: 'delete'
  })
}

// 导出故障记录
export function exportFault(query) {
  return request({
    url: '/devsys/fault/export',
    method: 'get',
    params: query
  })
}