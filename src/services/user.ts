import { request } from '@/utils/request'
import type { User, CodeType, Code, UserInfo } from '@/types/user'

export const loginByPassword = (mobile: string, password: string) => {
  return request<User>('/login/password', 'POST', {
    mobile,
    password
  })
}
// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request<Code>('/code', 'GET', { mobile, type })

// 短信登录
export const loginByCode = (mobile: string, code: string) =>
  request<User>('/login', 'POST', { mobile, code })

// ... 省略 ...

// 获取个人信息
export const getUserInfo = () => request<UserInfo>('/patient/myUser')
