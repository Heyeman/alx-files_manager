import redisClient from "../utils/redis";
import dbClient from "../utils/db";

const getStatus = (req, res) => {
  const redistatus = redisClient.isAlive();
  const mongoStatus = dbClient.isAlive();
  res.status(200).json({
    redis: redisStatus,
    db: mongoStatus,
  });
};
const getStats = async (req, res) => {
  const nU = await dbClient.nbUsers();

  const nF = await dbClient.nbFiles();
  res.status(200).json({
    users: nU,
    files: nF,
  });
};

export { getStats, getStatus };
