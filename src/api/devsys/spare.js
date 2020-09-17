import request from '@/utils/request'

// 查询备品备件列表
export function listSpare(query) {
  return request({
    url: '/devsys/spare/list',
    method: 'get',
    params: query
  })
}

// 查询备品备件详细
export function getSpare(spareId) {
  return request({
    url: '/devsys/spare/' + spareId,
    method: 'get'
  })
}

// 新增备品备件
export function addSpare(data) {
  return request({
    url: '/devsys/spare',
    method: 'post',
    data: data
  })
}

// 修改备品备件
export function updateSpare(data) {
  return request({
    url: '/devsys/spare',
    method: 'put',
    data: data
  })
}

// 删除备品备件
export function delSpare(spareId) {
  return request({
    url: '/devsys/spare/' + spareId,
    method: 'delete'
  })
}

// 导出备品备件
export function exportSpare(query) {
  return request({
    url: '/devsys/spare/export',
    method: 'get',
    params: query
  })
}

//上传文件
export function uploadAnnx(formData) {
  // axios.post('http://localhost:8080/upload/file', formData)
  return request({
    url: '/devsys/spare/uploadFile',
    headers: {'Content-Type': 'multipart/form-data'},
    method: 'post',
    data: formData
  })
}
