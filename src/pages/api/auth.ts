import { MongoClient, Db } from 'mongodb';
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
  const user = await collection.findOne({ email, password });

  if (user) {
    res.json({ success: true, user: { email: user.email, role: user.role } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}