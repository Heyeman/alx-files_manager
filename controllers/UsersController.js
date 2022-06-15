import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const postNew = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).send({ error: 'Missing email' });
    return;
  }
  if (!password) {
    res.status(400).send({ error: 'Missing password' });
    return;
  }
  const users = dbClient.db.collection('users');
  const existing = await users.findOne({ email });
  if (existing) {
    res.status(400).send({ error: 'Already exist' });
  } else {
    const hashedPass = await sha1(password);
    try {
      const user = await users.insertOne({ email, password: hashedPass });
      const userData = user.ops[0];
      res.status(201).json({
        id: userData._id,
        email: userData.email,
      });
    } catch (err) {
      console.log('error while saving the data');
    }
  }
};
const getMe = async (req, res) => {
  const token = req.headers['x-token'];
  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) {
    res.status(401).send({ error: 'Unauthorized' });
  } else {
    const User = dbClient.db.collection('users');
    const userExists = await User.findOne({ _id: ObjectId(userId) });
    if (!userExists) {
      res.status(401).send({ error: 'Unauthorized user not found' });
    } else {
      res.send({
        email: userExists.email,
        id: userExists._id,
      });
    }
  }
};
export { postNew, getMe };
