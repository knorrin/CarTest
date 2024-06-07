import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const db = client.db('hrTest')

  const brands = await db
    .collection('stock')
    .aggregate([{ $group: { _id: '$mark', count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
    .toArray()

  res.json(brands)
}
