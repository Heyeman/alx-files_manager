import { ObjectId } from 'mongodb';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import path from 'path';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const postUpload = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    res.status(401).send({ error: 'Unauthorized' });
  }
  const keyId = await redisClient.get(`auth_${token}`);
  const User = dbClient.db.collection('users');
  const userExists = await User.findOne({ _id: ObjectId(keyId) });
  if (!userExists) {
    res.status(401).send({ error: 'Unauthorized' });
  }
  const {
    name,
    type,

    data,
  } = req.body;
  let {
    parentId,
    isPublic,
  } = req.body;
  if (!name) {
    res.status(400).send({ error: 'Missing name' });
    return;
  }
  if (!type || !['folder', 'file', 'image'].includes(type)) {
    res.status(400).send({ error: 'Missing type' });
    return;
  }
  if (!data && type !== 'folder') {
    res.status(400).send({ error: 'Missing data' });
    return;
  }

  isPublic = isPublic || false;
  parentId = parentId || 0;

  const files = dbClient.db.collection('files');
  const newFile = {
    name,
    type,
    isPublic,
    parentId,
    userId: userExists._id.toString(),
  };
  if (parentId !== 0) {
    const parentFile = await files.findOne({ _id: ObjectId(parentId) });
    if (!parentFile) {
      res.status(400).send({ error: 'Parent not found' });
      return;
    } if (parentFile.type !== 'folder') {
      res.status(400).send({ error: 'Parent is not a folder' });
      return;
    }
  }
  if (type === 'folder') {
    const addDoc = await files.insertOne(newFile);
    newFile.id = newFile._id.toString();
    delete newFile._id;
    console.log('folder sending');
    console.log(newFile);
    res.status(201).send(newFile);
  } else {
    const storagePath = process.env.FOLDER_PATH || '/tmp/files_manager/';
    if (!existsSync(storagePath)) {
      mkdirSync(storagePath, { recursive: true });
    }
    const fileId = uuidv4();
    const filePath = path.join(storagePath, fileId);
    // console.log("======file==", fileId, Buffer.from(data, "base64").toString());
    const newFile = await writeFile(
      filePath,
      Buffer.from(data, 'base64').toString(),
    );

    newFile.localPath = filePath;
    const addDoc = await files.insertOne(newFile);
    newFile.id = newFile._id.toString();
    delete newFile._id;
    res.status(201).send(newFile);
  }
};

export { postUpload };
