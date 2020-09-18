import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
// 查询技术资料列表
export function listMaterial(query) {
  return request({
    url: '/devsys/material/list',
    method: 'get',
    params: query
  })
}

// 查询技术资料详细
export function getMaterial(materialId) {
  return request({
    url: '/devsys/material/' + materialId,
    method: 'get'
  })
}

// 新增技术资料
export function addMaterial(data) {
  return request({
    url: '/devsys/material',
    method: 'post',
    data: data
  })
}

// 修改技术资料
export function updateMaterial(data) {
  return request({
    url: '/devsys/material',
    method: 'put',
    data: data
  })
}

// 删除技术资料
export function delMaterial(materialId) {
  return request({
    url: '/devsys/material/' + materialId,
    method: 'delete'
  })
}

// 导出技术资料
export function exportMaterial(query) {
  return request({
    url: '/devsys/material/export',
    method: 'get',
    params: query
  })
}
//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/material/uploadFile',
    headers: {'Content-Type': 'multipart/form-data'},
    method: 'post',
    data: formData
  })
}
//下载文件
export const download = (materialId) => {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: '/devsys/material/download/'+materialId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'post'
  })
}

