import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  
  const { clientId } = req.query;
  
  await client.connect();
  const db = client.db();
  const credits = db.collection('credits');
  
  const transactions = await credits.aggregate([
    { $match: { clientId: new ObjectId(clientId as string) } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: null,
        balance: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'deposit'] },
              '$amount',
              { $multiply: ['$amount', -1] }
            ]
          }
        },
        transactions: { $push: '$$ROOT' }
      }
    }
  ]).toArray();
  
  const result = transactions[0] || { balance: 0, transactions: [] };
  res.json(result);
}