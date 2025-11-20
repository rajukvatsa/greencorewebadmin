import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const collection = db.collection('users');
  const { id } = req.query;

  if (req.method === 'GET') {
    const user = await collection.aggregate([
      { $match: { _id: new ObjectId(id as string) } },
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
      res.json(user[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}