import sha1 from "sha1";
import dbClient from "../utils/db";
import redisClient from "../utils/redis";
import { v4 as uuidv4 } from "uuid";
const getConnect = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader.startsWith("Basic")) {
    res.status(401).send({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1],
    decoded = Buffer.from(token, "base64").toString().split(":"),
    email = decoded[0],
    password = decoded[1],
    User = dbClient.db.collection("users"),
    userExists = await User.findOne({ email, password: await sha1(password) });

  if (!userExists) {
    res.status(401).send({ error: "Unauthorized" });
  } else {
    const id = uuidv4();
    await redisClient.set(`auth_${id}`, user._id, {
      Ex: 24 * 3600,
    });
    res.status(200).send({ token: id });
  }
};
const getDisconnect = async (req, res) => {
  const token = req.headers["X-Token"];
  const userId = await redisClient.get(token),
    User = dbClient.collection("users");
  const userFound = await User.findOne({ _id: userId });
  if (!userFound) {
    res.status(401).send({ error: "Unauthorized" });
  } else {
    await redisClient.del(token);
    res.sendStatus(204);
  }
};
export { getConnect, getDisconnect };
