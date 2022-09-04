export default async function generateAddresses(token: string) {
  const init = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  }
  return fetch('/api/generateaddresses', init)
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
