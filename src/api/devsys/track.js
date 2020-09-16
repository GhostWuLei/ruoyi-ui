import request from '@/utils/request'

// 查询设备跟踪列表
export function listTrack(query) {
  return request({
    url: '/devsys/track/list',
    method: 'get',
    params: query
  })
}

// 查询设备跟踪详细
export function getTrack(trackId) {
  return request({
    url: '/devsys/track/' + trackId,
    method: 'get'
  })
}

// 新增设备跟踪
export function addTrack(data) {
  return request({
    url: '/devsys/track',
    method: 'post',
    data: data
  })
}

// 修改设备跟踪
export function updateTrack(data) {
  return request({
    url: '/devsys/track',
    method: 'put',
    data: data
  })
}

// 删除设备跟踪
export function delTrack(trackId) {
  return request({
    url: '/devsys/track/' + trackId,
    method: 'delete'
  })
}

// 导出设备跟踪
export function exportTrack(query) {
  return request({
    url: '/devsys/track/export',
    method: 'get',
    params: query
  })
}