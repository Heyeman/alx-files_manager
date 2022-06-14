import redisClient from "../utils/redis";
import dbClient from "../utils/db";
const postUpload = async (req, res) => {
  const token = req.headers["x-token"];
  if (!token) {
    res.status(401).send({ error: "Unauthorized" });
  }
  const keyId = await redisClient.get(`auth_${token}`),
    User = dbClient.db.collection("users"),
    userExists = User.findById(keyId);
  if (!userExists) {
    res.status(401).send({ error: "Unauthorized" });
  }
  const { name, type } = req.body;
  if (!name) {
    res.status(400).send({ error: "Missing name" });
  }
  if (!type || !["folder", "file", "image"].includes(type)) {
    res.status(400).send({ error: "Missing type" });
  }
  // if()
};

export default postUpload;
