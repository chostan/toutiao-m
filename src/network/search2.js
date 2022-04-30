import request2 from './request2';

/* 获取联想建议 */
export function getSearchSuggestions2(q) {
  return request2({
    url: '/app/v1_0/suggestion',
    params: {
      q // 联想建议关键词
    }
  });
}
