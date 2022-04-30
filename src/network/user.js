// 用户相关请求方法

import request from './request';

// 在非组件模块中获取store必须通过这种方式
// import store from '@/store/index'

/*
 *登录/注册
 */
export function login(data) {
  return request({
    method: 'post',
    // url: '/app/v1_0/authorizations',
    url: '/v1_0/authorizations',
    data
  });
}

/**
 *发送验证码
 */
export function sendSms(mobile) {
  return request({
    // url: `/app/v1_0/sms/codes/${mobile}`
    url: `/v1_0/sms/codes/${mobile}`
  });
}

/**
 *获取登录用户信息
 */
export function getCurrentUser() {
  return request({
    // url: '/app/v1_0/user'
    url: '/v1_0/user'
  });
}

/**
 *获取登录用户频道列表
 */
export function getUserChannels() {
  return request({
    // url: '/app/v1_0/user/channels'
    url: '/v1_0/user/channels'
  });
}

/**
 *关注用户
 */
export function addFollow(userId) {
  return request({
    // url: '/app/v1_0/user/followings',
    url: '/v1_0/user/followings',
    method: 'post',
    data: {
      target: userId
    }
  });
}

/**
 *取消关注用户
 */
export function deleteFollow(userId) {
  return request({
    // url: `/app/v1_0/user/followings/${userId}`,
    url: `/v1_0/user/followings/${userId}`,
    method: 'delete'
  });
}

/**
 *获取用户个人资料
 */
export function getUserProfile() {
  return request({
    // url: '/app/v1_0/user/profile'
    url: '/v1_0/user/profile'
  });
}

/**
 *修改用户个人资料
 */
export function updateUserProfile(data) {
  return request({
    // url: '/app/v1_0/user/profile',
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data
  });
}

/**
 *修改用户照片资料（头像、身份证照片
 */
export function updateUserPhoto(data) {
  return request({
    // url: '/app/v1_0/user/photo',
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data
  });
}
