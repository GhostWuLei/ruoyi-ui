import request from '@/utils/request'

// 查询产品列表
export function listProduct(query) {
  return request({
    url: '/stutestsys/product/list',
    method: 'get',
    params: query
  })
}

// 查询产品详细
export function getProduct(productId) {
  return request({
    url: '/stutestsys/product/' + productId,
    method: 'get'
  })
}

// 新增产品
export function addProduct(data) {
  return request({
    url: '/stutestsys/product',
    method: 'post',
    data: data
  })
}

// 修改产品
export function updateProduct(data) {
  return request({
    url: '/stutestsys/product',
    method: 'put',
    data: data
  })
}

// 删除产品
export function delProduct(productId) {
  return request({
    url: '/stutestsys/product/' + productId,
    method: 'delete'
  })
}

// 导出产品
export function exportProduct(query) {
  return request({
    url: '/stutestsys/product/export',
    method: 'get',
    params: query
  })
}