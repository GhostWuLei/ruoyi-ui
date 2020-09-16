import request from '@/utils/request'

// 查询重大技改列表
export function listReform(query) {
  return request({
    url: '/devsys/reform/list',
    method: 'get',
    params: query
  })
}

// 查询重大技改详细
export function getReform(reformId) {
  return request({
    url: '/devsys/reform/' + reformId,
    method: 'get'
  })
}

// 新增重大技改
export function addReform(data) {
  return request({
    url: '/devsys/reform',
    method: 'post',
    data: data
  })
}

// 修改重大技改
export function updateReform(data) {
  return request({
    url: '/devsys/reform',
    method: 'put',
    data: data
  })
}

// 删除重大技改
export function delReform(reformId) {
  return request({
    url: '/devsys/reform/' + reformId,
    method: 'delete'
  })
}

// 导出重大技改
export function exportReform(query) {
  return request({
    url: '/devsys/reform/export',
    method: 'get',
    params: query
  })
}