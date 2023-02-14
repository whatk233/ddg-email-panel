import { DUCKDUCKGO_API_ENDPOINT, DUCKDUCKGO_API_USERAGENT } from './constants'

const endpoint = DUCKDUCKGO_API_ENDPOINT
const fetchInit = { headers: { 'User-Agent': DUCKDUCKGO_API_USERAGENT } }

export async function loginRequest(username: string) {
  return new Promise<Response>(function (resolve, reject) {
    fetch(`${endpoint}/auth/loginlink?user=${username}`, fetchInit)
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export async function login(username: string, otp: string) {
  otp = otp.trim().replace(/\s/g, '+')
  return new Promise<Response>(function (resolve, reject) {
    fetch(`${endpoint}/auth/login?otp=${otp}&user=${username}`, fetchInit)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export async function getAccessToken(token: string) {
  return new Promise<Response>(function (resolve, reject) {
    fetch(`${endpoint}/email/dashboard`, {
      ...fetchInit,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export async function generateAddresses(token: string) {
  return new Promise<Response>(function (resolve, reject) {
    fetch(`${endpoint}/email/addresses`, {
      ...fetchInit,
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
