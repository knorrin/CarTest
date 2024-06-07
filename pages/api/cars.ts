import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('hrTest');
  const { brand, models, page } = req.query;

  const query: any = {};
  if (brand) {
    query.mark = brand;
  }
  if (models) {
    query.model = { $in: models.split(',') };
  }

  const cars = await db.collection('stock')
    .find(query)
    .skip((Number(page) - 1) * 20)
    .limit(20)
    .toArray();

  res.json(cars);
}