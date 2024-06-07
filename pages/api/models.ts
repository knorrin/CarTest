import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('hrTest');
  const { brand } = req.query;

  if (!brand) {
    return res.status(400).json({ error: 'Brand is required' });
  }

  const models = await db.collection('stock').aggregate([
    { $match: { mark: brand } },
    { $group: { _id: '$model' } },
    { $sort: { _id: 1 } }
  ]).toArray();

  res.json(models);
}