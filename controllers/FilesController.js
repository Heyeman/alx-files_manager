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
  const users = dbClient.db.collection('users')
  const user = await users.findOne({ _id: ObjectId(userId) })
  if (!user) {
    res.status(401).send({ error: "Unauthorized" })
    return
  }
  const {
    name,
    type,
    data
  } = req.body;
  let parentId = req.body.parentId,
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
  if (!data && type !== 'folder') {
    res.status(400).send({ error: "Missing data" })
    return
  }
  const files = dbClient.db.collection('files');
  
  if (parentId) {
    const fileParent = await files.findOne({ _id: ObjectId(parentId) })
    if (!fileParent) {
      res.status(400).send({ error: "Parent not found" })
      return
    }
    else if (fileParent.type !== "folder") {
      res.status(400).send({ error: "Parent is not a folder" })
      return
    }
    
  }
  parentId = parentId || 0;
  const fileInfo = {
    name, 
    type,
    userId,
    parentId,
    isPublic,
  }
  if (type === 'folder') {
    const addFile = await files.insertOne(fileInfo)
    fileInfo.id = fileInfo._id.toString();
    delete fileInfo._id
    console.log("file", fileInfo)
    res.status(201).json(fileInfo);
    return 

  }

res.send(200).send('sth')





};

export { postUpload };
