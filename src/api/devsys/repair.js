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

//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/repair/uploadFile',
    headers: {'Content-Type': 'multipart/form-data'},
    method: 'post',
    data: formData
  })
}

/**
 * 封装axios请求
 * @param url 请求地址
 * @param data 请求参数
 * @package fileName 下载的文件名称
 * @param errorMsg 错误提示
 * @param callback 成功调用回调处理
 */

 // config.headers['Authorization'] = 'Bearer ' + getToken()
 export const download = (repairId) => {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: '/devsys/repair/download/'+repairId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'post'
  })
}
