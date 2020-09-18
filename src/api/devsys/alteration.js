import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'

// 查询异动变更列表
export function listAlteration(query) {
  return request({
    url: '/devsys/alteration/list',
    method: 'get',
    params: query
  })
}

// 查询异动变更详细
export function getAlteration(alterationId) {
  return request({
    url: '/devsys/alteration/' + alterationId,
    method: 'get'
  })
}

// 新增异动变更
export function addAlteration(data) {
  return request({
    url: '/devsys/alteration',
    method: 'post',
    data: data
  })
}

// 修改异动变更
export function updateAlteration(data) {
  return request({
    url: '/devsys/alteration',
    method: 'put',
    data: data
  })
}

// 删除异动变更
export function delAlteration(alterationId) {
  return request({
    url: '/devsys/alteration/' + alterationId,
    method: 'delete'
  })
}

// 导出异动变更
export function exportAlteration(query) {
  return request({
    url: '/devsys/alteration/export',
    method: 'get',
    params: query
  })
}

//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/alteration/uploadFile',
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
 export const download = (alterationId) => {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: '/devsys/alteration/download/'+alterationId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'post'
  })
}
