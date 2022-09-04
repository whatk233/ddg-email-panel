import { UserInfo } from '../types'

export function getAccount(index: number) {
  const data = localStorage.getItem('user')
  if (!data) {
    console.error('Account not found')
    return null
  }
  const obj = JSON.parse(data)
  return obj[index]
}

export function getAllAccount() {
  const user = localStorage.getItem('user')
  if (!user) {
    console.error('Account not found')
    return null
  }
  const obj = JSON.parse(user)
  return obj
}

export function addAccount({
  access_token,
  cohort,
  remark,
  username,
  nextAlias,
}: {
  access_token: string
  cohort: string
  remark: string
  username: string
  nextAlias: string
}) {
  const userInfo = {
    access_token,
    cohort,
    remark,
    username,
    nextAlias,
  }
  const allUser = getAllAccount()
  if (!allUser) {
    localStorage.setItem('user', JSON.stringify([userInfo]))
    return 0
  } else {
    const obj = JSON.parse(allUser)
    obj.push(userInfo)
    localStorage.setItem('user', JSON.stringify(obj))
    return obj.length - 1
  }
}

export function editAccount(index: number, userInfo: UserInfo) {
  const allUser = getAllAccount()
  const user = allUser[index]
  if (!allUser[index]) {
    console.error('Account not found')
    return false
  }
  allUser[index] = { ...user, ...userInfo }
  localStorage.setItem('user', JSON.stringify(allUser))
  return allUser[index]
}

export function clear() {
  return localStorage.clear()
}
