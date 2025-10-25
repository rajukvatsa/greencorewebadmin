import { MongoClient, Db, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'dashboard';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const collection = db.collection('roles');

  // Initialize default Admin role if no roles exist
  const count = await collection.countDocuments();
  if (count === 0) {
    const features = ["Contracts", "Users", "Schedule", "Notifications", "Reports"];
    const defaultAdmin = {
      name: "Admin",
      features: features.reduce((acc, feature) => {
        acc[feature] = { viewOwn: true, viewGlobal: true, create: true, edit: true, delete: true };
        return acc;
      }, {} as any)
    };
    await collection.insertOne(defaultAdmin);
  }

  switch (req.method) {
    case 'GET':
      const roles = await collection.find({}).toArray();
      res.json(roles);
      break;

    case 'POST':
      const newRole = await collection.insertOne(req.body);
      res.json({ id: newRole.insertedId, ...req.body });
      break;

    case 'PUT':
      const { id, ...updateData } = req.body;
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      res.json({ id, ...updateData });
      break;

    case 'DELETE':
      await collection.deleteOne({ _id: new ObjectId(req.body.id) });
      res.json({ success: true });
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}