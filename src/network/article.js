/*
  文章请求相关模块
*/

import request from './request';

/* 获取文章列表 */
export function getArticles(params) {
  return request({
    // url: '/app/v1_1/articles',
    url: '/v1_0/articles',
    params
  });
}

/* 获取文章详情 */
export function getArticleById(articleId) {
  return request({
    // url: `/app/v1_0/articles/${articleId}`
    url: `/v1_0/articles/${articleId}`
  });
}

/* 收藏文章 */
export function addCollect(articleId) {
  return request({
    // url: '/app/v1_0/article/collections',
    url: '/v1_0/article/collections',
    method: 'post',
    data: {
      target: articleId
    }
  });
}

/* 取消收藏文章 */
export function deleteCollect(articleId) {
  return request({
    // url: `/app/v1_0/article/collections/${articleId}`,
    url: `/v1_0/article/collections/${articleId}`,
    method: 'delete'
  });
}

/* 点赞文章 */
export function addLike(articleId) {
  return request({
    // url: '/app/v1_0/article/likings',
    url: '/v1_0/article/likings',
    method: 'post',
    data: {
      target: articleId
    }
  });
}

/* 取消点赞文章 */
export function deleteLike(articleId) {
  return request({
    // url: `/app/v1_0/article/likings/${articleId}`,
    url: `/v1_0/article/likings/${articleId}`,
    method: 'delete'
  });
}

/* 获取用户收藏文章列表 */
export const getUserCollect = params => {
  return request({
    method: 'GET',
    // url: '/app/v1_0/article/collections',
    url: '/v1_0/article/collections',
    params
  });
};
