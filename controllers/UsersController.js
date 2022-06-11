import sha1 from "sha1";
import dbClient from "../utils/db";

const postNew = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).send({ error: "Missing email" });
  }
  if (!password) {
    res.status(400).send({ error: "Missing password" });
  }
  const users = dbClient.db.collection("users");
  const existing = await users.findOne({ email });
  if (existing) {
    res.status(400).send({ error: "Already exist" });
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
      console.log("error while saving the data");
    }
  }
};
const getMe = async (req, res) => {
  const token = req.headers["X-Token"];
  const userId = await redisClient.get(token),
    User = dbClient.collection("users");
  const userFound = await User.findOne({ _id: userId });
  if (!userFound) {
    res.status(401).send({ error: "Unauthorized" });
  } else {
    res.send({ email: userFound.email, id: _id });
  }
};
export { postNew, getMe };
