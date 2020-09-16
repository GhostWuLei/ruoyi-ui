import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'


// 查询设备下拉树结构
export function treeselect() {
  return request({
    url: '/picsys/diagram/treeselect',
    method: 'get'
  })
}

// 新增
export function addDiagrams(data) {
  return request({
    url: '/picsys/diagram',
    method: 'post',
    data: data
  })
}

// 修改
export function updateDiagrams(data) {
  return request({
    url: '/picsys/diagram/edit',
    method: 'post',
    data: data
  })
}

// 删除设备
export function delDiagrams(id) {
  return request({
    url: '/picsys/diagram/' + id,
    method: 'delete'
  })
}

// 点击通过id获取修改信息 
export function getPicDiagrams(id) {
  return request({
    url: '/picsys/diagram/' + id,
    method: 'get'
  })
}

// 下载图片接口
export function uploadPicDiagrams(id) {
  return request({
    url: '/picsys/diagram/download/' + id,
    method: 'get'
  })
}

// 上传图片  
export function uploadPic(data) {
  return request({
    url: '/picsys/diagram/uploadFile/',
    method: 'post',
    data: data
  })
}
// 通过id 获取图片信息
export function getinfo(id) {
  return request({
    url: '/picsys/diagram/' + id,
    method: 'get'
  })
}
// 获取所有的系统图信息 非目录
export function getAllDiagrams() {
    return request({
      url: '/picsys/diagram/getAllDiagrams',
      method: 'get'
    })
  }
// 由名称获取id
export function getNodeIdByDiagramName(diagramName) {
    // console.log(diagramName,232323)
    diagramName = diagramName.replace(/#/g, '%23');
    console.log(diagramName,555555)
    return request({
      url: "/picsys/diagram/getNodeIdByDiagramName/"+diagramName,
      method: 'get'
    })
  }

// export function getPicture(nodeId) {
//   return request({
//     url: '/picsys/diagram/download/'+nodeId,
//     method: 'post',
//     responseType: 'blob'
//   })
// }

/**
 * 封装axios请求
 * @param url 请求地址
 * @param data 请求参数
 * @package fileName 下载的文件名称
 * @param errorMsg 错误提示
 * @param callback 成功调用回调处理
 */

 // config.headers['Authorization'] = 'Bearer ' + getToken()
export const getDwfPicture = (nodeId) => {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: '/picsys/diagram/download/'+nodeId,
    headers: {'Content-Type': 'application/json;charset=UTF-8', Authorization: 'Bearer ' + getToken()},
    responseType: 'blob',  //responseType: 'arraybuffer'，
    method: 'post'
  })
}