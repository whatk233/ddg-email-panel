import fetch, { Response } from 'node-fetch'
import { DUCKDUCKGO_API_ENDPOINT } from './constants'

const endpoint = DUCKDUCKGO_API_ENDPOINT

export async function loginRequest(username: string) {
  return new Promise<Response>(function (resolve, reject) {
    fetch(`${endpoint}/auth/loginlink?user=${username}`)
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
    fetch(`${endpoint}/auth/login?otp=${otp}&user=${username}`)
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
