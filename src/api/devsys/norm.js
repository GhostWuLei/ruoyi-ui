import request from '@/utils/request'

// 查询设备规范列表
export function listNorm(query) {
  return request({
    url: '/devsys/norm/list',
    method: 'get',
    params: query
  })
}

// 查询设备规范详细
export function getNorm(normId) {
  return request({
    url: '/devsys/norm/' + normId,
    method: 'get'
  })
}

// 新增设备规范
export function addNorm(data) {
  return request({
    url: '/devsys/norm',
    method: 'post',
    data: data
  })
}

// 修改设备规范
export function updateNorm(data) {
  return request({
    url: '/devsys/norm',
    method: 'put',
    data: data
  })
}

// 删除设备规范
export function delNorm(normId) {
  return request({
    url: '/devsys/norm/' + normId,
    method: 'delete'
  })
}

// 导出设备规范
export function exportNorm(query) {
  return request({
    url: '/devsys/norm/export',
    method: 'get',
    params: query
  })
}