/*
文章评论相关请求模块
*/

import request from './request';

/* 获取评论列表 */
export function getComments(params) {
  return request({
    url: '/app/v1_0/comments',
    params
  });
}

/* 对评论或评论回复点赞 */
export function addCommentLike(commentId) {
  return request({
    url: '/app/v1_0/comment/likings',
    method: 'post',
    data: {
      target: commentId
    }
  });
}

/* 取消对评论或评论回复点赞 */
export function deleteCommentLike(commentId) {
  return request({
    url: `/app/v1_0/comment/likings/${commentId}`,
    method: 'delete'
  });
}

/* 添加评论或评论回复 */
export function addComment(data) {
  return request({
    url: '/app/v1_0/comments',
    method: 'post',
    data
  });
}
