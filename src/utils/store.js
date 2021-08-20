/* 
本地存储封装模块
*/

export function getItem(name) {
  const data = window.localStorage.getItem(name)
  try {
    return JSON.parse(data)
  } catch (err) {
    // data不是JSON格式字符串，直接原样返回
    return data
  }
}

export function setItem(name, value) {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export function removeItem(name) {
  return window.localStorage.removeItem(name)
}