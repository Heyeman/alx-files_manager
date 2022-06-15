import { ObjectId } from 'mongodb';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import path from 'path';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const postUpload = async (req, res) => {
  const token = req.headers['x-token'],
    userId = await redisClient.get(`auth_${token}`)
  if (!userId) {
    res.status(401).send({ error: "Unauthorized" })
    return
    }
  const user = await dbClient.findOne({ _id: ObjectId(userId) })
  if (!user) {
    res.status(401).send({ error: "Unauthorized" })
    return
  }
  const {
    name,
    type,
    data
  } = req.body;
  let parentId = req.body.parentId || 0,
    isPublic = req.body.isPublic || false,
    acceptedTypes = ['file', 'image', 'folder'];
  
  if (!name) {
    res.status(400).send({ error: "Missing name" })
    return
  }
  
  if (!type || !acceptedTypes.includes(type)) {
    res.status(400).send({ error: "Missing type" })
    return
  }
  if (!data && data !== 'folder') {
    res.status(400).send({ error: "Missing data" })
    return
  }
  


res.send(200).send('sth')





};

export { postUpload };
