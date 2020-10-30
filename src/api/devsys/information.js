import request from '@/utils/request'

// 查询设备信息列表
export function listInformation(query) {
  return request({
    url: '/devsys/information/list',
    method: 'get',
    params: query
  })
}

// 查询设备信息详细
export function getInformation(informationId) {
  return request({
    url: '/devsys/information/' + informationId,
    method: 'get'
  })
}

// 新增设备信息
export function addInformation(data) {
  return request({
    url: '/devsys/information',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateInformation(data) {
  return request({
    url: '/devsys/information',
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delInformation(informationId) {
  return request({
    url: '/devsys/information/' + informationId,
    method: 'delete'
  })
}

// 导出设备信息
export function exportInformation(query) {
  return request({
    url: '/devsys/information/export',
    method: 'get',
    params: query
  })
}