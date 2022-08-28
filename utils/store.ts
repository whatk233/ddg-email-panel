export function getAccount(index: number) {
  const data = localStorage.getItem('user')
  if (!data) throw Error('Account not found')
  const obj = JSON.parse(data)
  return obj[index]
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
  const user = {
    access_token,
    cohort,
    remark,
    username,
    nextAlias,
  }
  const data = localStorage.getItem('user')
  if (!data) {
    localStorage.setItem('user', JSON.stringify([user]))
    return 0
  } else {
    const obj = JSON.parse(data)
    obj.push(user)
    localStorage.setItem('user', JSON.stringify(obj))
    return obj.length - 1
  }
}

export function clear() {
  return localStorage.clear()
}
