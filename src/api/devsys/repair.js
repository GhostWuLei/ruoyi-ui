import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'

// 查询检修记录列表
export function listRepair(query) {
  return request({
    url: '/devsys/repair/list',
    method: 'get',
    params: query
  })
}

// 查询检修记录详细
export function getRepair(repairId) {
  return request({
    url: '/devsys/repair/' + repairId,
    method: 'get'
  })
}

// 新增检修记录
export function addRepair(data) {
  return request({
    url: '/devsys/repair',
    method: 'post',
    data: data
  })
}

// 修改检修记录
export function updateRepair(data) {
  return request({
    url: '/devsys/repair',
    method: 'put',
    data: data
  })
}

// 删除检修记录
export function delRepair(repairId) {
  return request({
    url: '/devsys/repair/' + repairId,
    method: 'delete'
  })
}

// 导出检修记录
export function exportRepair(query) {
  return request({
    url: '/devsys/repair/export',
    method: 'get',
    params: query
  })
}