import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'

// 查询设备规范列表
export function listNorm(query) {
  return request({
    url: '/devsys/norm/list',
    method: 'get',
    params: query
  })
}

// 查询设备规范详细
export function getNorm(normId) {
  return request({
    url: '/devsys/norm/' + normId,
    method: 'get'
  })
}

// 新增设备规范
export function addNorm(data) {
  return request({
    url: '/devsys/norm',
    method: 'post',
    data: data
  })
}

// 修改设备规范
export function updateNorm(data) {
  return request({
    url: '/devsys/norm',
    method: 'put',
    data: data
  })
}

// 删除设备规范
export function delNorm(normId) {
  return request({
    url: '/devsys/norm/' + normId,
    method: 'delete'
  })
}

// 导出设备规范
export function exportNorm(query) {
  return request({
    url: '/devsys/norm/export',
    method: 'get',
    params: query
  })
}

//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/norm/uploadFile',
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
 export const download = (normId) => {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: '/devsys/norm/download/'+normId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'post'
  })
}