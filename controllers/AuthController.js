import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const getConnect = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader.startsWith('Basic')) {
    res.status(401).send({ error: 'Unauthorized doesnt start with basic' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = Buffer.from(token, 'base64').toString();
  const splitted = decoded.split(':');

  const email = splitted[0];
  const password = splitted[1];
  const User = dbClient.db.collection('users');

  const userExists = await User.findOne({
    email,
    password: await sha1(password),
  });

  if (!userExists) {
    res.status(401).send({ error: 'Unauthorized user doesnt exist' });
  } else {
    const id = uuidv4();
    const strId = userExists._id.toString();

    await redisClient.set(`auth_${id}`, strId, 21);

    res.status(200).send({ token: id });
  }
};
const getDisconnect = async (req, res) => {
  const token = req.headers['X-Token'];
  const userId = await redisClient.get(token);
  const User = dbClient.collection('users');
  const userFound = await User.findOne({ _id: userId });
  if (!userFound) {
    res.status(401).send({ error: 'Unauthorized' });
  } else {
    await redisClient.del(token);
    res.sendStatus(204);
  }
};
export { getConnect, getDisconnect };
