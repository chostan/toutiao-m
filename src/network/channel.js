// 频道相关请求模块
import request from './request';

/* 获取所用频道列表 */
export function getAllChannels() {
  return request({
    // url: '/app/v1_0/channels'
    url: '/v1_0/channels'
  });
}

/* 增加用户频道 */
export function addUserChannel(data) {
  return request({
    // url: '/app/v1_0/user/channels',
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data
  });
}

/* 删除用户指定频道 */
export function deleteUserChannel(channelId) {
  return request({
    // url: `/app/v1_0/user/channels/${channelId}`,
    url: `/v1_0/user/channels/${channelId}`,
    method: 'delete'
  });
}
