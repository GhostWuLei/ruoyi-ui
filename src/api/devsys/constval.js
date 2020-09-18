import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'

// 查询设备定值列表
export function listConstval(query) {
  return request({
    url: '/devsys/constval/list',
    method: 'get',
    params: query
  })
}

// 查询设备定值详细
export function getConstval(constvalId) {
  return request({
    url: '/devsys/constval/' + constvalId,
    method: 'get'
  })
}

// 新增设备定值
export function addConstval(data) {
  return request({
    url: '/devsys/constval',
    method: 'post',
    data: data
  })
}

// 修改设备定值
export function updateConstval(data) {
  return request({
    url: '/devsys/constval',
    method: 'put',
    data: data
  })
}

// 删除设备定值
export function delConstval(constvalId) {
  return request({
    url: '/devsys/constval/' + constvalId,
    method: 'delete'
  })
}

// 导出设备定值
export function exportConstval(query) {
  return request({
    url: '/devsys/constval/export',
    method: 'get',
    params: query
  })
}
//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/constval/uploadFile',
    headers: {'Content-Type': 'multipart/form-data'},
    method: 'post',
    data: formData
  })
}
export const download = (materialId) => {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: '/devsys/constval/download/'+materialId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'post'
  })
}
