import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard');

async function getCredits(req: NextApiRequest, res: NextApiResponse) {
  await client.connect();
  const db = client.db();
  const credits = db.collection('credits');
  
  const result = await credits.aggregate([
    {
      $lookup: {
        from: 'clients',
        localField: 'clientId',
        foreignField: '_id',
        as: 'clientData'
      }
    },
    {
      $addFields: {
        clientName: { $arrayElemAt: ['$clientData.name', 0] }
      }
    },
    { $sort: { createdAt: -1 } }
  ]).toArray();
  
  res.json(result);
}

async function addCredit(req: NextApiRequest, res: NextApiResponse) {
  await client.connect();
  const db = client.db();
  const credits = db.collection('credits');
  
  const { clientId, amount, type, description } = req.body;
  if (!clientId || !amount || !type) {
    return res.status(400).json({ error: 'Client ID, amount, and type are required' });
  }
  
  const creditData = {
    clientId: new ObjectId(clientId),
    amount: parseFloat(amount),
    type,
    description: description || '',
    createdAt: new Date(),
  };
  
  const result = await credits.insertOne(creditData);
  res.json(result);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getCredits(req, res);
    case 'POST':
      return addCredit(req, res);
    default:
      res.status(405).end();
  }
}