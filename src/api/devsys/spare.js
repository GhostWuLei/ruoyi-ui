import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

// 查询备品备件列表
export function listSpare(query) {
  return request({
    url: '/devsys/spare/list',
    method: 'get',
    params: query
  })
}

// 查询备品备件详细
export function getSpare(spareId) {
  return request({
    url: '/devsys/spare/' + spareId,
    method: 'get'
  })
}

// 新增备品备件
export function addSpare(data) {
  return request({
    url: '/devsys/spare',
    method: 'post',
    data: data
  })
}

// 修改备品备件
export function updateSpare(data) {
  return request({
    url: '/devsys/spare',
    method: 'put',
    data: data
  })
}

// 删除备品备件
export function delSpare(spareId) {
  return request({
    url: '/devsys/spare/' + spareId,
    method: 'delete'
  })
}

// 导出备品备件
export function exportSpare(query) {
  return request({
    url: '/devsys/spare/export',
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
    url: '/devsys/spare/download/'+spareId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'get'
  })
}

//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/spare/uploadFile',
    method: 'post',
    data: formData
  })
}

// 获取上传文件显示
export function showUploadFile(id) {
  return request({
    url: '/devsys/spare/obtainFile/' + id,
    method: 'get'
  })
}
// 移除上传文件
export function removeUpdated(FileId) {
  return request({
    url: '/devsys/spare/delFile/' + FileId,
    method: 'delete',
    // params: id-0
  })
}
// 下载文件
// export function newUpdateFile(fileId) {
//   return request({
//     url: '/devsys/spare/download',
//     method: 'post',
//     fileId
//   })
// }


