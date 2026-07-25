import mongoose from 'mongoose';
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/hotels';
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on('connected', () => {
  console.log('MongoDB connected');
});
db.on('error',  (err) => {
  console.error.bind(console, 'MongoDB connection error:')(err);
});
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
export default db;
