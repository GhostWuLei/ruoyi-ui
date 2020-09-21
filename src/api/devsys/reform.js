import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'

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
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/reform/uploadFile',
    headers: {'Content-Type': 'multipart/form-data'},
    method: 'post',
    data: formData
  })
}
//下载文件
export const download = (reformId) => {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: '/devsys/material/download/'+reformId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'post'
  })
}
export function getEquip() {
  return request({
    url: '/devsys/reform/getEquip',
    method: 'get',
  })
}
