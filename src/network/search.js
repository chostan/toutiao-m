// 搜索请求相关模块

import request from './request'

/* 获取联想建议 */
export function getSearchSuggestions(q) {
  return request({
    url: '/app/v1_0/suggestion',
    params: {
      q // 联想建议关键词
    }
  })
}

/* 获取搜索结果 */
export function getSearchResults(params) {
  return request({
    url: '/app/v1_0/search',
    params
  })
}

/* 获取搜索结果 */
export function getSearchHistories() {
  return request({
    url: '/app/v1_0/search/histories',

  })
}