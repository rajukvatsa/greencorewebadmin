import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard');

export interface AuthenticatedUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: {
    [feature: string]: {
      viewOwn: boolean;
      viewGlobal: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

export async function getAuthenticatedUser(email: string): Promise<AuthenticatedUser | null> {
  await client.connect();
  const db = client.db();
  const users = db.collection('users');
  
  const user = await users.aggregate([
    { $match: { email } },
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
  
  if (user.length === 0) return null;
  
  return {
    _id: user[0]._id.toString(),
    email: user[0].email,
    firstName: user[0].firstName,
    lastName: user[0].lastName,
    role: user[0].roleName,
    permissions: user[0].effectivePermissions || {}
  };
}

export function hasPermission(user: AuthenticatedUser, feature: string, action: string): boolean {
  const featurePermissions = user.permissions[feature];
  if (!featurePermissions) return false;
  
  return featurePermissions[action as keyof typeof featurePermissions] || false;
}