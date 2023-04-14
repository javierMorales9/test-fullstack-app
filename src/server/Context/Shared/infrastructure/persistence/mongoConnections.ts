import * as mongoose from 'mongoose';

export function connectMongo() {
  mongoose.set('strictQuery', false);
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) throw new Error('MONGO_URL is not defined');

  const connection = mongoose.connect(mongoUrl);

  console.log('Connected to Mongo');
  return connection;
}
