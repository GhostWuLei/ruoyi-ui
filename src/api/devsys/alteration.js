import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

// 查询设备变更列表
export function listAlteration(query) {
  return request({
    url: '/devsys/alteration/list',
    method: 'get',
    params: query
  })
}

// 查询设备变更详细
export function getAlteration(alterationId) {
  return request({
    url: '/devsys/alteration/' + alterationId,
    method: 'get'
  })
}

// 新增设备变更
export function addAlteration(data) {
  return request({
    url: '/devsys/alteration',
    method: 'post',
    data: data
  })
}

// 修改设备变更
export function updateAlteration(data) {
  return request({
    url: '/devsys/alteration',
    method: 'put',
    data: data
  })
}

// 删除设备变更
export function delAlteration(alterationId) {
  return request({
    url: '/devsys/alteration/' + alterationId,
    method: 'delete'
  })
}

// 导出设备变更
export function exportAlteration(query) {
  return request({
    url: '/devsys/alteration/export',
    method: 'get',
    params: query
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
 export const download = (spareId) => {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: '/devsys/alteration/download/'+spareId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'get'
  })
}

//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/alteration/uploadFile',
    method: 'post',
    data: formData
  })
}

// 获取上传文件显示
export function showUploadFile(id) {
  return request({
    url: '/devsys/alteration/obtainFile/' + id,
    method: 'get'
  })
}
// 移除上传文件
export function removeUpdated(FileId) {
  return request({
    url: '/devsys/alteration/delFile/' + FileId,
    method: 'delete',
    // params: id-0
  })
}