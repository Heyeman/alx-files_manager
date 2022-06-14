import { ObjectId } from "mongodb";
import { existsSync, mkdirSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import dbClient from "../utils/db";
import redisClient from "../utils/redis";
import { writeFile } from "fs/promises";
const postUpload = async (req, res) => {
  const token = req.headers["x-token"];
  if (!token) {
    res.status(401).send({ error: "Unauthorized" });
  }
  const keyId = await redisClient.get(`auth_${token}`);
  const User = dbClient.db.collection("users");
  const userExists = await User.findOne({ _id: ObjectId(keyId) });
  if (!userExists) {
    res.status(401).send({ error: "Unauthorized" });
  }
  const { name, type, data } = req.body;
  if (!name) {
    res.status(400).send({ error: "Missing name" });
  }
  if (!type || !["folder", "file", "image"].includes(type)) {
    res.status(400).send({ error: "Missing type" });
  }
  if (!data && type !== "folder") {
    res.status(400).send({ error: "Missing data" });
  }
  let parentId;
  if (req.body.parentId) {
    parentId = req.body.parentId;
  } else {
    parentId = 0;
  }

  const isPublic = req.body.isPublic ? req.body.isPublic : false;
  const files = dbClient.db.collection("files");

  if (parentId !== 0) {
    const parentFile = await files.findOne({ _id: ObjectId(parentId) });
    if (!parentFile) {
      res.status(400).send({ error: "Parent not found" });
      return;
    } else if (parentFile.type !== "folder") {
      res.status(400).send({ error: "Parent is not a folder" });
      return;
    }
  }
  if (type === "folder") {
    const addDoc = await files.insertOne({
      name,
      type,
      isPublic,
      parentId,
      userId: userExists._id,
    });
    res.status(201).json(addDoc.ops[0]);
  } else {
    const storagePath = process.env.FOLDER_PATH || "/tmp/files_manager/";
    if (!existsSync(storagePath)) {
      mkdirSync(storagePath, { recursive: true });
    }
    const fileId = uuidv4();
    console.log("======file==", fileId, Buffer.from(data, "base64").toString());
    const newFile = await writeFile(
      storagePath + fileId,
      Buffer.from(data, "base64").toString()
    );

    const addDoc = await files.insertOne({
      name,
      type,
      isPublic,
      parentId,
      userId: userExists._id,
      localPath: storagePath + fileId,
    });
    res.status(201).send({
      id: addDoc._id,
      userId: addDoc.userId,
      name,
      type,
      isPublic,
      parentId,
      localPath: addDoc.localPath,
    });
  }
};

export { postUpload };
