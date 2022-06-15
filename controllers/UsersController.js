<<<<<<< HEAD
import {
  createHash,
} from 'crypto';
import {
  ObjectId,
} from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

/**
 * @class UsersController
 * @description This class handles all authorization related requests
 */
class UsersController {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} user
   * @memberof UsersController
   * @description This method creates a new user
   */
  static async postNew(req, res) {
    const {
      email,
      password,
    } = req.body;
    if (!email) {
      res.status(400).send({
        error: 'Missing email',
      });
      return;
=======
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
>>>>>>> fe17f2462239af5958ed78064f601c5a47559503
    }
    if (!password) {
      res.status(400).send({
        error: 'Missing password',
      });
      return;
    }
    const users = dbClient.db.collection('users');

    // Check if user already exists
    const user = await users.findOne({
      email,
    });
    if (user) {
      res.status(400).send({
        error: 'Already exist',
      });
      return;
    }

    // Add new user
    const hash = createHash('sha1').update(password).digest('hex');
    const newUser = await users.insertOne({
      email,
      password: hash,
    });
    const json = {
      id: newUser.insertedId,
      email,
    };
    res.status(201).send(json);
  }
<<<<<<< HEAD

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} user
   * @description This method retrieves user data based on user based token
   */
  static async getMe(req, res) {
    const authToken = req.header('X-Token') || null;
    if (!authToken) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }
    const token = `auth_${authToken}`;
    const user = await redisClient.get(token);
    if (!user) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }
    const users = dbClient.db.collection('users');
    const userDoc = await users.findOne({
      _id: ObjectId(user),
    });
    if (userDoc) {
      res.status(200).send({
        id: user,
        email: userDoc.email,
      });
=======
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
>>>>>>> fe17f2462239af5958ed78064f601c5a47559503
    } else {
      res.status(401).send({
        error: 'Unauthorized',
      });
    }
  }
}

export default UsersController;
