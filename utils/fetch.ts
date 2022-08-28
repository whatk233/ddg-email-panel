export default async function myFetch(url: string, init: object) {
  init = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  }
  return fetch(url, init)
    .then(async (res) => {
      if (res.ok) {
        return res.json()
      }
      throw res
    })
    .catch((err) => {
      throw err
    })
}
