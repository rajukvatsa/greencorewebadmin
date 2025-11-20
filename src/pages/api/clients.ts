import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

async function getClients(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const clients = db.collection('clients');
  const result = await clients.find({}).toArray();
  res.json(result);
}

async function createClient(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const clients = db.collection('clients');
  
  const { name, vatNumber, phone, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const result = await clients.insertOne(req.body);
  res.json(result);
}

async function updateClient(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const clients = db.collection('clients');
  
  const { id, ...updateData } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Client ID required' });
  }
  
  const result = await clients.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  if (result.matchedCount === 1) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Client not found' });
  }
}

async function deleteClient(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const clients = db.collection('clients');
  
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Client ID required' });
  }
  
  const result = await clients.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 1) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Client not found' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getClients(req, res);
    case 'POST':
      return createClient(req, res);
    case 'PUT':
      return updateClient(req, res);
    case 'DELETE':
      return deleteClient(req, res);
    default:
      res.status(405).end();
  }
}