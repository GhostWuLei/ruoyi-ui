import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

// 查询设备信息列表
export function listInformation(query) {
  return request({
    url: '/devsys/information/list',
    method: 'get',
    params: query
  })
}

// 查询设备信息详细
export function getInformation(informationId) {
  return request({
    url: '/devsys/information/' + informationId,
    method: 'get'
  })
}

// 新增设备信息
export function addInformation(data) {
  return request({
    url: '/devsys/information',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateInformation(data) {
  return request({
    url: '/devsys/information',
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delInformation(informationId) {
  return request({
    url: '/devsys/information/' + informationId,
    method: 'delete'
  })
}

// 导出设备信息
export function exportInformation(query) {
  return request({
    url: '/devsys/information/export',
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
    url: '/devsys/information/download/'+spareId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'get'
  })
}

//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/information/uploadFile',
    method: 'post',
    data: formData
  })
}

// 获取上传文件显示
export function showUploadFile(id) {
  return request({
    url: '/devsys/information/obtainFile/' + id,
    method: 'get'
  })
}
// 移除上传文件
export function removeUpdated(FileId) {
  return request({
    url: '/devsys/information/delFile/' + FileId,
    method: 'delete',
    // params: id-0
  })
}
