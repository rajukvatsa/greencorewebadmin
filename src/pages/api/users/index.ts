import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');
  const result = await users.aggregate([
    {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'roleData'
      }
    },
    {
      $addFields: {
        roleName: { $arrayElemAt: ['$roleData.name', 0] }
      }
    }
  ]).toArray();
  res.json(result);
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');
  
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const existing = await users.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: 'Email exists' });
  }
  
  const userData = { ...req.body };
  if (userData.role) {
    userData.role = new ObjectId(userData.role);
  }
  
  const result = await users.insertOne(userData);
  res.json(result);
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');
  
  const { id, ...updateData } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'User ID required' });
  }
  
  if (updateData.password === '') {
    delete updateData.password;
  }
  
  if (updateData.role) {
    updateData.role = new ObjectId(updateData.role);
  }
  
  const result = await users.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  if (result.matchedCount === 1) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');
  
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'User ID required' });
  }
  
  const result = await users.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 1) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getUsers(req, res);
    case 'POST':
      return createUser(req, res);
    case 'PUT':
      return updateUser(req, res);
    case 'DELETE':
      return deleteUser(req, res);
    default:
      res.status(405).end();
  }
}