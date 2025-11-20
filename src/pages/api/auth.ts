import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { db } = await connectToDatabase();
  const collection = db.collection('users');

  // Create default admin user if no users exist
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertOne({
      email: 'admin@gmail.com',
      password: '123456',
      role: 'Admin'
    });
  }

  const { email, password } = req.body;
  const user = await collection.aggregate([
    { $match: { email, password } },
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
        effectivePermissions: {
          $cond: {
            if: { $ifNull: ['$permissions', false] },
            then: '$permissions',
            else: { $arrayElemAt: ['$roleData.features', 0] }
          }
        },
        roleName: { $arrayElemAt: ['$roleData.name', 0] }
      }
    }
  ]).toArray();

  if (user.length > 0) {
    const userData = {
      _id: user[0]._id.toString(),
      email: user[0].email,
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      role: user[0].roleName,
      permissions: user[0].effectivePermissions || {}
    };
    res.json({ success: true, user: userData });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}