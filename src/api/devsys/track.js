import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'

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
//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/track/uploadFile',
    headers: {'Content-Type': 'multipart/form-data'},
    method: 'post',
    data: formData
  })
}
export const download = (trackId) => {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: '/devsys/track/download/'+trackId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'post'
  })
}
