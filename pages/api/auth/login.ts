import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'
import Boom from '@hapi/boom'
import { handler as errHandler } from '../../../lib/apiHandler'
import { login as ddgLogin, getAccessToken } from '../../../lib/ddgEmailApi'

const router = createRouter<NextApiRequest, NextApiResponse>()

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { username, otp } = req.body
  if (!username || !otp) {
    throw Boom.badRequest()
  }
  await ddgLogin(username, otp)
    .then(async (result) => {
      const data = (await result.json()) as {
        status: string
        token: string
        user: string
      }
      if (result.ok) {
        await getAccessToken(data.token).then(async (result) => {
          const data = await result.json()
          if (result.ok) {
            res.status(200).json(data)
          } else {
            res.status(result.status).json({ message: result.statusText })
          }
        })
      } else {
        res.status(result.status).json({ message: result.statusText })
      }
    })
    .catch((err) => {
      console.error(err)
      throw Boom.badImplementation()
    })
}

export default router.post(login).handler(errHandler)
