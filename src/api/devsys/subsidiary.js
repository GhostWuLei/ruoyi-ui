import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

// 查询附属设备明细列表
export function listSubsidiary(query) {
  return request({
    url: '/devsys/subsidiary/list',
    method: 'get',
    params: query
  })
}

// 查询附属设备明细详细
export function getSubsidiary(subsidiaryId) {
  return request({
    url: '/devsys/subsidiary/' + subsidiaryId,
    method: 'get'
  })
}

// 新增附属设备明细
export function addSubsidiary(data) {
  return request({
    url: '/devsys/subsidiary',
    method: 'post',
    data: data
  })
}

// 修改附属设备明细
export function updateSubsidiary(data) {
  return request({
    url: '/devsys/subsidiary',
    method: 'put',
    data: data
  })
}

// 删除附属设备明细
export function delSubsidiary(subsidiaryId) {
  return request({
    url: '/devsys/subsidiary/' + subsidiaryId,
    method: 'delete'
  })
}

// 导出附属设备明细
export function exportSubsidiary(query) {
  return request({
    url: '/devsys/subsidiary/export',
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
    url: '/devsys/subsidiary/download/'+spareId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'get'
  })
}

//上传文件
export function uploadAnnx(formData) {
  return request({
    url: '/devsys/subsidiary/uploadFile',
    method: 'post',
    data: formData
  })
}

// 获取上传文件显示
export function showUploadFile(id) {
  return request({
    url: '/devsys/subsidiary/obtainFile/' + id,
    method: 'get'
  })
}
// 移除上传文件
export function removeUpdated(FileId) {
  return request({
    url: '/devsys/subsidiary/delFile/' + FileId,
    method: 'delete',
    // params: id-0
  })
}
