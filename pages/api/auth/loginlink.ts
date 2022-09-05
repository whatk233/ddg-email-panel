import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'
import Boom from '@hapi/boom'
import { handler as errHandler } from '../../../lib/apiHandler'
import { loginRequest } from '../../../lib/ddgEmailApi'

const router = createRouter<NextApiRequest, NextApiResponse>()

async function loginLink(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.body
  await loginRequest(username)
    .then((result) => {
      if (result.ok) {
        res.status(200).json({ message: 'success' })
      } else {
        res.status(result.status).json({ message: result.statusText })
      }
    })
    .catch((err) => {
      console.error(err)
      throw Boom.badImplementation()
    })
}

export default router.post(loginLink).handler(errHandler)
