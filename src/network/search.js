// 搜索请求相关模块

import request from './request';

/* 获取联想建议 */
export function getSearchSuggestions(q) {
  return request({
    // url: '/app/v1_0/suggestion',
    url: '/v1_0/suggestion',
    params: {
      q // 联想建议关键词
    }
  });
}

/* 获取搜索结果 */
export function getSearchResults(params) {
  return request({
    // url: '/app/v1_0/search',
    url: '/v1_0/search',
    params
  });
}

/* 获取搜索历史 */
export function getSearchHistories() {
  return request({
    // url: '/app/v1_0/search/histories'
    url: '/v1_0/search/histories'
  });
}

/* 删除用户搜索历史 */
export const deleteUserHistory = () => {
  return request({
    // url: '/app/v1_0/search/histories',
    url: '/v1_0/search/histories',
    method: 'delete'
  });
};
