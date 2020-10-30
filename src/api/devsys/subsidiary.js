import request from '@/utils/request'

// 查询附属设备明细列表
export function listSubsidiary(query) {
  return request({
    url: '/devsys/subsidiary/list',
    method: 'get',
    params: query
  })
}

// 查询附属设备明细详细
export function getSubsidiary(subsidiaryId) {
  return request({
    url: '/devsys/subsidiary/' + subsidiaryId,
    method: 'get'
  })
}

// 新增附属设备明细
export function addSubsidiary(data) {
  return request({
    url: '/devsys/subsidiary',
    method: 'post',
    data: data
  })
}

// 修改附属设备明细
export function updateSubsidiary(data) {
  return request({
    url: '/devsys/subsidiary',
    method: 'put',
    data: data
  })
}

// 删除附属设备明细
export function delSubsidiary(subsidiaryId) {
  return request({
    url: '/devsys/subsidiary/' + subsidiaryId,
    method: 'delete'
  })
}

// 导出附属设备明细
export function exportSubsidiary(query) {
  return request({
    url: '/devsys/subsidiary/export',
    method: 'get',
    params: query
  })
}