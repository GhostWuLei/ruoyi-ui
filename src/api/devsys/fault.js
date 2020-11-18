import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

// 查询故障记录列表
export function listFault(query) {
  return request({
    url: '/devsys/fault/list',
    method: 'get',
    params: query
  })
}

// 查询故障记录详细
export function getFault(faultId) {
  return request({
    url: '/devsys/fault/' + faultId,
    method: 'get'
  })
}

// 新增故障记录
export function addFault(data) {
  return request({
    url: '/devsys/fault',
    method: 'post',
    data: data
  })
}

// 修改故障记录
export function updateFault(data) {
  return request({
    url: '/devsys/fault',
    method: 'put',
    data: data
  })
}

// 删除故障记录
export function delFault(faultId) {
  return request({
    url: '/devsys/fault/' + faultId,
    method: 'delete'
  })
}

// 导出故障记录
export function exportFault(query) {
  return request({
    url: '/devsys/fault/export',
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
    url: '/devsys/fault/download/'+spareId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'get'
  })
}

//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/fault/uploadFile',
    method: 'post',
    data: formData
  })
}

// 获取上传文件显示
export function showUploadFile(id) {
  return request({
    url: '/devsys/fault/obtainFile/' + id,
    method: 'get'
  })
}
// 移除上传文件
export function removeUpdated(FileId) {
  return request({
    url: '/devsys/fault/delFile/' + FileId,
    method: 'delete',
    // params: id-0
  })
}