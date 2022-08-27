import type { NextApiRequest, NextApiResponse } from 'next'
import Boom from '@hapi/boom'
import apiHandler, { handler as errHandler } from '../../lib/apiHandler'
import { generateAddresses } from '../../lib/ddgEmailApi'

async function generate(req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers
  if (!authorization || !authorization.includes('Bearer ')) {
    throw Boom.unauthorized()
  }
  const token = authorization.replace('Bearer ', '')
  await generateAddresses(token)
    .then(async (result) => {
      const data = (await result.json()) as {
        address: string
      }
      if (result.ok) {
        res.status(200).json(data)
      } else {
        res.status(result.status).json({ message: result.statusText })
      }
    })
    .catch((err) => {
      console.error(err)
      throw Boom.badImplementation()
    })
}

export default apiHandler.post(generate).handler(errHandler)
